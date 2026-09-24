import React from "react";

// A glowing underline from the hero's tube palette, for marking a phrase on
// the cream sections. Lime is too faint on cream; prefer magenta, cyan, ember.
export default function NeonMark({ color, children }) {
  return (
    <span className="relative inline whitespace-nowrap">
      {children}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-0.5 h-[3px] rounded-full"
        style={{ background: color, boxShadow: `0 0 12px ${color}, 0 0 2px ${color}` }}
      />
    </span>
  );
}
