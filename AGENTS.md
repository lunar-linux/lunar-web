# Notes for agents and contributors

The Lunar Linux website: Nuxt 4 (`app/` layout) + Vue 3 `<script setup>` + TypeScript + Tailwind 4 +
Nuxt Content v3. Deployed as a **fully static site** (`nitro.preset: 'static'`); also shipped as an
nginx Docker image and as GitHub Pages previews of `main` and of every PR (`gh-pages` branch,
`pr-preview/pr-N/`). User-facing docs: [README.md](README.md) and [CONTRIBUTING.md](CONTRIBUTING.md).
This file is read by coding agents (CLAUDE.md imports it) and is meant for human contributors too.

## Commands

Yarn 1 only. Node 24 (`.nvmrc`, `.tool-versions`; Nuxt 4.6 rejects Node 23).

```bash
yarn dev                      # http://localhost:3000
yarn verify                   # lint + typecheck + test + check-content + generate + check-links (run before committing)
yarn test                     # Vitest unit tests in test/
yarn check-links --external   # also probe outside URLs
NUXT_APP_BASE_URL=/lunar/ NUXT_PUBLIC_SITE_URL=https://example.org/lunar/ yarn generate && NUXT_APP_BASE_URL=/lunar/ yarn check-links
docker compose up --build web # nginx image, http://localhost:8080
docker compose up dev         # dev server in Docker (no local Node), http://localhost:3000
```

## Layout

