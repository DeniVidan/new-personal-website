module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        custom: ['Rimons', 'sans-serif'],
        hawthorne: ['HawthorneVintage', 'sans-serif'],
        elagra: ['Elagra', 'sans-serif'],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.text-stroke': {
          '-webkit-text-stroke': '1px black', // Customize the stroke color and width
        },
        '.text-stroke-white': {
          '-webkit-text-stroke': '1px white',
        },
      })
    },
  ],
};