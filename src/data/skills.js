import {
  Cpu, Flame, Share2, PenTool, Globe,
  Smartphone, Code2, FileCode2, TerminalSquare, Server, Database, Box
} from 'lucide-react';

export const SKILLS_LIST = [
  { name: "Mobile Dev", icon: Smartphone, level: "INTERMEDIATE", exp: "85%", desc: "Pengembangan aplikasi mobile lintas platform yang responsif dengan performa tinggi & UI modern.", tools: ["Flutter", "React Native", "Android Studio"] },
  { name: "React", icon: Code2, level: "ADVANCED", exp: "90%", desc: "Membangun antarmuka web interaktif, SPA, komponen modular, dan animasi modern.", tools: ["React.js", "Tailwind CSS", "Framer Motion"] },
  { name: "JavaScript", icon: FileCode2, level: "ADVANCED", exp: "88%", desc: "Pemrograman logika frontend & backend modern menggunakan ES6+, DOM, dan integrasi API.", tools: ["ES6+", "TypeScript", "Async/Await"] },
  { name: "Flutter", icon: Box, level: "INTERMEDIATE", exp: "85%", desc: "Pembuatan aplikasi Android & iOS dengan arsitektur widget kustom dan animasi mulus.", tools: ["Dart", "Bloc / Provider", "Custom UI"] },
  { name: "Python", icon: TerminalSquare, level: "INTERMEDIATE", exp: "80%", desc: "Otomatisasi skrip, pengolahan data, serta pengembangan backend dan layanan AI/API.", tools: ["FastAPI", "Flask", "Automation"] },
  { name: "PHP", icon: Server, level: "INTERMEDIATE", exp: "82%", desc: "Pengembangan sistem web dinamis sisi server dan manajemen konten yang andal.", tools: ["PHP 8", "MVC", "Composer"] },
  { name: "Laravel", icon: Globe, level: "INTERMEDIATE", exp: "85%", desc: "Arsitektur aplikasi web full-stack, autentikasi keamanan, dan pengelolaan RESTful API.", tools: ["Eloquent ORM", "Blade", "REST API"] },
  { name: "MySQL", icon: Database, level: "INTERMEDIATE", exp: "84%", desc: "Perancangan skema basis data relasional, optimasi query, dan manajemen struktur data.", tools: ["SQL", "Database Design", "Indexing"] },
  { name: "Node.js", icon: Cpu, level: "INTERMEDIATE", exp: "78%", desc: "Lingkungan eksekusi backend berbasis event-driven untuk layanan web real-time yang cepat.", tools: ["Express.js", "NPM", "WebSockets"] },
  { name: "Firebase", icon: Flame, level: "INTERMEDIATE", exp: "82%", desc: "Integrasi autentikasi cloud, basis data NoSQL real-time, dan hosting aplikasi modern.", tools: ["Firestore", "Auth", "Cloud Storage"] },
  { name: "Git & Flow", icon: Share2, level: "ADVANCED", exp: "90%", desc: "Manajemen versi kode, kolaborasi tim, branching, dan alur deployment modern.", tools: ["Git", "GitHub", "CI/CD"] },
  { name: "UI / Visual", icon: PenTool, level: "ADVANCED", exp: "92%", desc: "Eksplorasi desain antarmuka brutalist, streetwear, ilustrasi, dan sistem desain interaktif.", tools: ["Figma", "Photoshop", "Illustrator"] },
];
