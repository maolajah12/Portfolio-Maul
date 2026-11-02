import Hero from '../components/sections/Hero.jsx';
import About from '../components/sections/About.jsx';
import CV from '../components/sections/CV.jsx';
import Works from '../components/sections/Works.jsx';
import TechMarquee from '../components/sections/TechMarquee.jsx';
import Contact from '../components/sections/Contact.jsx';
import Footer from '../components/layout/Footer.jsx';

// MAIN CONTAINER (HALAMAN HOME)
export default function HomePage({ onSelectProject }) {
  return (
    <main id="top" className="relative z-10 w-full max-w-[1800px] mx-auto px-5 sm:px-10 lg:px-20 xl:px-28 pt-12 pb-32 animate-fade-in">
      <Hero />
      <About />
      <CV />
      <TechMarquee />
      <Contact />
    </main>
  );
}
