# Bernardo Reyes · Portfolio

Senior Product Designer portfolio. Design systems, fintech, insurtech, B2B SaaS.
Live at [bernardoreyesdesign.com](https://bernardoreyesdesign.com)

Built with Design Composer: `.dc.html` files rendered by a compiled React 18 runtime (`support.js`). No build step, no npm, no framework.

---

## How this site is built with AI

This portfolio runs on the same design to code approach I use in product work:

- **`docs/design-system.md`** is the source of truth for color, type, spacing and components. Nothing outside the palette, no hardcoded values.
- **`docs/CLAUDE.md`** gives an AI agent the runtime patterns and design system rules, so new pages and case studies are authored on system from the start.
- Every case study follows the same 8 section structure, so the content scales without redesigning each page.

---

## File structure

```
/
├── index.html                        ← portfolio homepage
├── Fitune_Case_Study_Light_dc.html   ← Fitune case study
├── support.js                        ← DC runtime, never modify
├── docs/
│   ├── CLAUDE.md                     ← DC runtime and design system reference for AI authoring
│   └── design-system.md              ← design system reference for people
├── assets/
│   └── images/
│       └── covers/                   ← project card cover images (16:9)
└── .gitignore
```

---

## Running locally

No build step required. The DC runtime fetches sibling `.dc.html` files with `fetch()`, so it needs a local server. Opening `index.html` as a `file://` URL will not work.

**VS Code Live Server:** install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer), right click `index.html`, select "Open with Live Server."

**Python:**
```bash
python3 -m http.server 8080
# open http://localhost:8080
```

**npx serve** (no install):
```bash
npx serve .
```

---

## Deployment

Hosted on GitHub Pages from the `main` branch, root folder, with a custom domain.
All files must stay at root level: the DC runtime resolves sibling components relative to the page URL.

---

## Adding a new case study

### 1. Name the file
Pattern: `[ProjectName]_Case_Study_dc.html`, at root level.

### 2. Copy the shell
`Fitune_Case_Study_Light_dc.html` is the canonical template. Copy it and replace the content in `renderVals()` (metrics, section data, outcomes), plus section text and eyebrows.

### 3. Structure (sections 01 to 08)

| # | Section | What goes here |
|---|---|---|
| 01 | The Problem | What was broken. Specific and measurable. Before and after diagram if useful. |
| 02 | Architecture / Research | The strategic foundation. |
| 03 | Component System / Decisions | How the solution was structured. |
| 04 | Feature Delivery / Process | How it shipped. Velocity and pipeline. |
| 05 | Governance / Validation | What keeps it coherent over time. |
| 06 | AI Assisted Delivery / Implementation | Tooling and technical work. |
| 07 | Outcomes | 4 metric cards (2×2 grid). Values first, context second. |
| 08 | What's Next | Forward looking. Shows system thinking. |

### 4. Add the project card to index.html
In the `projects` array inside `renderVals()` in `index.html`:

```javascript
{
  name: 'ProjectName',
  href: './ProjectName_Case_Study_dc.html',
  cover: '#2E2A52',        // background color for the card cover
  category: 'Category',
  period: 'YYYY – YYYY',
  title: 'ProjectName · Short title',
  desc: 'One line summary of the outcome.'
}
```

### 5. Design system
All styling uses values from `docs/design-system.md`. No hardcoded colors outside the palette. No box shadows.
For runtime patterns and component HTML, see `docs/CLAUDE.md`.

---

## Contact

Bernardo Reyes · bernardo.reyes.design@gmail.com · Guadalajara, MX · UTC−6
