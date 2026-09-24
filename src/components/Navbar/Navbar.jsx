import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import NavItem from "./NavItem";

const navItems = [
  { name: "Home", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

// Displacement map for the glass lens: red encodes x, green y, neutral grey
// in the middle, so only the rim bends what's behind it.
const LENS_MAP =
  "data:image/svg+xml," +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40">
  <defs>
    <linearGradient id="r" x1="0" x2="1"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#f00"/></linearGradient>
    <linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#0f0"/></linearGradient>
    <filter id="b"><feGaussianBlur stdDeviation="4"/></filter>
  </defs>
  <rect width="120" height="40" fill="#000"/>
  <rect width="120" height="40" fill="url(#r)"/>
  <rect width="120" height="40" fill="url(#g)" style="mix-blend-mode:screen"/>
  <rect x="7" y="7" width="106" height="26" rx="13" fill="#808000" filter="url(#b)"/>
</svg>`);

// backdrop-filter: url() only works in Chromium; navigator.userAgentData is
// Chromium-only, so it gates the refraction.
const REFRACT = typeof navigator !== "undefined" && !!navigator.userAgentData;
const REDUCED = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Plain links, no dropdown (owner removed it). One shared glass capsule
// marks where you are: it sits on the section you're reading (none on
// Home) and follows the hovered link, gliding between items like iOS's tab
// bar: it stretches to reach the next item, thins a little while it
// travels, then snaps onto it with a jelly settle.
export default function Navbar({ scrollerRef }) {
  const pillRef = useRef(null);
  const itemRefs = useRef([]);
  const shown = useRef(false);
  const [active, setActive] = useState(0); // section in view, index into navItems
  const [hovered, setHovered] = useState(null);
  const [dark, setDark] = useState(false); // nav is over the dark sections

  // Scroll spy: the active section is the last one whose top has passed 45%
  // of the viewport; at the very bottom it's the last one (Contact is short).
  useEffect(() => {
    const scroller = scrollerRef.current;
    const sections = navItems.map((it) => document.querySelector(it.href));
    const onScroll = () => {
      const line = scroller.clientHeight * 0.45;
      let i = 0;
      sections.forEach((sec, k) => {
        if (sec && sec.getBoundingClientRect().top <= line) i = k;
      });
      if (scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2) i = navItems.length - 1;
      setActive(i);
      setDark(sections[0].getBoundingClientRect().bottom < 40);
    };
    onScroll();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [scrollerRef]);

  const moveTo = (i) => {
    const pill = pillRef.current;
    const el = itemRefs.current[i];
    const to = { x: el.offsetLeft, y: el.offsetTop, width: el.offsetWidth, height: el.offsetHeight };
    gsap.killTweensOf(pill);

    if (!shown.current || REDUCED) {
      shown.current = true;
      gsap.set(pill, { ...to, scaleY: 1 });
      gsap.fromTo(pill, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: REDUCED ? 0 : 0.35, ease: "back.out(2)" });
      return;
    }

    const x = gsap.getProperty(pill, "x");
    const w = gsap.getProperty(pill, "width");
    // Stretch: the far edge reaches the target first, the near edge stays.
    const reach = to.x > x ? { x, width: to.x + to.width - x } : { x: to.x, width: x + w - to.x };
    gsap.timeline()
      .to(pill, { ...reach, y: to.y, height: to.height, scaleY: 0.86, opacity: 1, scale: 1, duration: 0.16, ease: "power2.in" })
      .to(pill, { x: to.x, width: to.width, scaleY: 1, duration: 0.6, ease: "elastic.out(1, 0.55)" });
  };

  const hide = () => {
    if (!shown.current) return;
    shown.current = false;
    gsap.killTweensOf(pillRef.current);
    gsap.to(pillRef.current, { opacity: 0, scale: 0.85, duration: REDUCED ? 0 : 0.25, ease: "power2.out" });
  };

  // The hovered link wins; otherwise the section in view, except Home.
  const target = hovered ?? (active === 0 ? null : active);
  useEffect(() => {
    if (target === null) hide();
    else moveTo(target);
  }, [target]);

  // Keep the capsule on its item when the layout reflows.
  useEffect(() => {
    const onResize = () => {
      if (target === null) return;
      const el = itemRefs.current[target];
      gsap.set(pillRef.current, { x: el.offsetLeft, y: el.offsetTop, width: el.offsetWidth, height: el.offsetHeight });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [target]);

  return (
    <div className="absolute top-0 left-0 w-full" data-refract={REFRACT}>
      <svg aria-hidden="true" className="absolute w-0 h-0">
        <filter id="lg-refract" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feImage href={LENS_MAP} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />
          <feDisplacementMap in="SourceGraphic" in2="map" scale="18" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <nav className="relative z-20 flex items-center justify-center w-full h-16 bg-transparent">
        <div className="relative flex justify-center" onMouseLeave={() => setHovered(null)}>
          <span
            ref={pillRef}
            aria-hidden="true"
            className="liquid-glass absolute top-0 left-0 rounded-full opacity-0 pointer-events-none"
          />
          {navItems.map((item, i) => (
            <NavItem
              key={item.name}
              item={item}
              ref={(el) => (itemRefs.current[i] = el)}
              lit={i === target}
              dark={dark}
              current={i === active}
              onEnter={() => setHovered(i)}
              onBlur={() => setHovered(null)}
            />
          ))}
        </div>
      </nav>
    </div>
  );
}
