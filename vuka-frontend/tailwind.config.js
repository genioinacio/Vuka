/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vuka: {
          green: "#2D6A1F",
          light: "#EAF3DE",
          medium: "#C0DD97",
          dark: "#1B4D3E",
        }
      }
    },
  },
  plugins: [],
}