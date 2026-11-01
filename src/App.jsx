import { useState } from 'react';
import Navbar from './components/layout/Navbar.jsx';
import FloatingHireBar from './components/layout/FloatingHireBar.jsx';
import ProjectModal from './components/modals/ProjectModal.jsx';
import HireModal from './components/modals/HireModal.jsx';
import HomePage from './pages/HomePage.jsx';
import SkillsPage from './pages/SkillsPage.jsx';

export default function App() {
  const [activeProject, setActiveProject] = useState(null);
  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [showFloatingBar, setShowFloatingBar] = useState(true);
  const [activeNav, setActiveNav] = useState("Home");
  const [currentPage, setCurrentPage] = useState("home"); // State untuk Halaman Baru

  // Logika navigasi halaman dan scroll
  const handleNavClick = (page, hash) => {
    setCurrentPage(page);

    // Tentukan status navbar yang aktif
    let navState = 'Home';
    if (page === 'skills' || hash === '#experience') navState = 'About';
    else if (hash === '#works') navState = 'Works';
    else if (hash === '#contact') navState = 'Contact';

    setActiveNav(navState);

    if (page === 'home' && hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (page === 'home' || page === 'skills') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white font-sans relative overflow-x-clip selection:bg-[#ff1e56] selection:text-white">

      {/* Overlay Grain & Dust */}
      <div className="fixed inset-0 bg-noise pointer-events-none z-0 opacity-60" />

      {/* FLOATING PILL NAVBAR */}
      <Navbar activeNav={activeNav} onNavClick={handleNavClick} />

      {/* HALAMAN */}
      {currentPage === 'home' && <HomePage onSelectProject={setActiveProject} />}
      {currentPage === 'skills' && <SkillsPage />}

      {/* FLOATING BOTTOM BAR (Hanya di Halaman Home) */}
      {showFloatingBar && currentPage === 'home' && (
        <FloatingHireBar
          onHire={() => setHireModalOpen(true)}
          onDismiss={() => setShowFloatingBar(false)}
        />
      )}

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
