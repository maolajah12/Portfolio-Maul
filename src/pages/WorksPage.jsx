import { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, X, ChevronLeft, ChevronRight, Layers, Image as ImageIcon } from 'lucide-react';
import { FireSectionBadge, BrutalStar } from '../components/decor';
import { PROJECTS_DATA, PROJECT_CATEGORIES } from '../data/projects.js';

// ============================================================
// HERO "WORKS": SERPIHAN HURUF JATUH SEPERTI TETRIS
// ============================================================
const WORD = 'WORKS';
const FINALE_MODE = 'explode'; // 'explode' | 'zoom'

// Pengaturan waktu (ms)
const START_MS = 500;
const FALL_MS = 560;
const HOLD_MS = 420;
const BURST_MS = 700;
const SLAM_MS = 650;
const TARGET_BUILD_MS = 1900;
const MIN_STEP_MS = 30;
const MAX_STEP_MS = 70;

// Geometri
const TRACKING_EM = -0.04;
const REF_FONT_PX = 200;
const CELL_TARGET_DIV = 44;
const CELL_MIN_PX = 12;
const CELL_MAX_PX = 40;
const SPAWN_EXTRA_PX = 220;
const BEAM_EXTRA_PX = 140;

const FALLBACK_FONT_SIZE = 'min(19vw, 15.5rem)';

function mulberry32(seed) {
    let a = seed;
    return function rand() {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

let LAYOUT_COUNTER = 0;

// ============================================================
// SUARA (WEB AUDIO API, SINTETIS, TANPA FILE AUDIO)
// ============================================================
const noiseCache = new WeakMap();

function getNoiseBuffer(ctx) {
    let buf = noiseCache.get(ctx);
    if (!buf) {
        const len = Math.floor(ctx.sampleRate * 0.8);
        buf = ctx.createBuffer(1, len, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
        noiseCache.set(ctx, buf);
    }
    return buf;
}

function ensureAudioCtx(ref) {
    if (typeof window === 'undefined') return null;
    if (ref.current && ref.current.state !== 'closed') return ref.current;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try {
        ref.current = new AC();
    } catch {
        ref.current = null;
    }
    return ref.current;
}

function createMaster(ctx, level) {
    const gain = ctx.createGain();
    gain.gain.value = level;
    const comp = ctx.createDynamicsCompressor();
    gain.connect(comp);
    comp.connect(ctx.destination);
    return {
        input: gain,
        setLevel(v) {
            try {
                gain.gain.setTargetAtTime(v, ctx.currentTime, 0.02);
            } catch {
                /* abaikan */
            }
        },
        stop() {
            try {
                gain.gain.cancelScheduledValues(ctx.currentTime);
                gain.gain.setTargetAtTime(0, ctx.currentTime, 0.01);
            } catch {
                /* abaikan */
            }
            setTimeout(() => {
                try {
                    gain.disconnect();
                    comp.disconnect();
                } catch {
                    /* abaikan */
                }
            }, 250);
        },
    };
}

function tone(ctx, dest, { type = 'sine', f0, f1 = f0, t, dur, peak, attack = 0.004 }) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) osc.frequency.exponentialRampToValueAtTime(f1, t + dur * 0.6);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(dest);
    osc.start(t);
    osc.stop(t + dur + 0.02);
}

function noiseBurst(ctx, dest, { t, dur, peak, filterType = 'highpass', f0, f1 = f0, q = 0.7 }) {
    const src = ctx.createBufferSource();
    src.buffer = getNoiseBuffer(ctx);
    const filt = ctx.createBiquadFilter();
    filt.type = filterType;
    filt.Q.value = q;
    filt.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) filt.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(peak, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filt);
    filt.connect(g);
    g.connect(dest);
    src.start(t);
    src.stop(t + dur + 0.02);
}

function playLockSound(ctx, dest, t, prog) {
    const f = 170 + prog * 300;
    tone(ctx, dest, { type: 'triangle', f0: f * 1.5, f1: f, t, dur: 0.11, peak: 0.15 });
    noiseBurst(ctx, dest, { t, dur: 0.03, peak: 0.07, filterType: 'highpass', f0: 2200 });
}

function playFoundationSweep(ctx, dest, t) {
    tone(ctx, dest, { type: 'triangle', f0: 140, f1: 520, t, dur: 0.4, peak: 0.05, attack: 0.05 });
}

function playFinale(ctx, dest, t) {
    const noiseFactor = FINALE_MODE === 'explode' ? 1 : 0.35;
    noiseBurst(ctx, dest, {
        t,
        dur: 0.7,
        peak: 0.33 * noiseFactor,
        filterType: 'lowpass',
        f0: 4000,
        f1: 160,
    });
    tone(ctx, dest, { type: 'sine', f0: 110, f1: 38, t, dur: 0.6, peak: 0.5 });
    const hit = t + 0.2;
    tone(ctx, dest, { type: 'sine', f0: 150, f1: 48, t: hit, dur: 0.25, peak: 0.45 });
    noiseBurst(ctx, dest, { t: hit, dur: 0.12, peak: 0.15, filterType: 'lowpass', f0: 1800, f1: 300 });
    tone(ctx, dest, { type: 'sine', f0: 1320, t: hit + 0.06, dur: 0.35, peak: 0.05 });
    tone(ctx, dest, { type: 'sine', f0: 1760, t: hit + 0.06, dur: 0.3, peak: 0.035 });
}

