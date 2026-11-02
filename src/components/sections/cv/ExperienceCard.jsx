import React from 'react';
import { Barcode, BrutalStar, CircularStamp } from '../../decor';

const WORK_EXPERIENCES = [
  {
    period: 'Sep 2025 - Dec 2025',
    duration: '4 months',
    role: 'IT Team (Certified Internship)',
    company: 'BPJS Ketenagakerjaan Cabang Medan Kota',
    type: 'MBKM Certified Internship',
    tasks: [
      'Designed & developed a real-time data visualization website using Laravel and React to monitor 200 interns.',
      'Coordinated technical setup and direct assistance for webinars attended by 200 BPJSTK interns.',
      'Executed WhatsApp blasting campaigns for BPJSTK bill processing & compiled periodic JMO analytical reports.',
    ],
    tools: 'Laravel, React, Vite, Git, VS Code, Excel',
  },
  {
    period: 'June 2025 - July 2025',
    duration: '2 months',
    role: 'Archive Center Division (Intern)',
    company: 'PT. Bank Sumut',
    type: 'Internship',
    tasks: [
      'Maintained & enhanced the archive database web system using CodeIgniter and PHP (major frontend & data entry repairs).',
      'Processed and entered 500 archive records into the MySQL database with strict accuracy.',
      'Verified and aligned 500 physical archive documents with their designated storage status.',
    ],
    tools: 'CodeIgniter, PHP, MySQL, VS Code, Excel',
  },
  {
    period: 'June 2020 - Now',
    duration: 'Active',
    role: 'Vector Artist',
    company: 'Freelance',
    type: 'Independent Creative',
    tasks: [
      'Created and marketed vector-based digital artworks across multiple online platforms using Infinite Design & MediBang.',
      'Delivered bespoke vector illustration services in diverse styles (anime, cartoon) customized to client briefs.',
    ],
    tools: 'Infinite Design, MediBang, Vector Illustration',
  },
];

export default function ExperienceCard() {
  return (
    <div className="relative w-full max-w-md mx-auto lg:mx-0 lg:-ml-4 lg:mt-6 z-20 select-none">
      {/* Stempel Melingkar di Kanan Atas */}
      <div className="absolute -top-14 -right-6 z-30 hidden sm:block">
        <CircularStamp className="w-32 h-32" withRedCenter />
      </div>

      {/* Doodle Mahkota Merah di Kiri Atas */}
      <svg
        viewBox="0 0 100 60"
        className="w-20 h-14 text-[#ff1e56] absolute -top-12 left-4 z-20 pointer-events-none"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
      >
        <path d="M10 50 L20 15 L40 40 L55 8 L70 40 L90 18 L80 50 Z" />
      </svg>

      {/* Kartu Kertas Kusut (Dengan Fallback bg-[#e6e6e6] + Inline Texture) */}
      <div
        className="relative bg-[#e6e6e6] text-[#0c0c0c] p-7 sm:p-10 shadow-[0_30px_70px_rgba(0,0,0,0.85)]"
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
        {/* Header Experience */}
        <div className="text-center mb-8">
          <span className="font-mono text-xs lowercase tracking-widest text-zinc-700 block mb-1">
            professional
          </span>
          <div className="inline-block bg-[#0c0c0c] text-white px-5 py-1 font-syne font-black text-xl sm:text-2xl tracking-wider uppercase">
            EXPERIENCE
          </div>
        </div>

        {/* Daftar Pengalaman Kerja */}
        <div className="space-y-6">
          {WORK_EXPERIENCES.map((exp, idx) => (
            <div
              key={idx}
              className="border-b-2 border-dashed border-zinc-400 pb-5 last:border-none"
            >
              <div className="flex items-center justify-between text-xs font-mono font-bold text-[#0c0c0c] mb-1">
                <span>{exp.period}</span>
                {exp.duration && (
                  <span className="text-zinc-600 font-normal">{exp.duration}</span>
                )}
              </div>

              <h4 className="font-syne font-extrabold text-base sm:text-lg text-[#0c0c0c] leading-snug">
                {exp.role}
              </h4>

              {exp.company && (
                <p className="font-sans font-bold text-xs sm:text-sm text-zinc-800">
                  {exp.company}
                </p>
              )}

              {exp.type && (
                <span className="font-mono text-[11px] text-zinc-600 italic block mb-2">
                  {exp.type}
                </span>
              )}

              <ul className="mt-2 space-y-1 text-xs text-zinc-800 leading-relaxed">
                {exp.tasks.map((task, tIdx) => (
                  <li key={tIdx} className="flex items-start gap-1.5">
                    <span className="text-[#ff1e56] font-bold">-</span>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>

              {exp.tools && (
                <div className="mt-2.5 pt-1.5 border-t border-black/15 font-mono text-[10px] text-zinc-700">
                  <strong className="text-[#0c0c0c]">TOOLS:</strong> {exp.tools}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bintang Brutalist di Tepi Kanan */}
        <div className="absolute bottom-24 -right-5 z-30">
          <BrutalStar className="w-12 h-12 text-white drop-shadow-lg" />
        </div>

        {/* Barcode Bawah */}
        <div className="mt-8 flex justify-center">
          <Barcode className="w-60 h-11" color="#0c0c0c" />
        </div>
      </div>
    </div>
  );
}