# Hero viscous-fluid cursor effect

When asked to change the hero's cursor/background effect (viscous fluid,
Hereditary-style deformation, WebGL cursor trail, etc.), read this first.

## What's already here — reuse it, don't rewrite from scratch

- `src/components/effects/GrainGradient.jsx` — the current hero backdrop.
  Raw WebGL2, single fragment shader (fbm domain-warp height field + normal
  lighting + fixed-per-pixel grain), mounted as `<canvas class="absolute
  inset-0">` inside `#hero`. Cursor position is lagged into `uMouse`
  (`mouse.x += (target.x - mouse.x) * 0.045`) and eased into `uPull`
  (`pull += (pullTarget - pull) * 0.03`) — this IS the inertia/damping
  pattern to extend for a viscous-fluid look, not a new library.
  Lifecycle rules already solved here, keep them: pause via
  IntersectionObserver when off-screen or covered (`coveredBy`), static
  single frame under `prefers-reduced-motion`, DPR capped at 1.5, resize
  guarded against redundant canvas clears, WebGL2-missing falls back to
  plain background (never blank/broken).
- `src/components/effects/FollowCursor.jsx` — old JS-only trailing-dot
  cursor (lerp chain, per-frame RAF, `mix-blend-difference`). Reference
  for cursor-follow math only; it's unused/legacy, don't wire it in as-is.
- No Three.js/OGL/other 3D lib installed (`package.json` has none) —
  stick with raw WebGL2 in a single component like GrainGradient does.
  Don't add a 3D library for one shader effect.

## Constraints from CLAUDE.md (do not violate)

- The hero name stays static plain text — no per-letter animation.
- Never touch `src/pages/LoadingPage.jsx` or its timing/logo-flight.
- Keep the shader's grain **static** (no re-roll per frame — reads as
  flicker) and faint. Any new deformation must not reintroduce flicker.
- GSAP is the animation lib already in use elsewhere (`gsap.context` +
  `ctx.revert()` on unmount) — for shader-uniform tweening prefer plain
  RAF lerps like GrainGradient already does, not GSAP driving uniforms.
- Verify with `npm run build` and `npm run lint` before calling it done.

## Visual testing

Use Claude Code's built-in `--chrome` flag (browser integration) to open
`npm run dev`'s localhost and a reference URL side by side and iterate
visually — this is a CLI flag, not a separate skill to install.
