import watchMedia from "../functions/watchMedia";

const mediaqueries = {
  small: "(max-width: 1007px)",
  large: "(min-width: 1008px)",
  xlarge: "(min-width: 1024px)",
  short: "(max-height: 399px)",
  landscape: "(orientation: landscape) and (max-height: 499px)",
  tiny: "(orientation: portrait) and (max-height: 599px)",
  dark: "(prefers-color-scheme: dark)",
  noanimations: "(prefers-reduced-motion: reduce)",
};

export const media = watchMedia(mediaqueries);
