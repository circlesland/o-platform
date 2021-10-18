import watchMedia from "../functions/watchMedia";

const mediaqueries = {
  small: "(max-width: 776px)",
  large: "(min-width: 768px)",
  short: "(max-height: 399px)",
  landscape: "(orientation: landscape) and (max-height: 499px)",
  tiny: "(orientation: portrait) and (max-height: 599px)",
  dark: "(prefers-color-scheme: dark)",
  noanimations: "(prefers-reduced-motion: reduce)",
};

export const media = watchMedia(mediaqueries);
