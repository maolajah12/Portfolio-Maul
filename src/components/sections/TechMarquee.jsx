import { TECH_MARQUEE } from '../../data/techMarquee.js';

// PEMBATAS RUNNING TEXT (MARQUEE)
export default function TechMarquee() {
  return (
    <div className="relative w-screen left-1/2 -translate-x-1/2 bg-[#0e0e10] border-y border-white/10 py-4 my-8 overflow-hidden select-none z-20">
      {/* Efek Fade Hitam di Ujung Kiri dan Kanan */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#0c0c0c] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#0c0c0c] to-transparent z-10" />

      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {[...Array(2)].map((_, arrayIndex) => (
          <div key={arrayIndex} className="flex items-center gap-10 sm:gap-16 px-5 sm:px-8">
            {TECH_MARQUEE.map((tech, idx) => (
              <span
                key={idx}
                className="font-sans-tech font-bold text-xs sm:text-sm tracking-[0.2em] text-neutral-500 hover:text-white transition-colors cursor-default whitespace-nowrap"
              >
                {tech}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
