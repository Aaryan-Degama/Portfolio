import React from "react";

// A nav link. The glass capsule behind it lives in Navbar; this reports
// hover/focus and colours the label: the lit one goes black over the white
// hero, white over the dark sections.
const NavItem = ({ item, ref, lit, dark, current, onEnter, onBlur }) => {
  const tone = lit ? (dark ? "text-snow" : "text-void") : dark ? "text-ash" : "text-gray";
  return (
    <a
      href={item.href}
      ref={ref}
      aria-current={current ? "location" : undefined}
      className={`relative px-5 py-1.5 mx-3 text-lg cursor-pointer transition-colors duration-300 outline-none ${tone}`}
      onMouseEnter={onEnter}
      onFocus={onEnter}
      onBlur={onBlur}
    >
      {item.name}
    </a>
  );
};

export default NavItem;
