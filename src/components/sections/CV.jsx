import { FireSectionBadge } from '../decor';
import EducationCard from './cv/EducationCard.jsx';
import CvSkills from './cv/CvSkills.jsx';
import MyTools from './cv/MyTools.jsx';
import ExperienceCard from './cv/ExperienceCard.jsx';

// 3. SECTION #2: CV (EDUCATION, EXPERIENCE, SKILLS & TOOLS)
export default function CV() {
  return (
    <section id="cv" className="relative py-20">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

        {/* KOLOM KIRI: Badge #2 CV + Card Education + Skills & My Tools */}
        <div className="lg:col-span-6 space-y-10">

          <div className="flex items-start gap-4">
            <FireSectionBadge number="2" label="CV" />
          </div>

          <EducationCard />
          <CvSkills />
          <MyTools />

        </div>

        {/* KOLOM KANAN: CARD PROFESSIONAL EXPERIENCE */}
        <ExperienceCard />

      </div>
    </section>
  );
}
