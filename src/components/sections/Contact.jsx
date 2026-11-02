import { useState, useRef } from 'react';
import { Mail, Phone, Globe, Check, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import {
  FireSectionBadge, SmileyDoodle, CornerBracket, BrutalStar, Barcode
} from '../decor';

// 5. SECTION #4: CONTACT (GET IN TOUCH)
export default function Contact() {
  const formRef = useRef();
  const [isSending, setIsSending] = useState(false);
  const [contactSectionSent, setContactSectionSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSending(true);
    setErrorMessage("");

    // Kredensial EmailJS Anda yang sudah terintegrasi
    const SERVICE_ID = "service_naznen123";
    const TEMPLATE_ID = "template_col7w9l";
    const PUBLIC_KEY = "3ul2xbbrDl7mvELVF";

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      .then((result) => {
        console.log(result.text);
        setIsSending(false);
        setContactSectionSent(true);
      }, (error) => {
        console.log(error.text);
        setIsSending(false);
        setErrorMessage("Failed to send message. Please try again later.");
      });
  };

  return (
    <section id="contact" className="relative py-20 border-t border-white/10 select-none">
      <div className="mb-12">
        <FireSectionBadge number="4" label="Contact ME" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        {/* KOLOM KIRI: Teks Besar & Info Kontak Langsung */}
        <div className="lg:col-span-6 space-y-6 relative">
          <SmileyDoodle className="w-24 h-24 absolute -top-16 right-4 sm:right-12 opacity-80 rotate-12 pointer-events-none" />

          <h2 className="font-syne font-black text-4xl sm:text-6xl uppercase leading-[0.9] tracking-tighter text-white">
            LET'S MAKE<br />
            <span className="text-[#ff1e56] font-marker text-3xl sm:text-5xl inline-block -rotate-2 mt-2">
              SOMETHING
            </span><br />
            RAW & COOL.
          </h2>

          {/* Teks Deskripsi (Diterjemahkan ke Bahasa Inggris) */}
          <p className="font-sans text-neutral-300 text-sm sm:text-base max-w-md leading-relaxed">
            Got a crazy project idea, need help with web development, want to discuss code architecture, or just want to say hi? Don't hesitate to drop a message!
          </p>

          <div className="pt-4 space-y-3 font-mono text-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#ff1e56]">
                <Mail className="w-4 h-4" />
              </div>
              <span className="text-white">alghifarim60@gmail.com</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#ff1e56]">
                <Phone className="w-4 h-4" />
              </div>
              <span className="text-white">(+62) 821-6867-6512</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#ff1e56]">
                <Globe className="w-4 h-4" />
              </div>
              <span className="text-white">Medan, North Sumatera, Indonesia</span>
            </div>
          </div>

          <div className="pt-4">
            <CornerBracket position="bottom-left" />
          </div>
        </div>

        {/* KOLOM KANAN: Formulir Kontak (Gaya Kertas Kusut Brutalist) */}
        <div className="lg:col-span-6 relative flex justify-center">
          <BrutalStar color="#ff1e56" points={12} className="w-16 h-16 absolute -top-8 -left-4 z-30 pointer-events-none" />

          {/* Kartu Kertas Kusut */}
          <div
            className="relative z-20 w-full max-w-lg bg-[#e6e6e6] text-black p-6 sm:p-10 shadow-[12px_12px_0px_#ff1e56] border-2 border-white"
            style={{
              backgroundImage: `
                radial-gradient(at 18% 28%, rgba(255, 255, 255, 0.85) 0px, transparent 50%),
                radial-gradient(at 82% 22%, rgba(0, 0, 0, 0.08) 0px, transparent 40%),
                radial-gradient(at 38% 72%, rgba(0, 0, 0, 0.09) 0px, transparent 45%),
                radial-gradient(at 88% 84%, rgba(255, 255, 255, 0.75) 0px, transparent 50%),
                linear-gradient(125deg, rgba(0, 0, 0, 0.04) 25%, transparent 25%, transparent 50%, rgba(0, 0, 0, 0.06) 50%, rgba(0, 0, 0, 0.06) 75%, transparent 75%, transparent)
              `,
            }}
          >
            {/* Stiker Pojok Atas */}
            <div className="absolute -top-4 right-6 bg-black text-white px-3 py-1 font-syne font-bold text-[10px] tracking-widest uppercase rotate-2">
              DIRECT MESSAGE // 2026
            </div>

            <h3 className="font-syne font-black text-2xl sm:text-3xl uppercase tracking-tight mb-6 border-b-2 border-dashed border-black/40 pb-3">
              DROP A MESSAGE
            </h3>

            {contactSectionSent ? (
              <div className="py-12 text-center space-y-4 animate-fade-in">
                <div className="w-14 h-14 bg-black text-white mx-auto flex items-center justify-center rounded-full">
                  <Check className="w-7 h-7 text-emerald-400" />
                </div>
                {/* Teks Sukses (Diterjemahkan ke Bahasa Inggris) */}
                <h4 className="font-syne font-black text-2xl uppercase">MESSAGE SENT!</h4>
                <p className="font-sans text-xs sm:text-sm text-neutral-800 max-w-xs mx-auto font-medium">
                  Thanks for reaching out! Your message has been received and I will get back to you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setContactSectionSent(false)}
                  className="mt-4 px-5 py-2.5 bg-black text-white font-syne font-bold text-xs uppercase tracking-wider hover:bg-[#ff1e56] transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form
                ref={formRef}
                onSubmit={sendEmail}
                className="space-y-4 font-mono text-xs sm:text-sm font-bold"
              >
                <div>
                  <label htmlFor="user_name" className="block uppercase text-xs mb-1">Name / Alias *</label>
                  <input
                    id="user_name"
                    type="text"
                    name="from_name"
                    required
                    placeholder="Your Name..."
                    className="w-full px-3.5 py-2.5 bg-white/90 border-2 border-black focus:outline-none focus:border-[#ff1e56] transition-colors text-black font-sans font-medium"
                  />
                </div>

                <div>
                  <label htmlFor="user_email" className="block uppercase text-xs mb-1">Email Address *</label>
                  <input
                    id="user_email"
                    type="email"
                    name="reply_to"
                    required
                    placeholder="your@email.com"
                    className="w-full px-3.5 py-2.5 bg-white/90 border-2 border-black focus:outline-none focus:border-[#ff1e56] transition-colors text-black font-sans font-medium"
                  />
                </div>

                <div>
                  <label htmlFor="user_subject" className="block uppercase text-xs mb-1">Subject</label>
                  <input
                    id="user_subject"
                    type="text"
                    name="subject"
                    placeholder="Project / Collaboration / Say Hi"
                    className="w-full px-3.5 py-2.5 bg-white/90 border-2 border-black focus:outline-none focus:border-[#ff1e56] transition-colors text-black font-sans font-medium"
                  />
                </div>

                <div>
                  <label htmlFor="user_message" className="block uppercase text-xs mb-1">Your Message *</label>
                  <textarea
                    id="user_message"
                    name="message"
                    rows="4"
                    required
                    placeholder="Tell me everything about your project..."
                    className="w-full px-3.5 py-2.5 bg-white/90 border-2 border-black focus:outline-none focus:border-[#ff1e56] transition-colors text-black resize-none font-sans font-medium"
                  />
                </div>

                {errorMessage && (
                  <p className="text-[#ff1e56] font-bold text-xs animate-pulse">
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full flex justify-center items-center py-3.5 bg-black text-white font-syne font-black text-sm uppercase tracking-widest hover:bg-[#ff1e56] transition-colors shadow-[5px_5px_0px_rgba(0,0,0,0.25)] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> SENDING...
                    </span>
                  ) : (
                    "SEND MESSAGE →"
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
    </section>
  );
}