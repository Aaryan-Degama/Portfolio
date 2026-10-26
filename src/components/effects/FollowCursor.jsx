import { useEffect, useRef } from "react";

const TRAIL_COUNT = 12;
const BASE_SIZE = 16;
const DECAY = 0.85;
const LERP_MAIN = 0.6;
const LERP_TAIL = 0.5;
const MAX_SEGMENT_DISTANCE = 5; // prevents tail separation at high speed
const SPEED_THRESHOLD = 0.5; // lower = more sensitive stop detection

// Cursor dot with a fire tail. Positions are written straight to the DOM
// (transform, no layout, no React state) and the loop sleeps once the tail has
// caught up, so an idle page costs nothing.
export default function WhiteFireTailCursor() {
  const dots = useRef([]); // [0] main cursor, [1..] tail

  useEffect(() => {
    const target = { x: -100, y: -100 };
    const cursor = { x: -100, y: -100 };
    const trail = Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100 }));
    let last = { ...target };
    let raf = 0;

    const style = document.createElement("style");
    style.innerHTML = `* { cursor: none !important; }`;
    document.head.appendChild(style);

    const place = (el, p) => {
      el.style.transform = `translate3d(${p.x}px,${p.y}px,0) translate(-50%,-50%)`;
    };

    const animate = () => {
      const speed = Math.hypot(target.x - last.x, target.y - last.y);
      last = { ...target };

      cursor.x += (target.x - cursor.x) * LERP_MAIN;
      cursor.y += (target.y - cursor.y) * LERP_MAIN;

      if (speed < SPEED_THRESHOLD) {
        // Nearly stopped: collapse the tail into the cursor.
        for (const t of trail) {
          t.x += (cursor.x - t.x) * 0.17;
          t.y += (cursor.y - t.y) * 0.17;
        }
      } else {
        trail[0].x += (cursor.x - trail[0].x) * LERP_TAIL;
        trail[0].y += (cursor.y - trail[0].y) * LERP_TAIL;
        for (let i = 1; i < TRAIL_COUNT; i++) {
          const prev = trail[i - 1];
          const curr = trail[i];
          const dx = prev.x - curr.x;
          const dy = prev.y - curr.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > MAX_SEGMENT_DISTANCE) {
            const ratio = MAX_SEGMENT_DISTANCE / dist;
            curr.x = prev.x - dx * ratio;
            curr.y = prev.y - dy * ratio;
          } else {
            curr.x += dx * LERP_TAIL;
            curr.y += dy * LERP_TAIL;
          }
        }
      }

      place(dots.current[0], cursor);
      trail.forEach((p, i) => place(dots.current[i + 1], p));

      const settled =
        Math.abs(target.x - cursor.x) < 0.05 &&
        Math.abs(target.y - cursor.y) < 0.05 &&
        trail.every((t) => Math.abs(t.x - cursor.x) < 0.05 && Math.abs(t.y - cursor.y) < 0.05);
      raf = settled ? 0 : requestAnimationFrame(animate);
    };

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!raf) raf = requestAnimationFrame(animate);
    };
    window.addEventListener("mousemove", onMove);

    return () => {
      cancelAnimationFrame(raf);
      document.head.removeChild(style);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div className="mix-blend-difference z-[9998] pointer-events-none fixed inset-0">
      {/* Main cursor */}
      <div
        ref={(el) => (dots.current[0] = el)}
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full bg-white will-change-transform"
        style={{ width: BASE_SIZE, height: BASE_SIZE, transform: "translate(-100px,-100px)" }}
      />
      {Array.from({ length: TRAIL_COUNT }, (_, i) => {
        const size = BASE_SIZE * Math.pow(DECAY, i + 1);
        return (
          <div
            key={i}
            ref={(el) => (dots.current[i + 1] = el)}
            className="fixed left-0 top-0 bg-white rounded-full pointer-events-none will-change-transform"
            style={{ width: size, height: size, opacity: 1 - i / TRAIL_COUNT, transform: "translate(-100px,-100px)" }}
          />
        );
      })}
    </div>
  );
}
