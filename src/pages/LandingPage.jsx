import React, { useRef } from "react";
import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/sections/Hero";
import About from "../components/sections/AboutMe";
import FeaturedProjects from "../components/sections/MyProjects";
import Contacts from "../components/sections/Contact";
import SideRail from "../components/effects/SideRail";
import GrainGradient from "../components/effects/GrainGradient";

const LandingPage = () => {
  const scrollerRef = useRef(null);

  return (
    <div className="flex flex-col h-screen bg-black">
      <Navbar />
      <SideRail scrollerRef={scrollerRef} />
      {/* isolate: the dark gradient's negative z stays inside the scroller */}
      <div ref={scrollerRef} className="flex-1 overflow-y-auto hide-scrollbar isolate">
        {/* One viewport-sized slate gradient behind the whole page: sticky,
            takes no space, shows through the hero's clipped curve and every
            section below it. Paused while the hero covers the screen. */}
        <div aria-hidden="true" className="sticky top-0 h-screen -mb-[100vh] -z-10">
          <GrainGradient tone="dark" coveredBy="#hero" />
        </div>
        <Hero />
        <About />
        <FeaturedProjects />
        <Contacts />
      </div>
    </div>
  );
};

export default LandingPage;