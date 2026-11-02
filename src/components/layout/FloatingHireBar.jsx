import { useEffect, useMemo, useRef, useState } from 'react';
import { Scissors, Printer, ArrowUpRight } from 'lucide-react';
import { Barcode } from '../decor';

// TIKET "ADMIT ONE" (tengah bawah layar)
// - Muncul dengan efek "dicetak" bertahap seperti printer dot-matrix.
// - HIRE ME  : stub disobek RAPI tepat di garis perforasi, lalu form hire terbuka; stub dicetak kembali sesudahnya.
// - GUNTING  : tiket disobek ASAL-ASALAN (garis sobek bergerigi acak, tiap kali berbeda), kedua serpihan jatuh.
//              Tersisa tombol printer di tengah; klik untuk mencetak tiket baru.
const OUTLINE =
  'drop-shadow(1.5px 0 0 #fff) drop-shadow(-1.5px 0 0 #fff) drop-shadow(0 1.5px 0 #fff) drop-shadow(0 -1.5px 0 #fff)';
const SHADOW = `${OUTLINE} drop-shadow(4px 4px 0 #ff1e56)`;
const BOX = 'w-[calc(100vw-2rem)] max-w-[330px]';

// Tepi bergerigi bekas perforasi (lubang setengah lingkaran tiap 10px)
const bite = (side) => {
  const m = `radial-gradient(circle at ${side} 5px, transparent 2.8px, #000 3.3px)`;
  return { WebkitMaskImage: m, maskImage: m, WebkitMaskSize: '100% 10px', maskSize: '100% 10px', WebkitMaskRepeat: 'repeat-y', maskRepeat: 'repeat-y' };
};

const PAPER = {
  backgroundColor: '#e6e6e6',
  backgroundImage: `
    radial-gradient(at 18% 28%, rgba(255,255,255,.85) 0px, transparent 50%),
    radial-gradient(at 82% 22%, rgba(0,0,0,.08) 0px, transparent 40%),
    radial-gradient(at 38% 72%, rgba(0,0,0,.09) 0px, transparent 45%),
    linear-gradient(125deg, rgba(0,0,0,.04) 25%, transparent 25%, transparent 50%, rgba(0,0,0,.06) 50%, rgba(0,0,0,.06) 75%, transparent 75%)
  `,
};

