import { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import FloatingHireBar from './components/layout/FloatingHireBar.jsx';
import ProjectModal from './components/modals/ProjectModal.jsx';
import HireModal from './components/modals/HireModal.jsx';
import HomePage from './pages/HomePage.jsx';
import SkillsPage from './pages/SkillsPage.jsx';
import ExperiencePage from './pages/ExperiencePage.jsx';
import WorksPage from './pages/WorksPage';
import GalleryPage from './pages/GalleryPage.jsx';

export default function App() {
  const [activeProject, setActiveProject] = useState(null);
  const [hireModalOpen, setHireModalOpen] = useState(false);
  // Bar hire: ingat pilihan sembunyi/tampil selama tab ini terbuka
  const [showFloatingBar, setShowFloatingBarState] = useState(() => {
    try { return window.sessionStorage.getItem('hireBarHidden') !== '1'; } catch { return true; }
  });
  const setShowFloatingBar = (v) => {
    setShowFloatingBarState(v);
    try { window.sessionStorage.setItem('hireBarHidden', v ? '0' : '1'); } catch { /* abaikan */ }
  };
  const [activeNav, setActiveNav] = useState("Home");
  const [currentPage, setCurrentPage] = useState("home"); // State untuk Halaman Baru

  // Halaman yang sedang tampil (ref, supaya listener event tidak memakai nilai usang)
  const pageRef = useRef('home');

  // Logika navigasi halaman dan scroll
  const handleNavClick = (page, hash) => {
    // Tentukan status navbar yang aktif
    let navState = 'Home';
    if (page === 'skills' || page === 'experience') navState = 'About';
    else if (page === 'works' || hash === '#works') navState = 'Works';
    else if (hash === '#contact') navState = 'Contact';
    else if (page === 'gallery') navState = 'Gallery';

    const changed = pageRef.current !== page;

    // Ganti halaman + naik ke atas dalam satu langkah, tanpa scroll animasi
    // (scroll animasi saat halaman berganti membuat layar terlihat melompat/berkedip)
    const apply = () => {
      pageRef.current = page;
      setCurrentPage(page);
      setActiveNav(navState);
      if (changed) window.scrollTo({ top: 0, behavior: 'instant' });
    };

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (changed && document.startViewTransition && !reduce) {
      // Browser menahan tampilan lama sampai halaman baru siap lalu menyilangkannya dengan halus
      const vt = document.startViewTransition(() => flushSync(apply));
      // Jika transisi dibatalkan (mis. layar diputar), abaikan tanpa error
      vt.ready?.catch(() => { });
      vt.finished?.catch(() => { });
      vt.updateCallbackDone?.catch(() => { });
    } else {
      apply();
    }

    if (page === 'home' && hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (!changed) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Dengarkan event navigasi dari komponen lain (mis. tombol di HomePage)
  useEffect(() => {
    const onNav = (e) => handleNavClick(e.detail.page, e.detail.hash);
    window.addEventListener('portfolio:navigate', onNav);
    return () => window.removeEventListener('portfolio:navigate', onNav);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white font-sans relative overflow-x-clip selection:bg-[#ff1e56] selection:text-white">

      {/* Transisi antar halaman: tanpa fade-in dari transparan (penyebab layar berkedip) */}
      <style>{`
        .animate-fade-in { animation: none !important; opacity: 1 !important; }
        /* Halaman lama memudar pelan, halaman baru muncul perlahan di atasnya */
        ::view-transition-old(root) { animation: pt-out .45s ease-in-out both; }
        ::view-transition-new(root) { animation: pt-in .8s cubic-bezier(.22,.61,.36,1) both; }
        @keyframes pt-out { to { opacity: 0; } }
        @keyframes pt-in { from { opacity: 0; } to { opacity: 1; } }
        /* Browser tanpa View Transitions: halaman baru tetap muncul perlahan */
        @supports not (view-transition-name: none) { .pt-page { animation: pt-in .7s ease-out both; } }
        @media (prefers-reduced-motion: reduce) { ::view-transition-old(root), ::view-transition-new(root) { animation: none !important; } .pt-page { animation: none !important; } }
      `}</style>

      {/* Overlay Grain & Dust */}
      <div className="fixed inset-0 bg-noise pointer-events-none z-0 opacity-60" />

      {/* FLOATING PILL NAVBAR */}
      <Navbar activeNav={activeNav} onNavClick={handleNavClick} />

      {/* HALAMAN */}
      <div key={currentPage} className="pt-page">
        {currentPage === 'home' && <HomePage onSelectProject={setActiveProject} />}
        {currentPage === 'skills' && <SkillsPage />}
        {currentPage === 'experience' && <ExperiencePage onHire={() => setHireModalOpen(true)} />}
        {currentPage === 'gallery' && <GalleryPage />}
        {currentPage === 'works' && (
          <WorksPage onSelectProject={setActiveProject} />
        )}
      </div>

      {/* FOOTER: tampil di semua halaman */}
      <Footer onNavClick={handleNavClick} currentPage={currentPage} />

      {/* BAR HIRE: tampil di semua halaman, bisa disembunyikan & dimunculkan lagi */}
      <FloatingHireBar
        visible={showFloatingBar}
        onHire={() => setHireModalOpen(true)}
        onHide={() => setShowFloatingBar(false)}
        onShow={() => setShowFloatingBar(true)}
      />

      {/* MODAL 1: DETAIL PROYEK */}
      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
        onRequestSimilar={() => {
          setActiveProject(null);
          setHireModalOpen(true);
        }}
      />

      {/* MODAL 2: HIRE MAULANA */}
      <HireModal open={hireModalOpen} onClose={() => setHireModalOpen(false)} />

    </div>
  );
}