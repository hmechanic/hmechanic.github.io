/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                neon: {
                    cyan: '#00f3ff',
                    magenta: '#ff00ff',
                    purple: '#bc13fe',
                    green: '#00ff9f',
                },
                dark: {
                    bg: '#050505',
                    surface: '#0a0a0a',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 5px #00f3ff, 0 0 10px #00f3ff' },
                    '100%': { boxShadow: '0 0 20px #00f3ff, 0 0 30px #00f3ff' },
                }
            }
        },
    },
    plugins: [],
}
