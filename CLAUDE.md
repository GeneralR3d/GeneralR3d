# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Two unrelated workstreams sharing one repo:

1. **Personal landing site** — Next.js 15 + TypeScript + Tailwind v4 single-page app at the repo root (`app/`, `components/`, `lib/`).
2. **README badge automation** — `scripts/update_readme.py` plus a GitHub Actions workflow that rewrites only the fenced `<!-- TECH_STACK_START -->...<!-- TECH_STACK_END -->` region of `README.md` on a daily schedule and on push to `main`. The rest of the README is hand-edited and must not be touched by the script.

## Commands

### Site

- `npm run dev` — Next dev server on `http://localhost:3000`
- `npm run build` — production build; runs type-check (treat as CI gate)
- `npm run start` — serve the built output
- `npm run lint` — Next's lint

No test runner is configured. Verify changes by running `npm run build` and exercising the page in the browser.

### README automation

- `GH_TOKEN=<token-with-repo-scope> python scripts/update_readme.py` — runs the same scan the workflow runs. Without a token, it falls back to the public-repos endpoint and will under-count.

The workflow (`.github/workflows/update-readme.yml`) uses the `PROFILE_TOKEN` secret and commits with `[skip ci]` to avoid self-retrigger. Local runs overwrite `README.md`; inspect the diff before committing.

## Architecture — site

### Theming (important — easy to break)

- `next-themes` with `attribute="class"` and `defaultTheme="dark"` (see `app/providers.tsx`). Toggle flips a `.dark` class on `<html>`.
- **Colors are NOT Tailwind's built-in dark variant.** They are CSS custom properties (`--bg`, `--fg`, `--fg-muted`, `--border`, `--accent`) defined in `app/globals.css` — the default block is **light mode**, the `.dark` block is dark mode. Components consume them using Tailwind v4 canonical syntax: `text-(--fg)` / `bg-(--bg-elev)` / `border-(--border)`. Don't use the older `text-[var(--fg)]` form — the linter will flag it. Don't introduce `dark:` variants — it bypasses the token system and the two schemes will drift.
- `<html suppressHydrationWarning>` is required by next-themes; keep it.
- `ThemeToggle` gates rendering on a `mounted` state to avoid hydration mismatch — preserve that pattern in any other component that reads `useTheme()`.

### Tailwind v4 specifics

- **No `tailwind.config.ts`.** Config is CSS-first via `@theme { ... }` in `app/globals.css`. Adding a new design token means adding a CSS variable there, not editing a JS config.
- PostCSS plugin is `@tailwindcss/postcss` (v4), not the v3 `tailwindcss` plugin.
- Canonical CSS-variable utility syntax is `text-(--accent)` / `bg-(--bg-elev)`, not `text-[var(--accent)]`. Likewise, `font-pixel` instead of `font-[family-name:var(--font-pixel)]`. The linter enforces this.

### Fonts

- Inter (body) and VT323 (retro-terminal pixel accent) loaded via `next/font/google` in `app/layout.tsx`, exposed as `--font-inter` / `--font-vt323`, aliased in `@theme` to `--font-sans` / `--font-pixel`.
- VT323 is brand-consistent with the GitHub profile README typing banner — don't swap it without reason. Use it for short accents (eyebrows, section labels, nav links, the Gmail pill email), not body copy.

### Page composition

`app/page.tsx` is a flat composition of `Navbar` → `Hero` → `Experience` → `Projects` → `Footer`. Section IDs (`#home`, `#experience`, `#projects`) are the nav targets; `scroll-padding-top: 5rem` in `globals.css` keeps the sticky nav from covering jumped-to headings. `Blogs` in the nav is intentionally inert (empty href, `aria-disabled`, dimmer styling) — don't wire it up to a route yet.

### Content = `lib/data.ts`

`experiences`, `projects`, and `socialLinks` are the single source of truth for all content and external URLs.

