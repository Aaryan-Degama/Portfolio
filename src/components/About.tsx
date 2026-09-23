import { Reveal } from "./Reveal";

export function About() {
  return (
    <section id="about" className="px-6 sm:px-12 py-28 sm:py-36 max-w-4xl">
      <Reveal>
        <h2 className="font-[var(--font-display)] text-sm tracking-[0.3em] uppercase text-[var(--fg-muted)] mb-8">
          About
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="text-2xl sm:text-3xl leading-relaxed text-[var(--fg)]">
          Third-year B.Tech IT (Business Informatics) student at IIIT
          Allahabad, graduating May 2028. I care about systems programming
          and on-device ML — minimal, performance-first architecture over
          black-box tooling, and understanding things down to how they're
          actually built.
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <div className="mt-12 inline-flex items-baseline gap-3 border-t border-[var(--border)] pt-6">
          <span className="font-[var(--font-display)] text-4xl text-[var(--fg)]">
            ~1380
          </span>
          <span className="text-sm text-[var(--fg-muted)]">
            Codeforces rating — Pupil
          </span>
        </div>
      </Reveal>
    </section>
  );
}
