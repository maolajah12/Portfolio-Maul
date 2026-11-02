import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

// MODAL 1: DETAIL PROYEK (satu foto utama, warna aksen mengikuti proyek)
export default function ProjectModal({ project, onClose, onRequestSimilar }) {
  // Simpan proyek terakhir agar animasi keluar tetap punya isi saat `project` sudah null
  const [shown, setShown] = useState(project);
  const [leaving, setLeaving] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    clearTimeout(timer.current);
    if (project) {
      setShown(project);
      setLeaving(false);
    } else if (shown) {
      setLeaving(true);
      timer.current = setTimeout(() => { setShown(null); setLeaving(false); }, 260);
    }
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  // Esc untuk menutup + kunci scroll latar selama modal terbuka
  useEffect(() => {
    if (!project) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [project, onClose]);

  if (!shown) return null;

  const accent = shown.accent || '#ff1e56';
  const photo = shown.image || (shown.images && shown.images[0]);
  const stack = shown.tags || shown.tools || [];

  return (
    <div
      onClick={onClose}
      data-leaving={leaving ? '1' : '0'}
      className="pm-overlay fixed inset-0 z-50 bg-black/85 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={shown.title}
    >
      <style>{`
        @keyframes pm-bg-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pm-bg-out { from { opacity: 1; } to { opacity: 0; } }
        @keyframes pm-in { from { opacity: 0; transform: translateY(28px) scale(.94); } to { opacity: 1; transform: none; } }
        @keyframes pm-out { from { opacity: 1; transform: none; } to { opacity: 0; transform: translateY(16px) scale(.96); } }
        .pm-overlay { animation: pm-bg-in .3s ease-out both; }
        .pm-overlay[data-leaving="1"] { animation: pm-bg-out .26s ease-in both; pointer-events: none; }
        .pm-panel { animation: pm-in .45s cubic-bezier(.22,1,.36,1) both; }
        .pm-overlay[data-leaving="1"] .pm-panel { animation: pm-out .26s ease-in both; }
        @media (prefers-reduced-motion: reduce) { .pm-overlay, .pm-panel { animation-duration: .01s !important; } }
      `}</style>

      <div className="min-h-full flex items-center justify-center p-4 py-10">
        <div
          onClick={(e) => e.stopPropagation()}
          className="pm-panel relative w-full max-w-2xl bg-[#121212] border-2 border-white"
          style={{ boxShadow: `10px 10px 0px ${accent}` }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute -top-4 -right-4 z-10 w-10 h-10 bg-white text-black border-2 border-black flex items-center justify-center hover:text-white transition-colors cursor-pointer"
            style={{ '--a': accent }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; }}
          >
            <X className="w-5 h-5" />
          </button>

          {/* SATU FOTO UTAMA */}
          {photo && (
            <div className="relative aspect-[16/9] w-full bg-black overflow-hidden border-b-2 border-white">
              <img
                src={photo}
                alt={shown.title}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span className="absolute left-0 bottom-0 h-1 w-24" style={{ backgroundColor: accent }} />
            </div>
          )}

          <div className="p-6 sm:p-8">
            <span className="font-sans-tech text-xs uppercase tracking-widest font-bold" style={{ color: accent }}>
              {shown.code} • {shown.year}
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3xl uppercase mt-1 mb-4 leading-tight">
              {shown.title}
            </h3>

            <p className="font-sans-tech text-neutral-300 text-sm leading-relaxed mb-6">
              {shown.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-dashed border-white/20">
              <div className="flex flex-wrap gap-2">
                {stack.map((t) => (
                  <span key={t} className="px-2.5 py-1 bg-white/10 text-xs font-sans-tech">
                    #{t}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={onRequestSimilar}
                className="px-5 py-2 text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
                style={{ backgroundColor: accent }}
              >
                Request Similar Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}