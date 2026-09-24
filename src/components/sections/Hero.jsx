import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import GrainGradient from "../effects/GrainGradient";

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
    <section ref={ref} id="hero" className="relative w-full h-screen bg-white text-void font-inter flex items-center justify-center">
      <GrainGradient />
      {/* relative: keeps the text above the gradient canvas */}
      <div className="relative">
        <div className="flex items-center justify-center w-full">
          <h1 id="name-container" className="text-[#47474e] font-display font-medium text-[clamp(3.2rem,9.2vw,9.75rem)] leading-[1] tracking-[-0.035em] whitespace-nowrap">
            Aaryan Degama
          </h1>
        </div>

        <div className="flex items-center justify-center text-center text-xl text-[#47474e] mt-4">
          <p id="subtitle" className="opacity-0 w-[45dvw] mx-8 font-normal tracking-wide leading-relaxed">
            On-Device ML
          </p>
        </div>
      </div>

    </section>
  );
};

export default Hero;
