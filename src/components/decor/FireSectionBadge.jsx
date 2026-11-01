// Ikon Api Streetwear dengan Angka di Dalamnya
export default function FireSectionBadge({ number, label }) {
  return (
    <div className="flex items-end gap-3 select-none mb-4">
      <div className="relative w-12 h-16 flex items-center justify-center">
        <svg viewBox="0 0 60 80" className="w-full h-full fill-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
          <path d="M32 2 C25 18, 10 24, 12 45 C13 60, 22 74, 34 74 C48 74, 56 60, 52 42 C50 32, 42 26, 45 14 C38 22, 35 15, 32 2 Z M22 50 C20 40, 28 35, 26 25 C34 33, 42 38, 40 52 C39 60, 34 65, 29 65 C24 65, 23 56, 22 50 Z" />
          <circle cx="15" cy="18" r="3" />
          <circle cx="50" cy="22" r="2.5" />
        </svg>
        <span className="relative z-10 font-marker text-black text-xl font-bold mt-4 mr-1">{number}</span>
      </div>
      <div className="flex flex-col">
        <span className="font-marker text-2xl md:text-3xl text-white tracking-wider -rotate-3">{label}</span>
        <svg height="8" width="90" className="stroke-white stroke-2 fill-none -mt-1">
          <path d="M2 5 Q 45 1, 88 6" />
          <path d="M10 7 Q 50 4, 80 7" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
}
