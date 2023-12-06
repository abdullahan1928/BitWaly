/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'blue': '#2a5bd7',
            },
            fontFamily: {
                'proxima-nova': ["ProximaNova Regular", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
            }
        },
    },
    plugins: [],
}