- `app/pages/`: `index.vue` (homepage from `components/sections/*`), `docs/[...slug].vue`, `news/[...slug].vue`, `download.vue` (renders `content/download.md`), `history.vue` and `about.vue` (render `content/history.md` and `content/about.md` through `<StoryPage>`, linked from the footer only; `docs/about.vue` redirects the old `/docs/about`); shared header and footer in `app/layouts/default.vue`
- Navigation: the header lists real places (Docs, News, the homepage's `#community`, and the Download button to `/download`) and marks the current one with `navCurrent()` (`app/utils/navigation.ts`); every inner page starts with `<Breadcrumb>`, which always begins at Home. Adding a page: see the checklist below
- `app/components/`: registered by **file name only** (`pathPrefix: false`): `<DocCard>`, not `<UiDocCard>`
- `app/components/content/ProsePre.vue`: overrides Markdown code blocks (copy button). In MDC, `ProsePre` = block, `ProseCode` = inline code
- `app/composables/`: `useDocsNavigation` (tree for sidebar and breadcrumbs), `useDocSearch` (FlexSearch over `/search.json`), `useSiteLinks` (`withBase`, `absoluteUrl`), `usePageSeo` (title, description, canonical, OG)
- `content.config.ts`: collections `docs` (`content/docs/**`), `news` (`content/news/*`), `download` (`content/download.md`; its `featured` frontmatter also feeds the homepage Downloads section), and `history` and `about` (`content/history.md`, `content/about.md`; their chapters, family tree, moonlight calendar, fact sheet and launch sequence are MDC components in `app/components/content/` with their data inline) with zod schemas
- `server/routes/`: `rss.xml`, `sitemap.xml`, `robots.txt`, `search.json`, `moonbase-arrivals.json` (logic in `server/utils/moonbase.ts`); all prerendered
- `scripts/`: `check-content.mjs` and `check-links.mjs` (content and built-site link validation), `moonbase-feed.mjs` (live arrivals feed)

## Rules that are easy to break

- Content v3 APIs only: `queryCollection('docs').path(p).first()`, `queryCollection(event, 'news')` on the server (import from `@nuxt/content/server`). No `queryContent`/`_path`.
- Normalize route paths with `withoutTrailingSlash(route.path)` before querying by path.
- Never hardcode root-absolute URLs in `href`/`src`/`$fetch`: `<NuxtLink>` for routes, `~/assets/...` for images, `withBase()` for prerendered files. The site must work under a sub-path.
- New server routes must be added to `nitro.prerender.routes` in `nuxt.config.ts`. Every `content/**/*.md` is prerendered automatically, so a `.md` file there that isn't a page breaks the build.
- `failOnError: true`: a link to a missing page fails `yarn generate`. Content links must be absolute (`/docs/...`); `check-content` rejects relative ones.
- Placeholder links (`href="#"`) are intentionally kept until real destinations are confirmed; don't invent URLs.
- Homepage section anchors (`#features`, `#downloads`, `#community`) are linked as `/#id` so they work from any page.

## Adding a page: navigation checklist

The navigation model: the header lists only real places, the homepage previews them, and every inner
page shows where you are and the way home. A new page has to fit that model, or the site goes back to
being a mix of anchors and pages with no sense of place.

1. **Decide where it lives.** A top-level destination people come to the site for can go in the header
   (`navLinks` in `SiteHeader.vue`). Keep that list short: the desktop row (logo, links, search,
   Download button) has to fit at 1024px, so check that width. Anything else goes in a footer column
   (`SiteFooter.vue`) and is linked from related pages. Downloads is the button, not a link.
2. **Header entry:** add an icon for the mobile menu in `mobileIcons`, using a literal `'ph:…'` string.
   Icons are bundled by scanning the source, so a name built at runtime renders blank, and the dev server
   has to restart to pick up a new one. The current-section marker comes from `navCurrent()`
   automatically: `/foo` lights up on `/foo` and everywhere under `/foo/`. Hash links are never marked.
3. **Breadcrumb:** start the page with `<Breadcrumb :items="[…]" />`. Home is added for you. The trail
   can stop at the parent when the next crumb would just repeat the `<h1>` (news articles show
   "Home › News"), because a crumb is only plain text when it matches the current URL.
4. **Homepage section:** if the page has one, the section is a preview with an "All …" link to the page
   (top right, like News and Downloads). It reads the same data, so the two can't drift apart. CTAs
   (hero buttons and the like) link to the page, not to the section's anchor.
5. **Rendering from markdown:** for a one-off page, give the file its own collection in
   `content.config.ts` (see `download`) and query it with `queryCollection(…).first()`. Content pages
   are prerendered automatically. A page made only in Vue is prerendered only if something links to it,
   so add it to `nitro.prerender.routes` if nothing does.
6. **Wire it up:** add the path to `server/routes/sitemap.xml.ts` if it doesn't come from the `docs` or
   `news` collections. If markdown links to a Vue-only page, add it to `extraRoutes` in
   `scripts/check-content.mjs`, otherwise `check-content` reports the link as broken. Site search
   (`/search.json`) covers docs only.
7. **Check it:** run `yarn verify` and the sub-path build. Look at phone, tablet and desktop widths with
   the mobile menu open, and confirm the right header item lights up.

## Conventions

`type` over `interface`; const objects over enums; arrow functions. Tailwind utilities; theme tokens
and global/prose overrides in `app/assets/css/main.css` (Tailwind 4: `@theme`, no
`tailwind.config.js`). ESLint stylistic: no semicolons, single quotes, no trailing commas
(`yarn lint:fix`). Before any design or animation work, read the next two sections.

## Design language: playful, lunar, real

The site has a moon-and-space theme that is **playful but tasteful**, and the play is always built on
something real. Keep new work in this spirit.

**Principles**

- **Metaphors from the subject, backed by real data.** The news log marks each post with the moon's
  actual phase on its publish date; the arrivals board shows real module updates, with who landed
  them; the docs are a flight plan through the real reading order. No decorative fakes.
- **One orchestrated moment per section**, not effects everywhere: the hero moonrise, the news orbit
  drawing itself, the docs trajectory, the board flapping into place, the constellation drawing in.
  Small rare surprises are welcome (the once-per-session shooting star).
- **Readability first.** Inter is the only typeface (semibold for the split-flap tiles). Lists of
  links get one item per row with a short description; avoid card grids and "mushed" inline links.
- **Fill the space, on every screen.** Check phone, tablet and desktop widths; components that scale
  (the arrivals board) size themselves to their container.
- **Works without JavaScript and with reduced motion**: render the final state on the server, then
  animate. Follow the iPhone rules below for anything that moves.
- **Palette:** gray-950 background, indigo/purple accents (indigo-200/300 for highlights), amber only
  as a warning light. Copy is plain and specific, with a light touch of the theme ("Side trips",
  "Arrivals at the moonbase", "In orbit → Descending → Landed").

**Building blocks** (reuse before inventing)

| Piece | Where |
| --- | --- |
| Hero moon (layered: static SVG + sliding shadow + halo) | `app/components/ui/LunarMoon.vue` |
| Moon at any phase, filter-free | `app/components/ui/MoonPhaseIcon.vue` + `app/utils/moonPhase.ts` |
| Earth | `app/components/ui/PlanetEarth.vue` |
| Dotted orbit that slides in / trajectory that wipes in | `app/pages/news/index.vue`, `app/pages/docs/index.vue` |
| Constellation with a draw-in | `app/components/sections/CommunitySection.vue` |
| Split-flap board engine | `app/components/sections/MoonbaseArrivals.vue` |
| Reading-progress moon | `app/pages/news/[...slug].vue` |
| Visited stops ("mission log", localStorage only) | `app/composables/useVisitedDocs.ts` |
| Hold intros until the page has settled | `app/composables/usePageSettled.ts` |
| Search-field button (⌘K) | `app/components/ui/SearchLauncher.vue` |

## Animations must stay smooth on iPhone (Safari / WebKit)

Every iOS browser uses WebKit. An animation that is perfectly smooth in desktop Chrome can run at a
few frames per second on an iPhone. We hit this with the hero moon's "first light" intro; these are
the rules that fixed it.

**What went wrong.** The intro moved a shadow circle *inside an SVG `<mask>`*, in an SVG that also used
`feGaussianBlur` and `feTurbulence` filters. WebKit cannot hand that to the GPU, so it re-rasterized the
whole filtered, masked SVG on the CPU every frame, at ~3× device pixel ratio: about three frames for the
whole animation.

**Rules**

1. **Animate only `transform` and `opacity`**, on elements that contain nothing expensive to repaint.
   These run on the compositor (GPU).
2. **Never animate anything inside an SVG `<mask>` or `<clipPath>`, or anything with SVG filters**
   (`feGaussianBlur`, `feTurbulence`, …), or the attributes of elements in such an SVG.
3. **Build animated visuals in layers:** draw the expensive parts once as a static SVG, and move a separate
   HTML element on top with `transform`. Example: `app/components/ui/LunarMoon.vue` (static lit surface,
   an HTML shadow disc with a gradient edge that slides, a static halo). A soft edge can be a
   `radial-gradient` instead of a blur filter.
4. **Ambient motion inside a masked or filtered parent** (e.g. `.hero-sky`, which has `mask-image`) must be
   its own small element with `will-change`, not part of the masked SVG. Example: the `.twinkle` stars in
   `app/components/sections/HeroSection.vue`.
5. **Don't fade a whole layered composition with `opacity`** when one layer is meant to be opaque (the moon
   hides the stars behind it). Group opacity makes it see-through. Dim the specific layers instead (the moon
   uses a `--moon-light` custom property for the lit surface and halo).
