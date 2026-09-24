import React from "react";
import { Link } from "react-router-dom";
import { categories, projectsIn } from "../../data/projectIndex";
import { BONE } from "../../theme/palette";
import { FOCUS } from "../project/ProjectKit";
import GrainGradient from "../effects/GrainGradient";

// A tile of the hero's white silk set into the home page's slate. bg-snow
// shows if WebGL2 is missing. The category's first neon lights the glow and
// arrow on hover.
export default function ProjectCard({ categoryKey }) {
  const category = categories[categoryKey];
  const neon = projectsIn(categoryKey)[0]?.neon ?? BONE;

  return (
    <Link
      to={category.path}
      style={{ "--neon": neon }}
      className={`group relative isolate flex min-h-[26rem] flex-col justify-between overflow-hidden rounded-[18px] bg-snow p-8 font-inter text-void transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_40px_90px_-40px_var(--neon)] sm:p-10 ${FOCUS}`}
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <GrainGradient />
        {/* Lift toward white, as LiquidMass does: the deep folds alone read murky at card size. */}
        <div className="absolute inset-0 bg-snow/30" />
      </div>

      <span
        aria-hidden="true"
        className="absolute right-8 top-7 font-display text-3xl leading-none text-umber transition-all duration-500 group-hover:translate-x-1 group-hover:text-[color:var(--neon)] sm:right-10 sm:top-9"
      >
        →
      </span>

      <h3 className="relative mt-6 font-display text-[clamp(2rem,4.4vw,3.9rem)] leading-[0.88] tracking-[-0.02em] transition-transform duration-500 group-hover:translate-x-3">
        {category.lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h3>

      <p className="mt-12 max-w-[46ch] text-base leading-7 text-umber">{category.intro}</p>
    </Link>
  );
}
