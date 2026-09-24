import React from "react";
import gsap from "gsap";

const NavItem = ({
  item,
  index,
  showWhiteRect,
  onMouseEnter,
  onMouseLeave,
  onClick,
  registerRef,
}) => {
  const handleEnter = () => {
    onMouseEnter(index);
    if (registerRef.current[index]) {
      gsap.to(registerRef.current[index], {
        scale: 1.1,
        duration: 0.1,
        ease: "power2.out",
      });
    }
  };

  const handleLeave = () => {
    if (registerRef.current[index]) {
      gsap.to(registerRef.current[index], {
        scale: 1.0,
        duration: 0.1,
        ease: "power2.out",
      });
    }
    onMouseLeave(index);
  };

  return (
    <a
      href={item.href}
      ref={(el) => (registerRef.current[index] = el)}
      className={`px-8 text-base cursor-pointer transition-colors group duration-300 relative outline-none ${
        showWhiteRect ? "text-snow hover:text-white" : "text-gray hover:text-gray-200"
      }`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={() => onClick(index)}
    >
      <span className="relative">
        {item.name}
        <span
          className="absolute left-0 bottom-0 w-0 h-[2px] rounded-full transition-all duration-500 ease-out group-hover:w-full"
          style={{
            background: "linear-gradient(90deg, #f967fb, #83f36e, #60aed5, #fe8a2e)",
            boxShadow: "0 0 10px rgba(249, 103, 251, 0.7)",
          }}
        ></span>
      </span>
    </a>
  );
};

export default NavItem;
