import { useEffect, useRef, useState } from 'react';
import { Sparkles, Flame, Volume2, VolumeX } from 'lucide-react';
import { CircularStamp, CornerBracket } from '../decor';
import { createPortal } from 'react-dom';

// ============================================================
// SOUND EFFECT "TANDA TANGAN" & "HEALTHBAR POWER-UP"
// (dibuat langsung dengan Web Audio, tanpa file audio eksternal).
// ============================================================
// --- AUDIO START ---
// Karakter suara: santai & hangat. Tanpa goresan tajam atau bunyi 8-bit.
// Terdiri dari goresan kuas yang sangat halus, denting lonceng lembut
// pada tangga nada pentatonik C, dan akord penutup yang pelan.
const SIGN_TOTAL = 5.8; // detik, setelah ini tidak ada suara lagi
const SETTLE_AT = 5.2;  // saat siku frame muncul: akord penutup lembut
const SWOOSH_AT = 5.5;  // hembusan halus di ujung tanda tangan

// Seberapa pelan goresan pena (kuas di atas kertas)
const BRUSH_SOFTNESS = 0.22;

const SIGN_SEGMENTS = [
  { start: 0.2, dur: 0.8, kind: 'marker', gain: 0.16 }, // 2026
  { start: 0.4, dur: 2.4, kind: 'glide', gain: 0.07 }, // garis elips
  { start: 0.6, dur: 1.2, kind: 'bold', gain: 0.30 }, // PORT
  { start: 1.5, dur: 1.8, kind: 'marker', gain: 0.26 }, // FOLIO
  { start: 2.2, dur: 1.2, kind: 'glide', gain: 0.08 }, // garis diagonal
  { start: 3.1, dur: 1.0, kind: 'quick', gain: 0.17 }, // subjudul
  { start: 4.2, dur: 1.3, kind: 'gel', gain: 0.20 }, // tanda tangan
];

// Frekuensi rendah & Q kecil = bisikan kuas, bukan gesekan tajam
const STROKE = {
  bold: { f: [500, 1000], q: 0.6, len: [0.14, 0.26], gap: [0.04, 0.09], body: 0 },
  marker: { f: [600, 1200], q: 0.6, len: [0.12, 0.28], gap: [0.04, 0.10], body: 0 },
  quick: { f: [800, 1500], q: 0.7, len: [0.08, 0.16], gap: [0.03, 0.06], body: 0 },
  gel: { f: [900, 1700], q: 0.7, len: [0.20, 0.40], gap: [0.03, 0.07], body: 0 },
  glide: { f: [700, 1300], q: 0.5, len: [0.50, 0.90], gap: [0.00, 0.05], body: 0 },
};

// Denting lonceng yang naik pelan mengikuti tiap elemen yang muncul (C5 - E5 - G5 - A5 - C6)
const SIGN_CHIMES = [
  { at: 0.25, f: 523.25 }, // 2026
  { at: 0.65, f: 659.25 }, // PORT
  { at: 1.55, f: 783.99 }, // FOLIO
  { at: 3.15, f: 880.0 },  // subjudul
  { at: 4.25, f: 1046.5 }, // tanda tangan
];

// Tangga nada pentatonik C untuk 12 balok healthbar
const HEALTH_SCALE = [
  261.63, 293.66, 329.63, 392.0, 440.0, 523.25,
  587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66,
];

const rand = (a, b) => a + Math.random() * (b - a);

function makeNoise(ctx) {
  const size = Math.floor(ctx.sampleRate * 2);
  const buf = ctx.createBuffer(1, size, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

// Satu goresan pena = noise yang disaring dengan awal & akhir yang lembut
function playStroke(ctx, out, buf, when, len, cfg, gain) {
  if (len < 0.03) return;
  const f0 = rand(cfg.f[0], cfg.f[1]);

  const src = ctx.createBufferSource();
  src.buffer = buf;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.Q.value = cfg.q;
  bp.frequency.setValueAtTime(f0, when);
  bp.frequency.linearRampToValueAtTime(f0 * rand(0.85, 1.2), when + len);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, when);
  g.gain.linearRampToValueAtTime(gain, when + Math.min(0.06, len * 0.4));
  g.gain.linearRampToValueAtTime(gain * rand(0.6, 0.9), when + len * 0.7);
  g.gain.linearRampToValueAtTime(0.0001, when + len);
  src.connect(bp);
  bp.connect(g);
  g.connect(out);
  src.start(when, rand(0, 1));
  src.stop(when + len + 0.05);
}

// Lonceng lembut: nada dasar + dua overtone pelan yang meredup lebih cepat
function playBell(ctx, out, when, freq, gain = 0.05, dur = 1.4) {
  [
    [1, 1],
    [2.01, 0.28],
    [3.0, 0.1],
  ].forEach(([mult, amp]) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const d = dur / mult;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * mult, when);
    g.gain.setValueAtTime(0.0001, when);
    g.gain.linearRampToValueAtTime(gain * amp, when + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, when + d);
    osc.connect(g);
    g.connect(out);
    osc.start(when);
    osc.stop(when + d + 0.05);
  });
}

