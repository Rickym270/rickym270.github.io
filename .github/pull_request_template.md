<!--
PR Title format (use this in the GitHub PR title field):

  <area>: <short, imperative summary>

Examples:
  api: add localhost CORS support for local development
  frontend: cache projects and show data instantly
  tests: stabilize projects page e2e for dynamic loading
-->

### Summary
- What this PR does in 1–2 sentences.

### Changes
- List the key changes made in this PR.

### Why
- Context and the problem this solves.

### Verification
- How you tested this. Include commands, URLs, or screenshots where useful.
- Example:
  - Serve locally: `python3 -m http.server 4321` (or `npx http-server -p 4321 -c-1 .`)
  - Visit: `http://localhost:4321`
  - Navigate to: `html/pages/projects.html`

### Impact
- User-facing impact, API changes, or performance considerations.

### Risks
- Known risks and mitigations (breaking changes, security, rollout plan).

### Rollback
- How to revert safely (commit/PR to revert, steps to redeploy if needed).

### Checklist
- [ ] Unit/e2e tests updated (if applicable)
- [ ] Docs updated (README/docs/DEPLOY.md)
- [ ] CI checks pass (Playwright, build)
- [ ] Cloud Run redeployed (if API changed)