function playTagDing(ctx, dest, t) {
    tone(ctx, dest, { type: 'sine', f0: 880, t, dur: 0.18, peak: 0.05 });
    tone(ctx, dest, { type: 'sine', f0: 1320, t, dur: 0.12, peak: 0.03 });
}

function scheduleRunSounds(ctx, dest, tl, elapsedMs) {
    const now = ctx.currentTime;
    const at = (ms) => {
        const d = (ms - elapsedMs) / 1000;
        return d < -0.08 ? null : now + Math.max(0, d);
    };
    const run = (ms, fn) => {
        const t = at(ms);
        if (t !== null) fn(t);
    };

    run(0, (t) => playFoundationSweep(ctx, dest, t));
    for (let k = 0; k < tl.n; k++) {
        const prog = tl.n > 1 ? k / (tl.n - 1) : 0;
        run(START_MS + k * tl.step + FALL_MS * 0.78, (t) => playLockSound(ctx, dest, t, prog));
    }
    run(tl.finaleDelay, (t) => playFinale(ctx, dest, t));
    run(tl.tagDelay, (t) => playTagDing(ctx, dest, t));
}

function computeLayout(W, family, weight) {
    const probeCanvas = document.createElement('canvas');
    const pctx = probeCanvas.getContext('2d');
    if (!pctx) return null;

    const trackingOk = 'letterSpacing' in pctx;
    const tracking = trackingOk ? TRACKING_EM : 0;

    pctx.font = `${weight} ${REF_FONT_PX}px ${family}`;
    if (trackingOk) pctx.letterSpacing = `${tracking * REF_FONT_PX}px`;
    pctx.textBaseline = 'alphabetic';
    pctx.textAlign = 'left';
    const m = pctx.measureText(WORD);

    const inkW = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
    if (!(inkW > 0) || m.fontBoundingBoxAscent === undefined) return null;

    const k = W / inkW;
    const fontSize = REF_FONT_PX * k;
    const textLeft = m.actualBoundingBoxLeft * k;
    const inkAscent = m.actualBoundingBoxAscent * k;
    const inkDescent = m.actualBoundingBoxDescent * k;
    const fontAscent = m.fontBoundingBoxAscent * k;
    const fontDescent = m.fontBoundingBoxDescent * k;
    const H = inkAscent + inkDescent;
    const lineHeight = fontAscent + fontDescent;
    const textTop = -(fontAscent - inkAscent);

    const cw_px = Math.ceil(W);
    const ch_px = Math.ceil(H);
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = cw_px;
    maskCanvas.height = ch_px;
    const mctx = maskCanvas.getContext('2d', { willReadFrequently: true });
    if (!mctx) return null;
    mctx.font = `${weight} ${fontSize}px ${family}`;
    if (trackingOk) mctx.letterSpacing = `${tracking * fontSize}px`;
    mctx.textBaseline = 'alphabetic';
    mctx.textAlign = 'left';
    mctx.fillStyle = '#000';
    mctx.fillText(WORD, textLeft, inkAscent);
    const data = mctx.getImageData(0, 0, cw_px, ch_px).data;

    const cellTarget = Math.min(CELL_MAX_PX, Math.max(CELL_MIN_PX, W / CELL_TARGET_DIV));
    const cols = Math.max(8, Math.round(W / cellTarget));
    const cw = W / cols;
    const rows = Math.max(3, Math.round(H / cw));
    const ch = H / rows;

    const grid = Array.from({ length: rows }, () => Array(cols).fill(false));
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const x0 = Math.floor(c * cw);
            const x1 = Math.min(cw_px, Math.ceil((c + 1) * cw));
            const y0 = Math.floor(r * ch);
            const y1 = Math.min(ch_px, Math.ceil((r + 1) * ch));
            let hits = 0;
            for (let y = y0; y < y1 && hits < 2; y += 2) {
                for (let x = x0; x < x1; x += 2) {
                    if (data[(y * cw_px + x) * 4 + 3] > 90) {
                        hits += 1;
                        if (hits >= 2) break;
                    }
                }
            }
            grid[r][c] = hits >= 2;
        }
    }

    const rand = mulberry32(20261102);
    const owner = Array.from({ length: rows }, () => Array(cols).fill(-1));
    const dirs = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
    ];
    const raw = [];
    for (let r = rows - 1; r >= 0; r--) {
        for (let c = 0; c < cols; c++) {
            if (!grid[r][c] || owner[r][c] !== -1) continue;
            const id = raw.length;
            const target = rand() < 0.8 ? 4 : 3;
            const cells = [[r, c]];
            owner[r][c] = id;
            while (cells.length < target) {
                const frontier = [];
                for (const [cr, cc] of cells) {
                    for (const [dr, dc] of dirs) {
                        const nr = cr + dr;
                        const nc = cc + dc;
                        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
                        if (!grid[nr][nc] || owner[nr][nc] !== -1) continue;
                        frontier.push([nr, nc]);
                    }
                }
                if (!frontier.length) break;
                const [nr, nc] = frontier[Math.floor(rand() * frontier.length)];
                owner[nr][nc] = id;
                cells.push([nr, nc]);
            }
            raw.push({ id, cells });
        }
    }
    if (!raw.length) return null;

    const ownerAt = (r, c) =>
        r < 0 || c < 0 || r >= rows || c >= cols ? -1 : owner[r][c];

    const gap = Math.max(1.6, cw * 0.09);
    const sameOverlap = 0.3;
    const emptyExtend = cw * 0.12;
    const adj = (neighborOwner, selfId) => {
        if (neighborOwner === selfId) return sameOverlap;
        if (neighborOwner >= 0) return -gap / 2;
        return emptyExtend;
    };

    const factor = FINALE_MODE === 'explode' ? 1 : 0;

    const pieces = raw.map(({ id, cells }) => {
        let d = '';
        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;
        let maxRow = -1;
        let minCol = Infinity;
        for (const [r, c] of cells) {
            const x0 = c * cw - adj(ownerAt(r, c - 1), id);
            const x1 = (c + 1) * cw + adj(ownerAt(r, c + 1), id);
            const y0 = r * ch - adj(ownerAt(r - 1, c), id);
            const y1 = (r + 1) * ch + adj(ownerAt(r + 1, c), id);
            d += `M${x0.toFixed(2)} ${y0.toFixed(2)}H${x1.toFixed(2)}V${y1.toFixed(2)}H${x0.toFixed(2)}Z`;
            minX = Math.min(minX, c * cw);
            maxX = Math.max(maxX, (c + 1) * cw);
            minY = Math.min(minY, r * ch);
            maxY = Math.max(maxY, (r + 1) * ch);
            maxRow = Math.max(maxRow, r);
            minCol = Math.min(minCol, c);
        }
        const cx = (minX + maxX) / 2;
        const cy = (minY + maxY) / 2;
        return {
            id,
            path: d,
            minX,
            maxX,
            minY,
            cx,
            cy,
            maxRow,
            minCol,
            dx: (cx - W / 2) * 0.55 * factor + (rand() - 0.5) * 50 * factor,
            dy: (cy - H / 2) * 1.2 * factor - (30 + rand() * 50) * factor,
            rot: (rand() - 0.5) * 150 * factor,
        };
    });

    pieces.sort((a, b) => b.maxRow - a.maxRow || a.minCol - b.minCol);

    const n = pieces.length;
    const step = Math.min(MAX_STEP_MS, Math.max(MIN_STEP_MS, TARGET_BUILD_MS / n));
    const buildEnd = START_MS + (n - 1) * step + FALL_MS;
    const finaleDelay = buildEnd + HOLD_MS;

    return {
        id: ++LAYOUT_COUNTER,
        width: W,
        height: H,
        fontSize,
        lineHeight,
        textLeft,
        textTop,
        tracking: trackingOk,
        pieces,
        timeline: {
            n,
            step,
            finaleDelay,
            tagDelay: finaleDelay + 500,
            doneAt: finaleDelay + BURST_MS + 150,
        },
    };
}

