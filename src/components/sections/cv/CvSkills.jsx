import { PenTool, Layout, Video, Share2, Layers, Sparkles } from 'lucide-react';
import { BrutalStar, CornerBracket } from '../../decor';

const CV_SKILLS = [
  { name: "DESIGN", icon: PenTool },
  { name: "LAYOUTS", icon: Layout },
  { name: "ILLUSTRATION", icon: Sparkles },
  { name: "VIDEO EDITING", icon: Video },
  { name: "SOCIAL MEDIA CONTENT", icon: Share2 },
  { name: "MOTION DESIGN & ANIMATION", icon: Layers },
];

// BAGIAN SKILLS (2 Kolom dengan Ikon Brutalist Pink)
export default function CvSkills() {
  return (
    <div id="skills" className="pt-2 max-w-md scroll-mt-28">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display font-black text-xl sm:text-2xl tracking-wider uppercase text-white">
          SKILLS
        </h3>
        <CornerBracket position="bottom-left" className="w-6 h-6 -mt-4" />
      </div>

      <div className="grid grid-cols-2 gap-y-4 gap-x-6">
        {CV_SKILLS.map((skill, idx) => {
          const IconComp = skill.icon;
          return (
            <div key={idx} className="flex items-center gap-2.5 group">
              <BrutalStar color="white" points={12} className="w-3.5 h-3.5 shrink-0 group-hover:rotate-90 transition-transform" />
              <div className="w-8 h-8 rounded border border-[#ff1e56] bg-[#ff1e56]/10 flex items-center justify-center shrink-0 group-hover:bg-[#ff1e56] group-hover:text-black transition-colors">
                <IconComp className="w-4 h-4 text-[#ff1e56] group-hover:text-black" />
              </div>
              <span className="font-display font-bold text-[11px] sm:text-xs tracking-wider uppercase leading-tight">
                {skill.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