// Hembusan udara halus di ujung tanda tangan
function playSwoosh(ctx, out, buf, when) {
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.Q.value = 0.6;
  bp.frequency.setValueAtTime(500, when);
  bp.frequency.exponentialRampToValueAtTime(1600, when + 0.5);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, when);
  g.gain.linearRampToValueAtTime(0.035, when + 0.2);
  g.gain.linearRampToValueAtTime(0.0001, when + 0.55);
  src.connect(bp);
  bp.connect(g);
  g.connect(out);
  src.start(when, rand(0, 1));
  src.stop(when + 0.6);
}

// Ketukan lembut saat tombol "PRESS TO ENTER" ditekan (sengaja tanpa klik tajam)
function playStamp(ctx, out, _buf, when) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(300, when);
  osc.frequency.exponentialRampToValueAtTime(160, when + 0.12);
  g.gain.setValueAtTime(0.0001, when);
  g.gain.linearRampToValueAtTime(0.14, when + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, when + 0.2);
  osc.connect(g);
  g.connect(out);
  osc.start(when);
  osc.stop(when + 0.22);
}

// Akord penutup yang pelan saat siku frame muncul (C5 - E5 - G5 + nada rendah hangat)
function playSettle(ctx, out, when) {
  playBell(ctx, out, when, 130.81, 0.06, 1.6);
  [523.25, 659.25, 783.99].forEach((f, i) => {
    playBell(ctx, out, when + 0.05 + i * 0.07, f, 0.04, 2.0);
  });
}

// (bunyi asli healthbar dipertahankan)
function playHealthTick(ctx, stepIndex, totalSteps) {
  if (!ctx || ctx.state !== 'running') return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();

  // Nada naik bertahap sesuai progres healthbar
  const baseFreq = 240 + (stepIndex / totalSteps) * 520;
  osc.type = 'square';
  osc.frequency.setValueAtTime(baseFreq, now);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.18, now + 0.055);

  g.gain.setValueAtTime(0.0001, now);
  g.gain.linearRampToValueAtTime(0.075, now + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.065);

  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.07);
}

// (bunyi asli healthbar dipertahankan)
function playHealthFull(ctx) {
  if (!ctx || ctx.state !== 'running') return;
  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const start = now + idx * 0.045;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, start);

    g.gain.setValueAtTime(0.0001, start);
    g.gain.linearRampToValueAtTime(0.14, start + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, start + 0.22);

    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.24);
  });
}

// Jadwalkan seluruh suara tanda tangan
function scheduleSignSound(ctx, elapsed = 0) {
  const out = ctx.createGain();
  out.gain.value = 0.8;
  const comp = ctx.createDynamicsCompressor();
  out.connect(comp);
  comp.connect(ctx.destination);

  const buf = makeNoise(ctx);
  const base = ctx.currentTime;

  SIGN_SEGMENTS.forEach((seg) => {
    const cfg = STROKE[seg.kind];
    const end = seg.start + seg.dur;
    let t = seg.start;
    while (t < end - 0.03) {
      const len = Math.min(rand(cfg.len[0], cfg.len[1]), end - t);
      if (t + len > elapsed) {
        const skip = Math.max(0, elapsed - t);
        playStroke(
          ctx,
          out,
          buf,
          base + Math.max(0, t - elapsed),
          len - skip,
          cfg,
          seg.gain * BRUSH_SOFTNESS
        );
      }
      t += len + rand(cfg.gap[0], cfg.gap[1]);
    }
  });

  SIGN_CHIMES.forEach((c) => {
    if (c.at > elapsed) playBell(ctx, out, base + (c.at - elapsed), c.f, 0.05, 1.5);
  });

  if (SWOOSH_AT > elapsed) playSwoosh(ctx, out, buf, base + (SWOOSH_AT - elapsed));
  if (SETTLE_AT > elapsed) playSettle(ctx, out, base + (SETTLE_AT - elapsed));
}
// --- AUDIO END ---

