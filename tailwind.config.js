/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    // Breakpoint "xs" dipakai di kode asli (hidden xs:block)
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      // Dipakai di kartu skill (w-18 h-18)
      spacing: {
        18: '4.5rem',
      },
    },
  },
  plugins: [],
};
