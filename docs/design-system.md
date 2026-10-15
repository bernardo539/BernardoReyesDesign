# Design System — br. (Bernardo Reyes Portfolio)

Human-readable reference for the br. design system as it is implemented on the site.
For AI authoring rules and DC runtime patterns, see `CLAUDE.md`.

Sources of truth, in order:
1. `docs/br-design-tokens.md` — the token spec (primitives, rationale, contrast, open decisions)
2. `assets/css/tokens.css` — Mode + Semantic tokens as CSS custom properties, plus `.br-text-*` styles
3. `assets/css/components.css` — `.br-*` component classes built only from Semantic tokens

If this file disagrees with those, they win. Fix this file.

---

## Architecture

Every token goes through three layers. Components never consume primitives.

```
primitive  →  mode  →  semantic
(raw value)   (changes per mode)   (role in the UI / component)
```

- **Primitive** — raw ramps and scales (`lime.200 = #CAFF00`). Only documented in `br-design-tokens.md`;
  not exposed in CSS. Their values are inlined into the Mode layer with the primitive name in a comment.
- **Mode** — aliases that change per context. Exposed as `--br-*` variables.
- **Semantic** — roles that components consume (`--br-color-button-primary-bg`). Reference Mode only.

**Naming:** `--br-{category}-{role}-{variant}-{state}`, e.g. `--br-color-button-primary-bg-hover`.

**Rule of 4:** everything spatial (spacing, sizing, radius, line-height, icons) is a multiple of 4.
Documented exceptions: border width (1, 2) and `--br-radius-pill`.

### Modes

| Mode axis | Values | How it switches |
|---|---|---|
| Color | `light` (default) / `dark` | `[data-theme="dark"]` on `<html>` |
| Layout | `desktop` (default) / `mobile` | `@media (max-width: 819px)` inside `tokens.css` (provisional `bp.md` 820) |
| Motion | `default` / `reduced` | `@media (prefers-reduced-motion: reduce)` inside `tokens.css` |

Pages don't set a theme today, so everything renders light. Dark values exist and every new
component must still work in both.

---

## Colors

Brand: lime `#CAFF00` (`lime.200`) and teal `#00312D` (`teal.950`). Light is the default mode,
so lime appears as a **surface** (primary button, highlight card, accent chip, selection), not as text.

### Mode tokens

| Token | Light | Dark | Use |
|---|---|---|---|
| `--br-color-bg-canvas` | `#EFF5F4` neutral.100 | `#0B201E` teal.1000 | Page background |
| `--br-color-bg-surface` | `#FAFDFC` neutral.25 | `#133734` teal.900 | Cards, About section, diagram boxes |
| `--br-color-bg-subtle` | `#DEE9E7` neutral.200 | `#1D4541` teal.850 | Neutral chips, hover rows, nav-item hover |
| `--br-color-bg-inverse` | `#00312D` teal.950 | `#CAFF00` lime.200 | Feature card, cover fallback, active nav item |
| `--br-color-border-default` | `#DEE9E7` neutral.200 | `#2A534E` teal.800 | Cards, dividers, section rules |
| `--br-color-border-strong` | `#618D88` teal.600 | `#618D88` teal.600 | Card hover border |
| `--br-color-text-primary` | `#00312D` teal.950 | `#ECFFFC` teal.50 | Headings, primary copy |
| `--br-color-text-secondary` | `#446F6A` teal.700 | `#9FC7C2` teal.400 | Body copy, captions, meta labels |
| `--br-color-text-disabled` | `#9AA4A2` neutral.500 | `#618D88` teal.600 | Decorative only (not AA on purpose) |
| `--br-color-text-inverse` | `#CAFF00` lime.200 | `#00312D` teal.950 | Text on `bg-inverse` |
| `--br-color-text-inverse-muted` | `#B9DDD8` teal.300 | `#405300` lime.800 | Secondary text on `bg-inverse` |
| `--br-color-text-link` | `#587100` lime.700 | `#CAFF00` lime.200 | Inline links, diagram arrows |
| `--br-color-accent-default` | `#CAFF00` lime.200 | `#CAFF00` lime.200 | Accent surface |
| `--br-color-accent-hover` | `#A5D100` lime.400 | `#E6FFB7` lime.100 | Accent surface hover |
| `--br-color-accent-pressed` | `#8CB200` lime.500 | `#BDE751` lime.300 | Accent surface pressed |
| `--br-color-on-accent` | `#00312D` teal.950 | `#00312D` teal.950 | Text/icons on accent |
| `--br-color-focus-ring` | `#00312D` teal.950 | `#CAFF00` lime.200 | Focus outline, focused input border |

