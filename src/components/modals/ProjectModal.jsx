import { X } from 'lucide-react';

// MODAL 1: DETAIL PROYEK
export default function ProjectModal({ project, onClose, onRequestSimilar }) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-[#121212] border-2 border-white p-6 sm:p-8 shadow-[10px_10px_0px_#ff1e56]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-white text-black flex items-center justify-center hover:bg-[#ff1e56] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="font-sans-tech text-xs uppercase tracking-widest text-[#ff1e56] font-bold">
          {project.code} • {project.year}
        </span>
        <h3 className="font-display font-black text-2xl sm:text-4xl uppercase mt-1 mb-4">
          {project.title}
        </h3>

        <div className="p-6 bg-black border border-white/15 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 plastic-glare opacity-40" />
          <p className="font-sans-tech text-neutral-200 text-sm leading-relaxed relative z-10">
            {project.description}
          </p>
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400 font-sans-tech">
            <span>Role: Lead Designer & Illustrator</span>
            <span>Client: Confidential / Commission</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <span key={t} className="px-2.5 py-1 bg-white/10 text-xs font-sans-tech">
                #{t}
              </span>
            ))}
          </div>
          <button
            onClick={onRequestSimilar}
            className="px-5 py-2 bg-[#ff1e56] text-white font-display font-bold text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
          >
            Request Similar Project
          </button>
        </div>
      </div>
    </div>
  );
}
