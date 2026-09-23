import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export function Loader() {
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(!reduced);
  const [showName, setShowName] = useState(reduced);

  useEffect(() => {
    if (reduced) return;
    const t1 = setTimeout(() => setShowName(true), 450);
    const t2 = setTimeout(() => setVisible(false), 1900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [reduced]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[var(--bg)]"
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
        >
          <p className="font-mono text-xs tracking-[0.3em] text-[var(--fg-muted)] uppercase">
            booting_
          </p>
          <AnimatePresence>
            {showName && (
              <motion.h1
                className="mt-4 font-[var(--font-display)] text-3xl sm:text-4xl tracking-tight text-[var(--fg)]"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                Aaryan Degama
              </motion.h1>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
