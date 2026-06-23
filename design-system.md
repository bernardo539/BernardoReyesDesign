# Design System — Bernardo Reyes Portfolio

Human-readable reference. All values extracted from source files.
For AI authoring rules, see `CLAUDE.md`.

---

## Colors

### Core palette

| Name | Value | Where it's used |
|---|---|---|
| Primary accent | `#645AFF` | CTAs, links, eyebrow labels, progress bars, stat values |
| Accent dark | `#4A40CC` | Hover state on primary buttons and accent text |
| Text primary | `#1A1A1A` | All headings, primary body copy |
| Text secondary | `#666666` | Supporting body copy, card descriptions, subtitles |
| Text tertiary | `#999999` | Captions, timestamps, muted labels |
| Surface default | `#FFFFFF` | Page background, card backgrounds |
| Surface subtle | `#FAFAF8` | Alternate section background (About, Outcomes), hover rows, code blocks |
| Border default | `#E5E5E2` | Cards, section dividers, table rows — always `0.5px solid` |
| Border interactive | `#D0D0CC` | Input fields, secondary button borders — always `0.5px solid` |

### Tints

| Name | Value | Where it's used |
|---|---|---|
| Accent subtle bg | `rgba(100,90,255,0.10)` | Pill/tag backgrounds, highlighted layer cards |
| Accent subtle border | `rgba(100,90,255,0.25)` | Pill/tag borders |
| Selection highlight | `rgba(100,90,255,0.18)` | `::selection` background |
| Nav background | `rgba(255,255,255,0.85)` | Sticky nav with `backdrop-filter: blur(12px)` |
| Locked badge | `rgba(255,255,255,0.14)` bg / `rgba(255,255,255,0.22)` border | Password badge on project card covers |

### Status colors

| Name | Value | Where it's used |
|---|---|---|
| Error | `#E24B4A` | Error messages, "before" state arrows |
| Success | `#1F9D63` | Resolved registry entries |
| Warning | `#C58A1A` | Open/pending registry entries |

### Rules
- **No box-shadows.** Elevation = border color change only.
- **No hardcoded colors** outside this palette.
- All borders are `0.5px` — not `1px`.

---

## Typography

Font family: **Plus Jakarta Sans**
Source: Google Fonts — weights 300, 400, 500, 600, 700

Monospace stack: `'SF Mono', 'Fira Code', ui-monospace, monospace`

### Scale

| Role | Size | Weight | Letter-spacing | Line-height | Color |
|---|---|---|---|---|---|
| Hero h1 | 52px | 700 | -0.04em | 1.05 | #1A1A1A |
| Hero h2 (subtitle) | 52px | 300 | -0.03em | 1.05 | #666666 |
| Case study h1 | 40px | 700 | -0.03em | 1.1 | #1A1A1A |
| Section h2 | 32px | 600 | -0.03em | 1.15 | #1A1A1A |
| Stat value (hero) | 32px | 600 | -0.03em | 1.15 | #1A1A1A |
| Stat value (outcome card) | 34px | 600 | -0.03em | 1.0 | #645AFF |
| Card h3 | 17px | 600 | -0.01em | 1.3 | #1A1A1A |
| Contact value | 17px | 500 | -0.01em | — | #1A1A1A |
| Body large | 18px | 400 | — | 1.5 | #666666 |
| Body | 15px | 400 | — | 1.65 | #666666 |
| Outcome label | 14px | 600 | — | — | #1A1A1A |
| Small / caption | 13px | 400 | — | 1.5 | #666666 or #999999 |
| Code / token | 12–13px | 400 | — | — | #666666 or #999999 |
| Eyebrow (accent) | 11px | 600 | 0.08em | — | #645AFF |
| Eyebrow (muted) | 11px | 600 | 0.08em | — | #999999 |
| Pill / badge | 11px | 500 | 0.02em | — | varies |

---

## Spacing

### Section padding

