# Aaryan Degama — Portfolio

Personal portfolio. A deliberate **clone of
[kavyan256/portfolio-kavyan](https://github.com/kavyan256/portfolio-kavyan)**
(layout, effects, neon design language), with Aaryan's name, content and
projects, **no music**, and an **itssharl.ee-style loader**. When in doubt
about how something should look or behave, match the reference repo.

**Maintain this file.** Whenever a decision, convention, route, project or
piece of personal info changes, update the relevant section here in the
same change. Record the owner's preferences under "Owner rules" as they're stated,
so they never need repeating.

## Owner rules (do not break)

- No background music, no audio toggle, nothing that plays sound.
- **The loading screen is final. Never change it** (`src/pages/LoadingPage.jsx`,
  the `.grain` CSS, its timing, look, caption or logo flight). The owner
  loves it as it is. Refactors elsewhere must not alter it either. If
  something else has to move (say the rail logo), keep `HERO_LOGO` in sync
  so the loader keeps landing in the right spot, and ask before touching
  anything else in the loader. For reference, it copies https://itssharl.ee/
  (grainy slate screen `#2b2b33`, the AD mark drawn connect-the-dots, the
  caption **"Connecting the dots..."** sliding out of a mask, credits at
  the foot).
- Everything else stays a faithful clone of the reference, re-skinned
  with Aaryan's content. Don't restyle it into something else.
- Real content only: facts come from the project READMEs and the resume
  (`resume/Aaryan_Degama.pdf`, also served as `public/resume.pdf`). Never
  invent metrics.

## Owner info

| | |
|---|---|
| Name | Aaryan Degama |
| Role line | Systems Programming • On-Device ML |
| Study | 3rd-year B.Tech IT (Business Informatics), IIIT Allahabad, expected May 2028 |
| Email | aaryandegama@gmail.com |
| Phone / WhatsApp | +91 83208 94345 (`wa.me/918320894345`) |
| GitHub | https://github.com/Aaryan-Degama |
| LinkedIn | https://linkedin.com/in/aaryandegama |
| Codeforces | https://codeforces.com/profile/Aaryan_Degama |
| Logo | `public/logo.svg` (brush "AD", ink on cream; favicon). `src/assets/images/logo-light.svg` is the letter path only, in cream, for dark backgrounds |

## Projects

Source of truth: `src/data/projectIndex.js` (categories, projects, neons,
repo/live links). Detail pages: `src/pages/projects/<Name>.jsx`.

| Project | Category | Neon | Repo |
|---|---|---|---|
| Vanta (with Divy Vaghasiya) | On-Device ML | magenta | Aaryan-Degama/Vanta |
| LilCV | On-Device ML | cyan | Aaryan-Degama/LilCV |
| Slate (hackathon, team of 3) | Shipped Systems | ember | Aaryan-Degama/slate, live: main.dosqfo1xoqa7l.amplifyapp.com |

Adding a project: add it to `projects` (pick an unused neon from `NEON`),
create its detail page from `ProjectKit` parts, add its route in `App.jsx`.
Adding a category: add it to `categories`; routes and nav links derive from
it except the Navbar dropdown (`src/components/Navbar/Navbar.jsx`).

## Stack and commands

React 19 (JSX, no TypeScript, as in the reference) + Vite 6 + Tailwind 3 +
GSAP + react-router 7. Deployed to Cloudflare Workers static assets
(worker `aaryan-portfolio`, `wrangler.jsonc`).

```bash
npm run dev       # vite
npm run build     # vite build — run before calling anything done
npm run lint      # oxlint
npm run deploy    # build + wrangler deploy (needs `npx wrangler login` once)
```

Devicon icons (skills marquee) load from the jsDelivr CDN in
`index.html`.

## Structure

```
src/
  App.jsx                   loader overlay + routes (site mounts under the loader)
  pages/LoadingPage.jsx     itssharl.ee-style splash, "Connecting the dots..."
  pages/LandingPage.jsx     Navbar, SideRail, Hero, About, Projects, Contact
  pages/projects/           Vanta, LilCV, Slate detail pages
  components/sections/      Hero, AboutMe (+ marquee), MyProjects, ProjectCard, Contact
  components/project/       ProjectKit (PageShell, NeonTube, Section, cards, ChainDiagram…),
                            CategoryIndex (category listing page)
  components/effects/       SideRail (fixed left rail), GrainGradient, FollowCursor,
                            FrameworkMarquee, NeonMark, ScrollCurveDivider
  components/Navbar/        Navbar (nav items + dropdown content), NavItem, DropdownPanel
  data/projectIndex.js      all project/category data
  theme/palette.js          colour tokens (mirrored in tailwind.config.js)
```

## Loader

`LoadingPage.jsx`, one GSAP timeline: caption and credits slide up out of
masks, 9 dots pop in on the AD monogram's skeleton, strokes draw between
them, the brush logo fades in over the dots, captions slide out, then
`onReveal()` mounts the site underneath. On `/` the mark flies to the
rail's logo slot (`HERO_LOGO`, must match SideRail's `top-4 left-4 p-2 w-11`);
on other routes the splash just fades. `onDone()` unmounts it. Reduced
motion: static mark, short fade. If the hero logo moves, update `HERO_LOGO`.

## Left rail (home page)

`src/components/effects/SideRail.jsx`, the owner's own addition to the
clone. It's fixed on the left of the home page: the AD logo (`w-11`), a
vertical bar and the GitHub / LinkedIn / WhatsApp icons. The owner
confirmed the motion:

- The AD logo and the bar's top end never move. The gap between logo and
  bar stays constant.
