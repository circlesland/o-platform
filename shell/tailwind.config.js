const colors = require("tailwindcss/colors");

module.exports = {
  darkMode: false,
  purge: {
    content: ["./src/**/*.svelte", "./src/**/*.css", "./public/*.html"],
    options: {
      safelist: [/data-theme$/],
    },
  },
  daisyui: {
    styled: true,
    themes: true,
    rtl: false,
  },

  theme: {
    extend: {
      // colors: require("daisyui/colors"),
      colors: {
        base: "#000000",
        "base-300": "#D1D5DB",
        red: "#DC143C",
        green: "#32CD32",
        gradient1: "#01206D",
        gradient2: "#1157A9",
        circlesblue: "#08568B",
        circlesdarkblue: "#032A45",
        circleshighlightblue: "#099BB0",
        circleslightblue: "#7c96a3",
        linkgrey: "#97acbc",
        transactionpositive: "#32CD32",
        transactionnegative: "#DC143C",
        primary: "#60C8F5",
        secondary: "#88EA66",
        light: "#8DA3D0",
        dark: "#0D285F",
      },
      fontFamily: {
        circles: ["Ostrich Sans Heavy", "sans"],
        primary: ["Now Alt Light", "sans-serif"],
        sans: ["Now Alt Light", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
    },
  },
  variants: {
    backgroundClip: ["responsive"],
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
};
