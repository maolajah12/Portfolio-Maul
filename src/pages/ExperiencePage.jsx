import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Award, Maximize2, X, Building2, CheckCircle2 } from 'lucide-react';
import { BrutalStar, Barcode } from '../components/decor';
import {
    MAGANG, SERTIFIKAT, STAR8, STAR12, RED, clamp, rnd, CRUMPLED_SURFACE_STYLE,
    HERO_PHASES, WALK_MS, T_WAVE, T_CRACK, T_OPEN, T_DONE, STOP_X,
    CRACK, upperClip, lowerClip, SHARDS, CONFETTI, ROAD_BG, UNDER_BG, DASH, abs, T, HERO_CSS,
} from '../data/experience.js';

/* ====================== HERO JUDUL EXPERIENCE ====================== */

// ---------- Kata EXPERIENCE sebagai potongan kertas ala kolase ----------
function CutoutWord({ word, pop = false, baseDelay = 0 }) {
    const outer = useRef(null);
    const inner = useRef(null);
    const [scale, setScale] = useState(1);

    useLayoutEffect(() => {
        const fit = () => {
            const o = outer.current, n = inner.current;
            if (!o || !n || !n.offsetWidth) return;
            setScale(Math.min(1, (o.clientWidth * 0.96) / n.offsetWidth));
        };
        fit();
        const ro = new ResizeObserver(fit);
        ro.observe(outer.current);
        document.fonts?.ready.then(fit);
        return () => ro.disconnect();
    }, [word]);

    return (
        <div ref={outer} aria-hidden="true" className="flex justify-center" style={{ width: '100%', padding: '1rem 0' }}>
            <div
                ref={inner}
                className="font-bbh font-black text-[15vw] sm:text-[10vw] md:text-[8vw] tracking-tighter uppercase"
                style={{ display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap', lineHeight: 1.05, transform: `scale(${scale})`, transformOrigin: 'center' }}
            >
                {word.split('').map((ch, i) => {
                    const kind = i % 3;
                    const rot = (rnd(i, 21) - 0.5) * 9;
                    const dy = (rnd(i, 22) - 0.5) * 8;
                    const look =
                        kind === 0 ? { color: '#fff' }
                            : kind === 1 ? { color: '#0c0c0c', backgroundColor: '#f4f1ea', padding: '0 .1em', margin: '0 .03em' }
                                : { color: 'transparent', WebkitTextStroke: 'clamp(1.5px,.22vw,3.5px) #fff' };
                    return (
                        <span
                            key={i}
                            className="ex-letter"
                            style={{ display: 'inline-block', pointerEvents: 'auto', animation: pop ? `ex-pop .85s cubic-bezier(.2,1.5,.35,1) ${(baseDelay + i * 0.07).toFixed(2)}s both` : undefined }}
                        >
                            <span style={{ display: 'inline-block', transform: `translateY(${dy}%) rotate(${rot}deg)` }}>
                                <span className={`ex-glyph${kind === 1 ? ' crumpled-paper' : ''}`} style={{ display: 'inline-block', position: 'relative', animationDelay: `${(-i * 0.31).toFixed(2)}s`, ...look }}>
                                    {ch}
                                    {kind === 1 && <i aria-hidden="true" className="ex-tape" style={{ top: '-0.1em', width: '.45em', height: '.13em' }} />}
                                </span>
                            </span>
                        </span>
                    );
                })}
            </div>
        </div>
    );
}

function Walker({ pose }) {
    const common = { viewBox: '0 0 60 120', fill: 'none', stroke: '#fff', strokeWidth: 6, strokeLinecap: 'round', strokeLinejoin: 'round' };
    const style = { height: 'var(--wh)', width: 'auto', display: 'block', overflow: 'visible' };
    const head = (cx) => (
        <g>
            <g transform={`translate(${cx} 18) scale(0.34) translate(-50 -50)`}>
                <polygon points={STAR12} fill={RED} stroke="#0c0c0c" strokeWidth="6" strokeLinejoin="round" />
            </g>
            <text x={cx} y="21.5" textAnchor="middle" fontSize="9.5" fill="#fff" stroke="none" className="font-brush">ME</text>
        </g>
    );
    if (pose === 'walk') {
        return (
            <svg {...common} style={style} aria-hidden="true">
                <g className="ex-bob">
                    <g className="ex-limb ex-leg-b" stroke="#7d7d7d"><path d="M30 70 L30 104 L41 104" /></g>
                    <g className="ex-limb ex-arm-b" stroke="#7d7d7d"><path d="M30 38 L30 66" /></g>
                    <path d="M30 34 L30 70" strokeWidth="8" />
                    <g className="ex-limb ex-leg-a"><path d="M30 70 L30 104 L41 104" /></g>
                    <g className="ex-limb ex-arm-a"><path d="M30 38 L30 66" /></g>
                    {head(30)}
                </g>
            </svg>
        );
    }
    return (
        <svg {...common} style={style} aria-hidden="true">
            <g className="ex-bob-slow">
                <path d="M30 70 L21 104 L12 104" />
                <path d="M30 70 L39 104 L48 104" />
                <path d="M30 34 L30 70" strokeWidth="8" />
                <path d="M30 38 L19 64" />
                <path d="M30 38 L43 27" />
                <g className="ex-forearm"><path d="M43 27 L47 7" /></g>
                {head(30)}
            </g>
        </svg>
    );
}

function Spinner({ style, delay, spin, instant, children }) {
    return (
        <div aria-hidden="true" style={{ ...abs, pointerEvents: 'none', ...style, animation: instant ? 'none' : `ex-star-in .6s cubic-bezier(.2,1.6,.4,1) ${delay}s both` }}>
            <div style={{ width: '100%', height: '100%', animation: `ex-spin ${spin}s linear infinite` }}>{children}</div>
        </div>
    );
}

function WordOrnaments({ instant, years }) {
    const sz = (a, b, c) => ({ width: `clamp(${a}px,${b}vw,${c}px)`, height: `clamp(${a}px,${b}vw,${c}px)` });
    return (
        <>
            {!instant && CONFETTI.map((s, i) => (
                <span
                    key={i}
                    aria-hidden="true"
                    style={{
                        ...abs, left: `${s.left}%`, top: '50%', width: s.w, height: s.w * 0.55, pointerEvents: 'none', background: s.c,
                        '--dx': `${s.dx}vw`, '--dy': `${s.dy}vw`, '--rot': `${s.rot}deg`,
                        animation: `ex-spark 1.4s ease-out ${s.delay.toFixed(2)}s both`,
                    }}
                />
            ))}

            <Spinner instant={instant} delay={0.9} spin={10} style={{ left: '-2%', top: '-34%', ...sz(30, 4.6, 72) }}>
                <BrutalStar color="white" points={12} className="w-full h-full" />
            </Spinner>
            <Spinner instant={instant} delay={1.15} spin={14} style={{ right: '-1%', top: '-36%', ...sz(24, 3.6, 56) }}>
                <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: 'visible' }}>
                    <polygon points={STAR8} fill="#0c0c0c" stroke="#fff" strokeWidth="5" strokeLinejoin="round" />
                </svg>
            </Spinner>

            <span aria-hidden="true" style={{ ...abs, left: '10%', top: '-30%', width: 'clamp(54px,6vw,96px)', height: 'clamp(16px,1.8vw,28px)', background: 'rgba(254,228,64,0.88)', transform: 'rotate(-7deg)', boxShadow: '0 2px 3px rgba(0,0,0,.35)', animation: instant ? 'none' : 'ex-star-in .5s cubic-bezier(.2,1.6,.4,1) 1s both' }} />
            <span aria-hidden="true" style={{ ...abs, right: '17%', top: '-32%', width: 'clamp(54px,6vw,96px)', height: 'clamp(16px,1.8vw,28px)', background: 'rgba(254,228,64,0.88)', transform: 'rotate(5deg)', boxShadow: '0 2px 3px rgba(0,0,0,.35)', animation: instant ? 'none' : 'ex-star-in .5s cubic-bezier(.2,1.6,.4,1) 1.1s both' }} />

            <span className="font-marker ex-sm-hide" style={{ ...abs, left: '3%', bottom: '-30%', color: '#0c0c0c', fontSize: 'clamp(14px,1.9vw,30px)', transform: 'rotate(-4deg)', whiteSpace: 'nowrap', pointerEvents: 'none', animation: instant ? 'none' : 'ex-fade .5s ease-out 1.5s both' }}>
                {years}
            </span>

            <div aria-hidden="true" className="ex-sm-hide" style={{ ...abs, right: '12%', bottom: '-30%', pointerEvents: 'none', animation: instant ? 'none' : 'ex-fade .5s ease-out 1.6s both' }}>
                <Barcode className="h-6 sm:h-8 opacity-90" />
            </div>

            <svg aria-hidden="true" viewBox="0 0 600 40" preserveAspectRatio="none" style={{ ...abs, left: '14%', width: '72%', bottom: '-14%', height: 'clamp(12px,1.8vw,28px)', pointerEvents: 'none', overflow: 'visible' }}>
                <path
                    d="M6 24 C 80 6, 150 36, 230 16 S 380 32, 450 12 S 560 28, 594 14"
                    fill="none" stroke="#0c0c0c" strokeWidth="8" strokeLinecap="round" pathLength="1"
                    style={{ strokeDasharray: 1, strokeDashoffset: 0, animation: instant ? 'none' : 'ex-draw .9s ease-out 1.3s both' }}
                />
            </svg>
        </>
    );
}

