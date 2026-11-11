import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../theme.js';

// Tombol ganti tema (matahari = ke cerah, bulan = ke gelap)
export default function ThemeToggle({ className = '' }) {
    const { theme, toggle } = useTheme();
    const light = theme === 'light';
    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={light ? 'Ganti ke mode gelap' : 'Ganti ke mode cerah'}
            title={light ? 'Mode gelap' : 'Mode cerah'}
            className={`relative w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors duration-300 cursor-pointer ${className}`}
        >
            <Sun className={`absolute w-4 h-4 transition-all duration-500 ${light ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} />
            <Moon className={`absolute w-4 h-4 transition-all duration-500 ${light ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`} />
        </button>
    );
}