// ============================================================
// MODAL DETAIL PROYEK (DARI ProjectDetail.jsx DENGAN CAROUSEL GAMBAR)
// ============================================================
function BrutalProjectDetailModal({ project, onClose }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imgErrorMap, setImgErrorMap] = useState({});

    useEffect(() => {
        setCurrentImageIndex(0);
        setImgErrorMap({});
    }, [project]);

    const images =
        project?.images && project.images.length > 0
            ? project.images
            : [project?.image].filter(Boolean);

    const totalImages = images.length;

    // Navigasi keyboard (ArrowLeft, ArrowRight, Escape)
    useEffect(() => {
        if (!project) return undefined;
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose();
            if (totalImages > 1 && e.key === 'ArrowRight') {
                setCurrentImageIndex((prev) => (prev + 1) % totalImages);
            }
            if (totalImages > 1 && e.key === 'ArrowLeft') {
                setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [project, totalImages, onClose]);

    if (!project) return null;

    const nextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
    };

    const currentSrc = images[currentImageIndex];
    const hasImgError = imgErrorMap[currentImageIndex];
    const toolList = project.tools || project.tags || [];

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-[1150px] max-h-[92vh] overflow-y-auto bg-[#141414] border-2 border-white shadow-[12px_12px_0_#ff1e56] text-white"
            >
                {/* Tombol Close */}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close detail"
                    className="absolute top-4 right-4 z-30 w-11 h-11 bg-black/80 hover:bg-[#ff1e56] text-white border-2 border-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-[4px_4px_0_#0c0c0c]"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* ===========================================
                    AREA CAROUSEL GAMBAR (BESAR & JELAS)
                   =========================================== */}
                <div className="relative w-full h-[300px] sm:h-[440px] md:h-[500px] bg-[#0a0a0a] border-b-2 border-white/20 flex items-center justify-center overflow-hidden">
                    {!hasImgError && currentSrc ? (
                        <img
                            src={currentSrc}
                            alt={`${project.detailTitle || project.name || project.title} - ${currentImageIndex + 1}`}
                            onError={() =>
                                setImgErrorMap((prev) => ({ ...prev, [currentImageIndex]: true }))
                            }
                            className="w-full h-full object-contain bg-[#0a0a0a] select-none"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center p-8">
                            <ImageIcon className="w-12 h-12 text-[#ff1e56] mb-3 opacity-80" />
                            <p className="font-syne font-black text-xl sm:text-2xl uppercase text-white">
                                {project.detailTitle || project.name || project.title}
                            </p>
                            <p className="font-mono text-xs text-zinc-400 mt-2">
                                Slide {currentImageIndex + 1} / {totalImages} — Simpan gambar di folder{' '}
                                <code className="text-[#ff1e56]">src/assets/</code>
                            </p>
                        </div>
                    )}

                    {/* Badge Nomor Slide di Pojok Kiri Atas */}
                    <div className="absolute top-4 left-4 z-20 bg-black/80 border border-white/30 px-3 py-1 font-mono text-xs text-white uppercase tracking-widest">
                        SLIDE {String(currentImageIndex + 1).padStart(2, '0')} /{' '}
                        {String(totalImages).padStart(2, '0')}
                    </div>

                    {/* Tombol Kiri & Kanan (Hanya muncul jika > 1 gambar) */}
                    {totalImages > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={prevImage}
                                aria-label="Previous image"
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/75 hover:bg-[#ff1e56] text-white border-2 border-white/60 hover:border-white flex items-center justify-center transition-all cursor-pointer shadow-[4px_4px_0_#0c0c0c]"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>

                            <button
                                type="button"
                                onClick={nextImage}
                                aria-label="Next image"
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/75 hover:bg-[#ff1e56] text-white border-2 border-white/60 hover:border-white flex items-center justify-center transition-all cursor-pointer shadow-[4px_4px_0_#0c0c0c]"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>

                            {/* Indikator Bar / Dots Gambar */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/80 border border-white/25 px-3.5 py-2">
                                {images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentImageIndex(idx);
                                        }}
                                        aria-label={`Go to slide ${idx + 1}`}
                                        className={`h-2 transition-all duration-300 cursor-pointer ${idx === currentImageIndex
                                            ? 'w-7 bg-[#ff1e56]'
                                            : 'w-2.5 bg-white/35 hover:bg-white/70'
                                            }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* ===========================================
                    KONTEN DETAIL PROYEK
                   =========================================== */}
                <div className="p-6 sm:p-10">
                    {/* Header Kategori, Subtitle & Tahun */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span
                            className="px-3 py-1 font-mono font-bold text-xs uppercase tracking-wider text-black border border-white"
                            style={{ backgroundColor: project.accent || '#ff1e56' }}
                        >
                            {project.category || 'Web Application'}
                        </span>

                        {project.desc && (
                            <span className="px-3 py-1 font-mono text-xs text-zinc-300 bg-white/5 border border-white/15">
                                {project.desc}
                            </span>
                        )}

                        <span className="font-mono text-xs font-bold text-[#ff1e56] ml-auto">
                            YEAR // {project.year || '2025'}
                        </span>
                    </div>

                    {/* Judul Lengkap Proyek */}
                    <h2 className="font-syne font-black text-2xl sm:text-4xl text-white uppercase tracking-tight leading-tight mb-4">
                        {project.detailTitle || project.name || project.title}
                    </h2>

                    {/* Deskripsi Detail Proyek */}
                    <p className="font-sans text-sm sm:text-base text-zinc-300 leading-relaxed mb-8 border-l-2 border-[#ff1e56] pl-4">
                        {project.detailDesc || project.description || project.desc}
                    </p>

                    {/* Tools & Technologies */}
                    <div>
                        <h4 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#ff1e56] mb-3">
                            Tools &amp; Technologies
                        </h4>
                        <div className="flex flex-wrap gap-2.5">
                            {toolList.map((tech, i) => (
                                <span
                                    key={i}
                                    className="px-3.5 py-1.5 font-mono text-xs font-bold uppercase bg-white/5 border border-white/25 text-white shadow-[3px_3px_0_#ff1e56]"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// KARTU PROYEK (2 KOLOM DENGAN THUMBNAIL GAMBAR ASLI)
// ============================================================
function ProjectCard({ project, onOpenDetail }) {
    const [thumbErr, setThumbErr] = useState(false);
    const slideCount = project.images ? project.images.length : 1;
    const toolList = project.tools || project.tags || [];

    return (
        <article
            onClick={() => onOpenDetail(project)}
            className="group relative bg-[#141414] border-2 border-white/20 hover:border-white p-6 sm:p-7 transition-all duration-300 cursor-pointer hover:-translate-y-2 shadow-[0_15px_35px_rgba(0,0,0,0.85)] hover:shadow-[8px_8px_0_#ff1e56] overflow-hidden flex flex-col justify-between"
        >
            {/* Efek Glare Halus */}
            <div className="absolute inset-0 plastic-glare opacity-30 group-hover:opacity-70 transition-opacity pointer-events-none" />

            {/* Header Kartu Proyek */}
            <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-4 pb-3 border-b border-dashed border-white/20 uppercase">
                <span className="font-bold text-white">
                    {project.code || project.category}
                </span>
                <span className="px-2.5 py-0.5 bg-white/10 text-white font-bold">
                    {project.year}
                </span>
            </div>

            {/* Area Gambar Preview Proyek */}
            <div
                className="relative z-10 h-60 sm:h-72 w-full mb-6 overflow-hidden border-2 border-white/20 group-hover:border-white transition-colors bg-[#090909]"
                style={{
                    background: `radial-gradient(circle at 80% 20%, ${project.accent || '#ff1e56'
                        }33 0%, #090909 75%)`,
                }}
            >
                {!thumbErr && project.image ? (
                    <img
                        src={project.image}
                        alt={project.name || project.title}
                        onError={() => setThumbErr(true)}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    /* Fallback Poster jika file gambar belum disalin ke src/assets/ */
                    <div className="w-full h-full p-6 flex flex-col justify-between">
                        <div className="my-auto">
                            <span className="font-mono text-[10px] uppercase tracking-widest text-[#ff1e56] block mb-1">
                                {project.desc}
                            </span>
                            <div className="font-syne font-black text-2xl sm:text-3xl uppercase tracking-tight text-white">
                                {project.name || project.title}
                            </div>
                        </div>
                    </div>
                )}

                {/* Gradient Overlay Halus di Atas Gambar */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                {/* Baris Badge Atas Gambar */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-start justify-between gap-2 pointer-events-none">
                    <span
                        className="px-2.5 py-1 text-[10px] font-syne font-black uppercase tracking-widest text-[#0c0c0c] border border-black shadow-[2px_2px_0_#0c0c0c]"
                        style={{ backgroundColor: project.accent || '#ff1e56' }}
                    >
                        {project.category}
                    </span>

                    <BrutalStar
                        color={project.accent || '#ff1e56'}
                        className="w-7 h-7 group-hover:rotate-45 transition-transform drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
                    />
                </div>

                {/* Baris Info Bawah Gambar */}
                <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-[10px] font-mono text-white">
                    <span className="inline-flex items-center gap-1.5 bg-black/80 border border-white/25 px-2.5 py-1">
                        <Layers className="w-3 h-3 text-[#ff1e56]" />
                        {slideCount} {slideCount > 1 ? 'SCREENSHOTS' : 'SCREENSHOT'}
                    </span>

                    <span className="inline-flex items-center gap-1 bg-[#ff1e56] text-white font-bold px-2.5 py-1 border border-white/40 group-hover:translate-x-1 transition-transform">
                        VIEW DETAILS <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                </div>
            </div>

            {/* Subtitle & Judul Proyek */}
            <div className="relative z-10 mb-3">
                {project.desc && (
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#ff1e56] block mb-1">
                        {project.desc}
                    </span>
                )}
                <h3 className="font-syne font-black text-xl sm:text-2xl uppercase tracking-tight text-white group-hover:text-[#ff1e56] transition-colors leading-snug">
                    {project.name || project.title}
                </h3>
            </div>

            {/* Deskripsi Detail */}
            <p className="relative z-10 font-sans text-xs sm:text-sm text-neutral-300 mb-6 line-clamp-3 leading-relaxed flex-1">
                {project.detailDesc || project.description}
            </p>

            {/* Tools & Technologies Tags */}
            <div className="relative z-10 flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/10">
                {toolList.map((tag) => (
                    <span
                        key={tag}
                        className="text-[10px] sm:text-xs font-mono px-2.5 py-1 bg-white/5 border border-white/15 text-neutral-200 uppercase"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </article>
    );
}

export default function WorksPage() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [detailProject, setDetailProject] = useState(null);
    const [runId, setRunId] = useState(0);
    const [status, setStatus] = useState('pending');
    const [layout, setLayout] = useState(null);
    const [width, setWidth] = useState(0);
    const [phase, setPhase] = useState('done');
    const [placed, setPlaced] = useState(0);
    const [soundOn, setSoundOn] = useState(() => {
        try {
            return window.localStorage.getItem('works-sound') !== 'off';
        } catch {
            return true;
        }
    });

    const wrapRef = useRef(null);
    const probeRef = useRef(null);
    const audioCtxRef = useRef(null);
    const masterRef = useRef(null);
    const soundOnRef = useRef(soundOn);

    useEffect(() => {
        soundOnRef.current = soundOn;
        if (masterRef.current) masterRef.current.setLevel(soundOn ? 1 : 0);
        try {
            window.localStorage.setItem('works-sound', soundOn ? 'on' : 'off');
        } catch {
            /* abaikan */
        }
    }, [soundOn]);

    useEffect(() => {
        return () => {
            const ctx = audioCtxRef.current;
            audioCtxRef.current = null;
            if (ctx) ctx.close().catch(() => { });
        };
    }, []);

    const toggleSound = () => {
        setSoundOn((v) => !v);
        const ctx = audioCtxRef.current;
        if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => { });
    };

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return undefined;
        let timer = 0;
        const measure = () => {
            const w = Math.round(el.clientWidth);
            setWidth((prev) => (Math.abs(prev - w) >= 4 ? w : prev));
        };
        measure();
        if (typeof ResizeObserver === 'undefined') return undefined;
        const ro = new ResizeObserver(() => {
            clearTimeout(timer);
            timer = setTimeout(measure, 200);
        });
        ro.observe(el);
        return () => {
            clearTimeout(timer);
            ro.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!width) return undefined;
        let cancelled = false;
        (async () => {
            try {
                const probe = probeRef.current;
                if (!probe) throw new Error('no probe');
                const cs = window.getComputedStyle(probe);
                if (document.fonts) {
                    try {
                        await document.fonts.load(`${cs.fontWeight} 100px ${cs.fontFamily}`);
                    } catch {
                        /* abaikan */
                    }
                    await document.fonts.ready;
                }
                if (cancelled) return;
                const res = computeLayout(width, cs.fontFamily, cs.fontWeight);
                if (cancelled) return;
                if (res) {
                    setLayout(res);
                    setStatus('ready');
                } else {
                    setStatus('failed');
                }
            } catch {
                if (!cancelled) setStatus('failed');
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [width]);

    useEffect(() => {
        if (!layout) return undefined;
        if (
            typeof window !== 'undefined' &&
            window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
            setPhase('done');
            return undefined;
        }
        const { n, step, finaleDelay, doneAt } = layout.timeline;
        setPhase('build');
        setPlaced(0);
        const timers = [];
        for (let k = 0; k < n; k++) {
            timers.push(setTimeout(() => setPlaced(k + 1), START_MS + k * step + FALL_MS * 0.78));
        }
        timers.push(setTimeout(() => setPhase('finale'), finaleDelay));
        timers.push(setTimeout(() => setPhase('done'), doneAt));

        const startPerf = performance.now();
        let cancelled = false;
        let master = null;
        const ctx = ensureAudioCtx(audioCtxRef);
        const begin = () => {
            if (cancelled || !ctx || ctx.state !== 'running') return;
            master = createMaster(ctx, soundOnRef.current ? 1 : 0);
            masterRef.current = master;
            scheduleRunSounds(ctx, master.input, layout.timeline, performance.now() - startPerf);
        };
        if (ctx) {
            if (ctx.state === 'running') begin();
            else ctx.resume().then(begin).catch(() => { });
        }

        return () => {
            cancelled = true;
            timers.forEach(clearTimeout);
            if (master) {
                master.stop();
                if (masterRef.current === master) masterRef.current = null;
            }
        };
    }, [layout, runId]);

    const filteredProjects =
        selectedCategory === 'All'
            ? PROJECTS_DATA
            : PROJECTS_DATA.filter((p) => p.category === selectedCategory);

    const pad2 = (n) => String(n).padStart(2, '0');
    const ready = status === 'ready' && layout;
    const runKey = ready ? `${layout.id}-${runId}` : `x-${runId}`;
    const tl = ready ? layout.timeline : null;

    const inkStyle = ready
        ? {
            position: 'absolute',
            left: layout.textLeft,
            top: layout.textTop,
            fontSize: layout.fontSize,
            lineHeight: `${layout.lineHeight}px`,
            letterSpacing: layout.tracking ? `${TRACKING_EM}em` : 0,
            whiteSpace: 'nowrap',
        }
        : null;

    let metaRight = `${pad2(PROJECTS_DATA.length)} Projects`;
    if (ready && phase === 'build') {
        metaRight = `Dropping piece ${pad2(Math.max(placed, 1))} / ${pad2(tl.n)}`;
    } else if (ready && phase === 'finale') {
        metaRight = 'All pieces locked';
    }

    return (
        <div className="w-full min-h-screen bg-[#0c0c0c] text-white flex flex-col justify-between animate-fade-in select-none">
            <style>{`
                @keyframes piece-drop {
                    0%   { transform: translateY(var(--from)); opacity: 0; animation-timing-function: cubic-bezier(0.5, 0, 0.85, 0.45); }
                    6%   { opacity: 1; }
                    78%  { transform: translateY(0); animation-timing-function: ease-out; }
                    88%  { transform: translateY(-3px); animation-timing-function: ease-in; }
                    100% { transform: translateY(0); }
                }
                @keyframes piece-lock {
                    0%, 74% { color: #ffffff; }
                    80%     { color: #ff1e56; }
                    100%    { color: #ffffff; }
                }
                @keyframes piece-beam {
                    0%   { opacity: 0; }
                    35%  { opacity: 0.22; }
                    78%  { opacity: 0.22; }
                    100% { opacity: 0; }
                }
                @keyframes piece-burst {
                    from { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
                    to   { transform: translate(var(--dx), var(--dy)) rotate(var(--rot)) scale(var(--bs)); opacity: 0; }
                }
                @keyframes word-slam {
                    0%   { transform: scale(1.18); opacity: 0; }
                    35%  { opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes word-punch {
                    0%   { transform: scale(0.94); opacity: 0; }
                    40%  { transform: scale(1.22); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes rule-draw {
                    from { transform: scaleX(0); }
                    to   { transform: scaleX(1); }
                }
                @keyframes rule-pulse {
                    0%   { transform: scaleY(1); }
                    40%  { transform: scaleY(3.5); }
                    100% { transform: scaleY(1); }
                }
                @keyframes tag-in {
                    from { opacity: 0; transform: translateY(8px) rotate(-1deg); }
                    to   { opacity: 1; transform: translateY(0) rotate(-1deg); }
                }
                @keyframes fade-in-soft {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                .piece {
                    will-change: transform;
                    animation:
                        piece-drop ${FALL_MS}ms linear var(--d1) backwards,
                        piece-burst ${BURST_MS}ms cubic-bezier(0.1, 0.7, 0.3, 1) var(--d2) forwards;
                }
                .piece-ink {
                    animation: piece-lock ${FALL_MS}ms linear var(--d1) backwards;
                }
                .piece-beam {
                    opacity: 0;
                    background: linear-gradient(to bottom, transparent, rgba(255, 30, 86, 0.9));
                    animation: piece-beam ${FALL_MS}ms ease-in var(--d1) backwards;
                }
                .solid-word {
                    opacity: 0;
                    animation-duration: ${SLAM_MS}ms;
                    animation-timing-function: cubic-bezier(0.2, 0.9, 0.2, 1);
                    animation-delay: var(--fd);
                    animation-fill-mode: forwards;
                }
                .fallback-word {
                    animation: fade-in-soft 600ms ease-out backwards;
                }
                .hero-rule {
                    transform-origin: center center;
                    animation:
                        rule-draw ${START_MS}ms cubic-bezier(0.4, 0, 0.2, 1) backwards,
                        rule-pulse 520ms ease-out var(--fd, 99999ms) backwards;
                }
                .hero-rule-inner { transform-origin: left center; }
                .hero-tag {
                    animation: tag-in 500ms ease-out var(--td, 700ms) backwards;
                }
                @media (prefers-reduced-motion: reduce) {
                    .piece, .piece-beam { display: none; }
                    .solid-word { opacity: 1; animation: none; }
                    .hero-rule, .hero-tag, .fallback-word { animation: none; }
                }
            `}</style>

            {/* Kontainer Utama Halaman Works */}
            <main className="relative flex-1 w-full max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-14 pt-28 pb-24">

                {/* =====================================================================
                    1. HERO: SERPIHAN "WORKS" JATUH SEPERTI TETRIS
                   ===================================================================== */}
                <section className="relative w-full mb-20">
                    <div className="flex items-center justify-between pb-4 mb-6 sm:mb-10 border-b border-white/15 font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] text-zinc-400">
                        <span>Index / Selected Works</span>
                        <span className="text-white tabular-nums">{metaRight}</span>
                    </div>

                    <span
                        ref={probeRef}
                        aria-hidden="true"
                        className="font-syne font-black absolute opacity-0 pointer-events-none"
                    >
                        W
                    </span>

                    <div
                        ref={wrapRef}
                        key={runKey}
                        role="img"
                        aria-label="Works"
                        onClick={() => setRunId((n) => n + 1)}
                        title="Klik untuk memutar ulang"
                        className="relative w-full cursor-pointer"
                        style={{
                            height: ready ? layout.height : undefined,
                            minHeight: status === 'pending' ? '9rem' : undefined,
                        }}
                    >
                        {status === 'failed' && (
                            <span
                                aria-hidden="true"
                                className="fallback-word block font-syne font-black uppercase tracking-tighter whitespace-nowrap text-white"
                                style={{ fontSize: FALLBACK_FONT_SIZE, lineHeight: 0.8 }}
                            >
                                {WORD}
                            </span>
                        )}

                        {ready && (
                            <>
                                {layout.pieces.map((p, k) => (
                                    <div key={p.id}>
                                        <div
                                            aria-hidden="true"
                                            className="piece-beam pointer-events-none absolute"
                                            style={{
                                                '--d1': `${START_MS + k * tl.step}ms`,
                                                left: p.minX,
                                                width: p.maxX - p.minX,
                                                top: -BEAM_EXTRA_PX,
                                                height: p.minY + BEAM_EXTRA_PX,
                                            }}
                                        />
                                        <div
                                            aria-hidden="true"
                                            className="piece pointer-events-none absolute inset-0"
                                            style={{
                                                '--d1': `${START_MS + k * tl.step}ms`,
                                                '--d2': `${tl.finaleDelay}ms`,
                                                '--from': `${-(p.minY + SPAWN_EXTRA_PX)}px`,
                                                '--dx': `${p.dx.toFixed(1)}px`,
                                                '--dy': `${p.dy.toFixed(1)}px`,
                                                '--rot': `${p.rot.toFixed(1)}deg`,
                                                '--bs': FINALE_MODE === 'explode' ? 0.6 : 1,
                                                clipPath: `path('${p.path}')`,
                                                transformOrigin: `${p.cx}px ${p.cy}px`,
                                            }}
                                        >
                                            <span
                                                className="piece-ink font-syne font-black uppercase text-white"
                                                style={inkStyle}
                                            >
                                                {WORD}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                <div
                                    aria-hidden="true"
                                    className="solid-word pointer-events-none absolute inset-0"
                                    style={{
                                        '--fd': `${tl.finaleDelay}ms`,
                                        animationName:
                                            FINALE_MODE === 'explode' ? 'word-slam' : 'word-punch',
                                        transformOrigin: '50% 50%',
                                    }}
                                >
                                    <span
                                        className="font-syne font-black uppercase text-white"
                                        style={inkStyle}
                                    >
                                        {WORD}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                    <div
                        key={`rule-${runKey}`}
                        aria-hidden="true"
                        className="hero-rule w-full h-[3px] mt-6 sm:mt-8"
                        style={ready ? { '--fd': `${tl.finaleDelay}ms` } : undefined}
                    >
                        <div className="hero-rule-inner w-full h-full bg-[#ff1e56]" />
                    </div>

                    <div className="flex items-center justify-between gap-4 mt-6">
                        <span
                            key={`tag-${runKey}`}
                            className="hero-tag font-marker text-lg sm:text-2xl text-[#ff1e56] -rotate-1"
                            style={ready ? { '--td': `${tl.tagDelay}ms` } : undefined}
                        >
                            &ldquo;Crafted with Code, Logic &amp; Grit&rdquo;
                        </span>
                        <div className="flex items-center gap-5 font-mono text-[10px] uppercase tracking-[0.25em]">
                            <span className="hidden sm:block text-zinc-600">Click to replay</span>
                            <button
                                type="button"
                                onClick={toggleSound}
                                aria-pressed={soundOn}
                                title="Nyalakan atau matikan suara"
                                className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
                            >
                                Sound:{' '}
                                <span className={soundOn ? 'text-[#ff1e56]' : ''}>
                                    {soundOn ? 'On' : 'Off'}
                                </span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* =====================================================================
                    2. BARIS FILTER KATEGORI & SUB-HEADER SHOWCASE
                   ===================================================================== */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
                    <div>
                        <FireSectionBadge number="3" label="LATEST PROJECTS" />
                        <p className="font-mono text-xs text-zinc-400 mt-2 max-w-lg">
                            My recent work and projects — click any project card to inspect full screenshots and technical architecture.
                        </p>
                    </div>

                    {/* Filter Kategori Brutalist */}
                    <div className="flex flex-wrap gap-2">
                        {PROJECT_CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider border-2 transition-all cursor-pointer ${selectedCategory === cat
                                    ? 'bg-[#ff1e56] text-white border-[#ff1e56] font-bold shadow-[4px_4px_0px_white]'
                                    : 'bg-[#141414] text-neutral-300 border-zinc-700 hover:border-white hover:text-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* =====================================================================
                    3. GRID PROYEK (2 CARD PER KOLOM DENGAN PREVIEW GAMBAR)
                   ===================================================================== */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
                    {filteredProjects.map((project) => (
                        <ProjectCard
                            key={project.id || project.name}
                            project={project}
                            onOpenDetail={setDetailProject}
                        />
                    ))}
                </div>
            </main>

            {/* =====================================================================
                4. MODAL DETAIL PROYEK DENGAN IMAGE SLIDER (ProjectDetail)
               ===================================================================== */}
            <BrutalProjectDetailModal
                project={detailProject}
                onClose={() => setDetailProject(null)}
            />
        </div>
    );
}