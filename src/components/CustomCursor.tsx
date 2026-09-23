import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export function CustomCursor() {
  const reduced = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { damping: 30, stiffness: 400, mass: 0.4 });
  const springY = useSpring(y, { damping: 30, stiffness: 400, mass: 0.4 });

  useEffect(() => {
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;
    document.body.classList.add("has-custom-cursor");
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX - 10);
      y.set(e.clientY - 10);
    };
    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a, button, input, textarea");
      setHovering(Boolean(target));
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", onOver);
    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", onOver);
    };
  }, [reduced, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[100] rounded-full mix-blend-difference bg-white"
      style={{ x: springX, y: springY, width: 20, height: 20 }}
      animate={{ scale: hovering ? 1.8 : 1 }}
      transition={{ duration: 0.2 }}
    />
  );
}
