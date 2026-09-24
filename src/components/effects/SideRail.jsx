import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import logo from "../../assets/images/logo-light.svg";
import github from "../../assets/images/github.png";
import linkedin from "../../assets/images/linkedIn.png";
import whatsapp from "../../assets/images/Whatsapp.png";

// The home page's left rail: logo, a vertical bar, the social icons. The
// logo and the bar's top end never move. As the page scrolls the bar
// shortens from the bottom and the icons ride up with it; once the bar is
// gone, each icon rises into the logo and shatters on contact, GitHub
// first. It all plays out within the first 70% of the hero's height, so the
// icons outrun the dark sections rising from below and never cross into
// them (owner's call). Scrubbed, so scrolling back up
// rebuilds everything. mix-blend-difference keeps the cream rail visible
// over the cream sections.

const SOCIALS = [
  { href: "https://github.com/Aaryan-Degama", src: github, alt: "GitHub" },
  { href: "https://linkedin.com/in/aaryandegama", src: linkedin, alt: "LinkedIn" },
  { href: "https://wa.me/918320894345", src: whatsapp, alt: "WhatsApp" },
];

// Shards: a jittered 3x3 grid, each cell cut into two triangles. Seeded so
// the break pattern is the same on every visit.
function makeShards(n = 3, seed = 7) {
  let s = seed;
  const rand = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  const pts = [];
  for (let r = 0; r <= n; r++) {
    pts.push([]);
    for (let c = 0; c <= n; c++) {
      const edge = r === 0 || c === 0 || r === n || c === n;
      const j = edge ? 0 : (rand() - 0.5) * (60 / n);
      pts[r].push([(c / n) * 100 + j, (r / n) * 100 + j * 0.7]);
    }
  }
  const shards = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const [a, b, d, e] = [pts[r][c], pts[r][c + 1], pts[r + 1][c + 1], pts[r + 1][c]];
      for (const tri of [[a, b, d], [a, d, e]]) {
        const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3 - 50;
        const cy = (tri[0][1] + tri[1][1] + tri[2][1]) / 3 - 50;
        const len = Math.hypot(cx, cy) || 1;
        const dist = 30 + rand() * 45;
        shards.push({
          poly: tri.map(([x, y]) => `${x}% ${y}%`).join(","),
          x: (cx / len) * dist,
          y: (cy / len) * dist + 25 + rand() * 20, // a little gravity
          rotation: (rand() - 0.5) * 360,
        });
      }
    }
  }
  return shards;
}
const SHARDS = makeShards();

export default function SideRail({ scrollerRef }) {
  const railRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const rail = railRef.current;
    const scroller = scrollerRef.current;

    const ctx = gsap.context(() => {
      const logoImg = rail.querySelector("[data-logo]");
      const track = rail.querySelector("[data-track]");
      const group = rail.querySelector("[data-group]");
      const icons = gsap.utils.toArray("[data-icon]");
      // Re-measured on every refresh (resize). An icon's offsetTop changes
      // reference once the group is transformed, so measure it against the
      // group with rects (both move together) and the group by layout.
      const barLength = () => -track.offsetHeight;
      const touchLogo = (el) => () => {
        const inGroup = el.getBoundingClientRect().top - group.getBoundingClientRect().top;
        return -(group.offsetTop + inGroup - (logoImg.offsetTop + logoImg.offsetHeight) - 4);
      };

      const tl = gsap.timeline({ defaults: { ease: "none" } });
      // First half: the bar shortens, the icons follow its end.
      tl.fromTo("[data-line]", { scaleY: 1 }, { scaleY: 0, duration: 0.5 }, 0)
        .fromTo("[data-group]", { y: 0 }, { y: barLength, duration: 0.5 }, 0)
        .to("[data-dot]", { opacity: 0, duration: 0.03 }, 0.5);

      // Then each icon rises into the logo, squashes on contact and breaks.
      const hits = [0.62, 0.78, 0.94];
      icons.forEach((icon, i) => {
        const t = hits[i];
        const from = i === 0 ? 0.5 : hits[i - 1] + 0.02;
        const whole = icon.querySelector("[data-whole]");
        const shards = icon.querySelectorAll("[data-shard]");
        tl.to("[data-group]", { y: touchLogo(icon), duration: t - from }, from)
          .to(whole, { scaleX: 1.12, scaleY: 0.82, duration: 0.015 }, t)
          .set(whole, { opacity: 0 }, t + 0.015)
          .fromTo(
            shards,
            { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 },
            {
              x: (k) => SHARDS[k].x,
              y: (k) => SHARDS[k].y,
              rotation: (k) => SHARDS[k].rotation,
              scale: 0.5,
              opacity: 0,
              duration: 0.05,
              ease: "power2.out",
            },
            t + 0.015
          )
          .set(icon, { visibility: "hidden" }, t + 0.065);
      });
      tl.set({}, {}, 1);

      ScrollTrigger.create({
        animation: tl,
        scroller,
        start: 0,
        end: () => document.getElementById("hero").offsetHeight * 0.7,
        scrub: 0.6,
        invalidateOnRefresh: true,
      });
    }, rail);
    return () => ctx.revert();
  }, [scrollerRef]);

  return (
    <aside
      ref={railRef}
      aria-label="Links"
      className="fixed z-20 flex flex-col items-center w-14 pointer-events-none top-4 bottom-8 left-4 mix-blend-difference"
    >
      {/* Logo size and position are mirrored by HERO_LOGO in LoadingPage.jsx. */}
      <a href="#hero" className="p-2 pointer-events-auto">
        <img data-logo src={logo} alt="Aaryan Degama, back to top" className="w-[52px] h-[52px] max-w-none" />
      </a>

      <span data-dot aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#fffce1]" />
      <div data-track className="relative flex-1 w-full">
        <span data-line aria-hidden="true" className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 origin-top bg-[#fffce1]" />
      </div>

      <div data-group className="flex flex-col items-center gap-5 sm:gap-8">
        <span data-dot aria-hidden="true" className="-mb-2 h-1.5 w-1.5 rounded-full bg-[#fffce1] sm:-mb-5" />
        {SOCIALS.map((s) => (
          <a
            key={s.alt}
            data-icon
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex justify-center pointer-events-auto"
          >
            <img data-whole src={s.src} alt={s.alt} className="w-10 h-10 transition-transform duration-300 hover:scale-110" />
            {SHARDS.map((shard) => (
              <img
                key={shard.poly}
                data-shard
                src={s.src}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-10 h-10 mx-auto opacity-0"
                style={{ clipPath: `polygon(${shard.poly})` }}
              />
            ))}
          </a>
        ))}
      </div>
    </aside>
  );
}
