/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary': {
                    'DEFAULT': '#6631F7',
                    '50': '#F9F7FF',
                    '100': '#F4F0FF',
                    '200': '#EAE0FF',
                    '300': '#D6C0FF',
                    '400': '#B99DFF',
                    '500': '#9967FF',
                    '600': '#8047FF',
                    '700': '#6631F7',
                    '800': '#4F24D9',
                    '900': '#3E1BA3',
                },
                'secondary': {
                    'DEFAULT': '#FF275B',
                    '50': '#FFF7F7',
                    '100': '#FFEEF0',
                    '200': '#FFD7DE',
                    '300': '#FFB4C0',
                    '400': '#FF8C96',
                    '500': '#FF275B',
                    '600': '#E61F51',
                    '700': '#C11A47',
                    '800': '#9A143D',
                    '900': '#7C1035',
                },
            },
            fontFamily: {
                'proxima-nova': ["ProximaNova Regular", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
            }
        }
    },
    plugins: [],
};
