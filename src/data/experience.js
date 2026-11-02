// Data pengalaman & sertifikat (sesuai CV), konstanta bersama, dan konfigurasi animasi hero Experience.
// Ubah isi CV di bagian MAGANG dan SERTIFIKAT saja. File ini tanpa JSX.

/* ============ DATA PENGALAMAN & SERTIFIKAT (SESUAI CV) - ubah isi di bagian ini saja ============ */

// Roadmap pengalaman: urut dari awal perjalanan (atas) ke terbaru (bawah)
export const MAGANG = [
    {
        year: '2020',
        period: 'June 2020 - Now',
        duration: 'Active',
        role: 'Vector Artist',
        org: 'Freelance Creative Studio',
        type: 'Independent Creative',
        place: 'Medan, Indonesia',
        logo: '/logos/Freelance.jpg',
        logoFallback: 'VA',
        accentColor: '#ff1e56',
        points: [
            'Created and marketed vector-based digital artworks consistently across multiple online platforms utilizing Infinite Design and MediBang.',
            'Delivered bespoke vector illustration services in diverse styles (anime, cartoon) customized to client specifications and creative briefs.',
        ],
        stack: ['Infinite Design', 'MediBang', 'Vector Illustration', 'Digital Art'],
        note: 'creative roots!',
    },
    {
        year: '2025',
        period: 'June 2025 - July 2025',
        duration: '2 months',
        role: 'Archive Center Division (Intern)',
        org: 'PT. Bank Sumut',
        type: 'Corporate Internship',
        place: 'Medan, North Sumatera',
        logo: '/logos/Logo-Bank-Sumut.jpg',
        logoFallback: 'BS',
        accentColor: '#f59e0b',
        points: [
            'Maintained and enhanced the archive database web system utilizing CodeIgniter and PHP, executing major frontend enhancements and repairing critical data entry functions.',
            'Processed and entered 500 archive records into the MySQL database system with strict accuracy and completeness of classified information.',
            'Verified and aligned 500 physical archive documents through routine inspections to ensure exact data alignment with their designated storage status.',
            'Key Achievement: Improved internal data retrieval efficiency by resolving critical data entry bugs and securing 500+ physical & digital records.',
        ],
        stack: ['CodeIgniter', 'PHP', 'MySQL', 'VS Code', 'Microsoft Excel'],
        note: '500+ records secured',
    },
    {
        year: '2025',
        period: 'Sep 2025 - Dec 2025',
        duration: '4 months',
        role: 'IT Team (Certified Internship)',
        org: 'BPJS Ketenagakerjaan Cabang Medan Kota',
        type: 'MBKM Certified Internship',
        place: 'Medan, North Sumatera',
        logo: '/logos/bpjs-ketenagakerjaan.jpg',
        logoFallback: 'BPJS',
        accentColor: '#10b981',
        points: [
            'Designed and developed a real-time data visualization website using Laravel and React to track and monitor performance indicators and achievements of 200 interns.',
            'Coordinated the comprehensive execution of webinars, ranging from technical setup to providing direct assistance to 200 BPJSTK interns.',
            'Guided users and troubleshooted technical issues during the JMO (Jamsostek Mobile) application activation process.',
            'Executed WhatsApp blasting campaigns to beneficiaries for BPJSTK bill processing and compiled periodic analytical reports to monitor JMO activation.',
        ],
        stack: ['Laravel', 'React', 'Vite', 'Git', 'VS Code', 'JMO App', 'Excel'],
        note: '200 interns monitored!',
    },
];

