import { useState, useRef } from "react";
import NavItem from "./NavItem";
import DropdownPanel from "./DropdownPanel";

const navItems = [
  { name: "Home", href: "#hero" },

  {
    name: "Projects",
    href: "#projects",
    dropdown: [
      { name: "On-Device ML", href: "/projects/on-device-ml" },
      { name: "Shipped Systems", href: "/projects/shipped-systems" },
    ],
    description:
      "Search and vision models running on the device itself, and a system with real users.",
  },

  {
    name: "About",
    href: "#about",
    dropdown: [
      { name: "Background", href: "#about" },
      { name: "Skills", href: "#skills" },
      { name: "Codeforces", href: "https://codeforces.com/profile/Aaryan_Degama" },
      { name: "Resume", href: "/resume.pdf" },
    ],
    description: "Third-year B.Tech IT at IIIT Allahabad. I work on systems programming, computer vision and on-device ML.",
  },

  {
    name: "Contact",
    href: "#contact",
    dropdown: [
      { name: "+91 83208 94345", href: "tel:+918320894345" },
      { name: "aaryandegama@gmail.com", href: "mailto:aaryandegama@gmail.com" },
      { name: "linkedin.com/in/aaryandegama", href: "https://linkedin.com/in/aaryandegama" },
      { name: "github.com/Aaryan-Degama", href: "https://github.com/Aaryan-Degama" },
    ],
    description:
      "Get in touch by email, phone, LinkedIn or GitHub.",
  },
];

export default function Navbar() {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [showWhiteRect, setShowWhiteRect] = useState(false);

  const itemRefs = useRef([]);
  const dropdownRefs = useRef(navItems.map(() => []));

  const handleContainerMouseLeave = () => setShowWhiteRect(false);

  const handleItemClick = (index) => {
    // Only show dropdown if the item has dropdown items
    if (navItems[index].dropdown && navItems[index].dropdown.length > 0) {
      setHoverIndex(index);
      setShowWhiteRect(true);
    }
  };

  return (
    <div
      className="absolute top-0 left-0 w-full"
      onMouseLeave={handleContainerMouseLeave}
    >
      {/* Dropdown */}
      {showWhiteRect && (
        <DropdownPanel
          showWhiteRect={showWhiteRect}
          hoverIndex={hoverIndex}
          navItems={navItems}
          dropdownRefs={dropdownRefs}
        />
      )}

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-center w-full h-16 bg-transparent">
        <div className="flex justify-center flex-1">
          {navItems.map((item, index) => (
            <NavItem
              key={index}
              item={item}
              index={index}
              showWhiteRect={showWhiteRect}
              onMouseEnter={setHoverIndex}
              onMouseLeave={() => {}}
              onClick={handleItemClick}
              registerRef={itemRefs}
            />
          ))}
        </div>
      </nav>
    </div>
  );
}
