const colors = require("tailwindcss/colors");
const production = !process.env.NODE_ENV;

module.exports = {
  // future: {
  //   purgeLayersByDefault: true,
  //   removeDeprecatedGapUtilities: true,
  // },
  darkMode: false,
  mode: "jit",
  purge: [
    "./src/**/*.svelte",
    "./public/**/*.html",
    "./../packages/**/*.svelte",
    "./src/**/*.{js,jsx,ts,tsx,vue}",
  ],

  daisyui: {
    styled: true,
    themes: false,
    logs: false,
  },

  theme: {
    extend: {
      typography: {
        "text-base": {
          css: {
            fontSize: "1rem",
            lineHeight: "1rem",
          },
        },
      },
      screens: {
        xs: "500px",
      },

      borderRadius: {
        xl: "16px",
      },
      colors: {
        DEFAULT: "#0A2262",
        base: "#0A2262",
        dark: {
          DEFAULT: "#0A2262",
          light: "#153587",
          lighter: "#4562AF",
          lightest: "#8597C6",
          dark: "#081B4A",
        },
        light: {
          DEFAULT: "#EDDFD2",
          light: "#F1E7DD",
          lighter: "#FBF6F1",
          lightest: "#FEFCF9",
          dark: "#DDCBBB",
        },
        primary: {
          DEFAULT: "#41C7F1",
          light: "#58DBF8",
          lighter: "#91EDFA",
          lightest: "#C2FBFF",
          dark: "#2BADEB",
        },
        secondary: {
          DEFAULT: "#CF1E64",
          light: "#EA6197",
          lighter: "#FEA0C8",
          lightest: "#FDC1DA",
          dark: "#AE114F",
        },
        alert: {
          DEFAULT: "#F14E47",
          light: "#FF6D6D",
          lighter: "#FF9898",
          lightest: "#FFCACA",
          dark: "#DD3A33",
        },
        success: {
          DEFAULT: "#0BE09D",
          light: "#57F5A9",
          lighter: "#99FBC6",
          lightest: "#C5FFD8",
          dark: "#14C892",
        },
        info: {
          DEFAULT: "#FAAD26",
          light: "#FFCA62",
          lighter: "#FFDE88",
          lightest: "#FFF6D7",
          dark: "#F29C05",
        },

        darkgrey: "#E2E7EB",

        gradient1: "#1DD6A4",
        gradient2: "#0ad99c",

        transactionpositive: "#0BE09D",
        transactionnegative: "#F14E47",

        lightgrey: "#D9E2EE",

        warning: "#FF9900",

        error: "#b02d23",

        white: "#ffffff",
      },
      fontFamily: {
        primary: ["Poppins", "sans"],
        heading: ["Ostrich Sans Heavy", "sans"],
        sans: ["Poppins", "sans"],
      },
    },
  },
  variants: {
    backgroundClip: ["responsive"],
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
};
