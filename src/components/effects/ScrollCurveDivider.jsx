import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollSvg() {
  const pathRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const scrollContainer = document.querySelector(".hide-scrollbar");

    const curve = { cY: 50 };

    const tween = gsap.to(curve, {
      cY: -70,
      ease: "none",
      scrollTrigger: {
        trigger: wrapperRef.current,
        scroller: scrollContainer || window,
        // Start once the black rest line (not the transparent top) hits the
        // viewport bottom, so the curve is flat on load.
        start: "top+=115 bottom",
        end: "top center",
        scrub: true,
      },
      onUpdate: () => {
        pathRef.current?.setAttribute(
          "d",
          `
            M 0 50
            Q 50 ${curve.cY} 100 50
            L 100 100
            L 0 100
            Z
          `
        );
      },
    });

    // Kill the tween and its ScrollTrigger on unmount; otherwise a later
    // ScrollTrigger.refresh() on another page fires onUpdate on a dead node.
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    // Transparent above the curve and pulled up over the hero by 115px, which
    // is where the black starts inside the 160px svg (y=50 of -80..100). At
    // rest the black sits exactly at the hero's bottom edge and rises out of
    // the gradient on scroll. relative: paint above the positioned hero.
    <div ref={wrapperRef} className="relative -mt-[115px] w-full overflow-hidden">
      <svg
        className="w-screen h-40"
        viewBox="0 -80 100 180" 
        preserveAspectRatio="none"
      >
        {/* animated curve */}
        <path
          ref={pathRef}
          d="
            M 0 50
            Q 50 50 100 50
            L 100 100
            L 0 100
            Z
          "
          fill="black"
        />
      </svg>
    </div>
  );
}