| Context | Top/Bottom | Left/Right |
|---|---|---|
| Hero (split) | 96px top, 64px bottom | 24px |
| Hero (centered) | 112px top, 72px bottom | 24px |
| Case study hero | 80px top, 56px bottom | 24px |
| Standard section | 48px–64px | 24px |
| Outcomes section | 64px | 24px |
| Contact section | 88px top, 96px bottom | 24px |

### Component spacing

| Element | Value |
|---|---|
| Nav height | 56px |
| Scroll margin top (sections) | 56px – 72px |
| Card padding | 24px |
| Small card / feature row | 14px – 20px |
| Gap between nav links | 24px |
| Gap between CTA buttons | 8px |
| Gap between stat items | 32px |
| Gap between cards (grid) | 24px |
| Gap between outcome cards | 14px |

### Max-widths

| Context | Value |
|---|---|
| Content (text, case study sections) | 720px |
| Wide (nav, project grid) | 960px |

---

## Border Radius

| Element | Radius |
|---|---|
| Pills, tags, badges, progress bars | 100px |
| Project cards, outcome cards, feature cards | 16px |
| Small feature blocks, governance cards | 12px |
| Buttons, inputs, code blocks | 10px |
| Inline chips, promo stage pills | 8px |

---

## Motion

### Scroll reveal
- Property: `opacity` (0→1) + `transform: translateY(16px→0)`
- Duration: `.6s`
- Easing: `ease`
- Trigger: `IntersectionObserver` at `threshold: 0.12`
- Fallback timeout: 1600ms (ensures content never stays hidden)
- Elements above the fold: left visible immediately (no animation)

### Hover transitions
- All interactive elements: `transition: all .15s` or `transition: color .15s`
- Card hover lift: `transform: translateY(-2px)` + border darkens from `#E5E5E2` → `#D0D0CC`
- Contact row hover: padding grows from `4px` → `12px` horizontal, background becomes `#FAFAF8`

---

## Layout System

### Grid
Project cards use CSS Grid with `repeat(auto-fit, minmax(300px, 1fr))` — responsive,
no breakpoints, no media queries.

Outcome metrics: `grid-template-columns: repeat(2,1fr)` — 2×2 fixed grid.

Hero stats: `display:flex; gap:32px; flex-wrap:wrap` — inline flex, wraps on small screens.

### No media queries
The layout handles narrow viewports through flex-wrap and auto-fit grids.
Do not add `@media` breakpoints — this is by design.

### Sections
Every section uses a centered inner container:
```
max-width: 720px (or 960px for wide)
margin: 0 auto
padding: [vertical] 24px
```

The outer `<section>` can have a background color (`#FAFAF8`) or border
for visual separation. The inner div constrains the content width.

---

## Component Reference

For full HTML code examples, see `CLAUDE.md → Design System — Component Patterns`.

| Component | Radius | Border | Background |
|---|---|---|---|
| Primary CTA button | 10px | `0.5px solid #645AFF` | `#645AFF` |
| Secondary button | 10px | `0.5px solid #D0D0CC` | transparent |
| Accent pill | 100px | `0.5px solid rgba(100,90,255,0.25)` | `rgba(100,90,255,0.10)` |
| Neutral pill | 100px | `0.5px solid #E5E5E2` | `#F3F3F0` |
| Project card | 16px | `0.5px solid #E5E5E2` | `#FFFFFF` |
| Outcome card | 16px | `0.5px solid #E5E5E2` | `#FFFFFF` |
| Feature block | 16px | `0.5px solid #E5E5E2` | `#FFFFFF` |
| Code block | 10px | `0.5px solid #E5E5E2` | `#FAFAF8` |
| Password input | 10px | `0.5px solid #D0D0CC` | `#FFFFFF` |
| Progress bar (track) | 100px | none | `#F3F3F0` |
| Progress bar (fill) | 100px | none | `#645AFF` |

---

## Icon / Symbol Usage

No icon library. All symbols are Unicode or emoji:
- Arrow right: `→`
- Lock: `🔒` (used in project card password badges)
- Check: `✓` (used in component contract lists)
- Section arrows: `▼`
- Status: `✅` (resolved), `⚠` (open/warning)