- `Experience` shape: `{ company, role, period, location, bullets: string[], tags: string[], gradient }`. `gradient` is a Tailwind gradient fragment used as both a decorative line in the sticky panel and the `bg-gradient-to-br` overlay in `ExperienceCard`.
- `Project` shape: `{ name, description, image, link }`. `image` is a local path under `public/images/`; `link` is an external URL (GitHub or live site).
- `ExperienceCard.tsx` — compact card variant with a **mosaic pixel-reveal** click interaction (see below). Not used by the main Experience section, which has its own inlined layout.
- `ProjectCard.tsx` is unused — the Projects section renders via `CategoryList`.

### Hero UX contract

`components/Hero.tsx` is a scroll-driven scene. The `<section>` is `min-h-[200vh]`; inside it, a `sticky top-16` viewport div holds all visuals so the hero occupies 100vh of screen space while providing 100vh of scroll travel.

**Scroll animations** — all driven by `useScroll({ target: sectionRef, offset: ["start start", "end end"] })`:
- Entire text block translates top → bottom (`0vh` → `50vh`) over the full scroll range.
- The name `"Ding Ren"` scales `1 → 2.2×` over the full range via a wrapping `motion.div`.
- Eyebrow label slides up (`-40px`) and description slides down (`+40px`), both fading to opacity 0, over `[0, 0.35]` — clearing the stage before the name disperses.
- `TextDisperse` on the name is active between `[0.4, 0.7]` scroll progress (driven by `useMotionValueEvent`, not hover).

**Pixel trail** — disabled as soon as `window.scrollY > 0` (`hasScrolled` state). While at the top:
- **Outside text block** — `PixelTrail` runs normally (accent pixels trail behind cursor, 500 ms fade delay).
- **Inside text block** — trail layer fades out; a single grid-snapped accent pixel highlights under the cursor. Both share the same `GooeyFilter`. The content div is `pointer-events-none`; the sticky viewport's `onMouseMove` drives all state. Cursor pixel coordinates are computed relative to `viewportRef`, not `sectionRef`.

### GmailPill UX contract

`components/GmailPill.tsx` implements a specific interaction: collapsed icon → click expands into a rounded pill showing the email in VT323 → clicking the email copies to clipboard with a "copied ✓" flash → click-outside **or** Esc collapses. Preserve all four behaviors if refactoring.

### Experience section UX contract

`components/Experience.tsx` is a Client Component with a **scroll-linked sticky layout** on md+ screens:
- **Left panel (sticky):** `TextRotate` animates company names character-by-character as the user scrolls. Role/location/period fade-swap via `AnimatePresence`. A pill progress bar shows the current index. The accent gradient line changes color per company.
- **Right column (scrollable):** Each `ExperienceItem` is `min-h-[85vh]` so one entry is in focus at a time. `useInView` with `margin: "-49% 0px -49% 0px"` fires the in-view callback, which calls `textRotateRef.current?.jumpTo(index)` to sync the sticky panel. Items outside view are dimmed (`opacity-40`). **Clicking an `ExperienceItem` triggers the mosaic reveal** (see below).
- **Mobile fallback:** `MobileCard` components — same mosaic reveal, no sticky panel, no TextRotate.

Do not add `auto` or `loop` to the `TextRotate` in this component — it is driven entirely by scroll position.

### Mosaic pixel-reveal interaction

Used in both `Experience.tsx` (`ExperienceItem`, `MobileCard`) and `ExperienceCard.tsx`. Clicking a card toggles a `revealed` boolean. When true, `AnimatePresence` mounts a `MosaicReveal` overlay (absolute inset-0, z-10) containing:
1. An image layer (currently a `bg-blue-500` placeholder — swap for `<Image>` when assets are ready).
2. A 14×10 grid of `motion.div` cells styled `bg-(--bg-elev)`, each with a random delay (up to 0.55s). They animate `opacity: 1 → 0` on mount (dissolving to reveal the image) and `opacity: 0 → 1` on exit (re-covering it). `initial/animate/exit` are all set so `AnimatePresence` handles both directions correctly.

