# Bernardo Reyes — Portfolio

Senior Product Designer portfolio. Design systems, fintech, insurtech, B2B SaaS.

Built with Design Composer — `.dc.html` files rendered by a compiled React 18 runtime (`support.js`). No build step, no npm, no framework.

---

## File structure

```
/
├── index.html                        ← portfolio homepage
├── Fitune_Case_Study_Light_dc.html   ← Fitune case study (password protected)
├── support.js                        ← DC runtime — never modify
├── docs/
│   ├── CLAUDE.md                     ← DC runtime + design system reference for AI authoring
│   └── design-system.md              ← human-readable design system reference
├── assets/
│   ├── images/
│   │   └── covers/                   ← project card cover images (16:9)
└── .gitignore
```

---

## Running locally

No build step required.

**Option 1 — VS Code Live Server**
Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer), right-click `index.html`, select "Open with Live Server."

**Option 2 — Python**
```bash
python3 -m http.server 8080
# open http://localhost:8080
```

**Option 3 — npx serve** (one-off, no install)
```bash
npx serve .
```

The DC runtime fetches sibling `.dc.html` files via `fetch()` — this requires a local server. Opening `index.html` directly as a `file://` URL will not work.

---

## Deploying to GitHub Pages

1. Push all files to the `main` branch of your GitHub repo
2. Go to **Settings → Pages**
3. Source: **Deploy from a branch** → `main` → `/ (root)`
4. Save. Site available at `https://[username].github.io/[repo]/`

All files must stay at root level — the DC runtime resolves sibling components relative to the page URL.

---

## Case study passwords

| File | Password |
|---|---|
| `Fitune_Case_Study_Light_dc.html` | `fitune2026` |

Passwords are stored in the `data-props` attribute of each file's `<script data-dc-script>` block and can be changed there directly.

---

## Adding a new case study

### 1. Name the file

Use the pattern: `[ProjectName]_Case_Study_dc.html`
Examples: `Guros_Case_Study_dc.html`, `Syscap_Case_Study_dc.html`

File must be at root level.

### 2. Copy the shell from an existing case study

`Fitune_Case_Study_Light_dc.html` is the canonical template. Copy it, then replace:
- All content in `renderVals()` (metrics, section data, outcomes)
- Section text and eyebrows
- Password in `data-props`

### 3. Structure (sections 01–08)

| # | Section | What goes here |
|---|---|---|
| 01 | The Problem | What was broken. Specific, measurable. Before/after diagram if applicable. |
| 02 | Architecture / Research | The strategic foundation. Diagrams if needed. |
| 03 | Component System / Decisions | How the solution was structured. |
| 04 | Feature Delivery / Process | How it shipped. Velocity and pipeline. |
| 05 | Governance / Validation | What keeps it coherent over time. |
| 06 | AI-Assisted Delivery / Implementation | Tooling and technical work. |
| 07 | Outcomes | 4 metric cards (2×2 grid). Values first, context second. |
| 08 | What's Next | Forward-looking. Shows system thinking. |

### 4. Add the project card to index.html

In the `projects` array inside `renderVals()` in `index.html`:

```javascript
{
  name: 'Guros',
  href: './Guros_Case_Study_dc.html',
  cover: '#2E2A52',         // background color for the card cover area
  category: 'Insurtech',
  period: '2022 – 2024',
  title: 'Guros — Conversion-led redesign',
  desc: 'Led the redesign of the quote-to-purchase flow, lifting conversion by 18% across the insurance marketplace.'
}
```

### 5. Design system

All styling must use values from `docs/design-system.md`. No hardcoded colors outside the palette. No box-shadows.

For full DC runtime patterns and component HTML, see `docs/CLAUDE.md`.

---

## Contact

Bernardo Reyes · bernardo.reyes.design@gmail.com · Guadalajara MX · UTC-6
