import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

// ============================================================
// TEMA: gelap (bawaan) / cerah. Disimpan di localStorage ('theme').
// Atribut data-theme di <html> yang dipakai styles/theme-light.css.
// ============================================================
const KEY = 'theme';
const EVENT = 'portfolio:theme';

export function getStoredTheme() {
    try {
        const t = window.localStorage.getItem(KEY);
        if (t === 'light' || t === 'dark') return t;
    } catch {
        /* abaikan */
    }
    return 'dark';
}

export function applyTheme(theme) {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
}

// Panggil sebelum React render (main.jsx) supaya tidak ada kedipan tema
export function initTheme() {
    applyTheme(getStoredTheme());
}

export function useTheme() {
    const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'dark');

    // Beberapa tombol tema (navbar, footer, dll) tetap sinkron
    useEffect(() => {
        const onChange = (e) => setTheme(e.detail);
        window.addEventListener(EVENT, onChange);
        return () => window.removeEventListener(EVENT, onChange);
    }, []);

    const set = useCallback((next) => {
        const commit = () => {
            applyTheme(next);
            try {
                window.localStorage.setItem(KEY, next);
            } catch {
                /* abaikan */
            }
            flushSync(() => setTheme(next));
            window.dispatchEvent(new CustomEvent(EVENT, { detail: next }));
        };
        const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (document.startViewTransition && !reduce) {
            const root = document.documentElement;
            root.setAttribute('data-vt', 'theme');
            const vt = document.startViewTransition(commit);
            const done = () => root.removeAttribute('data-vt');
            vt.finished.then(done, done);
        } else {
            commit();
        }
    }, []);

    const toggle = useCallback(() => set(theme === 'light' ? 'dark' : 'light'), [set, theme]);
    return { theme, set, toggle };
}