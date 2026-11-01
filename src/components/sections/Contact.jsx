import { useState } from 'react';
import { Mail, Phone, Globe, Check } from 'lucide-react';
import {
  FireSectionBadge, SmileyDoodle, CornerBracket, BrutalStar, Barcode
} from '../decor';

// 5. SECTION #4: CONTACT (GET IN TOUCH)
export default function Contact() {
  const [contactSectionSent, setContactSectionSent] = useState(false);

  return (
    <section id="contact" className="relative py-20 border-t border-white/10">
      <div className="mb-12">
        <FireSectionBadge number="4" label="Contact ME" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        {/* KOLOM KIRI: Teks Besar & Info Kontak Langsung */}
        <div className="lg:col-span-6 space-y-6 relative">
          <SmileyDoodle className="w-24 h-24 absolute -top-16 right-4 sm:right-12 opacity-80 rotate-12 pointer-events-none" />

          <h2 className="font-bbh font-black text-4xl sm:text-6xl uppercase leading-[0.9] tracking-tighter text-white">
            LET'S MAKE<br />
            <span className="text-[#ff1e56] font-marker text-3xl sm:text-5xl inline-block -rotate-2 mt-2">
              SOMETHING
            </span><br />
            RAW & COOL.
          </h2>

          <p className="font-sans-tech text-neutral-300 text-sm sm:text-base max-w-md leading-relaxed">
            Punya ide proyek gila, butuh ilustrasi kustom, rebranding, atau sekadar ingin menyapa? Jangan ragu untuk mengirim pesan!
          </p>

          <div className="pt-4 space-y-3 font-sans-tech text-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#ff1e56]">
                <Mail className="w-4 h-4" />
              </div>
              <span className="text-white">maulana@gmail.com</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#ff1e56]">
                <Phone className="w-4 h-4" />
              </div>
              <span className="text-white">+351 936 562 723</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#ff1e56]">
                <Globe className="w-4 h-4" />
              </div>
              <span className="text-white">Medan, Indonesia (Available Worldwide)</span>
            </div>
          </div>

          <div className="pt-4">
            <CornerBracket position="bottom-left" />
          </div>
        </div>

        {/* KOLOM KANAN: Formulir Kontak (Gaya Kertas Kusut Brutalist) */}
        <div className="lg:col-span-6 relative flex justify-center">
          <BrutalStar color="#ff1e56" points={12} className="w-16 h-16 absolute -top-8 -left-4 z-30" />

          <div className="relative z-20 w-full max-w-lg crumpled-paper text-black p-6 sm:p-10 shadow-[12px_12px_0px_#ff1e56] border-2 border-white">

            {/* Stiker Pojok Atas */}
            <div className="absolute -top-4 right-6 bg-black text-white px-3 py-1 font-display font-bold text-[10px] tracking-widest uppercase rotate-2">
              DIRECT MESSAGE // 2023
            </div>

            <h3 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight mb-6 border-b-2 border-dashed border-black/40 pb-3">
              DROP A MESSAGE
            </h3>

            {contactSectionSent ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 bg-black text-white mx-auto flex items-center justify-center rounded-full">
                  <Check className="w-7 h-7 text-emerald-400" />
                </div>
                <h4 className="font-display font-black text-2xl uppercase">TERKIRIM!</h4>
                <p className="font-sans-tech text-xs sm:text-sm text-neutral-800 max-w-xs mx-auto">
                  Terima kasih telah menghubungi! Pesan Anda sudah masuk dan akan segera dibalas.
                </p>
                <button
                  onClick={() => setContactSectionSent(false)}
                  className="mt-4 px-5 py-2 bg-black text-white font-display font-bold text-xs uppercase tracking-wider hover:bg-[#ff1e56] transition-colors"
                >
                  Kirim Pesan Lain
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setContactSectionSent(true);
                }}
                className="space-y-4 font-sans-tech text-xs sm:text-sm"
              >
                <div>
                  <label className="block font-bold uppercase text-xs mb-1">Name / Alias *</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name..."
                    className="w-full px-3.5 py-2.5 bg-white/90 border-2 border-black focus:outline-none focus:border-[#ff1e56] transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-xs mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    className="w-full px-3.5 py-2.5 bg-white/90 border-2 border-black focus:outline-none focus:border-[#ff1e56] transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-xs mb-1">Subject</label>
                  <input
                    type="text"
                    placeholder="Project / Collaboration / Say Hi"
                    className="w-full px-3.5 py-2.5 bg-white/90 border-2 border-black focus:outline-none focus:border-[#ff1e56] transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-xs mb-1">Your Message *</label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Tell me everything about your project..."
                    className="w-full px-3.5 py-2.5 bg-white/90 border-2 border-black focus:outline-none focus:border-[#ff1e56] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-black text-white font-display font-black text-sm uppercase tracking-widest hover:bg-[#ff1e56] transition-colors shadow-[5px_5px_0px_rgba(0,0,0,0.25)]"
                >
                  SEND MESSAGE →
                </button>
              </form>
            )}

            <div className="mt-6 pt-4 border-t-2 border-dashed border-black/40">
              <Barcode className="h-7" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
