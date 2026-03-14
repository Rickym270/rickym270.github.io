# Search API Testing

## Overview

The blog search endpoint `GET /api/search` returns articles ranked by relevance. When `OPENAI_API_KEY` is set, the API uses semantic (embedding) similarity; when unset, it uses keyword overlap so tests and local runs work without an API key.

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

Blog E2E tests in `tests/blog.spec.ts` cover the search bar on the Engineering (and Personal) page: visibility of the search input, typing a query, and either seeing matching cards or the "No matching articles" message. These tests do not require the API to be running (the test accepts either outcome when the API is unavailable).

## Java unit tests

`api/src/test/java/com/rickym270/services/SearchServiceTest.java` tests the search service with keyword fallback (no `OPENAI_API_KEY`): empty query returns all articles, and a keyword query returns matching articles with the expected fields.

```bash
cd api
./mvnw test -Dtest=SearchServiceTest
```
