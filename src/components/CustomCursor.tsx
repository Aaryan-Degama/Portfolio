import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export function CustomCursor() {
  const reduced = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (reduced || !window.matchMedia("(pointer: fine)").matches || !dotRef.current) return;
    document.body.classList.add("has-custom-cursor");
    setEnabled(true);

    const moveX = gsap.quickTo(dotRef.current, "x", { duration: 0.35, ease: "power3" });
    const moveY = gsap.quickTo(dotRef.current, "y", { duration: 0.35, ease: "power3" });
    const scale = gsap.quickTo(dotRef.current, "scale", { duration: 0.2, ease: "power3" });

    const move = (e: MouseEvent) => {
      moveX(e.clientX - 10);
      moveY(e.clientY - 10);
    };
    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a, button, input, textarea");
      scale(target ? 1.8 : 1);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", onOver);
    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", onOver);
    };
  }, [reduced]);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[100] rounded-full mix-blend-difference bg-white w-5 h-5"
    />
  );
}
