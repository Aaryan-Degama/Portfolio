import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const SCRAMBLE_CHARS = "01_/>{}ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function Loader() {
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (reduced) {
      setVisible(false);
      return;
    }
    const el = textRef.current;
    if (!el) return;

    const full = el.textContent ?? "";
    const current: string[] = [];
    el.textContent = "";

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.6,
          delay: 0.35,
          ease: "power2.inOut",
          onComplete: () => setVisible(false),
        });
      },
    });

    full.split("").forEach((letter, i) => {
      if (letter === " ") {
        tl.add(() => {
          current[i] = " ";
          el.textContent = current.join("");
        }, i * 0.045);
        return;
      }
      tl.to(
        {},
        {
          duration: 0.4,
          repeat: 3,
          onRepeat: () => {
            current[i] = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
            el.textContent = current.join("");
          },
          onComplete: () => {
            current[i] = letter;
            el.textContent = current.join("");
          },
        },
        i * 0.045,
      );
    });
  }, [reduced]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-4 bg-[var(--bg)]"
    >
      <p className="font-mono text-xs tracking-[0.3em] text-[var(--fg-muted)] uppercase">
        booting_
      </p>
      <h1
        ref={textRef}
        className="font-[var(--font-display)] text-3xl sm:text-4xl tracking-tight text-[var(--fg)]"
      >
        Aaryan Degama
      </h1>
    </div>
  );
}