function HeroStage({ onReplay, years }) {
    const reduce = typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const [phase, setPhase] = useState(reduce ? 'done' : 'walk');
    const [instant, setInstant] = useState(reduce);

    useEffect(() => {
        if (instant) return undefined;
        const ts = [[T_WAVE, 'wave'], [T_CRACK, 'crack'], [T_OPEN, 'open'], [T_DONE, 'done']].map(([ms, p]) => setTimeout(() => setPhase(p), ms));
        return () => ts.forEach(clearTimeout);
    }, [instant]);

    const idx = HERO_PHASES.indexOf(phase);
    const cracked = idx >= 2;
    const opened = idx >= 3;
    const done = phase === 'done';
    const pose = idx === 0 ? 'walk' : 'wave';

    const act = () => {
        if (done) onReplay();
        else { setInstant(true); setPhase('done'); }
    };

    const slabTransition = instant ? 'none' : 'transform .9s cubic-bezier(.2,1.2,.3,1)';
    const clipTransition = instant ? 'none' : 'clip-path .3s ease-out';

    return (
        <>
            <div
                role="button"
                tabIndex={0}
                aria-label={done ? 'Replay animation' : 'Skip animation'}
                onClick={act}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); } }}
                className="ex-bleed focus-visible:outline-none"
                style={{
                    '--band': 'clamp(120px, 17vw, 300px)', '--wh': 'clamp(72px, 11vw, 170px)',
                    position: 'relative', height: `calc(${T} + var(--band) * 1.85 + 8px)`,
                    overflowX: 'clip', cursor: 'pointer', userSelect: 'none',
                    animation: phase === 'crack' && !instant ? 'ex-shake .12s linear 5' : 'none',
                }}
            >
                {opened && (
                    <div aria-hidden="true" style={{ ...abs, left: 0, right: 0, top: `calc(${T} - var(--band) * 0.14)`, height: 'calc(var(--band) * 1.28)', zIndex: 1, background: UNDER_BG, animation: instant ? 'none' : 'ex-under .8s cubic-bezier(.2,.9,.2,1) both' }} />
                )}

                {opened && (
                    <div className="ex-padx" style={{ ...abs, left: 0, right: 0, top: T, height: 'var(--band)', zIndex: 3, display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
                        <div style={{ position: 'relative', width: '100%' }}>
                            <div style={{ filter: 'drop-shadow(5px 5px 0 #0c0c0c)' }}>
                                <CutoutWord word="EXPERIENCE" pop={!instant} baseDelay={0.2} />
                            </div>
                            <WordOrnaments instant={instant} years={years} />
                        </div>
                    </div>
                )}

                <div style={{ ...abs, left: 0, right: 0, top: T, height: 'calc(var(--band) * 0.6)', zIndex: 2, transformOrigin: '50% 100%', transition: slabTransition, transform: opened ? 'translateY(calc(var(--band) * -0.62)) rotate(-0.6deg)' : 'none' }}>
                    <div aria-hidden="true" style={{ ...abs, left: 0, right: 0, top: 7, bottom: -7, background: '#f2f2f2', clipPath: upperClip(cracked), opacity: cracked ? 1 : 0 }} />
                    <div style={{ ...abs, inset: 0, background: ROAD_BG, clipPath: upperClip(cracked), transition: clipTransition }}>
                        <div style={{ ...abs, left: 0, right: 0, top: 0, height: 3, background: 'rgba(255,255,255,0.4)' }} />
                    </div>
                </div>

                <div style={{ ...abs, left: 0, right: 0, top: `calc(${T} + var(--band) * 0.4)`, height: 'calc(var(--band) * 0.6)', zIndex: 5, transformOrigin: '50% 0', transition: slabTransition, transform: opened ? 'translateY(calc(var(--band) * 0.8)) rotate(0.5deg)' : 'none' }}>
                    <div aria-hidden="true" style={{ ...abs, left: 0, right: 0, top: -7, bottom: 7, background: '#f2f2f2', clipPath: lowerClip(cracked), opacity: cracked ? 1 : 0 }} />
                    <div style={{ ...abs, inset: 0, background: ROAD_BG, clipPath: lowerClip(cracked), transition: clipTransition }}>
                        <div style={{ ...abs, left: 0, right: 0, bottom: 0, height: 3, background: 'rgba(255,255,255,0.4)' }} />
                        <div style={{ ...abs, left: 0, right: 0, top: 'calc(var(--band) * 0.1 - 2px)', height: 4, background: DASH('rgba(255,255,255,0.55)'), opacity: cracked ? 0 : 1, transition: 'opacity .15s' }} />
                        <div style={{ ...abs, left: 0, top: 'calc(var(--band) * 0.1 - 2px)', height: 4, width: `${STOP_X}%`, background: DASH(RED), opacity: cracked ? 0 : 1, transition: 'opacity .15s', animation: instant ? 'none' : `ex-trail ${WALK_MS}ms cubic-bezier(.3,.05,.45,1) both` }} />
                    </div>

                    <div className="ex-walker" style={{ bottom: 'calc(var(--band) * 0.12)', animation: instant ? 'none' : `ex-walk-x ${WALK_MS}ms cubic-bezier(.3,.05,.45,1) both` }}>
                        <div aria-hidden="true" style={{ ...abs, left: '-30%', right: '-30%', bottom: -3, height: 7, borderRadius: '50%', background: 'rgba(0,0,0,0.65)', filter: 'blur(2px)' }} />
                        {idx >= 1 && (
                            <span key={opened ? 'b' : 'a'} className="ex-bubble crumpled-paper" style={instant ? { animation: 'none' } : undefined}>
                                <i aria-hidden="true" className="ex-tape" />
                                {opened ? 'here it is!' : 'hey!'}
                            </span>
                        )}
                        <div key={pose} className={pose === 'wave' && !instant ? 'ex-hop' : undefined}>
                            <Walker pose={pose} />
                        </div>
                    </div>
                </div>

                {phase === 'crack' && (
                    <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ ...abs, left: 0, width: '100%', top: T, height: 'var(--band)', zIndex: 6, pointerEvents: 'none', overflow: 'visible' }}>
                        <path
                            d={CRACK.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y * 100}`).join(' ')}
                            fill="none" stroke={RED} strokeWidth="4" vectorEffect="non-scaling-stroke" strokeLinejoin="round" pathLength="1"
                            style={{ strokeDasharray: 1, filter: `drop-shadow(0 0 6px ${RED})`, animation: 'ex-draw .5s ease-out both' }}
                        />
                    </svg>
                )}

                {cracked && !instant && SHARDS.map((d, i) => (
                    <span
                        key={i}
                        aria-hidden="true"
                        style={{
                            ...abs, left: `${d.left}%`, top: `calc(${T} + var(--band) * 0.5)`, width: d.w, height: d.h, zIndex: 6, pointerEvents: 'none', background: d.c,
                            '--dx': `${d.dx}vw`, '--dy': `${d.dy}vw`, '--rot': `${d.rot}deg`,
                            animation: `ex-debris 1.1s ease-out ${d.delay.toFixed(2)}s both`,
                        }}
                    />
                ))}
            </div>
            <p className="text-center font-signature text-sm text-neutral-500 select-none -mt-2">
                {done ? 'click to replay' : 'click to skip'}
            </p>
        </>
    );
}

// Hero judul: orang berjalan, jalan terkoyak, kata EXPERIENCE muncul.
function RoadHero({ years }) {
    const [runId, setRunId] = useState(0);
    return (
        <div>
            <style>{HERO_CSS}</style>
            <HeroStage key={runId} years={years} onReplay={() => setRunId((r) => r + 1)} />
        </div>
    );
}

/* ====================== KARTU, ROADMAP & HALAMAN ====================== */

function InternshipCard({ stop, tilt }) {
    const [logoErr, setLogoErr] = useState(false);

    return (
        <article
            className="relative w-full max-w-lg crumpled-paper text-black p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.95)] border-2 border-black font-sans-tech"
            style={{
                ...CRUMPLED_SURFACE_STYLE,
                transform: `rotate(${tilt}deg)`,
            }}
        >
            {/* Lakban Kuning di Atas */}
            <span
                aria-hidden="true"
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#fee440]/90 rotate-2 shadow-sm border border-black/15"
            />

            {/* Catatan Spidol Merah di Kanan Bawah */}
            {stop.note && (
                <span className="absolute -bottom-6 right-4 font-brush text-lg text-[#ff1e56] -rotate-3 pointer-events-none drop-shadow-[1px_1px_0_#0c0c0c]">
                    {stop.note}
                </span>
            )}

            {/* Header Kartu: Info Periode & Bingkai Logo Perusahaan */}
            <div className="flex items-start justify-between gap-4 mb-3">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 font-mono font-bold text-xs text-neutral-800">
                        <span className="bg-[#0c0c0c] text-white px-2 py-0.5">{stop.period}</span>
                        <span className="text-[11px] font-normal text-neutral-600">({stop.duration})</span>
                    </div>
                    <h3 className="font-display font-black text-xl sm:text-2xl leading-tight mt-2 text-[#0c0c0c]">
                        {stop.role}
                    </h3>
                    <p className="text-sm font-bold text-neutral-900 mt-0.5">{stop.org}</p>
                    <p className="text-[11px] italic text-neutral-600">
                        {stop.type} • {stop.place}
                    </p>
                </div>

                {/* BINGKAI LOGO PERUSAHAAN */}
                <div
                    className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-none bg-white border-2 border-[#0c0c0c] shadow-[4px_4px_0_#ff1e56] flex items-center justify-center p-1.5 shrink-0 overflow-hidden"
                    title={`Logo ${stop.org}`}
                >
                    {!logoErr && stop.logo ? (
                        <img
                            src={stop.logo}
                            alt={stop.org}
                            onError={() => setLogoErr(true)}
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-[#0c0c0c] text-white">
                            <Building2 className="w-4 h-4 text-[#ff1e56] mb-0.5" />
                            <span className="font-mono font-black text-[10px] tracking-tighter leading-none">
                                {stop.logoFallback || 'ORG'}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Daftar Tugas & Pencapaian */}
            <ul className="text-xs text-neutral-800 space-y-1.5 pl-3 border-l-2 border-[#ff1e56] my-3 leading-relaxed">
                {stop.points.map((p, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                        <span className="font-bold text-[#ff1e56] shrink-0">•</span>
                        <span>{p}</span>
                    </li>
                ))}
            </ul>

            {/* Tech Stack & Tools */}
            <div className="flex flex-wrap gap-1.5 mt-4">
                {stop.stack.map((t) => (
                    <span
                        key={t}
                        className="bg-black/5 border border-black/60 px-2 py-0.5 text-[10px] font-mono font-bold uppercase"
                    >
                        {t}
                    </span>
                ))}
            </div>

            <div className="border-t-2 border-dashed border-black/40 my-4" />
            <Barcode className="h-7 opacity-80" color="#0c0c0c" />
        </article>
    );
}

// ---------- Tiket Sertifikat (Plastik Abu-Biru + Foto Sertifikat di Atas) ----------
function CertificateTicket({ stop, tilt = 0, onPreview }) {
    const [imgErr, setImgErr] = useState(false);

    return (
        <article
            onClick={() => onPreview(stop)}
            className="group relative flex flex-col w-full bg-[#87939a] text-black shadow-[0_20px_50px_rgba(0,0,0,0.85)] border-2 border-white/25 hover:border-white overflow-hidden font-sans-tech cursor-pointer transition-all duration-300 hover:-translate-y-1.5"
            style={{ transform: `rotate(${tilt}deg)` }}
        >
            {/* Efek Kilap Plastik */}
            <div aria-hidden="true" className="absolute inset-0 plastic-glare pointer-events-none z-10" />

            {/* ==================== BAGIAN ATAS: BINGKAI FOTO SERTIFIKAT ==================== */}
            <div className="relative z-20 p-3 pb-3.5 bg-[#76828a] border-b-2 border-dashed border-black/50">
                {/* Coakan Tiket Kiri & Kanan di Garis Putus-putus */}
                <span
                    aria-hidden="true"
                    className="absolute -left-2.5 -bottom-2.5 w-5 h-5 rounded-full bg-[#0c0c0c] z-30"
                />
                <span
                    aria-hidden="true"
                    className="absolute -right-2.5 -bottom-2.5 w-5 h-5 rounded-full bg-[#0c0c0c] z-30"
                />

                <div className="relative aspect-[16/10] w-full bg-[#121316] border-2 border-[#0c0c0c] overflow-hidden shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]">
                    {!imgErr && stop.image ? (
                        <img
                            src={stop.image}
                            alt={stop.title}
                            onError={() => setImgErr(true)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        /* Fallback Visual Dokumen Sertifikat jika file foto belum dimasukkan ke public/certificates/ */
                        <div className="w-full h-full p-4 flex flex-col justify-between bg-gradient-to-br from-[#f4f1ea] via-[#e6e2d8] to-[#d6d1c4] text-[#0c0c0c] relative">
                            <div className="border border-black/30 p-2.5 h-full flex flex-col justify-between relative">
                                <div className="flex items-center justify-between border-b border-black/20 pb-1.5">
                                    <span className="font-mono font-black text-[9px] tracking-[0.2em] uppercase text-[#ff1e56]">
                                        OFFICIAL CERTIFICATE
                                    </span>
                                    <Award className="w-4 h-4 text-[#0c0c0c]" />
                                </div>

                                <div className="my-auto text-center px-2">
                                    <p className="font-mono text-[8px] uppercase tracking-widest text-neutral-600">
                                        {stop.issuer}
                                    </p>
                                    <p className="font-display font-black text-xs sm:text-sm uppercase leading-tight mt-1 line-clamp-2">
                                        {stop.title}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between text-[8px] font-mono text-neutral-700 pt-1 border-t border-black/15">
                                    <span>MAULANA AL GHIFARI</span>
                                    <span className="font-bold">{stop.month} {stop.year}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Overlay Tombol Zoom saat Hover */}
                    <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <span className="inline-flex items-center gap-1.5 bg-[#ff1e56] text-white font-mono font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 border border-white shadow-[3px_3px_0_#0c0c0c]">
                            <Maximize2 className="w-3.5 h-3.5" />
                            Inspect Certificate
                        </span>
                    </div>
                </div>
            </div>

            {/* ==================== BAGIAN BAWAH: TIKET SERTIFIKAT ASLI ==================== */}
            <div className="relative flex flex-1">
                {/* Coakan Tiket Atas & Bawah pada Garis Vertikal */}
                <span aria-hidden="true" className="absolute left-[4.5rem] -bottom-2.5 -translate-x-1/2 w-5 h-5 rounded-full bg-[#0c0c0c] z-20" />

                {/* Kolom Kiri: Bulan & Tahun */}
                <div className="relative z-20 w-[4.5rem] shrink-0 flex flex-col items-center justify-center border-r-2 border-dashed border-black/50 py-5">
                    <span className="font-marker text-[#ff1e56] text-sm -rotate-6">{stop.month}</span>
                    <span className="font-display font-black text-2xl leading-none mt-1">{stop.year.slice(2)}</span>
                </div>

                {/* Kolom Kanan: Detail Sertifikat */}
                <div className="relative z-20 p-4 sm:p-5 min-w-0 flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-[11px] italic text-neutral-800">certificate</p>
                            <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold bg-black/15 px-1.5 py-0.5 text-neutral-900">
                                <CheckCircle2 className="w-2.5 h-2.5 text-[#ff1e56]" /> VERIFIED
                            </span>
                        </div>

                        <h3 className="font-display font-black text-base sm:text-lg leading-snug mt-0.5 group-hover:text-white transition-colors">
                            {stop.title}
                        </h3>
                        <p className="text-xs font-bold text-neutral-900 mt-1">{stop.issuer}</p>
                        <p className="text-[11px] font-medium text-neutral-800/90 mt-1.5">{stop.credential}</p>
                        {stop.skills && (
                            <p className="text-[10px] text-neutral-900/80 mt-1.5 line-clamp-2 border-l-2 border-black/40 pl-2">
                                {stop.skills}
                            </p>
                        )}
                    </div>

                    {stop.url && (
                        <a
                            href={stop.url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-xs font-bold bg-black text-white px-3 py-1.5 mt-3 hover:bg-[#ff1e56] focus-visible:bg-[#ff1e56] focus-visible:outline-none transition-colors w-max"
                        >
                            View Credential <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                    )}
                </div>

                <BrutalStar color="white" points={12} className="w-8 h-8 absolute bottom-2 right-2 z-20 opacity-90" />
            </div>
        </article>
    );
}

// Lightbox foto sertifikat. Dipasang dengan key={cert.title} agar status gambar reset tiap sertifikat.
function CertificatePreviewModal({ cert, onClose }) {
    const [modalImgErr, setModalImgErr] = useState(false);

    return (
        <div
            onClick={() => onClose()}
            className="fixed inset-0 z-[90] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 select-none"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-3xl bg-[#87939a] text-[#0c0c0c] border-4 border-white p-5 sm:p-7 shadow-[14px_14px_0_#ff1e56]"
            >
                <button
                    type="button"
                    onClick={() => onClose()}
                    className="absolute -top-4 -right-4 w-10 h-10 bg-[#ff1e56] text-white border-2 border-black flex items-center justify-center hover:bg-black transition-colors cursor-pointer shadow-[3px_3px_0_#0c0c0c]"
                    aria-label="Close preview"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center justify-between font-mono text-xs font-bold border-b-2 border-dashed border-black/50 pb-3 mb-4">
                    <span>ISSUED // {cert.month.toUpperCase()} {cert.year}</span>
                    <span className="bg-[#0c0c0c] text-white px-2.5 py-0.5">
                        {cert.issuer}
                    </span>
                </div>

                <div className="aspect-[16/10] w-full bg-[#121316] border-2 border-[#0c0c0c] overflow-hidden mb-5 flex items-center justify-center">
                    {!modalImgErr && cert.image ? (
                        <img
                            src={cert.image}
                            alt={cert.title}
                            onError={() => setModalImgErr(true)}
                            className="w-full h-full object-contain bg-black"
                        />
                    ) : (
                        <div className="w-full h-full p-8 flex flex-col justify-between bg-[#f4f1ea] text-[#0c0c0c] text-center">
                            <div className="border-2 border-black p-6 h-full flex flex-col justify-between">
                                <span className="font-mono font-bold text-xs tracking-[0.25em] text-[#ff1e56] uppercase">
                                    CERTIFICATE OF COMPLETION
                                </span>
                                <div className="my-auto">
                                    <p className="font-mono text-xs uppercase text-neutral-600 mb-1">
                                        {cert.issuer}
                                    </p>
                                    <h4 className="font-display font-black text-2xl sm:text-3xl uppercase">
                                        {cert.title}
                                    </h4>
                                    <p className="font-mono text-xs text-neutral-700 mt-3">
                                        Awarded to: <strong>Maulana Al Ghifari, AMd.Kom</strong>
                                    </p>
                                </div>
                                <p className="font-mono text-[11px] text-neutral-500">
                                    Simpan file gambar di: <code>public{cert.image}</code>
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <h3 className="font-display font-black text-xl sm:text-2xl uppercase text-[#0c0c0c]">
                    {cert.title}
                </h3>
                <p className="font-sans-tech text-xs sm:text-sm font-bold text-neutral-900 mt-1">
                    {cert.issuer} — {cert.credential}
                </p>
                {cert.skills && (
                    <p className="font-sans-tech text-xs text-neutral-800 mt-2 leading-relaxed">
                        <strong>Skills Validated:</strong> {cert.skills}
                    </p>
                )}
            </div>
        </div>
    );
}

// ---------- Roadmap magang: jalan berkelok yang menyala mengikuti scroll ----------
function Road({ stops }) {
    const wrap = useRef(null);
    const rows = useRef([]);
    const road = useRef(null);
    const [geo, setGeo] = useState(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    const measure = () => {
        const c = wrap.current;
        if (!c || rows.current.length !== stops.length || rows.current.some((r) => !r)) return;
        const w = c.clientWidth;
        const mobile = w < 768;
        const pts = rows.current.map((el, i) => ({
            x: mobile ? 20 : w / 2 + (i % 2 === 0 ? -38 : 38),
            y: el.offsetTop + el.offsetHeight / 2,
        }));
        setGeo({ w, h: c.clientHeight, mobile, pts });
    };

    useLayoutEffect(() => {
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(wrap.current);
        document.fonts?.ready.then(measure);
        return () => ro.disconnect();
    }, [stops.length]);

    useEffect(() => {
        let raf = 0;
        const track = () => {
            const c = wrap.current, p = road.current;
            if (!c || !p) return;
            const r = c.getBoundingClientRect();
            const t = clamp((window.innerHeight * 0.55 - r.top) / r.height, 0, 1);
            const pt = p.getPointAtLength(p.getTotalLength() * t);
            setPos({ x: pt.x, y: pt.y });
        };
        const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(track); };
        on();
        window.addEventListener('scroll', on, { passive: true });
        window.addEventListener('resize', on);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('scroll', on);
            window.removeEventListener('resize', on);
        };
    }, [geo]);

    const d = useMemo(() => {
        if (!geo) return '';
        const all = [{ x: geo.pts[0].x, y: 0 }, ...geo.pts, { x: geo.pts[geo.pts.length - 1].x, y: geo.h }];
        let s = `M${all[0].x} ${all[0].y}`;
        for (let i = 1; i < all.length; i++) {
            const a = all[i - 1], b = all[i], m = (a.y + b.y) / 2;
            s += ` C${a.x} ${m} ${b.x} ${m} ${b.x} ${b.y}`;
        }
        return s;
    }, [geo]);

    return (
        <div ref={wrap} className="relative">
            {geo && (
                <svg aria-hidden="true" className="absolute inset-0 pointer-events-none z-0" width={geo.w} height={geo.h}>
                    <defs>
                        <clipPath id="road-reached"><rect x="0" y="0" width={geo.w} height={pos.y} /></clipPath>
                    </defs>
                    <path d={d} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={geo.mobile ? 26 : 38} strokeLinecap="round" />
                    <path d={d} fill="none" stroke="#0c0c0c" strokeWidth={geo.mobile ? 23 : 35} strokeLinecap="round" />
                    <path ref={road} d={d} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2" strokeDasharray="9 11" />
                    <path d={d} fill="none" stroke={RED} strokeWidth="3.5" strokeDasharray="9 11" clipPath="url(#road-reached)" />

                    {geo.pts.map((p, i) => {
                        const cardRight = i % 2 === 0;
                        const edge = geo.mobile ? 44 : geo.w / 2 + (cardRight ? 70 : -70);
                        const on = pos.y >= p.y;
                        return (
                            <g key={i}>
                                <line x1={p.x} y1={p.y} x2={edge} y2={p.y} stroke={on ? RED : 'rgba(255,255,255,0.3)'} strokeWidth="2" strokeDasharray="3 5" />
                                <polygon points={STAR8} transform={`translate(${p.x - 17} ${p.y - 17}) scale(0.34)`} fill={on ? RED : '#fff'} stroke="#0c0c0c" strokeWidth="6" strokeLinejoin="round" />
                            </g>
                        );
                    })}

                    <g transform={`translate(${pos.x} ${pos.y})`}>
                        <polygon points={STAR12} transform="translate(-24 -24) scale(0.48)" fill={RED} stroke="#0c0c0c" strokeWidth="5" strokeLinejoin="round" />
                        <text textAnchor="middle" dy="5" fontSize="13" fill="#fff" className="font-brush">ME</text>
                    </g>
                </svg>
            )}

            <ol className="relative z-10">
                {stops.map((s, i) => {
                    const cardRight = i % 2 === 0;
                    const reached = geo && pos.y >= geo.pts[i].y;
                    const tilt = i % 4 < 2 ? -1.2 : 1.2;
                    return (
                        <li
                            key={i}
                            ref={(el) => (rows.current[i] = el)}
                            className="grid grid-cols-1 md:grid-cols-[1fr_140px_1fr] items-center py-10 md:py-14 pl-12 md:pl-0"
                        >
                            <div className={`hidden md:flex md:row-start-1 ${cardRight ? 'md:col-start-1 justify-end' : 'md:col-start-3 justify-start'}`}>
                                <span className={`font-marker text-5xl lg:text-6xl -rotate-6 transition-colors duration-500 ${reached ? 'text-[#ff1e56]' : 'text-white/80'}`}>
                                    {s.year}
                                </span>
                            </div>
                            <div className={`md:row-start-1 flex ${cardRight ? 'md:col-start-3 md:justify-start' : 'md:col-start-1 md:justify-end'}`}>
                                <InternshipCard stop={s} tilt={tilt} />
                            </div>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}

// ---------- HALAMAN EXPERIENCE ----------
export default function ExperiencePage({ onHire }) {
    const [previewCert, setPreviewCert] = useState(null);

    return (
        <main className="relative z-10 w-full max-w-[1800px] mx-auto px-5 sm:px-10 lg:px-20 xl:px-28 pt-28 pb-32 animate-fade-in">
            <h1 className="sr-only">Experience</h1>
            <RoadHero years="2020 - 2026" />

            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 mt-6 mb-10 font-sans-tech text-sm text-neutral-400 select-none">
                <span className="flex items-center gap-2">
                    <BrutalStar color="white" className="w-4 h-4" /> {MAGANG.length} work &amp; internship experiences
                </span>
                <a
                    href="#sertifikat"
                    className="flex items-center gap-2 hover:text-white focus-visible:text-white focus-visible:outline-none transition-colors"
                >
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white" /> {SERTIFIKAT.length} verified certifications below
                </a>
                <span className="font-signature text-lg text-neutral-500">scroll to follow the journey</span>
            </div>

            {/* ROADMAP PENGALAMAN KERJA & MAGANG */}
            <Road stops={MAGANG} />

            {/* KUMPULAN 9 SERTIFIKAT */}
            <section id="sertifikat" className="mt-24 scroll-mt-28">
                <div className="flex items-end gap-4 mb-10 select-none">
                    <h2 className="font-marker text-3xl sm:text-4xl text-white -rotate-3">
                        Certifications &amp; Training
                    </h2>
                    <span className="font-signature text-xl text-neutral-500 pb-1">
                        {SERTIFIKAT.length} validated credentials
                    </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-10">
                    {SERTIFIKAT.map((s, i) => (
                        <CertificateTicket
                            key={i}
                            stop={s}
                            tilt={i % 2 === 0 ? -1 : 1}
                            onPreview={setPreviewCert}
                        />
                    ))}
                </div>
            </section>

            {/* CTA BAWAH */}
            <div className="text-center mt-24 select-none">
                <p className="font-brush text-3xl text-[#ff1e56] -rotate-2 inline-block">next stop?</p>
                <div className="mt-5">
                    <button
                        onClick={onHire}
                        className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-[#ff1e56] hover:text-white focus-visible:bg-[#ff1e56] focus-visible:text-white focus-visible:outline-none font-sans-tech font-bold text-sm transition-colors cursor-pointer"
                    >
                        Hire Maulana
                    </button>
                </div>
            </div>


            {/* MODAL LIGHTBOX PREVIEW FOTO SERTIFIKAT */}
            {previewCert && (
                <CertificatePreviewModal key={previewCert.title} cert={previewCert} onClose={() => setPreviewCert(null)} />
            )}
        </main>
    );
}