import { useState } from 'react';
import useWheelRotation from '../hooks/useWheelRotation.js';
import RollingTitle from '../components/skills/RollingTitle.jsx';
import ShootingStars from '../components/skills/ShootingStars.jsx';
import SkillWheel from '../components/skills/SkillWheel.jsx';
import SkillModal from '../components/skills/SkillModal.jsx';
import { SKILLS_LIST } from '../data/skills.js';
import ServiceAccordion from '../components/sections/ServiceAccordion';

// SKILLS PAGE (3D ROLLING KINETIC TYPOGRAPHY & WHEEL)
export default function SkillsPage() {
  const [isWheelPaused, setIsWheelPaused] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  const { rotation, setRotation } = useWheelRotation({
    active: !isWheelPaused && !selectedSkill,
  });

  const focusSkillCard = (index, skill) => {
    const step = 360 / SKILLS_LIST.length;
    const targetRotation = -index * step;
    setRotation(targetRotation);
    setSelectedSkill(skill);
  };

  return (
    <main className="relative z-10 w-full min-h-screen overflow-x-clip animate-fade-in flex flex-col justify-between select-none bg-[#0c0c0c]">

      {/* BAGIAN ATAS: Judul 3D + bintang jatuh */}
      <div className="relative w-full h-[52vh] flex flex-col justify-between px-4 sm:px-10 md:px-16 pt-24 pb-2">

        <ShootingStars count={22} />

        <span className="absolute top-28 left-[36%] text-neutral-600 font-mono text-sm pointer-events-none hidden md:block">+</span>
        <span className="absolute top-28 right-[32%] text-neutral-600 font-mono text-sm pointer-events-none hidden md:block">+</span>
        <span className="absolute bottom-6 left-[36%] text-neutral-600 font-mono text-sm pointer-events-none hidden md:block">+</span>
        <span className="absolute bottom-6 right-[32%] text-neutral-600 font-mono text-sm pointer-events-none hidden md:block">+</span>

        <div className="relative z-20 w-full max-w-[1600px] mx-auto h-6" />

        <RollingTitle word="SKILLS" />

        <div className="relative z-20 flex items-center justify-between w-full max-w-[1500px] mx-auto pt-2 px-2">
          <span className="font-sans-tech font-bold text-[10px] sm:text-xs tracking-[0.24em] text-neutral-300 uppercase">
            MAULANA AL GHIFARI
          </span>
          <span className="font-sans-tech font-bold text-[10px] sm:text-xs tracking-[0.24em] text-neutral-300 uppercase">
            CREATIVE DEVELOPER & DESIGNER
          </span>
        </div>

      </div>

      {/* BAGIAN TENGAH: RODA KARTU */}
      <SkillWheel
        rotation={rotation}
        onPauseChange={setIsWheelPaused}
        onSelectSkill={focusSkillCard}
      />

      {/* BAGIAN BAWAH: SERVICE ACCORDION */}
      <ServiceAccordion />

      {/* MODAL INSPEKSI SKILL */}
      <SkillModal skill={selectedSkill} onClose={() => setSelectedSkill(null)} />

    </main>
  );
}