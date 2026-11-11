import ThemeToggle from './ThemeToggle.jsx';
import {
  Mail, Sparkles, Cpu, ChevronDown, Home, User, Briefcase,
  Image as ImageIcon
} from 'lucide-react';

// ================= FLOATING PILL NAVBAR =================
export default function Navbar({ activeNav, onNavClick }) {
  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">

      {/* Floating Navbar Pill Lonjong */}
      <nav className="pointer-events-auto flex items-center gap-1 sm:gap-2 bg-[#121214]/90 backdrop-blur-md border border-white/10 rounded-full p-1.5 shadow-[0_20px_40px_rgba(0,0,0,0.8)] text-[13px] sm:text-sm font-sans-tech">

        <a
          href="#top"
          onClick={(e) => { e.preventDefault(); onNavClick('home'); }}
          className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-300 flex items-center gap-1.5 sm:gap-2 ${activeNav === "Home" ? "bg-[#232327] text-white font-bold" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}
        >
          <Home className="w-3.5 h-3.5 opacity-80 hidden md:inline-block" /> Home
        </a>

        {/* ABOUT WITH DROPDOWN */}
        <div className="relative group">
          <button
            className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-300 flex items-center gap-1.5 sm:gap-2 ${activeNav === "About" ? "bg-[#232327] text-white font-bold" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}
          >
            <User className="w-3.5 h-3.5 opacity-80 hidden md:inline-block" /> About
            <ChevronDown className="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform hidden sm:block" />
          </button>

          {/* DROPDOWN MENU */}
          <div className="absolute top-full left-0 mt-3 w-44 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-[#121214]/95 backdrop-blur-md border border-white/10 rounded-2xl p-2 shadow-[0_20px_40px_rgba(0,0,0,0.8)] flex flex-col gap-1 z-50">
            <a
              href="#skills-page"
              onClick={(e) => { e.preventDefault(); onNavClick('skills'); }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Cpu className="w-4 h-4 text-[#ff1e56]" />
              <span className="font-bold text-[11px] uppercase tracking-wider">Skills</span>
            </a>
            <a
              href="#experience"
              onClick={(e) => { e.preventDefault(); onNavClick('experience'); }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Briefcase className="w-4 h-4 text-[#00f5d4]" />
              <span className="font-bold text-[11px] uppercase tracking-wider">Experience</span>
            </a>
            <a
              href="#gallery"
              onClick={(e) => { e.preventDefault(); onNavClick('gallery'); }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ImageIcon className="w-4 h-4 text-[#fee440]" />
              <span className="font-bold text-[11px] uppercase tracking-wider">Gallery</span>
            </a>
          </div>
        </div>

        <a
          href="#works"
          onClick={(e) => { e.preventDefault(); onNavClick('works'); }}
          className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-300 flex items-center gap-1.5 sm:gap-2 ${activeNav === "Works" ? "bg-[#232327] text-white font-bold" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}
        >
          <Sparkles className="w-3.5 h-3.5 opacity-80 hidden md:inline-block" /> Works
        </a>


        <a
          href="#contact"
          onClick={(e) => { e.preventDefault(); onNavClick('home', '#contact'); }}
          className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-300 flex items-center gap-1.5 sm:gap-2 ${activeNav === "Contact" ? "bg-[#232327] text-white font-bold" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}
        >
          <Mail className="w-3.5 h-3.5 opacity-80 hidden md:inline-block" /> Contact
        </a>

        <span aria-hidden="true" className="w-px h-5 bg-white/15 mx-0.5" />
        <ThemeToggle />

      </nav>
    </div>
  );
}