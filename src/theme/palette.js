// Project pages palette. A warm near-black ground, the home hero's cream
// (#fffce1) for type, and one neon "tube" per project taken from the home
// hero's TubesCursor lights. Tailwind exposes the same values as
// void / carbon / carbon-hi / paper / bone / dust in tailwind.config.js.

export const VOID = "#0b0a09";
export const CARBON = "#151311";
export const PAPER = "#fffce1";
export const BONE = "#b9af95";
export const DUST = "#8b8371";

// Diagram roles.
export const TEXT = PAPER; // labels drawn on the page or on a surface node
export const SURFACE = CARBON; // fill of an ordinary diagram node
export const ON_ACCENT = VOID; // text drawn on a neon-filled node

// Paper at fixed opacities, for SVG strokes that Tailwind classes can't reach.
export const GRIDLINE = "rgba(255, 252, 225, 0.08)";
export const SUBTLE = "rgba(255, 252, 225, 0.14)";
export const BOUNDARY = "rgba(255, 252, 225, 0.18)";
export const BASELINE = "rgba(255, 252, 225, 0.3)";
export const OUTLINE = "rgba(255, 252, 225, 0.4)";

// One neon per project, from the home hero's tubes.
export const NEON = {
  magenta: "#f967fb",
  lime: "#83f36e",
  cyan: "#60aed5",
  ember: "#fe8a2e",
};

// Categorical colors for diagram branches and legends. Deliberately muted so
// they read as data and never compete with a page's neon.
export const GREEN = "#8fc79f";
export const AMBER = "#d9a74a";
export const RED = "#e0645c";
export const VIOLET = "#a996e6";
