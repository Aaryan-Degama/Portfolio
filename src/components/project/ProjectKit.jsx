import React, { useEffect, useId, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { categories, nextProject, projectBySlug } from "../../data/projectIndex";
import GrainGradient from "../effects/GrainGradient";

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const FOCUS =
  "outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--neon)]";

// ---------------------------------------------------------------------------
// Neon tube: the signature. A glowing stroke that draws itself through the
// display type, the way the home hero's cursor tube runs through the name.
// ---------------------------------------------------------------------------

const TUBE_PATHS = {
  sweep: "M-20,212 C170,262 330,96 520,128 S820,238 1020,70",
  low: "M-20,176 C200,226 420,150 600,170 S880,214 1020,120",
};

export function NeonTube({ colors, variant = "sweep", className = "", delay = 0.25 }) {
  const ref = useRef(null);
  const uid = useId().replace(/:/g, "");
  const gradientId = `tube-g-${uid}`;
  const clipId = `tube-c-${uid}`;
  const stops = Array.isArray(colors) ? colors : [colors];
  const glow = stops[Math.floor(stops.length / 2)];
  const stroke = stops.length > 1 ? `url(#${gradientId})` : stops[0];

  useEffect(() => {
    if (reducedMotion()) return undefined;
    const tween = gsap.fromTo(
      ref.current.querySelector("clipPath rect"),
      { attr: { width: 0 } },
      { attr: { width: 1080 }, duration: 1.6, delay, ease: "power3.inOut" }
    );
    return () => tween.kill();
  }, [delay]);

  return (
    <svg
      ref={ref}
      viewBox="0 0 1000 300"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full overflow-visible ${className}`}
      style={{ filter: `drop-shadow(0 0 5px ${glow}) drop-shadow(0 0 22px ${glow}80)` }}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="-40" y="-200" width="1080" height="700" />
        </clipPath>
        {stops.length > 1 && (
          <linearGradient id={gradientId} x1="0" y1="0" x2="1000" y2="0" gradientUnits="userSpaceOnUse">
            {stops.map((c, i) => (
              <stop key={c} offset={i / (stops.length - 1)} stopColor={c} />
            ))}
          </linearGradient>
        )}
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <path
          d={TUBE_PATHS[variant]}
          fill="none"
          stroke={stroke}
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={TUBE_PATHS[variant]}
          fill="none"
          stroke="#fffdf0"
          strokeOpacity="0.75"
          strokeWidth="1"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Page shell: breadcrumb bar, the page's neon as a CSS variable, footer.
// ---------------------------------------------------------------------------

export function Crumbs({ trail }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 font-code text-[11px] uppercase tracking-[0.22em] text-dust"
    >
      {trail.map((c, i) => (
        <React.Fragment key={c.label}>
          {i > 0 && <span aria-hidden="true" className="text-paper/20">/</span>}
          {c.to ? (
            <Link to={c.to} className={`transition-colors hover:text-paper ${FOCUS}`}>
              {c.label}
            </Link>
          ) : (
            <span aria-current="page" className="text-paper">
              {c.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

export function PageShell({ neon, trail, backTo, children, footer }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
  }, []);

  return (
    // isolate: the gradient's negative z stays behind this page's content.
    <main
      style={{ "--neon": neon }}
      className="relative isolate min-h-screen overflow-x-clip bg-void font-inter text-paper antialiased selection:bg-[var(--neon)] selection:text-void"
    >
      {/* The home page's slate silk, fixed behind every category and project page. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
        <GrainGradient tone="dark" />
      </div>
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-4 pt-6 sm:px-10 lg:px-16">
        <Crumbs trail={trail} />
        {backTo && (
          <Link
            to={backTo}
            className={`shrink-0 font-code text-[11px] uppercase tracking-[0.22em] text-dust transition-colors hover:text-paper ${FOCUS}`}
          >
            ← Back
          </Link>
        )}
      </header>
      {children}
      {footer}
    </main>
  );
}

// Detail pages: shell + hero facts + "next project" footer, all from the index.
export function ProjectPage({ slug, tagline, tags, children }) {
  const project = projectBySlug(slug);
  const category = categories[project.category];
  const next = nextProject(slug);

  return (
    <PageShell
      neon={project.neon}
      backTo={category.path}
      trail={[
        { label: "Aaryan", to: "/" },
        { label: category.crumb, to: category.path },
        { label: project.name },
      ]}
      footer={<ProjectFooter category={category} next={next} />}
    >
      <ProjectHero project={project} tagline={tagline} tags={tags} />
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-10 lg:px-16">{children}</div>
    </PageShell>
  );
}

function Fact({ label, children }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 border-t border-paper/10 py-3">
      <dt className="font-code text-[11px] uppercase tracking-[0.22em] text-dust">{label}</dt>
      <dd className="min-w-0 text-sm text-bone">{children}</dd>
    </div>
  );
}

function ProjectHero({ project, tagline, tags }) {
  const ref = useRef(null);

  useEffect(() => {
    if (reducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-title]",
        { yPercent: 18, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.1, ease: "power3.out" }
      );
      gsap.fromTo(
        "[data-hero-rest]",
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.45, ease: "power2.out", stagger: 0.08 }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative pb-16 pt-14 sm:pt-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-10 lg:px-16">
        <p
          data-hero-rest
          className="flex items-center gap-3 font-code text-[11px] uppercase tracking-[0.22em] text-bone"
        >
          <span aria-hidden="true" className="h-2 w-2 rotate-45 bg-[var(--neon)] shadow-[0_0_10px_var(--neon)]" />
          {project.kind}
        </p>
      </div>

      {/* The title bleeds off the right edge on purpose; the tube runs through it. */}
      <div className="relative mt-6 overflow-hidden">
        <h1
          data-hero-title
          className="-mr-[0.06em] whitespace-nowrap text-right font-display text-[clamp(4rem,18vw,16rem)] leading-[0.82] tracking-[-0.02em] text-paper"
        >
          {project.name}
        </h1>
        <NeonTube colors={project.neon} />
      </div>

      <div className="mx-auto mt-12 grid w-full max-w-6xl gap-10 px-4 sm:px-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16 lg:px-16">
        <p data-hero-rest className="max-w-[40ch] text-xl leading-9 text-bone sm:text-2xl sm:leading-10">
          {tagline}
        </p>
        <dl data-hero-rest className="self-end border-b border-paper/10">
          <Fact label="Stack">{tags.join(" · ")}</Fact>
          <Fact label="Source">
            <ExternalLink href={project.repo} quiet>
              {project.repo.replace("https://github.com/", "")}
            </ExternalLink>
          </Fact>
          {project.live && (
            <Fact label="Live">
              <ExternalLink href={project.live} quiet>
                {project.live.replace("https://", "")}
              </ExternalLink>
            </Fact>
          )}
        </dl>
      </div>
    </section>
  );
}

function ProjectFooter({ category, next }) {
  return (
    <footer className="mt-10 border-t border-paper/10">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-10 lg:px-16">
        {next ? (
          <Link
            to={`/projects/${next.slug}`}
            style={{ "--next": next.neon }}
            className={`group block ${FOCUS}`}
          >
            <span className="font-code text-[11px] uppercase tracking-[0.22em] text-dust">
              Next in {category.crumb}
            </span>
            <span className="mt-4 flex items-baseline justify-between gap-6">
              <span className="font-display text-5xl leading-none text-paper transition-colors duration-500 group-hover:text-[color:var(--next)] sm:text-7xl">
                {next.name}
              </span>
              <span
                aria-hidden="true"
                className="font-display text-4xl text-dust transition-all duration-500 group-hover:translate-x-2 group-hover:text-[color:var(--next)] sm:text-6xl"
              >
                →
              </span>
            </span>
            <span className="mt-4 block max-w-[52ch] text-sm leading-6 text-bone">{next.summary}</span>
            <span
              aria-hidden="true"
              className="mt-8 block h-px origin-left scale-x-0 bg-[var(--next)] shadow-[0_0_12px_var(--next)] transition-transform duration-700 group-hover:scale-x-100"
            />
          </Link>
        ) : (
          <Link to={category.path} className={`group block ${FOCUS}`}>
            <span className="font-code text-[11px] uppercase tracking-[0.22em] text-dust">Back to</span>
            <span className="mt-4 block font-display text-4xl leading-none text-paper transition-colors group-hover:text-[color:var(--neon)] sm:text-6xl">
              {category.title}
            </span>
          </Link>
        )}
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// Section with rail. The left column is one continuous hairline down the page
// (echoing the home hero's vertical line); each section's marker lights up in
// the page's neon while you're reading it.
// ---------------------------------------------------------------------------

export function Section({ label, intro, className = "", children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const ctx = gsap.context(() => {
      if (!reducedMotion()) {
        gsap.fromTo(
          el.querySelector("[data-reveal]"),
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
          }
        );
      }
      if (label) {
        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          end: "bottom 60%",
          toggleClass: { targets: el, className: "is-active" },
        });
      }
    }, ref);
    return () => ctx.revert();
  }, [label]);

  return (
    <section ref={ref} className="grid lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-14">
      <div className="lg:border-l lg:border-paper/10">
        {label && (
          <div className="flex items-center gap-3 pb-5 lg:sticky lg:top-10 lg:-ml-[5px] lg:pb-0 lg:pt-1">
            <span
              aria-hidden="true"
              className="h-[9px] w-[9px] shrink-0 rotate-45 border border-paper/30 bg-void transition-all duration-500 [.is-active_&]:border-[color:var(--neon)] [.is-active_&]:bg-[var(--neon)] [.is-active_&]:shadow-[0_0_12px_var(--neon)]"
            />
            <h2 className="font-code text-[11px] font-normal uppercase tracking-[0.22em] text-dust transition-colors duration-500 [.is-active_&]:text-paper">
              {label}
            </h2>
          </div>
        )}
      </div>
      <div data-reveal className={`min-w-0 pb-24 ${className}`}>
        {intro && <p className="mb-8 max-w-[62ch] text-lg leading-8 text-bone">{intro}</p>}
        {children}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Small parts.
// ---------------------------------------------------------------------------

export function Prose({ children, className = "" }) {
  return (
    <div className={`max-w-[64ch] space-y-5 text-lg leading-8 text-bone [&_strong]:font-medium [&_strong]:text-paper ${className}`}>
      {children}
    </div>
  );
}

export function Code({ children }) {
  return (
    <code className="rounded-[2px] bg-paper/[0.07] px-1.5 py-0.5 font-code text-[0.85em] text-paper">
      {children}
    </code>
  );
}

export function Card({ title, meta, children, className = "" }) {
  return (
    <div
      className={`group relative rounded-[2px] border border-paper/10 bg-carbon p-6 transition-colors duration-300 hover:border-paper/20 hover:bg-carbon-hi ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute -left-px bottom-0 top-0 w-px origin-top scale-y-0 bg-[var(--neon)] shadow-[0_0_10px_var(--neon)] transition-transform duration-500 group-hover:scale-y-100"
      />
      {title && <h3 className="text-[15px] font-medium tracking-tight text-paper">{title}</h3>}
      {meta && <p className="mt-1 break-words font-code text-[11px] text-dust">{meta}</p>}
      {children && <div className="mt-3 text-sm leading-6 text-bone">{children}</div>}
    </div>
  );
}

export const CARD =
  "group relative rounded-[2px] border border-paper/10 bg-carbon p-6 transition-colors duration-300 hover:border-paper/20 hover:bg-carbon-hi";

export function CardTrim() {
  return (
    <span
      aria-hidden="true"
      className="absolute -left-px bottom-0 top-0 w-px origin-top scale-y-0 bg-[var(--neon)] shadow-[0_0_10px_var(--neon)] transition-transform duration-500 group-hover:scale-y-100"
    />
  );
}

export function Panel({ children, className = "" }) {
  return (
    <div className={`rounded-[2px] border border-paper/10 bg-carbon ${className}`}>{children}</div>
  );
}

export function Tag({ children }) {
  return (
    <span className="rounded-[2px] border border-paper/15 px-2 py-1 font-code text-[11px] uppercase tracking-[0.14em] text-bone">
      {children}
    </span>
  );
}

export function BulletList({ children, className = "" }) {
  return <ul className={`max-w-[64ch] space-y-5 text-base leading-7 text-bone ${className}`}>{children}</ul>;
}

export function Bullet({ children }) {
  return (
    <li className="grid grid-cols-[1.25rem_minmax(0,1fr)]">
      <span aria-hidden="true" className="mt-[0.7rem] h-px w-2.5 bg-[var(--neon)]" />
      <span>{children}</span>
    </li>
  );
}

export function ExternalLink({ href, children, primary = false, quiet = false }) {
  const base = `inline-flex items-center gap-2 transition-colors ${FOCUS}`;
  const look = quiet
    ? "text-bone underline decoration-paper/20 underline-offset-4 hover:text-[color:var(--neon)] hover:decoration-[color:var(--neon)]"
    : primary
      ? "rounded-[2px] border border-[color:var(--neon)] px-5 py-3 font-code text-[11px] uppercase tracking-[0.22em] text-[color:var(--neon)] shadow-[0_0_18px_-6px_var(--neon)] hover:bg-[var(--neon)] hover:text-void"
      : "rounded-[2px] border border-paper/20 px-5 py-3 font-code text-[11px] uppercase tracking-[0.22em] text-bone hover:border-paper/50 hover:text-paper";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={quiet ? href : undefined}
      className={`${base} ${look} ${quiet ? "max-w-full" : ""}`}
    >
      <span className={quiet ? "truncate" : undefined}>{children}</span>
      <span aria-hidden="true" className="shrink-0">↗</span>
    </a>
  );
}

