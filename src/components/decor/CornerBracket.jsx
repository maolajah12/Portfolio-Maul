// Sudut Frame Siku (L-Bracket)
export default function CornerBracket({ position = "bottom-right", className = "" }) {
  const rot = {
    "bottom-right": "rotate-0",
    "bottom-left": "rotate-90",
    "top-left": "rotate-180",
    "top-right": "-rotate-90"
  }[position];

  return (
    <div className={`w-8 h-8 md:w-10 md:h-10 pointer-events-none select-none ${rot} ${className}`}>
      <div className="w-full h-full border-b-[8px] border-r-[8px] border-white" />
    </div>
  );
}