6. **Cold first loads are the worst case.** The browser is fetching and starting the app, swapping in fonts
   and painting filters (`feTurbulence`) for the first time. Hold intro animations paused until the page has
   settled: `load` + `document.fonts.ready` + two `requestAnimationFrame`s, capped at ~2.5 s
   (`isMoonReady` in `HeroSection.vue`). Start from `opacity: 0.001`, not `0`, so the layer is painted
   before it becomes visible. If JavaScript starts an animation, add a `<noscript>` fallback that shows the
   end state.
7. **Respect `prefers-reduced-motion`**: show the final state with no motion.

**Testing.** Playwright/Chromium cannot reproduce WebKit's frame rate; a smooth run there proves nothing
for iPhone. Test on a real iPhone, and test a cold load in a new private tab (empty cache) as well as a
reload.

### Revealing a drawing (a path that "draws itself")

Don't animate `stroke-dashoffset` or a mask. Wipe it in with two opposite transforms instead: a
clipping box (`overflow: hidden`) slides from `translateY(-100%)` to `0` while the drawing inside slides
from `translateY(100%)` to `0`. The drawing stays put and is uncovered from the top, using transforms
only. The box itself must clip, or the two transforms cancel out and nothing is hidden. Example: the
trajectory in `app/pages/docs/index.vue`. For a straight dotted line, sliding the dots in is enough
(the orbit in `app/pages/news/index.vue`).

### Related gotcha: `pathLength` with `vector-effect="non-scaling-stroke"`

Don't combine them on a line whose `stroke-dashoffset` you animate. Browsers then compute the dash in
screen pixels while `pathLength` assumes user units, so the dash repeats along the line instead of
drawing it once. The constellation in `CommunitySection.vue` reveals its dotted lines with a separate
mask "pen" line that has `pathLength` but no `non-scaling-stroke`.

## Other gotchas

- **Tailwind's `hidden` loses to a component's own `display`.** Tailwind 4 puts utilities in a
  cascade layer, and unlayered CSS (scoped `<style>` blocks, `main.css` overrides) beats any layer.
  If a component sets `display` on an element in its own CSS, hide or show it there too (media query),
  not with `hidden sm:flex`. See `.show-md` / `.show-lg` in `MoonbaseArrivals.vue`.
- **Nitro keeps cached server results on disk between local builds** (`defineCachedFunction`, here
  for an hour, in `node_modules/.cache/nuxt/.nuxt/cache/nitro/`). After changing what a cached
  function returns, delete that folder or a local `yarn generate` can bake in the old shape. CI always
  starts clean. Same idea for the content cache: delete `.data/content` after changing the
  reading-time hook in `nuxt.config.ts`.
- **`server/utils/moonbase.ts` is also run directly by Node** (`scripts/moonbase-feed.mjs`, in the
  moonbase-feed workflow, with no install). Keep it free of imports and of TypeScript that Node can't
  strip (no enums, namespaces or parameter properties).
- **Workflow files can't be pushed with `gh`'s default token** (it lacks the `workflow` scope); push
  over SSH or run `gh auth refresh -s workflow`.
