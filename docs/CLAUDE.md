# CLAUDE.md — Design Composer Runtime & br. Design System Reference

This file is the authoritative source of truth for AI-assisted authoring on this repo.
All values come from the live source files. Do not invent values.

Design system sources of truth: `docs/br-design-tokens.md` (spec), `assets/css/tokens.css`
(tokens + text styles), `assets/css/components.css` (component classes). Human-readable
summary: `docs/design-system.md`.

---

## What this repo is

A GitHub Pages portfolio site for Bernardo Reyes, Senior Product Designer.
Built with Design Composer (DC) — `.html` files containing an `<x-dc>` component, rendered by
`support.js`, a compiled React 18 runtime that runs entirely in the browser.

**No build step. No npm. No framework imports.**

---

## File structure rules

```
/
├── index.html                  ← portfolio homepage
├── Fitune-Case-Study.html      ← Fitune case study
├── Guros-Case-Study.html       ← Guros case study
├── Axcess-Case-Study.html      ← Axcess · Syscap case study
├── support.js                  ← DC runtime — NEVER MODIFY
├── CNAME                       ← custom domain (bernardoreyesdesign.com)
├── README.md
├── docs/
│   ├── CLAUDE.md               ← this file
│   ├── design-system.md        ← human-readable DS reference
│   └── br-design-tokens.md     ← br. token spec (primitives, modes, rationale)
├── assets/
│   ├── css/
│   │   ├── tokens.css          ← Mode + Semantic tokens, .br-text-* styles
│   │   └── components.css      ← .br-btn, .br-chip, .br-card, .br-row, .br-input, .br-nav-item
│   ├── docs/                   ← CV PDFs
│   └── images/
│       ├── covers/             ← project card cover images
│       ├── axcess/
│       └── guros/
└── .gitignore
```

**Hard rules:**
- `support.js` is never modified under any circumstances
- All DC pages live at root level — DC sibling fetch requires same directory
- New case studies are named `[ProjectName]-Case-Study.html` (PascalCase name, hyphens, no spaces)
- Every page links `assets/css/tokens.css` and `assets/css/components.css` in `<head>`
- Never add npm, webpack, vite, or any build tooling
- No external JS libraries beyond what support.js already loads (React 18 from unpkg)

---

## DC Runtime — Architecture

`support.js` is a compiled React 18 runtime. Each page is a self-contained
Design Composer component with three parts:

1. **`<x-dc>` block** — the HTML template (supports DC directives)
2. **`<script type="text/x-dc" data-dc-script>` block** — the component logic class
3. **`data-props` attribute** — prop schema as JSON

### Boot sequence
1. Browser loads the page; `<head>` loads fonts, `tokens.css`, `components.css`, `support.js`
2. `support.js` loads React 18 from unpkg (CDN)
3. Runtime parses `<x-dc>` and the logic script
4. Mounts a React root into `#dc-root`
5. `renderVals()` populates template variables

---

## DC Runtime — Template Directives

### `{{ expression }}` — interpolation
Renders a value from `renderVals()`. Supports dot paths, negation and simple equality checks.

```html
<div>{{ item.label }}</div>
<div>{{ count }}</div>
<sc-if value="{{ !c.copyEmail }}">…</sc-if>
```

**The parser cannot handle `var()` inside a `{{ }}` expression.** A ternary or string literal
like `{{ copied ? 'var(--br-color-status-success-text)' : 'var(--br-color-icon-default)' }}`
breaks. Compute the value in `renderVals()` and interpolate the plain variable instead:

```javascript
// renderVals()
emailIconColor: this.state.emailCopied
  ? 'var(--br-color-status-success-text)'
  : 'var(--br-color-icon-default)',
```
```html
<span style="color:{{ emailIconColor }};">{{ emailIconText }}</span>
```

Interpolating a string that *contains* `var()` is fine (`background:{{ L.bg }}` where
`L.bg = 'var(--br-color-bg-surface)'`). Only expressions written inside the braces are a problem.

### `sc-for` — list rendering
```html
<sc-for list="{{ items }}" as="item" hint-placeholder-count="3">
  <div>{{ item.label }}</div>
  <div>{{ item.value }}</div>
</sc-for>
```
- `list` — array from `renderVals()`
- `as` — loop variable name
- `hint-placeholder-count` — number of placeholder slots shown during streaming

