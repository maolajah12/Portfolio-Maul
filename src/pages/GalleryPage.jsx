import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Camera, X } from 'lucide-react';
import { FireSectionBadge } from '../components/decor';

// ============================================================
// WEB AUDIO API: EFEK SUARA AUTOFOCUS BEEP & MECHANICAL SHUTTER
// ============================================================
function playCameraBeep(ctx, freq = 2400, dur = 0.055) {
    if (!ctx) return;
    try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        g.gain.setValueAtTime(0.0001, now);
        g.gain.linearRampToValueAtTime(0.08, now + 0.008);
        g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + dur + 0.01);
    } catch {
        /* ignore audio restriction */
    }
}

function playCameraShutter(ctx) {
    if (!ctx) return;
    try {
        const now = ctx.currentTime;
        // 1. Noise burst untuk tirai rana mekanik (mechanical curtain)
        const bufferSize = Math.floor(ctx.sampleRate * 0.15);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.035));
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1800, now);
        filter.Q.value = 1.2;

        const g = ctx.createGain();
        g.gain.setValueAtTime(0.35, now);
        g.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

        noise.connect(filter);
        filter.connect(g);
        g.connect(ctx.destination);
        noise.start(now);

        // 2. Klik cermin kamera kedua (mirror slap)
        const osc = ctx.createOscillator();
        const g2 = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now + 0.045);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.11);
        g2.gain.setValueAtTime(0.28, now + 0.045);
        g2.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(g2);
        g2.connect(ctx.destination);
        osc.start(now + 0.045);
        osc.stop(now + 0.13);
    } catch {
        /* ignore audio restriction */
    }
}

// ============================================================
// DATA GALERI PERJALANAN MAHASISWA TEKNIK INFORMATIKA
// ============================================================
const GALLERY_CATEGORIES = ['ALL', 'INTERNSHIP', 'CAMPUS & THESIS'];

// Cukup foto, judul, dan deskripsi. Tambah item baru di sini: tata letak menyesuaikan sendiri.
const GALLERY_ITEMS = [
    {
        id: 'GAL-01',
        title: 'BPJS Ketenagakerjaan IT Team',
        category: 'INTERNSHIP',
        date: 'SEP - DEC 2025',
        caption:
            'Merancang dan membangun website visualisasi data real-time menggunakan Laravel & React untuk memonitor indikator performa 200 peserta magang MBKM.',
        image:
            '/gallery/BPJSTK IT INTERN.jpg',
    },
    {
        id: 'GAL-02',
        title: 'PT Bank Sumut — Archive Division',
        category: 'INTERNSHIP',
        date: 'JUN - JUL 2025',
        caption:
            'Pemeliharaan sistem web database arsip berbasis CodeIgniter & PHP, perombakan antarmuka frontend, serta verifikasi 500 dokumen arsip fisik dan digital.',
        image:
            '/gallery/Foto Bank sumut.jpg',
    },
    {
        id: 'GAL-03',
        title: 'Cumlaude Graduation & Thesis Defense',
        category: 'CAMPUS & THESIS',
        date: 'JUNE 2026',
        caption:
            'Kelulusan D3 Teknik Informatika USU (IPK 3.72/4.00) dengan Tugas Akhir pengembangan Aplikasi Fitness Tracker berbasis rekomendasi usia, tinggi, dan berat badan.',
        image:
            '/gallery/Graduation.jpg',
    },
    {
        id: 'GAL-04',
        title: 'Webinar & Technical Support 200 Interns',
        category: 'INTERNSHIP',
        date: 'NOV 2025',
        caption:
            'Koordinasi teknis pelaksanaan webinar nasional serta pendampingan aktivasi aplikasi JMO (Jamsostek Mobile) dan kampanye informasi digital.',
        image:
            'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80',
    },
];

