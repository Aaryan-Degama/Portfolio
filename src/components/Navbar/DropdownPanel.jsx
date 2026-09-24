import React from "react";
import gsap from "gsap";

const DropdownPanel = ({
  showWhiteRect,
  hoverIndex,
  navItems,
  dropdownRefs,
}) => {
  const handleDropdownMouseEnter = (parentIndex, index) => {
    const el = dropdownRefs.current[parentIndex][index];
    if (!el) return;

    const underline = el.querySelector("span");
    if (underline)
      gsap.to(underline, { width: "100%", duration: 0.1, ease: "power2.out" });
  };

  const handleDropdownMouseLeave = (parentIndex, index) => {
    const el = dropdownRefs.current[parentIndex][index];
    if (!el) return;

    const underline = el.querySelector("span");
    if (underline)
      gsap.to(underline, { width: "0%", duration: 0.3, ease: "power2.out" });
  };

  return (
    <div
      className={`absolute top-0 left-0 w-full h-[60vh] bg-[#fcfaf0] transition-opacity duration-300 z-10 pointer-events-auto ${
        showWhiteRect ? "opacity-100" : "opacity-0"
      }`}
      style={{ pointerEvents: showWhiteRect ? "auto" : "none" }}
    >
      <div className="flex h-full pt-16 pointer-events-auto">
        {/* Left Area */}
        <div className="flex flex-col items-start justify-start w-1/2 pt-12 pb-8 pr-8 border border-gray-300 pl-72">
          {hoverIndex !== null && navItems[hoverIndex].dropdown ? (
            <>
              <p className="mb-1 text-xs font-normal text-gray-800">
                {navItems[hoverIndex].name}
              </p>
              <ul className="space-y-2">
                {navItems[hoverIndex].dropdown.map((dropItem, dropIndex) => (
                  <li key={dropIndex}>
                    <a
                      href={dropItem.href}
                      ref={(el) =>
                        (dropdownRefs.current[hoverIndex][dropIndex] = el)
                      }
                      className="relative text-xl font-semibold text-left text-black transition-colors duration-200"
                      onMouseEnter={() =>
                        handleDropdownMouseEnter(hoverIndex, dropIndex)
                      }
                      onMouseLeave={() =>
                        handleDropdownMouseLeave(hoverIndex, dropIndex)
                      }
                    >
                      {dropItem.name}
                      <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-black transition-all duration-500"></span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-gray-400">No menu available</p>
          )}
        </div>

        {/* Right Area */}
        <div className="flex items-start justify-start w-1/2 pt-12 pl-16 pr-56 border border-gray-300">
          {hoverIndex !== null && navItems[hoverIndex].description ? (
            <p className="font-normal text-black">
              {navItems[hoverIndex].description}
            </p>
          ) : (
            <p className="text-gray-400">No description available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DropdownPanel;