### `sc-if` — conditional rendering
```html
<sc-if value="{{ condition }}" hint-placeholder-val="{{ false }}">
  <div>shown when true</div>
</sc-if>
```
- `value` — expression from `renderVals()`
- `hint-placeholder-val` — value shown during streaming (before JS evaluates)

### `style-hover` / `style-focus` — avoid
The runtime supports `style-hover="…"` and `style-focus="…"` (complete style strings, not diffs),
but the site no longer uses them. Hover, active and focus states come from the `.br-*` classes in
`components.css`, which use native `:hover` / `:active` / `:focus`. If a new interactive pattern
needs states, add a class to `components.css` built from Semantic tokens.

### `<helmet>` — head injection
Injects `<link>`, `<style>`, `<meta>`, or `<script>` tags into `<head>`.
Runs once per component mount. Used for Plus Jakarta Sans and a small reset; tokens and
components are linked in the real `<head>` instead.

```html
<helmet>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500&amp;display=swap" rel="stylesheet">
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    body{-webkit-font-smoothing:antialiased;}
    a{color:inherit;text-decoration:none;}
  </style>
</helmet>
```

Do not set `background`, `color` or `font-family` on `body` here — `components.css` does that
from tokens.

---
## DC Runtime — Logic Class

Every DC page has a logic class that extends `DCLogic`.

```javascript
class Component extends DCLogic {
  // Optional: initial state
  state = { unlocked: false, error: false };

  // Required: return all template variables
  renderVals() {
    return {
      items: [...],
      condition: this.state.show,
      handleClick: () => this.setState({ show: true }),
    };
  }

  // Optional lifecycle hooks
  componentDidMount() { /* runs after first render */ }
  componentDidUpdate(prevProps) { /* runs after re-render */ }
  componentWillUnmount() { /* cleanup */ }
}
```

### State
```javascript
// Set state (triggers re-render)
this.setState({ key: value });

// Read state
this.state.key

// Read props (from data-props schema)
this.props.propName
```

### Props schema (data-props attribute)
```json
{
  "$preview": { "width": 960, "height": 900 },
  "heroVariant": {
    "editor": "enum",
    "options": ["split", "centered"],
    "default": "split",
    "tsType": "'split' | 'centered'"
  },
  "revealMotion": {
    "editor": "boolean",
    "default": false,
    "tsType": "boolean"
  }
}
```

### Events in templates
```html
<!-- In template -->
<button onClick="{{ handleClick }}">Submit</button>
<input onKeyDown="{{ onKey }}" />

<!-- In renderVals() -->
renderVals() {
  return {
    handleClick: () => this.setState({ submitted: true }),
    onKey: (e) => { if (e.key === 'Enter') this._submit(); },
  };
}
```

---

## DC Runtime — Scroll reveal pattern

Copy exactly — do not invent variations. Motion values come from tokens, so reduced motion
(`--br-motion-distance: 0px`, short durations) is handled for free.

`index.html` (no gated content, runs once):

```javascript
componentDidMount() {
  if (this.props.revealMotion === false) return;
  requestAnimationFrame(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const show = (el) => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < (window.innerHeight || 800) * 1.1) return; // above the fold: leave visible
      el.style.opacity = '0';
      el.style.transform = 'translateY(var(--br-motion-distance))';
      el.style.transition = 'opacity var(--br-transition-enter), transform var(--br-transition-enter)';
      io.observe(el);
      setTimeout(() => show(el), 1600);
    });
  });
}
```

Case studies use the same body inside `_observe()`, called from both `componentDidMount()` and
`componentDidUpdate()` so content revealed after unlocking the password gate is observed too.
It selects `[data-reveal]:not([data-seen])`, marks each element with `data-seen="1"`, and uses
`threshold: 0.1, rootMargin: '0px 0px -6% 0px'`. Copy it from `Fitune-Case-Study.html`.

Mark elements for reveal with `data-reveal=""`:
```html
<h2 class="br-text-section-title" data-reveal="">Section heading</h2>
<p class="br-text-page-body" data-reveal="" style="color:var(--br-color-text-secondary);">Body copy</p>
```

---

## Design System — Authoring rules

The br. system: lime `#CAFF00` + teal `#00312D`, Fira Sans (accent) + Plus Jakarta Sans (body) +
Fira Mono (meta), light mode by default, flat. Token tables live in `docs/design-system.md`;
the CSS is the source of truth.

