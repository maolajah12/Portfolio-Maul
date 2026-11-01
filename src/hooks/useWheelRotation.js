import { useState, useEffect } from 'react';

// Animasi putaran roda skills yang mulus & interaktif
export default function useWheelRotation({ active = true } = {}) {
  const [rotation, setRotation] = useState(0); // Sudut putaran roda skills (derajat)

  useEffect(() => {
    if (!active) return;
    let animationFrameId;
    let lastTime = performance.now();

    const animateWheel = (now) => {
      const delta = now - lastTime;
      lastTime = now;
      setRotation((prev) => (prev + delta * 0.012) % 360);
      animationFrameId = requestAnimationFrame(animateWheel);
    };

    animationFrameId = requestAnimationFrame(animateWheel);
    return () => cancelAnimationFrame(animationFrameId);
  }, [active]);

  // Fungsi memutar roda secara manual lewat tombol panah atau klik kartu
  const rotateBy = (deltaDeg) => {
    setRotation((prev) => (prev + deltaDeg) % 360);
  };

  return { rotation, setRotation, rotateBy };
}
