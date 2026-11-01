import { CircularStamp, BrutalStar, Barcode } from '../../decor';

// KOLOM KANAN: CARD PROFESSIONAL EXPERIENCE (Tekstur Kertas Kusut Panjang)
export default function ExperienceCard() {
  return (
    <div id="experience" className="lg:col-span-6 relative flex justify-center lg:justify-end mt-6 lg:mt-16 scroll-mt-28">

      {/* Mahkota Ledakan Merah di Atas Card Experience */}
      <svg viewBox="0 0 120 80" className="w-24 h-16 absolute -top-12 left-8 sm:left-16 stroke-[#ff1e56] fill-none z-0" strokeWidth="3">
        <path d="M10 70 L25 20 L50 55 L65 10 L85 55 L110 25 L100 70" />
      </svg>

      {/* Stempel Melingkar di Pojok Kanan Atas Card Experience */}
      <div className="absolute -top-14 -right-6 sm:-right-8 z-30">
        <CircularStamp
          size={125}
          centerIcon={
            <div className="w-8 h-8 rounded-full border-2 border-[#ff1e56] flex items-center justify-center">
              <div className="w-4 h-0.5 bg-[#ff1e56] rotate-45" />
            </div>
          }
        />
      </div>

      {/* Bintang Ledakan Putih di Sisi Kanan Card */}
      <BrutalStar color="white" points={12} className="w-20 h-20 absolute bottom-20 -right-8 z-30 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]" />

      {/* CARD EXPERIENCE */}
      <div className="relative z-20 w-full max-w-md crumpled-paper text-black p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.95)] border border-white/40">

        {/* Header Professional Experience */}
        <div className="text-center mb-6">
          <span className="font-sans-tech text-xs tracking-widest lowercase block text-neutral-700 -mb-1">
            professional
          </span>
          <div className="inline-block bg-black text-white px-4 py-1 mt-1">
            <span className="font-display font-black text-xl sm:text-2xl tracking-[0.18em] uppercase">
              EXPERIENCE
            </span>
          </div>
        </div>

        <div className="border-t-2 border-dashed border-black/40 my-4" />

        {/* Daftar Pengalaman Kerja */}
        <div className="space-y-6 font-sans-tech text-xs sm:text-sm">

          {/* Job 1 */}
          <div>
            <div className="flex justify-between items-baseline font-bold">
              <span>2022</span>
              <span className="text-[11px] font-normal text-neutral-700">6 months</span>
            </div>
            <div className="font-bold text-neutral-900">
              Graphic Designer & Illustrator
            </div>
            <div className="text-xs text-neutral-800 font-medium">
              Local Nature Reserve of Paul de Tornada
            </div>
            <div className="text-[11px] italic text-neutral-600 mb-2">internship</div>
            <ul className="text-xs text-neutral-800 space-y-0.5 pl-2 border-l-2 border-black/30">
              <li>- Advertisement Materials</li>
              <li>- Social media content</li>
              <li>- Branding</li>
              <li>- Illustration</li>
            </ul>
          </div>

          <div className="border-t border-dashed border-black/30" />

          {/* Job 2 */}
          <div>
            <div className="font-bold">2020 - Now</div>
            <div className="font-bold text-neutral-900 mb-1.5">Freelancer</div>
            <ul className="text-xs text-neutral-800 space-y-0.5 pl-2 border-l-2 border-black/30">
              <li>- Design</li>
              <li>- Album artworks</li>
              <li>- Illustrations</li>
            </ul>
          </div>

          <div className="border-t border-dashed border-black/30" />

          {/* Job 3 */}
          <div>
            <div className="flex justify-between items-baseline font-bold">
              <span>2018 - 2019</span>
              <span className="text-[11px] font-normal text-neutral-700">3 months</span>
            </div>
            <div className="font-bold text-neutral-900">Graphic Designer</div>
            <div className="text-xs text-neutral-800 font-medium">MoonOp Brand Agency</div>
            <div className="text-[11px] italic text-neutral-600 mb-2">internship</div>
            <ul className="text-xs text-neutral-800 space-y-0.5 pl-2 border-l-2 border-black/30">
              <li>- Branding</li>
              <li>- Motion Design</li>
              <li>- Video editing and post-production</li>
            </ul>
          </div>

          <div className="border-t border-dashed border-black/30" />

          {/* Job 4 */}
          <div>
            <div className="flex justify-between items-baseline font-bold">
              <span>2018</span>
              <span className="text-[11px] font-normal text-neutral-700">3 months</span>
            </div>
            <div className="font-bold text-neutral-900">Multimedia Technician</div>
            <div className="text-xs text-neutral-800 font-medium">Arte Estúdio Imaginário</div>
            <div className="text-[11px] italic text-neutral-600 mb-2">internship</div>
            <ul className="text-xs text-neutral-800 space-y-0.5 pl-2 border-l-2 border-black/30">
              <li>- 2D Animation</li>
              <li>- Stop-motion Animation</li>
              <li>- Video editing and post-production</li>
            </ul>
          </div>

        </div>

        <div className="border-t-2 border-dashed border-black/40 my-5" />

        {/* Barcode Bawah */}
        <Barcode />
      </div>

    </div>
  );
}
