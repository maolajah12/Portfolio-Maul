import { Palette, Code2, Database, Smartphone, ArrowUpRight } from 'lucide-react';
import { FireSectionBadge, Barcode, CornerBracket, BrutalStar } from '../decor';

// Tiap kartu punya tema sendiri supaya grid terasa berlapis
const SERVICES_DATA = [
    {
        id: '01',
        title: 'UI/UX DESIGN',
        icon: Palette,
        description: 'Creating intuitive and user-friendly interfaces for web and mobile applications that users love.',
        tags: ['Figma', 'Prototyping', 'Wireframing', 'User Research'],
        span: 'lg:col-span-7',
        card: 'bg-[#ff1e56] text-black border-2 border-[#ff1e56] shadow-[0_20px_50px_rgba(255,30,86,0.25)]',
        iconBox: 'bg-black text-white shadow-[4px_4px_0px_white]',
        tag: 'border-black bg-black/10 text-black',
        note: 'text-black/70',
        barcode: '',
        bracket: true,
    },
    {
        id: '02',
        title: 'WEB DEVELOPMENT',
        icon: Code2,
        description: 'Building responsive, performant, and accessible websites with modern technologies and best practices.',
        tags: ['React', 'Tailwind CSS', 'Vite', 'Frontend'],
        span: 'lg:col-span-5',
        card: 'crumpled-paper text-black border-2 border-black shadow-[10px_10px_0px_#ff1e56]',
        iconBox: 'bg-black text-white shadow-[4px_4px_0px_#ff1e56]',
        tag: 'border-black bg-white/60 text-black',
        note: 'text-neutral-700',
        barcode: '',
        bracket: false,
    },
    {
        id: '03',
        title: 'DATABASE',
        icon: Database,
        description: 'Designing and managing databases, ensuring efficient data storage, retrieval, and optimization.',
        tags: ['MySQL', 'PostgreSQL', 'Firebase', 'Architecture'],
        span: 'lg:col-span-5',
        card: 'bg-[#121215] text-white border-2 border-white/25 plastic-glare shadow-[0_20px_50px_rgba(0,0,0,0.9)]',
        iconBox: 'bg-[#ff1e56] text-black shadow-[4px_4px_0px_white]',
        tag: 'border-white/50 bg-white/5 text-white',
        note: 'text-neutral-400',
        barcode: 'invert',
        bracket: true,
    },
    {
        id: '04',
        title: 'MOBILE APPS',
        icon: Smartphone,
        description: 'Designing native and cross-platform mobile applications with great UX and visual appeal.',
        tags: ['Flutter', 'React Native', 'Cross-Platform'],
        span: 'lg:col-span-7',
        card: 'bg-[#e8e8e8] text-black border-2 border-white shadow-[0_20px_50px_rgba(0,0,0,0.85)]',
        iconBox: 'bg-black text-white shadow-[4px_4px_0px_#ff1e56]',
        tag: 'border-black bg-white text-black',
        note: 'text-neutral-600',
        barcode: '',
        bracket: false,
    },
];

export default function ServiceAccordion() {
    return (
        <section className="relative z-10 bg-[#0c0c0c] w-full py-24 px-4 sm:px-8 lg:px-12 xl:px-16 select-none">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
                <FireSectionBadge number="5" label="What I Offer" />
                <h2 className="font-bbh font-black text-5xl sm:text-7xl lg:text-8xl text-white uppercase leading-[0.9] tracking-tighter">
                    SERVICES
                </h2>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                {SERVICES_DATA.map((srv) => {
                    const Icon = srv.icon;

                    return (
                        <article
                            key={srv.id}
                            className={`group relative overflow-hidden rounded-[1.6rem] p-6 sm:p-8 min-h-[320px] flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 ${srv.span} ${srv.card}`}
                        >
                            {/* Baris atas: nomor + ikon */}
                            <div className="relative z-10 flex items-start justify-between">
                                <span className="font-brush text-5xl sm:text-6xl leading-none opacity-90">
                                    {srv.id}
                                </span>
                                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:rotate-6 ${srv.iconBox}`}>
                                    <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                                </div>
                            </div>

                            {/* Isi: judul, deskripsi, tag */}
                            <div className="relative z-10 mt-8 space-y-4">
                                <h3 className="font-bbh font-black text-3xl sm:text-4xl xl:text-5xl uppercase tracking-tight leading-[0.95]">
                                    {srv.title}
                                </h3>
                                <p className="font-sans-tech text-sm sm:text-base font-medium leading-relaxed max-w-xl">
                                    {srv.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {srv.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className={`border-2 px-2.5 py-0.5 text-[11px] font-sans-tech uppercase font-bold ${srv.tag}`}
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Baris bawah: barcode + panah */}
                            <div className="relative z-10 mt-6 pt-4 border-t-2 border-dashed border-current/30 flex items-end justify-between">
                                <div className={srv.barcode}>
                                    <Barcode className="h-7 !justify-start" />
                                    <span className={`block mt-1 text-[9px] font-sans-tech font-bold tracking-widest ${srv.note}`}>
                                        {srv.id}-AUTH-MAG
                                    </span>
                                </div>
                                <ArrowUpRight className="w-7 h-7 opacity-70 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </div>

                            {/* Dekorasi */}
                            {srv.bracket && (
                                <CornerBracket
                                    position="top-left"
                                    className="absolute top-4 left-4 !w-6 !h-6 opacity-40"
                                />
                            )}
                            <BrutalStar
                                color="currentColor"
                                points={12}
                                className="absolute -bottom-6 -right-6 w-24 h-24 opacity-[0.07] group-hover:rotate-45 transition-transform duration-500"
                            />
                        </article>
                    );
                })}
            </div>
        </section>
    );
}