// ============================================================
// TATA LETAK "CONTACT SHEET": tiap lembar memuat maksimal 5 foto.
// Grid 12 kolom x 6 baris; untuk 1-5 foto, petak dibagi tidak rata
// namun selalu memenuhi seluruh lembar (tidak ada ruang kosong).
// Format: [kolomMulai, kolomAkhir, barisMulai, barisAkhir]
// ============================================================
const PER_SHEET = 5;
const SHEET_LAYOUTS = {
    1: [[1, 13, 1, 7]],
    2: [[1, 8, 1, 7], [8, 13, 1, 7]],
    3: [[1, 8, 1, 7], [8, 13, 1, 4], [8, 13, 4, 7]],
    4: [[1, 7, 1, 5], [7, 13, 1, 4], [7, 13, 4, 7], [1, 7, 5, 7]],
    5: [[1, 6, 1, 5], [6, 10, 1, 4], [10, 13, 1, 7], [1, 6, 5, 7], [6, 10, 4, 7]],
};

function chunk(list, size) {
    const out = [];
    for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
    return out;
}

// Di layar kecil: foto pertama selalu selebar layar; jika sisa ganjil, foto terakhir juga selebar layar
const isWideOnMobile = (i, n) => i === 0 || (i === n - 1 && (n - 1) % 2 === 1);
const yearOf = (d) => (d.match(/\d{4}/g) || []).pop() || '';

