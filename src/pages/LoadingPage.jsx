import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import logo from "../assets/images/logo-light.svg";

// Splash in the manner of itssharl.ee: a grainy slate screen, a small mark
// that assembles itself, one line of caption sliding out of a mask, credits
// at the foot. Here the mark is the AD monogram, drawn connect-the-dots
// style before the brush version takes over. On the home page the mark then
// flies into the hero's top-left logo slot.

// Dots on the monogram's skeleton, in the logo's own 72x72 frame.
const DOTS = [
  [16.3, 46.8], // A, left foot
  [30.7, 9.1], // apex
  [33.6, 57.1], // stem foot
  [45.6, 10.8], // bowl
  [55.7, 28.8],
  [51.6, 51.6],
  [39.6, 59.5],
  [12, 31.9], // crossbar
  [42, 24],
];
const pt = (i) => DOTS[i].join(",");
const STROKES = [
  `M${pt(0)} L${pt(1)} L${pt(2)}`,
  `M${pt(1)} L${pt(3)} L${pt(4)} L${pt(5)} L${pt(6)} L${pt(2)}`,
  `M${pt(7)} L${pt(8)}`,
];

// Where SideRail.jsx puts its logo: top-4 left-4, p-2, w-11 h-11.
const HERO_LOGO = { x: 24, y: 24, size: 44 };

const LoadingPage = ({ onReveal, onDone }) => {
  const rootRef = useRef(null);
  const markRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: onDone });

      if (reduced) {
        gsap.set("[data-dot], [data-stroke]", { opacity: 0 });
        tl.set("[data-slide]", { yPercent: 0 })
          .set("[data-brush]", { opacity: 1 })
          .add(onReveal, "+=1.2")
          .to(rootRef.current, { opacity: 0, duration: 0.4 });
        return;
      }

      tl.fromTo("[data-slide]", { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: "power3.out", stagger: 0.1 }, 0.2)
        .fromTo(
          "[data-dot]",
          { scale: 0, transformOrigin: "center", transformBox: "fill-box" },
          { scale: 1, duration: 0.35, ease: "back.out(3)", stagger: 0.1 },
          0.4
        )
        .fromTo("[data-stroke]", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.45, ease: "power1.inOut", stagger: 0.4 }, "-=0.1")
        .to("[data-brush]", { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }, "+=0.15")
        .to("[data-dot], [data-stroke]", { opacity: 0, duration: 0.4 }, "<")
        .to("[data-slide]", { yPercent: -110, duration: 0.6, ease: "power3.in", stagger: 0.05 }, "+=0.5")
        .add(onReveal);

      if (pathname === "/") {
        const box = markRef.current.getBoundingClientRect();
        tl.to(
          markRef.current,
          {
            x: HERO_LOGO.x + HERO_LOGO.size / 2 - (box.left + box.width / 2),
            y: HERO_LOGO.y + HERO_LOGO.size / 2 - (box.top + box.height / 2),
            scale: HERO_LOGO.size / box.width,
            duration: 1,
            ease: "expo.inOut",
          },
          "<"
        )
          .to("[data-ground]", { opacity: 0, duration: 0.6 }, "-=0.5")
          .to(markRef.current, { opacity: 0, duration: 0.2 });
      } else {
        tl.to(rootRef.current, { opacity: 0, duration: 0.6 }, "<");
      }
    }, rootRef);
    return () => ctx.revert();
    // Runs once; the callbacks come from App's state setters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={rootRef} className="fixed inset-0 z-[9998] font-inter text-[#f3f2f9]" role="status" aria-label="Connecting the dots">
      <div data-ground className="absolute inset-0 overflow-hidden bg-[#2b2b33]">
        <div className="grain" aria-hidden="true" />
      </div>

      <div className="relative flex flex-col items-center justify-center h-full gap-6">
        <div ref={markRef} className="relative w-16 h-16">
          <svg viewBox="0 0 72 72" className="absolute inset-0 w-full h-full overflow-visible" aria-hidden="true">
            {STROKES.map((d) => (
              <path
                key={d}
                data-stroke
                d={d}
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset="1"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {DOTS.map(([cx, cy]) => (
              <circle key={`${cx}-${cy}`} data-dot cx={cx} cy={cy} r="2.6" fill="currentColor" />
            ))}
          </svg>
          <img data-brush src={logo} alt="" className="absolute inset-0 w-full h-full scale-90 opacity-0" />
        </div>

        <div className="overflow-hidden">
          <p data-slide className="text-base font-medium tracking-tight">
            Connecting the dots...
          </p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex justify-center pb-6 overflow-hidden">
        <p data-slide className="text-xs sm:text-sm text-[#f3f2f9]/80">
          Designed and coded by Aaryan Degama © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default LoadingPage;
