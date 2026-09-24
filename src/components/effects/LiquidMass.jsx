import { useEffect, useRef } from "react";
import { SILK_GLSL, TONES, VERT, compile, rgb } from "./silk";

// A heavy pool of the home hero's white silk, seen through the dark page
// behind a category heading (after landonorris.com's hover reveal). Metaballs
// on slow springs hold the pool and lean toward the cursor; the
// cursor also paints a trail into a small buffer that crawls and shrinks as it
// fades, so the reveal follows it like dragged ink. Inside the liquid the
// heading is redrawn dark, so it reads on the light silk. Touch screens get a
// slow autonomous drift instead of the cursor. Raw WebGL2, like GrainGradient.

const N = 9;
const TRAIL_SCALE = 0.25; // trail buffer size vs the canvas
const SILK_PX = 640; // css px per silk unit, about the hero's fold size

const TRAIL_FRAG = `#version 300 es
precision highp float;
uniform sampler2D uPrev;
uniform vec2 uRes;    // trail buffer px
uniform vec2 uA, uB;  // splat segment, trail px, y up
uniform float uR;     // splat radius, trail px; 0 = no splat
uniform float uKeep;  // retention this frame
uniform float uTime;
out vec4 outColor;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}

void main() {
  vec2 fc = gl_FragCoord.xy;
  // Read the old trail slightly off along a slow noise field, so its edge
  // crawls and goes gooey as it fades instead of shrinking as a clean stroke.
  vec2 w = vec2(vnoise(fc * 0.05 + uTime * 0.3), vnoise(fc * 0.05 + 17.0 - uTime * 0.3)) - 0.5;
  float v = texture(uPrev, (fc + w * 1.8) / uRes).r * uKeep - 0.003;
  if (uR > 0.0) {
    vec2 ab = uB - uA;
    float t = clamp(dot(fc - uA, ab) / max(dot(ab, ab), 1e-4), 0.0, 1.0);
    float d = length(fc - uA - ab * t) / uR;
    v = max(v, exp(-d * d * 2.2));
  }
  outColor = vec4(max(v, 0.0), 0.0, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
#define N ${N}
uniform vec2 uRes;      // drawing buffer, device px
uniform float uDpr;
uniform float uGrain;
uniform vec4 uB[N];     // css px, y down: x, y, radius, weight
uniform vec2 uV[N];     // css px per second
uniform sampler2D uTrail;
uniform sampler2D uText;
out vec4 outColor;
${SILK_GLSL}
void main() {
  vec2 box = uRes / uDpr;
  vec2 pc = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr;
  float R0 = uB[0].z;

  // Irregular rim: a slow low-frequency warp, so no blob reads as a circle.
  vec2 s = pc / R0 * 0.7;
  float t = uTime * 0.08;
  vec2 p = pc + vec2(noise(s + t), noise(s + vec2(4.1, 7.3) - t)) * R0 * 0.2;

  // Metaballs, each squashed along its own velocity (longer, thinner): that
  // stretch is what reads as drag.
  float f = 0.0;
  for (int i = 0; i < N; i++) {
    vec2 d = p - uB[i].xy;
    float R = uB[i].z;
    float sp = length(uV[i]);
    vec2 dir = sp > 1e-3 ? uV[i] / sp : vec2(1.0, 0.0);
    float st = 1.0 + min(sp / R * 0.22, 0.9);
    float al = dot(d, dir);
    vec2 ds = dir * (al / st) + (d - dir * al) * sqrt(st);
    float q = dot(ds, ds) / (R * R);
    if (q < 1.0) { float k = 1.0 - q; f += uB[i].w * k * k * k; }
  }
  float F = f + texture(uTrail, gl_FragCoord.xy / uRes).r * 0.75;

  // Pinch the liquid shut at the band's top and bottom rather than cutting
  // it; the sides are the viewport's, where it can just run off.
  F *= smoothstep(0.0, 24.0, min(pc.y, box.y - pc.y));

  const float T = 0.24;
  float aa = fwidth(F) * 0.8;
  float mask = smoothstep(T - aa, T + aa, F);
  if (mask <= 0.0) { outColor = vec4(0.0); return; }

  vec2 sk = vec2(pc.x, box.y - pc.y) / ${SILK_PX}.0;
  vec3 col = silk(sk, 1.5 / (uDpr * ${SILK_PX}.0), 1.6);
  // Lift it toward the hero's white; the deep folds alone read murky here.
  col = mix(col, uLight, 0.3);
  // A darker lip just inside the rim gives the pool its thickness.
  col *= mix(0.8, 1.0, smoothstep(0.0, 0.16, F - T));
  // The heading, redrawn in void where the liquid covers it.
  col = mix(col, vec3(0.043, 0.039, 0.035), texture(uText, pc / box).a);
  col += grain(gl_FragCoord.xy) * uGrain;
  outColor = vec4(col * mask, mask);
}`;

