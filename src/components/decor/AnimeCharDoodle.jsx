// Doodle Karakter Anime/Manga Grunge di Pojok Polaroid
export default function AnimeCharDoodle({ className = "" }) {
  return (
    <svg viewBox="0 0 140 140" className={className}>
      <g stroke="white" strokeWidth="3" fill="#0d0d0d" strokeLinejoin="round" strokeLinecap="round">
        {/* Tanduk / Aksesoris Kepala */}
        <path d="M40 45 L15 15 L55 35 Z" fill="white" />
        <circle cx="20" cy="20" r="4" fill="#0d0d0d" />
        {/* Rambut Berantakan */}
        <path d="M35 60 L15 55 L30 40 L25 25 L50 35 L70 15 L80 35 L105 25 L95 45 L120 55 L95 68" fill="#0d0d0d" />
        {/* Wajah */}
        <path d="M42 60 C40 95, 90 95, 88 60 Z" fill="white" />
        {/* Mata X & Mata Gelap */}
        <path d="M50 65 L60 75 M60 65 L50 75" stroke="#0d0d0d" strokeWidth="3.5" />
        <circle cx="76" cy="70" r="5" fill="#0d0d0d" />
        <circle cx="77" cy="69" r="1.5" fill="white" />
        {/* Plester Hidung & Mulut */}
        <rect x="60" y="75" width="12" height="5" rx="1" transform="rotate(-10 60 75)" fill="#ff1e56" stroke="none" />
        <path d="M58 85 Q66 88 74 83" stroke="#0d0d0d" strokeWidth="2.5" fill="none" />
      </g>
    </svg>
  );
}
