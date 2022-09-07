const colors = require("tailwindcss/colors");
const production = !process.env.NODE_ENV;

module.exports = {
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  darkMode: false,
  mode: "jit",
  purge: [
    "./src/**/*.svelte",
    "../packages/o-editors/src/**/*.svelte",
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
      fontSize: {
        "4rem": "4rem",
        "5rem": "5rem",
        "10xl": "9rem",
        "11xl": "10rem",
        "12xl": "14rem",
        "13xl": "15rem",
      },
      borderColor: ["dark-lightest"],
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
          light: "#F8EFE7",
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
        inactive: "#bcbcbc",
        borderColor: "#8597C6",
        darkgrey: "#E2E7EB",
        background: "#F5F8FF",
        newbackground: "#EFF1F7",
        pagebackground: "#FFFFFF",

        gradient1: "#1DD6A4",
        gradient2: "#41C7F1",
        gradient3: "#000428",
        gradient4: "#004e92",
        // gradient1: "#003399",
        // gradient2: "#1ED6A4",
        orgagradient1: "#4D0894",
        orgagradient2: "#A22F76",
        orgagradient3: "#D94F60",
        orgagradient4: "#E68163",
        orgagradient5: "#EBD25C",

        transactionpositive: "#0BE09D",
        transactionnegative: "#F14E47",

        lightgrey: "#C1C1C1",

        warning: "#FF9900",

        error: "#b02d23",

        white: "#ffffff",

        passport: {
          DEFAULT: "#D82D74",
          light: "#F75F9E",
        },
        banking: {
          DEFAULT: "#F26240",
          light: "#FF8874",
        },
        marketplace: {
          DEFAULT: "#70BD9E",
          light: "#89D4BA",
        },
        contacts: {
          DEFAULT: "#3CC1CA",
          light: "#49D7DC",
        },
        home: {
          DEFAULT: "#5B1E63",
          light: "#785A8A",
        },
        cpurple: {
          DEFAULT: "#5B1E63",
          light: "#785A8A",
        },
        yellow: {
          DEFAULT: "#F7AB28",
        },
        circlesgray: {
          DEFAULT: "#C1C1C1",
        },
        bordergray: {
          DEFAULT: "#ECECEC",
        },
        positive: {
          DEFAULT: "#70BD9E",
        },
        negative: {
          DEFAULT: "#D82D74",
        },
        dappbackground: {
          DEFAULT: "#F9F9FB",
        },
      },
      fontFamily: {
        primary: ["Poppins", "sans"],
        enso: ["Enso", "sans"],
        heading: ["Ostrich Sans Heavy", "sans"],
        omedium: ["Ostrich Sans Medium", "sans"],
        olight: ["Ostrich Sans Light", "sans"],
        sans: ["Poppins", "sans"],
      },
    },
  },
  variants: {
    backgroundClip: ["responsive"],
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
};
