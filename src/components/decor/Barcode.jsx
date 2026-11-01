// Barcode Realistis
export default function Barcode({ className = "" }) {
  const bars = [3, 1, 4, 2, 1, 3, 1, 1, 4, 2, 1, 2, 3, 1, 2, 1, 4, 1, 2, 3, 1, 2, 1, 3];
  return (
    <div className={`flex items-stretch justify-center gap-[2px] h-10 select-none ${className}`}>
      {bars.map((w, idx) => (
        <div
          key={idx}
          className="bg-black"
          style={{ width: `${w * 2.5}px` }}
        />
      ))}
    </div>
  );
}
