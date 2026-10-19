# ColdReach Career Coach — Frontend

A polished, privacy-first web app that assembles **structured plugin inputs** for a career-coaching
plugin. The plugin consumes the generated package to produce personalized cold emails, networking
messages, referral requests, resume-fit assessments, and evidence-based resume improvements.

This app **prepares input only**. It does not write emails, run AI analysis, conduct live web
research, send messages, or submit applications. Those steps happen in the downstream plugin or
coding agent that receives the package.

> **UI reference:** modeled on the compact, dark-mode-first "Job Application Prompt Builder"
> layout — card-based form sections, fixed action toolbar, live character counts, document import,
> and a large output panel — rebuilt for this product with better accessibility, responsiveness,
> maintainability, and privacy.

---

## Highlights

- **Dark-first theming** with a working light theme. Only the theme choice is persisted.
- **Two-column desktop workspace** (~59% inputs / ~41% output) that stacks on mobile.
- **Master Instructions** card — preloaded, editable, lock/unlock, include/exclude, reset-to-default.
- **Three output modes** — Complete Plugin Input, valid Structured JSON, and Plain-Text Prompt.
- **Client-side document import** for PDF (pdf.js), DOCX (Mammoth), and TXT. Files never leave the
  browser.
- **Live readiness indicator** with required-field validation and a concise missing-input summary.
- **Accessibility:** keyboard-operable controls, focus-visible states, ARIA roles for tabs, dialog,
  toggles, and live regions for counts/status/toasts.
- **Truthful by design:** absent optional data is labeled `[Not provided]`, missing candidate
  details are never invented, and research mode discloses that no live research was performed.

---

## Tech stack

| Concern        | Choice                                   |
| -------------- | ---------------------------------------- |
| Framework      | React 18 + TypeScript (Vite)             |
| Styling        | Custom CSS with CSS variables (compact, dark-first) |
| Icons          | lucide-react                             |
| PDF text       | pdfjs-dist (bundled worker, no CDN)      |
| DOCX text      | mammoth (browser build)                  |
| Clipboard/file | Browser-native APIs                      |
| Tests          | Vitest + Testing Library                 |

Heavy document libraries are **lazy-loaded**, keeping the initial JS bundle small (~205 kB gzip
excluded) and avoiding broken CDN globals.

---

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

### Other scripts

```bash
npm run build      # type-check (tsc -b) then production build to dist/
npm run preview    # serve the production build
npm test           # run the test suite once
npm run test:watch # run tests in watch mode
npm run typecheck  # TypeScript only, no emit
```

### Test fixtures

The file-extraction tests use local fixtures. Regenerate them with:

```bash
node scripts/make-fixtures.mjs
```

This writes a valid TXT, DOCX, PDF, an empty file, and an unsupported CSV into `public/fixtures/`.

---

## Project structure

```
src/
  components/        UI: header, cards, output panel, toolbar, dialog, toast, footer
  config/            Default master instructions + app constants (links, limits)
  hooks/             useTheme, useFileExtraction
  lib/               promptBuilder, jsonSchema, fileExtraction, validation, download
  styles/            app.css (design tokens + component styles)
  types/             Shared TypeScript domain types
  __tests__/         Integration tests
```

Business logic lives in `src/lib`, kept out of the React components. The prompt-assembly engine
(`buildPlainText` / `buildJson` / `buildPluginInput`) is pure and unit-tested independently.

---

## How input assembly works

**`buildPlainText(state)`** produces a clearly labeled 9-section package:

1. Master Instructions · 2. Recipient & Company · 3. Candidate Profile · 4. Resume ·
5. Target Opportunity · 6. Outreach Preferences · 7. Research & Personalization ·
8. Additional Context · 9. Required Output (including the weighted fit rubric)

**`buildJson(state)`** produces a predictable structured object where genuinely missing values are
`null` — never literal placeholder text. The JSON tab is real, parseable JSON.

**`buildPluginInput(state)`** returns all variants plus size metrics, and flags a soft warning when
the package exceeds the configured downstream context limit so you can review before sending.

Content is **never silently truncated**. The resume and job description are included in full;
whitespace is normalized (trailing/blank-line cleanup) without altering factual content.

### Required vs optional

Only these are required to generate:

- Contact full name, current title, company, a valid contact email, and non-empty resume text.

Everything else is optional. Optional fields are labeled and never block generation.

---

## Privacy & data handling

- **No server.** All processing is local to the browser.
- **No persistence of sensitive data.** Resumes, contact details, and job descriptions live in
  in-memory React state for the session only. They are **not** written to `localStorage`.
- **Only the theme choice** (`coldreach.theme`) is persisted.
- **Contact details are omitted** from output when the "include contact information" toggle is off.
- No analytics, no tracking, no network transmission of form content.

---

## Developer attribution

Developer: **Denzil Josteve Fernandes**

- Website: https://denziljosteve.github.io/
- LinkedIn: https://www.linkedin.com/in/denziljosteve/
- GitHub: https://github.com/denziljosteve/

These links are configurable via `APP_CONFIG` in `src/config/defaultInstructions.ts`.

---

## Configurable constants

Edit `src/config/defaultInstructions.ts`:

- `contextLimitChars` — soft downstream context limit for the size warning
- `maxFileBytes` — upload size limit (default 5 MB)
- `downloadBaseName` — output filenames
- `links` — footer attribution links
- `DEFAULT_MASTER_INSTRUCTIONS` — the editable instruction template

---

## Verified behavior

The test suite (67 tests) covers required-field validation, invalid email handling, optional-field
omission, master-instruction lock/include behavior, prompt assembly, JSON validity, resume
preservation (including ~1M-char inputs), file-extraction edge cases, copy/download actions, reset
confirmation, theme switching, and privacy (no automatic resume persistence). Layout and responsive
breakpoints were additionally verified in a real browser via DOM inspection, along with live PDF,
DOCX, and TXT extraction, clipboard copy, and both downloads.
