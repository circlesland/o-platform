const sveltePreprocess = require("svelte-preprocess");

function createPreprocessors() {
  return sveltePreprocess({
    defaults: {
      markup: "pug",
      script: "typescript",
      style: "postcss",
    },
  });
}
module.exports = {
  preprocess: createPreprocessors(),
  createPreprocessors,
};