// Kumpulan 9 sertifikat sesuai CV. Simpan foto sertifikat di folder public/certificates/
export const SERTIFIKAT = [
    {
        year: '2026',
        month: 'Oct',
        title: 'Sistem Manajemen K3 Berbasis SNI ISO 45001:2018',
        issuer: 'Badan Standardisasi Nasional (BSN)',
        credential: 'Predicate: Very Good • Valid until Oct 2027',
        skills: 'Occupational Health & Safety Management Systems (SNI ISO 45001:2018)',
        image: '/certificates/K3.png',
        url: '',
    },
    {
        year: '2026',
        month: 'Sep',
        title: 'Python Essentials 2',
        issuer: 'Cisco Networking Academy & OpenEDG Python Institute',
        credential: 'Intermediate Python & OOP Certification',
        skills: 'Object-Oriented Programming, File Handling, Exception Handling',
        image: '/certificates/Python essential 2.png',
        url: '',
    },
    {
        year: '2026',
        month: 'Sep',
        title: 'Data Science Essentials with Python',
        issuer: 'Cisco Networking Academy',
        credential: 'Data Science & Analytics Track',
        skills: 'Python Data Handling, Basic Statistical Analysis, Problem-Solving',
        image: '/certificates/Essential with python.png',
        url: '',
    },
    {
        year: '2026',
        month: 'Sep',
        title: 'Networking Basics',
        issuer: 'Cisco Networking Academy',
        credential: 'Computer Networking Fundamentals',
        skills: 'Network Types, Topologies, IP Addressing & Basic Protocols',
        image: '/certificates/Networking basics.png',
        url: '',
    },
    {
        year: '2026',
        month: 'Sep',
        title: 'CGSA-CCTV (Certified General Security Associate)',
        issuer: 'Hikvision',
        credential: 'Valid until September 2031',
        skills: 'Security Systems, CCTV Architecture & Surveillance Technology',
        image: '/certificates/CGSA.png',
        url: '',
    },
    {
        year: '2026',
        month: 'May',
        title: 'CLAUDE CODE IN ACTION',
        issuer: 'Anthropic',
        credential: 'AI-Assisted Software Engineering',
        skills: 'LLM Application for Programming, AI Debugging & Workflow Optimization',
        image: '/certificates/Claude.png',
        url: '',
    },
    {
        year: '2025',
        month: 'Dec',
        title: 'MBKM Internship Certification',
        issuer: 'BPJS Ketenagakerjaan Cabang Medan Kota',
        credential: 'Merdeka Belajar Kampus Merdeka (MBKM)',
        skills: 'IT Support, Web Development & Digital Information Dissemination',
        image: '/certificates/MBKM.png',
        url: '',
    },
    {
        year: '2025',
        month: 'Jun',
        title: 'HCIA-AI V3.5 Course',
        issuer: 'Huawei',
        credential: 'Huawei Certified ICT Associate — AI',
        skills: 'Artificial Intelligence, Machine Learning Algorithms & Deep Learning Basics',
        image: '/certificates/Huawei.png',
        url: '',
    },
    {
        year: '2023',
        month: 'Jul',
        title: 'Microsoft Office (Word, Excel, and PowerPoint)',
        issuer: 'Insan Cemerlang Computer Course',
        credential: 'Predicate: Excellent (Score: 92.33) • 16 Hours',
        skills: 'Technical Document Creation, Data Processing & Business Presentation',
        image: '/certificates/MIcrosoft Word.png',
        url: '',
    },
];


export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

// Tekstur kertas kusut inline agar kartu tidak pernah menjadi hitam/transparan
export const CRUMPLED_SURFACE_STYLE = {
    backgroundColor: '#f4f1ea',
    backgroundImage: `
        radial-gradient(at 18% 28%, rgba(255, 255, 255, 0.85) 0px, transparent 50%),
        radial-gradient(at 82% 22%, rgba(0, 0, 0, 0.07) 0px, transparent 40%),
        radial-gradient(at 38% 72%, rgba(0, 0, 0, 0.08) 0px, transparent 45%),
        radial-gradient(at 88% 84%, rgba(255, 255, 255, 0.75) 0px, transparent 50%),
        linear-gradient(125deg, rgba(0, 0, 0, 0.03) 25%, transparent 25%, transparent 50%, rgba(0, 0, 0, 0.05) 50%, rgba(0, 0, 0, 0.05) 75%, transparent 75%, transparent)
    `,
};


export const STAR8 = '50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35';
export const STAR12 = '50,0 58,32 85,15 68,42 100,50 68,58 85,85 58,68 50,100 42,68 15,85 32,58 0,50 32,42 15,15 42,32';
export const RED = '#ff1e56';

