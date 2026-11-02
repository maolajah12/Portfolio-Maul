// Memuat seluruh file gambar di src/assets/ secara otomatis tanpa membuat Vite crash jika ada file yang belum disalin
const assetModules = import.meta.glob('../assets/*.{png,jpg,jpeg,webp,PNG,JPG}', {
  eager: true,
  import: 'default',
});

function getAsset(filename) {
  const key = `../assets/${filename}`;
  return assetModules[key] || `/assets/${filename}`;
}

const spa1 = '/projects/Sistem pusat arsip.jpg';
const gym1 = '/projects/Ayo Ngegym.jpg';
const restoran1 = '/projects/Chateu Lumiere.jpg';
const bpjs1 = '/projects/SIGMA.jpg';

// Urutan & warna mengikuti poster masing-masing proyek:
// 01 merah, 02 hijau, 03 emas/kuning, 04 biru
export const PROJECT_CATEGORIES = [
  'All',
  'Fullstack Web - IT Internship',
  'Mobile Web - Thesis',
  'Fullstack Web - College Project',
];

export const PROJECTS_DATA = [
  {
    id: 'PRJ-01',
    code: 'PRJ-01 // IT INTERNSHIP',
    name: 'SPA Panel - Sistem Pusat Arsip',
    title: 'SPA Panel - Sistem Pusat Arsip',
    desc: 'Archive Center Management System',
    detailTitle: 'SPA Panel - Sistem Pusat Arsip',
    description:
      'Maintained and redesigned the frontend of the archive center web system at PT Bank Sumut, covering a real-time executive dashboard, archive records with physical locations, and document borrowing circulation.',
    detailDesc:
      'Maintained and redesigned the frontend of the archive center web system at PT Bank Sumut, covering a real-time executive dashboard, archive records with physical locations, and document borrowing circulation.',
    year: '2025',
    category: 'Fullstack Web - IT Internship',
    accent: '#ff1e56', // merah
    image: spa1,
    images: [spa1],
    tools: ['CodeIgniter', 'PHP'],
    tags: ['CodeIgniter', 'PHP'],
  },
  {
    id: 'PRJ-02',
    code: 'PRJ-02 // THESIS PROJECT',
    name: 'Ayo Ngegym',
    title: 'Ayo Ngegym',
    desc: 'Track Your workout system',
    detailTitle: 'Ayo Ngegym',
    description:
      'Developed a personalized fitness and nutrition tracking system tailored to user biometrics (age, weight, and height).',
    detailDesc:
      'Developed a personalized fitness and nutrition tracking system tailored to user biometrics (age, weight, and height).',
    year: '2026',
    category: 'Mobile Web - Thesis',
    accent: '#22c55e', // hijau
    image: gym1,
    images: [gym1],
    tools: ['React.Js', 'Rest Api', 'API', 'Gemini API'],
    tags: ['React.Js', 'Rest Api', 'API', 'Gemini API'],
  },
  {
    id: 'PRJ-03',
    code: 'PRJ-03 // COLLEGE PROJECT',
    name: 'Château Lumière',
    title: 'Château Lumière',
    desc: 'Fine Dining Reservation System',
    detailTitle: 'Château Lumière',
    description:
      'Developed an integrated fine-dining reservation web platform, featuring an exclusive menu catalog, interactive floor-plan table booking, payment simulations, and comprehensive customer reservation history management.',
    detailDesc:
      'Developed an integrated fine-dining reservation web platform, featuring an exclusive menu catalog, interactive floor-plan table booking, payment simulations, and comprehensive customer reservation history management.',
    year: '2025',
    category: 'Fullstack Web - College Project',
    accent: '#fbbf24', // emas / kuning
    image: restoran1,
    images: [restoran1],
    tools: ['PHP', 'MySQL', 'Tailwind CSS', 'JavaScript'],
    tags: ['PHP', 'MySQL', 'Tailwind CSS', 'JavaScript'],
  },
  {
    id: 'PRJ-04',
    code: 'PRJ-04 // IT INTERNSHIP',
    name: 'BPJS Ketenagakerjaan Internal Monitoring System',
    title: 'BPJS Ketenagakerjaan Internal Monitoring System',
    desc: 'Monitoring Intern System',
    detailTitle: 'BPJS Ketenagakerjaan Internal Monitoring System',
    description:
      'Developed internal information system modules within the IT Division, including an attendance tracking system and operational data visualization dashboards.',
    detailDesc:
      'Developed internal information system modules within the IT Division, including an attendance tracking system and operational data visualization dashboards.',
    year: '2025',
    category: 'Fullstack Web - IT Internship',
    accent: '#3b6cf0', // biru
    image: bpjs1,
    images: [bpjs1],
    tools: ['Laravel', 'React.Js', 'PHP', 'MySQL'],
    tags: ['Laravel', 'React.Js', 'PHP', 'MySQL'],
  },
];