**Hard rule:** in light mode `--br-color-accent-default` is never text, icon or border on canvas or
surface (1.2:1 contrast). It is a surface only. Use `--br-color-text-link` for lime-ish text.

### Status

`--br-color-status-{success|warning|danger|info}-{bg|text|border}`

| Status | Ramp | Light bg / text / border | Dark bg / text / border |
|---|---|---|---|
| success | green (hue 150, kept apart from lime) | 100 / 700 / 300 | 900 / 300 / 700 |
| warning | amber | 100 / 700 / 300 | 900 / 300 / 700 |
| danger | red | 100 / 700 / 300 | 900 / 300 / 700 |
| info | blue | 100 / 700 / 300 | 900 / 300 / 700 |

Used on the site for: password error (`danger-text`), "Copied ✓" email state (`success-text`),
registry status in case studies (`success-text`, `warning-text`).

### Semantic color

| Token | → Mode |
|---|---|
| `--br-color-page-bg` | bg-canvas |
| `--br-color-card-bg` / `-card-border` | bg-surface / border-default |
| `--br-color-card-feature-bg` / `-fg` / `-fg-muted` | bg-inverse / text-inverse / text-inverse-muted |
| `--br-color-card-highlight-bg` / `-fg` | accent-default / on-accent |
| `--br-color-button-primary-bg` / `-bg-hover` / `-bg-pressed` / `-fg` | accent-default / accent-hover / accent-pressed / on-accent |
| `--br-color-button-secondary-bg` / `-border` / `-border-hover` / `-fg` | bg-surface / border-default / text-secondary / text-primary |
| `--br-color-nav-item-fg` / `-bg-hover` | text-primary / bg-subtle |
| `--br-color-nav-item-active-bg` / `-fg` | bg-inverse / text-inverse |
| `--br-color-link-fg` | text-link |
| `--br-color-input-bg` / `-border` / `-border-focus` / `-placeholder` | bg-surface / border-default / focus-ring / text-secondary |
| `--br-color-alert-{x}-bg` / `-fg` / `-border` | status-{x}-bg / -text / -border |
| `--br-color-icon-default` / `-muted` / `-on-accent` | text-primary / text-secondary / on-accent |

### Rules
- **No hex or rgb in markup.** Every color is a `--br-*` variable. The only exception today is the
  white translucent text and "Coming soon" badge sitting on photographic project covers in `index.html`.
- **Flat, no box-shadows.** Depth comes from border color and surface changes.
- **Borders are 1px** (`--br-border-width-default`); 2px (`--br-border-width-strong`) is for focus rings.

---

## Typography

| Family | Token | Role | Weights loaded |
|---|---|---|---|
| **Fira Sans** | `--br-font-family-accent` | Display, headings, button/nav/chip labels | 400, 500, 700, 800 |
| **Plus Jakarta Sans** | `--br-font-family-body` | All reading text | 400, 500 |
| **Fira Mono** | `--br-font-family-mono` | Meta labels (eyebrows, dates, tags, stat captions) | 400 |

Fira Sans + Fira Mono load from a `<link>` in each page's `<head>`; Plus Jakarta Sans loads in `<helmet>`.

Weights: `--br-font-weight-{regular|medium|semibold|bold|extrabold}` = 400/500/600/700/800.
Tracking: `--br-font-tracking-{tighter|tight|snug|normal|wide}` = −0.03em/−0.02em/−0.01em/0/0.04em.

### Scale (Mode: desktop / mobile)

Each step exposes `--br-font-{step}-size` and `--br-font-{step}-line-height`.

| Step | Desktop size / lh | Mobile size / lh |
|---|---|---|
| `display-lg` | 96 / 96 | 56 / 56 |
| `display-md` | 72 / 72 | 44 / 48 |
| `heading-lg` | 40 / 48 | 32 / 40 |
| `heading-md` | 32 / 40 | 24 / 32 |
| `heading-sm` | 24 / 32 | 20 / 28 |
| `body-lg` | 18 / 28 | 18 / 28 |
| `body-md` | 16 / 24 | 16 / 24 |
| `body-sm` | 14 / 20 | 14 / 20 |
| `caption-md` | 12 / 16 | 12 / 16 |
| `label-md` | 16 / 24 | 16 / 24 |
| `label-sm` | 14 / 20 | 14 / 20 |

12px is the minimum for any text.

### Text style classes (Semantic)

Composite type styles live as classes in `tokens.css`. Use these instead of setting
font-family/size/weight by hand.