// Pseudo-acak deterministik (hasil sama setiap render)
export const rnd = (i, n) => { const x = Math.sin((i + 1) * 12.9898 + n * 78.233) * 43758.5453; return x - Math.floor(x); };

// ---------- Konfigurasi animasi ----------
// Konfigurasi & data animasi hero (urutan fase, garis retakan, serpihan, konfeti)
export const HERO_PHASES = ['walk', 'wave', 'crack', 'open', 'done'];
export const WALK_MS = 3400, T_WAVE = 3500, T_CRACK = 5200, T_OPEN = 5900, T_DONE = 7600;
export const STOP_X = 93;

export const CRACK = [[0, 0.5], [6, 0.46], [12, 0.53], [19, 0.47], [26, 0.545], [33, 0.48], [41, 0.54], [50, 0.47], [58, 0.55], [66, 0.475], [74, 0.54], [82, 0.465], [90, 0.535], [100, 0.5]];
export const upperClip = (cracked) =>
    'polygon(0 0,100% 0,' + [...CRACK].reverse().map(([x, y]) => `${x}% ${cracked ? ((y / 0.6) * 100).toFixed(2) : 100}%`).join(',') + ')';
export const lowerClip = (cracked) =>
    'polygon(' + CRACK.map(([x, y]) => `${x}% ${cracked ? (((y - 0.4) / 0.6) * 100).toFixed(2) : 0}%`).join(',') + ',100% 100%,0 100%)';

export const SHARDS = Array.from({ length: 14 }, (_, i) => ({
    left: 4 + rnd(i, 7) * 92, dx: (rnd(i, 8) - 0.5) * 9, dy: -(3 + rnd(i, 9) * 8), rot: (rnd(i, 10) - 0.5) * 500,
    w: 7 + rnd(i, 11) * 11, h: 4 + rnd(i, 12) * 6, delay: rnd(i, 13) * 0.4, c: ['#f2f2f2', '#fee440', '#1c1c1c'][i % 3],
}));
export const CONFETTI = Array.from({ length: 16 }, (_, i) => ({
    left: 8 + rnd(i, 1) * 84, dx: (rnd(i, 2) - 0.5) * 16, dy: -(4 + rnd(i, 3) * 11), rot: (rnd(i, 4) - 0.5) * 700,
    w: 7 + rnd(i, 5) * 9, delay: 0.15 + rnd(i, 6) * 0.6, c: ['#fff', '#fee440', '#0c0c0c'][i % 3],
}));

export const ROAD_BG = 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1.2px) 0 0/7px 7px, #0e0e0e';
export const UNDER_BG = 'radial-gradient(rgba(0,0,0,0.22) 1.4px, transparent 1.7px) 0 0/9px 9px, #ff1e56';
export const DASH = (c) => `repeating-linear-gradient(90deg, ${c} 0 26px, transparent 26px 50px)`;
export const abs = { position: 'absolute' };
export const T = 'calc(var(--wh) * 0.6 + var(--band) * 0.4)';

