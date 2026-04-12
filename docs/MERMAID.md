# Mermaid diagrams (SPA)

The site renders **Mermaid** diagrams from `<pre class="mermaid">` blocks inside tutorial and other content loaded into the SPA (`#content`). Diagrams follow the active **light/dark** theme and are re-run when **language** changes replace translated diagram source.

## How it works

### Loader and initializer (`html/js/mermaid-init.js`)

- **Lazy CDN**: Mermaid is loaded from jsDelivr (`mermaid@11.4.1`) only when there are unrunnable `.mermaid` nodes (nodes that do not yet contain an `<svg>`).
- **`window.initMermaidInContent(root?)`**: Finds `.mermaid` under `root` (default `#content` or `document.body`), filters to nodes **without** an existing rendered `<svg>`, loads the library if needed, then runs `mermaid.initialize` and `mermaid.run({ nodes })`.
- **Theme**: `mermaid.initialize` uses `theme: 'dark'` when `document.documentElement` has `data-theme="dark"`, otherwise `'default'`.
- **Security**: `securityLevel: 'loose'` is set to match in-page tutorial content; keep diagram source trusted (same-origin or reviewed bundles).

### SPA navigation (`html/js/SPAHack.js`)

After new HTML is injected into `#content`, the SPA checks for `.mermaid` and calls `initMermaidInContent` when available so diagrams render without a full page reload.

### i18n and re-render (`html/js/translation.js`)

For the AI automation tutorial, `data-translate` can swap the **text inside** `<pre class="mermaid">`. When that source changes, the script tracks `dataset.mermaidSource`, sets a flag, and calls `initMermaidInContent` again so diagrams update for the new language. Already-rendered nodes (with `<svg>`) are skipped until the source changes and the pre is eligible for a new run.

### Flowchart label gotchas (Mermaid 11.x)

In `flowchart` / `graph` node text inside `[...]` or `{...}`, an unquoted **`:`** is treated as syntax, which yields **“Syntax error in text”** at render time. Parentheses and other punctuation can also interact badly with the parser depending on context. Prefer **double-quoted labels** whenever the visible text includes a colon, parentheses, slashes you intend as literal text, or other characters that might read as Mermaid syntax, e.g. `A["Artifacts: code, logs, specs"]` instead of `A[Artifacts: code, logs, specs]`, and `B["Step (optional)"]` instead of unquoted `B[Step (optional)]` when in doubt. Apply the same rule after i18n: keep translated diagram strings valid Mermaid. This applies both to SPA `<pre class="mermaid">` sources and to Mermaid fenced blocks in Markdown (for example in [`docs/testing/projects.md`](testing/projects.md)).

### Mermaid in repository Markdown (GitHub)

Fenced blocks with language `mermaid` render on GitHub and in many editors. Use the same quoting rules as above so diagrams in [`docs/UI_TESTING.md`](UI_TESTING.md), post-mortems, and [`docs/testing/README.md`](testing/README.md) stay valid when labels contain colons or parentheses.

## Where it is used

| Location | Notes |
| -------- | ----- |
| `data/projects/aiAutomationTut/index.html` | Multiple flow / sequence diagrams; includes `mermaid-init.js` on full-page load |
| `data/projects/mermaid-smoke/index.html` | Minimal fixture for SPA smoke (`data-testid="mermaid-smoke-root"`) |
| `index.html` | Loads `mermaid-init.js` globally for SPA-injected pages |

## Relationship to “Listen” (read aloud)

Mermaid lives in `<pre class="mermaid">`. The article listen feature **removes all `pre` elements** when building speakable text, so **diagram source is not read** by the Web Speech layer. See **[Article listen](ARTICLE_LISTEN.md)** for the full exclusion list.

## Testing

```bash
npx playwright test tests/mermaid.spec.ts
npx playwright test tests/tutorial-rendering.spec.ts
```

`tests/mermaid.spec.ts` (`[regression]`) covers SPA and full-page loads, three SVGs in the AI tutorial, language toggles, and sequence diagram text nodes. `tests/tutorial-rendering.spec.ts` adds layout/size checks for rendered diagrams.

## Troubleshooting

- **Repeated “Syntax error in text” after navigation or language change:** Often unquoted `:` (or similar) in static or translated diagram source. See [Post-Mortem: static assets, Mermaid, and projects loading](Post-Mortem/static-assets-repeated-errors-mermaid-projects.md).
- **Blank diagram area**: Check the browser console for `[Mermaid]` warnings; confirm CDN is reachable (corporate blockers).
- **Diagrams after language switch**: Ensure `initMermaidInContent` runs after translation updates (see `translation.js` and `dataset.mermaidInitRequested` on the guide root).
- **Theme mismatch**: Toggle site dark mode and re-open the page or trigger a re-init so `getMermaidTheme()` runs again.

## Related documentation

- **[Article listen](ARTICLE_LISTEN.md)** — Read-aloud feature; skips `pre` / Mermaid source for speech
- **[UI testing](UI_TESTING.md)** — Running Playwright locally
- **[Tutorials testing](testing/tutorials.md)** — Tutorial navigation and lesson structure
- **[Projects testing](testing/projects.md)** — Includes Markdown Mermaid diagrams; quote labels as above so GitHub and the SPA stay valid
