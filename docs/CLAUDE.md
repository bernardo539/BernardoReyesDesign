# CLAUDE.md — Design Composer Runtime & Design System Reference

This file is the authoritative source of truth for AI-assisted authoring on this repo.
All values are extracted from the live source files. Do not invent values.

---

## What this repo is

A GitHub Pages portfolio site for Bernardo Reyes, Senior Product Designer.
Built with Design Composer (DC) — `.dc.html` files rendered by `support.js`,
a compiled React 18 runtime that runs entirely in the browser.

**No build step. No npm. No framework imports.**

---

## File structure rules

```
/
├── index.html                        ← portfolio homepage
├── Fitune_Case_Study_Light_dc.html   ← Fitune case study
├── support.js                        ← DC runtime — NEVER MODIFY
├── docs/
│   ├── CLAUDE.md                     ← this file
│   └── design-system.md              ← human-readable DS reference
├── assets/
│   ├── images/
│   │   └── covers/                   ← project card cover images
└── .gitignore
```

**Hard rules:**
- `support.js` is never modified under any circumstances
- All `.dc.html` files live at root level — DC sibling fetch requires same directory
- New case studies are named `[ProjectName]_Case_Study_dc.html` (underscores, no spaces)
- Never add npm, webpack, vite, or any build tooling
- No external JS libraries beyond what support.js already loads (React 18 from unpkg)

---

## DC Runtime — Architecture

`support.js` is a compiled React 18 runtime. Each `.dc.html` file is a self-contained
Design Composer component with three parts:

1. **`<x-dc>` block** — the HTML template (supports DC directives)
2. **`<script type="text/x-dc" data-dc-script>` block** — the component logic class
3. **`data-props` attribute** — prop schema as JSON

### Boot sequence
1. Browser loads `.dc.html`
2. `support.js` loads React 18 from unpkg (CDN)
3. Runtime parses `<x-dc>` and the logic script
4. Mounts a React root into `#dc-root`
5. `renderVals()` populates template variables

---

## DC Runtime — Template Directives

### `{{ expression }}` — interpolation
Renders a value from `renderVals()`. Supports dot paths and simple equality checks.

```html
<div>{{ item.label }}</div>
<div>{{ count }}</div>
```

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

### `style-hover` — hover state
```html
<a
  style="color:#666666;font-size:14px;"
  style-hover="color:#1A1A1A;font-size:14px;"
>Link</a>
```
The DC runtime injects a generated class for the `:hover` pseudo-selector.
Both `style` and `style-hover` must be complete style strings (not diffs).

### `style-focus` — focus state
```html
<input
  style="border:0.5px solid #D0D0CC;"
  style-focus="border:0.5px solid #645AFF;"
/>
```

### `<helmet>` — head injection
Injects `<link>`, `<style>`, `<meta>`, or `<script>` tags into `<head>`.
Used for fonts and page-level styles. Runs once per component mount.

```html
<helmet>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</helmet>
```

---

## DC Runtime — Logic Class

Every `.dc.html` file has a logic class that extends `DCLogic`.

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

Used in both existing files. Copy exactly — do not invent variations.

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
      if (r.top < (window.innerHeight || 800) * 1.1) return; // above fold: leave visible
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity .6s ease, transform .6s ease';
      io.observe(el);
      setTimeout(() => show(el), 1600);
    });
  });
}
```

Mark elements for reveal with `data-reveal=""`:
```html
<h2 data-reveal="" style="...">Section heading</h2>
<p data-reveal="" style="...">Body copy</p>
```

---

## Design System — Colors

All values used verbatim in source files.

| Token | Hex / Value | Usage |
|---|---|---|
| Primary accent | `#645AFF` | CTAs, links, eyebrow labels, icons |
| Accent dark | `#4A40CC` | Hover state for primary accent |
| Accent subtle bg | `rgba(100,90,255,0.10)` | Pill/tag backgrounds, highlighted cards |
| Accent subtle border | `rgba(100,90,255,0.25)` | Pill/tag borders |
| Text primary | `#1A1A1A` | Headings, body text |
| Text secondary | `#666666` | Body copy, supporting text |
| Text tertiary | `#999999` | Captions, timestamps, bylines |
| Surface default | `#FFFFFF` | Page background, card background |
| Surface subtle | `#FAFAF8` | About section bg, alternate rows, code blocks |
| Border default | `0.5px solid #E5E5E2` | Cards, dividers, section separators |
| Border interactive | `0.5px solid #D0D0CC` | Input borders, secondary button borders |
| Error | `#E24B4A` | Error messages, failure states |
| Success | `#1F9D63` | Resolved states, success indicators |
| Warning | `#C58A1A` | Open/pending states |

**No hardcoded colors outside this palette.**
**No box-shadows** — elevation is expressed through border only.

---

## Design System — Typography

Font: **Plus Jakarta Sans** — weights 300, 400, 500, 600, 700.
Always loaded via Google Fonts in `<helmet>`.

