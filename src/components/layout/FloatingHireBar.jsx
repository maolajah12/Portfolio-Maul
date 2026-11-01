import { X } from 'lucide-react';

// FLOATING BOTTOM BAR ("Maulana is available for hire" - Hanya di Halaman Home)
export default function FloatingHireBar({ onHire, onDismiss }) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-lg bg-[#161616]/95 backdrop-blur-md border border-white/20 rounded-full px-4 py-2.5 shadow-[0_10px_40px_rgba(0,0,0,0.9)] flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
            alt="Maulana Avatar"
            className="w-8 h-8 rounded-full object-cover grayscale contrast-125 border border-white/40"
          />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute bottom-0 right-0 ring-2 ring-[#161616]" />
        </div>
        <span className="font-sans-tech text-xs sm:text-sm font-medium text-white">
          Maulana is available for hire
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onHire}
          className="px-4 py-1.5 rounded-full bg-white text-black hover:bg-[#ff1e56] hover:text-white font-sans-tech font-bold text-xs transition-colors"
        >
          Hire Maulana
        </button>
        <button
          onClick={onDismiss}
          className="p-1 text-neutral-400 hover:text-white transition-colors"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
