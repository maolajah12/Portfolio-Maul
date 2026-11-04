import { useEffect, useRef, useState } from 'react';
import { Check, Loader2, X } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { BrutalStar, Barcode } from '../decor';

// Kredensial EmailJS dari Environment Variables
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const PROJECT_TYPES = [
  'Web Development',
  'UI/UX & Graphic Design',
  'Custom Illustration / Vector Art',
  'Mobile App',
  'Full-Time / Freelance Inquiry',
  'Just Saying Hi',
];

// Tekstur kertas kusut yang sama dengan kartu di Contact
const PAPER_STYLE = {
  backgroundColor: '#e6e6e6',
  backgroundImage: `
    radial-gradient(at 18% 28%, rgba(255, 255, 255, 0.85) 0px, transparent 50%),
    radial-gradient(at 82% 22%, rgba(0, 0, 0, 0.08) 0px, transparent 40%),
    radial-gradient(at 38% 72%, rgba(0, 0, 0, 0.09) 0px, transparent 45%),
    radial-gradient(at 88% 84%, rgba(255, 255, 255, 0.75) 0px, transparent 50%),
    linear-gradient(125deg, rgba(0, 0, 0, 0.04) 25%, transparent 25%, transparent 50%, rgba(0, 0, 0, 0.06) 50%, rgba(0, 0, 0, 0.06) 75%, transparent 75%, transparent)
  `,
};

const FIELD =
  'w-full px-3.5 py-2.5 bg-white/90 border-2 border-black focus:outline-none focus:border-[#ff1e56] transition-colors text-black font-sans font-medium';

// MODAL "HIRE MAULANA": kartu kertas kusut bergaya Contact, terhubung ke EmailJS
export default function HireModal({ open, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', type: PROJECT_TYPES[0], brief: '' });
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const firstField = useRef(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleClose = () => {
    onClose();
    // reset setelah animasi tutup agar form berikutnya bersih
    setTimeout(() => { setSent(false); setError(''); }, 200);
  };

  // Esc untuk menutup, kunci scroll latar, fokus ke kolom pertama
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => firstField.current?.focus(), 80);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const sendEmail = (e) => {
    e.preventDefault();
    if (isSending) return;
    setIsSending(true);
    setError('');

    // Nama variabel sama dengan form Contact (from_name, reply_to, subject, message)
    const params = {
      from_name: form.name,
      reply_to: form.email,
      subject: `Hire inquiry: ${form.type}`,
      message: `Project type: ${form.type}\n\n${form.brief}`,
    };

    emailjs.send(SERVICE_ID, TEMPLATE_ID, params, PUBLIC_KEY).then(
      () => {
        setIsSending(false);
        setSent(true);
        setForm({ name: '', email: '', type: PROJECT_TYPES[0], brief: '' });
      },
      () => {
        setIsSending(false);
        setError('Failed to send message. Please try again later.');
      }
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm overflow-y-auto"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Hire Maulana"
    >
      <style>{`@keyframes hire-pop { from { opacity: 0; transform: translateY(18px) scale(.94) rotate(-1deg); } to { opacity: 1; transform: none; } }`}</style>

      <div className="min-h-full flex items-center justify-center p-4 py-10 sm:p-6">
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg text-black p-6 sm:p-9 shadow-[12px_12px_0px_#ff1e56] border-2 border-white select-none"
          style={{ ...PAPER_STYLE, animation: 'hire-pop .35s cubic-bezier(.2,1.2,.3,1) both' }}
        >
          <BrutalStar color="#ff1e56" points={12} className="w-14 h-14 absolute -top-7 -left-5 z-30 pointer-events-none" />

          {/* Stiker pojok */}
          <div className="absolute -top-4 right-14 bg-black text-white px-3 py-1 font-syne font-bold text-[10px] tracking-widest uppercase rotate-2">
            HIRE ME // 2026
          </div>

          {/* Lakban */}
          <span aria-hidden="true" className="absolute -top-3 left-14 w-16 h-6 bg-[#fee440]/90 -rotate-2 shadow-sm border border-black/15 pointer-events-none" />

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="absolute -top-4 -right-4 w-10 h-10 bg-[#ff1e56] text-white border-2 border-black flex items-center justify-center hover:bg-black transition-colors cursor-pointer shadow-[3px_3px_0_#0c0c0c] z-30"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-6 border-b-2 border-dashed border-black/40 pb-3">
            <span className="font-marker text-sm text-[#ff1e56] -rotate-2 inline-block">let's collaborate!</span>
            <h3 className="font-syne font-black text-2xl sm:text-3xl uppercase tracking-tight leading-none mt-1">
              WORK WITH MAULANA
            </h3>
          </div>

          {sent ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-14 h-14 bg-black text-white mx-auto flex items-center justify-center rounded-full">
                <Check className="w-7 h-7 text-emerald-400" />
              </div>
              <h4 className="font-syne font-black text-2xl uppercase">MESSAGE SENT!</h4>
              <p className="font-sans text-xs sm:text-sm text-neutral-800 max-w-xs mx-auto font-medium">
                Thanks for reaching out! Your inquiry has been received and I will get back to you shortly.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-2 px-5 py-2.5 bg-black text-white font-syne font-bold text-xs uppercase tracking-wider hover:bg-[#ff1e56] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={sendEmail} className="space-y-4 font-mono text-xs sm:text-sm font-bold">
              <div>
                <label htmlFor="hire_name" className="block uppercase text-xs mb-1">Name / Studio *</label>
                <input
                  ref={firstField}
                  id="hire_name"
                  type="text"
                  required
                  value={form.name}
                  onChange={set('name')}
                  placeholder="e.g. Alex from Studio X"
                  className={FIELD}
                />
              </div>

              <div>
                <label htmlFor="hire_email" className="block uppercase text-xs mb-1">Email Address *</label>
                <input
                  id="hire_email"
                  type="email"
                  required
                  value={form.email}
                  onChange={set('email')}
                  placeholder="you@domain.com"
                  className={FIELD}
                />
              </div>

              <div>
                <label htmlFor="hire_type" className="block uppercase text-xs mb-1">Project Type</label>
                <select id="hire_type" value={form.type} onChange={set('type')} className={`${FIELD} cursor-pointer`}>
                  {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="hire_brief" className="block uppercase text-xs mb-1">Project Brief *</label>
                <textarea
                  id="hire_brief"
                  rows="4"
                  required
                  value={form.brief}
                  onChange={set('brief')}
                  placeholder="Tell me about your timeline, ideas, and goals..."
                  className={`${FIELD} resize-none`}
                />
              </div>

              {error && <p className="text-[#ff1e56] font-bold text-xs animate-pulse">{error}</p>}

              <button
                type="submit"
                disabled={isSending}
                className="w-full flex justify-center items-center py-3.5 bg-black text-white font-syne font-black text-sm uppercase tracking-widest hover:bg-[#ff1e56] transition-colors shadow-[5px_5px_0px_#ff1e56] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> SENDING...
                  </span>
                ) : (
                  'SEND INQUIRY →'
                )}
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t-2 border-dashed border-black/40 pointer-events-none flex justify-center">
            <Barcode className="h-7" color="#0c0c0c" />
          </div>
        </div>
      </div>
    </div>
  );
}