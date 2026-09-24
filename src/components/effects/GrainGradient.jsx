import { useEffect, useRef } from "react";
import { SILK_GLSL, TONES, VERT, compile, rgb } from "./silk";

// Hero backdrop after iamkailash.xyz: a silky domain-warped gradient in
// grey and white under a still film grain. The folds lean toward the cursor.
// Raw WebGL2, one fragment shader; the canvas stays transparent (plain white
// hero) where WebGL2 is missing.

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform vec2 uMouse;   // 0..1, lagged
uniform float uPull;   // 0..1, eases in once the pointer moves
uniform float uGrain;
out vec4 outColor;
${SILK_GLSL}
void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * asp, uv.y);
  vec2 m = vec2(uMouse.x * asp, uMouse.y);

  // Cursor drags the cloth: pull nearby space toward the pointer.
  vec2 d = p - m;
  p -= d * exp(-dot(d, d) * 5.0) * 0.45 * uPull;

  vec3 col = silk(p, 1.5 / uRes.y, asp) + grain(gl_FragCoord.xy) * uGrain;
  outColor = vec4(col, 1.0);
}`;

// coveredBy: selector of an element that hides this canvas while it fills the
// viewport (the hero, for the dark layer behind the whole page); rendering
// pauses meanwhile.
export default function GrainGradient({ tone = "light", coveredBy }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl2", { antialias: false, alpha: true });
    if (!gl) return undefined;

    // A failed shader must not take the page down: fall back to the plain hero.
    const prog = gl.createProgram();
    try {
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    } catch (err) {
      console.warn("GrainGradient disabled:", err);
      return undefined;
    }
    gl.linkProgram(prog);
    gl.useProgram(prog);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uPull = gl.getUniformLocation(prog, "uPull");
    const t = TONES[tone];
    gl.uniform3fv(gl.getUniformLocation(prog, "uDeep"), rgb(t.deep));
    gl.uniform3fv(gl.getUniformLocation(prog, "uMid"), rgb(t.mid));
    gl.uniform3fv(gl.getUniformLocation(prog, "uLight"), rgb(t.light));
    gl.uniform1f(gl.getUniformLocation(prog, "uSpec"), t.spec);
    gl.uniform1f(gl.getUniformLocation(prog, "uGrain"), t.grain);

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = { x: 0.62, y: 0.45 };
    const mouse = { ...target };
    let pull = 0, pullTarget = 0;
    let raf = 0, visible = true;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      // Assigning width/height clears the canvas, even to the same value, which
      // flashed a blank frame on every observer callback.
      if (w === canvas.width && h === canvas.height) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      if (still) draw(0);
    };

    function draw(time) {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uPull, pull);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    const frame = () => {
      mouse.x += (target.x - mouse.x) * 0.045;
      mouse.y += (target.y - mouse.y) * 0.045;
      pull += (pullTarget - pull) * 0.03;
      draw((performance.now() - start) / 1000);
      raf = visible ? requestAnimationFrame(frame) : 0;
    };

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      target.x = (e.clientX - r.left) / r.width;
      target.y = 1 - (e.clientY - r.top) / r.height;
      pullTarget = 1;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    let io = null, coverIo = null;
    if (!still) {
      window.addEventListener("pointermove", onMove, { passive: true });
      // Render only while on screen and not hidden behind coveredBy.
      let onScreen = true, covered = false;
      const sync = () => {
        visible = onScreen && !covered;
        if (visible && !raf) raf = requestAnimationFrame(frame);
      };
      io = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; sync(); });
      io.observe(canvas);
      const cover = coveredBy && document.querySelector(coveredBy);
      if (cover) {
        coverIo = new IntersectionObserver(([entry]) => {
          covered = entry.intersectionRatio >= 0.95;
          sync();
        }, { threshold: [0.95] });
        coverIo.observe(cover);
      }
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      ro.disconnect();
      io?.disconnect();
      coverIo?.disconnect();
      // Not loseContext(): StrictMode remounts on this same canvas and would
      // get the dead context back.
      gl.deleteProgram(prog);
    };
  }, [tone, coveredBy]);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" />;
}
