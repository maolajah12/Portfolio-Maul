import { useState } from 'react';
import EducationCard from './cv/EducationCard.jsx';
import ExperienceCard from './cv/ExperienceCard.jsx';
import { FireSectionBadge, SmileyDoodle } from '../decor';

// Bunyi tekan tombol (sama dengan tombol "PRESS TO ENTER" di gerbang awal); mengikuti pengaturan 'signSfx'.
let pressCtx = null;

function playPressSound() {
  try {
    if (localStorage.getItem('signSfx') === 'off') return;
  } catch { /* abaikan */ }

  const AC = typeof window !== 'undefined' ? window.AudioContext || window.webkitAudioContext : null;
  if (!AC) return;

  try {
    if (!pressCtx || pressCtx.state === 'closed') pressCtx = new AC();
    pressCtx.resume().catch(() => { });

    const when = pressCtx.currentTime + 0.01;
    const out = pressCtx.createGain();
    out.gain.value = 0.9;
    out.connect(pressCtx.destination);

    const osc = pressCtx.createOscillator();
    const g = pressCtx.createGain();
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
  } catch { /* abaikan */ }
}


export default function CV() {
  const [isPressed, setIsPressed] = useState(false);
  const [isSmashing, setIsSmashing] = useState(false);

  const activeDown = isPressed || isSmashing;

  const handleSmashClick = (e) => {
    e.preventDefault();
    if (isSmashing) return;

    setIsSmashing(true);
    playPressSound();

    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '/CV_inggris maulana.pdf';
      link.download = 'Maulana_Al_Ghifari_CV.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 220);

    setTimeout(() => {
      setIsSmashing(false);
    }, 450);
  };

  return (
    <section id="cv" className="relative py-14 sm:py-16">
      <div className="mx-auto w-full max-w-[960px] xl:[zoom:1.1] 2xl:[zoom:1.35]">
        <FireSectionBadge number="2" label="CV" />

        <div className="flex flex-col lg:flex-row lg:justify-center lg:items-stretch gap-y-10 mt-2">
          {/* KIRI: Education + Tombol Mekanik Smash CV */}
          <div className="relative z-10 w-full max-w-md mx-auto lg:mx-0 flex flex-col gap-7">
            <EducationCard />

            {/* BLOK DOWNLOAD CV (SATU CARD HOUSING DENGAN TOMBOL 3D FISIK) */}
            <div className="lg:pr-10 flex flex-col lg:flex-1 select-none mt-2">
              <div className="flex items-center gap-4 opacity-80 mb-5">
                <div className="h-[2px] flex-1 bg-gradient-to-r from-white/0 via-white/50 to-white/0" />
                <span className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase">
                  Official Resume
                </span>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-white/50 via-white/50 to-white/0" />
              </div>

              {/* SATU CARD HOUSING ABU-ABU */}
              <div
                role="button"
                tabIndex={0}
                onMouseDown={() => setIsPressed(true)}
                onMouseUp={() => setIsPressed(false)}
                onMouseLeave={() => setIsPressed(false)}
                onTouchStart={() => setIsPressed(true)}
                onTouchEnd={() => setIsPressed(false)}
                onClick={handleSmashClick}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleSmashClick(e);
                }}
                className={`group relative w-full bg-[#e6e6e6] border-[3px] border-[#0c0c0c] p-5 sm:p-6 cursor-pointer transition-transform duration-75 ${activeDown ? 'translate-y-[3px] bg-[#dcdcdc]' : 'hover:bg-white'
                  }`}
                title="Smash to Download CV_inggris maulana.pdf"
              >
                {/* Baut Sudut Industrial */}
                <span className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-zinc-500 border border-black" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-zinc-500 border border-black" />
                <span className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-zinc-500 border border-black" />
                <span className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-zinc-500 border border-black" />

                <div className="flex items-center justify-between gap-4">
                  {/* Teks Kiri */}
                  <div className="flex flex-col gap-1.5">
                    <span className="font-mono font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 mb-1">
                      <span
                        className={`w-2.5 h-2.5 rounded-full border border-[#0c0c0c] transition-colors duration-75 ${activeDown
                          ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]'
                          : 'bg-[#ff1e56] animate-pulse'
                          }`}
                      />
                      <span className={activeDown ? 'text-emerald-700' : 'text-[#ff1e56]'}>
                        {activeDown ? 'DOWNLOADING...' : 'AMd.Kom VERIFIED'}
                      </span>
                    </span>

                    <span className="font-syne font-black text-3xl sm:text-[2.35rem] text-[#0c0c0c] uppercase tracking-tighter leading-[0.88]">
                      SMASH
                      <br />
                      TO GET CV
                    </span>
                  </div>

                  {/* MEKANISME TOMBOL SMASH 3D */}
                  <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                    {/* 1. Cincin Bezel Abu-Abu */}
                    <div
                      className={`absolute inset-x-1 bottom-0 h-20 rounded-full bg-[#9ea3a8] border-[3px] border-[#0c0c0c] transition-shadow duration-75 ${activeDown
                        ? 'shadow-[0_2px_0_#0c0c0c]'
                        : 'shadow-[0_7px_0_#0c0c0c,0_12px_18px_rgba(0,0,0,0.45)]'
                        }`}
                    />

                    {/* 2. Lubang Soket Hitam */}
                    <div className="absolute inset-x-2.5 bottom-1.5 h-[68px] rounded-full bg-[#18181b] border-2 border-[#0c0c0c]" />

                    {/* 3. Dinding Silinder Merah Gelap */}
                    <div
                      className={`absolute inset-x-3 bottom-2.5 rounded-full bg-[#7a001e] border-x-[3px] border-b-[3px] border-[#0c0c0c] transition-all duration-75 ease-out ${activeDown ? 'h-[58px]' : 'h-[72px]'
                        }`}
                    />

                    {/* 4. Kubah Plunger Merah Menyala */}
                    <div
                      className={`relative z-10 w-[72px] h-[64px] rounded-full bg-[#ff1e56] border-[3px] border-[#0c0c0c] flex items-center justify-center transition-all duration-75 ease-out ${activeDown
                        ? 'translate-y-[9px] bg-[#e01145] shadow-[inset_0_4px_8px_rgba(0,0,0,0.55)] scale-[0.97]'
                        : '-translate-y-[5px] group-hover:-translate-y-[7px] shadow-[inset_0_-7px_0_#b8002e,inset_0_4px_0_rgba(255,255,255,0.45)]'
                        }`}
                    >
                      <div className="absolute top-1.5 left-3.5 w-6 h-2 bg-white/35 rounded-full -rotate-12 pointer-events-none" />

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.2"
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                        className={`text-white transition-transform duration-75 ${activeDown ? 'scale-90 translate-y-0.5' : ''
                          }`}
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pernak-pernik Data & Barcode */}
              <div className="flex flex-wrap items-end justify-between gap-4 border-t border-dashed border-zinc-700 pt-5 mt-6">
                <div className="flex flex-col gap-1.5 font-mono text-xs sm:text-[13px] text-zinc-300 uppercase tracking-widest">
                  <span>FILE: CV_INGGRIS MAULANA.PDF</span>
                  <span>DEGREE: D3 INFORMATICS (GPA 3.72)</span>
                  <span className="text-[#ff1e56] font-bold">
                    STACK: LARAVEL • REACT • PYTHON
                  </span>
                </div>

                <div className="flex flex-col items-end gap-2 opacity-80">
                  <svg viewBox="0 0 100 24" className="w-24 h-6 fill-white">
                    <rect x="0" width="4" height="24" />
                    <rect x="6" width="2" height="24" />
                    <rect x="10" width="6" height="24" />
                    <rect x="18" width="2" height="24" />
                    <rect x="22" width="8" height="24" />
                    <rect x="34" width="4" height="24" />
                    <rect x="40" width="2" height="24" />
                    <rect x="44" width="6" height="24" />
                    <rect x="54" width="2" height="24" />
                    <rect x="60" width="8" height="24" />
                    <rect x="70" width="4" height="24" />
                    <rect x="76" width="6" height="24" />
                    <rect x="84" width="2" height="24" />
                    <rect x="88" width="4" height="24" />
                    <rect x="94" width="6" height="24" />
                  </svg>
                  <span className="font-mono text-[10px] tracking-[0.4em] text-zinc-300">
                    AUTH-MAG-CV
                  </span>
                </div>
              </div>

              {/* ===== DOODLE (menggantikan <CvDoodles />) ===== */}
              <div aria-hidden="true" className="relative flex-1 min-h-[120px] mt-6 select-none pointer-events-none">

                {/* Zig-zag menggambar dirinya sendiri */}
                <svg viewBox="0 0 300 60" className="absolute bottom-0 left-0 w-[42%] overflow-visible" fill="none">
                  <path
                    pathLength="1"
                    className="doodle-squiggle"
                    d="M5 30 Q 20 2, 35 30 T 65 30 T 95 30 T 125 30 T 155 30 T 185 30 T 215 30 T 245 30 T 275 30"
                    stroke="#ff1e56"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Smiley melayang */}
                <div className="absolute top-0 left-0 -rotate-12">
                  <SmileyDoodle className="w-12 h-12 doodle-float" />
                </div>

                {/* Kode bergoyang */}
                <span className="absolute top-1 left-[16%] font-marker text-xl text-white inline-block doodle-wiggle">
                  {'</>'}
                </span>

                {/* Bintang outline berputar */}
                <svg viewBox="0 0 100 100" className="absolute top-8 left-[30%] w-9 h-9 animate-spin-slow" fill="none">
                  <polygon
                    points="50,2 58,32 88,18 68,44 98,50 68,58 86,86 58,68 50,98 42,68 14,86 32,58 2,50 32,44 12,18 42,32"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                </svg>

                {/* Petir berkedip */}
                <svg viewBox="0 0 60 70" className="absolute bottom-3 left-[44%] w-6 h-9 doodle-flicker">
                  <path d="M34 0 L8 38 H26 L18 70 L52 28 H34 Z" fill="#fee440" stroke="#0c0c0c" strokeWidth="3" strokeLinejoin="round" />
                </svg>

                {/* Tanda + berkedip */}
                <span className="absolute top-2 left-[42%] font-mono text-lg text-white/80 doodle-twinkle">+</span>
                <span className="absolute top-16 left-[3%] font-mono text-base text-[#ff1e56] doodle-twinkle" style={{ animationDelay: '0.8s' }}>+</span>
                <span className="absolute top-3 left-[56%] font-mono text-sm text-white/70 doodle-twinkle" style={{ animationDelay: '1.5s' }}>+</span>

                {/* Orbit */}
                <div className="absolute bottom-1 left-[52%] w-12 h-12">
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/30" />
                  <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '4s' }}>
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#00f5d4]" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center text-[#ff1e56] font-black text-sm">✦</div>
                </div>

                {/* PANAH PANJANG ke tombol (desktop): berkelok, ujung berhenti sebelum tombol */}
                <svg viewBox="0 0 96 232" className="hidden lg:block absolute bottom-0 right-[22%] w-24 h-[232px] overflow-visible" fill="none">
                  <path
                    className="doodle-dash"
                    d="M52 228 C 20 214, 16 188, 46 174 C 84 158, 92 136, 60 122 C 34 110, 40 92, 66 82 C 88 72, 84 52, 70 42 C 62 36, 70 24, 76 14"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path d="M61.4 20.5 L76 14 L77.1 30" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

                {/* Panah pendek (HP) */}
                <svg viewBox="0 0 120 150" className="lg:hidden absolute right-2 top-0 w-20 h-28 overflow-visible" fill="none">
                  <path className="doodle-dash" d="M20 140 C 25 70, 75 80, 95 22" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  <path d="M78 30 L96 14 L104 38" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

                <div className="absolute bottom-2 right-[2%] -rotate-6">
                  <span className="font-brush text-lg text-[#ff1e56] inline-block doodle-wiggle">PRESS IT!</span>
                </div>

              </div>
            </div>
          </div>

          {/* KANAN: Experience */}
          <ExperienceCard />
        </div>
      </div>
    </section >
  );
}