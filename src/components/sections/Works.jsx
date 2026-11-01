import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { FireSectionBadge, BrutalStar } from '../decor';
import { PROJECTS_DATA, PROJECT_CATEGORIES } from '../../data/projects.js';

// 4. SECTION #3: SELECTED WORKS (GALERI INTERAKTIF)
export default function Works({ onSelectProject }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProjects = selectedCategory === "All"
    ? PROJECTS_DATA
    : PROJECTS_DATA.filter(p => p.category === selectedCategory);

  return (
    <section id="works" className="relative py-20 border-t border-white/10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
        <FireSectionBadge number="3" label="Selected WORKS" />

        {/* Filter Kategori Brutalist */}
        <div className="flex flex-wrap gap-2">
          {PROJECT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-sans-tech uppercase tracking-wider border transition-all ${
                selectedCategory === cat
                  ? "bg-[#ff1e56] text-white border-[#ff1e56] font-bold shadow-[3px_3px_0px_white]"
                  : "bg-black/60 text-neutral-300 border-white/30 hover:border-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Proyek */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => onSelectProject(project)}
            className="group relative bg-[#141414] border-2 border-white/20 hover:border-white p-6 transition-all duration-300 cursor-pointer hover:-translate-y-1 shadow-[0_15px_35px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* Efek Glare Halus */}
            <div className="absolute inset-0 plastic-glare opacity-40 group-hover:opacity-80 transition-opacity pointer-events-none" />

            {/* Header Kartu Proyek */}
            <div className="relative z-10 flex items-center justify-between text-xs font-sans-tech text-neutral-400 mb-4 pb-3 border-b border-dashed border-white/20">
              <span className="font-bold text-white">{project.code}</span>
              <span className="px-2 py-0.5 bg-white/10 text-white rounded-sm">{project.year}</span>
            </div>

            {/* Poster Grafis Visual */}
            <div
              className="relative z-10 h-48 sm:h-56 w-full mb-5 flex flex-col justify-between p-5 overflow-hidden border border-white/15"
              style={{
                background: `radial-gradient(circle at 80% 20%, ${project.accent}33 0%, #090909 75%)`
              }}
            >
              <div className="flex justify-between items-start">
                <span
                  className="px-2.5 py-1 text-[10px] font-display font-black uppercase tracking-widest text-black"
                  style={{ backgroundColor: project.accent }}
                >
                  {project.category}
                </span>
                <BrutalStar color={project.accent} points={8} className="w-7 h-7 group-hover:rotate-45 transition-transform" />
              </div>

              <div className="my-auto">
                <div className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-white group-hover:tracking-wider transition-all">
                  {project.title}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-sans-tech text-neutral-300">
                <span>CLICK TO INSPECT ZINE</span>
                <span className="flex items-center gap-1 text-white font-bold group-hover:translate-x-1 transition-transform">
                  VIEW CASE <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* Deskripsi Singkat */}
            <p className="relative z-10 font-sans-tech text-xs sm:text-sm text-neutral-300 mb-4 line-clamp-2">
              {project.description}
            </p>

            {/* Tags */}
            <div className="relative z-10 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-sans-tech px-2.5 py-0.5 bg-white/5 border border-white/15 text-neutral-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