1. **Only `--br-*` tokens.** Every color, font, size, spacing, radius, border width, z-index,
   duration and easing in markup or `renderVals()` is a `var(--br-*)`. Prefer Semantic tokens
   (`--br-color-card-bg`, `--br-space-card-padding`, `--br-radius-card`); fall back to Mode tokens
   (`--br-color-text-secondary`, `--br-space-gap-md`, `--br-radius-sm`) only when no Semantic role fits.
   Never reference primitive names; they don't exist in CSS.
2. **No hex, rgb or hsl in markup.** If a value is missing, add it to `tokens.css` (Mode, then
   Semantic) and to `br-design-tokens.md` first. The one existing exception is white translucent
   text/badges over photographic covers on `index.html` project cards.
3. **Lime is a surface in light mode.** `--br-color-accent-default` / `--br-color-card-highlight-bg`
   is never text, icon or border on canvas or surface. For lime-ish text use `--br-color-text-link`.
   Text on lime is `--br-color-on-accent` / `--br-color-card-highlight-fg`.
4. **Borders are 1px:** `var(--br-border-width-default) solid var(--br-color-border-default)`.
   `--br-border-width-strong` (2px) is for focus rings.
5. **Flat.** No `box-shadow`. Depth = border color + surface change.
6. **Use components and text styles first.** Reach for `.br-btn`, `.br-chip`, `.br-card`, `.br-row`,
   `.br-input`, `.br-nav-item` and `.br-text-*` before writing inline styles. Inline styles are for
   layout (flex, grid, margins) and one-off color overrides with tokens.
7. **`@media` is allowed.** Type, spacing, radius and sizing already switch to mobile values below
   820px inside `tokens.css`. Add a media query only when layout itself must change, and use
   `max-width: 819px` to stay aligned with the mobile mode. Put it in `components.css` or the page
   `<helmet>` `<style>`, not inline.
8. **No `var()` inside `{{ }}` expressions.** Compute token-dependent values in `renderVals()`
   (see Template Directives).
9. **Dark mode must work.** Colors switch on `[data-theme="dark"]` on `<html>`. No page sets it yet,
   but anything built only from tokens works in both; never assume a light-only value.
10. **Rule of 4.** Any new spatial value is a multiple of 4.
11. **No eyebrows.** Never add a small label above a title (uppercase meta line, section number, "About", "My design principle", category over a heading). They survive only in the case studies until those are redesigned; don't copy them anywhere new. Supporting text goes below the title, or nowhere.

### Quick map: what to use

| Need | Use |
|---|---|
| Page / card / subtle background | `--br-color-page-bg` / `--br-color-card-bg` / `--br-color-bg-subtle` |
| Dark feature surface | `--br-color-card-feature-bg` + `-fg` / `-fg-muted` |
| Lime highlight surface | `--br-color-card-highlight-bg` + `--br-color-card-highlight-fg` |
| Primary / secondary text | `--br-color-text-primary` / `--br-color-text-secondary` |
| Link text | `--br-color-text-link` (`--br-color-link-fg`) |
| Divider | `var(--br-border-width-default) solid var(--br-color-border-default)` |
| Error / success / warning text | `--br-color-status-{danger,success,warning}-text` |
| Section padding | `var(--br-space-section-spacing) var(--br-space-page-padding-x)` |
| Card padding | `--br-space-card-padding` (outcome cards use `--br-space-inset-lg`) |
| Vertical rhythm | `--br-space-gap-{xs,sm,md,lg,xl}` / `--br-space-stack-{tight,default,loose}` |
| Hover / enter transitions | `--br-transition-hover` / `--br-transition-enter` |
| Sticky layer | `--br-z-sticky` |

### Text styles (classes in `tokens.css`)

| Class | Use |
|---|---|
| `.br-text-hero-title` | Home hero name (Fira Sans 800, 96 → 56 mobile) |
| `.br-text-stat-value` | Hero stats (Fira Sans 800, 72 → 44) |
| `.br-text-page-title` | Case study h1, hero subtitle, outcome values (Fira Sans 700, 40 → 32) |
| `.br-text-section-title` | Section h2 (Fira Sans 700, 32 → 24) |
| `.br-text-card-title` | Card h3, contact values, `br.` logo (Fira Sans 500, 24 → 20) |
| `.br-text-page-body` | Long-form body (Plus Jakarta Sans 18/28) |
| `.br-text-card-body` | Card description (Plus Jakarta Sans 16/24) |
| `.br-text-button-label` / `.br-text-nav-label` | Buttons and nav items (Fira Sans 500, 16) |
| `.br-text-chip-label` | Chips, diagram labels (Fira Sans 500, 14) |
| `.br-text-meta-label` | Dates, captions, details under a title, footer (Fira Mono 12). Never as an eyebrow |
| `.br-text-input-helper` | Input helper text (Fira Sans 500, 12, wide tracking) |

