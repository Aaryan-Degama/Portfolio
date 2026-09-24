import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// The hero's bottom edge bows upward as you scroll into About. Nothing is
// drawn: the hero itself is clipped along the curve, so the slate gradient
// behind the page shows through the bulge.
export default function ScrollSvg() {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const scrollContainer = document.querySelector(".hide-scrollbar");
    const hero = document.getElementById("hero");

    // Same curve as the reference's svg divider (viewBox units, rest line
    // y=50, 160px tall for 180 units): the control point climbs 50 -> -70.
    const curve = { cY: 50 };
    const clip = () => {
      if (!hero) return;
      const w = hero.offsetWidth, h = hero.offsetHeight;
      const y = h - (50 - curve.cY) * (160 / 180);
      hero.style.clipPath = `path("M 0 0 H ${w} V ${h} Q ${w / 2} ${y} 0 ${h} Z")`;
    };

    const tween = gsap.to(curve, {
      cY: -70,
      ease: "none",
      scrollTrigger: {
        trigger: wrapperRef.current,
        scroller: scrollContainer || window,
        start: "top bottom",
        // Ends where the old svg divider did (its top sat 115px higher).
        end: "top-=115 center",
        scrub: true,
      },
      onUpdate: clip,
    });
    window.addEventListener("resize", clip);

    // Kill the tween and its ScrollTrigger on unmount; otherwise a later
    // ScrollTrigger.refresh() on another page fires onUpdate on a dead node.
    return () => {
      window.removeEventListener("resize", clip);
      tween.scrollTrigger?.kill();
      tween.kill();
      if (hero) hero.style.clipPath = "";
    };
  }, []);

  // Spacer where the old svg ran on below the hero, keeping About's layout.
  return <div ref={wrapperRef} aria-hidden="true" className="h-[45px]" />;
}
