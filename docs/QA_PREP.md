# QA Loop Prep (unlisted study app)

Static interview prep app for paired study sessions. Hosted at an obscure, unlisted URL — not linked from the main portfolio navigation.

## URL

- **Production:** `https://rickym270.github.io/p/loop-prep/`
- **Local:** `http://localhost:4321/p/loop-prep/` (after `npm run serve` from repo root)

## What's included

- QA topics (API testing, pytest, SQL triage, flaky tests, CI/CD, behavioral, etc.)
- **Adaptive coach flow** — active recall with notes, story recommendations before reveal, chained follow-ups, and dimension-based coaching feedback
- **Hiring Loop** — three-round Judi Health interview simulation (Backend QA, Debugging & Technical Reasoning, Behavioral & Collaboration)
- Practice drills with mock questions and model answers
- Scoring rubrics and self-score grading (useful for paired study)
- Random Interview, Weak Spots (with review sessions), and Stories modes
- **Partner Mode** — simple question + speakable bullet answers for paired study (answers hidden by default; toggle to reveal and check off points covered for a live `X / Y points · Z%` score)
- Study mode: flashcards, strong-answer bullets, pitfalls, mentor content, **Why?** explanations, concept graph navigation
- **AI Study helper** — floating Ask button opens a corner chat panel (non-modal). Questions are sent to the Render API with condensed topic + mentor context (`OPENAI_API_KEY`). Disable from the panel or re-enable from the header link; chat history is stored per topic in `localStorage`.
- **Attempt-first questions** — interview questions show before model answers. Type your answer, submit for AI evaluation (6 dimensions, comparison table, reinforcement question), or use one hint at a time. Model answers stay hidden until you reveal or skip. Mastery is tracked per question in `localStorage` only when you answer without peeking first.
- **Lessons from my Judi Health interviews** — sidebar insights from actual loop experience
- STAR stories with lessons learned, Judi relevance, and likely follow-ups

## What was removed

- Voice / read-aloud (Web Speech API)
- Teach It mode and in-browser OpenAI coaching
- Socratic mentor dialogue (in-browser OpenAI)
- Backend server (`server/` Vite plugins)

Older OpenAI UI modes were removed; the **Study helper** uses the shared Render API instead so the key stays server-side.

All data stays in the browser (`localStorage` for training progress and per-topic study-helper chat). Clearing site data resets scores and chat history.

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

**Study helper deploy order:** merge API changes and redeploy Render first, then merge qa-prep and rebuild `p/loop-prep/`. Local dev: run the API on `localhost:8080` with `OPENAI_API_KEY` set.