Smaller inline text without a class uses `font-size:var(--br-font-body-sm-size)` or
`var(--br-font-caption-md-size)`.

---

## Design System — Component Patterns

### Sticky nav (case study)
```html
<nav style="position:sticky;top:0;z-index:var(--br-z-sticky);background:color-mix(in srgb, var(--br-color-page-bg) 85%, transparent);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:var(--br-border-width-default) solid var(--br-color-border-default);">
  <div style="width:100%;max-width:960px;margin:0 auto;padding:var(--br-space-inset-sm) var(--br-space-page-padding-x);display:flex;justify-content:space-between;align-items:center;">
    <a href="index.html" class="br-text-card-title" style="font-weight:var(--br-font-weight-extrabold);letter-spacing:var(--br-font-tracking-tight);color:var(--br-color-text-primary);">br.</a>
    <a href="index.html" class="br-nav-item br-text-nav-label">← Back to Home</a>
  </div>
</nav>
```
On `index.html` the right side is a flex group (`gap:var(--br-space-nav-item-gap)`) of
`.br-nav-item` links plus a `.br-btn--primary` "Contact" button.

### Buttons
```html
<a href="#work" class="br-btn br-btn--primary br-text-button-label">View work →</a>
<a href="#contact" class="br-btn br-btn--secondary br-text-button-label">Get in touch</a>
```

### Chips
```html
<span class="br-chip br-chip--accent br-text-chip-label">Design Systems</span>
<span class="br-chip br-text-chip-label">Insurtech</span>
```

### Section eyebrow (legacy: case studies only, do not use in new work)
```html
<p class="br-text-meta-label" data-reveal="" style="text-transform:uppercase;color:var(--br-color-text-secondary);margin-bottom:var(--br-space-gap-md);letter-spacing:var(--br-font-tracking-wide);">01 / The Problem</p>
```

### Section shell (case study)
```html
<section style="max-width:720px;margin:0 auto;padding:var(--br-space-section-spacing) var(--br-space-page-padding-x);border-top:var(--br-border-width-default) solid var(--br-color-border-default);">
  <!-- eyebrow, .br-text-section-title h2, .br-text-page-body paragraphs -->
</section>
```

### Hero metrics (case study)
```html
<div data-reveal="" style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--br-space-gap-lg);padding-top:var(--br-space-gap-xl);border-top:var(--br-border-width-default) solid var(--br-color-border-default);">
  <sc-for list="{{ heroMetrics }}" as="m" hint-placeholder-count="4">
    <div style="display:flex;flex-direction:column;gap:var(--br-space-gap-xs);">
      <div class="br-text-stat-value" style="color:var(--br-color-text-primary);">{{ m.value }}</div>
      <div style="font-size:var(--br-font-body-sm-size);color:var(--br-color-text-secondary);line-height:1.4;">{{ m.label }}</div>
    </div>
  </sc-for>
</div>
```

### Metric / outcome card
```html
<div style="background:var(--br-color-bg-surface);border:var(--br-border-width-default) solid var(--br-color-border-default);border-radius:var(--br-radius-card);padding:var(--br-space-inset-lg);">
  <div class="br-text-page-title" style="color:var(--br-color-text-primary);margin-bottom:var(--br-space-gap-sm);">{{ o.value }}</div>
  <div class="br-text-chip-label" style="color:var(--br-color-text-primary);margin-bottom:var(--br-space-gap-xs);">{{ o.label }}</div>
  <div style="font-size:var(--br-font-body-sm-size);color:var(--br-color-text-secondary);line-height:1.45;">{{ o.context }}</div>
</div>
```

