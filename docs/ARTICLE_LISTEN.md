# Article listen (read aloud)

The site can **read long-form content aloud** using the browser’s **Web Speech API** (`speechSynthesis`). The control is injected on **blog post** and **tutorial lesson** views when there is enough speakable text and the API is available.

## Where it appears

| Context | Container | Inserted before |
| -------- | --------- | ---------------- |
| Blog post (SPA) | `.post-content` | `article#post-body` |
| Tutorial lesson | `.lesson-content` | `.lesson-body` |

The script looks inside `#content` after the SPA loads a page. If extracted plain text is shorter than **20 characters**, no bar is shown (avoids empty or stub pages).

## User experience

### Desktop (wider than 768px)

- A **region** (`role="region"`) with a short heading (“Listen to this article” / localized).
- Primary control: text button **Listen** → **Pause** → **Resume** depending on state.
- **Stop** appears while playback is active.
- Status updates are exposed via an **`aria-live="polite"`** element (screen readers).

### Mobile (768px and below)

- **Compact inline** layout: circular **play / pause** icon button plus a short hint (e.g. “Play to read out loud” in English). No full-width toolbar strip.
- Graphic label, long heading, and Stop are hidden on small screens to save space; the toggle still has an **`aria-label`** that tracks Listen / Pause / Resume.

### Unsupported browsers

If `speechSynthesis` or `SpeechSynthesisUtterance` is missing, a single message is shown instead (see `articleListen.unsupported` in translations).

## What is spoken vs skipped

`html/js/article-listen.js` builds speakable text from a **clone** of the article or lesson body, then removes noisy or non-prose nodes before reading `innerText`. The following are **removed** (not read):

- `script`, `style`, `nav`
- Elements with class `d-none`
- `[aria-hidden="true"]`
- **All `pre` elements** (Mermaid source, code fences, prompt blocks)
- **`code`** (inline code)
- **`svg`**

Whitespace is normalized; sequences of blank lines are collapsed. Diagrams rendered from Mermaid are not read as raw syntax because the `pre` source is stripped; surrounding paragraphs still read normally. For how Mermaid is loaded and rendered in the SPA, see **[Mermaid diagrams](MERMAID.md)**.

## Language

Utterance language follows **`TranslationManager.currentLanguage`** when present (`es` → `es-ES`, otherwise `en-US`), else `document.documentElement.lang`, else English.

Changing site language fires **`languageChanged`**; speech is **cancelled** and the bar is **re-mounted** so labels stay in sync.

## Internationalization

Strings live under **`articleListen`** in:

- `html/js/translations/en.json`
- `html/js/translations/es.json`

Keys include: `label`, `mobileHint`, `listen`, `pause`, `resume`, `stop`, `playing`, `paused`, `unsupported`. Markup uses `data-translate` where applicable; `TranslationManager.applyTranslations()` runs after mount.

## Files

| File | Role |
| ---- | ---- |
| `html/js/article-listen.js` | Mount logic, text extraction, synthesis control, observer, `window.ArticleListen` debug API |
| `html/css/article-listen.css` | Desktop bar, mobile compact layout, dark-mode-friendly toggle colors |
| `index.html` | Loads stylesheet and script (global, after other site scripts as configured) |
| `tests/article-listen.spec.ts` | Regression: SPA post control, dark toggle contrast, Mermaid exclusion (mocked `speak`) |

## SPA lifecycle

- **Initial mount**: `DOMContentLoaded` runs `scanAndMount()`.
- **Navigation**: A **`MutationObserver`** on `#content` watches **`childList` only** (not subtree), with a short **debounce**, so swapping the whole loaded page re-runs the mount without reacting to every in-article DOM tweak (e.g. Mermaid or translation updates).
- **Duplicate guard**: A node with `[data-article-listen-root]` is removed before inserting a new bar for the same container.

## Developer debugging

In the browser console (when the script is loaded):

```js
window.ArticleListen.findListenContext();
window.ArticleListen.extractSpeakableText(document.querySelector('#post-body'));
window.ArticleListen.scanAndMount();
```

Useful to verify mount targets and extracted text without starting playback.

## Tests

```bash
npx playwright test tests/article-listen.spec.ts
```

Recommended: run at least **chromium** and **chromium-iphone** (see `playwright.config.ts`) because layout and accessible names differ by viewport.

## Related documentation

- [Accessibility](ACCESSIBILITY.md) — landmarks, live regions, and broader a11y testing
- [Blog testing](testing/blog.md) — post detail structure (`#post-body`)
- [Tutorials testing](testing/tutorials.md) — lesson layout
