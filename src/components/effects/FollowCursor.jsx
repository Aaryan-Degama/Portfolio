// WhiteFireTailCursor.jsx
import { useEffect, useRef, useState } from "react";

const TRAIL_COUNT = 12;
const BASE_SIZE = 16;
const DECAY = 0.85;
const LERP_MAIN = 0.6;
const LERP_TAIL = 0.5;
const MAX_SEGMENT_DISTANCE = 5; // 🔥 prevents tail separation at high speed

export default function WhiteFireTailCursor() {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState(
    () => Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100 }))
  );

  const targetRef = useRef({ x: -100, y: -100 });
  const cursorRef = useRef({ x: -100, y: -100 });
  const trailRef = useRef(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100 }))
  );

  // ✅ Track mouse + hide native cursor
  useEffect(() => {
    const handleMouseMove = (e) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const style = document.createElement("style");
    style.innerHTML = `* { cursor: none !important; }`;
    document.head.appendChild(style);

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.head.removeChild(style);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // ✅ Fire-tail animation loop
  useEffect(() => {
    let rafId;

    let lastTarget = { x: -100, y: -100 };

    const SPEED_THRESHOLD = 0.5; // lower = more sensitive stop detection

    const animate = () => {
      const target = targetRef.current;
      const cursor = cursorRef.current;
      const trailPositions = trailRef.current.slice();

      // ✅ Detect motion speed
      const speed = Math.hypot(
        target.x - lastTarget.x,
        target.y - lastTarget.y
      );

      lastTarget = { ...target };

      // ✅ Smooth main cursor
      cursor.x += (target.x - cursor.x) * LERP_MAIN;
      cursor.y += (target.y - cursor.y) * LERP_MAIN;

      if (speed < SPEED_THRESHOLD) {
        // ✅ If nearly stopped → instantly collapse tail into cursor
        for (let i = 0; i < TRAIL_COUNT; i++) {
          trailPositions[i].x += (cursor.x - trailPositions[i].x) * 0.17;
          trailPositions[i].y += (cursor.y - trailPositions[i].y) * 0.17;
        }
      } else {
        // ✅ Normal fire-tail behavior while moving

        trailPositions[0].x += (cursor.x - trailPositions[0].x) * LERP_TAIL;
        trailPositions[0].y += (cursor.y - trailPositions[0].y) * LERP_TAIL;

        for (let i = 1; i < TRAIL_COUNT; i++) {
          const prev = trailPositions[i - 1];
          const curr = trailPositions[i];

          let dx = prev.x - curr.x;
          let dy = prev.y - curr.y;
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

      cursorRef.current = cursor;
      trailRef.current = trailPositions;

      setCursorPos({ x: cursor.x, y: cursor.y });
      setTrail(trailPositions.map((p) => ({ ...p })));

      rafId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <>
      <div className="mix-blend-difference z-[9998] pointer-events-none fixed inset-0">
        {/* Main cursor */}
        <div
          className="pointer-events-none fixed z-[9999] rounded-full bg-white -translate-x-1/2 -translate-y-1/2"
          style={{
            width: BASE_SIZE,
            height: BASE_SIZE,
            left: cursorPos.x,
            top: cursorPos.y,
          }}
        />

        {/* ✅ FIRE TAIL WITH CUT-OUT UNDER CURSOR */}
        {trail.map((point, i) => {
          const size = BASE_SIZE * Math.pow(DECAY, i + 1);

          return (
            <div
              key={i}
              className="fixed -translate-x-1/2 -translate-y-1/2 bg-white rounded-full pointer-events-none"
              style={{
                width: size,
                height: size,
                left: point.x,
                top: point.y,
                opacity: 1 - i / TRAIL_COUNT,
              }}
            />
          );
        })}
      </div>
    </>
  );
}