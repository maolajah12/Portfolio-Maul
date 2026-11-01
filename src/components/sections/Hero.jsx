import { Sparkles, Flame } from 'lucide-react';
import { CircularStamp, CornerBracket } from '../decor';

// 1. HERO SECTION (PORTFOLIO 2026) dengan efek "ditandatangani"
export default function Hero() {
  return (
    <section className="relative pt-14 pb-24 md:py-28 flex flex-col items-center justify-center text-center select-none">

      {/* Wrapper Utama Teks PORTFOLIO & Elemen Dekoratif */}
      <div className="relative inline-block max-w-full px-4">

        {/* Stempel Melingkar Kiri Atas */}
        <div
          className="absolute -top-12 -left-4 sm:-left-14 md:-top-16 md:-left-20 z-20 hidden xs:block sign-fade"
          style={{ '--sign-delay': '0s' }}
        >
          <CircularStamp size={135} />
        </div>

        {/* Tahun 2026 Gaya Marker */}
        <div className="text-left mb-1 sm:mb-2 ml-6 sm:ml-20">
          <span
            className="font-marker text-2xl sm:text-4xl md:text-5xl text-white/95 tracking-widest inline-block -rotate-6 sign-reveal"
            style={{ '--sign-delay': '0.2s', '--sign-dur': '0.8s' }}
          >
            2026
          </span>
        </div>

        {/* Garis Orbit Elips Miring: tergambar sendiri */}
        <svg
          viewBox="0 0 900 320"
          className="absolute -inset-x-6 sm:-inset-x-16 -inset-y-6 w-[calc(100%+3rem)] sm:w-[calc(100%+8rem)] h-[calc(100%+3rem)] pointer-events-none z-10 overflow-visible"
        >
          <ellipse
            cx="450"
            cy="155"
            rx="440"
            ry="110"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            transform="rotate(-11 450 155)"
            pathLength="1"
            className="draw-stroke"
            style={{ '--sign-delay': '0.4s', '--sign-dur': '2.4s' }}
          />
          {/* Garis aksen bawah */}
          <line
            x1="80" y1="265" x2="850" y2="175"
            stroke="white"
            strokeWidth="1.8"
            opacity="0.85"
            pathLength="1"
            className="draw-stroke"
            style={{ '--sign-delay': '2.2s', '--sign-dur': '1.2s' }}
          />
        </svg>

        {/* Kata "PORT" */}
        <h1
          className="relative z-10 sign-reveal font-bbh font-black text-[4.5rem] sm:text-[7.8rem] md:text-[10.5rem] lg:text-[13rem] xl:text-[15rem] leading-[0.82] tracking-tighter text-white uppercase drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
          style={{ '--sign-delay': '0.6s', '--sign-dur': '1.2s' }}
        >
          PORT
        </h1>

        {/* Kata "FOLIO" */}
        <div className="relative z-20 -mt-2 sm:-mt-5 md:-mt-7">
          <span
            className="font-marker sign-reveal text-[3.4rem] sm:text-[5.8rem] md:text-[7.8rem] lg:text-[9.5rem] xl:text-[11rem] leading-none tracking-wider text-white inline-block -rotate-2 drop-shadow-[0_6px_15px_rgba(0,0,0,0.9)]"
            style={{ '--sign-delay': '1.5s', '--sign-dur': '1.8s' }}
          >
            FOLIO
          </span>
        </div>

        {/* Subjudul */}
        <div className="relative z-20 mt-4 sm:mt-6">
          <h2
            className="sign-reveal font-display font-extrabold text-sm sm:text-xl md:text-2xl lg:text-3xl tracking-[0.22em] uppercase text-white"
            style={{ '--sign-delay': '3.1s', '--sign-dur': '1s' }}
          >
            WEB & MOBILE DEVELOPER
          </h2>
        </div>

        {/* Baris Bawah Hero: Catatan Kecil, 3 Ikon Kotak, dan Tanda Tangan */}
        <div className="relative z-20 mt-4 flex flex-wrap items-start justify-center sm:justify-between gap-4 max-w-2xl mx-auto px-2">
          <p
            className="sign-fade font-sans-tech text-[11px] sm:text-xs text-neutral-300 text-left leading-tight max-w-[165px]"
            style={{ '--sign-delay': '3.9s' }}
          >
            some of my work and personal projects.<br />
            I hope you like them!
          </p>

          {/* 3 Kotak Monogram / Simbol Streetwear */}
          <div className="sign-fade flex items-center gap-2" style={{ '--sign-delay': '3.9s' }}>
            <div className="w-8 h-8 bg-white text-black font-display font-black text-xs flex items-center justify-center border border-white">
              MA
            </div>
            <div className="w-8 h-8 bg-white text-black flex items-center justify-center border border-white">
              <Sparkles className="w-4 h-4 fill-black" />
            </div>
            <div className="w-8 h-8 bg-white text-black flex items-center justify-center border border-white">
              <Flame className="w-4 h-4 fill-black" />
            </div>
          </div>

          {/* Tanda Tangan Maulana Al Ghifari */}
          <div className="w-full sm:w-auto text-center sm:text-right -mt-1">
            <span
              className="sign-reveal font-signature text-3xl sm:text-5xl text-white/95 inline-block -rotate-6"
              style={{ '--sign-delay': '4.2s', '--sign-dur': '1.3s' }}
            >
              Maulana Al Ghifari
            </span>
          </div>
        </div>

        {/* Siku Frame Kanan Bawah Hero */}
        <div
          className="sign-fade absolute -bottom-8 right-2 sm:-right-10"
          style={{ '--sign-delay': '5.2s' }}
        >
          <CornerBracket position="bottom-right" />
        </div>
      </div>
    </section>
  );
}