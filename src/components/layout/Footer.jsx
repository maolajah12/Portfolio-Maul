import { useEffect, useState } from 'react';
import { Github, Linkedin, Instagram, Mail, Globe, ArrowUp } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', page: 'home' },
  { label: 'About', page: 'home', hash: '#about' },
  { label: 'Experience', page: 'experience' },
  { label: 'Skills', page: 'skills' },
  { label: 'Projects', page: 'works' },
  { label: 'Album Gallery', page: 'gallery' },
  { label: 'Contact', page: 'home', hash: '#contact' },
];

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/maolajah12', icon: Github },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/maulana-al-ghifari-01278442a', icon: Linkedin },
  { label: 'Website', href: 'https://maoll.my.id', icon: Globe },
  { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { label: 'Email', href: 'mailto:alghifarim60@gmail.com', icon: Mail },
];

const TIME_ZONE = 'Asia/Jakarta';
const timeFmt = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});

export default function Footer({ onNavClick, currentPage = 'home' }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const formattedTime = timeFmt.format(now);

  const handleNavigate = (e, page, hash) => {
    e.preventDefault();
    if (typeof onNavClick === 'function') {
      onNavClick(page, hash);
    } else {
      window.dispatchEvent(
        new CustomEvent('portfolio:navigate', { detail: { page, hash } })
      );
    }
  };

  return (
    <footer className="relative z-10 w-full bg-[#0c0c0c] border-t border-white/10 pt-16 pb-24 sm:pb-14 px-6 sm:px-12 lg:px-20 select-none overflow-hidden">
      {/* Efek Sorotan Cahaya Halus di Background (Ambient Spotlight) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/4 w-[500px] h-[300px] rounded-full bg-white/[0.03] blur-3xl -rotate-12"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 right-10 w-[380px] h-[240px] rounded-full bg-[#ff1e56]/[0.04] blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-[1300px]">
        {/* GRID 4 KOLOM SANTAI (SESUAI REFERENSI GAMBAR) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-y-12 sm:gap-x-8 lg:gap-x-10 pb-14">

          {/* 1. BRAND & TAGLINE (Kiri) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            {/* Badge Logo MA dengan sentuhan tema web */}
            <button
              type="button"
              onClick={(e) => handleNavigate(e, 'home')}
              className="group relative w-12 h-12 rounded-xl bg-[#16161a] border border-white/15 hover:border-[#ff1e56] flex items-center justify-center transition-all duration-300 shadow-[3px_3px_0_#ff1e56] hover:shadow-[1px_1px_0_#ff1e56] hover:translate-x-[2px] hover:translate-y-[2px] cursor-pointer"
              title="Maulana Al Ghifari"
            >
              <span className="font-syne font-black text-base tracking-tighter text-white group-hover:text-[#ff1e56] transition-colors">
                MA
              </span>
            </button>

            <p className="font-sans-tech text-sm text-neutral-400 mt-5 max-w-[260px] leading-relaxed">
              Building digital solutions with passion and precision.
            </p>

            <span className="font-marker text-sm text-[#ff1e56]/90 -rotate-2 mt-3 inline-block tracking-wide">
              design &amp; tech ✦
            </span>
          </div>

          {/* 2. LINKS */}
          <div className="lg:col-span-3">
            <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-5">
              LINKS
            </h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((item) => {
                const isActive = currentPage === item.page && !item.hash;
                return (
                  <li key={item.label}>
                    <a
                      href={item.hash || `#${item.page}`}
                      onClick={(e) => handleNavigate(e, item.page, item.hash)}
                      className={`group inline-flex items-center gap-2 text-sm transition-colors duration-200 ${isActive
                        ? 'text-white font-semibold'
                        : 'text-neutral-400 hover:text-white'
                        }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${isActive
                          ? 'bg-[#ff1e56] scale-100'
                          : 'bg-[#ff1e56] scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100'
                          }`}
                      />
                      <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                        {item.label}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 3. SOCIALS (Dengan garis pembatas vertikal tipis di layar besar) */}
          <div className="lg:col-span-3 lg:border-l lg:border-white/10 lg:pl-10">
            <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-5">
              SOCIALS
            </h3>
            <ul className="space-y-3.5">
              {SOCIALS.map((soc) => {
                const Icon = soc.icon;
                return (
                  <li key={soc.label}>
                    <a
                      href={soc.href}
                      target={soc.href.startsWith('mailto:') ? undefined : '_blank'}
                      rel="noreferrer"
                      className="group inline-flex items-center gap-3 text-sm text-neutral-400 hover:text-white transition-colors duration-200"
                    >
                      <Icon className="w-4 h-4 text-neutral-500 group-hover:text-[#ff1e56] transition-colors duration-200 shrink-0" />
                      <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                        {soc.label}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 4. LOCAL TIME (Kanan) */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-5">
                LOCAL TIME
              </h3>
              <p className="font-mono font-bold text-lg sm:text-xl text-white tracking-wider tabular-nums">
                {formattedTime}
              </p>
              <p className="font-sans-tech text-xs text-neutral-500 mt-1.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Medan (WIB), UTC+7
              </p>
            </div>

            {/* Tombol Scroll ke Atas yang Minimalis */}
            <div className="mt-8 lg:mt-0 pt-2">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-neutral-500 hover:text-white transition-colors cursor-pointer"
                aria-label="Kembali ke atas"
              >
                <span>Back to top</span>
                <span className="w-6 h-6 rounded-md border border-white/15 group-hover:border-[#ff1e56] group-hover:bg-[#ff1e56] group-hover:text-white flex items-center justify-center transition-all">
                  <ArrowUp className="w-3.5 h-3.5" />
                </span>
              </button>
            </div>
          </div>

        </div>

        {/* BARIS COPYRIGHT TIPIS DI PALING BAWAH */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-neutral-600">
          <p>© {new Date().getFullYear()} Maulana Al Ghifari. All rights reserved.</p>
          <p className="text-[11px] tracking-widest uppercase">
            Informatics Engineering • Medan, ID
          </p>
        </div>
      </div>
    </footer>
  );
}