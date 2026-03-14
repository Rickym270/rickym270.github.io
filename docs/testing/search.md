# Search API Testing

## Overview

The blog search feature lets users type free text in the "Latest Insights" search bar; the UI calls `GET /api/search?q=...` (debounced), shows or hides cards by relevance, and displays "No matching articles" when there are no results. **When the search box is emptied** (e.g. backspace to delete all text, or press Escape) the full card grid is restored: any "Coming soon" placeholder cards reappear if the page has them, or all real post cards are shown when there are no placeholders. The section used for show/hide is always the one inside `#content` so behavior stays correct after SPA navigation.

The API returns articles ranked by relevance. When `OPENAI_API_KEY` is set, the API uses semantic (embedding) similarity; when unset, it uses keyword overlap so tests and local runs work without an API key.

## Contract

- **Endpoint**: `GET /api/search`
- **Query parameter**: `q` (optional). Empty or omitted returns all articles in deterministic order.
- **Response**: 200, JSON array of objects with `id`, `title`, `description`, `url`, `score` (number).

See [contracts/openapi.yml](../contracts/openapi.yml) for the full schema (`ArticleSearchResult`).

## Running API search tests

The Playwright API tests hit the running API server (default `http://localhost:8080`). Start the API first, then run the search spec:

```bash
# Terminal 1: start API
cd api
./mvnw spring-boot:run

# Terminal 2: run search API tests
npx playwright test tests/api-search.spec.ts --project=api
```

Or use the full Playwright setup (if configured) which starts both UI and API servers locally.

## E2E (blog page)

Blog E2E tests in `tests/blog.spec.ts` cover:

- **Search bar**: Visibility of the search input on Engineering and Personal.
- **Search and empty box**: Typing a query (e.g. "accessibility") filters cards; emptying the search box (backspace to delete all text) restores the full grid—no-results hidden, all cards visible again (`Latest Insights search filters cards by query`).
- **Empty box restores grid**: After a search, emptying the input (backspace to delete all) restores the full card grid (`Clearing search restores full card grid`).
- **Escape**: Pressing Escape empties the search input and restores the full card grid (`Escape clears search and restores full card grid`).

These tests do not require the API to be running (the test accepts either outcome when the API is unavailable). They assert on grid state (no-results hidden, card count, visibility) rather than specific placeholder content so they remain valid as you add or remove posts.

## Java unit tests

`api/src/test/java/com/rickym270/services/SearchServiceTest.java` tests the search service with keyword fallback (no `OPENAI_API_KEY`): empty query returns all articles, and a keyword query returns matching articles with the expected fields.

```bash
cd api
./mvnw test -Dtest=SearchServiceTest
```
