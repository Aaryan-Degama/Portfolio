import { Reveal } from "./Reveal";

export function Contact() {
  return (
    <section id="contact" className="px-6 sm:px-12 py-28 sm:py-36">
      <Reveal>
        <h2 className="font-[var(--font-display)] text-sm tracking-[0.3em] uppercase text-[var(--fg-muted)] mb-8">
          Contact
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="max-w-xl text-2xl sm:text-3xl leading-relaxed text-[var(--fg)]">
          Open to conversations about systems, on-device ML, or anything
          worth building from first principles.
        </p>
      </Reveal>
      <Reveal delay={0.2}>
        <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
          <a
            href="mailto:your.email@example.com"
            className="text-lg text-[var(--fg)] border-b border-[var(--border)] hover:border-[var(--fg)] transition-colors pb-1"
          >
            your.email@example.com
          </a>
          <a
            href="https://github.com/Aaryan-Degama"
            target="_blank"
            rel="noreferrer"
            className="text-lg text-[var(--fg)] border-b border-[var(--border)] hover:border-[var(--fg)] transition-colors pb-1"
          >
            github.com/Aaryan-Degama
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="text-lg text-[var(--fg)] border-b border-[var(--border)] hover:border-[var(--fg)] transition-colors pb-1"
          >
            Resume ↓
          </a>
        </div>
      </Reveal>
    </section>
  );
}
