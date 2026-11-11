import { useState, useEffect, useRef } from 'react';
import { Check, FlaskConical, Lock, RotateCcw } from 'lucide-react';

// ============================================================
// LAB: tempat demo proyek yang bisa langsung dicoba (bagian dari halaman Works).
// EXP-01 = demo rekomendasi nutrisi dari Ayo Ngegym (rumus yang sama dengan aplikasinya).
// Tambah demo berikutnya di daftar UPCOMING di bawah.
// ============================================================
const GREEN = '#22c55e'; // warna Ayo Ngegym di halaman Works

// Opsi & rumus disalin dari aplikasi Ayo Ngegym (constants + aiRecommendation.js)
const GOALS = [
    { id: 'naik_bb', label: 'Naik Berat Badan', short: 'Naik BB', title: 'Menaikkan Berat Badan', kcal: 400, protein: 2.0, rep: 12, aim: 'menaikkan berat badan secara bertahap' },
    { id: 'turun_bb', label: 'Turun Berat Badan', short: 'Turun BB', title: 'Menurunkan Berat Badan', kcal: -400, protein: 1.6, rep: 13, aim: 'menurunkan berat badan sambil menjaga massa otot' },
    { id: 'massa_otot', label: 'Massa Otot', short: 'Massa Otot', title: 'Membangun Massa Otot', kcal: 250, protein: 2.2, rep: 10, aim: 'membangun massa otot' },
    { id: 'bakar_lemak', label: 'Bakar Lemak', short: 'Bakar Lemak', title: 'Membakar Lemak', kcal: -300, protein: 2.0, rep: 15, aim: 'membakar lemak tubuh' },
];

const LEVELS = [
    { id: 'pemula', label: 'Pemula', sub: '0 - 6 bulan', rest: 90, mult: 1, maxRep: 12 },
    { id: 'menengah', label: 'Menengah', sub: '6 bln - 2 thn', rest: 75, mult: 1.25, maxRep: 12 },
    { id: 'mahir', label: 'Mahir', sub: '2 - 4 tahun', rest: 60, mult: 1.5, maxRep: 12 },
    { id: 'elite', label: 'Elite', sub: '5+ tahun', rest: 45, mult: 1.75, maxRep: 12 },
];

const FREQS = [
    { id: 'f1', label: '1 Hari', sub: 'Full Body' },
    { id: 'f2', label: '2 Hari', sub: 'Full Body A / B' },
    { id: 'f3', label: '3 Hari', sub: 'Push / Pull / Legs' },
    { id: 'f4', label: '4 Hari', sub: 'Upper / Lower' },
    { id: 'f5', label: '5 Hari', sub: 'PPL + Upper/Lower' },
];

const EQUIPMENT = [
    { id: 'dumbell', label: 'Dumbell' },
    { id: 'barbell', label: 'Barbell' },
    { id: 'mesin', label: 'Mesin' },
    { id: 'berat_badan', label: 'Tanpa Alat' },
];

// Demo berikutnya: ganti judul & catatan saat proyeknya siap didemokan
const UPCOMING = [
    { code: 'EXP-02', note: 'Sedang dirancang. Demo yang bisa dicoba akan tampil di sini.' },
    { code: 'EXP-03', note: 'Slot berikutnya. Ada ide? Ajak saya membangunnya.' },
];

const LOADING_MSGS = [
    'Mengirim data ke AI untuk analisa personal...',
    'Menghitung kebutuhan kalori dan makro...',
    'Menyusun program latihan...',
];

const LIMITS = { umur: [10, 100], tinggi: [100, 250], berat: [25, 300] };

// ---------- Perhitungan (sama dengan aplikasi) ----------
function calculate(f) {
    const umur = parseFloat(f.umur);
    const tinggi = parseFloat(f.tinggi);
    const berat = parseFloat(f.berat);
    const ok = (v, [lo, hi]) => v >= lo && v <= hi;
    if (!ok(umur, LIMITS.umur) || !ok(tinggi, LIMITS.tinggi) || !ok(berat, LIMITS.berat)) return null;

    const goal = GOALS.find((g) => g.id === f.tujuan);
    const level = LEVELS.find((l) => l.id === f.level);
    const freq = FREQS.find((q) => q.id === f.freq);

    const bmi = berat / Math.pow(tinggi / 100, 2);
    const bmiCat = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obesitas';

    const bmr = Math.round(10 * berat + 6.25 * tinggi - 5 * umur + 5);
    const tdee = Math.round(bmr * 1.55);
    const kalori = Math.round(tdee + goal.kcal);
    const protein = Math.round(berat * goal.protein);
    const lemak = Math.round((kalori * 0.25) / 9);
    const karbo = Math.max(0, Math.round((kalori - protein * 4 - lemak * 9) / 4));

    const total = Math.max(1, protein * 4 + karbo * 4 + lemak * 9);
    const pctP = (protein * 4 * 100) / total;
    const pctC = (karbo * 4 * 100) / total;

    // Peringatan berbasis aturan, sama dengan yang ditampilkan aplikasi
    const notes = [];
    if (bmi < 18.5) notes.push('BMI di bawah normal: prioritaskan surplus kalori bertahap dan protein cukup.');
    if (bmi >= 30) notes.push('BMI obesitas: mulai dengan intensitas rendah dan konsultasi dokter sebelum program berat.');
    else if (bmi >= 25) notes.push('BMI overweight: kombinasikan latihan kekuatan dengan kardio ringan 2-3x/minggu.');
    if (umur >= 50) notes.push('Usia 50+: pemanasan lebih lama dan hindari beban mendekati 1RM.');
    if (umur < 18) notes.push('Usia di bawah 18: konsultasi orang tua dan pelatih sebelum program beban berat.');

    // Ringkasan program. Aplikasi asli meminta Gemini; di demo ini angkanya diturunkan dari
    // konfigurasi level (pengali set, jeda istirahat) dan tujuan (rentang repetisi).
    const sets = Math.round(3 * level.mult);
    const reps = Math.min(goal.rep, f.level === 'pemula' ? 13 : 15);
    const perWeek = parseInt(freq.id.replace('f', ''), 10);
    const alatLabel = f.alat.map((a) => EQUIPMENT.find((e) => e.id === a).label);
    const adj = goal.kcal > 0 ? `+${goal.kcal}` : `${goal.kcal}`;
    const analisa =
        `Program ini dirancang untuk ${level.label.toLowerCase()} dengan tujuan ${goal.aim}, menggunakan beban yang sesuai dengan rekomendasi ACSM dan NSCA. ` +
        `Frekuensi latihan ${perWeek} hari per minggu dengan pola ${freq.sub.toLowerCase()} memberi ruang pemulihan yang cukup. ` +
        `Target ${protein} g protein per hari (${goal.protein.toFixed(1)} g/kg) dan ${kalori} kkal (${adj} dari kebutuhan harian ${tdee} kkal) mendukung tujuan tersebut.`;

    return { alat: f.alat, sets, reps, perWeek, alatLabel, analisa, goal, level, freq, bmi, bmiCat, bmr, tdee, kalori, protein, lemak, karbo, pctP, pctC, pctF: 100 - pctP - pctC, notes };
}

