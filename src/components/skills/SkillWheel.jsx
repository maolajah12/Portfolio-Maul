import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SKILLS_LIST } from '../../data/skills.js';

// BAGIAN BAWAH: RODA KARTU BERPUTAR MELENGKUNG (ARCH CAROUSEL)
// Skala roda mengikuti lebar layar: penuh di tablet/desktop, mengecil (min 0.6) di HP
const wheelScale = () => (typeof window === 'undefined' ? 1 : Math.min(1, Math.max(0.6, window.innerWidth / 760)));

export default function SkillWheel({ rotation, onPauseChange, onSelectSkill }) {
  const [scale, setScale] = useState(wheelScale);
  useEffect(() => {
    const on = () => setScale(wheelScale());
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);

  return (
    <div
      className="relative isolate w-full h-[56vh] min-h-[560px] flex justify-center overflow-hidden"
      style={scale < 1 ? { height: `${Math.round(560 * scale)}px`, minHeight: 0 } : undefined}
    >

      {/* POROS TUNGGAL RODA & LINGKARAN BAWAH */}
      <div
        className="absolute left-1/2 -translate-x-1/2 w-0 h-0 flex items-center justify-center z-20"
        style={{ bottom: `${-120 * scale}px`, transform: `translateX(-50%) scale(${scale})`, transformOrigin: '0 0' }}
      >
        {/* CONTAINER RODA KARTU YANG BERPUTAR */}
        <div
          className="relative w-0 h-0 flex items-center justify-center"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {SKILLS_LIST.map((skill, idx) => {
            const Icon = skill.icon;
            const totalCards = SKILLS_LIST.length;
            const angle = idx * (360 / totalCards);

            // Variasi gaya visual kartu mengikuti tema Grunge/Brutalist & video
            const cardThemes = [
              "bg-[#ff1e56] text-black border-2 border-[#ff1e56] shadow-[0_15px_35px_rgba(255,30,86,0.35)]",
              "bg-[#e8e8e8] text-black border-2 border-white shadow-[0_20px_45px_rgba(0,0,0,0.85)]",
              "bg-[#121215] text-white border-2 border-white/25 plastic-glare shadow-[0_20px_45px_rgba(0,0,0,0.95)]",
              "crumpled-paper text-black border-2 border-white/80 shadow-[0_20px_45px_rgba(0,0,0,0.9)]",
            ];
            const themeClass = cardThemes[idx % cardThemes.length];
            const isRedCard = idx % 4 === 0;
            const isDarkCard = idx % 4 === 2;

            return (
              <div
                key={skill.name}
                className="absolute"
                style={{
                  width: '196px',
                  height: '268px',
                  left: '-98px',
                  top: '-134px',
                  transform: `rotate(${angle}deg) translateY(-400px)`,
                }}
              >
                <div
                  onPointerEnter={(e) => e.pointerType === 'mouse' && onPauseChange(true)}
                  onPointerLeave={(e) => e.pointerType === 'mouse' && onPauseChange(false)}
                  onClick={() => onSelectSkill(idx, skill)}
                  className={`w-full h-full rounded-[1.6rem] p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer hover:-translate-y-5 hover:scale-105 overflow-hidden relative group ${themeClass}`}
                >
                  {/* Baris Atas Kartu: Nomor & Badge Level */}
                  <div className="relative z-10 flex items-center justify-between w-full">
                    <span className="font-sans-tech font-bold text-[9px] sm:text-[10px] tracking-[0.18em] uppercase opacity-75">
                      {String(idx + 1).padStart(2, '0')} // {skill.exp}
                    </span>
                    <span className="font-display font-black text-[8px] sm:text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-current opacity-85">
                      {skill.level}
                    </span>
                  </div>

                  {/* Visual Tengah Kartu */}
                  <div className="relative z-10 my-auto flex flex-col items-center justify-center">
                    {isRedCard ? (
                      <div className="w-20 h-20 rounded-full border-[5px] border-black flex items-center justify-center relative group-hover:scale-110 transition-transform">
                        <Icon className="w-9 h-9 stroke-[2.2]" />
                        <div className="absolute -top-2.5 w-5 h-2.5 bg-black rounded-full" />
                        <div className="absolute -bottom-2.5 w-5 h-2.5 bg-black rounded-full" />
                      </div>
                    ) : isDarkCard ? (
                      <div className="relative flex items-center justify-center">
                        <div className="absolute w-24 h-24 rounded-full bg-gradient-to-tr from-[#00f5d4] via-[#3b82f6] to-[#ff1e56] blur-md opacity-70 group-hover:scale-125 transition-transform" />
                        <div className="relative w-18 h-18 p-4 rounded-full border-2 border-white/50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                          <Icon className="w-8 h-8 text-[#00f5d4]" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-18 h-18 p-4 rounded-2xl bg-black text-white flex items-center justify-center shadow-[5px_5px_0px_#ff1e56] group-hover:rotate-6 transition-transform">
                        <Icon className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  {/* Baris Bawah Kartu: Nama Skill & Panah */}
                  <div className="relative z-10 flex items-end justify-between border-t border-current/20 pt-2.5">
                    <div>
                      <span className="font-sans-tech text-[8px] uppercase tracking-widest opacity-60 block">
                        CLICK TO INSPECT
                      </span>
                      <h4 className="font-display font-black text-base sm:text-lg uppercase tracking-tight leading-none">
                        {skill.name}
                      </h4>
                    </div>
                    <ArrowUpRight className="w-4 h-4 opacity-75 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* INDIKATOR "▲ ME" (Tepat di atas lingkaran bawah) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none"
          style={{ transform: 'translate(-50%, -232px)' }}
        >
          <span className="text-[#ff1e56] text-xs leading-none drop-shadow-[0_0_8px_rgba(255,30,86,0.8)]">▲</span>
          <span className="font-bbh font-black text-[11px] sm:text-xs tracking-[0.22em] text-white mt-0.5">
            ME
          </span>
        </div>

        {/* LINGKARAN TEKS BERPUTAR DI PUSAT POROS ("• SKILLS • PORTFOLIO •") */}
        <div
          className="absolute rounded-full border border-white/15 bg-[#121214]/95 backdrop-blur-md flex items-center justify-center pointer-events-none shadow-[0_-15px_50px_rgba(0,0,0,0.95)] z-30"
          style={{ width: '410px', height: '410px', left: '-205px', top: '-205px' }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slow p-3 opacity-65">
            <defs>
              <path
                id="skillsCirclePath"
                d="M 100, 100 m -82, 0 a 82,82 0 1,1 164,0 a 82,82 0 1,1 -164,0"
              />
            </defs>
            <text fill="white" className="font-sans-tech font-bold uppercase tracking-[0.25em] text-[8.5px]">
              <textPath href="#skillsCirclePath" startOffset="0%">
                • SKILLS • PORTFOLIO • SKILLS • PORTFOLIO • SKILLS • PORTFOLIO
              </textPath>
            </text>
          </svg>
        </div>

      </div>

    </div>
  );
}