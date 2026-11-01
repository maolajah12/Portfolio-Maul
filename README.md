# Portfolio Maulana Al Ghifari

React + Vite + Tailwind CSS (v3).

## Menjalankan
```bash
npm install
npm run dev
```
Buka http://localhost:5173

## Build produksi
```bash
npm run build
npm run preview
```

## Struktur
```
src/
├─ main.jsx                  entry point
├─ App.jsx                   state global + navigasi halaman
├─ index.css                 Tailwind + CSS kustom (animasi, tekstur, font)
├─ data/                     projects.js, skills.js, techMarquee.js
├─ hooks/useWheelRotation.js animasi putaran roda skills
├─ pages/                    HomePage.jsx, SkillsPage.jsx
└─ components/
   ├─ decor/                 stempel, doodle, bintang, barcode, dll
   ├─ layout/                Navbar, FloatingHireBar, Footer
   ├─ modals/                ProjectModal, HireModal
   ├─ sections/              Hero, About, CV, Works, TechMarquee, Contact
   │  └─ cv/                 EducationCard, CvSkills, MyTools, ExperienceCard
   └─ skills/                RollingTitle, SkillWheel, SkillModal
```
