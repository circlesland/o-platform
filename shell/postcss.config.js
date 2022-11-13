// const config = {
//   plugins: [
//     require("postcss-import"),
//     require("tailwindcss/nesting")(require("postcss-nesting")),
//     require("autoprefixer"),
//     require("tailwindcss"),
//   ],
// };

// module.exports = config;

let postcss = require("postcss");

module.exports = {
  plugins: [
    {
      postcssPlugin: "grouped",
      Once(root, { result }) {
        return postcss([require("postcss-import"), require("postcss-mixins"), require("postcss-simple-vars")]).process(
          root,
          result.opts
        );
      },
    },
    require("tailwindcss"),
    require("postcss-nested"),
    require("autoprefixer"),
  ],
};
