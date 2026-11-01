import { useState } from 'react';
import { Check, Copy, ArrowUpRight } from 'lucide-react';
import {
  CircularStamp, FireSectionBadge, SmileyDoodle, AnimeCharDoodle,
  BrutalStar, CornerBracket
} from '../decor';

// 2. SECTION #1: ABOUT ME (POLAROID + BIO + CONTACT PILLS)
export default function About() {
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Salin email ke clipboard
  const handleCopyEmail = () => {
    navigator.clipboard.writeText("maulana@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <section id="about" className="relative py-20 md:py-28">

      {/* Header Badge Api #1 About Me */}
      <div className="mb-8 md:ml-12">
        <FireSectionBadge number="1" label="About ME" />
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-center">

        {/* KOLOM KIRI: Polaroid & Doodles */}
        <div className="md:col-span-6 relative flex justify-center">

          {/* Doodle Wajah Smiley Pink X X di Kiri Atas Polaroid */}
          <SmileyDoodle className="w-20 h-20 sm:w-24 sm:h-24 absolute -top-10 left-2 sm:left-8 z-20 -rotate-12" />

          {/* Stempel Melingkar dengan Pusat Lingkaran Merah di Kiri Polaroid */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-6 sm:left-0 z-20">
            <CircularStamp
              size={125}
              centerIcon={
                <div className="w-9 h-9 rounded-full border-[3px] border-[#ff1e56] flex items-center justify-center">
                  <div className="w-5 h-1 bg-[#ff1e56] -rotate-45" />
                </div>
              }
            />
          </div>

          {/* Doodle Karakter Anime di Pojok Kanan Atas Polaroid */}
          <AnimeCharDoodle className="w-28 h-28 sm:w-32 sm:h-32 absolute -top-14 right-4 sm:right-10 z-30 rotate-6" />

          {/* Doodle Api Merah Outline di Belakang Kanan Bawah Polaroid */}
          <svg
            viewBox="0 0 200 220"
            className="w-48 h-48 sm:w-60 sm:h-60 absolute -bottom-12 -right-4 sm:right-2 z-0 stroke-[#ff1e56] fill-none pointer-events-none"
            strokeWidth="4"
          >
            <path d="M40 180 C100 210, 175 170, 165 100 C155 130, 130 125, 135 80 C115 110, 95 95, 100 50 C70 95, 50 120, 40 180 Z" />
            <path d="M70 140 C95 155, 130 140, 125 105" strokeWidth="2.5" />
          </svg>

          {/* BINGKAI FOTO POLAROID */}
          <div className="relative z-10 bg-[#e8e8e8] text-black p-3.5 sm:p-4 pb-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)] -rotate-6 hover:rotate-0 transition-transform duration-500 w-64 sm:w-72 md:w-80">
            {/* Foto Hitam Putih Kontras Tinggi */}
            <div className="relative aspect-[4/4.3] w-full bg-neutral-900 overflow-hidden grayscale contrast-125">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80"
                alt="Maulana Al Ghifari Portrait"
                className="w-full h-full object-cover object-center scale-105"
              />
              {/* Efek Bintang Hitam di Sisi Kanan Foto */}
              <BrutalStar
                color="#0c0c0c"
                points={12}
                className="w-16 h-16 absolute bottom-3 -right-4 drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]"
              />
            </div>

            {/* Tulisan Tangan di Bawah Polaroid */}
            <div className="mt-4 flex items-end justify-between px-1 text-black select-none">
              <div>
                <span className="font-brush text-xl sm:text-2xl tracking-tight block leading-none">
                  21 YEARS
                </span>
                <div className="h-1 w-20 bg-black mt-0.5" />
              </div>
              <div className="text-right">
                <span className="font-sans-tech font-bold text-[9px] tracking-widest uppercase block text-neutral-700">
                  NATIONALITY:
                </span>
                <span className="font-brush text-lg sm:text-xl leading-none">
                  ID-ID
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* KOLOM KANAN: HI!! & Paragraf Perkenalan */}
        <div className="md:col-span-6 relative px-2 sm:px-6">
          <h2 className="font-display font-black text-6xl sm:text-7xl md:text-8xl tracking-tight text-white mb-4 select-none">
            HI!!
          </h2>

          <div className="space-y-4 font-sans-tech text-sm sm:text-base text-neutral-200 max-w-md leading-relaxed">
            <p>
              My name is <strong className="text-white font-bold">Maulana Al Ghifari</strong>, I'm a{' '}
              <span className="text-white underline decoration-[#ff1e56] decoration-2 underline-offset-4">
                designer / illustrator / artist
              </span>{' '}
              based in Indonesia.
            </p>

            <p className="pl-4 sm:pl-8">
              <span className="font-display font-black text-lg sm:text-xl text-white tracking-wide mr-1.5 bg-white/10 px-1.5 py-0.5">
                Ever since
              </span>{' '}
              I remember I've always had a special interest in visual communication, from the most simple sketch to the most elaborated presentation.
            </p>

            <p className="pl-8 sm:pl-16">
              <span className="font-display font-black text-lg sm:text-xl text-white tracking-wide mr-1.5 bg-white/10 px-1.5 py-0.5">
                I live to
              </span>{' '}
              discover and experience creative ways to express myself and do it for others.
            </p>
          </div>

          {/* Siku Frame Kanan Bawah Bio */}
          <CornerBracket position="bottom-right" className="mt-6 ml-auto mr-4" />
        </div>

      </div>

      {/* BARIS LOGO MONOGRAM & PILL KONTAK */}
      <div className="mt-16 flex flex-col items-center">
        {/* Monogram MA Maulana Al Ghifari */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 bg-white text-black font-display font-black text-sm flex items-center justify-center">
            MA
          </div>
          <div className="font-display font-extrabold text-xs tracking-[0.2em] leading-none uppercase">
            MAULANA<br />AL GHIFARI
          </div>
        </div>

        {/* 3 Pill Kontak dengan Titik Pemisah */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 w-full max-w-3xl">

          {/* Pill Email (Klik untuk Copy) */}
          <button
            onClick={handleCopyEmail}
            className="group relative px-5 py-2 rounded-full border border-white/70 hover:border-[#ff1e56] bg-black/60 hover:bg-[#ff1e56]/10 transition-all flex items-center gap-2 text-xs sm:text-sm font-sans-tech"
            title="Click to copy email"
          >
            <span>maulana@gmail.com</span>
            {copiedEmail ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
            )}
            {copiedEmail && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-emerald-500 text-black font-bold text-[10px] px-2 py-0.5 rounded">
                Copied!
              </span>
            )}
          </button>

          <span className="w-1.5 h-1.5 rounded-full bg-white hidden sm:inline-block" />

          {/* Nomor Telepon */}
          <a
            href="tel:+351936562723"
            className="font-sans-tech text-xs sm:text-sm text-neutral-200 hover:text-[#ff1e56] transition-colors tracking-wider"
          >
            +351 936 562 723
          </a>

          <span className="w-1.5 h-1.5 rounded-full bg-white hidden sm:inline-block" />

          {/* Pill Behance */}
          <a
            href="https://www.behance.net"
            target="_blank"
            rel="noreferrer"
            className="group relative px-5 py-2 rounded-full border border-white/70 hover:border-white bg-black/60 hover:bg-white hover:text-black transition-all flex items-center gap-2 text-xs sm:text-sm font-sans-tech"
          >
            <span>www.behance.net/maulana</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

        </div>
      </div>
    </section>
  );
}
