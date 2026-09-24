import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { categories, projectsIn } from "../../data/projectIndex";
import { BONE } from "../../theme/palette";
import { FOCUS, NeonTube } from "../project/ProjectKit";

// A piece of the project pages' dark room, set into the home page's cream
// sheet. The category's colour is the gradient of its projects' neons.
export default function ProjectCard({ categoryKey }) {
  const category = categories[categoryKey];
  const neons = projectsIn(categoryKey).map((p) => p.neon);
  const tubeColors = neons.length > 1 ? neons : [neons[0] ?? BONE, BONE];
  const trim = `linear-gradient(90deg, ${tubeColors.join(", ")})`;

  // The home page scrolls inside its own container, so watch visibility
  // with an IntersectionObserver rather than a window ScrollTrigger. The
  // tube mounts (and draws itself) the first time the card is seen.
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.45 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <Link
      ref={ref}
      to={category.path}
      style={{ "--neon": tubeColors[0] }}
      className={`group relative flex min-h-[26rem] flex-col justify-between overflow-hidden rounded-[18px] bg-snow p-8 font-inter text-void transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_40px_90px_-40px_var(--neon)] sm:p-10 ${FOCUS}`}
    >
      <span
        aria-hidden="true"
        style={{ backgroundImage: trim }}
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 shadow-[0_0_14px_var(--neon)] transition-transform duration-700 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />

      <span
        aria-hidden="true"
        className="absolute right-8 top-7 font-display text-3xl leading-none text-dust transition-all duration-500 group-hover:translate-x-1 group-hover:text-[color:var(--neon)] sm:right-10 sm:top-9"
      >
        →
      </span>

      <h3 className="relative mt-6 font-display text-[clamp(2rem,4.4vw,3.9rem)] leading-[0.88] tracking-[-0.02em] transition-transform duration-500 group-hover:translate-x-3">
        {category.lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
        {seen && <NeonTube colors={tubeColors} variant="low" delay={0.15} />}
      </h3>

      <p className="mt-12 max-w-[46ch] text-base leading-7 text-umber">{category.intro}</p>
    </Link>
  );
}
