# Add API Contract/Schema Validation

## Summary
This PR adds lightweight contract validation tests that ensure API responses match the expected schema defined in the OpenAPI spec. This protects the frontend/backend integration by validating response shapes without requiring network calls.

## Changes

### JSON Schema Files
Created schema files in `contracts/` based on the existing `docs/contracts/openapi.yml`:
- **`project.schema.json`**: Validates project objects (required: slug, name, repo)
- **`health-response.schema.json`**: Validates health check responses
- **`meta-response.schema.json`**: Validates profile metadata responses
- **`stats-response.schema.json`**: Validates statistics responses

### Contract Validation Tests
Added **13 contract validation tests** in `tests/unit/contracts/api-contracts.test.js`:
- ✅ Valid project examples pass validation
- ✅ Minimal projects (only required fields) pass
- ✅ Projects missing required fields fail with clear errors
- ✅ Valid health, meta, and stats responses pass
- ✅ Invalid responses (wrong types, missing fields) fail appropriately

### Dependencies
- Added **ajv** (JSON Schema validator)
- Added **ajv-formats** (for URI format validation)
- Added **vitest** (test runner, also used by PR1)

### Scripts
- `npm run test:unit` - Run all unit tests (including contracts)
- `npm run test:contracts` - Run only contract validation tests

## Why

**Test Pyramid - Contract Layer**: This adds contract validation to ensure:
- ✅ **Unit tests** (PR1): Fast, test pure logic
- ✅ **Integration tests** (PR2): Test HTTP layer
- ✅ **Contract tests** (this PR): Validate API response shapes
- ✅ **E2E tests** (existing): Full user flows

**Benefits**:
- 🛡️ **Protection**: Catches breaking API changes before they reach frontend
- 📋 **Documentation**: Schemas serve as living documentation
- ⚡ **Fast**: Runs in <1 second, no network calls
- 🔍 **Clear errors**: Validation failures show exactly what's wrong

## Testing

**Run contract tests:**
```bash
npm install
npm run test:contracts
```

**Expected output:**
```
✓ tests/unit/contracts/api-contracts.test.js (13 tests) 66ms

Test Files  1 passed (1)
     Tests  13 passed (13)
```

## Impact

- **No breaking changes**: Production code unchanged
- **Fast feedback**: Contract tests run quickly in CI
- **Better integration**: Frontend/backend contract is now validated
- **Documentation**: Schemas clarify expected API response structure

## Files Changed

**New files:**
- `contracts/project.schema.json`
- `contracts/health-response.schema.json`
- `contracts/meta-response.schema.json`
- `contracts/stats-response.schema.json`
- `tests/unit/contracts/api-contracts.test.js`
- `vitest.config.js`

**Modified files:**
- `package.json` (added ajv, ajv-formats, vitest, test scripts)
- `package-lock.json` (dependency updates)

## Schema Details

### Project Schema
- **Required**: `slug`, `name`, `repo`
- **Optional**: `summary`, `tech` (array), `featured` (boolean), `status` (string)
- Allows additional properties for flexibility

### Health Response Schema
- **Required**: `status`, `version`, `time`
- `time` must be ISO-8601 format

### Meta Response Schema
- **Required**: `name`, `title`, `location`, `languages`, `github`, `portfolio`
- `languages` is an array of strings
- `github` and `portfolio` must be valid URIs

### Stats Response Schema
- **Required**: `projects` (integer), `languages` (array), `lastUpdated` (ISO-8601)

## Next Steps

This completes the test pyramid implementation:
- ✅ **PR1**: Frontend unit tests
- ✅ **PR2**: Backend API controller tests
- ✅ **PR3** (this): API contract/schema validation

All three layers are now in place, providing comprehensive test coverage from unit to integration to contract validation.