function program(gl, frag) {
  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, frag));
  gl.bindAttribLocation(prog, 0, "a");
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  const u = {};
  for (let i = 0; i < gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS); i++) {
    const name = gl.getActiveUniform(prog, i).name.replace("[0]", "");
    u[name] = gl.getUniformLocation(prog, name);
  }
  return { prog, u };
}

function texture(gl) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}

// One pool in the heading's top-left corner, cutting diagonally across it,
// laid on measured glyphs so it holds at any size and for any category. It
// covers about COVER of the letters: line two takes at most half of them and
// line one the rest, so line one always reaches further right. "On-De" + "ML",
// "Shipp" + "Syst". Balls sit on a line's covered run: offset in units of the
// run's half-box, radius in font sizes, and how far each leans toward the
// cursor; different leans make the pool deform, not slide.
const BALLS = [
  { row: 0, x: -0.75, y: -0.08, r: 1.25, lean: 0.3 },
  { row: 0, x: -0.25, y: -0.12, r: 1.2, lean: 0.24 },
  { row: 0, x: 0.25, y: -0.05, r: 1.12, lean: 0.2 },
  { row: 0, x: 0.68, y: 0, r: 0.98, lean: 0.22 },
  { row: 0, x: -0.7, y: -0.75, r: 0.8, lean: 0.26 },
  { row: 1, x: -0.75, y: 0.1, r: 1.22, lean: 0.12 },
  { row: 1, x: -0.25, y: 0.14, r: 1.15, lean: 0.16 },
  { row: 1, x: 0.25, y: 0.1, r: 1.05, lean: 0.1 },
  { row: 1, x: 0.66, y: 0.05, r: 0.9, lean: 0.14 },
];
const COVER = 0.62;

// Semi-implicit spring step; zeta < 1 leaves a small, slow overshoot.
function spring(pos, vel, i, tx, ty, k, zeta, dt) {
  const c = 2 * zeta * Math.sqrt(k);
  vel[i] += ((tx - pos[i]) * k - vel[i] * c) * dt;
  vel[i + 1] += ((ty - pos[i + 1]) * k - vel[i + 1] * c) * dt;
  pos[i] += vel[i] * dt;
  pos[i + 1] += vel[i + 1] * dt;
}