// Big numerals over a hairline, not boxed tiles.
export function StatRow({ children, className = "" }) {
  return <div className={`grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4 ${className}`}>{children}</div>;
}

export function StatTile({ label, value, prefix = "", suffix, format }) {
  const valueRef = useRef(null);
  const render = (n) =>
    prefix +
    (format === "decimal" ? n.toFixed(2) : Math.round(n).toLocaleString("en-US"));

  useEffect(() => {
    const el = valueRef.current;
    if (reducedMotion()) {
      el.textContent = render(value);
      return undefined;
    }
    const proxy = { n: 0 };
    const tween = gsap.to(proxy, {
      n: value,
      duration: 1.4,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 92%" },
      onUpdate: () => {
        el.textContent = render(proxy.n);
      },
    });
    return () => tween.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, prefix, format]);

  return (
    <div className="group border-t border-paper/15 pt-5 transition-colors duration-500 hover:border-[color:var(--neon)]">
      <p ref={valueRef} className="whitespace-nowrap font-inter text-5xl font-extralight leading-none tracking-[-0.04em] tabular-nums text-paper sm:text-6xl">
        {render(0)}
      </p>
      {suffix && <p className="mt-2 text-sm text-bone">{suffix.trim()}</p>}
      <p className="mt-3 font-code text-[11px] uppercase tracking-[0.22em] text-dust">{label}</p>
    </div>
  );
}

// A left-to-right chain of steps; stacks vertically below sm.
export function ChainDiagram({ steps }) {
  return (
    <div className="rounded-[2px] border border-paper/10 bg-carbon p-6">
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:gap-3">
        {steps.map((s, i) => (
          <React.Fragment key={s.label}>
            <div className="flex min-w-0 flex-1 basis-0 flex-col justify-center rounded-[2px] border border-paper/10 bg-paper/[0.04] px-4 py-4 text-center">
              <p className="text-sm font-medium tracking-tight">{s.label}</p>
              <p className="mt-1 text-xs leading-5 text-bone/80">{s.detail}</p>
            </div>
            {i !== steps.length - 1 && (
              <span className="mx-auto shrink-0 self-center text-dust sm:mx-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  className="rotate-90 sm:rotate-0"
                >
                  <line x1="2" y1="10" x2="16" y2="10" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M12,5 L18,10 L12,15" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
