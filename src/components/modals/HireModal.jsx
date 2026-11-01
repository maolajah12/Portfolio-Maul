import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Barcode } from '../decor';

// MODAL 2: HIRE MAULANA (FORM KONTAK INTERAKTIF)
export default function HireModal({ open, onClose }) {
  const [contactSent, setContactSent] = useState(false);

  if (!open) return null;

  const handleClose = () => {
    onClose();
    setContactSent(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md crumpled-paper text-black p-6 sm:p-8 border-2 border-white shadow-[10px_10px_0px_#ff1e56]">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 bg-black text-white flex items-center justify-center hover:bg-[#ff1e56] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="font-marker text-sm text-[#ff1e56] uppercase">Let's Collaborate!</span>
          <h3 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight">
            WORK WITH MAULANA
          </h3>
        </div>

        {contactSent ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 bg-black text-white mx-auto flex items-center justify-center rounded-full">
              <Check className="w-6 h-6 text-emerald-400" />
            </div>
            <h4 className="font-display font-black text-xl uppercase">Message Dispatched!</h4>
            <p className="font-sans-tech text-xs text-neutral-700">
              Terima kasih! Maulana akan membalas pesan Anda ke email dalam waktu kurang dari 24 jam.
            </p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setContactSent(true);
            }}
            className="space-y-4 font-sans-tech text-xs sm:text-sm"
          >
            <div>
              <label className="block font-bold uppercase text-xs mb-1">Your Name / Studio</label>
              <input
                type="text"
                required
                placeholder="e.g. Alex from Studio X"
                className="w-full px-3 py-2 bg-white/80 border-2 border-black focus:outline-none focus:border-[#ff1e56]"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-xs mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@domain.com"
                className="w-full px-3 py-2 bg-white/80 border-2 border-black focus:outline-none focus:border-[#ff1e56]"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-xs mb-1">Project Type</label>
              <select className="w-full px-3 py-2 bg-white/80 border-2 border-black focus:outline-none focus:border-[#ff1e56] font-medium">
                <option>Graphic Design & Branding</option>
                <option>Custom Illustration / Merch</option>
                <option>Motion Design & Video Editing</option>
                <option>Full-Time / Freelance Inquiry</option>
              </select>
            </div>
            <div>
              <label className="block font-bold uppercase text-xs mb-1">Project Brief</label>
              <textarea
                rows="3"
                required
                placeholder="Tell me about your timeline, ideas, and goals..."
                className="w-full px-3 py-2 bg-white/80 border-2 border-black focus:outline-none focus:border-[#ff1e56]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-black text-white font-display font-black uppercase tracking-wider hover:bg-[#ff1e56] transition-colors shadow-[4px_4px_0px_#ff1e56]"
            >
              SEND INQUIRY →
            </button>
          </form>
        )}

        <div className="mt-6 pt-3 border-t border-black/20">
          <Barcode className="h-6" />
        </div>
      </div>
    </div>
  );
}
