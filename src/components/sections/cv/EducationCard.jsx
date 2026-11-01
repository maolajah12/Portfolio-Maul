import { Sparkles } from 'lucide-react';
import { Barcode, BrutalStar } from '../../decor';

// CARD EDUCATION (Tekstur Abu-abu Kebiruan + Efek Plastik Mengkilap + Barcode)
export default function EducationCard() {
  return (
    <div className="relative mx-auto sm:mx-0 max-w-md bg-[#87939a] text-black p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.85)] border border-white/20 overflow-hidden group">
      {/* Sparkle Pink di Pojok Kiri Atas */}
      <Sparkles className="w-7 h-7 text-[#ff1e56] absolute top-2 left-2 z-20" />

      {/* Efek Plastic Wrap Glare */}
      <div className="absolute inset-0 plastic-glare pointer-events-none z-10" />

      {/* Judul Education dengan Efek Outline / Double Layer */}
      <div className="relative z-20 text-center mb-6">
        <div className="inline-block relative">
          <span className="font-display font-black text-2xl sm:text-3xl uppercase tracking-wider text-black block">
            Education
          </span>
          <span className="font-display font-black text-2xl sm:text-3xl uppercase tracking-wider text-transparent stroke-black absolute top-1 left-1 -z-10 select-none" style={{ WebkitTextStroke: '1px rgba(0,0,0,0.4)' }}>
            Education
          </span>
        </div>
      </div>

      {/* Garis Putus-putus */}
      <div className="border-t-2 border-dashed border-black/50 my-4 relative z-20" />

      {/* Item Pendidikan 1 */}
      <div className="relative z-20 space-y-1 text-xs sm:text-sm font-sans-tech">
        <div className="font-bold text-black">2020 - 2022</div>
        <div className="font-bold text-neutral-900">
          Tesp Illustration and Graphic Production
        </div>
        <div className="text-neutral-800 text-xs">ESAD.CR</div>
      </div>

      {/* Item Pendidikan 2 */}
      <div className="relative z-20 space-y-1 text-xs sm:text-sm font-sans-tech mt-5">
        <div className="font-bold text-black">2016 - 2019</div>
        <div className="font-bold text-neutral-900">
          Multimedia Technician Professional Course
        </div>
        <div className="text-neutral-800 text-xs">
          Escola Secundária José Saramago
        </div>
      </div>

      {/* Garis Putus-putus Bawah */}
      <div className="border-t-2 border-dashed border-black/50 my-5 relative z-20" />

      {/* Barcode */}
      <div className="relative z-20 pt-1">
        <Barcode />
      </div>

      {/* Bintang Putih Kecil di Sisi Kiri Bawah Card */}
      <BrutalStar color="white" points={12} className="w-10 h-10 absolute bottom-6 -left-3 z-20" />
    </div>
  );
}
