/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: '#aa3bff',
        'accent-light': 'rgba(170, 59, 255, 0.1)',
        'accent-border': 'rgba(170, 59, 255, 0.5)',
        'code-bg': '#f4f3ec',
        'social-bg': 'rgba(244, 243, 236, 0.5)',
      },
    },
  },
  plugins: [],
}
