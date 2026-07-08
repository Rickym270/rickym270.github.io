# QA Loop Prep (unlisted study app)

Static interview prep app for paired study sessions. Hosted at an obscure, unlisted URL — not linked from the main portfolio navigation.

## URL

- **Production:** `https://rickym270.github.io/p/loop-prep/`
- **Local:** `http://localhost:4321/p/loop-prep/` (after `npm run serve` from repo root)

## What's included

- QA topics (API testing, pytest, SQL triage, flaky tests, CI/CD, behavioral, etc.)
- Practice drills with mock questions and model answers
- Scoring rubrics and self-score grading (useful for paired study)
- Mock Panel, Random Interview, Weak Spots, and Stories modes
- **Partner Mode** — simple question + speakable bullet answers for paired study (answers hidden by default; toggle to reveal)
- Study mode: flashcards, strong-answer bullets, pitfalls, static mentor content

## What was removed

- Voice / read-aloud (Web Speech API)
- Teach It mode and AI coaching (OpenAI)
- Socratic mentor dialogue (OpenAI)
- Backend server (`server/` Vite plugins)

All data stays in the browser (`localStorage` for training progress). Clearing site data resets scores.

## Development

```bash
# Live dev server with HMR
npm run dev:qa-prep

# Production build (writes to p/loop-prep/)
npm run build:qa-prep
```

Source lives in [`apps/qa-prep/`](../apps/qa-prep/).

After changing source, rebuild and commit `p/loop-prep/` before pushing to GitHub Pages.

## Privacy

- No links from [`index.html`](../index.html) nav or footer
- [`robots.txt`](../robots.txt) disallows `/p/loop-prep/` for crawlers
- Share the direct URL only with study partners

## Rebuild checklist

1. `npm run build:qa-prep`
2. Verify locally: `npm run serve` → open `/p/loop-prep/`
3. Commit `apps/qa-prep/` source changes and `p/loop-prep/` build output
4. Push to `master`