// ============================================================
// INTRO SEKALI SAJA: gate, healthbar, dan suara hanya berjalan saat website pertama kali dibuka/di-reload. Pindah-pindah halaman tidak mengulang suara atau intro.
// ============================================================
// Hanya di memori: reload / buka ulang website = modul dimuat ulang = gate muncul lagi.
// Pindah-pindah halaman di dalam SPA tidak memuat ulang modul, jadi intro tidak berulang.
let introSeenInMemory = false;
function readIntroSeen() { return introSeenInMemory; }
function markIntroSeen() { introSeenInMemory = true; }

const TOTAL_HP_SEGMENTS = 12;

// 1. HERO SECTION (PORTFOLIO 2026) dengan Gate -> Doodle Healthbar Loading -> Animasi Tanda Tangan
export default function Hero() {
  const AudioCtx = typeof window !== 'undefined' ? window.AudioContext || window.webkitAudioContext : null;

  const [soundOn, setSoundOn] = useState(() => {
    try {
      return localStorage.getItem('signSfx') !== 'off';
    } catch {
      return true;
    }
  });

  // phase: 'checking' | 'gate' | 'loading' | 'playing'
  // Intro (gate + healthbar + suara) hanya sekali per sesi tab; kunjungan berikutnya langsung 'playing'
  const [introSeen] = useState(readIntroSeen);
  const [phase, setPhase] = useState(
    introSeen || !soundOn || !AudioCtx ? 'playing' : 'checking'
  );
  const [hpProgress, setHpProgress] = useState(0);
  const ctxRef = useRef(null);
  const startRef = useRef(0);
  const lastSegmentRef = useRef(0);

  const saveSound = (on) => {
    try {
      localStorage.setItem('signSfx', on ? 'on' : 'off');
    } catch {
      /* abaikan */
    }
  };

  // Cek apakah browser sudah mengizinkan suara tanpa klik
  useEffect(() => {
    if (phase !== 'checking') return;
    let cancelled = false;
    let used = false;
    const ctx = new AudioCtx();

    const decide = () => {
      if (cancelled) return;
      if (ctx.state === 'running') {
        used = true;
        ctxRef.current = ctx;
        scheduleSignSound(ctx, 0);
        setPhase('playing');
      } else {
        ctx.close().catch(() => { });
        setPhase('gate');
      }
    };

    if (ctx.state === 'running') {
      decide();
    } else {
      ctx.resume().catch(() => { });
      setTimeout(decide, 250);
    }

    return () => {
      cancelled = true;
      if (!used) ctx.close().catch(() => { });
    };
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // Jalankan pengisian Doodle Healthbar saat berada di phase 'loading'
  // Jalankan pengisian Doodle Healthbar saat berada di phase 'loading'
  useEffect(() => {
    if (phase !== 'loading') return;

    setHpProgress(0);
    lastSegmentRef.current = 0;
    const duration = 1600; // Diperlambat menjadi 2.6 detik agar detail doodle terlihat jelas
    const startTime = performance.now();
    let rafId = null;
    let finishTimer = null;

    const tick = (now) => {
      const elapsed = now - startTime;
      const rawRatio = Math.min(1, elapsed / duration);
      // Kurva sedikit melambat di tengah lalu ngebut di akhir (gaya game arcade)
      const eased =
        rawRatio < 0.5
          ? 2 * rawRatio * rawRatio
          : 1 - Math.pow(-2 * rawRatio + 2, 2) / 2;

      const nextPct = Math.round(eased * 100);
      setHpProgress(nextPct);

      const currentSeg = Math.floor((nextPct / 100) * TOTAL_HP_SEGMENTS);
      if (currentSeg > lastSegmentRef.current) {
        lastSegmentRef.current = currentSeg;
        if (soundOn && ctxRef.current) {
          playHealthTick(ctxRef.current, currentSeg, TOTAL_HP_SEGMENTS);
        }
      }

      if (rawRatio < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        if (soundOn && ctxRef.current) {
          playHealthFull(ctxRef.current);
        }
        // Tahan sedikit lebih lama (650ms) saat mencapai 100% MAX HP!!
        finishTimer = setTimeout(() => {
          if (soundOn && ctxRef.current) {
            scheduleSignSound(ctxRef.current, 0);
          }
          setPhase('playing');
        }, 400);
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (finishTimer) clearTimeout(finishTimer);
    };
  }, [phase, soundOn]);

  // Catat kapan animasi tanda tangan mulai
  useEffect(() => {
    if (phase === 'playing') {
      startRef.current = performance.now();
      markIntroSeen();
    }
  }, [phase]);

  // Kunci scroll selama layar gate atau loading tampil
  useEffect(() => {
    if (phase === 'playing') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);

  // Hentikan suara saat pindah halaman
  useEffect(() => {
    return () => {
      if (ctxRef.current) ctxRef.current.close().catch(() => { });
    };
  }, []);

  // State Tombol "PRESS TO ENTER"
  const [pressed, setPressed] = useState(false);
  const [smashing, setSmashing] = useState(false);
  const activeDown = pressed || smashing;
  const gateRef = useRef(null);

  // Fokuskan tombol supaya bisa langsung Enter / Spasi
  useEffect(() => {
    if (phase === 'gate' && gateRef.current) gateRef.current.focus();
  }, [phase]);

  // Listener global tombol Enter saat di layar gate
  useEffect(() => {
    if (phase !== 'gate') return;
    const handleGlobalKey = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        smashEnter();
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  });

  // Trigger saat tombol ditekan atau Enter ditekan -> Masuk ke Doodle Healthbar Loading
  const smashEnter = () => {
    if (smashing || phase !== 'gate') return;
    setSmashing(true);

    if (AudioCtx && soundOn) {
      const ctx = new AudioCtx();
      ctx.resume().catch(() => { });
      const out = ctx.createGain();
      out.gain.value = 0.9;
      out.connect(ctx.destination);
      playStamp(ctx, out, makeNoise(ctx), ctx.currentTime + 0.01);
      ctxRef.current = ctx;
    }

    setTimeout(() => {
      setSmashing(false);
      setPhase('loading');
    }, 240);
  };

  const skipSound = () => {
    setSoundOn(false);
    saveSound(false);
    setPhase('loading');
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    saveSound(next);

    if (!next) {
      if (ctxRef.current) ctxRef.current.close().catch(() => { });
      ctxRef.current = null;
    } else if (AudioCtx) {
      const elapsed = (performance.now() - startRef.current) / 1000;
      if (elapsed < SIGN_TOTAL) {
        const ctx = new AudioCtx();
        ctx.resume().catch(() => { });
        ctxRef.current = ctx;
        scheduleSignSound(ctx, elapsed);
      }
    }
  };

  const filledSegments = Math.round((hpProgress / 100) * TOTAL_HP_SEGMENTS);

  const getLoadingStatusText = () => {
    if (hpProgress < 35) return 'SKETCHING DOODLE ASSETS...';
    if (hpProgress < 75) return 'CHARGING BRUTALIST INK...';
    if (hpProgress < 100) return 'INITIALIZING SIGNATURE...';
    return 'MAX HP! READY TO ROCK!!';
  };

  return (
    <section className="relative pt-14 pb-24 md:py-28 flex flex-col items-center justify-center text-center select-none">

      {/* Portal Layar Gate & Doodle Healthbar Loading */}
      {phase !== 'playing' &&
        createPortal(
          <div
            className={`fixed inset-0 z-[60] flex flex-col items-center justify-center gap-7 px-6 text-center transition-colors duration-200 ${smashing ? 'bg-[#ff1e56]' : 'bg-[#0c0c0c]'
              }`}
          >
            {/* ==================== PHASE 1: GATE ==================== */}
            {phase === 'gate' && (
              <>
                <span
                  className={`font-marker text-2xl sm:text-3xl -rotate-3 transition-colors ${smashing ? 'text-black' : 'text-white/80'
                    }`}
                >
                  Maulana Al Ghifari
                </span>

                {/* TOMBOL MEKANIK "PRESS TO ENTER" */}
                <div
                  ref={gateRef}
                  role="button"
                  tabIndex={0}
                  aria-label="Tekan untuk masuk ke portofolio"
                  onMouseDown={() => setPressed(true)}
                  onMouseUp={() => setPressed(false)}
                  onMouseLeave={() => setPressed(false)}
                  onTouchStart={() => setPressed(true)}
                  onTouchEnd={() => setPressed(false)}
                  onClick={smashEnter}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      smashEnter();
                    }
                  }}
                  className={`group relative w-full max-w-md bg-[#e6e6e6] border-[3px] border-[#0c0c0c] p-5 sm:p-6 cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-white/50 transition-all duration-75 ${activeDown
                    ? 'translate-x-[3px] translate-y-[3px] shadow-[3px_3px_0_#ff1e56] bg-[#dcdcdc]'
                    : 'shadow-[8px_8px_0_#ff1e56] hover:bg-white hover:-translate-y-1'
                    }`}
                >
                  {/* Baut sudut */}
                  <span className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-zinc-500 border border-black" />
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-zinc-500 border border-black" />
                  <span className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-zinc-500 border border-black" />
                  <span className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-zinc-500 border border-black" />

                  <div className="flex items-center justify-between gap-4">
                    {/* Teks kiri */}
                    <div className="flex flex-col gap-1.5 text-left">
                      <span className="font-mono font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 mb-1">
                        <span
                          className={`w-2.5 h-2.5 rounded-full border border-[#0c0c0c] transition-colors duration-75 ${activeDown
                            ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]'
                            : 'bg-[#ff1e56] animate-pulse'
                            }`}
                        />
                        <span className={activeDown ? 'text-emerald-700' : 'text-[#ff1e56]'}>
                          {activeDown ? 'ENTERING...' : 'SOUND READY'}
                        </span>
                      </span>
                      <span className="font-display font-black text-3xl sm:text-4xl text-[#0c0c0c] uppercase tracking-tighter leading-[0.88]">
                        PRESS
                        <br />
                        TO ENTER
                      </span>
                    </div>

                    {/* Mekanisme tombol 3D */}
                    <div className="relative w-24 h-24 flex items-center justify-center shrink-0 scale-110">
                      {!activeDown && (
                        <div className="absolute inset-x-3 bottom-2 h-[68px] rounded-full bg-[#ff1e56]/40 animate-ping" />
                      )}
                      <div
                        className={`absolute inset-x-1 bottom-0 h-20 rounded-full bg-[#9ea3a8] border-[3px] border-[#0c0c0c] transition-shadow duration-75 ${activeDown
                          ? 'shadow-[0_2px_0_#0c0c0c]'
                          : 'shadow-[0_7px_0_#0c0c0c,0_12px_18px_rgba(0,0,0,0.45)]'
                          }`}
                      />
                      <div className="absolute inset-x-2.5 bottom-1.5 h-[68px] rounded-full bg-[#18181b] border-2 border-[#0c0c0c]" />
                      <div
                        className={`absolute inset-x-3 bottom-2.5 rounded-full bg-[#7a001e] border-x-[3px] border-b-[3px] border-[#0c0c0c] transition-all duration-75 ease-out ${activeDown ? 'h-[58px]' : 'h-[72px]'
                          }`}
                      />
                      <div
                        className={`relative z-10 w-[72px] h-[64px] rounded-full bg-[#ff1e56] border-[3px] border-[#0c0c0c] flex items-center justify-center transition-all duration-75 ease-out ${activeDown
                          ? 'translate-y-[9px] bg-[#e01145] shadow-[inset_0_4px_8px_rgba(0,0,0,0.55)] scale-[0.97]'
                          : '-translate-y-[5px] group-hover:-translate-y-[7px] shadow-[inset_0_-7px_0_#b8002e,inset_0_4px_0_rgba(255,255,255,0.45)]'
                          }`}
                      >
                        <div className="absolute top-1.5 left-3.5 w-6 h-2 bg-white/35 rounded-full -rotate-12 pointer-events-none" />
                        <Volume2
                          className={`w-7 h-7 text-white transition-transform duration-75 ${activeDown ? 'scale-90 translate-y-0.5' : ''
                            }`}
                          strokeWidth={3}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <span className="font-sans-tech text-[11px] uppercase tracking-[0.3em] text-neutral-500">
                  atau tekan Enter
                </span>

                <button
                  onClick={skipSound}
                  className="-mt-3 font-sans-tech text-xs uppercase tracking-widest text-neutral-500 hover:text-white underline underline-offset-4 transition-colors"
                >
                  Masuk tanpa suara
                </button>
              </>
            )}

            {/* ==================== PHASE 2: DOODLE HEALTHBAR LOADING ==================== */}
            {phase === 'loading' && (
              <div className="relative w-full max-w-lg flex flex-col items-center justify-center px-2 select-none">
                {/* Doodle Bintang & Petir Melayang di Atas Healthbar */}
                <div className="w-full flex items-end justify-between px-2 mb-3">
                  <div className="flex items-center gap-2 -rotate-3">
                    {/* Ikon Hati Doodle Grunge dengan Mata X X */}
                    <div className="relative w-11 h-11 flex items-center justify-center">
                      <svg
                        viewBox="0 0 64 64"
                        className={`w-11 h-11 overflow-visible transition-transform duration-150 ${hpProgress === 100 ? 'scale-125' : 'scale-100'
                          }`}
                      >
                        {/* Bayangan kasar di belakang hati */}
                        <path
                          d="M32 56 C32 56 8 40 8 21 C8 11 16 6 24 6 C29 6 32 10 32 14 C32 10 35 6 40 6 C48 6 56 11 56 21 C56 40 32 56 32 56 Z"
                          fill="#0c0c0c"
                          stroke="#ffffff"
                          strokeWidth="3"
                          transform="translate(3, 3)"
                        />
                        {/* Bentuk utama hati merah */}
                        <path
                          d="M32 56 C32 56 8 40 8 21 C8 11 16 6 24 6 C29 6 32 10 32 14 C32 10 35 6 40 6 C48 6 56 11 56 21 C56 40 32 56 32 56 Z"
                          fill="#ff1e56"
                          stroke="#ffffff"
                          strokeWidth="3"
                          strokeLinejoin="round"
                        />
                        {/* Mata X X khas doodle streetwear */}
                        <path
                          d="M19 19 L25 25 M25 19 L19 25 M39 19 L45 25 M45 19 L39 25"
                          stroke="#0c0c0c"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        {/* Jahitan kecil di bawah hati */}
                        <path
                          d="M25 36 Q32 41 39 36"
                          fill="none"
                          stroke="#0c0c0c"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    <div className="text-left">
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#ff1e56] block font-bold">
                        PLAYER 01 // MAULANA
                      </span>
                      <span className="font-marker text-lg sm:text-xl text-white tracking-wider">
                        CREATIVE HP
                      </span>
                    </div>
                  </div>

                  {/* Persentase Angka Doodle */}
                  <div className="text-right rotate-3">
                    <span className="font-marker text-2xl sm:text-3xl text-[#ff1e56] drop-shadow-[2px_2px_0_#ffffff]">
                      {hpProgress}%
                    </span>
                  </div>
                </div>

                {/* KONTAINER UTAMA HEALTHBAR DOODLE */}
                <div className="relative w-full p-3.5 sm:p-4 bg-[#141418]">
                  {/* Garis Tepi Sketsa Tangan Berlapis (Hand-drawn Sketchy Double Border SVG) */}
                  <svg
                    viewBox="0 0 500 84"
                    preserveAspectRatio="none"
                    className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                  >
                    {/* Bayangan Offset Merah Brutalist */}
                    <path
                      d="M 10 14 L 494 10 L 490 76 L 14 78 Z"
                      fill="none"
                      stroke="#ff1e56"
                      strokeWidth="4"
                    />
                    {/* Garis Sketsa Putih Utama (Tidak Rata / Wobbly) */}
                    <path
                      d="M 4 8 Q 250 3 494 7 L 491 74 Q 245 79 6 73 Z"
                      fill="#0c0c0c"
                      stroke="#ffffff"
                      strokeWidth="3.5"
                      strokeLinejoin="round"
                    />
                    {/* Garis Goresan Pensil Kedua (Efek Doodle) */}
                    <path
                      d="M 8 12 Q 255 9 488 11 L 486 70 Q 250 73 10 69 Z"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="1.4"
                      strokeDasharray="12 6 4 6"
                      opacity="0.65"
                    />
                    {/* Plester Silang (X-Tape) di Pojok Kiri Atas & Kanan Bawah */}
                    <g stroke="#ff1e56" strokeWidth="3" strokeLinecap="round">
                      <line x1="-4" y1="16" x2="18" y2="-4" />
                      <line x1="-2" y1="-2" x2="16" y2="16" />
                      <line x1="482" y1="84" x2="502" y2="62" />
                      <line x1="484" y1="64" x2="502" y2="82" />
                    </g>
                  </svg>

                  {/* 12 SEGMEN BALOK HP DOODLE DI DALAM BAR */}
                  <div className="relative z-10 grid grid-cols-12 gap-1.5 sm:gap-2 h-10 sm:h-12 items-center px-1">
                    {Array.from({ length: TOTAL_HP_SEGMENTS }).map((_, idx) => {
                      const isFilled = idx < filledSegments;
                      const isLastFilled = idx === filledSegments - 1;
                      const tilt = idx % 2 === 0 ? '-rotate-2' : 'rotate-2';

                      return (
                        <div
                          key={idx}
                          className={`relative h-full rounded-[3px] border-2 transition-all duration-100 overflow-hidden ${tilt} ${isFilled
                            ? idx >= TOTAL_HP_SEGMENTS - 2
                              ? 'bg-white border-white shadow-[0_0_12px_#ffffff] scale-105'
                              : 'bg-[#ff1e56] border-white shadow-[2px_2px_0_#ffffff]'
                            : 'bg-zinc-900/80 border-zinc-700/70 border-dashed opacity-45'
                            } ${isLastFilled ? 'scale-110' : ''}`}
                        >
                          {/* Arsiran Scribble Diagonal di Dalam Tiap Balok HP */}
                          {isFilled && (
                            <svg
                              viewBox="0 0 24 40"
                              className="w-full h-full opacity-35 pointer-events-none"
                              preserveAspectRatio="none"
                            >
                              <path
                                d="M-4 10 L28 -2 M-4 22 L28 10 M-4 34 L28 22 M-4 46 L28 34"
                                stroke={idx >= TOTAL_HP_SEGMENTS - 2 ? '#ff1e56' : '#0c0c0c'}
                                strokeWidth="3.5"
                              />
                            </svg>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Stempel "MAX HP!!" Muncul Saat Penuh 100% */}
                  {hpProgress >= 100 && (
                    <div className="absolute -top-5 right-4 z-20 bg-white text-[#0c0c0c] border-2 border-[#0c0c0c] px-3 py-0.5 font-marker text-xs sm:text-sm -rotate-6 shadow-[4px_4px_0_#ff1e56] animate-bounce">
                      MAX HP!!
                    </div>
                  )}
                </div>

                {/* Baris Status Doodle di Bawah Healthbar */}
                <div className="w-full flex items-center justify-between mt-4 px-2 font-mono text-[10px] sm:text-xs tracking-widest uppercase">
                  <span className="text-zinc-300 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-[#ff1e56] rotate-45 animate-spin" />
                    {getLoadingStatusText()}
                  </span>
                  <span className="text-zinc-500">
                    [{filledSegments}/{TOTAL_HP_SEGMENTS} BLOCKS]
                  </span>
                </div>
              </div>
            )}
          </div>,
          document.body
        )}

      {/* ==================== PHASE 3: PLAYING HERO PORTFOLIO ==================== */}
      {phase === 'playing' && (
        <>
          {/* Tombol suara */}
          <div className="absolute top-6 right-2 sm:right-6 z-30">
            <button
              onClick={toggleSound}
              title={soundOn ? 'Matikan suara' : 'Nyalakan suara'}
              aria-label={soundOn ? 'Matikan suara' : 'Nyalakan suara'}
              className="w-10 h-10 rounded-full border border-white/40 bg-black/60 hover:bg-[#ff1e56] hover:border-[#ff1e56] transition-colors flex items-center justify-center"
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* Wrapper Utama Teks PORTFOLIO & Elemen Dekoratif */}
          <div className="relative inline-block max-w-full px-4">

            {/* Stempel Melingkar Kiri Atas */}
            <div
              className="absolute -top-12 -left-4 sm:-left-14 md:-top-16 md:-left-20 z-20 hidden xs:block sign-fade"
              style={{ '--sign-delay': '0s' }}
            >
              <CircularStamp size={135} />
            </div>

            {/* Tahun 2026 Gaya Marker */}
            <div className="text-left mb-1 sm:mb-2 ml-6 sm:ml-20">
              <span
                className="font-marker text-2xl sm:text-4xl md:text-5xl text-white/95 tracking-widest inline-block -rotate-6 sign-reveal"
                style={{ '--sign-delay': '0.2s', '--sign-dur': '0.8s' }}
              >
                2026
              </span>
            </div>

            {/* Garis Orbit Elips Miring: tergambar sendiri */}
            <svg
              viewBox="0 0 900 320"
              className="absolute -inset-x-6 sm:-inset-x-16 -inset-y-6 w-[calc(100%+3rem)] sm:w-[calc(100%+8rem)] h-[calc(100%+3rem)] pointer-events-none z-10 overflow-visible"
            >
              <ellipse
                cx="450"
                cy="155"
                rx="440"
                ry="110"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                transform="rotate(-11 450 155)"
                pathLength="1"
                className="draw-stroke"
                style={{ '--sign-delay': '0.4s', '--sign-dur': '2.4s' }}
              />
              {/* Garis aksen bawah */}
              <line
                x1="80" y1="265" x2="850" y2="175"
                stroke="white"
                strokeWidth="1.8"
                opacity="0.85"
                pathLength="1"
                className="draw-stroke"
                style={{ '--sign-delay': '2.2s', '--sign-dur': '1.2s' }}
              />
            </svg>

            {/* Kata "PORT" */}
            <h1
              className="relative z-10 sign-reveal font-bbh font-black text-[4.5rem] sm:text-[7.8rem] md:text-[10.5rem] lg:text-[13rem] xl:text-[15rem] leading-[0.82] tracking-tighter text-white uppercase drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
              style={{ '--sign-delay': '0.6s', '--sign-dur': '1.2s' }}
            >
              PORT
            </h1>

            {/* Kata "FOLIO" */}
            <div className="relative z-20 -mt-2 sm:-mt-5 md:-mt-7">
              <span
                className="font-marker sign-reveal text-[3.4rem] sm:text-[5.8rem] md:text-[7.8rem] lg:text-[9.5rem] xl:text-[11rem] leading-none tracking-wider text-white inline-block -rotate-2 drop-shadow-[0_6px_15px_rgba(0,0,0,0.9)]"
                style={{ '--sign-delay': '1.5s', '--sign-dur': '1.8s' }}
              >
                FOLIO
              </span>
            </div>

            {/* Subjudul */}
            <div className="relative z-20 mt-4 sm:mt-6">
              <h2
                className="sign-reveal font-display font-extrabold text-sm sm:text-xl md:text-2xl lg:text-3xl tracking-[0.22em] uppercase text-white"
                style={{ '--sign-delay': '3.1s', '--sign-dur': '1s' }}
              >
                WEB & MOBILE DEVELOPER
              </h2>
            </div>

            {/* Baris Bawah Hero: Catatan Kecil, 3 Ikon Kotak, dan Tanda Tangan */}
            <div className="relative z-20 mt-4 flex flex-wrap items-start justify-center sm:justify-between gap-4 max-w-2xl mx-auto px-2">
              <p
                className="sign-fade font-sans-tech text-[11px] sm:text-xs text-neutral-300 text-left leading-tight max-w-[165px]"
                style={{ '--sign-delay': '3.9s' }}
              >
                some of my work and personal projects.<br />
                I hope you like them!
              </p>

              {/* 3 Kotak Monogram / Simbol Streetwear */}
              <div className="sign-fade flex items-center gap-2" style={{ '--sign-delay': '3.9s' }}>
                <div className="w-8 h-8 bg-white text-black font-display font-black text-xs flex items-center justify-center border border-white">
                  MA
                </div>
                <div className="w-8 h-8 bg-white text-black flex items-center justify-center border border-white">
                  <Sparkles className="w-4 h-4 fill-black" />
                </div>
                <div className="w-8 h-8 bg-white text-black flex items-center justify-center border border-white">
                  <Flame className="w-4 h-4 fill-black" />
                </div>
              </div>

              {/* Tanda Tangan Maulana Al Ghifari */}
              <div className="w-full sm:w-auto text-center sm:text-right -mt-1">
                <span
                  className="sign-reveal font-signature text-3xl sm:text-5xl text-white/95 inline-block -rotate-6"
                  style={{ '--sign-delay': '4.2s', '--sign-dur': '1.3s' }}
                >
                  Maulana Al Ghifari
                </span>
              </div>
            </div>

            {/* Siku Frame Kanan Bawah Hero */}
            <div
              className="sign-fade absolute -bottom-8 right-2 sm:-right-10"
              style={{ '--sign-delay': '5.2s' }}
            >
              <CornerBracket position="bottom-right" />
            </div>
          </div>
        </>
      )}
    </section>
  );
}