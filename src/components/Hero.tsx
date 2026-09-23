import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const NAME = "Aaryan Degama";

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reduced) return;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-eyebrow", { opacity: 0, y: 12, duration: 0.6 })
        .from(
          ".hero-letter",
          { opacity: 0, y: "110%", duration: 0.9, stagger: 0.02, ease: "power4.out" },
          "-=0.3",
        )
        .from(".hero-subtitle", { opacity: 0, y: 16, duration: 0.7 }, "-=0.5")
        .from(".hero-cta", { opacity: 0, y: 16, duration: 0.7, stagger: 0.08 }, "-=0.4");
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={sectionRef}
      id="top"
      className="min-h-screen flex flex-col justify-center px-6 sm:px-12 pt-24"
    >
      <p className="hero-eyebrow font-mono text-sm text-[var(--fg-muted)] mb-6">
        Hi, I'm Aaryan — B.Tech IT, IIIT Allahabad, expected May 2028
      </p>

      <h1 className="font-[var(--font-display)] text-[13vw] sm:text-[8vw] lg:text-[6.5vw] leading-[0.95] tracking-tight text-[var(--fg)] flex flex-wrap overflow-hidden">
        {NAME.split("").map((char, i) => (
          <span key={i} className="hero-letter inline-block overflow-hidden">
            {char === " " ? " " : char}
          </span>
        ))}
      </h1>

      <p className="hero-subtitle mt-6 max-w-xl text-lg sm:text-xl text-[var(--fg-muted)]">
        Systems programming &amp; on-device ML. Building things from first
        principles instead of trusting the black box.
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4">
        <a href="#projects" className="hero-cta group relative text-base text-[var(--fg)]">
          See my projects
          <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
          <span className="absolute left-0 right-0 -bottom-1 h-px bg-[var(--fg)] origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />
        </a>
        <a
          href="#about"
          className="hero-cta group relative text-base text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
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
          className="hero-cta text-sm border border-[var(--border)] rounded-full px-5 py-2.5 text-[var(--fg)] hover:border-[var(--fg)] transition-colors"
        >
          Resume
        </a>
      </div>
    </section>
  );
}
