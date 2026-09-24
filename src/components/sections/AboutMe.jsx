// About.jsx
import React from "react";
import MarqueeGSAP from "../effects/FrameworkMarquee.jsx";
import ScrollSvg from "../effects/ScrollCurveDivider.jsx";
import NeonMark from "../effects/NeonMark.jsx";
import { NEON } from "../../theme/palette";

export default function About() {
  return (
    <section id="about" className="w-full text-snow bg-black home-sheet">

      <ScrollSvg />
      
      {/* Top text */}
      <div className="flex items-center justify-center py-20 min-h-fit sm:min-h-screen sm:py-12 md:py-0">
        <div className="max-w-2xl px-4 space-y-6 text-center sm:space-y-14 sm:px-6 sm:max-w-7xl">
          <p className="text-sm font-medium leading-snug text-snow sm:text-2xl md:text-4xl lg:text-4xl sm:leading-relaxed">
            I'm Aaryan, a developer drawn to <NeonMark color={NEON.magenta}>systems programming</NeonMark>,{" "}
            <NeonMark color={NEON.cyan}>computer vision</NeonMark> and{" "}
            <NeonMark color={NEON.ember}>ML that runs on the device</NeonMark> instead of someone else's server.
          </p>
          <p className="text-xs font-light leading-relaxed text-ash sm:text-lg md:text-2xl lg:text-3xl sm:leading-relaxed">
            I'm a third-year B.Tech IT student at IIIT Allahabad. I'd rather understand a model down to its tensors than trust a black box, so I build things from first principles: a C++ search engine for a phone, a vision toolkit without OpenCV. Off the clock I do competitive programming on Codeforces.
          </p>
        </div>
      </div>
      <div id="skills">
        <p className="flex justify-center mb-8 text-xs font-light sm:mb-12 sm:text-lg md:text-2xl lg:text-3xl">Languages, Frameworks & Tools I am familiar with ...</p>
        <MarqueeGSAP />
      </div>
    </section>
  );
}
