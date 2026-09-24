import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { categories, notes, projectsIn } from "../../data/projectIndex";
import { BONE } from "../../theme/palette";
import { ExternalLink, FOCUS, NeonTube, PageShell } from "./ProjectKit";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function RowTrim() {
  return (
    <span
      aria-hidden="true"
      className="absolute -top-px left-0 h-px w-full origin-left scale-x-0 bg-[var(--row)] shadow-[0_0_14px_var(--row)] transition-transform duration-700 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 group-open:scale-x-100"
    />
  );
}

function Stack({ items }) {
  return (
    <p className="font-code text-[11px] uppercase tracking-[0.18em] text-dust">{items.join(" · ")}</p>
  );
}

const ROW =
  "group relative grid gap-4 border-t border-paper/10 py-10 lg:grid-cols-[minmax(0,1fr)_24rem_2.5rem] lg:items-center lg:gap-12";
const NAME_BASE =
  "font-display leading-[0.9] text-paper transition-[color,transform] duration-500 group-hover:translate-x-3 group-hover:text-[color:var(--row)]";
// Projects with their own page get the full size; notes sit one step down.
const NAME = `${NAME_BASE} text-5xl sm:text-6xl lg:text-7xl`;
const NOTE_NAME = `${NAME_BASE} text-3xl sm:text-4xl lg:text-5xl`;

function ProjectRow({ project }) {
  return (
    <li>
      <Link to={`/projects/${project.slug}`} style={{ "--row": project.neon }} className={`${ROW} ${FOCUS}`}>
        <RowTrim />
        <span className={NAME}>{project.name}</span>
        <span className="space-y-3">
          <span className="block text-base leading-7 text-bone">{project.summary}</span>
          <Stack items={project.stack} />
        </span>
        <span
          aria-hidden="true"
          className="hidden font-display text-4xl text-dust transition-all duration-500 group-hover:translate-x-1 group-hover:text-[color:var(--row)] lg:block"
        >
          →
        </span>
      </Link>
    </li>
  );
}

function NoteRow({ note }) {
  return (
    <li>
      <details style={{ "--row": BONE }} className="group relative">
        <summary className={`${ROW} cursor-pointer list-none [&::-webkit-details-marker]:hidden ${FOCUS}`}>
          <RowTrim />
          <span className={NOTE_NAME}>{note.name}</span>
          <span className="space-y-3">
            <span className="block text-base leading-7 text-bone">{note.summary}</span>
            <Stack items={note.stack} />
          </span>
          <span
            aria-hidden="true"
            className="hidden font-display text-4xl text-dust transition-transform duration-500 group-open:rotate-45 lg:block"
          >
            +
          </span>
        </summary>
        <div className="grid gap-8 pb-12 lg:grid-cols-[minmax(0,1fr)_24rem_2.5rem] lg:gap-12">
          <p className="max-w-[60ch] text-base leading-7 text-bone lg:col-start-2 lg:col-span-2 lg:max-w-none">
            {note.detail}
          </p>
          {(note.repo || note.live) && (
            <div className="flex flex-wrap gap-3 lg:col-start-2">
              {note.live && (
                <ExternalLink href={note.live} primary>
                  Open it
                </ExternalLink>
              )}
              {note.repo && <ExternalLink href={note.repo}>Source</ExternalLink>}
            </div>
          )}
        </div>
      </details>
    </li>
  );
}

export default function CategoryIndex({ categoryKey }) {
  const category = categories[categoryKey];
  const items = projectsIn(categoryKey);
  const extra = notes[categoryKey] ?? [];
  const neons = items.map((p) => p.neon);
  const tubeColors = neons.length > 1 ? neons : [neons[0] ?? BONE, BONE];
  const ref = useRef(null);

  useEffect(() => {
    if (reducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-line]",
        { yPercent: 100 },
        { yPercent: 0, duration: 1, ease: "power3.out", stagger: 0.12 }
      );
      gsap.fromTo(
        "li",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.5, ease: "power2.out", stagger: 0.08 }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  const count = items.length + extra.length;

  return (
    <PageShell
      neon={neons[0] ?? BONE}
      backTo="/"
      trail={[{ label: "Aaryan", to: "/" }, { label: category.crumb }]}
    >
      <div ref={ref}>
        <section className="relative mx-auto w-full max-w-6xl px-4 pb-20 pt-16 sm:px-10 sm:pt-24 lg:px-16">
          <h1 className="relative font-display text-[clamp(2.6rem,9vw,8rem)] leading-[0.86] tracking-[-0.02em] text-paper">
            {category.lines.map((line) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <span data-line className="block">
                  {line}
                </span>
              </span>
            ))}
            <NeonTube colors={tubeColors} variant="low" delay={0.5} />
          </h1>

          <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem_2.5rem] lg:gap-12">
            <p className="font-code text-[11px] uppercase tracking-[0.22em] text-dust lg:pt-2">
              {count} {count === 1 ? "entry" : "entries"}
            </p>
            <p className="max-w-[44ch] text-xl leading-9 text-bone lg:col-span-2">{category.intro}</p>
          </div>
        </section>

        <section aria-label={`${category.title} projects`} className="mx-auto w-full max-w-6xl px-4 pb-28 sm:px-10 lg:px-16">
          <ul className="border-b border-paper/10">
            {items.map((p) => (
              <ProjectRow key={p.slug} project={p} />
            ))}
            {extra.map((n) => (
              <NoteRow key={n.id} note={n} />
            ))}
          </ul>
        </section>
      </div>
    </PageShell>
  );
}
