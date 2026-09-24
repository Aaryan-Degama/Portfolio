import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import logo from "../../assets/images/logo-light.svg";
import github from "../../assets/images/github.png";
import linkedin from "../../assets/images/linkedIn.png";
import whatsapp from "../../assets/images/Whatsapp.png";

// The home page's left rail: logo, a vertical line, the social icons. It
// stays fixed while the page scrolls. The line's head slides down and eats
// the line; when it reaches an icon, the icon shatters, then the next one,
// until the page ends. Scrubbed, so scrolling back up rebuilds everything.
// mix-blend-difference keeps the cream rail visible over the cream sections.

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
      const track = rail.querySelector("[data-track]");
      const icons = gsap.utils.toArray("[data-icon]");
      // Head positions, re-measured on every refresh (resize).
      const lineTop = () => track.offsetTop - 3;
      const lineEnd = () => track.offsetTop + track.offsetHeight - 3;
      // Icons' offsetParent is the rail itself (the icon column isn't positioned).
      const iconTop = (el) => () => el.offsetTop - 3;

      const tl = gsap.timeline({ defaults: { ease: "none" } });
      tl.fromTo("[data-head]", { y: lineTop }, { y: lineEnd, duration: 0.5 }, 0)
        .fromTo("[data-line]", { scaleY: 1 }, { scaleY: 0, duration: 0.5 }, 0)
        .to("[data-foot]", { opacity: 0, duration: 0.02 }, 0.48);

      // Head reaches each icon, the icon squashes on impact and breaks.
      const hits = [0.58, 0.74, 0.9];
      icons.forEach((icon, i) => {
        const t = hits[i];
        const from = i === 0 ? 0.5 : hits[i - 1] + 0.02;
        const whole = icon.querySelector("[data-whole]");
        const shards = icon.querySelectorAll("[data-shard]");
        tl.to("[data-head]", { y: iconTop(icon), duration: t - from }, from)
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
              duration: 0.08,
              ease: "power2.out",
            },
            t + 0.015
          )
          .set(icon, { visibility: "hidden" }, t + 0.095);
      });
      tl.to("[data-head]", { opacity: 0, duration: 0.05 }, 0.95);

      ScrollTrigger.create({
        animation: tl,
        scroller,
        start: 0,
        end: "max",
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
      className="fixed z-20 flex flex-col items-center w-12 pointer-events-none top-4 bottom-8 left-4 mix-blend-difference"
    >
      <a href="#hero" className="p-2 pointer-events-auto">
        <img src={logo} alt="Aaryan Degama, back to top" className="w-8 h-8" />
      </a>

      <div data-track className="relative flex-1 w-full my-3">
        <span data-line aria-hidden="true" className="absolute top-1.5 bottom-1.5 left-1/2 w-px -translate-x-1/2 origin-bottom bg-[#fffce1]" />
        <span data-foot aria-hidden="true" className="absolute bottom-0 left-1/2 -ml-[3px] h-1.5 w-1.5 rounded-full bg-[#fffce1]" />
      </div>

      {/* Moves through the rail; starts at the top of the line. */}
      <span data-head aria-hidden="true" className="absolute top-0 left-1/2 -ml-[3px] h-1.5 w-1.5 rounded-full bg-[#fffce1] motion-reduce:hidden" />

      <div className="flex flex-col gap-5 mt-3 sm:gap-8">
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
