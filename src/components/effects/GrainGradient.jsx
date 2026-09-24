import { useEffect, useRef } from "react";

// Hero backdrop after iamkailash.xyz: a silky domain-warped gradient in
// grey and white under a still film grain. The folds lean toward the cursor.
// Raw WebGL2, one fragment shader; the canvas stays transparent (plain white
// hero) where WebGL2 is missing.

const VERT = `#version 300 es
in vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;   // 0..1, lagged
uniform float uPull;   // 0..1, eases in once the pointer moves
uniform vec3 uDeep, uMid, uLight;
uniform float uSpec, uGrain;
out vec4 outColor;

vec2 h2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453) * 2.0 - 1.0;
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(dot(h2(i), f), dot(h2(i + vec2(1, 0)), f - vec2(1, 0)), u.x),
             mix(dot(h2(i + vec2(0, 1)), f - vec2(0, 1)), dot(h2(i + vec2(1, 1)), f - vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 3; i++) { v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}

// Height of the cloth at p: domain-warped fbm.
float field(vec2 p) {
  float t = uTime * 0.045;
  vec2 s = p * 0.6;
  vec2 q = vec2(fbm(s + t), fbm(s + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(s + 2.0 * q + vec2(1.7, 9.2) + 0.6 * t),
                fbm(s + 2.0 * q + vec2(8.3, 2.8) - 0.4 * t));
  return clamp(fbm(s + 2.2 * r) * 1.6 + 0.5, 0.0, 1.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * asp, uv.y);
  vec2 m = vec2(uMouse.x * asp, uMouse.y);

  // Cursor drags the cloth: pull nearby space toward the pointer.
  vec2 d = p - m;
  p -= d * exp(-dot(d, d) * 5.0) * 0.45 * uPull;

  float f = field(p);

  // Treat f as a height field and light it, so the folds read as silk. The
  // slope is sampled per pixel; dFdx works per 2x2 block, and those blocks
  // crawled visibly as the cloth moved.
  float e = 1.5 / uRes.y;
  vec2 slope = vec2(field(p + vec2(e, 0.0)) - f, field(p + vec2(0.0, e)) - f) / e;
  vec3 n = normalize(vec3(-slope * 0.12 * asp, 1.0));
  vec3 l = normalize(vec3(-0.5, 0.6, 0.65));
  float diff = dot(n, l);
  float spec = pow(max(dot(reflect(-l, n), vec3(0, 0, 1)), 0.0), 10.0);

  float k = smoothstep(0.2, 0.75, f);
  vec3 col = mix(uDeep, uMid, smoothstep(0.0, 0.55, k));
  col = mix(col, uLight, smoothstep(0.45, 1.0, k));
  col *= 0.86 + 0.2 * diff;
  col += spec * uSpec;

  // Grain, fixed per pixel: re-rolling it every frame read as flicker, and
  // strong static grain reads as dirt on the screen as the cloth slides under
  // it. Triangular noise at a low level dithers away banding without showing.
  float g1 = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  float g2 = fract(sin(dot(gl_FragCoord.xy, vec2(39.3468, 11.1351))) * 24634.6345);
  col += (g1 + g2 - 1.0) * uGrain;

  outColor = vec4(col, 1.0);
}`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
  return s;
}

// "light": the hero's grey-white silk. "dark": slate silk for the sections
// below it.
const TONES = {
  light: { deep: "#8f8c87", mid: "#cbc9c2", light: "#f7f6f2", spec: 0.18, grain: 0.035 },
  dark: { deep: "#0a0a0d", mid: "#17171c", light: "#2b2b33", spec: 0.05, grain: 0.012 },
};
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);

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
