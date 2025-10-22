// frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Tailwind will scan these files for classes
  ],
  theme: {
    extend: {
      colors: {
        // Define a custom accent color for highlights
        accent: "#60A5FA", // This color can now be used as 'bg-accent', 'text-accent', etc.
      },
    },
  },
  plugins: [],
};
