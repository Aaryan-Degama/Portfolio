import { projects } from "../data/projects";
import { Reveal } from "./Reveal";

export function Projects() {
  return (
    <section id="projects" className="px-6 sm:px-12 py-28 sm:py-36">
      <Reveal>
        <h2 className="font-[var(--font-display)] text-sm tracking-[0.3em] uppercase text-[var(--fg-muted)] mb-16">
          Projects
        </h2>
      </Reveal>

      <div className="flex flex-col divide-y divide-[var(--border)]">
        {projects.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.05}>
            <a
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="group block py-12 first:pt-0"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3">
                <h3 className="font-[var(--font-display)] text-4xl sm:text-5xl text-[var(--fg)] group-hover:opacity-60 transition-opacity">
                  {p.name}
                </h3>
                <span className="text-sm text-[var(--fg-muted)] shrink-0">
                  {p.url.replace("https://", "")} ↗
                </span>
              </div>
              <p className="mt-3 text-lg text-[var(--fg)]">{p.tagline}</p>
              <p className="mt-4 max-w-3xl text-[var(--fg-muted)] leading-relaxed">
                {p.problem}
              </p>
              <p className="mt-3 max-w-3xl text-[var(--fg-muted)] leading-relaxed">
                {p.approach}
                {p.collaborators && (
                  <span className="text-[var(--fg-muted)]"> — {p.collaborators}.</span>
                )}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <li
                    key={s}
                    className="text-xs text-[var(--fg-muted)] border border-[var(--border)] rounded-full px-3 py-1"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
