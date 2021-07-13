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
        DEFAULT: "#132B69",
        base: "#132B69",
        dark: {
          DEFAULT: "#081B4B",
          light: "#0F2662",
          lighter: "#183276",
          lightest: "#2C468A",
          dark: "#041338",
        },
        light: {
          DEFAULT: "#B1C6DF",
          light: "#D0DDEC",
          lighter: "#E3EBF6",
          lightest: "#F4F6F9",
          dark: "#8AA7C9",
        },
        primary: {
          DEFAULT: "#0BE09D",
          light: "#57F5A9",
          lighter: "#99FBC6",
          lightest: "#C5FFD8",
          dark: "#14C892",
        },
        secondary: {
          DEFAULT: "#003399",
          light: "#386DD3",
          lighter: "#70B2EF",
          lightest: "#ABD1F4",
          dark: "#132B69",
        },
        alert: {
          DEFAULT: "#FC4E43",
          light: "#FF6D6D",
          lighter: "#FF9898",
          lightest: "#FFCACA",
          dark: "#F63B2F",
        },
        success: {
          DEFAULT: "#0BE09D",
          light: "#57F5A9",
          lighter: "#99FBC6",
          lightest: "#C5FFD8",
          dark: "#14C892",
        },
        info: {
          DEFAULT: "#FFC123",
          light: "#FFCA62",
          lighter: "#FFDE88",
          lightest: "#FFF6D7",
          dark: "#F6B100",
        },

        darklight: "#0F2662",

        gradient1: "#003399",
        gradient2: "#0ad99c",

        transactionpositive: "#0BE09D",
        transactionnegative: "#F47474",

        lightgrey: "#D9E2EE",

        primarydark: "#052D7C",

        warning: "#FF9900",
        info: "#2094F3",
        infobg: "#E8F4FE",
        error: "#b02d23",
        success: "#48BB78",
        white: "#ffffff",
      },
      fontFamily: {
        primary: ["Poppins", "sans"],
        sans: ["Poppins", "sans"],
      },
    },
  },
  variants: {
    backgroundClip: ["responsive"],
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
};
