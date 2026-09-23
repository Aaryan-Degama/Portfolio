import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { projects } from "../data/projects";

type NavItem = {
  name: string;
  href: string;
  dropdown?: { name: string; href: string }[];
  description?: string;
};

const navItems: NavItem[] = [
  { name: "Home", href: "#top" },
  {
    name: "Projects",
    href: "#projects",
    dropdown: projects.map((p) => ({ name: p.name, href: p.url })),
    description: "Systems programming and on-device ML, built from first principles.",
  },
  {
    name: "About",
    href: "#about",
    dropdown: [
      { name: "Background", href: "#about" },
      { name: "Skills", href: "#skills" },
    ],
    description: "3rd-year B.Tech IT student at IIIT Allahabad, graduating May 2028.",
  },
  {
    name: "Contact",
    href: "#contact",
    dropdown: [
      { name: "GitHub", href: "https://github.com/Aaryan-Degama" },
      { name: "Email", href: "mailto:your.email@example.com" },
      { name: "Resume", href: "/resume.pdf" },
    ],
    description: "Open to conversations about systems, on-device ML, or anything worth building.",
  },
];

export function Nav() {
  const { theme, toggle } = useTheme();
  const reduced = usePrefersReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const openItem = openIndex !== null ? navItems[openIndex] : null;

  const close = () => setOpenIndex(null);

  return (
    <div className="fixed top-0 left-0 right-0 z-40" onMouseLeave={close}>
      <header className="relative z-20 flex items-center justify-between px-6 sm:px-12 py-6">
        <a href="#top" className="font-[var(--font-display)] text-sm tracking-wide text-[var(--fg)]">
          AD
        </a>

        <nav className="hidden sm:flex items-center gap-2">
          {navItems.map((item, i) => (
            <a
              key={item.name}
              href={item.href}
              onMouseEnter={() => setOpenIndex(item.dropdown ? i : null)}
              onClick={(e) => {
                if (item.dropdown) {
                  e.preventDefault();
                  setOpenIndex(openIndex === i ? null : i);
                }
              }}
              className="group relative px-4 py-2 text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
            >
              {item.name}
              <span className="absolute left-4 right-4 bottom-1 h-px bg-[var(--fg)] origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <button
          onClick={toggle}
          aria-label="Toggle color theme"
          className="text-xs tracking-wide uppercase text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors border border-[var(--border)] rounded-full px-3 py-1.5"
        >
          {theme === "dark" ? "Light" : "Dark"}
        </button>
      </header>

      <AnimatePresence>
        {openItem && (
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 hidden sm:block bg-[var(--bg)] border-b border-[var(--border)] shadow-2xl"
          >
            <div className="grid grid-cols-2 gap-16 px-6 sm:px-12 py-10 max-w-3xl">
              <ul className="flex flex-col gap-3">
                {openItem.dropdown?.map((sub) => (
                  <li key={sub.name}>
                    <a
                      href={sub.href}
                      target={sub.href.startsWith("http") ? "_blank" : undefined}
                      rel={sub.href.startsWith("http") ? "noreferrer" : undefined}
                      onClick={close}
                      className="group relative inline-block text-xl font-[var(--font-display)] text-[var(--fg)]"
                    >
                      {sub.name}
                      <span className="absolute left-0 right-0 -bottom-0.5 h-px bg-[var(--fg)] origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />
                    </a>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-[var(--fg-muted)] leading-relaxed self-start">
                {openItem.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