### Project card
```html
<a data-reveal="" class="br-card" href="{{ p.href }}">
  <div style="width:100%;aspect-ratio:16/9;background-color:{{ p.coverFallback }};background:{{ p.coverBg }};">
    <!-- cover area; coverFallback = 'var(--br-color-bg-inverse)' set in renderVals -->
  </div>
  <div style="padding:var(--br-space-card-padding);display:flex;flex-direction:column;gap:var(--br-space-stack-default);">
    <div><span class="br-chip br-text-chip-label">{{ p.category }}</span></div>
    <h3 class="br-text-card-title">{{ p.title }}</h3>
    <p class="br-text-card-body" style="color:var(--br-color-text-secondary);">{{ p.desc }}</p>
  </div>
</a>
```

### Contact row
```html
<a href="{{ c.href }}" target="_blank" rel="noopener noreferrer" class="br-row">
  <div style="display:flex;flex-direction:column;gap:var(--br-space-gap-xs);min-width:0;">
    <span class="br-text-meta-label" style="text-transform:uppercase;letter-spacing:var(--br-font-tracking-wide);color:var(--br-color-text-secondary);">{{ c.label }}</span>
    <span class="br-text-card-title" style="overflow-wrap:anywhere;">{{ c.value }}</span>
  </div>
  <span class="br-text-button-label" style="color:var(--br-color-icon-default);">→</span>
</a>
```

### Password gate input
```html
<div style="display:flex;gap:var(--br-space-gap-sm);">
  <input class="br-input" id="pw-input" type="password" placeholder="Enter password" onKeyDown="{{ onKey }}" style="flex:1;">
  <button class="br-btn br-btn--primary br-text-button-label" onClick="{{ tryUnlock }}">Unlock →</button>
</div>
<sc-if value="{{ error }}" hint-placeholder-val="{{ false }}">
  <p style="font-size:var(--br-font-body-sm-size);color:var(--br-color-status-danger-text);margin-top:var(--br-space-gap-sm);">Incorrect password. Try again.</p>
</sc-if>
```

### Highlighted diagram step
Data-driven diagrams set their colors in `renderVals()`; the highlighted step uses the lime surface:
```javascript
{ name: 'Promoted', bg: 'var(--br-color-card-highlight-bg)', border: 'var(--br-color-card-highlight-bg)', color: 'var(--br-color-on-accent)' },
{ name: 'Review',   bg: 'var(--br-color-bg-surface)',        border: 'var(--br-color-border-default)',   color: 'var(--br-color-text-secondary)' },
```
```html
<div style="background:{{ s.bg }};border:var(--br-border-width-default) solid {{ s.border }};border-radius:var(--br-radius-md);color:{{ s.color }};">{{ s.name }}</div>
```

### Code / monospace block
```html
<div class="br-text-meta-label" style="color:var(--br-color-text-secondary);background:var(--br-color-bg-surface);border:var(--br-border-width-default) solid var(--br-color-border-default);border-radius:var(--br-radius-sm);padding:var(--br-space-inset-md);">
  token-name · example-value
</div>
```

### Progress bar
```html
<div style="height:8px;background:var(--br-color-bg-subtle);border-radius:var(--br-radius-pill);overflow:hidden;">
  <div style="width:45%;height:100%;background:var(--br-color-bg-inverse);border-radius:var(--br-radius-pill);"></div>
</div>
```

### Footer (case study)
```html
<footer style="border-top:var(--br-border-width-default) solid var(--br-color-border-default);">
  <div style="max-width:720px;margin:0 auto;padding:var(--br-space-inset-xl) var(--br-space-inset-lg) 48px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:var(--br-space-gap-md);">
    <div>
      <div class="br-text-button-label" style="margin-bottom:var(--br-space-gap-xs);">Bernardo Reyes</div>
      <a href="mailto:bernardo.reyes.design@gmail.com" style="font-size:var(--br-font-body-sm-size);color:var(--br-color-text-link);">bernardo.reyes.design@gmail.com</a>
    </div>
    <span class="br-text-meta-label" style="color:var(--br-color-text-secondary);max-width:280px;text-align:right;">Abstracted architecture, no proprietary assets</span>
  </div>
</footer>
```

### Footer (portfolio)
```html
<footer style="border-top:var(--br-border-width-default) solid var(--br-color-border-default);">
  <div style="width:100%;max-width:960px;margin:0 auto;padding:var(--br-space-inset-lg) var(--br-space-page-padding-x);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:var(--br-space-gap-sm);">
    <span class="br-text-meta-label" style="color:var(--br-color-text-secondary);">© 2026 Bernardo Reyes</span>
    <span class="br-text-meta-label" style="color:var(--br-color-text-secondary);">Designed &amp; built with a system.</span>
  </div>
</footer>
```