| Role | Size | Weight | Tracking | Line-height |
|---|---|---|---|---|
| Hero h1 | 52px | 700 | -0.04em | 1.05 |
| Hero h2 (subtitle) | 52px | 300 | -0.03em | 1.05 |
| Section h2 | 32px | 600 | -0.03em | 1.15 |
| Case study h1 | 40px | 700 | -0.03em | 1.1 |
| Card h3 | 17px | 600 | -0.01em | 1.3 |
| Stat value | 32–34px | 600 | -0.03em | 1.1–1.15 |
| Body | 15px | 400 | — | 1.65 |
| Body large | 18px | 400 | — | 1.5 |
| Small / caption | 13px | 400 | — | 1.5 |
| Eyebrow / label | 11px | 600 | 0.08em | — |
| Code / monospace | 12–13px | 400 | — | — |

Eyebrow labels are always: `font-size:11px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:#645AFF` (or `#999999` for muted variant).

Monospace font stack: `'SF Mono','Fira Code',ui-monospace,monospace`

---

## Design System — Spacing

| Context | Value |
|---|---|
| Section padding (vertical) | 64px – 96px |
| Section padding (horizontal) | 24px |
| Hero section padding top | 80px – 112px |
| Card padding | 24px |
| Small card / row padding | 14px – 20px |
| Nav height | 56px |
| Scroll margin top (anchored sections) | 56px – 72px |
| Max-width content | 720px |
| Max-width wide (grid) | 960px |

---

## Design System — Border Radius

| Element | Radius |
|---|---|
| Pills / tags / badges | 100px |
| Cards (primary) | 16px |
| Cards (small) | 12px |
| Buttons | 10px |
| Inputs | 10px |
| Code blocks | 10px |
| Progress bars | 100px |
| Small chips | 8px |

---

## Design System — Motion

| Type | Value |
|---|---|
| Reveal (scroll) | `opacity .6s ease, transform .6s ease` — `translateY(16px → 0)` |
| Hover transitions | `transition: all .15s` or `transition: color .15s` |
| No shadows | Use border changes for hover elevation instead |

Hover "lift" on cards: `transform: translateY(-2px)` + border darkening.
No `box-shadow` anywhere in the codebase.

---

## Design System — Component Patterns

### Sticky nav
```html
<nav style="position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.85);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-bottom:0.5px solid #E5E5E2;">
  <div style="width:100%;max-width:960px;margin:0 auto;padding:0 24px;display:flex;justify-content:space-between;align-items:center;height:56px;">
    <a href="./index.html" style="font-size:15px;font-weight:700;letter-spacing:-0.02em;color:#1A1A1A;">BR</a>
    <a href="./index.html" style="font-size:14px;color:#666666;transition:color .15s;" style-hover="font-size:14px;color:#1A1A1A;">← Back to portfolio</a>
  </div>
</nav>
```

### Primary button
```html
<a href="#work" style="display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:10px;font-size:14px;font-weight:500;white-space:nowrap;letter-spacing:-0.01em;background:#645AFF;color:#fff;border:0.5px solid #645AFF;transition:all .15s;" style-hover="display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:10px;font-size:14px;font-weight:500;white-space:nowrap;letter-spacing:-0.01em;background:#4A40CC;color:#fff;border:0.5px solid #4A40CC;">View work →</a>
```

### Secondary button
```html
<a href="#contact" style="display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:10px;font-size:14px;font-weight:500;white-space:nowrap;letter-spacing:-0.01em;background:transparent;color:#1A1A1A;border:0.5px solid #D0D0CC;transition:all .15s;" style-hover="display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:10px;font-size:14px;font-weight:500;white-space:nowrap;letter-spacing:-0.01em;background:#FAFAF8;color:#1A1A1A;border:0.5px solid #D0D0CC;">Get in touch</a>
```

### Accent pill / tag
```html
<span style="display:inline-flex;align-items:center;padding:4px 10px;border-radius:100px;font-size:11px;font-weight:500;letter-spacing:0.02em;background:rgba(100,90,255,0.10);color:#4A40CC;border:0.5px solid rgba(100,90,255,0.25);">Design Systems</span>
```

### Neutral pill / tag
```html
<span style="display:inline-flex;align-items:center;padding:4px 10px;border-radius:100px;font-size:11px;font-weight:500;letter-spacing:0.02em;background:#F3F3F0;color:#666666;border:0.5px solid #E5E5E2;">Category</span>
```

### Section eyebrow
```html
<p data-reveal="" style="font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#645AFF;margin-bottom:16px;">01 / The Problem</p>
```

### Metric / stat card (outcomes grid)
```html
<div style="background:#fff;border:0.5px solid #E5E5E2;border-radius:16px;padding:22px;">
  <div style="font-size:34px;font-weight:600;letter-spacing:-0.03em;line-height:1;color:#645AFF;margin-bottom:10px;">{{ o.value }}</div>
  <div style="font-size:14px;font-weight:600;color:#1A1A1A;margin-bottom:4px;">{{ o.label }}</div>
  <div style="font-size:13px;color:#666666;line-height:1.45;">{{ o.context }}</div>
</div>
```

