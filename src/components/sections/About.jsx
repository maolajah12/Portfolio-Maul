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
    navigator.clipboard.writeText("alghifarim60@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <section id="about" className="relative py-16 md:py-24">
      {/* Semua isi dikunci di satu komposisi tengah supaya polaroid, doodle, dan bio saling dekat */}
      <div className="mx-auto w-full max-w-[1000px] xl:[zoom:1.1] 2xl:[zoom:1.35]">

        {/* Header Badge Api #1 About Me */}
        <div className="mb-14 md:mb-16 md:ml-6">
          <FireSectionBadge number="1" label="About ME" />
        </div>

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-center gap-14 md:gap-10 lg:gap-16">

          {/* KOLOM KIRI: Polaroid & Doodles */}
          <div className="shrink-0 flex justify-center md:pl-24">
            {/* Kontainer Group: Saat kursor masuk ke area foto, semua doodle & sparkle bereaksi serempak */}
            <div className="group relative cursor-pointer">

              {/* ==================== EFEK SPARKLING & ACTION BURST (MUNCUL SAAT HOVER) ==================== */}
              {/* Sparkle 1: Bintang 4-Sudut Putih Menyala di Kiri Atas */}
              <svg
                viewBox="0 0 40 40"
                className="w-8 h-8 absolute -top-16 left-10 z-30 pointer-events-none opacity-0 scale-0 rotate-45 group-hover:opacity-100 group-hover:scale-125 group-hover:rotate-0 transition-all duration-500 ease-out drop-shadow-[0_0_12px_#ffffff]"
              >
                <path
                  d="M20 0 C22 14 26 18 40 20 C26 22 22 26 20 40 C18 26 14 22 0 20 C14 18 18 14 20 0 Z"
                  fill="#ffffff"
                />
              </svg>

              {/* Sparkle 2: Bintang 4-Sudut Merah Neon di Kanan Tengah */}
              <svg
                viewBox="0 0 40 40"
                className="w-9 h-9 absolute top-1/3 -right-14 z-30 pointer-events-none opacity-0 scale-0 -rotate-45 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 delay-75 ease-out drop-shadow-[0_0_14px_#ff1e56]"
              >
                <path
                  d="M20 0 C22 14 26 18 40 20 C26 22 22 26 20 40 C18 26 14 22 0 20 C14 18 18 14 20 0 Z"
                  fill="#ff1e56"
                />
              </svg>

              {/* Sparkle 3: Bintang Kecil Putih di Kiri Bawah */}
              <svg
                viewBox="0 0 40 40"
                className="w-6 h-6 absolute -bottom-10 -left-10 z-30 pointer-events-none opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-90 transition-all duration-500 delay-100 ease-out drop-shadow-[0_0_10px_#ffffff]"
              >
                <path
                  d="M20 0 C22 14 26 18 40 20 C26 22 22 26 20 40 C18 26 14 22 0 20 C14 18 18 14 20 0 Z"
                  fill="#ffffff"
                />
              </svg>

              {/*Sparkle 4: Garis Kejut Komik (Action Zap) di Atas Kanan */}
              <svg
                viewBox="0 0 60 60"
                className="w-12 h-12 absolute -top-20 -right-12 z-30 pointer-events-none opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 ease-out drop-shadow-[0_0_10px_#ff1e56]"
                fill="none"
                stroke="#ff1e56"
                strokeWidth="3.5"
                strokeLinecap="round"
              >
                <line x1="10" y1="45" x2="25" y2="25" />
                <line x1="25" y1="50" x2="48" y2="15" />
                <line x1="38" y1="52" x2="55" y2="38" />
              </svg>

              {/* ==================== DOODLE UTAMA (LEBIH TERANG & AGRESIF SAAT HOVER) ==================== */}

              {/* 1. Doodle Wajah Smiley Pink X X di Kiri Atas Polaroid */}
              <div className="absolute -top-12 -left-6 sm:-left-10 z-20 transition-all duration-500 ease-out -rotate-12 opacity-80 brightness-90 group-hover:opacity-100 group-hover:brightness-125 group-hover:scale-125 group-hover:-rotate-[24deg] group-hover:-translate-x-3 group-hover:-translate-y-3 group-hover:drop-shadow-[0_0_18px_rgba(255,30,86,0.95)]">
                <SmileyDoodle className="w-20 h-20 sm:w-24 sm:h-24" />
              </div>

              {/* 2. Stempel Melingkar dengan Pusat Lingkaran Merah di Kiri Polaroid */}
              <div className="absolute top-1/2 -translate-y-1/2 -left-14 md:-left-24 z-20 transition-all duration-500 ease-out opacity-75 group-hover:opacity-100 group-hover:scale-115 group-hover:-translate-x-4 group-hover:rotate-45 group-hover:drop-shadow-[0_0_16px_rgba(255,255,255,0.65)]">
                <CircularStamp
                  size={110}
                  centerIcon={
                    <div className="w-9 h-9 rounded-full border-[3px] border-[#ff1e56] group-hover:bg-[#ff1e56] group-hover:shadow-[0_0_15px_#ff1e56] transition-all duration-300 flex items-center justify-center">
                      <div className="w-5 h-1 bg-[#ff1e56] group-hover:bg-white -rotate-45 transition-colors duration-300" />
                    </div>
                  }
                />
              </div>

              {/* 3. Doodle Karakter Anime di Pojok Kanan Atas Polaroid */}
              <div className="absolute -top-14 -right-4 sm:-right-6 z-30 transition-all duration-500 ease-out rotate-6 opacity-85 brightness-95 group-hover:opacity-100 group-hover:brightness-110 group-hover:scale-125 group-hover:rotate-12 group-hover:translate-x-3 group-hover:-translate-y-4 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.9)]">
                <AnimeCharDoodle className="w-24 h-24 sm:w-32 sm:h-32" />
              </div>

              {/* 4. Doodle Api Merah Outline di Belakang Kanan Bawah Polaroid */}
              <svg
                viewBox="0 0 200 220"
                className="w-48 h-48 sm:w-60 sm:h-60 absolute -bottom-20 -right-14 sm:-right-36 md:-right-20 lg:-right-36 z-0 stroke-[#ff1e56] fill-transparent pointer-events-none opacity-65 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-115 group-hover:translate-x-3 group-hover:translate-y-2 group-hover:rotate-6 group-hover:fill-[#ff1e56]/20 group-hover:drop-shadow-[0_0_25px_rgba(255,30,86,0.9)]"
                strokeWidth="4.5"
              >
                <path d="M40 180 C100 210, 175 170, 165 100 C155 130, 130 125, 135 80 C115 110, 95 95, 100 50 C70 95, 50 120, 40 180 Z" />
                <path d="M70 140 C95 155, 130 140, 125 105" strokeWidth="3" />
              </svg>

              {/* ==================== BINGKAI FOTO POLAROID ==================== */}
              <div className="relative z-10 bg-[#e8e8e8] group-hover:bg-white text-black p-3.5 sm:p-4 pb-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)] group-hover:shadow-[0_25px_65px_rgba(255,30,86,0.35)] -rotate-6 group-hover:rotate-0 group-hover:scale-[1.03] transition-all duration-500 ease-out w-64 sm:w-72 md:w-64 lg:w-80">

                {/* Foto Hitam Putih Kontras Tinggi */}
                <div className="relative aspect-[4/4.3] w-full bg-neutral-900 overflow-hidden grayscale contrast-125 group-hover:contrast-150 transition-all duration-500">
                  <img
                    src="/maulana.jpg"
                    alt="Maulana Al Ghifari Portrait"
                    className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-500" style={{ objectPosition: 'center 40%' }}
                  />

                  {/* Efek Bintang Brutalist di Sisi Kanan Foto (Ikut Berputar & Menyala Merah saat Hover) */}
                  <div className="absolute bottom-3 -right-4 transition-all duration-500 ease-out group-hover:rotate-180 group-hover:scale-125">
                    <BrutalStar
                      color="#0c0c0c"
                      points={12}
                      className="w-16 h-16 drop-shadow-[0_0_4px_rgba(255,255,255,0.8)] group-hover:hidden"
                    />
                    <BrutalStar
                      color="#ff1e56"
                      points={12}
                      className="w-16 h-16 hidden group-hover:block drop-shadow-[0_0_12px_#ffffff]"
                    />
                  </div>
                </div>

                {/* Tulisan Tangan di Bawah Polaroid */}
                <div className="mt-4 flex items-end justify-between px-1 text-black select-none">
                  <div>
                    <span className="font-brush text-xl sm:text-2xl tracking-tight block leading-none group-hover:text-[#ff1e56] transition-colors duration-300">
                      21 YEARS
                    </span>
                    <div className="h-1 w-20 bg-black group-hover:bg-[#ff1e56] group-hover:w-24 transition-all duration-300 mt-0.5" />
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
          </div>

          {/* KOLOM KANAN: HI!! & Paragraf Perkenalan */}
          <div className="relative w-full md:flex-1 min-w-0 max-w-md mx-auto md:mx-0">
            <h2 className="font-display font-black text-6xl sm:text-7xl md:text-8xl tracking-tight text-white mb-4 select-none">
              HI!!
            </h2>

            <div className="space-y-4 font-sans-tech text-sm sm:text-base text-neutral-200 max-w-md leading-relaxed">
              <p>
                My name is <strong className="text-white font-bold">Maulana Al Ghifari</strong>, I'm a{' '}
                <span className="text-white underline decoration-[#ff1e56] decoration-2 underline-offset-4">
                  Web & Mobile Developer
                </span>{' '}
                based in Indonesia.
              </p>

              <p className="pl-4 sm:pl-8">
                <span className="font-display font-black text-lg sm:text-xl text-white tracking-wide mr-1.5 bg-white/10 px-1.5 py-0.5">
                  Ever since
                </span>{' '}
                I remember I've always had a special interest in visual communication through technology, from the most simple sketch to the most elaborate web and mobile applications.
              </p>

              <p className="pl-8 sm:pl-16">
                <span className="font-display font-black text-lg sm:text-xl text-white tracking-wide mr-1.5 bg-white/10 px-1.5 py-0.5">
                  I live to
                </span>{' '}
                discover and build creative digital solutions to express myself and create value for others.
              </p>
            </div>

            {/* Siku Frame Kanan Bawah Bio */}
            <div className="mt-5 flex justify-end">
              <CornerBracket position="bottom-right" />
            </div>
          </div>

        </div>

        {/* BARIS LOGO MONOGRAM & PILL KONTAK */}
        <div className="mt-20 flex flex-col items-center">
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
              <span>alghifarim60@gmail.com</span>
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
              href="tel:+6282168676512"
              className="font-sans-tech text-xs sm:text-sm text-neutral-200 hover:text-[#ff1e56] transition-colors tracking-wider"
            >
              (+62) 821-6867-6512
            </a>

            <span className="w-1.5 h-1.5 rounded-full bg-white hidden sm:inline-block" />

            {/* Pill Portfolio / LinkedIn */}
            <a
              href="https://linkedin.com/in/maulana-al-ghifari-01278442a"
              target="_blank"
              rel="noreferrer"
              className="group relative px-5 py-2 rounded-full border border-white/70 hover:border-white bg-black/60 hover:bg-white hover:text-black transition-all flex items-center gap-2 text-xs sm:text-sm font-sans-tech"
            >
              <span>linkedin.com/in/maulana-al-ghifari</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

          </div>
        </div>

      </div>
    </section>
  );
}