| Class | Family | Step | Weight | Tracking | Used for |
|---|---|---|---|---|---|
| `.br-text-hero-title` | accent | display-lg | 800 | tighter | Name in the home hero |
| `.br-text-stat-value` | accent | display-md | 800 | tighter | Hero stats ("8+", "95%") |
| `.br-text-page-title` | accent | heading-lg | 700 | tight | Case study h1, hero subtitle |
| `.br-text-section-title` | accent | heading-md | 700 | tight | Section h2 |
| `.br-text-card-title` | accent | heading-sm | 500 | snug | Card h3, contact values, `br.` logo |
| `.br-text-page-body` | body | body-lg | 400 | — | Long-form paragraphs |
| `.br-text-card-body` | body | body-md | 400 | — | Card descriptions |
| `.br-text-button-label` / `.br-text-nav-label` | accent | label-md | 500 | — | Buttons, nav items |
| `.br-text-chip-label` | accent | label-sm | 500 | — | Chips, diagram labels |
| `.br-text-meta-label` | mono | caption-md | 400 | — | Eyebrows, dates, footer, stat captions |
| `.br-text-input-helper` | accent | caption-md | 500 | wide | Input helper text |

Eyebrow pattern: `.br-text-meta-label` + `text-transform:uppercase; letter-spacing:var(--br-font-tracking-wide); color:var(--br-color-text-secondary)`.

---

## Spacing

### Mode (desktop / mobile)

| Token | Desktop | Mobile |
|---|---|---|
| `--br-space-inset-xs` | 4 | 4 |
| `--br-space-inset-sm` | 8 | 8 |
| `--br-space-inset-md` | 16 | 12 |
| `--br-space-inset-lg` | 24 | 20 |
| `--br-space-inset-xl` | 32 | 24 |
| `--br-space-gap-xs` | 4 | 4 |
| `--br-space-gap-sm` | 8 | 8 |
| `--br-space-gap-md` | 12 | 12 |
| `--br-space-gap-lg` | 20 | 16 |
| `--br-space-gap-xl` | 32 | 24 |
| `--br-space-section` | 96 | 64 |
| `--br-space-gutter-page` | 32 | 16 |

### Semantic

| Token | → Mode |
|---|---|
| `--br-space-card-padding` | inset-xl |
| `--br-space-card-content-gap` / `--br-space-bento-gap` | gap-lg |
| `--br-space-button-padding-x` / `-y` | inset-md / inset-sm |
| `--br-space-nav-padding` / `--br-space-nav-item-gap` | inset-xs / gap-xs |
| `--br-space-stack-tight` / `-default` / `-loose` | gap-sm / gap-md / gap-xl |
| `--br-space-page-padding-x` | gutter-page |
| `--br-space-section-spacing` | section |

Sections use `padding: var(--br-space-section-spacing) var(--br-space-page-padding-x)`.

---

## Border Radius

| Mode token | Desktop | Mobile |
|---|---|---|
| `--br-radius-sm` | 8 | 8 |
| `--br-radius-md` | 16 | 12 |
| `--br-radius-lg` | 24 | 20 |
| `--br-radius-xl` | 32 | 24 |
| `--br-radius-pill` | 9999 | 9999 |

| Semantic token | → Mode | Element |
|---|---|---|
| `--br-radius-card` | xl | Cards, outcome cards, case-study diagram containers |
| `--br-radius-mockup-inner` | lg | Mockups inside cards |
| `--br-radius-icon-tile` | md | Icon tiles |
| `--br-radius-button` / `-nav` / `-chip` | pill | Buttons, nav items, chips |
| `--br-radius-input` / `-swatch` | sm | Inputs, swatches |

Case-study diagrams with no semantic role yet use Mode radii directly: `--br-radius-md` for
layer rows and pipeline steps, `--br-radius-sm` for small boxes, `--br-radius-pill` for progress bars.

---

## Sizing & icons

| Token | Desktop | Mobile |
|---|---|---|
| `--br-size-control-sm` | 32 | 40 |
| `--br-size-control-md` | 44 | 44 |
| `--br-size-control-lg` | 48 | 48 |
| `--br-size-avatar-lg` | 150 | 96 |

Semantic: `--br-size-button-height` and `--br-size-nav-item-height` = control-md (44, also
`--br-size-hit-area-min`), `--br-size-input-height` = control-lg, `--br-size-icon-tile` = 64.

Icons (Gravity UI, planned): `--br-icon-{sm|md|lg|xl}` = 16/20/24/32 (md is 24 on mobile);
semantic `--br-icon-inline|button|nav|tile|arrow`. The site currently uses Unicode symbols
(`→`, `←`, `↓`, `✓`, `✕`, `✅`, `⚠`) colored with `--br-color-icon-*` or text tokens.

---

## Motion

| Mode token | Default | Reduced |
|---|---|---|
| `--br-duration-instant` | 100ms | 0ms |
| `--br-duration-fast` | 200ms | 0ms |
| `--br-duration-base` | 300ms | 100ms (opacity only) |
| `--br-duration-slow` | 600ms | 100ms |
| `--br-duration-loader-cycle` | 800ms | 800ms |
| `--br-motion-distance` | 8px | 0px |
| `--br-motion-scale` | 0.97 | 1 |