export default function GalleryPage() {
    // Status sekuens kamera: 'hunting' -> 'seeking' -> 'locked' -> 'shutter' -> 'done'
    const [camPhase, setCamPhase] = useState('hunting');
    const [activeCategory, setActiveCategory] = useState('ALL');
    const [lightboxItem, setLightboxItem] = useState(null);
    const [lightboxClosing, setLightboxClosing] = useState(false);
    const lightboxRef = useRef(null);
    const originRef = useRef({ x: 0.5, y: 0.5 });
    const closeTimer = useRef(null);

    // Buka: pop-up tumbuh dari posisi foto yang diklik
    const openLightbox = (item, e) => {
        clearTimeout(closeTimer.current);
        const r = e?.currentTarget?.getBoundingClientRect?.();
        originRef.current = r
            ? { x: r.left + r.width / 2, y: r.top + r.height / 2 }
            : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        setLightboxClosing(false);
        setLightboxItem(item);
    };

    // Tutup: dimainkan dulu animasi keluarnya, baru dilepas dari layar
    const closeLightbox = () => {
        if (!lightboxItem || lightboxClosing) return;
        setLightboxClosing(true);
        closeTimer.current = setTimeout(() => { setLightboxItem(null); setLightboxClosing(false); }, 280);
    };
    useEffect(() => () => clearTimeout(closeTimer.current), []);

    // Titik tumbuh animasi = pusat foto yang diklik (dihitung sebelum frame pertama tergambar)
    useLayoutEffect(() => {
        const el = lightboxRef.current;
        if (!lightboxItem || !el) return;
        const r = el.getBoundingClientRect();
        el.style.transformOrigin = `${originRef.current.x - r.left}px ${originRef.current.y - r.top}px`;
    }, [lightboxItem]);

    // Kunci scroll latar selama pop-up terbuka
    useEffect(() => {
        if (!lightboxItem) return undefined;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = prev; };
    }, [lightboxItem]);
    const audioCtxRef = useRef(null);

    // Jalankan animasi autofokus lensa kamera setiap masuk ke halaman Gallery
    const runCameraSequence = () => {
        setCamPhase('hunting');

        const AudioCtx = typeof window !== 'undefined' ? window.AudioContext || window.webkitAudioContext : null;
        if (AudioCtx && !audioCtxRef.current) {
            try {
                audioCtxRef.current = new AudioCtx();
                audioCtxRef.current.resume().catch(() => { });
            } catch {
                /* ignore */
            }
        }

        // 1. Lensa mencari titik fokus kedua (750ms)
        const t1 = setTimeout(() => {
            setCamPhase('seeking');
            playCameraBeep(audioCtxRef.current, 1950, 0.045);
        }, 750);

        // 2. Titik fokus terkunci tajam pada judul GALLERY (1550ms) - Beep Ganda AF Lock!
        const t2 = setTimeout(() => {
            setCamPhase('locked');
            playCameraBeep(audioCtxRef.current, 2800, 0.055);
            setTimeout(() => playCameraBeep(audioCtxRef.current, 2800, 0.065), 85);
        }, 1550);

        // 3. Jepretan Kamera / Flash & Shutter (2150ms)
        const t3 = setTimeout(() => {
            setCamPhase('shutter');
            playCameraShutter(audioCtxRef.current);
        }, 2150);

        // 4. Masuk ke tampilan penuh Galeri (2550ms)
        const t4 = setTimeout(() => {
            setCamPhase('done');
        }, 2550);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            clearTimeout(t4);
        };
    };

    useEffect(() => {
        const cleanup = runCameraSequence();
        return cleanup;
    }, []);

    const filteredItems =
        activeCategory === 'ALL'
            ? GALLERY_ITEMS
            : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

    const sheets = chunk(filteredItems, PER_SHEET);

    // Esc menutup lightbox
    useEffect(() => {
        if (!lightboxItem) return undefined;
        const onKey = (e) => { if (e.key === 'Escape') closeLightbox(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lightboxItem, lightboxClosing]);

    // Fokus dianggap terkunci sejak 'locked' sampai jepretan selesai
    const isLocked = camPhase === 'locked' || camPhase === 'shutter' || camPhase === 'done';

    // Kalkulasi ketajaman blur dan posisi kotak autofokus selama intro kamera
    const getBlurClass = () => {
        if (camPhase === 'hunting') return 'blur-[14px] scale-[1.12] opacity-70';
        if (camPhase === 'seeking') return 'blur-[6px] scale-[1.05] opacity-90';
        if (camPhase === 'locked') return 'blur-0 scale-100 opacity-100';
        if (camPhase === 'shutter') return 'blur-0 scale-[0.98] opacity-100';
        return 'blur-0 scale-100 opacity-100';
    };

    const getFocusBoxTransform = () => {
        if (camPhase === 'hunting') return '-translate-x-14 -translate-y-8 scale-125 border-white/80';
        if (camPhase === 'seeking') return 'translate-x-10 translate-y-5 scale-90 border-[#ff1e56]';
        // Setelah jepretan selesai, kotak TARGET LOCKED memudar dan hilang
        if (camPhase === 'done') return 'translate-x-0 translate-y-0 scale-110 opacity-0';
        return 'translate-x-0 translate-y-0 scale-100 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.45)]';
    };

    return (
        <div className="relative w-full min-h-screen bg-[#0c0c0c] text-white flex flex-col justify-between select-none overflow-x-hidden">
            {/* =====================================================================
          2. VIEWFINDER KAMERA & HERO JUDUL "GALLERY" (BLUR -> AUTOFOCUS -> SNAP)
         ===================================================================== */}
            <header className="relative w-full max-w-[1450px] mx-auto px-6 sm:px-12 lg:px-20 pt-28 pb-12">
                <div className="relative w-full border-2 border-zinc-800 bg-[#101013] p-6 sm:p-12 md:p-16 overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.9)]">

                    {/* Garis Grid Rule-of-Thirds Kamera */}
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20">
                        <div className="border-r border-b border-dashed border-white/50" />
                        <div className="border-r border-b border-dashed border-white/50" />
                        <div className="border-b border-dashed border-white/50" />
                        <div className="border-r border-b border-dashed border-white/50" />
                        <div className="border-r border-b border-dashed border-white/50" />
                        <div className="border-b border-dashed border-white/50" />
                        <div className="border-r border-dashed border-white/50" />
                        <div className="border-r border-dashed border-white/50" />
                        <div />
                    </div>

                    {/* Siku Viewfinder di 4 Sudut Layar Kamera */}
                    <div className="absolute top-4 left-4 w-7 h-7 border-t-[3px] border-l-[3px] border-white/80 pointer-events-none" />
                    <div className="absolute top-4 right-4 w-7 h-7 border-t-[3px] border-r-[3px] border-white/80 pointer-events-none" />
                    <div className="absolute bottom-4 left-4 w-7 h-7 border-b-[3px] border-l-[3px] border-white/80 pointer-events-none" />
                    <div className="absolute bottom-4 right-4 w-7 h-7 border-b-[3px] border-r-[3px] border-white/80 pointer-events-none" />

                    {/* HUD Informasi Kamera Atas (REC, ISO, Shutter Speed, Replay Intro) */}
                    <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-white/10 font-mono text-[10px] sm:text-xs tracking-widest uppercase">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1.5 bg-[#ff1e56] text-white font-bold px-2.5 py-0.5">
                                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                                REC
                            </span>
                            <span className="text-zinc-400 hidden sm:inline">RAW // 35MM LENS</span>
                            <span
                                className={`font-bold px-2 py-0.5 border ${isLocked
                                    ? 'border-emerald-400 text-emerald-400 bg-emerald-500/10'
                                    : 'border-amber-400 text-amber-400 bg-amber-500/10'
                                    }`}
                            >
                                {camPhase === 'hunting' && 'AF: HUNTING...'}
                                {camPhase === 'seeking' && 'AF: CALIBRATING...'}
                                {(camPhase === 'locked' || camPhase === 'shutter' || camPhase === 'done') &&
                                    'AF: LOCKED [●]'}
                            </span>
                        </div>

                        <div className="flex items-center gap-4 text-zinc-400">
                            <span>1/250s</span>
                            <span>F/1.8</span>
                            <span>ISO 400</span>
                            <button
                                type="button"
                                onClick={runCameraSequence}
                                className="flex items-center gap-1.5 bg-white/10 hover:bg-[#ff1e56] text-white px-3 py-1 border border-white/20 transition-colors cursor-pointer"
                                title="Ulangi Efek Fokus Kamera"
                            >
                                <Camera className="w-3.5 h-3.5" />
                                <span>RE-FOCUS</span>
                            </button>
                        </div>
                    </div>

                    {/* AREA TENGAH VIEWFINDER: JUDUL GALLERY YANG MENCARI FOKUS */}
                    <div className="relative py-12 sm:py-16 flex flex-col items-center justify-center text-center">

                        {/* KOTAK BIDIK AUTOFOCUS (Bergerak mencari titik lalu mengunci hijau di tengah judul) */}
                        <div
                            aria-hidden="true"
                            className={`absolute z-30 w-64 sm:w-96 h-28 sm:h-36 pointer-events-none transition-all duration-500 ease-out flex items-center justify-center ${getFocusBoxTransform()}`}
                        >
                            {/* 4 Siku Kotak Fokus */}
                            <span
                                className={`absolute top-0 left-0 w-5 h-5 border-t-[3px] border-l-[3px] ${isLocked
                                    ? 'border-emerald-400'
                                    : camPhase === 'seeking'
                                        ? 'border-[#ff1e56]'
                                        : 'border-white'
                                    }`}
                            />
                            <span
                                className={`absolute top-0 right-0 w-5 h-5 border-t-[3px] border-r-[3px] ${isLocked
                                    ? 'border-emerald-400'
                                    : camPhase === 'seeking'
                                        ? 'border-[#ff1e56]'
                                        : 'border-white'
                                    }`}
                            />
                            <span
                                className={`absolute bottom-0 left-0 w-5 h-5 border-b-[3px] border-l-[3px] ${isLocked
                                    ? 'border-emerald-400'
                                    : camPhase === 'seeking'
                                        ? 'border-[#ff1e56]'
                                        : 'border-white'
                                    }`}
                            />
                            <span
                                className={`absolute bottom-0 right-0 w-5 h-5 border-b-[3px] border-r-[3px] ${isLocked
                                    ? 'border-emerald-400'
                                    : camPhase === 'seeking'
                                        ? 'border-[#ff1e56]'
                                        : 'border-white'
                                    }`}
                            />

                            {/* Crosshair Tengah (+) */}
                            <span
                                className={`font-mono text-lg font-bold ${isLocked
                                    ? 'text-emerald-400'
                                    : 'text-[#ff1e56]'
                                    }`}
                            >
                                +
                            </span>

                            {/* Label Kecil di Atas Kotak Fokus */}
                            <span
                                className={`absolute -top-6 left-0 font-mono text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest ${isLocked
                                    ? 'bg-emerald-400 text-black'
                                    : 'bg-[#ff1e56] text-white'
                                    }`}
                            >
                                {isLocked
                                    ? 'TARGET LOCKED // 100%'
                                    : 'SEARCHING FOCUS...'}
                            </span>
                        </div>

                        {/* TEKS JUDUL "GALLERY" DENGAN TRANSISI BLUR KE FOKUS TAJAM */}
                        <div className={`transition-all duration-500 ease-out ${getBlurClass()}`}>
                            <span className="font-mono text-xs sm:text-sm uppercase tracking-[0.35em] text-[#ff1e56] block mb-2 font-bold">
                                INFORMATICS ENGINEERING JOURNEY // 2023 — 2026
                            </span>
                            <h1 className="font-syne font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl uppercase tracking-tighter leading-none text-white drop-shadow-[6px_6px_0_#ff1e56]">
                                GALLERY
                            </h1>
                            <p className="font-marker text-lg sm:text-2xl text-zinc-300 -rotate-2 mt-3">
                                Internship • Campus Life • Milestones
                            </p>
                        </div>
                    </div>

                    {/* HUD Kamera Bawah (Exposure Meter & Timestamp) */}
                    <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10 font-mono text-[10px] sm:text-xs text-zinc-400">
                        <div>USU MEDAN // D3 TEKNIK INFORMATIKA</div>
                        <div className="flex items-center gap-2">
                            <span>-2</span>
                            <span>•</span>
                            <span>-1</span>
                            <span>•</span>
                            <span className="text-emerald-400 font-bold">[0]</span>
                            <span>•</span>
                            <span>+1</span>
                            <span>•</span>
                            <span>+2</span>
                        </div>
                        <div className="text-white font-bold">SHOTS: 0{GALLERY_ITEMS.length} FRAMES</div>
                    </div>

                    {/* JEPRETAN HANYA DI DALAM FRAME VIEWFINDER: kilatan putih singkat + dua daun shutter (400ms) */}
                    {camPhase === 'shutter' && (
                        <div aria-hidden="true" className="absolute inset-0 z-40 pointer-events-none overflow-hidden">
                            <style>{`
                                @keyframes shutterTop { 0% { transform: translateY(-100%); } 25% { transform: translateY(0); } 60% { transform: translateY(0); } 100% { transform: translateY(-100%); } }
                                @keyframes shutterBottom { 0% { transform: translateY(100%); } 25% { transform: translateY(0); } 60% { transform: translateY(0); } 100% { transform: translateY(100%); } }
                                @keyframes shutterBlink { 0% { opacity: 0; } 10% { opacity: 0.85; } 22% { opacity: 0.1; } 34% { opacity: 0.6; } 60% { opacity: 0; } 100% { opacity: 0; } }
                                @media (prefers-reduced-motion: reduce) { .shutter-flash, .shutter-blade { display: none; } }
                            `}</style>
                            <div
                                className="shutter-blade absolute inset-x-0 top-0 h-1/2 bg-black border-b border-[#ff1e56]/70"
                                style={{ animation: 'shutterTop 400ms cubic-bezier(0.7, 0, 0.3, 1) both' }}
                            />
                            <div
                                className="shutter-blade absolute inset-x-0 bottom-0 h-1/2 bg-black border-t border-[#ff1e56]/70"
                                style={{ animation: 'shutterBottom 400ms cubic-bezier(0.7, 0, 0.3, 1) both' }}
                            />
                            {/* Kedipan putih, terkurung di dalam frame */}
                            <div
                                className="shutter-flash absolute inset-0 bg-white"
                                style={{ animation: 'shutterBlink 400ms ease-out both' }}
                            />
                        </div>
                    )}

                </div>
            </header>

            {/* =====================================================================
          3. FILTER KATEGORI & KONTAINER KONTAK SHEET GALERI (MUNCUL SETELAH SNAP)
         ===================================================================== */}
            <main
                className={`flex-1 w-full max-w-[1450px] mx-auto px-6 sm:px-12 lg:px-20 pb-24 transition-all duration-700 ${camPhase === 'hunting' || camPhase === 'seeking'
                    ? 'opacity-30 blur-md'
                    : 'opacity-100 blur-0'
                    }`}
            >
                {/* Baris Header Seksi & Filter Kategori */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <FireSectionBadge number="4" label="CAPTURED MOMENTS" />
                        <p className="font-mono text-xs text-zinc-400 mt-2 max-w-xl">
                            Dokumentasi perjalanan akademik, magang industri di BPJS Ketenagakerjaan & PT. Bank Sumut, hingga kelulusan di Universitas Sumatera Utara.
                        </p>
                    </div>

                    {/* Tombol Filter Kategori */}
                    <div className="flex flex-wrap gap-2">
                        {GALLERY_CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setActiveCategory(cat)}
                                className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider border-2 transition-all cursor-pointer ${activeCategory === cat
                                    ? 'bg-[#ff1e56] text-white border-[#ff1e56] font-bold shadow-[4px_4px_0_#ffffff]'
                                    : 'bg-[#141418] text-zinc-300 border-zinc-700 hover:border-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* CONTACT SHEET: maksimal 5 foto per lembar, scroll untuk lembar berikutnya */}
                <div key={activeCategory} className="space-y-16 sm:space-y-24">
                    {sheets.map((sheet, si) => {
                        const layout = SHEET_LAYOUTS[sheet.length];
                        return (
                            <section key={si} aria-label={`Sheet ${si + 1}`}>
                                {sheets.length > 1 && (
                                    <div className="flex items-center gap-4 mb-5 font-mono text-[10px] tracking-[0.3em] text-zinc-500 uppercase">
                                        <span>Sheet {String(si + 1).padStart(2, '0')} / {String(sheets.length).padStart(2, '0')}</span>
                                        <span className="flex-1 h-px bg-white/10" />
                                        <span>{sheet.length} frames</span>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:gap-5 lg:grid-cols-12 lg:grid-rows-6 lg:h-[780px]">
                                    {sheet.map((item, i) => {
                                        const [c1, c2, r1, r2] = layout[i];
                                        const frame = `${String(si * PER_SHEET + i + 1).padStart(2, '0')}A`;
                                        const wide = isWideOnMobile(i, sheet.length);
                                        return (
                                            <figure
                                                key={item.id}
                                                onClick={(e) => openLightbox(item, e)}
                                                className={`group relative flex flex-col min-h-0 cursor-pointer ${wide ? 'col-span-2' : ''} lg:[grid-column:var(--c)] lg:[grid-row:var(--r)]`}
                                                style={{ '--c': `${c1} / ${c2}`, '--r': `${r1} / ${r2}` }}
                                            >
                                                <div className={`relative overflow-hidden bg-zinc-900 lg:flex-1 lg:min-h-0 lg:aspect-auto ${wide ? 'aspect-[16/10]' : 'aspect-[4/5]'}`}>
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        loading="lazy"
                                                        className="absolute inset-0 w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-[1.03] [@media(hover:none)]:grayscale-0 transition-all duration-700 ease-out"
                                                    />
                                                    <span className="absolute top-2 left-2 font-mono text-[10px] font-bold tracking-widest bg-black/70 text-white px-1.5 py-0.5">
                                                        {frame}
                                                    </span>
                                                    <span className="absolute left-0 bottom-0 h-[3px] w-10 bg-[#ff1e56] group-hover:w-full transition-all duration-500" />
                                                </div>

                                                <figcaption className="pt-3">
                                                    <span className="block font-mono text-[10px] tracking-widest text-zinc-500 mb-1">{yearOf(item.date)}</span>
                                                    <h3 className="font-syne font-black text-sm sm:text-base uppercase leading-tight text-white group-hover:text-[#ff1e56] transition-colors">
                                                        {item.title}
                                                    </h3>
                                                    <p className="mt-1 text-xs text-zinc-400 leading-relaxed line-clamp-2">
                                                        {item.caption}
                                                    </p>
                                                </figcaption>
                                            </figure>
                                        );
                                    })}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </main>

            {/* =====================================================================
          4. MODAL LIGHTBOX INSPEKSI FOTO (SAAT SALAH SATU POLAROID DIKLIK)
         ===================================================================== */}
            {lightboxItem && (
                <div
                    onClick={closeLightbox}
                    className="lb-overlay fixed inset-0 z-[90] bg-black/90 backdrop-blur-sm overflow-y-auto"
                    data-closing={lightboxClosing ? '1' : '0'}
                >
                    <style>{`
                        @keyframes lb-bg-in { from { opacity: 0; } to { opacity: 1; } }
                        @keyframes lb-bg-out { from { opacity: 1; } to { opacity: 0; } }
                        @keyframes lb-in { from { opacity: 0; transform: scale(.55) translateY(24px); } to { opacity: 1; transform: none; } }
                        @keyframes lb-out { from { opacity: 1; transform: none; } to { opacity: 0; transform: scale(.7) translateY(16px); } }
                        @keyframes lb-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
                        .lb-overlay { animation: lb-bg-in .35s ease-out both; }
                        .lb-overlay[data-closing="1"] { animation: lb-bg-out .28s ease-in both; }
                        .lb-panel { animation: lb-in .5s cubic-bezier(.22,1,.36,1) both; }
                        .lb-overlay[data-closing="1"] .lb-panel { animation: lb-out .28s cubic-bezier(.5,0,.75,0) both; }
                        .lb-text { animation: lb-rise .5s .22s cubic-bezier(.22,1,.36,1) both; }
                        .lb-overlay[data-closing="1"] .lb-text { animation: none; }
                        @media (prefers-reduced-motion: reduce) { .lb-overlay, .lb-panel, .lb-text { animation-duration: .01s !important; animation-delay: 0s !important; } }
                    `}</style>
                    <div className="min-h-full flex items-center justify-center p-4 sm:p-8">
                        <div ref={lightboxRef} onClick={(e) => e.stopPropagation()} className="lb-panel relative w-full max-w-4xl">
                            <button
                                type="button"
                                onClick={closeLightbox}
                                aria-label="Close"
                                className="absolute -top-3 -right-3 z-10 w-10 h-10 bg-[#ff1e56] text-white border-2 border-black flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <img
                                src={lightboxItem.image}
                                alt={lightboxItem.title}
                                className="w-full max-h-[70vh] object-cover bg-zinc-900"
                            />

                            <div className="lb-text pt-4 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-6">
                                <h2 className="font-syne font-black text-xl sm:text-3xl uppercase text-white leading-tight">
                                    {lightboxItem.title}
                                </h2>
                                <span className="font-mono text-xs text-zinc-400 shrink-0">{lightboxItem.date}</span>
                            </div>
                            <p className="lb-text mt-2 text-sm text-zinc-300 leading-relaxed max-w-3xl">
                                {lightboxItem.caption}
                            </p>
                            <span className="mt-4 block h-[3px] w-16 bg-[#ff1e56]" />
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}