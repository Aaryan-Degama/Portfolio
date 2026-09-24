// The silk shader and its tones, shared by GrainGradient (the silk on its
// own) and LiquidMass (the silk inside its ink). Raw WebGL2.

export const VERT = `#version 300 es
in vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }`;

// Declares uTime and the tone uniforms. silk(p, e, asp) takes aspect-corrected
// coords, the slope step and the aspect used to scale the lighting.
export const SILK_GLSL = `
uniform float uTime;
uniform vec3 uDeep, uMid, uLight;
uniform float uSpec;
uniform float uIris; // strength of the pastel sheen; 0 = plain grey silk

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

// Treat the field as a height map and light it, so the folds read as silk.
// The slope is sampled per pixel; dFdx works per 2x2 block, and those blocks
// crawled visibly as the cloth moved.
vec3 silk(vec2 p, float e, float asp) {
  float f = field(p);
  vec2 slope = vec2(field(p + vec2(e, 0.0)) - f, field(p + vec2(0.0, e)) - f) / e;
  vec3 n = normalize(vec3(-slope * 0.12 * asp, 1.0));
  vec3 l = normalize(vec3(-0.5, 0.6, 0.65));
  float diff = dot(n, l);
  float spec = pow(max(dot(reflect(-l, n), vec3(0, 0, 1)), 0.0), 10.0);

  float k = smoothstep(0.2, 0.75, f);
  vec3 col = mix(uDeep, uMid, smoothstep(0.0, 0.55, k));
  col = mix(col, uLight, smoothstep(0.45, 1.0, k));
  col *= 0.86 + 0.2 * diff;

  // A thin-film sheen: pastel pink, cyan and lime bands that follow the
  // folds' tilt, only where the cloth bends and is bright. Hue only, so the
  // silk keeps its tonal range; kept faint so it tints rather than paints.
  float phase = f * 1.8 + n.x * 1.6 - n.y * 1.2 + uTime * 0.012;
  vec3 band = 0.5 + 0.5 * cos(6.2832 * (phase + vec3(0.0, 0.33, 0.67)));
  float w = smoothstep(0.04, 0.3, length(n.xy)) * smoothstep(0.2, 0.7, k);
  col += (band - (band.r + band.g + band.b) / 3.0) * w * uIris;
  return col + spec * uSpec;
}

// Grain, fixed per pixel: re-rolling it every frame read as flicker, and
// strong static grain reads as dirt on the screen as the cloth slides under
// it. Triangular noise at a low level dithers away banding without showing.
float grain(vec2 fc) {
  float g1 = fract(sin(dot(fc, vec2(12.9898, 78.233))) * 43758.5453);
  float g2 = fract(sin(dot(fc, vec2(39.3468, 11.1351))) * 24634.6345);
  return g1 + g2 - 1.0;
}
`;

export function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
  return s;
}

// "light": the hero's grey-white silk. "dark": slate silk for the sections
// below it.
export const TONES = {
  light: { deep: "#8f8c87", mid: "#cbc9c2", light: "#f7f6f2", spec: 0.18, grain: 0.035, iris: 0.1 },
  dark: { deep: "#0a0a0d", mid: "#17171c", light: "#2b2b33", spec: 0.05, grain: 0.012, iris: 0.025 },
};
export const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
