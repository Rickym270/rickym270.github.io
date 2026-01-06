# Add Frontend Unit Tests with Vitest

## Summary
This PR adds a fast, deterministic unit testing layer for pure JavaScript functions using Vitest. This is the first step in implementing a test pyramid approach, adding fast unit tests below the existing Playwright E2E tests.

## Changes

### Test Framework Setup
- Added **Vitest** as dev dependency (ES module compatible, no babel config needed)
- Created `vitest.config.js` to exclude Playwright tests and focus on unit tests
- Added npm scripts:
  - `npm run test:unit` - Run unit tests once
  - `npm run test:unit:watch` - Watch mode for development

### Helper Modules (Extracted for Testability)
Created pure function modules in `html/js/lib/`:
- **`projects-helpers.js`**: Project name normalization, classification matching, image path generation
- **`api-helpers.js`**: Network error enhancement for CORS/network issues
- **`i18n-helpers.js`**: Translation lookup with English fallback, language preference detection

### Unit Tests
Added **29 unit tests** in `tests/unit/` covering:
- ✅ Project name normalization (`normalizeProjectName`)
- ✅ Classification matching with variations (`matchesClassification`)
- ✅ Image path generation for projects (`getProjectImage`)
- ✅ API error enhancement for network/CORS issues (`enhanceNetworkError`)
- ✅ Translation lookup with nested keys and fallback (`translate`)
- ✅ Language preference detection from localStorage/browser (`getDefaultLanguage`)

### Documentation
- Updated `README.md` with unit test instructions and what's tested

## Why

**Test Pyramid**: This adds the fast, bottom layer of the test pyramid:
- **Unit tests** (this PR): Fast, deterministic, test pure logic
- **Integration tests** (future PR2): API controller tests with MockMvc
- **E2E tests** (existing): Playwright tests for full user flows

**Benefits**:
- ⚡ **Fast feedback**: All 29 tests run in ~1 second (vs minutes for E2E)
- 🎯 **Deterministic**: No flakiness from network, browser, or timing issues
- 🔍 **Focused**: Tests pure logic in isolation
- 🛡️ **Safety net**: Catch regressions in helper functions before they reach E2E tests

## Testing

**Run unit tests:**
```bash
npm install
npm run test:unit
```

**Expected output:**
```
✓ tests/unit/api-helpers.test.js (5 tests) 8ms
✓ tests/unit/projects-helpers.test.js (12 tests) 13ms
✓ tests/unit/i18n-helpers.test.js (12 tests) 9ms

Test Files  3 passed (3)
     Tests  29 passed (29)
  Duration  986ms
```

## Impact

- **No breaking changes**: Original browser code remains unchanged
- **Minimal refactoring**: Helper modules are new files, existing code untouched
- **Fast CI**: Unit tests can run in parallel with E2E tests
- **Developer experience**: Fast feedback loop for logic changes

## Files Changed

**New files:**
- `vitest.config.js`
- `html/js/lib/projects-helpers.js`
- `html/js/lib/api-helpers.js`
- `html/js/lib/i18n-helpers.js`
- `tests/unit/projects-helpers.test.js`
- `tests/unit/api-helpers.test.js`
- `tests/unit/i18n-helpers.test.js`

**Modified files:**
- `package.json` (added vitest dependency and scripts)
- `package-lock.json` (dependency updates)
- `README.md` (unit test documentation)

## Next Steps

This is PR1 of 3 in the test pyramid implementation:
- ✅ **PR1** (this): Frontend unit tests
- 🔜 **PR2**: Backend API controller tests (MockMvc)
- 🔜 **PR3**: API contract/schema validation

