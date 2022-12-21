/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "neutral-0": "#303135",
        "neutral-1": "#28292d",
        "neutral-2": "#202123",
        "primary-0": "#c7d7d8",
        "primary-1": "#b7cacc",
        "primary-2": "#a6bdbf",

        "secondary-0": "#a1fcf3",
        "secondary-1": "#2fd8c7",
        tertiary: "#b8d3fc",
      },
    },
  },
  plugins: [],
};
