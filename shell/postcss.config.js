const production = !process.env.NODE_ENV;

module.exports = {
  plugins: {
    // "postcss-flexbugs-fixes": {},
    // "postcss-preset-env": {
    //   autoprefixer: {
    //     flexbox: "no-2009",
    //   },
    //   stage: 3,
    //   features: {
    //     "custom-properties": false,
    //   },
    // },
    // "@tailwindcss/jit": {},
    // "@fullhuman/postcss-purgecss": {
    //   content: [
    //     "./pages/**/*.{js,jsx,ts,tsx}",
    //     "./components/**/*.{js,jsx,ts,tsx}",
    //     "./src/**/*.svelte",
    //     "./src/**/*.ts",
    //     "./src/**/*.js",
    //     "./src/**/*.jsx",
    //     "./public/*.html",
    //     "./../packages/**/*.svelte",
    //     "./../public/**/*.html",
    //   ],
    //   defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
    //   safelist: ["html", "body", /data-theme$/],
    // },
    autoprefixer: {},
    tailwindcss: {},
  },
};
