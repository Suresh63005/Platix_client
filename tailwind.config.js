/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'], // Define Poppins font family
      },
      fontWeight: {
        normal: 'normal', // Ensure font weight is set correctly
      },
    },
  },
  plugins: [],
}
