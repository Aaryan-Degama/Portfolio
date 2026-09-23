import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export function Hero() {
  const reduced = usePrefersReducedMotion();

  return (
    <section
      id="top"
      className="min-h-screen flex flex-col justify-center px-6 sm:px-12 pt-24"
    >
      <motion.p
        initial={reduced ? undefined : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="font-mono text-sm text-[var(--fg-muted)] mb-6"
      >
        Hi, I'm Aaryan — B.Tech IT, IIIT Allahabad, expected May 2028
      </motion.p>

      <motion.h1
        initial={reduced ? undefined : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="font-[var(--font-display)] text-[13vw] sm:text-[8vw] lg:text-[6.5vw] leading-[0.95] tracking-tight text-[var(--fg)]"
      >
        Aaryan Degama
      </motion.h1>

      <motion.p
        initial={reduced ? undefined : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 max-w-xl text-lg sm:text-xl text-[var(--fg-muted)]"
      >
        Systems programming &amp; on-device ML. Building things from first
        principles instead of trusting the black box.
      </motion.p>

      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4"
      >
        <a
          href="#projects"
          className="group relative text-base text-[var(--fg)]"
        >
          See my projects
          <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
          <span className="absolute left-0 right-0 -bottom-1 h-px bg-[var(--fg)] origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />
        </a>
        <a
          href="#about"
          className="group relative text-base text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
        >
          More about me
          <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
          <span className="absolute left-0 right-0 -bottom-1 h-px bg-[var(--fg)] origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />
        </a>
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noreferrer"
          className="text-sm border border-[var(--border)] rounded-full px-5 py-2.5 text-[var(--fg)] hover:border-[var(--fg)] transition-colors"
        >
          Resume
        </a>
      </motion.div>
    </section>
  );
}