### Project card
```html
<a data-reveal="" href="{{ p.href }}"
   style="display:block;background:#fff;border:0.5px solid #E5E5E2;border-radius:16px;overflow:hidden;transition:border-color .15s,transform .15s;"
   style-hover="display:block;background:#fff;border:0.5px solid #D0D0CC;border-radius:16px;overflow:hidden;transition:border-color .15s,transform .15s;transform:translateY(-2px);">
  <div style="width:100%;aspect-ratio:16/9;background:{{ p.cover }};border-bottom:0.5px solid #E5E5E2;...">
    <!-- cover area -->
  </div>
  <div style="padding:24px;display:flex;flex-direction:column;gap:12px;">
    <!-- card body -->
  </div>
</a>
```

### Contact row
```html
<a href="{{ c.href }}"
   style="display:flex;align-items:center;justify-content:space-between;padding:20px 4px;border-bottom:0.5px solid #E5E5E2;transition:padding .15s;"
   style-hover="display:flex;align-items:center;justify-content:space-between;padding:20px 12px;border-bottom:0.5px solid #E5E5E2;background:#FAFAF8;">
  <div style="display:flex;flex-direction:column;gap:2px;">
    <span style="font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#999999;">{{ c.label }}</span>
    <span style="font-size:17px;font-weight:500;letter-spacing:-0.01em;">{{ c.value }}</span>
  </div>
  <span style="font-size:18px;color:#645AFF;">→</span>
</a>
```

### Code / monospace block
```html
<div style="font-family:'SF Mono','Fira Code',ui-monospace,monospace;font-size:13px;color:#666666;background:#FAFAF8;border:0.5px solid #E5E5E2;border-radius:10px;padding:14px 18px;">
  token-name · example-value
</div>
```

### Progress bar
```html
<div style="height:8px;background:#F3F3F0;border-radius:100px;overflow:hidden;">
  <div style="width:45%;height:100%;background:#645AFF;border-radius:100px;"></div>
</div>
```

### Footer (case study)
```html
<footer style="border-top:0.5px solid #E5E5E2;">
  <div style="max-width:720px;margin:0 auto;padding:32px 24px 48px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
    <div>
      <div style="font-size:15px;font-weight:600;letter-spacing:-0.01em;margin-bottom:4px;">Bernardo Reyes</div>
      <a href="mailto:bernardo.reyes.design@gmail.com" style="font-size:13px;color:#645AFF;">bernardo.reyes.design@gmail.com</a>
    </div>
    <span style="font-size:11px;color:#999999;font-family:'SF Mono','Fira Code',ui-monospace,monospace;max-width:280px;text-align:right;">Abstracted architecture — no proprietary assets</span>
  </div>
</footer>
```

### Footer (portfolio)
```html
<footer style="border-top:0.5px solid #E5E5E2;">
  <div style="width:100%;max-width:960px;margin:0 auto;padding:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
    <span style="font-size:13px;color:#999999;">© 2026 Bernardo Reyes</span>
    <span style="font-size:13px;color:#999999;">Designed &amp; built with a system.</span>
  </div>
</footer>
```

---

## Case Study — File Template

New case studies follow this exact shell. Replace `[PROJECT]`, `[COLOR]`, `[PASSWORD]`.

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Plus Jakarta Sans',sans-serif;background:#FFFFFF;color:#1A1A1A;line-height:1.6;-webkit-font-smoothing:antialiased;}
  a{color:inherit;text-decoration:none;}
  ::selection{background:rgba(100,90,255,0.18);}
</style>
</helmet>

<!-- Nav, Gate (sc-if locked), Main content (sc-if unlocked), Footer -->
<!-- See Fitune_Case_Study_Light_dc.html for full pattern -->

</x-dc>
<script type="text/x-dc" data-dc-script data-props="{&quot;$preview&quot;:{&quot;width&quot;:960,&quot;height&quot;:1100},&quot;password&quot;:{&quot;editor&quot;:&quot;text&quot;,&quot;default&quot;:&quot;[PASSWORD]&quot;,&quot;tsType&quot;:&quot;string&quot;},&quot;revealMotion&quot;:{&quot;editor&quot;:&quot;boolean&quot;,&quot;default&quot;:true,&quot;tsType&quot;:&quot;boolean&quot;}}">
class Component extends DCLogic {
  state = { unlocked: false, error: false };
  // ... (copy from Fitune case study)
}
</script>
</body>
</html>
```

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
- Format: value (large, accent) + label (small, secondary)
- Examples: `95%`, `−35%`, `45%`, `−40%`

**Outcomes section** (07):
- 2×2 grid of metric cards
- Each card: value (34px accent), label (14px bold), context (13px secondary)
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
