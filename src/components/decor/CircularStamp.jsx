// Stempel Melingkar Berputar (DESIGNER • ILLUSTRATOR • ARTIST •)
export default function CircularStamp({ className = "", size = 130, textColor = "white", centerIcon = null }) {
  return (
    <div className={`relative select-none pointer-events-none flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slow">
        <defs>
          <path
            id="textCircle"
            d="M 100, 100 m -72, 0 a 72,72 0 1,1 144,0 a 72,72 0 1,1 -144,0"
          />
        </defs>
        <text fill={textColor} className="font-display font-black uppercase tracking-[0.26em] text-[15px]">
          <textPath href="#textCircle" startOffset="0%">
            • DEVELOPER • WEB • MOBILE
          </textPath>
        </text>
      </svg>
      {centerIcon && (
        <div className="absolute inset-0 flex items-center justify-center">
          {centerIcon}
        </div>
      )}
    </div>
  );
}
