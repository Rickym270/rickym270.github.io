# API Deployment

Deploy the Spring Boot API to **Render** (Docker, free tier). See **[DEPLOY_RENDER.md](DEPLOY_RENDER.md)** for step-by-step instructions.

## Environment Variables

Set these in the Render dashboard (Environment) or locally for development:

- **GH_TOKEN** (recommended): GitHub Personal Access Token to avoid rate limits
  - Generate at: https://github.com/settings/tokens (scope: `public_repo`)
  - Without it, GitHub API calls are limited to 60/hour (vs 5,000/hour with a token)

- **ADMIN_API_KEY** (optional): Secret for admin endpoints (e.g. GET `/api/contact`)
  - Generate with: `openssl rand -hex 32`

- **PROJECTS_GITHUB_TTL_MINUTES** (optional): Cache TTL for repo data (default: 720 = 12 hours)
- **PROJECTS_COMMIT_STATUS_TTL_MINUTES** (optional): Cache TTL for commit status (default: 60 = 1 hour)

For contact form email and Turnstile, see [ENV_FILE.md](ENV_FILE.md), [docs/EMAIL_SETUP.md](../docs/EMAIL_SETUP.md), and [docs/TURNSTILE_SETUP.md](../docs/TURNSTILE_SETUP.md).