Easings: `--br-easing-{linear|standard|enter|exit|emphasized}`.

| Semantic transition | = duration + easing | Used by |
|---|---|---|
| `--br-transition-hover` | fast + standard | Color/border/background hover on every component |
| `--br-transition-press` | instant + standard | `.br-btn:active` scale |
| `--br-transition-card-filter` | base + standard | Dimming cards (planned) |
| `--br-transition-theme-switch` | base + standard | `body` background/color |
| `--br-transition-enter` | slow + enter | Scroll reveal |
| `--br-transition-exit` | fast + exit | Exits |
| `--br-transition-loader` | loader-cycle + linear | Loaders (planned) |

**Scroll reveal:** elements with `data-reveal` below the fold start at `opacity:0` and
`translateY(var(--br-motion-distance))`, then animate with `--br-transition-enter` when an
`IntersectionObserver` fires (1600ms fallback). Above-the-fold elements stay visible.

**Hover:** cards lift `translateY(calc(var(--br-motion-distance) / -4))` and switch to
`--br-color-border-strong`; buttons scale to `--br-motion-scale` on press; contact rows grow
horizontal padding and fill with `--br-color-bg-subtle`. Reduced motion zeroes all of this out.

---

## Provisional tokens

Proposed in `br-design-tokens.md §9`, exposed in CSS, not closed yet:

| Token | Value |
|---|---|
| `--br-border-width-default` / `-strong` | 1px / 2px |
| `--br-opacity-dim` / `-disabled` / `-scrim` | 0.25 / 0.4 / 0.6 |
| `--br-z-base` / `-sticky` / `-overlay` / `-modal` / `-toast` | 0 / 100 / 200 / 300 / 400 |
| `--br-layout-container` | 1100px (not used yet; pages use 720px / 960px) |

---

## Layout

- **Max-widths:** 720px for text and case-study sections, 960px for nav, home hero, project grid, footer.
- **Responsive:** handled by the mobile mode in `tokens.css` (type, spacing, radius, sizing shrink
  below 820px) plus flex-wrap and auto-fit grids. Adding `@media` is allowed when a layout truly
  needs it; use `max-width: 819px` to stay aligned with the mobile mode.
- **Project grid:** `repeat(auto-fit, minmax(280px, 1fr))` with `--br-space-bento-gap`.
- **Case study hero metrics:** `repeat(4, 1fr)` grid of `.br-text-stat-value` + caption.
- **Sticky nav:** `z-index: var(--br-z-sticky)`, background
  `color-mix(in srgb, var(--br-color-page-bg) 85%, transparent)` with `backdrop-filter: blur(12px)`,
  1px bottom border.
- **Anchored sections:** `scroll-margin-top` 56–72px to clear the nav.

---

## Component Reference

All in `assets/css/components.css`, built only from Semantic tokens, with native
`:hover` / `:active` / `:focus` (no `style-hover`). Pair each component with a `.br-text-*` class
for its label. Full markup examples: `CLAUDE.md → Component Patterns`.

| Class | What it is | Key tokens |
|---|---|---|
| `.br-btn` | Pill button base: 44px tall, 1px border, press scale | `--br-size-button-height`, `--br-radius-button` |
| `.br-btn--primary` | Lime button, teal label | `--br-color-button-primary-*` |
| `.br-btn--secondary` | Surface button with border; border darkens on hover | `--br-color-button-secondary-*` |
| `.br-nav-item` | Pill nav link, subtle fill on hover | `--br-color-nav-item-*`, `--br-radius-nav` |
| `.br-chip` | Neutral pill tag | `--br-color-bg-subtle`, `--br-radius-chip` |
| `.br-chip--accent` | Lime pill tag (stack, case-study category) | `--br-color-card-highlight-*` |
| `.br-card` | Surface card, 1px border, `xl` radius; `a.br-card` lifts on hover | `--br-color-card-*`, `--br-radius-card` |
| `.br-row` | Contact list row with bottom rule; grows and fills on hover | `--br-color-border-default`, `--br-color-bg-subtle` |
| `.br-input` | 48px text input; focus border = focus ring | `--br-color-input-*`, `--br-radius-input` |

Base styles in the same file: `html`/`body` background and color, `::selection` (lime with teal
text), and a global `:focus-visible` outline (2px `--br-color-focus-ring`, 2px offset).

Patterns built inline from tokens (no class yet): sticky nav, section eyebrow, hero stats,
case-study diagrams (highlighted step = `--br-color-card-highlight-bg` + `--br-color-on-accent`),
outcome cards, footers.