// CSS animasi hero (disuntikkan lewat <style> di RoadHero)
export const HERO_CSS = `
                .ex-padx { --padx: 20px; padding-left: var(--padx); padding-right: var(--padx); }
                .ex-bleed { margin-left: -20px; margin-right: -20px; }
                @media (max-width: 639px) { .ex-sm-hide { display: none !important; } }
                @media (min-width: 640px) { .ex-padx { --padx: 40px; } .ex-bleed { margin-left: -40px; margin-right: -40px; } }
                @media (min-width: 1024px) { .ex-padx { --padx: 80px; } .ex-bleed { margin-left: -80px; margin-right: -80px; } }
                @media (min-width: 1280px) { .ex-padx { --padx: 112px; } .ex-bleed { margin-left: -112px; margin-right: -112px; } }
                .ex-walker { position:absolute; left:${STOP_X}%; transform:translateX(-50%); z-index:2; }
                .ex-limb { transform-origin: 30px 70px; animation: ex-swing .84s ease-in-out infinite; }
                .ex-arm-a, .ex-arm-b { transform-origin: 30px 38px; }
                .ex-leg-b, .ex-arm-a { animation-delay: -.42s; }
                .ex-bob { animation: ex-bob .84s ease-in-out infinite; }
                .ex-bob-slow { animation: ex-bob-slow 1.2s ease-in-out infinite; }
                .ex-forearm { transform-origin: 43px 27px; animation: ex-wave .45s ease-in-out infinite alternate; }
                .ex-hop { animation: ex-hop .4s ease-out; }
                .ex-bubble { position:absolute; right:55%; top:-6px; white-space:nowrap; background-color:#f4f1ea; color:#0c0c0c;
                    box-shadow:4px 4px 0 #0c0c0c; padding:3px 12px; font-size:clamp(12px,1.3vw,18px); font-weight:800; transform:rotate(-4deg);
                    animation: ex-bubble .45s cubic-bezier(.2,1.6,.4,1) both; }
                .ex-tape { position:absolute; left:50%; top:-8px; width:34px; height:11px; background:rgba(254,228,64,.88); transform:translateX(-50%) rotate(3deg); }
                .ex-glyph { animation: ex-float 3.8s ease-in-out infinite; }
                .ex-letter:hover .ex-glyph { animation: ex-boing .55s ease-out; }
                @keyframes ex-float { 0%,100% { transform:translateY(0) rotate(-1.2deg); } 50% { transform:translateY(-7px) rotate(1.4deg); } }
                @keyframes ex-boing { 0% { transform:translateY(0) scale(1,1); } 30% { transform:translateY(-16px) scale(.94,1.1); }
                    60% { transform:translateY(0) scale(1.08,.9); } 100% { transform:translateY(0) scale(1,1); } }
                @keyframes ex-walk-x { from { left:-8%; } to { left:${STOP_X}%; } }
                @keyframes ex-trail { from { width:0; } to { width:${STOP_X}%; } }
                @keyframes ex-swing { 0%,100% { transform:rotate(-28deg); } 50% { transform:rotate(28deg); } }
                @keyframes ex-bob { 0%,50%,100% { transform:translateY(0); } 25%,75% { transform:translateY(-3px); } }
                @keyframes ex-bob-slow { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-1.5px); } }
                @keyframes ex-wave { from { transform:rotate(-24deg); } to { transform:rotate(26deg); } }
                @keyframes ex-hop { 0% { transform:translateY(0); } 45% { transform:translateY(-12px); } 100% { transform:translateY(0); } }
                @keyframes ex-bubble { from { opacity:0; transform:rotate(-4deg) scale(.3); } to { opacity:1; transform:rotate(-4deg) scale(1); } }
                @keyframes ex-shake { 0%,100% { transform:translate(0,0); } 25% { transform:translate(-3px,2px); } 50% { transform:translate(3px,-2px); } 75% { transform:translate(-2px,-2px); } }
                @keyframes ex-draw { from { stroke-dashoffset:1; } to { stroke-dashoffset:0; } }
                @keyframes ex-under { from { clip-path:inset(46% 0 46% 0); } to { clip-path:inset(0 0 0 0); } }
                @keyframes ex-debris { 0% { opacity:0; transform:translate(0,0) rotate(0); } 10% { opacity:1; }
                    45% { opacity:1; transform:translate(var(--dx), var(--dy)) rotate(var(--rot)); }
                    100% { opacity:0; transform:translate(calc(var(--dx) * 1.5), calc(var(--dy) * -0.4)) rotate(calc(var(--rot) * 1.6)); } }
                @keyframes ex-pop { 0% { opacity:0; transform:translateY(80%) scale(.3) rotate(-16deg); }
                    60% { opacity:1; transform:translateY(-10%) scale(1.14) rotate(4deg); } 100% { opacity:1; transform:none; } }
                @keyframes ex-spark { 0% { opacity:0; transform:translate(0,0) scale(.3) rotate(0); } 12% { opacity:1; }
                    100% { opacity:0; transform:translate(var(--dx), var(--dy)) scale(1) rotate(var(--rot)); } }
                @keyframes ex-star-in { from { opacity:0; transform:scale(0) rotate(-90deg); } to { opacity:1; transform:scale(1) rotate(0); } }
                @keyframes ex-fade { from { opacity:0; } to { opacity:1; } }
                @keyframes ex-spin { to { transform:rotate(360deg); } }
`;