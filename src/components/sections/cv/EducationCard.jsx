import React from 'react';
import { Barcode, BrutalStar } from '../../decor';

const EDUCATION_ITEMS = [
  {
    period: '29 June 2023 - 24 June 2026',
    degree: 'Diploma of Education, Informatics Engineering',
    institution: 'UNIVERSITAS SUMATERA UTARA — GPA 3.72 / 4.00',
    thesis:
      'Thesis: Development of a Fitness Tracker Application with Recommendation Features Based on Age, Height, and Weight',
    focus: 'Areas of Study: Programming, Web Development, Database Management',
  },
];

const KEY_CERTIFICATIONS = [
  'HCIA-AI V3.5 Course — Huawei (Jun 2025)',
  'Claude Code in Action — Anthropic (May 2026)',
  'Data Science & Python Essentials 2 — Cisco (Sep 2026)',
  'Networking Basics — Cisco Academy (Sep 2026)',
  'CGSA-CCTV Security Associate — Hikvision (Sep 2026)',
  'SMK3 SNI ISO 45001:2018 — BSN (Oct 2026)',
  'Microsoft Office (Score: 92.33 Excellent) — Insan Cemerlang',
];

export default function EducationCard() {
  return (
    <div className="relative bg-[#9ab0b8] text-[#0c0c0c] p-7 sm:p-9 shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden select-none">
      {/* Efek Kilap Plastik (Plastic Glare) */}
      <div className="absolute inset-0 plastic-glare z-20 pointer-events-none" />

      {/* Bintang Brutalist di Tepi Kiri */}
      <div className="absolute bottom-14 -left-4 z-30">
        <BrutalStar className="w-10 h-10 text-white drop-shadow" />
      </div>

      {/* Judul Education dengan Lingkaran Oval Ganda */}
      <div className="relative z-10 flex justify-center mb-8">
        <div className="relative inline-flex items-center justify-center px-10 py-2.5">
          <svg viewBox="0 0 220 70" className="absolute inset-0 w-full h-full">
            <ellipse
              cx="110"
              cy="35"
              rx="100"
              ry="27"
              fill="none"
              stroke="#0c0c0c"
              strokeWidth="1.8"
              transform="rotate(-4 110 35)"
            />
            <ellipse
              cx="110"
              cy="35"
              rx="96"
              ry="24"
              fill="none"
              stroke="#0c0c0c"
              strokeWidth="1.2"
              transform="rotate(2 110 35)"
            />
          </svg>
          <h3 className="font-syne font-extrabold text-2xl sm:text-3xl tracking-wide text-[#0c0c0c] relative z-10">
            Education
          </h3>
        </div>
      </div>

      {/* Detail Pendidikan USU */}
      <div className="relative z-10 space-y-5 mb-7">
        {EDUCATION_ITEMS.map((item, idx) => (
          <div key={idx} className="border-b border-black/20 pb-5">
            <span className="font-mono font-bold text-xs tracking-wider uppercase block text-zinc-900">
              {item.period}
            </span>
            <h4 className="font-syne font-extrabold text-base sm:text-lg leading-snug text-[#0c0c0c] mt-0.5">
              {item.degree}
            </h4>
            <p className="font-mono font-bold text-xs text-zinc-900 mt-0.5">
              {item.institution}
            </p>
            <p className="font-sans text-xs text-zinc-900 mt-2 leading-relaxed font-medium">
              • {item.thesis}
            </p>
            <p className="font-mono text-[11px] text-zinc-800 mt-1">
              • {item.focus}
            </p>
          </div>
        ))}

        {/* Daftar Sertifikasi & Pelatihan */}
        <div>
          <span className="font-mono font-bold text-xs uppercase tracking-widest block mb-2.5 text-[#0c0c0c]">
            Certifications & Training (9 Validated)
          </span>
          <ul className="space-y-1 text-xs font-medium text-zinc-900">
            {KEY_CERTIFICATIONS.map((cert, i) => (
              <li key={i} className="flex items-start gap-1.5 leading-snug">
                <span className="font-bold text-[#0c0c0c]">•</span>
                <span>{cert}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Barcode Bawah */}
      <div className="relative z-10 flex justify-center pt-2">
        <Barcode className="w-60 h-11" color="#0c0c0c" />
      </div>
    </div>
  );
}