import { useEffect, useRef } from "react";

export default function TubesCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    let app = null;
    let cancelled = false;

    async function loadCursor() {
      const module = await import(
        "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js"
      );
      const TubesCursor = module.default;

      if (cancelled) return;

      app = TubesCursor(canvasRef.current, {
        tubes: {
          colors: ["#f967fb", "#53bc28", "#6958d5"],
          lights: {
            intensity: 200,
            colors: ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"]
          }
        }
      });

      if (cancelled) {
        // Unmounted while the module/scene was still loading — tear it down immediately.
        app.dispose();
        return;
      }

      // The library forces a fixed 2x render resolution regardless of the
      // actual screen; clamp it back down so the full-viewport canvas isn't
      // rendered at an unnecessarily high pixel density on standard displays.
      app.three.minPixelRatio = 1;
      app.three.maxPixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      app.three.resize();
    }

    loadCursor();

    // Click handler for randomizing colors
    function randomColors(count) {
      return new Array(count)
        .fill(0)
        .map(
          () =>
            "#" +
            Math.floor(Math.random() * 16777215)
              .toString(16)
              .padStart(6, "0")
        );
    }

    const handleClick = () => {
      if (!app) return;
      const colors = randomColors(3);
      const lightsColors = randomColors(4);
      app.tubes.setColors(colors);
      app.tubes.setLightsColors(lightsColors);
    };

    document.body.addEventListener("click", handleClick);

    return () => {
      cancelled = true;
      document.body.removeEventListener("click", handleClick);
      if (app) {
        app.dispose();
        app = null;
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-999"
    ></canvas>
  );
}
