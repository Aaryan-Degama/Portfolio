import React from "react";
import { NEON } from "../../theme/palette";

// LinkedIn's own blue, lifted so it reads on the dark slate.
const LINKEDIN_BLUE = "#3d8bff";
const RESUME = "https://drive.google.com/file/d/1c1PFChIRiHVIfum15LDA-sT76bA5TpEa/view?usp=sharing";

// One row per channel: label left, value right, a neon hairline that draws
// in and a soft neon wash on hover, the arrow nudging out.
const ROWS = [
  { label: "Email", text: "aaryandegama@gmail.com", href: "mailto:aaryandegama@gmail.com", neon: NEON.magenta },
  { label: "GitHub", text: "github.com/Aaryan-Degama", href: "https://github.com/Aaryan-Degama", neon: NEON.cyan },
  { label: "LinkedIn", text: "linkedin.com/in/aaryan-degama-49a4a1307", href: "https://www.linkedin.com/in/aaryan-degama-49a4a1307", neon: LINKEDIN_BLUE },
  { label: "WhatsApp", text: "+91 83208 94345", href: "https://wa.me/918320894345", neon: NEON.lime },
  { label: "Resume", text: "View resume", href: RESUME, neon: NEON.violet },
];

export default function Contact() {
  return (
    <section id="contact" className="w-full home-sheet text-snow">
      <div className="max-w-6xl lg:max-w-[107rem] px-8 lg:px-16 py-40 lg:pb-16 mx-auto space-y-20">

        {/* Heading */}
        <div className="space-y-6">
          <h2 className="font-display text-5xl font-medium tracking-[-0.03em] md:text-7xl">
            Let’s talk
          </h2>
          <p className="max-w-2xl text-xl leading-relaxed text-ash md:text-2xl">
            If you want to discuss a project, collaboration, or just have a
            conversation about information retrieval, low-level systems, or anything worth building
            from first principles, reach out.
          </p>
        </div>

        {/* Contact info */}
        <div className="border-b border-snow/10 text-lg md:text-xl">
          {ROWS.map(({ label, text, href, neon }) => (
            <a
              key={label}
              href={href}
              {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              style={{ "--neon": neon }}
              className="group relative flex flex-col gap-2 border-t border-snow/10 py-7 outline-none transition-colors hover:text-white focus-visible:text-white md:flex-row md:items-center md:justify-between md:px-4 before:pointer-events-none before:absolute before:inset-0 before:-z-0 before:bg-[radial-gradient(60%_140%_at_0%_50%,color-mix(in_srgb,var(--neon)_16%,transparent),transparent)] before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100 focus-visible:before:opacity-100 after:absolute after:inset-x-0 after:-top-px after:h-px after:origin-left after:scale-x-0 after:bg-[var(--neon)] after:shadow-[0_0_12px_var(--neon)] after:transition-transform after:duration-500 hover:after:scale-x-100 focus-visible:after:scale-x-100"
            >
              <span className="relative font-code text-[11px] uppercase tracking-[0.22em] text-ash md:w-40">{label}</span>
              <span className="relative flex items-center gap-4 break-all md:justify-end">
                {text}
                <span aria-hidden="true" className="font-display text-ash transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[color:var(--neon)]">↗</span>
              </span>
            </a>
          ))}
        </div>

        {/* Footer note */}
        <div className="pt-24 text-sm text-dust lg:pt-0">
          © {new Date().getFullYear()} Aaryan Degama
        </div>
      </div>
    </section>
  );
}
