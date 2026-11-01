// Bintang Brutalist Tajam
export default function BrutalStar({ className = "", color = "white", points = 8 }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill={color}>
      {points === 8 ? (
        <polygon points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35" />
      ) : (
        <polygon points="50,0 58,32 85,15 68,42 100,50 68,58 85,85 58,68 50,100 42,68 15,85 32,58 0,50 32,42 15,15 42,32" />
      )}
    </svg>
  );
}
