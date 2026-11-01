// Doodle Wajah Smiley X X
export default function SmileyDoodle({ className = "" }) {
  return (
    <svg viewBox="0 0 100 100" className={`stroke-[#ff1e56] fill-none ${className}`} strokeWidth="5" strokeLinecap="round">
      {/* Mata X Kiri */}
      <path d="M20 25 L40 45 M40 25 L20 45" />
      {/* Mata X Kanan */}
      <path d="M60 20 L80 40 M80 20 L60 40" />
      {/* Mulut Senyum Lebar */}
      <path d="M15 65 Q 50 95, 85 55" />
      {/* Lidah menjulur */}
      <path d="M55 76 Q 65 95, 75 72" fill="#ff1e56" fillOpacity="0.2" />
    </svg>
  );
}
