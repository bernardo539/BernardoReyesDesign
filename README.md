# Bernardo Reyes · Portfolio

Senior Product Designer portfolio. Design systems, fintech, insurtech, B2B SaaS.
Live at [bernardoreyesdesign.com](https://bernardoreyesdesign.com)

Built with Design Composer: each page is a plain `.html` file holding an `<x-dc>` component, rendered by a compiled React 18 runtime (`support.js`). No build step, no npm, no framework.

---

## How this site is built with AI

This portfolio runs on the same design to code approach I use in product work:

- **`docs/design-system.md`** is the source of truth for color, type, spacing and components, backed by the token spec in `docs/br-design-tokens.md` and implemented in `assets/css/tokens.css` and `assets/css/components.css`. Nothing outside the palette, no hardcoded values.
- **`docs/CLAUDE.md`** gives an AI agent the runtime patterns and design system rules, so new pages and case studies are authored on system from the start.
- Every case study follows the same 8 section structure, so the content scales without redesigning each page.

---

## File structure

```
/
├── index.html                  ← portfolio homepage
├── Fitune-Case-Study.html      ← Fitune case study
├── Guros-Case-Study.html       ← Guros case study
├── Axcess-Case-Study.html      ← Axcess case study
├── support.js                  ← DC runtime, never modify
├── CNAME                       ← custom domain (bernardoreyesdesign.com)
├── README.md
├── docs/
│   ├── CLAUDE.md               ← DC runtime and design system reference for AI authoring
│   ├── design-system.md        ← design system reference for people
│   └── br-design-tokens.md     ← token spec: primitives, modes and rationale
├── assets/
│   ├── css/
│   │   ├── tokens.css          ← mode and semantic tokens, .br-text-* styles
│   │   └── components.css      ← .br-btn, .br-chip, .br-card, .br-input and other components
│   ├── js/
│   │   └── clarity.js          ← Microsoft Clarity loader and custom events (all pages)
│   ├── docs/                   ← CV PDFs (Resume button on the homepage)
│   └── images/
│       ├── covers/             ← project card covers and the Open Graph image
│       ├── axcess/             ← Axcess case study screenshots
│       └── guros/              ← Guros case study screenshots
└── .gitignore
```

---

## Running locally

No build step required. The DC runtime loads content with `fetch()`, so it needs a local server. Opening `index.html` as a `file://` URL will not work.

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
The custom domain is set in `CNAME`. Every page must stay at root level: the DC runtime resolves files relative to the page URL.

---

## Adding a new case study

### 1. Name the file
Pattern: `[ProjectName]-Case-Study.html` (PascalCase name, hyphens, no spaces), at root level.

### 2. Copy the shell
`Fitune-Case-Study.html` is the canonical template. Copy it and replace the content in `renderVals()` (metrics, section data, outcomes), the section text, and the title, description, Open Graph and canonical tags in `<head>`. Set the password in the `data-props` default and in the fallback inside the logic class. Keep the `tokens.css`, `components.css` and `clarity.js` links as they are on the other pages.

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
In the `CARDS` array of the component class in `index.html`, next to the other `project` cards:

```javascript
{ id: 'projectname', type: 'project', cat: 'work',
  href: './ProjectName-Case-Study.html',
  coverBg: 'url(https://bernardoreyesdesign.com/assets/images/covers/projectname.jpg) center/cover no-repeat',
  title: 'ProjectName — Short title' },
```

### 5. Design system
All styling uses the tokens and classes documented in `docs/design-system.md`. No hardcoded colors outside the palette. No box shadows.
For runtime patterns and component HTML, see `docs/CLAUDE.md`.

---

## Contact

Bernardo Reyes · bernardo.reyes.design@gmail.com · Guadalajara, MX · UTC−6
