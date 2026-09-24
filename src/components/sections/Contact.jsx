import React from "react";
import { NEON } from "../../theme/palette";

// Hover draws a neon underline under each link, one tube colour per link.
const LINK =
  "relative w-fit transition-colors hover:text-black after:absolute after:inset-x-0 after:-bottom-1 after:h-[2px] after:origin-left after:scale-x-0 after:rounded-full after:bg-[var(--neon)] after:shadow-[0_0_12px_var(--neon)] after:transition-transform after:duration-500 hover:after:scale-x-100 focus-visible:after:scale-x-100 outline-none";

export default function Contact() {
  return (
    <section id="contact" className="w-full bg-[#fcfaf0] text-black">
      <div className="max-w-6xl px-8 py-40 mx-auto space-y-20">
        
        {/* Heading */}
        <div className="space-y-6">
          <h2 className="text-5xl font-medium tracking-tight md:text-6xl">
            Let’s talk
          </h2>
          <p className="max-w-2xl text-xl leading-relaxed text-gray-600 md:text-2xl">
            If you want to discuss a project, collaboration, or just have a
            conversation about systems, on-device ML, or anything worth building
            from first principles, reach out.
          </p>
        </div>

        {/* Contact info */}
        <div className="grid gap-10 text-lg md:text-xl">
          <div className="flex flex-col gap-2">
            <span className="text-gray-500">Email</span>
            <a
              href="mailto:aaryandegama@gmail.com"
              className={LINK}
              style={{ "--neon": NEON.magenta }}
            >
              aaryandegama@gmail.com
            </a>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-gray-500">GitHub</span>
            <a
              href="https://github.com/Aaryan-Degama"
              target="_blank"
              rel="noopener noreferrer"
              className={LINK}
              style={{ "--neon": NEON.cyan }}
            >
              github.com/Aaryan-Degama
            </a>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-gray-500">LinkedIn</span>
            <a
              href="https://linkedin.com/in/aaryandegama"
              target="_blank"
              rel="noopener noreferrer"
              className={LINK}
              style={{ "--neon": NEON.ember }}
            >
              linkedin.com/in/aaryandegama
            </a>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-gray-500">Resume</span>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={LINK}
              style={{ "--neon": NEON.magenta }}
            >
              Aaryan_Degama.pdf
            </a>
          </div>
        </div>

        {/* Footer note */}
        <div className="pt-24 text-sm text-gray-400">
          © {new Date().getFullYear()} Aaryan Degama
        </div>
      </div>
    </section>
  );
}
