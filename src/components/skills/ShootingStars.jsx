import { useMemo } from 'react';

// Komponen bintang jatuh estetik untuk background Skills
// Bintang vertikal: cahaya di atas, ekor memudar ke bawah, jatuh ke bawah
export default function ShootingStars({ count = 22 }) {
  const stars = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const top = -10 - Math.random() * 30;          // mulai di atas area (-10% s/d -40%)
      const left = Math.random() * 100;               // posisi horizontal (%)
      const delay = Math.random() * 8;                // delay lebih pendek
      const duration = 0.6 + Math.random() * 1.2;      // lebih cepat (0.6s - 1.8s)
      const tailLength = 60 + Math.random() * 120;    // panjang ekor (px)
      const size = 1.2 + Math.random() * 1.8;         // lebar bintang (px)
      const opacity = 0.35 + Math.random() * 0.55;    // kecerahan

      return { id: i, top, left, delay, duration, tailLength, size, opacity };
    });
  }, [count]);

  return (
    <div className="shooting-stars-container absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Bintang-bintang kecil statis sebagai latar */}
      {Array.from({ length: 50 }, (_, i) => (
        <div
          key={`dot-${i}`}
          className="star-dot"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`,
            opacity: 0.15 + Math.random() * 0.45,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${2 + Math.random() * 4}s`,
          }}
        />
      ))}

      {/* Bintang jatuh / shooting stars — vertikal ke bawah */}
      {stars.map((s) => (
        <div
          key={s.id}
          className="shooting-star"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            '--tail-length': `${s.tailLength}px`,
            '--star-size': `${s.size}px`,
            '--star-opacity': s.opacity,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

