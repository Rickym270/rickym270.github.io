---
title: "Repeated errors from static assets (Mermaid diagrams + projects loading)"
date: "2026-04-12"
owner: "Ricky M"
status: "Resolved"
---

# Repeated errors from static assets (Mermaid diagrams + projects loading)

## Summary

Two classes of **static, repo-committed assets** led to **user-visible or console errors appearing more than once** in normal browsing: (1) **Mermaid** diagram source in the AI automation tutorial (`data/projects/aiAutomationTut/index.html` and translated strings) used **unquoted node labels containing colons**, which Mermaid **11.x** parses as syntax—each **SPA navigation**, **language switch**, or **re-init** could run the parser again and surface the same **“Syntax error in text”** bomb UI. (2) The **Projects** page historically leaned on **blocking** flows that combined the **API**, **localStorage**, and **`/data/web_data/projects.json`** in overlapping ways (including **prefetch**), which increased the chance of **redundant network work**, **races**, and **confusing fallback/error behavior** when the API was slow or failing—static reads and fallbacks could participate in multiple logical paths in one session.

## Impact

- **Tutorial / Mermaid:** Broken or alarming diagram regions between sections of the AI automation guide on production; errors could repeat when users toggled language or navigated away and back, because diagram source was re-applied and Mermaid ran again.
- **Projects:** Slow first paint when the API cold-started or rate-limited; risk of **stacked “cached / outdated” messaging** or inconsistent state if multiple code paths treated static JSON and API results as peers without a single orchestrated story.
- **Trust:** Repeated console or in-content errors suggested site instability even when data was ultimately recoverable from static JSON.

## Root Cause

### 1. Mermaid flowchart labels in static and translated source

In `flowchart` / `graph` syntax, text inside `[...]` or `{...}` treats an unquoted **`:`** as special. Labels such as `A[Artifacts: code, logs, specs]` are invalid in Mermaid 11.x; the renderer throws, and the SPA’s `initMermaidInContent` path can run again after **i18n** updates the `<pre class="mermaid">` body—so the **same static mistake** produced **multiple** error presentations per session.

### 2. Projects: API-first blocking and duplicate concerns

Serving the list only after a successful **`/api/projects`** call left the page on “Loading…” while Render (or similar) woke up. **Prefetch** from `index.html` and **on-demand** `fetchProjects()` shared **`projectsCachePromise`** in ways that had to be coordinated with **first paint** so the UI did not **fight** between “static now” and “API a moment later.” Without a dedicated **cache-first** read and a **single** background refresh, static file reads and API errors could feel like **multiple failures** rather than one controlled cold path plus one background upgrade.

## Contributing Factors

- **Mermaid** loaded lazily from CDN and run over **all unrunnable** `.mermaid` nodes; invalid source always fails, regardless of CDN health.
- **Translations** (`html/js/translations/en.json`, `es.json`) duplicated diagram strings; both default HTML and translated keys had to be fixed.
- **Projects** static list lives at **`/data/web_data/projects.json`**; it is **updated by CI** (`.github/workflows/update-content.yml`), not by the browser—so the fix is **front-end orchestration** and **authoring rules**, not rewriting that file from JS.
- **SPA** re-executes or re-injects scripts when loading `html/pages/projects.html`; globals and promises must not assume a single page load.

## Resolution / Fix

### Mermaid (static tutorial + i18n)

1. **Quote** any node label that includes a colon, parentheses, or other ambiguous punctuation, e.g. `A["Artifacts: code, logs, specs"]`, per Mermaid documentation.
2. Apply the same fixes to **English** defaults in `data/projects/aiAutomationTut/index.html` and to **`lessons.aiTutorial.*`** diagram keys in **`html/js/translations/en.json`** and **`html/js/translations/es.json`**.
3. Document the rule in **`docs/MERMAID.md`** and guard with **`tests/mermaid.spec.ts`** so SPA and language toggles keep passing.

### Projects (static JSON + API without repeated error paths)

1. **Cold path:** `fetchProjectsCacheFirst()` reads **`/data/web_data/projects.json`** then **TTL `localStorage`** only—**no API** on the critical path to first paint.
2. **Background refresh:** `fetchProjectsFromAPIBackground()` calls **`/api/projects` only** (no static fallback inside that flight), then compares to the painted rows with an **order-insensitive** `projectsDataEqual` / `projectFingerprint`; **equal** → persist snapshots and remove the fallback note **without** re-rendering; **different** → `renderProjects` then persist.
3. **Prefetch race:** `initProjects` **awaits** `window.projectsCachePromise` when present so a home-prefetched API result is not racing a redundant static-first paint.
4. **Single background job:** `window.__projectsBackgroundRefreshPending` prevents overlapping background refreshes.
5. **At most one banner:** `removeProjectFallbackNotesFromContent()` before inserting the fallback note.
6. **Persistence after API success:** `persistProjectsApiSnapshot` → **`sessionStorage`** (`portfolio_projects_api_session_v1`) and **`localStorage`** (`portfolio_projects_cache` with TTL) so revisits skip the cold banner when appropriate.

See **`docs/testing/projects.md`** (Mermaid diagrams) and **`docs/TESTING.md`** (Projects endpoint behavior) for the full runtime description.

## Why this approach

- **Quoted Mermaid labels** are the supported fix for literal punctuation; they work for both SPA diagrams and Markdown diagrams in docs.
- **Cache-first paint + background API** decouples “something useful on screen immediately” from “authoritative merged list from GitHub,” which removes the worst API cold-start UX and avoids treating every static read as a separate error surface.
- **One guarded background flight** and **promise coordination** with prefetch reduce duplicate work and duplicate user-visible failure modes.

## Prevention

- **Authoring:** For any new Mermaid in tutorials or docs, **default to double-quoted labels** whenever the visible text is not a single plain word.
- **Projects:** Prefer extending **`fetchProjectsCacheFirst` / `fetchProjectsFromAPIBackground` / `persistProjectsApiSnapshot`** rather than adding new ad-hoc `fetch('/data/web_data/projects.json')` call sites.
- **QA:** Run Playwright **`tests/mermaid.spec.ts`** and **`tests/projects.spec.ts`** on changes that touch diagram source, translations, or projects loading.

## Action items

- [ ] Periodically scan repo for `class="mermaid"` and `\[[^\]"]*:[^\]`-style unquoted colons in node text (or rely on CI and manual review for new content).
- [ ] If new static JSON consumers are added, document whether they are **read-only** cache-first or **blocking** API consumers to avoid reintroducing duplicate paths.
