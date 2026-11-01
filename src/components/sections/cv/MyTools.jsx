import { Cpu, Flame } from 'lucide-react';

const TOOLS = [
  { code: "Ps", name: "Adobe Photoshop" },
  { code: "Ai", name: "Adobe Illustrator" },
  { code: "Id", name: "Adobe InDesign" },
  { code: "Ae", name: "Adobe After Effects" },
  { code: "Pr", name: "Adobe Premiere Pro" },
];

// BAGIAN MY TOOLS (Kotak Ikon Software)
export default function MyTools() {
  return (
    <div className="pt-2 max-w-md">
      <h3 className="font-display font-black text-xl sm:text-2xl tracking-wider uppercase text-white mb-4">
        MY TOOLS
      </h3>
      <div className="flex flex-wrap items-center gap-2.5">
        {TOOLS.map((tool) => (
          <div
            key={tool.code}
            title={tool.name}
            className="w-10 h-10 rounded-md border-2 border-white bg-black hover:bg-white hover:text-black transition-colors flex items-center justify-center font-sans-tech font-bold text-sm cursor-pointer select-none"
          >
            {tool.code}
          </div>
        ))}
        {/* Ikon Cinema4D / Paint & Procreate */}
        <div
          title="Cinema 4D / 3D Paint"
          className="w-10 h-10 rounded-md border-2 border-white bg-black hover:bg-[#ff1e56] hover:border-[#ff1e56] transition-colors flex items-center justify-center cursor-pointer"
        >
          <Cpu className="w-5 h-5" />
        </div>
        <div
          title="Procreate Illustration"
          className="w-10 h-10 rounded-md border-2 border-white bg-black hover:bg-[#ff1e56] hover:border-[#ff1e56] transition-colors flex items-center justify-center cursor-pointer"
        >
          <Flame className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
