import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import TubesCursor from "../effects/TubesCursor";

// The name is plain static type (owner: no per-letter animation). Only the
// subtitle fades in.
const Hero = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set("#subtitle", { opacity: 1 });
      return undefined;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo("#subtitle", { opacity: 0, y: 30 }, { opacity: 1, y: 0, ease: "power3.out", duration: 1.5, delay: 0.4 });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="hero" className="relative w-full h-screen bg-black text-[#fffce1] font-inter flex items-center justify-center">
      <TubesCursor />
      {/* relative: plain text would otherwise paint under the tubes canvas */}
      <div className="relative">
        <div className="flex items-center justify-center w-full">
          <h1 id="name-container" className="font-display font-medium text-[clamp(3.2rem,9.2vw,9.75rem)] leading-[1] tracking-[-0.035em] whitespace-nowrap shadow-2xl">
            Aaryan Degama
          </h1>
        </div>

        <div className="flex items-center justify-center text-center text-xl text-[#fffce1] mt-4 shadow-2xl">
          <p id="subtitle" className="opacity-0 w-[45dvw] mx-8 font-light tracking-wide leading-relaxed">
            Systems Programming • On-Device ML
          </p>
        </div>
      </div>

    </section>
  );
};

export default Hero;
