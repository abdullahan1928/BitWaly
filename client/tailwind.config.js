/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary': '#6631F7',
                'blue': '#2a5bd7',
            },
            fontFamily: {
                'proxima-nova': ["ProximaNova Regular", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
            }
        },
    },
    plugins: [],
}