// Garis sobek acak bergerigi (satu set titik dipakai kedua serpihan agar tepinya saling cocok)
function makeTear() {
  const ys = [-30, 0, 9, 21, 33, 46, 58, 70, 83, 100, 130];
  const c = 34 + Math.random() * 30;          // posisi tengah sobekan (% lebar)
  const slope = (Math.random() - 0.5) * 36;    // kemiringan sobekan
  let flip = Math.random() < 0.5 ? 1 : -1;
  const line = ys.map((y) => {
    const edge = y <= 0 || y >= 100;
    flip *= -1;
    const j = edge ? 0 : flip * (3 + Math.random() * 6) + (Math.random() - 0.5) * 3;
    return [c + slope * ((y - 50) / 100) + j, y];
  });
  const fmt = (pts) => `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}% ${y}%`).join(',')})`;
  return {
    id: Date.now(),
    a: fmt([[-30, -30], ...line, [-30, 130]]),
    b: fmt([...line, [130, 130], [130, -30]]),
    oa: `${(c - 8).toFixed(0)}% 100%`,
    ob: `${(c + 8).toFixed(0)}% 100%`,
    tilt: Math.random() < 0.5 ? 1 : -1,
  };
}

function MainFace() {
  return (
    <div className="px-3 py-2 pr-3.5 text-black" style={{ ...PAPER, ...bite('100%') }}>
      <div className="flex items-center justify-between gap-2">
        <span className="bg-black text-white px-1.5 py-px font-mono text-[8px] font-bold tracking-[.2em]">ADMIT ONE</span>
        <span className="flex items-center gap-1 font-mono text-[8px] font-bold tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> 1 SLOT OPEN
        </span>
      </div>
      <p className="font-syne font-black uppercase leading-[.9] text-[18px] mt-1 tracking-tight whitespace-nowrap">
        Available{' '}
        <span className="font-marker normal-case font-normal text-[#ff1e56] text-[15px] inline-block -rotate-3">for hire!</span>
      </p>
      <div className="mt-1.5 pt-1 border-t-2 border-dashed border-black/40 flex items-center justify-between gap-2 font-mono text-[7px] font-bold tracking-wider uppercase">
        <span className="truncate">Maulana Al Ghifari</span>
        <span className="shrink-0 text-black/60">No.0042 / 2026</span>
      </div>
    </div>
  );
}

function StubFace() {
  return (
    <div className="w-full h-full bg-[#fee440] text-black px-1.5 py-2 flex flex-col items-center justify-between gap-1" style={bite('0')}>
      <span className="font-mono text-[7px] font-bold tracking-[.2em]">STUB 0042</span>
      <Barcode className="h-5 w-full max-w-[52px]" color="#0c0c0c" />
      <span className="font-syne font-black uppercase tracking-wider text-[10px] leading-none flex items-center gap-0.5 whitespace-nowrap">
        Hire me <ArrowUpRight className="w-3 h-3" />
      </span>
    </div>
  );
}

export default function FloatingHireBar({ visible, onHire, onHide, onShow }) {
  const first = useRef(true);
  useEffect(() => { first.current = false; }, []);
  const bootHidden = first.current && !visible;

  const [tear, setTear] = useState(null);       // serpihan hasil sobekan asal-asalan
  const [stubOut, setStubOut] = useState(false); // stub terlepas rapi saat HIRE ME
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn, ms) => { timers.current.push(setTimeout(fn, ms)); };

  const handleHide = () => { setTear(makeTear()); onHide(); };
  const handleShow = () => { setTear(null); onShow(); };
  const handleHire = () => {
    if (stubOut) return;
    setStubOut(true);          // sobek rapi di garis perforasi
    later(onHire, 480);        // form terbuka tepat setelah stub terlepas
    later(() => setStubOut(false), 1700); // stub dicetak kembali
  };

  const vis = visible ? '1' : '0';
  const shardStyle = useMemo(() => tear && ({
    a: { clipPath: tear.a, transformOrigin: tear.oa, '--dir': tear.tilt },
    b: { clipPath: tear.b, transformOrigin: tear.ob, '--dir': tear.tilt },
  }), [tear]);

  return (
    <>
      <style>{`
        @keyframes ht-print { from { transform: translateY(160%); } to { transform: translateY(0); } }
        /* sobek rapi: tarik lurus sepanjang garis perforasi, lalu terangkat tanpa berputar */
        @keyframes ht-clean {
          0%   { transform: none; opacity: 1; animation-timing-function: cubic-bezier(.3,0,.3,1); }
          28%  { transform: translate(7px, 0); opacity: 1; animation-timing-function: ease-in; }
          100% { transform: translate(12px, -90px); opacity: 0; visibility: hidden; }
        }
        /* sobek asal-asalan: tersentak-sentak lalu serpihan jatuh berputar */
        @keyframes ht-shard-a {
          0%   { transform: none; animation-timing-function: ease-out; }
          8%   { transform: translate(-2px, 1px) rotate(calc(-2deg * var(--dir))); animation-timing-function: steps(2, end); }
          16%  { transform: translate(-5px, 2px) rotate(calc(-6deg * var(--dir))); animation-timing-function: ease-in-out; }
          26%  { transform: translate(-6px, 1px) rotate(calc(-4deg * var(--dir))); animation-timing-function: cubic-bezier(.5,0,.9,.4); }
          99%  { transform: translate(-90px, 78vh) rotate(calc(-46deg * var(--dir))); visibility: visible; }
          100% { transform: translate(-90px, 78vh) rotate(calc(-46deg * var(--dir))); visibility: hidden; }
        }
        @keyframes ht-shard-b {
          0%   { transform: none; animation-timing-function: ease-out; }
          10%  { transform: translate(2px, 0) rotate(calc(1.5deg * var(--dir))); animation-timing-function: steps(2, end); }
          20%  { transform: translate(6px, 2px) rotate(calc(7deg * var(--dir))); animation-timing-function: ease-in-out; }
          32%  { transform: translate(5px, 1px) rotate(calc(5deg * var(--dir))); animation-timing-function: cubic-bezier(.5,0,.9,.4); }
          99%  { transform: translate(110px, 82vh) rotate(calc(58deg * var(--dir))); visibility: visible; }
          100% { transform: translate(110px, 82vh) rotate(calc(58deg * var(--dir))); visibility: hidden; }
        }
        @keyframes ht-snip { 50% { transform: rotate(-22deg); } }
        @keyframes ht-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        .ht-main { transform-origin: 100% 100%; }
        .ht-stub { transform-origin: 0 100%; }
        .ht-main[data-vis="1"], .ht-stub[data-vis="1"] { animation: ht-print .9s steps(9, end) both; }
        .ht-stub[data-vis="1"][data-out="1"] { animation: ht-clean .75s both; }
        .ht-main[data-vis="0"], .ht-stub[data-vis="0"] { visibility: hidden; }
        .ht-shard-a { animation: ht-shard-a 1.05s both; }
        .ht-shard-b { animation: ht-shard-b 1.2s both; }
        .ht-scissors:hover svg { animation: ht-snip .35s ease-in-out 2; }
        .ht-printer[data-on="1"] { animation: ht-bob 2.2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .ht-main, .ht-stub, .ht-shard-a, .ht-shard-b, .ht-printer { animation-duration: .01s !important; transition-duration: .01s !important; transition-delay: 0s !important; }
        }
      `}</style>

      {/* TIKET HIDUP */}
      <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-40 ${BOX} flex items-stretch pointer-events-none`}>
        <div className="ht-main flex-1 min-w-0" data-vis={vis} aria-hidden={!visible} style={{ filter: SHADOW }}>
          <MainFace />
        </div>

        <div className="ht-stub relative w-[78px] shrink-0" data-vis={vis} data-out={stubOut ? '1' : '0'} aria-hidden={!visible}>
          <button
            type="button"
            onClick={handleHide}
            tabIndex={visible ? 0 : -1}
            aria-label="Tear off and hide hire ticket"
            title="Sobek / sembunyikan"
            className={`ht-scissors absolute -top-3 -left-3 z-10 w-6 h-6 rounded-full bg-black text-white border-2 border-white flex items-center justify-center hover:bg-[#ff1e56] transition-colors cursor-pointer ${visible ? 'pointer-events-auto' : 'pointer-events-none'}`}
          >
            <Scissors className="w-3 h-3" />
          </button>
          <div style={{ filter: SHADOW }} className="h-full">
            <button
              type="button"
              onClick={handleHire}
              tabIndex={visible ? 0 : -1}
              aria-label="Hire Maulana"
              className={`block w-full h-full cursor-pointer hover:[&>div]:!bg-[#ff1e56] hover:[&>div]:text-white [&>div]:transition-colors ${visible ? 'pointer-events-auto' : 'pointer-events-none'}`}
            >
              <StubFace />
            </button>
          </div>
        </div>
      </div>

      {/* SERPIHAN HASIL SOBEKAN ASAL-ASALAN (hanya hiasan, tidak bisa diklik) */}
      {tear && !visible && (
        <div key={tear.id} aria-hidden="true" className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-40 ${BOX} grid pointer-events-none`}>
          {[['a', 'ht-shard-a'], ['b', 'ht-shard-b']].map(([k, cls]) => (
            <div key={k} className={cls} style={{ gridArea: '1 / 1', ...shardStyle[k] }}>
              <div className="flex items-stretch">
                <div className="flex-1 min-w-0" style={{ filter: SHADOW }}><MainFace /></div>
                <div className="w-[78px] shrink-0" style={{ filter: SHADOW }}><StubFace /></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TANDA PRINT: tersisa di tengah setelah tiket jatuh; klik untuk mencetak tiket baru */}
      <button
        type="button"
        onClick={handleShow}
        data-on={visible ? '0' : '1'}
        tabIndex={visible ? -1 : 0}
        aria-hidden={visible}
        aria-label="Print a new hire ticket"
        title="Cetak tiket baru"
        className={`ht-printer fixed bottom-4 left-1/2 -ml-6 z-40 w-12 h-12 rounded-full bg-black text-white border-2 border-white shadow-[4px_4px_0_#ff1e56] flex items-center justify-center hover:bg-[#ff1e56] cursor-pointer transition-all duration-300 ${visible ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100'
          }`}
        style={{ transitionDelay: visible ? '0s' : (bootHidden ? '0s' : '.95s') }}
      >
        <Printer className="w-5 h-5" />
      </button>
    </>
  );
}