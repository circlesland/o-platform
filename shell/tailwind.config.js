const colors = require("tailwindcss/colors");
const production = !process.env.NODE_ENV;

module.exports = {
  // future: {
  //   purgeLayersByDefault: true,
  //   removeDeprecatedGapUtilities: true,
  // },
  darkMode: false,

  purge: {
    enabled: production,
    content: ["./../packages/**/*.svelte", "./src/**/*.svelte"],
    defaultExtractor: (content) => {
      const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
      const broadMatchesWithoutTrailingSlash = broadMatches.map((match) =>
        _.trimEnd(match, "\\")
      );
      const matches = broadMatches.concat(broadMatchesWithoutTrailingSlash);
      return matches;
    },
    options: {
      safelist: [/data-theme$/],
    },
  },
  daisyui: {
    styled: true,
    themes: false,
    logs: false,
  },

  theme: {
    extend: {
      // colors: require("daisyui/colors"),
      colors: {
        darklight: "#0F2662",
        base: "#2c2c2c",
        "base-300": "#D1D5DB",
        red: "#DC143C",
        green: "#32CD32",
        gradient1: "#003399",
        gradient2: "#0ad99c",
        circlesblue: "#08568B",
        circlesdarkblue: "#032A45",
        circleshighlightblue: "#099BB0",
        circleslightblue: "#7c96a3",
        linkgrey: "#97acbc",
        darkgrey: "#484b52",
        darkblue: "#061549",
        transactionpositive: "#0BE09D",
        transactionnegative: "#F47474",
        primary: "#0ad99c",
        primaryhighlight: "#66f7cd",
        secondary: "#052D7C",
        lightgrey: "#D9E2EE",
        lightdark: "#98B2D0",
        darkgrey: "#081B4B",
        primarydark: "#052D7C",
        light: "#A1B4DA",
        dark: "#0D285F",
        warning: "#FF9900",
        info: "#2094F3",
        infobg: "#E8F4FE",
        error: "#b02d23",
        success: "#48BB78",
        white: "#ffffff",
      },
      fontFamily: {
        circles: ["Poppins", "sans"],
        primary: ["Poppins", "sans"],
        sans: ["Open Sans", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
    },
  },
  variants: {
    backgroundClip: ["responsive"],
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
};
