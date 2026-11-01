import React from 'react';
import { X } from 'lucide-react';

// MODAL / PANEL INSPEKSI SKILL SAAT KARTU DIKLIK
export default function SkillModal({ skill, onClose }) {
  if (!skill) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-[#141416] border-2 border-white p-6 sm:p-8 shadow-[10px_10px_0px_#ff1e56] text-white"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-white text-black flex items-center justify-center hover:bg-[#ff1e56] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-[#ff1e56] text-black flex items-center justify-center shrink-0">
            {React.createElement(skill.icon, { className: "w-8 h-8 stroke-[2.2]" })}
          </div>
          <div>
            <span className="font-sans-tech text-[10px] font-bold uppercase tracking-widest text-[#ff1e56] block">
              {skill.level} // PROFICIENCY {skill.exp}
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight">
              {skill.name}
            </h3>
          </div>
        </div>

        {/* Progress Bar Brutalist */}
        <div className="w-full h-3 bg-white/10 border border-white/30 mb-5 overflow-hidden p-0.5">
          <div
            className="h-full bg-[#ff1e56] transition-all duration-500"
            style={{ width: skill.exp }}
          />
        </div>

        <p className="font-sans-tech text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6">
          {skill.desc}
        </p>

        <div className="mb-6">
          <span className="font-sans-tech text-[10px] uppercase tracking-widest text-neutral-400 block mb-2">
            ECOSYSTEM & TOOLS:
          </span>
          <div className="flex flex-wrap gap-2">
            {skill.tools.map((t) => (
              <span key={t} className="px-2.5 py-1 bg-white/10 border border-white/20 font-sans-tech text-xs font-bold">
                #{t}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-white text-black font-display font-black text-xs uppercase tracking-widest hover:bg-[#ff1e56] hover:text-white transition-colors cursor-pointer"
        >
          RESUME WHEEL SPIN ↻
        </button>
      </div>
    </div>
  );
}
