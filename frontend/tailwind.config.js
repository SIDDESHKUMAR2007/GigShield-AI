/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#141414",
        accent: "#F34C3F", // A modern red for delivery
        card: "#1e1e1e",
        textLight: "#f4f4f5",
        textMuted: "#a1a1aa"
      }
    },
  },
  plugins: [],
}