The `MosaicReveal` component is defined inline in `Experience.tsx`; `ExperienceCard.tsx` has its own equivalent inline. Cell delays are generated once via `useMemo` per component instance. The article must have `relative overflow-hidden` for the overlay to be clipped correctly.

### Projects section

`components/Projects.tsx` maps `projects` from `lib/data.ts` into `Category[]` and renders them via `CategoryList`. The pixel-font `// Things I've built` heading is rendered in the section wrapper — **not** passed as a prop to `CategoryList`.

### UI primitives (`components/ui/`)

- `CategoryList` — hover-expanding list of items. Each `CategoryRow` is `relative overflow-hidden`; two image cards sit absolutely outside the container at `right: 100%` and `left: 100%`. On hover, the row detects which half the cursor is in and slides the row and the relevant image card together via `translateX`. Image card width is measured via `useLayoutEffect` + `ResizeObserver` (width = container height × 16/9). `Category` shape: `{ id, title, subtitle?, image?, icon?, onClick?, featured? }`. Pass `featured: true` on the first item for a larger title. The header block (title/subtitle/headerIcon) only renders when at least one of those props is provided — omit all three when the section heading is rendered outside the component.
- `GooeyFilter` — renders a hidden SVG `<filter>` referenced via `style={{ filter: "url(#<id>)" }}`. Place it as a sibling of the element that uses it, not inside.
- `PixelTrail` — `framer-motion` + `uuid` interactive grid that animates cells on mouse-move. Depends on `components/hooks/use-debounced-dimensions.ts` and `lib/utils.ts:cn`. Must be a Client Component; parent must also be a Client Component if passing reactive props.
- `TextRotate` — animates between strings character-by-character. Exposes `TextRotateRef` with `{ next, previous, jumpTo, reset }`. Set `auto={false}` when driving from scroll. Imports from `framer-motion` (not `motion/react`) — that's the installed package.
- `TextDisperse` — scatters characters to pre-set offsets/rotations when `dispersed={true}`. Fully externally controlled via the `dispersed` prop. The `transforms` array has 13 entries; characters wrap via `i % transforms.length`.

`hooks/use-screen-size.ts` returns a `ComparableScreenSize` with `.lessThan()` / `.greaterThan()` — use those instead of comparing the string value directly.

`lib/utils.ts` exports a minimal `cn(...classes)` helper (no `clsx`/`tailwind-merge` dependency).

### Gotchas

- **`SectionHeading.tsx`** uses deprecated v3 syntax (`font-[family-name:var(--font-pixel)]`, `text-[var(--accent)]`). Do not copy its patterns — use v4 canonical forms everywhere else.
- **`SiLinkedin`** is not exported from `react-icons/si` (trademark removal). Use `FaLinkedin` from `react-icons/fa6` instead. `SiGithub`, `SiSubstack`, `SiGmail` are fine.

## Architecture — README automation (`scripts/update_readme.py`)

- Uses only Python stdlib (`urllib`, `base64`, `json`, `re`) — no `pip install` step in the workflow.
- Authenticates against `/user/repos?affiliation=owner` when `GH_TOKEN` is set (includes private repos), falls back to `/users/GeneralR3d/repos` (public only) otherwise.
- **Languages** come from each repo's primary-language field; **frameworks** come from scanning manifest files (`package.json`, `requirements.txt`/`pyproject.toml`/`setup.py`, `go.mod`) at the repo root plus a short allow-list of monorepo subdirs (`frontend/`, `backend/`, `client/`, `server/`, `app/`, `web/`). To support a new framework, add a row to the relevant list in `FRAMEWORK_RULES` — label, color hex, simple-icons slug, logo color, and one of the `backend` / `frontend` / `data` categories.
- **Infra row** (Docker, GitHub Actions, Linux, Azure, Render, Supabase, Vercel) is static by design in `README.md`. Do not move it inside the `TECH_STACK_START/END` markers.
- The script replaces **only** the content between those markers; everything else in `README.md` is hand-authored.