// anchorRef: the heading the pool sits behind. Its [data-line] spans (text
// only, two lines) place the pool and are redrawn dark inside the liquid.
export default function LiquidMass({ anchorRef, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const anchor = anchorRef.current;
    const gl = canvas.getContext("webgl2", { antialias: false, alpha: true, premultipliedAlpha: true });
    if (!gl || !anchor) return undefined;

    // A failed shader must not take the page down: the heading just stays plain.
    let main, trail;
    try {
      main = program(gl, FRAG);
      trail = program(gl, TRAIL_FRAG);
    } catch (err) {
      console.warn("LiquidMass disabled:", err);
      return undefined;
    }

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const tone = TONES.light;
    gl.useProgram(main.prog);
    gl.uniform3fv(main.u.uDeep, rgb(tone.deep));
    gl.uniform3fv(main.u.uMid, rgb(tone.mid));
    gl.uniform3fv(main.u.uLight, rgb(tone.light));
    gl.uniform1f(main.u.uSpec, tone.spec);
    gl.uniform1f(main.u.uGrain, tone.grain);
    gl.uniform1i(main.u.uTrail, 0);
    gl.uniform1i(main.u.uText, 1);

    // Trail ping-pong. Half floats keep the slow fade smooth; 8-bit works.
    const float = !!gl.getExtension("EXT_color_buffer_float");
    const trails = [0, 1].map(() => ({ tex: texture(gl), fb: gl.createFramebuffer() }));
    let tw = 0, th = 0, cur = 0;
    const textTex = texture(gl);
    const textCanvas = document.createElement("canvas");

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pos = new Float32Array(N * 2);
    const vel = new Float32Array(N * 2);
    const blobs = new Float32Array(N * 4);
    const zero = new Float32Array(N * 2);
    const pool = { x: 0, y: 0 }; // centre, for the cursor's pull
    const home = new Float32Array(N * 2); // each ball's resting spot
    let scale = 100; // brush and cursor reach, from the font size
    const pointer = { x: 0, y: 0, seen: false };
    // Touch screens have no cursor to wait for: they get a slow wander.
    const wander = window.matchMedia("(pointer: coarse)").matches;
    const lag = { x: 0, y: 0, vx: 0, vy: 0, px: 0, py: 0, inside: false };
    let dpr = 1, textKey = "";
    let raf = 0, visible = true, last = 0, placed = false, alive = true;
    const start = performance.now();

    const lines = () => [...anchor.querySelectorAll("[data-line]")];

    // Place the pool over its glyphs. Boxes come from layout (glyph rect
    // minus its line's rect, plus the line's offset), so the lines' rise-in
    // transform cancels out and this can run on the first frame.
    const measure = () => {
      const [l1, l2 = l1] = lines();
      if (!l1?.firstChild) return;
      const c = canvas.getBoundingClientRect();
      const a = anchor.getBoundingClientRect();
      const box = (el, from, to) => {
        const range = document.createRange();
        range.setStart(el.firstChild, from);
        range.setEnd(el.firstChild, to);
        const g = range.getBoundingClientRect(), l = el.getBoundingClientRect();
        const x = a.left - c.left + el.offsetLeft + g.left - l.left;
        const y = a.top - c.top + el.offsetTop + g.top - l.top;
        return { l: x, t: y, r: x + g.width, b: y + g.height };
      };
      const union = (p, q) => ({ l: Math.min(p.l, q.l), t: Math.min(p.t, q.t), r: Math.max(p.r, q.r), b: Math.max(p.b, q.b) });
      const n1 = l1.firstChild.length, n2 = l2.firstChild.length;
      const total = Math.round(COVER * (n1 + n2));
      const k2 = Math.max(1, Math.min(n2, Math.floor(total / 2)));
      const k1 = Math.max(1, Math.min(n1, total - k2));
      const rows = [box(l1, 0, k1), box(l2, 0, k2)];
      const bx = union(rows[0], rows[1]);
      pool.x = (bx.l + bx.r) / 2;
      pool.y = (bx.t + bx.b) / 2;
      const fs = parseFloat(getComputedStyle(anchor).fontSize);
      scale = fs * 0.85;
      BALLS.forEach((b, i) => {
        const r = rows[b.row];
        home[i * 2] = (r.l + r.r) / 2 + (b.x * (r.r - r.l)) / 2;
        home[i * 2 + 1] = (r.t + r.b) / 2 + (b.y * (r.b - r.t)) / 2;
        blobs[i * 4 + 2] = b.r * fs;
        blobs[i * 4 + 3] = 1;
        if (!placed) {
          pos[i * 2] = home[i * 2];
          pos[i * 2 + 1] = home[i * 2 + 1];
        }
      });
      placed = true;
    };

    // Redraw the heading's lines exactly where the DOM shows them, rise-in
    // transform and mask included, so the dark copy tracks the paper text
    // from the first frame. Skipped when nothing moved.
    const drawText = () => {
      if (!alive) return;
      const c = canvas.getBoundingClientRect();
      const rects = lines().map((el) => [el, el.getBoundingClientRect(), el.parentElement.getBoundingClientRect()]);
      const key = `${canvas.width}x${canvas.height}|` + rects.map(([, r, m]) => [r.left - c.left, r.top - c.top, m.top - c.top, m.bottom - c.top].join()).join("|");
      if (key === textKey) return;
      textKey = key;
      const cs = getComputedStyle(anchor);
      const lh = parseFloat(cs.lineHeight);
      textCanvas.width = canvas.width;
      textCanvas.height = canvas.height;
      const ctx = textCanvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      if ("letterSpacing" in ctx) ctx.letterSpacing = cs.letterSpacing;
      ctx.fillStyle = "#000";
      for (const [el, r, m] of rects) {
        const t = ctx.measureText(el.textContent);
        const asc = t.fontBoundingBoxAscent, desc = t.fontBoundingBoxDescent;
        ctx.save();
        ctx.beginPath();
        ctx.rect(m.left - c.left, m.top - c.top, m.width, m.height);
        ctx.clip();
        ctx.fillText(el.textContent, r.left - c.left, r.top - c.top + (lh - asc - desc) / 2 + asc);
        ctx.restore();
      }
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, textTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
      gl.activeTexture(gl.TEXTURE0);
    };

    const resize = () => {
      const w0 = canvas.clientWidth;
      // Cap the buffer lower on small screens.
      dpr = Math.min(window.devicePixelRatio || 1, w0 < 640 ? 1 : 1.5);
      const w = Math.round(w0 * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      measure();
      // Assigning width/height clears the canvas, even to the same value.
      if (w !== canvas.width || h !== canvas.height) {
        canvas.width = w;
        canvas.height = h;
      }
      // StrictMode remounts on the same, already-sized canvas: size the
      // trail by its own dimensions, not the canvas's.
      if (Math.round(w * TRAIL_SCALE) !== tw || Math.round(h * TRAIL_SCALE) !== th) {
        tw = Math.max(1, Math.round(w * TRAIL_SCALE));
        th = Math.max(1, Math.round(h * TRAIL_SCALE));
        for (const t of trails) {
          gl.bindTexture(gl.TEXTURE_2D, t.tex);
          if (float) gl.texImage2D(gl.TEXTURE_2D, 0, gl.R16F, tw, th, 0, gl.RED, gl.HALF_FLOAT, null);
          else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, tw, th, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
          gl.bindFramebuffer(gl.FRAMEBUFFER, t.fb);
          gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t.tex, 0);
          gl.clearColor(0, 0, 0, 1);
          gl.clear(gl.COLOR_BUFFER_BIT);
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }
      drawText();
      if (still || !raf) draw(0);
    };

    function draw(time) {
      for (let i = 0; i < N; i++) {
        blobs[i * 4] = pos[i * 2];
        blobs[i * 4 + 1] = pos[i * 2 + 1];
      }
      gl.useProgram(main.prog);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(main.u.uRes, canvas.width, canvas.height);
      gl.uniform1f(main.u.uDpr, dpr);
      gl.uniform1f(main.u.uTime, time);
      gl.uniform4fv(main.u.uB, blobs);
      gl.uniform2fv(main.u.uV, still ? zero : vel);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, trails[cur].tex);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    // Fade the trail and paint the lagged cursor's path into it.
    function paint(time, dt, splat) {
      const next = 1 - cur;
      gl.useProgram(trail.prog);
      gl.bindFramebuffer(gl.FRAMEBUFFER, trails[next].fb);
      gl.viewport(0, 0, tw, th);
      gl.bindTexture(gl.TEXTURE_2D, trails[cur].tex);
      gl.uniform2f(trail.u.uRes, tw, th);
      gl.uniform1f(trail.u.uTime, time);
      gl.uniform1f(trail.u.uKeep, Math.exp(-dt / 0.6));
      const k = dpr * TRAIL_SCALE, H = canvas.height / dpr;
      gl.uniform2f(trail.u.uA, lag.px * k, (H - lag.py) * k);
      gl.uniform2f(trail.u.uB, lag.x * k, (H - lag.y) * k);
      gl.uniform1f(trail.u.uR, splat * k);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      cur = next;
    }

    const step = (time, dt) => {
      const R = scale;
      const c = canvas.getBoundingClientRect();
      let cx, cy;
      if (pointer.seen) {
        cx = pointer.x - c.left;
        cy = pointer.y - c.top;
      } else if (wander) {
        cx = pool.x + (Math.sin(time * 0.23) * 1.6 + Math.sin(time * 0.61) * 0.5) * R;
        cy = pool.y + (Math.cos(time * 0.31) * 0.5 + Math.sin(time * 0.47) * 0.2) * R;
      } else {
        // A mouse that hasn't moved yet: the pool rests on its letters.
        cx = cy = -1e5;
      }

      // The pool leans toward the cursor without following it: the pull
      // saturates with distance and fades out once the pointer is far away.
      const dx = cx - pool.x, dy = cy - pool.y;
      const dist = Math.hypot(dx, dy) || 1;
      const reach = 3 * R;
      const f = (reach / (dist + reach)) * (1 - Math.min(Math.max((dist - 5 * R) / (3 * R), 0), 1));
      BALLS.forEach((b, i) => {
        const wx = Math.sin(time * (0.21 + i * 0.07) + i * 1.7) * 0.12 * R;
        const wy = Math.cos(time * (0.17 + i * 0.05) + i * 2.3) * 0.1 * R;
        const tx = home[i * 2] + wx + dx * f * b.lean;
        const ty = home[i * 2 + 1] + wy + dy * f * b.lean * 0.6;
        spring(pos, vel, i * 2, tx, ty, 5, 0.7, dt);
      });

      // The trail brush trails the cursor on a heavy spring; it snaps to the
      // pointer when it enters so it never smears in from outside.
      const inside = cx > 0 && cy > 0 && cx < c.width && cy < c.height;
      if (inside && !lag.inside) Object.assign(lag, { x: cx, y: cy, vx: 0, vy: 0 });
      lag.inside = inside;
      lag.px = lag.x;
      lag.py = lag.y;
      const kc = 2 * 0.62 * Math.sqrt(90);
      lag.vx += ((cx - lag.x) * 90 - lag.vx * kc) * dt;
      lag.vy += ((cy - lag.y) * 90 - lag.vy * kc) * dt;
      lag.x += lag.vx * dt;
      lag.y += lag.vy * dt;
      const speed = Math.hypot(lag.vx, lag.vy);
      return inside ? R * (pointer.seen ? 0.46 : 0.36) * (1 + Math.min((speed / R) * 0.05, 0.5)) : 0;
    };

    const frame = (now) => {
      const dt = Math.min((now - (last || now)) / 1000, 1 / 30);
      last = now;
      const time = (now - start) / 1000;
      step(time, dt / 2);
      const splat = step(time, dt / 2);
      paint(time, dt, splat);
      drawText();
      draw(time);
      raf = visible ? requestAnimationFrame(frame) : 0;
    };

    const onMove = (e) => {
      if (e.pointerType === "touch") return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.seen = true;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    ro.observe(anchor);
    resize();
    // The display font may land after the first draw: re-place and redraw.
    document.fonts?.ready.then(() => {
      if (!alive) return;
      placed = false;
      measure();
      textKey = "";
      drawText();
      if (alive && still) draw(0);
    });

    let io = null;
    if (!still) {
      window.addEventListener("pointermove", onMove, { passive: true });
      io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !raf) {
          last = 0;
          raf = requestAnimationFrame(frame);
        }
      });
      io.observe(canvas);
      raf = requestAnimationFrame(frame);
    }

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      ro.disconnect();
      io?.disconnect();
      for (const t of trails) {
        gl.deleteTexture(t.tex);
        gl.deleteFramebuffer(t.fb);
      }
      gl.deleteTexture(textTex);
      gl.deleteBuffer(buf);
      gl.deleteProgram(main.prog);
      gl.deleteProgram(trail.prog);
    };
  }, [anchorRef]);

  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none ${className}`} />;
}
