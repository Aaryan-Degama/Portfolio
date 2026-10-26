// About.jsx
import React from "react";
import ScrollSvg from "../effects/ScrollCurveDivider.jsx";
import NeonMark from "../effects/NeonMark.jsx";
import { NEON } from "../../theme/palette";

export default function About() {
  return (
    <section id="about" className="w-full text-snow home-sheet">

      <ScrollSvg />
      
      {/* Top text */}
      <div className="flex items-center justify-center py-20 min-h-fit sm:min-h-screen sm:py-12 md:py-0">
        <div className="max-w-2xl px-4 space-y-6 text-center sm:space-y-14 sm:px-6 sm:max-w-7xl lg:max-w-[96rem] lg:px-16">
          <p className="text-sm font-medium leading-snug text-snow sm:text-2xl md:text-4xl lg:text-[2.6rem] lg:leading-[1.2] sm:leading-relaxed">
            I'm Aaryan, a developer drawn to <NeonMark color={NEON.magenta}>information retrieval</NeonMark> and{" "}
            <NeonMark color={NEON.cyan}>low-level systems</NeonMark>.
          </p>
          <p className="text-xs font-light leading-relaxed text-ash sm:text-lg md:text-2xl lg:text-[1.8rem] lg:leading-[1.5] sm:leading-relaxed">
            I'm a third-year B.Tech IT student at IIIT Allahabad. I'd rather understand a model down to its tensors than trust a black box, so I build things from first principles: a C++ search engine for a phone, a vision toolkit without OpenCV. Off the clock I do competitive programming on Codeforces.
          </p>
        </div>
      </div>
    </section>
  );
}
