/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // erfasst alle Dateien im src-Ordner
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
}