---

## Case Study — File Template

New case studies follow this exact shell. Replace `[PROJECT]`, `[PASSWORD]`.
Save as `[ProjectName]-Case-Study.html` at the repo root.

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>[PROJECT] — … · Bernardo Reyes</title>
<!-- description, Open Graph and canonical meta: copy from Fitune-Case-Study.html -->

<!-- br. design tokens -->
<link href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;500;700;800&amp;family=Fira+Mono&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" href="./assets/css/tokens.css">
<link rel="stylesheet" href="./assets/css/components.css">

<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500&amp;display=swap" rel="stylesheet">
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{-webkit-font-smoothing:antialiased;}
  a{color:inherit;text-decoration:none;}
</style>
</helmet>

<!-- Nav, Gate (sc-if locked), Main content (sc-if unlocked), Footer -->
<!-- See Fitune-Case-Study.html for the full pattern -->

</x-dc>
<script type="text/x-dc" data-dc-script data-props="{&quot;$preview&quot;:{&quot;width&quot;:960,&quot;height&quot;:1100},&quot;password&quot;:{&quot;editor&quot;:&quot;text&quot;,&quot;default&quot;:&quot;[PASSWORD]&quot;,&quot;tsType&quot;:&quot;string&quot;},&quot;revealMotion&quot;:{&quot;editor&quot;:&quot;boolean&quot;,&quot;default&quot;:true,&quot;tsType&quot;:&quot;boolean&quot;}}">
class Component extends DCLogic {
  state = { unlocked: false, error: false };
  // ... (copy _observe, _check and renderVals structure from the Fitune case study)
}
</script>
</body>
</html>
```

The live pages also include the Microsoft Clarity snippet in `<head>`; copy it from an existing page.

---

## Case Study — Section Structure (01–08)

Every case study uses this numbered structure. Section numbers and labels are part
of the visual system — do not skip or reorder.

| # | Label | Content |
|---|---|---|
| 01 | The Problem | What was broken. Specific, measurable. Before/after diagram if applicable. |
| 02 | Architecture / Research / Discovery | The strategic decision or research foundation. Diagrams encouraged. |
| 03 | Component System / Design Decisions | How the solution was structured. Output contracts, decision logic. |
| 04 | Feature Delivery / Process | How it shipped. Pipeline stages, velocity metrics. |
| 05 | Governance / Validation | What keeps it from drifting. Promotion gates, registries, policies. |
| 06 | AI-Assisted Delivery / Implementation | The tooling layer. Claude Code pipeline or equivalent technical work. |
| 07 | Outcomes | 4 metric cards in a 2×2 grid. Values first, context second. |
| 08 | What's Next | 1–2 paragraphs. Forward-looking, specific, shows system thinking. |

**Hero metrics** (4 stats above the fold):
- Always 4 items in a `grid-template-columns: repeat(4,1fr)` grid
- Format: value (`.br-text-stat-value`, `--br-color-text-primary`) + label (`--br-font-body-sm-size`, `--br-color-text-secondary`)
- Examples: `95%`, `−35%`, `45%`, `−40%`

**Outcomes section** (07):
- Section background `--br-color-bg-surface` with 1px top and bottom borders
- 2×2 grid (`repeat(2,1fr)`, gap `--br-space-gap-md`) of metric cards
- Each card: value (`.br-text-page-title`), label (`.br-text-chip-label`, primary), context (`--br-font-body-sm-size`, secondary)
- Ends with a 1–2 sentence synthesis paragraph

---
## Case Study — Content Rules

Enforced by the Content Strategist role:

1. **Lead with outcome, not activity.** "Cut handoff cycles by 35%" not "built a pipeline."
2. **Specific beats vague.** "4-layer token system" not "robust token architecture."
3. **Numbers wherever defensible.** 95%, 35%, 45%, 40% — all must be real and interview-ready.
4. **No designer buzzwords.** Not "holistic", "seamless", "intuitive", "user-centric."
5. **Active voice.** "I built" not "was built."
6. **Every section earns its place.** If it can be cut without loss, cut it.

---

## Owner

Bernardo Reyes — bernardo.reyes.design@gmail.com
Senior Product Designer · Guadalajara MX · UTC-6
Target: international remote roles, $4,500–5,000 USD/month