- Over the first half of the page the bar shortens from the bottom, and
  the icon stack rides up with the bar's lower end.
- Once the bar is completely gone, the icons keep rising. Each one squashes
  when it touches the AD logo and shatters into 18 triangle shards: GitHub
  first, then LinkedIn, WhatsApp at the end of the page.
- It's scrubbed by a ScrollTrigger on the `.hide-scrollbar` scroller, so
  scrolling up rebuilds everything.

`mix-blend-difference` keeps it visible over the cream sections. Reduced
motion shows a static rail. Hit points are in `hits`; the shard pattern
comes from `makeShards` (seeded). Icon positions are measured with rects
against the group, because offsetTop changes reference once the group is
transformed. If the logo size or position changes, update `HERO_LOGO` in
LoadingPage.jsx; that constant is the only loader line allowed to change.

## Design system (from the reference)

- Tokens: `src/theme/palette.js` / `tailwind.config.js`. VOID `#0b0a09`
  ground, CARBON `#151311` surfaces, PAPER `#fffce1` type, BONE `#b9af95`
  body, DUST `#8b8371` metadata.
- **Category and project pages** keep the dark reference look (VOID ground,
  CARBON cards, PAPER type) but sit on the same slate silk as the home
  page's dark sections (owner's call): `PageShell` in `ProjectKit.jsx` puts
  a `fixed inset-0 -z-10` `GrainGradient tone="dark"` behind the content
  (`main` is `isolate`; `bg-void` stays as the no-WebGL fallback).
- **Home page colours are inverted from the reference** (owner's call). What was
  black is light, and what was cream is black:
  - Hero: `bg-white`, name `text-void`, subtitle `text-umber` `#57524a`.
    Behind the name is `GrainGradient` (owner's call, replaced the reference's
    TubesCursor): a raw-WebGL2 shader of silky grey-white folds under a still
    film grain. Keep the grain static (re-rolling it per frame read as
    flicker) and faint (strong static grain read as dirt on the screen):
    triangular dither, amplitude 0.035 light / 0.012 dark, after iamkailash.xyz but grey instead of blue. The folds drift
    slowly and lean toward the cursor. It stops rendering when the hero is
    offscreen, draws one still frame under reduced motion, and leaves the
    plain white hero if WebGL2 is missing.
  - About, skills, Projects and Contact sit on a dark slate silk gradient
    (owner's call): the same `GrainGradient` shader with `tone="dark"`
    (`#0a0a0d` / `#17171c` / `#2b2b33`). It's one viewport-sized canvas,
    `sticky top-0 h-screen -mb-[100vh] -z-10`, placed *before* `<Hero />` in
    `LandingPage.jsx` so it sits behind the whole page. `coveredBy="#hero"`
    pauses it while the hero fills the screen. The scroller is `isolate` so
    the negative z stays inside it, and the sections have no background. The
    sections are marked `home-sheet` (it replaced the reference's cream
    `#fcfaf0`); the mobile CSS in `index.css` targets `section.home-sheet`.
    Don't wrap the sections in a new element: that shifts the
    `:nth-of-type` rules in the mobile CSS. Text is `text-snow` `#f2f1ec`,
    secondary `text-ash` `#a3a19b`.
  - Project cards and skill tiles are `bg-snow`, with `text-void` /
    `text-umber`.
  - The curve "divider" draws nothing (owner: no flat black band). It sets a
    `clip-path: path(...)` on `#hero` whose bottom edge bows upward on
    scroll, so the dark gradient shows through the bulge. Same curve and
    timing as the reference's svg (control point 50 -> -70 in 160px/180
    units). It leaves a 45px spacer at the top of About. The navbar dropdown
    is black.
  - The side rail uses `mix-blend-difference`: dark over the white hero,
    light over the dark sections. Keep light surfaces out of the left
    ~88px below the hero (the skills strip is masked there).
- NEON (trim only, never fills): magenta `#f967fb`, lime `#83f36e`,
  cyan `#60aed5`, ember `#fe8a2e`. One neon per project; a category is
  the gradient of its projects' neons. On cream avoid lime (too faint).
- Type: `font-display` **Unbounded** (Google Fonts, owner's choice; replaced the reference's Amidone Grotesk). Hero name is static plain text (no per-letter animation, owner's call), Unbounded 500, `clamp(3.2rem,9.2vw,9.75rem)`, tracking -0.035em, as in the owner's earlier version. Unbounded is wide, so display sizes are about 25% smaller than the reference. `font-inter` body,
  `font-code` JetBrains Mono 11px uppercase for metadata.
- Corners: `rounded-[2px]` on project pages, `rounded-[18px]` on homepage
  dark cards/tiles.
- Listings are rows (`border-t border-paper/10`), not card grids.
- Motion: GSAP inside `gsap.context(..., ref)` with `ctx.revert()` on
  unmount; kill every ScrollTrigger on unmount. The homepage scrolls inside
  `.hide-scrollbar`, not `window`, so use IntersectionObserver there.
  Respect `prefers-reduced-motion`.
- Mobile overrides live in `src/index.css` media queries and target
  Tailwind class combos. Changing classes on the homepage can silently
  detach them, so check at 390px.

## Checking visually

Headless Chrome via playwright-core works (`/usr/bin/google-chrome`).
The Chrome extension tab is usually hidden, which throttles GSAP, so use
headless screenshots at 1440px and 390px. The loader plus hero intro take
about 12s to settle.

## Known leftovers

- `Slate.jsx` copy was adapted from the reference's Slate page (same
  hackathon project, team of three). Keep its facts in line with the
  slate README.
