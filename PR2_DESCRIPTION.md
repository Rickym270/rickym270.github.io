# Add Backend API Controller Tests with MockMvc

## Summary
This PR adds integration tests for Spring Boot controllers using MockMvc and @WebMvcTest. This is the second layer of the test pyramid, testing the HTTP layer (controllers) in isolation from service logic and external dependencies.

## Changes

### Controller Tests
Added **12 integration tests** in `api/src/test/java/com/rickym270/controllers/`:

- **HealthControllerTest** (3 tests)
  - GET `/api` returns health status
  - GET `/api/health` returns health status
  - Verifies required fields (status, version, time)

- **HomeControllerTest** (1 test)
  - GET `/api/home` returns plain text "Home"

- **MetaControllerTest** (2 tests)
  - GET `/api/meta` returns profile metadata
  - Verifies all required fields (name, title, location, languages, github, portfolio)

- **ProjectsControllerTest** (3 tests)
  - GET `/api/projects` returns JSON array
  - GET `/api/projects?source=curated` with query parameter
  - Handles empty project list

- **StatsControllerTest** (3 tests)
  - GET `/api/stats` returns statistics
  - Handles zero projects case
  - Verifies required fields (projects, languages, lastUpdated)

### Test Approach
- Uses **@WebMvcTest** for lightweight controller testing (only loads web layer)
- Mocks service layer with **@MockBean** (ProjectsService, ProjectsStatsService)
- Verifies HTTP contract: status codes, content types, JSON structure
- No external network calls (GitHub API is mocked at service level)

## Why

**Test Pyramid - Integration Layer**: This adds the middle layer:
- ✅ **Unit tests** (PR1): Fast, test pure logic
- ✅ **Integration tests** (this PR): Test HTTP layer, controller behavior
- ✅ **E2E tests** (existing): Full user flows with Playwright

**Benefits**:
- 🎯 **Focused**: Tests HTTP layer without full Spring context
- ⚡ **Fast**: Runs in ~8 seconds (vs minutes for E2E)
- 🛡️ **Isolated**: No external dependencies, deterministic
- 🔍 **Contract verification**: Ensures API responses match expected structure

## Testing

**Run controller tests:**
```bash
cd api
./mvnw test -Dtest='*ControllerTest'
```

**Expected output:**
```
Tests run: 12, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

**Run all API tests:**
```bash
cd api
./mvnw test
```

## Impact

- **No breaking changes**: Production code unchanged
- **Fast feedback**: Controller tests run quickly in CI
- **Better coverage**: HTTP layer now has dedicated tests
- **Service tests remain**: Existing ProjectsServiceTest still runs

## Files Changed

**New files:**
- `api/src/test/java/com/rickym270/controllers/HealthControllerTest.java`
- `api/src/test/java/com/rickym270/controllers/HomeControllerTest.java`
- `api/src/test/java/com/rickym270/controllers/MetaControllerTest.java`
- `api/src/test/java/com/rickym270/controllers/ProjectsControllerTest.java`
- `api/src/test/java/com/rickym270/controllers/StatsControllerTest.java`

## Next Steps

This is PR2 of 3 in the test pyramid implementation:
- ✅ **PR1**: Frontend unit tests
- ✅ **PR2** (this): Backend API controller tests
- 🔜 **PR3**: API contract/schema validation

