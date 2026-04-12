# Tutorials Page Testing

## Overview
The tutorials page has been redesigned with a modern card-based layout. Python tutorial lessons are now split into separate pages for better navigation.

## Structure

### Tutorials Index (`html/pages/tutorials.html`)
- Card-based layout with visual icons
- Each tutorial has its own card with description and link
- Links navigate to tutorial-specific index pages

### Python Tutorial Structure
- **Index Page** (`data/projects/kspythontut/index.html`): Shows introduction section and lesson cards
- **Lesson Pages** (`data/projects/kspythontut/lessons/`):
  - `introduction.html` - Introduction to the tutorial series
  - `lesson-1-setting-up.html` - Setting up Python and PyCharm
  - `lesson-2-hello-world.html` - First Python program
  - `lesson-3-conditionals.html` - If/else statements
  - `lesson-4-loops.html` - For and while loops
- **Listen (read aloud)**: SPA-loaded tutorials that use `.lesson-content` / `.lesson-body` can show the same Web Speech toolbar as blog posts when there is enough speakable text. See **[Article listen](../ARTICLE_LISTEN.md)** and `tests/article-listen.spec.ts` (AI tutorial: utterance content, playing state, **Back to Tutorials while playing** must cancel synthesis).
- **Mermaid**: The AI engineering tutorial includes `<pre class="mermaid">` blocks rendered as SVG in the SPA. See **[Mermaid diagrams](../MERMAID.md)**, `tests/mermaid.spec.ts`, and `tests/tutorial-rendering.spec.ts`.

## Navigation Features
- Each lesson page has a back button at the top linking to table of contents
- Previous/Next navigation at the bottom of each lesson
- All navigation works within the SPA (no full page reloads)

## E2E Test Coverage
Tests verify:
- Tutorials page loads correctly
- Card-based layout displays properly
- Lesson index page shows introduction and lesson cards
- Individual lesson pages load with proper navigation
- Back button returns to lesson index
- Previous/Next navigation works between lessons

**Article listen:** `tests/article-listen.spec.ts` loads the AI guide via SPA, starts Listen while playing, then **Back to Tutorials**; it asserts `speechSynthesis.cancel` is invoked so audio does not continue over the index page.

## Visual Design
- Modern card-based layout matching projects page style
- Styled code blocks for better readability
- Numbered lists with circular badges
- Responsive design for mobile devices
- Full dark mode support

