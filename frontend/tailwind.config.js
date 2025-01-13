export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        pop: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-0.2rem)' },
        },

      },
      animation: {
        pop: "pop 0.2s ease-out",
        gradient: 'gradient 3s ease infinite', // Moving gradient
        bounce: 'bounce 1s infinite', // Bouncing dots
      },
      fontFamily: {
        custom: ['Rimons', 'sans-serif'],
        hawthorne: ['HawthorneVintage', 'sans-serif'],
        elagra: ['Elagra', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        raleway: ['Raleway', 'sans-serif'],
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