// Angka yang bergerak halus saat hasil berubah
function useTween(value, ms = 450) {
    const [shown, setShown] = useState(value);
    const from = useRef(value);
    useEffect(() => {
        const start = performance.now();
        const a = from.current;
        let raf;
        const tick = (t) => {
            const k = Math.min(1, (t - start) / ms);
            const e = 1 - Math.pow(1 - k, 3);
            const v = a + (value - a) * e;
            setShown(v);
            from.current = v;
            if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [value, ms]);
    return shown;
}

function Num({ value, digits = 0, plain = false }) {
    const v = useTween(value);
    return <>{plain ? v.toFixed(digits) : v.toLocaleString('id-ID', { minimumFractionDigits: digits, maximumFractionDigits: digits })}</>;
}

// ---------- Gaya & ikon aplikasi Ayo Ngegym (disalin dari themes.js, global.css, Icons.jsx) ----------
const NG_DARK = {
    '--bg': '#070B08', '--bg3': '#141C17', '--card': '#0F1713',
    '--text': '#E8EFEA', '--text2': '#A2B0A7', '--text3': '#6C7970',
    '--accent': '#10B981', '--accent2': '#34D399', '--accent-light': '#052E1F', '--accent-dark': '#064E3B',
    '--border': '#1B2420', '--border-strong': '#2A332D',
    '--danger': '#F87171', '--danger-light': '#2A1414',
    '--elevated': '#060A08', '--elevated-text': '#F6FBF7',
    '--shadow': '0 2px 8px rgba(0,0,0,0.35)', '--shadow-md': '0 8px 24px rgba(0,0,0,0.45)',
    '--nav-bg': 'rgba(8,12,10,0.88)', '--ring': '0 0 0 3px rgba(16,185,129,0.25)',
};
const NG_LIGHT = {
    '--bg': '#F4F7F5', '--bg3': '#EDF2EE', '--card': '#FFFFFF',
    '--text': '#0C1512', '--text2': '#4A5A52', '--text3': '#869189',
    '--accent': '#0E6E3E', '--accent2': '#16A34A', '--accent-light': '#E6F4EA', '--accent-dark': '#08401F',
    '--border': '#E4EAE6', '--border-strong': '#D3DBD6',
    '--danger': '#DC2626', '--danger-light': '#FEE2E2',
    '--elevated': '#0B1410', '--elevated-text': '#F6FBF7',
    '--shadow': '0 2px 8px rgba(15,26,20,0.04), 0 1px 2px rgba(15,26,20,0.03)', '--shadow-md': '0 8px 24px rgba(15,26,20,0.08), 0 2px 4px rgba(15,26,20,0.04)',
    '--nav-bg': 'rgba(255,255,255,0.88)', '--ring': '0 0 0 3px rgba(14,110,62,0.15)',
};

const NG_CSS = `
.ng-app{font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,sans-serif;background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;display:flex;flex-direction:column;text-align:left;line-height:1.5;transition:background .3s,color .3s}
.ng-app *{box-sizing:border-box}
.ng-app button{font-family:inherit;cursor:pointer;border:0;background:none;color:inherit}
.ng-mono{font-family:'JetBrains Mono',ui-monospace,monospace;font-variant-numeric:tabular-nums}
.ng-header{flex:none;display:flex;align-items:center;justify-content:space-between;padding:14px 20px;background:var(--nav-bg);backdrop-filter:saturate(180%) blur(16px);border-bottom:1px solid var(--border)}
.ng-brand{display:flex;align-items:center;gap:10px}
.ng-brand-mark{width:38px;height:38px;border-radius:11px;background:linear-gradient(135deg,var(--accent) 0%,var(--accent-dark) 100%);display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 4px 12px rgba(14,110,62,.25),inset 0 1px 0 rgba(255,255,255,.15);position:relative}
.ng-brand-mark::after{content:'';position:absolute;right:-2px;bottom:-2px;width:10px;height:10px;border-radius:50%;background:var(--accent2);border:2px solid var(--nav-bg)}
.ng-brand-name{font-size:16px;font-weight:800;letter-spacing:-.3px;line-height:1.1}
.ng-brand-tag{font-size:11px;font-weight:500;color:var(--text3);margin-top:1px}
.ng-icon-btn{width:40px;height:40px;border-radius:12px;border:1px solid var(--border)!important;background:var(--card)!important;display:flex;align-items:center;justify-content:center;transition:all .18s}
.ng-icon-btn:hover{background:var(--bg3)!important;border-color:var(--border-strong)!important}
.ng-scroll{flex:1;min-height:0;overflow-y:auto;scrollbar-width:none;padding:12px 20px 28px}
.ng-scroll::-webkit-scrollbar{display:none}
.ng-page{animation:ng-fade .35s cubic-bezier(.16,1,.3,1)}
@keyframes ng-fade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@keyframes ng-spin{to{transform:rotate(360deg)}}
.ng-subtitle{font-size:14px;color:var(--text2);margin-bottom:18px;line-height:1.5}
.ng-eyebrow{font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.08em}
.ng-tiles{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:18px}
.ng-tile{background:var(--bg3);border-radius:14px;padding:14px;border:1px solid transparent;transition:all .2s}
.ng-tile:focus-within{border-color:var(--accent);box-shadow:var(--ring)}
.ng-tile input{width:100%;min-width:0;background:transparent;border:0;outline:0;color:var(--text);font:800 22px/1.1 'Plus Jakarta Sans',sans-serif;letter-spacing:-.02em;font-variant-numeric:tabular-nums;padding:0;-moz-appearance:textfield}
.ng-tile input::-webkit-outer-spin-button,.ng-tile input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
.ng-tile input:read-only{cursor:default}
.ng-card{background:var(--card);border-radius:18px;padding:18px;box-shadow:var(--shadow);border:1px solid var(--border);margin-bottom:14px}
.ng-section-title{display:inline-flex;align-items:center;gap:8px;font-size:15px;font-weight:700;margin-bottom:12px;letter-spacing:-.01em}
.ng-section-ico{display:inline-flex;width:24px;height:24px;border-radius:7px;align-items:center;justify-content:center;background:var(--accent-light);color:var(--accent)}
.ng-grid2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.ng-opt{position:relative;border-radius:14px;text-align:center;transition:all .2s}
.ng-opt-ico{display:inline-flex;border-radius:10px;align-items:center;justify-content:center;margin-bottom:4px}
.ng-btn{padding:13px 22px;border-radius:14px;font-weight:700;font-size:14px;display:inline-flex;align-items:center;justify-content:center;gap:8px;letter-spacing:-.005em;transition:all .18s cubic-bezier(.16,1,.3,1);width:100%}
.ng-btn:focus-visible{outline:none;box-shadow:var(--ring)}
.ng-btn-primary{background:var(--accent)!important;color:#fff!important;box-shadow:0 4px 14px rgba(14,110,62,.28),inset 0 1px 0 rgba(255,255,255,.12)}
.ng-btn-primary:hover{background:var(--accent-dark)!important;transform:translateY(-1px)}
.ng-btn-primary:disabled{opacity:.5;cursor:not-allowed;transform:none}
.ng-btn-secondary{background:var(--bg3)!important;border:1px solid var(--border)!important}
.ng-btn-secondary:hover{border-color:var(--border-strong)!important}
.ng-elevated{background:var(--elevated);color:var(--elevated-text);border:1px solid rgba(255,255,255,.06);border-radius:22px;padding:22px;position:relative;overflow:hidden;box-shadow:var(--shadow-md);margin-bottom:14px}
.ng-elevated::before{content:'';position:absolute;top:-40%;right:-20%;width:60%;height:140%;background:radial-gradient(circle,rgba(16,185,129,.18) 0%,transparent 60%);pointer-events:none}
.ng-badge-dark{display:inline-flex;align-items:center;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:700;letter-spacing:.02em;background:rgba(255,255,255,.1);color:#fff}
.ng-stat-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.ng-stat{background:var(--bg3);border-radius:14px;padding:14px;border:1px solid transparent;transition:border-color .2s}
.ng-stat:hover{border-color:var(--border-strong)}
.ng-stat-val{font-size:22px;font-weight:800;letter-spacing:-.02em;font-variant-numeric:tabular-nums;line-height:1.1}
.ng-stat-lbl{font-size:11px;color:var(--text3);margin-top:4px;font-weight:600;text-transform:uppercase;letter-spacing:.05em}
.ng-hero{grid-column:1/-1;border-radius:16px;padding:18px;color:#fff;background:linear-gradient(135deg,var(--accent) 0%,var(--accent-dark) 100%);box-shadow:0 6px 18px rgba(14,110,62,.3),inset 0 1px 0 rgba(255,255,255,.14)}
.ng-opt{display:block;width:100%}
.ng-hint-wrap{position:relative;display:flex}
.ng-hint-wrap>.ng-opt{flex:1}
.ng-ghost-ring{position:absolute;inset:0;border-radius:14px;pointer-events:none;opacity:0;border:2px solid var(--accent);background:rgba(16,185,129,.14);box-shadow:0 0 0 4px rgba(16,185,129,.25);animation:ng-ghost-ring 4.2s ease-in-out 1s infinite}
.ng-ghost-ptr{position:absolute;left:50%;top:50%;margin:-3px 0 0 -5px;pointer-events:none;z-index:5;opacity:0;filter:drop-shadow(0 3px 5px rgba(0,0,0,.5));animation:ng-ghost-ptr 4.2s ease-in-out 1s infinite}
.ng-ghost-tap{position:absolute;left:50%;top:50%;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;border:2px solid var(--accent2);pointer-events:none;z-index:4;opacity:0;animation:ng-ghost-tap 4.2s ease-out 1s infinite}
@keyframes ng-ghost-ptr{0%{opacity:0;transform:translate(78px,96px) scale(1)}14%{opacity:1}46%{opacity:1;transform:translate(0,0) scale(1)}52%{transform:translate(0,0) scale(.86)}60%{transform:translate(0,0) scale(1)}84%{opacity:1;transform:translate(0,0)}100%{opacity:0;transform:translate(0,0)}}
@keyframes ng-ghost-tap{0%,50%{opacity:0;transform:scale(.2)}52%{opacity:.9;transform:scale(.4)}74%{opacity:0;transform:scale(1.5)}100%{opacity:0}}
@keyframes ng-ghost-ring{0%,50%{opacity:0}54%{opacity:1}78%{opacity:1}92%,100%{opacity:0}}
@keyframes ng-breathe{0%,100%{box-shadow:10px 10px 0 #22c55e}50%{box-shadow:15px 15px 0 #22c55e}}
@keyframes ng-blink{0%,100%{opacity:1}50%{opacity:.25}}
@media (min-width:640px){.ng-breathe{animation:ng-breathe 2.6s ease-in-out infinite}}
.ng-blink{animation:ng-blink 1.2s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.ng-page{animation:none}.ng-ghost-ring,.ng-ghost-ptr,.ng-ghost-tap,.ng-breathe,.ng-blink{animation:none!important}.ng-ghost-ptr,.ng-ghost-tap,.ng-ghost-ring{display:none}}
`;

const NgIco = ({ children, size = 20, sw = 1.7 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
    </svg>
);

const NG_ICONS = {
    naik_bb: (<><rect x="3" y="14" width="18" height="6" rx="1.5" /><path d="M7 14v-2M17 14v-2" /><path d="M12 11V3" /><polyline points="8 7 12 3 16 7" /></>),
    turun_bb: (<><rect x="3" y="14" width="18" height="6" rx="1.5" /><path d="M7 14v-2M17 14v-2" /><path d="M12 3v8" /><polyline points="8 7 12 11 16 7" /></>),
    massa_otot: (<><path d="M5 14c0-3 2-5 5-5h3a4 4 0 0 1 4 4v1a4 4 0 0 1-4 4h-2a3 3 0 0 0-3 3" /><path d="M10 9c0-2 1-3 3-3" /><path d="M13 13a3 3 0 0 0 3-3" /></>),
    bakar_lemak: (<path d="M12 3c0 4-5 5-5 10a5 5 0 0 0 10 0c0-2-1-3-2-4 0 2-1 3-2 3 1-3-1-6-1-9z" />),
    pemula: (<><path d="M12 21v-9" /><path d="M12 12c0-3-2-5-5-5 0 3 2 5 5 5z" /><path d="M12 12c0-3 2-5 5-5 0 3-2 5-5 5z" /><path d="M5 21h14" /></>),
    menengah: (<><rect x="3" y="14" width="4" height="7" rx="1" /><rect x="10" y="9" width="4" height="12" rx="1" /><rect x="17" y="4" width="4" height="17" rx="1" /></>),
    mahir: (<path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />),
    elite: (<><path d="M8 4h8v6a4 4 0 0 1-8 0V4z" /><path d="M16 5.5h2.5a2 2 0 0 1 0 4H16" /><path d="M8 5.5H5.5a2 2 0 0 0 0 4H8" /><line x1="12" y1="14" x2="12" y2="17" /><path d="M9 17h6l1 3H8z" /></>),
    f1: (<><circle cx="12" cy="12" r="9" /><path d="M11 8.5L13 7v10" /></>),
    f2: (<><circle cx="12" cy="12" r="9" /><path d="M9.5 9c0-1.5 1.2-2.5 2.5-2.5s2.5 1 2.5 2.5c0 2-5 4-5 8h5" /></>),
    f3: (<><circle cx="12" cy="12" r="9" /><path d="M9.5 8.5c0-1 1-2 2.5-2s2.5 1 2.5 2.5-1 2.5-2.5 2.5c1.5 0 2.5 1 2.5 2.5s-1 2.5-2.5 2.5-2.5-1-2.5-2" /></>),
    f4: (<><circle cx="12" cy="12" r="9" /><path d="M13 7v10M13 13H9l4-6" /></>),
    f5: (<><circle cx="12" cy="12" r="9" /><path d="M14.5 7H10v4c0.5-0.5 1.2-1 2.2-1 1.5 0 2.8 1.2 2.8 3s-1.3 3-2.8 3c-1.2 0-2.2-0.7-2.5-1.7" /></>),
    dumbell: (<><rect x="2" y="8" width="3" height="8" rx="1" /><rect x="5" y="10" width="2" height="4" rx="0.5" /><line x1="7" y1="12" x2="17" y2="12" /><rect x="17" y="10" width="2" height="4" rx="0.5" /><rect x="19" y="8" width="3" height="8" rx="1" /></>),
    barbell: (<><rect x="1.5" y="6" width="2.5" height="12" rx="0.6" /><rect x="4" y="8.5" width="1.5" height="7" rx="0.4" /><line x1="5.5" y1="12" x2="18.5" y2="12" /><rect x="18.5" y="8.5" width="1.5" height="7" rx="0.4" /><rect x="20" y="6" width="2.5" height="12" rx="0.6" /></>),
    mesin: (<><line x1="3" y1="4" x2="21" y2="4" /><line x1="12" y1="4" x2="12" y2="5.5" /><circle cx="12" cy="7.5" r="2" /><line x1="12" y1="9.5" x2="12" y2="17" /><line x1="8" y1="17" x2="16" y2="17" /><line x1="9.5" y1="17" x2="9.5" y2="20" /><line x1="14.5" y1="17" x2="14.5" y2="20" /></>),
    berat_badan: (<><circle cx="12" cy="4.5" r="2.2" /><line x1="12" y1="6.7" x2="12" y2="15" /><path d="M12 9l-5 4" /><path d="M12 9l5 4" /><path d="M12 15l-3 6.5" /><path d="M12 15l3 6.5" /></>),
    target: (<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" /></>),
    chart: (<><rect x="3" y="14" width="4" height="7" rx="1" /><rect x="10" y="9" width="4" height="12" rx="1" /><rect x="17" y="4" width="4" height="17" rx="1" /><path d="M3 10l5-3 5 1 7-4" strokeDasharray="2 2" /></>),
    calendar: (<><rect x="3" y="5" width="18" height="16" rx="2.5" /><line x1="3" y1="10" x2="21" y2="10" /><line x1="8" y1="3" x2="8" y2="7" /><line x1="16" y1="3" x2="16" y2="7" /></>),
    user: (<><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></>),
    sun: (<><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></>),
    moon: (<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />),
    fire: (<path d="M12 2c0 4-4 6-4 10a4 4 0 008 0c0-4-4-6-4-10z" />),
    refresh: (<><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></>),
    check: (<polyline points="20 6 9 17 4 12" />),
};

// Satu pilihan kotak, bentuknya sama dengan tombol pilihan di aplikasi
function NgOpt({ sel, onClick, icon, label, sub, pad = '12px 10px', box = 36, check = false }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={sel}
            className="ng-opt"
            style={{
                padding: pad,
                border: sel ? '2px solid var(--accent)' : '1.5px solid var(--border)',
                background: sel ? 'var(--accent)' : 'var(--card)',
                color: sel ? '#fff' : 'var(--text)',
            }}
        >
            {check && sel && (
                <span style={{ position: 'absolute', top: 8, right: 8, width: 18, height: 18, borderRadius: 9, background: 'rgba(255,255,255,0.25)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <NgIco size={11} sw={3.5}>{NG_ICONS.check}</NgIco>
                </span>
            )}
            <span className="ng-opt-ico" style={{ width: box, height: box, background: sel ? 'rgba(255,255,255,0.18)' : 'var(--accent-light)', color: sel ? '#fff' : 'var(--accent)' }}>
                <NgIco size={box - 16}>{NG_ICONS[icon]}</NgIco>
            </span>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>{label}</span>
            {sub && <span style={{ display: 'block', fontSize: 10, opacity: 0.75, marginTop: 2 }}>{sub}</span>}
        </button>
    );
}

function NgStep({ icon, title, hint, children }) {
    return (
        <div className="ng-card ng-page">
            <div className="ng-section-title">
                <span className="ng-section-ico"><NgIco size={14}>{NG_ICONS[icon]}</NgIco></span>
                {title}
            </div>
            {hint && <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 10, marginTop: -4 }}>{hint}</div>}
            {children}
        </div>
    );
}

const STEPS = [
    ['01', 'Isi data tubuh', 'Umur, tinggi, dan berat badan.'],
    ['02', 'Pilih kualifikasi', 'Tujuan, level, frekuensi, lalu alat yang tersedia.'],
    ['03', 'Buat rekomendasi AI', 'Lihat kebutuhan protein, kalori, makro, dan ringkasan programmu.'],
];

export default function LabSection() {
    const [body, setBody] = useState({ umur: '22', tinggi: '170', berat: '65' });
    const [pilih, setPilih] = useState({ tujuan: null, level: null, freq: null, alat: [] });
    const [dark, setDark] = useState(true);
    const [view, setView] = useState('form'); // form | result
    const [loading, setLoading] = useState(false);
    const [msgIdx, setMsgIdx] = useState(0);
    const [out, setOut] = useState(null);
    const scrollRef = useRef(null);
    const phoneRef = useRef(null);
    const timers = useRef([]);
    // Petunjuk "ini bisa dipakai": aktif saat demo terlihat dan belum disentuh
    const [touched, setTouched] = useState(false);
    const [inView, setInView] = useState(false);
    useEffect(() => () => timers.current.forEach(clearTimeout), []);
    useEffect(() => {
        const el = phoneRef.current;
        if (!el || typeof IntersectionObserver === 'undefined') {
            setInView(true);
            return undefined;
        }
        const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 });
        io.observe(el);
        return () => io.disconnect();
    }, []);
    useEffect(() => {
        if (!loading) return undefined;
        const id = setInterval(() => setMsgIdx((i) => (i + 1) % LOADING_MSGS.length), 700);
        return () => clearInterval(id);
    }, [loading]);

    const inRange = (k) => {
        const v = parseFloat(body[k]);
        return v >= LIMITS[k][0] && v <= LIMITS[k][1];
    };
    const bodyOk = inRange('umur') && inRange('tinggi') && inRange('berat');

    const setTujuan = (id) => setPilih((p) => (p.tujuan === id ? p : { tujuan: id, level: null, freq: null, alat: [] }));
    const setLevel = (id) => setPilih((p) => (p.level === id ? p : { ...p, level: id, freq: null, alat: [] }));
    const setFreq = (id) => setPilih((p) => (p.freq === id ? p : { ...p, freq: id, alat: [] }));
    const toggleAlat = (id) =>
        setPilih((p) => ({ ...p, alat: p.alat.includes(id) ? p.alat.filter((a) => a !== id) : [...p.alat, id] }));

    const generate = () => {
        if (!bodyOk || loading || !pilih.alat.length) return;
        const result = calculate({ ...body, ...pilih });
        if (!result) return;
        setMsgIdx(0);
        setLoading(true);
        const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        timers.current.push(
            setTimeout(() => {
                setOut({ r: result, berat: parseFloat(body.berat) });
                setLoading(false);
                setView('result');
                scrollRef.current && scrollRef.current.scrollTo({ top: 0 });
            }, reduce ? 200 : 2100)
        );
    };
    const edit = () => {
        setView('form');
        scrollRef.current && scrollRef.current.scrollTo({ top: 0 });
    };
    const resetAll = () => {
        timers.current.forEach(clearTimeout);
        setBody({ umur: '22', tinggi: '170', berat: '65' });
        setPilih({ tujuan: null, level: null, freq: null, alat: [] });
        setOut(null);
        setLoading(false);
        setView('form');
        setTouched(false);
        scrollRef.current && scrollRef.current.scrollTo({ top: 0 });
    };

    const r = out && out.r;
    const hintOn = inView && !touched && view === 'form' && !pilih.tujuan;
    // Progres untuk daftar langkah di sebelah kiri
    const stage = view === 'result' ? 3 : pilih.alat.length > 0 ? 2 : pilih.tujuan ? 1 : 0;
    const readOnly = view === 'result';

    return (
        <section id="lab" aria-label="The Lab" className="relative w-full mt-28 sm:mt-36 pt-16 border-t-2 border-white/20 scroll-mt-20">
            {/* ===================== HEADER ===================== */}
            <header className="relative pb-12">
                <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-neutral-400 mb-5">
                    <span className="flex items-center gap-2 bg-white text-black font-bold px-2.5 py-1">
                        <FlaskConical className="w-3.5 h-3.5" /> Lab
                    </span>
                    <span>1 demo aktif</span>
                    <span className="text-neutral-600">/</span>
                    <span>2 slot menunggu</span>
                </div>

                <h2 className="font-syne font-black uppercase tracking-tighter leading-[0.85] text-5xl sm:text-7xl lg:text-8xl">
                    The{' '}
                    <span className="relative inline-block">
                        Lab
                        <span aria-hidden="true" className="absolute left-0 -bottom-1 sm:-bottom-2 w-full h-2 sm:h-3 bg-[#ff1e56] -rotate-1" />
                    </span>
                </h2>
                <p className="font-marker text-lg sm:text-2xl text-neutral-300 -rotate-1 mt-5">
                    eksperimen yang bisa kamu coba langsung
                </p>
                <p className="mt-4 max-w-xl text-sm text-neutral-400 leading-relaxed">
                    Bukan sekadar tangkapan layar. Di sini potongan proyek saya dibuat bisa dipakai, mulai dari rekomendasi protein
                    Ayo Ngegym sampai eksperimen berikutnya.
                </p>
            </header>

            {/* ===================== EXP-01: AYO NGEGYM ===================== */}
            <section aria-label="Demo Ayo Ngegym">
                <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');`}</style>
                <style>{NG_CSS}</style>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-start">
                    {/* ---------- Penjelasan (gaya portfolio) ---------- */}
                    <div className="lg:col-span-5 lg:pt-4">
                        <span className="font-mono text-[11px] tracking-[0.25em] font-bold" style={{ color: GREEN }}>
                            EXP-01 // DARI AYO NGEGYM
                        </span>
                        <h3 className="font-syne font-black text-3xl sm:text-5xl uppercase tracking-tight leading-[0.95] mt-2">
                            Rekomendasi protein &amp; nutrisi
                        </h3>
                        <p className="font-marker text-lg sm:text-xl text-neutral-300 -rotate-1 mt-4 inline-block">ini aplikasi aslinya. coba.</p>
                        <p className="mt-4 text-sm text-neutral-400 leading-relaxed max-w-md">
                            Tampilan di samping memakai desain Ayo Ngegym yang sebenarnya, lengkap dengan alur dan rumusnya.
                            Isi datamu, lalu lihat berapa protein yang kamu butuhkan setiap hari.
                        </p>

                        <ol className="mt-8 space-y-5 max-w-md">
                            {STEPS.map(([n, t, d], i) => {
                                const done = i < stage;
                                const active = i === stage;
                                return (
                                    <li key={n} className={`flex gap-4 transition-opacity duration-500 ${active || done ? 'opacity-100' : 'opacity-40'}`}>
                                        <span
                                            className="relative font-syne font-black text-2xl leading-none w-9 shrink-0 transition-colors duration-500"
                                            style={{ color: active || done ? GREEN : '#737373' }}
                                        >
                                            {done ? <Check className="w-6 h-6" strokeWidth={3} /> : n}
                                            {active && <span aria-hidden="true" className="ng-blink absolute -left-3 top-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: GREEN }} />}
                                        </span>
                                        <span>
                                            <span className="block font-syne font-bold uppercase tracking-wide text-sm">{t}</span>
                                            <span className="block text-sm text-neutral-400 leading-relaxed mt-0.5">{d}</span>
                                        </span>
                                    </li>
                                );
                            })}
                        </ol>

                        <p className="mt-8 font-mono text-[11px] text-neutral-500 leading-relaxed max-w-md">
                            Dihitung: BMI, BMR, TDEE, kalori target, protein, karbohidrat, dan lemak. Teks analisa di demo ini dibuat dari
                            template; di aplikasi asli ditulis oleh Gemini. Bukan saran medis.
                        </p>

                        <button
                            type="button"
                            onClick={resetAll}
                            className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-neutral-400 hover:text-white border border-white/20 hover:border-white px-3 py-1.5 transition-colors cursor-pointer"
                        >
                            <RotateCcw className="w-3.5 h-3.5" /> Ulangi dari awal
                        </button>
                    </div>

                    {/* ---------- Ponsel ---------- */}
                    <div className="lg:col-span-7 flex justify-center">
                        <div
                            ref={phoneRef}
                            onPointerDownCapture={() => setTouched(true)}
                            onFocusCapture={() => setTouched(true)}
                            className={`relative w-full max-w-[404px] sm:border-2 sm:border-white sm:rounded-[2.75rem] sm:p-2.5 sm:bg-black sm:shadow-[10px_10px_0_#22c55e] ${hintOn ? 'ng-breathe' : ''}`}
                        >
                            {/* Lencana: tanda bahwa ini bisa dipakai */}
                            <span className="absolute -top-3.5 left-7 z-20 flex items-center gap-2 bg-[#ff1e56] text-white font-mono text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 -rotate-2 pointer-events-none">
                                <i className="ng-blink inline-block w-1.5 h-1.5 rounded-full bg-white" /> Live demo &middot;
                            </span>
                            <span aria-hidden="true" className="hidden sm:block absolute top-[5px] left-1/2 -translate-x-1/2 w-14 h-1.5 rounded-full bg-white/20" />
                            <div
                                className="ng-app rounded-[1.75rem] sm:rounded-[2.1rem] overflow-hidden border border-white/10 sm:border-0 h-[700px] sm:h-[740px]"
                                style={dark ? NG_DARK : NG_LIGHT}
                            >
                                <div className="ng-header">
                                    <div className="ng-brand">
                                        <div className="ng-brand-mark"><NgIco size={22} sw={2}>{NG_ICONS.user}</NgIco></div>
                                        <div>
                                            <div className="ng-brand-name">Ayo Ngegym</div>
                                            <div className="ng-brand-tag">Ayo capai tujuan anda</div>
                                        </div>
                                    </div>
                                    <button type="button" className="ng-icon-btn" onClick={() => setDark(!dark)} aria-label="Ganti tema">
                                        <NgIco>{dark ? NG_ICONS.sun : NG_ICONS.moon}</NgIco>
                                    </button>
                                </div>

                                <div className="ng-scroll" ref={scrollRef} aria-live="polite">
                                    <div className="ng-page" key={view}>
                                        <p className="ng-subtitle">Dapatkan jadwal latihan yang dipersonalisasi berdasarkan profil tubuh Anda.</p>

                                        {/* Data tubuh (selalu tampil) */}
                                        <div className="ng-tiles">
                                            {[['umur', 'Umur', 'th'], ['tinggi', 'Tinggi', 'cm'], ['berat', 'Berat', 'kg']].map(([k, l, u]) => (
                                                <label key={k} className="ng-tile" style={!readOnly && body[k] !== '' && !inRange(k) ? { borderColor: 'var(--danger)' } : undefined}>
                                                    <div className="ng-eyebrow" style={{ marginBottom: 6 }}>{l}</div>
                                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                                                        <input
                                                            type="number"
                                                            inputMode="decimal"
                                                            value={body[k]}
                                                            readOnly={readOnly}
                                                            onChange={(e) => setBody((b) => ({ ...b, [k]: e.target.value }))}
                                                            aria-label={l}
                                                        />
                                                        <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600 }}>{u}</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                        {!bodyOk && !readOnly && (
                                            <div style={{ marginTop: -8, marginBottom: 14, padding: 12, background: 'var(--danger-light)', borderRadius: 10, fontSize: 12, color: 'var(--danger)', fontWeight: 600 }}>
                                                Isi umur 10-100 tahun, tinggi 100-250 cm, dan berat 25-300 kg.
                                            </div>
                                        )}

                                        {/* ===== FORM ===== */}
                                        {view === 'form' && (
                                            <>
                                                <NgStep icon="target" title="Tujuan Latihan" hint={touched ? undefined : 'Ketuk salah satu untuk mulai.'}>
                                                    <div className="ng-grid2">
                                                        {GOALS.map((g) => (
                                                            <div key={g.id} className="ng-hint-wrap">
                                                                <NgOpt sel={pilih.tujuan === g.id} onClick={() => setTujuan(g.id)} icon={g.id} label={g.label} pad="14px 12px" box={38} />
                                                                {hintOn && g.id === 'massa_otot' && (
                                                                    <>
                                                                        <span className="ng-ghost-ring" aria-hidden="true" />
                                                                        <span className="ng-ghost-tap" aria-hidden="true" />
                                                                        <svg className="ng-ghost-ptr" width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
                                                                            <path d="M4 3v16l4.5-4.2 3 6.2 2.5-1.2-3-6.1 6-.2z" fill="#fff" stroke="#0c0c0c" strokeWidth="1.4" strokeLinejoin="round" />
                                                                        </svg>
                                                                    </>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </NgStep>

                                                {pilih.tujuan && (
                                                    <NgStep icon="chart" title="Level Latihan">
                                                        <div className="ng-grid2">
                                                            {LEVELS.map((l) => (
                                                                <NgOpt key={l.id} sel={pilih.level === l.id} onClick={() => setLevel(l.id)} icon={l.id} label={l.label} sub={l.sub} />
                                                            ))}
                                                        </div>
                                                    </NgStep>
                                                )}

                                                {pilih.tujuan && pilih.level && (
                                                    <NgStep icon="calendar" title="Frekuensi Latihan per Minggu">
                                                        <div className="ng-grid2">
                                                            {FREQS.map((q) => (
                                                                <NgOpt key={q.id} sel={pilih.freq === q.id} onClick={() => setFreq(q.id)} icon={q.id} label={q.label} sub={q.sub} />
                                                            ))}
                                                        </div>
                                                    </NgStep>
                                                )}

                                                {pilih.tujuan && pilih.level && pilih.freq && (
                                                    <NgStep icon="dumbell" title="Tipe Latihan" hint="Pilih semua alat yang kamu punya akses (boleh lebih dari satu).">
                                                        <div className="ng-grid2">
                                                            {EQUIPMENT.map((e) => (
                                                                <NgOpt key={e.id} sel={pilih.alat.includes(e.id)} onClick={() => toggleAlat(e.id)} icon={e.id} label={e.label} check />
                                                            ))}
                                                        </div>
                                                        {pilih.alat.length > 0 && (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    className="ng-btn ng-btn-primary"
                                                                    style={{ marginTop: 16, opacity: loading ? 0.7 : 1 }}
                                                                    onClick={generate}
                                                                    disabled={!bodyOk || loading}
                                                                >
                                                                    {loading ? (
                                                                        <>
                                                                            <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,.35)', borderTopColor: '#fff', borderRadius: '50%', animation: 'ng-spin .7s linear infinite' }} />
                                                                            AI Sedang Menganalisa...
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <NgIco size={18} sw={2}>{NG_ICONS.fire}</NgIco> Buat Rekomendasi AI
                                                                        </>
                                                                    )}
                                                                </button>
                                                                {loading && (
                                                                    <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: 'var(--text3)' }}>{LOADING_MSGS[msgIdx]}</div>
                                                                )}
                                                            </>
                                                        )}
                                                    </NgStep>
                                                )}
                                            </>
                                        )}

                                        {/* ===== HASIL ===== */}
                                        {view === 'result' && r && (
                                            <>
                                                <button type="button" className="ng-btn ng-btn-secondary" style={{ marginBottom: 12 }} onClick={edit}>
                                                    <NgIco size={16} sw={2}>{NG_ICONS.refresh}</NgIco> Ubah Rekomendasi
                                                </button>

                                                <div className="ng-elevated">
                                                    <div style={{ position: 'relative', zIndex: 1 }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                                            <span className="ng-badge-dark">&#10022; DIHASILKAN AI</span>
                                                            <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 4, padding: '5px 10px', borderRadius: 12, background: 'rgba(255,255,255,0.10)' }}>
                                                                <span style={{ fontSize: 14, fontWeight: 800 }}>{r.perWeek}&times;</span>
                                                                <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.7, letterSpacing: '0.06em' }}>/MINGGU</span>
                                                            </span>
                                                        </div>
                                                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
                                                            Program Kamu &middot; Tingkat {r.level.label}
                                                        </div>
                                                        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
                                                            <span style={{ display: 'inline-flex', width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.12)', color: 'var(--accent2)', flexShrink: 0 }}>
                                                                <NgIco size={24}>{NG_ICONS[r.goal.id]}</NgIco>
                                                            </span>
                                                            <span>{r.goal.title}</span>
                                                        </div>
                                                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.10)', paddingTop: 12, display: 'grid', gap: 10 }}>
                                                            <div>
                                                                <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Split Latihan</div>
                                                                <div style={{ fontSize: 13, fontWeight: 600 }}>{r.freq.sub}</div>
                                                            </div>
                                                            <div>
                                                                <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Alat yang Dipakai</div>
                                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                                                    {r.alat.map((a) => (
                                                                        <span key={a} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 14, background: 'rgba(255,255,255,0.14)', fontSize: 11.5, fontWeight: 700 }}>
                                                                            <NgIco size={12}>{NG_ICONS[a]}</NgIco>
                                                                            {EQUIPMENT.find((e) => e.id === a).label}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="ng-card" style={{ borderLeft: '4px solid var(--accent)' }}>
                                                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, color: 'var(--accent)' }}>🤖 Analisa AI Personal</div>
                                                    <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text2)' }}>{r.analisa}</div>
                                                </div>

                                                {r.notes.length > 0 && (
                                                    <div className="ng-card" style={{ borderLeft: '4px solid var(--danger)', background: 'var(--danger-light)' }}>
                                                        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, color: 'var(--danger)' }}>⚠️ Peringatan Kesehatan</div>
                                                        <div style={{ fontSize: 13, lineHeight: 1.6 }}>{r.notes.join(' ')}</div>
                                                    </div>
                                                )}

                                                <div className="ng-card">
                                                    <div className="ng-stat-grid">
                                                        <div className="ng-hero">
                                                            <div className="ng-eyebrow" style={{ color: 'rgba(255,255,255,0.75)' }}>Protein harian</div>
                                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
                                                                <span className="ng-mono" style={{ fontSize: 46, fontWeight: 700, lineHeight: 1, letterSpacing: '-0.03em' }}>
                                                                    <Num value={r.protein} plain />
                                                                </span>
                                                                <span style={{ fontSize: 18, fontWeight: 800 }}>g</span>
                                                                <span className="ng-mono" style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, background: 'rgba(255,255,255,0.18)', padding: '4px 8px', borderRadius: 8 }}>
                                                                    {r.goal.protein.toFixed(1)} g/kg
                                                                </span>
                                                            </div>
                                                            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 8 }}>
                                                                {out.berat} kg &times; {r.goal.protein.toFixed(1)} g/kg
                                                            </div>
                                                        </div>
                                                        {[
                                                            ['BMI', <Num value={r.bmi} digits={1} plain />],
                                                            ['Kalori/hari', <Num value={r.kalori} plain />],
                                                            ['TDEE', <Num value={r.tdee} plain />],
                                                            ['Karbohidrat', <><Num value={r.karbo} plain />g</>],
                                                            ['Lemak', <><Num value={r.lemak} plain />g</>],
                                                            ['Set x Rep', `${r.sets}x${r.reps}`],
                                                            ['Istirahat', `${r.level.rest}s`],
                                                            ['Per Minggu', `${r.perWeek}x`],
                                                        ].map(([l, v]) => (
                                                            <div key={l} className="ng-stat">
                                                                <div className="ng-stat-val">{v}</div>
                                                                <div className="ng-stat-lbl">{l}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===================== SLOT BERIKUTNYA ===================== */}
            <section aria-label="Demo mendatang" className="mt-24">
                <div className="flex items-end justify-between gap-3 mb-6 pb-3 border-b border-white/15">
                    <h2 className="font-syne font-black text-2xl sm:text-4xl uppercase tracking-tight">Segera hadir</h2>
                    <span className="font-mono text-[11px] tracking-[0.25em] text-neutral-500 uppercase">In the oven</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {UPCOMING.map((u) => (
                        <div key={u.code} className="relative border-2 border-dashed border-white/25 p-6 sm:p-8 min-h-[220px] flex flex-col justify-between">
                            <div className="flex items-center justify-between font-mono text-[11px] tracking-widest">
                                <span className="font-bold text-white">{u.code}</span>
                                <span className="flex items-center gap-1.5 text-neutral-500 uppercase"><Lock className="w-3.5 h-3.5" /> Terkunci</span>
                            </div>
                            <div className="space-y-2.5 my-6" aria-hidden="true">
                                <div className="h-5 bg-white/90 w-3/5" />
                                <div className="h-5 bg-white/20 w-4/5" />
                                <div className="h-5 bg-white/10 w-2/5" />
                            </div>
                            <p className="font-mono text-xs text-neutral-400 leading-relaxed">{u.note}</p>
                        </div>
                    ))}
                </div>
            </section>
        </section>
    );
}