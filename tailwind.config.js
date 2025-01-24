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
        "neutral-0": "#bdbdbd",
        "neutral-1": "#aeaeae",
        "neutral-2": "#8d8d8d",
        "neutral-3": "#737374",
        "neutral-4": "#545456",
        "neutral-5": "#3d3d3f",
        "neutral-6": "#2b2b2d",
        "neutral-7": "#202121",
        "neutral-8": "#0f1010",

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
