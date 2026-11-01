// TENGAH: 3D ROLLING CYLINDER TYPOGRAPHY ("SKILLS")
export default function RollingTitle({ word = "SKILLS" }) {
  return (
    <div className="relative z-20 w-full max-w-[1650px] mx-auto my-auto flex items-center justify-center">

      {/* 3D Rolling Word Container (Miring -6 derajat seperti di video) */}
      <div
        className="relative flex items-center justify-center py-4"
        style={{ transform: 'rotate(-6deg)' }}
      >
        <div className="flex items-center justify-center font-bbh font-black text-[13vw] sm:text-[11vw] md:text-[9.8vw] tracking-tighter uppercase">
          {word.split("").map((char, i) => (
            <div key={i} className="letter-perspective inline-block px-[0.01em]">
              <div
                className="letter-cylinder"
                style={{ animationDelay: `${i * -0.26}s` }}
              >
                {/* Sisi Depan (0 deg) - SOLID */}
                <span
                  className="letter-face letter-face-solid"
                  style={{ transform: 'rotateX(0deg) translateZ(0.46em)' }}
                >
                  {char}
                </span>

                {/* Sisi Atas (90 deg) - OUTLINE */}
                <span
                  aria-hidden="true"
                  className="letter-face letter-face-outline absolute inset-0"
                  style={{ transform: 'rotateX(90deg) translateZ(0.46em)' }}
                >
                  {char}
                </span>

                {/* Sisi Belakang (180 deg) - SOLID */}
                <span
                  aria-hidden="true"
                  className="letter-face letter-face-solid absolute inset-0"
                  style={{ transform: 'rotateX(180deg) translateZ(0.46em)' }}
                >
                  {char}
                </span>

                {/* Sisi Bawah (270 deg) - OUTLINE */}
                <span
                  aria-hidden="true"
                  className="letter-face letter-face-outline absolute inset-0"
                  style={{ transform: 'rotateX(270deg) translateZ(0.46em)' }}
                >
                  {char}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
