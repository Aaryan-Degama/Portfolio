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
        start: "top bottom",
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
    <div ref={wrapperRef} className="w-full overflow-hidden">
      <svg
        className="w-screen h-40"
        viewBox="0 -80 100 180" 
        preserveAspectRatio="none"
      >
        {/* background */}
        <rect x="0" y="-80" width="100" height="180" fill="black" />

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
          fill="#fcfaf0"
        />
      </svg>
    </div>
  );
}
