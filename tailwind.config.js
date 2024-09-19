/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: "#f82d97",
        "background-100": "#1A1A1A",
        "background-200": "#292929",
        "background-300": "#404040",
        "background-400": "#5B5B5B",
        "background-500": "#DD58D6",
      },
      fontFamily: {
        body: ["Nunito"],
      },
    },
  },
  plugins: [],
}