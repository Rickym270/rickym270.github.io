# Deploy API to Railway

This guide walks through deploying the Spring Boot API to [Railway](https://railway.app) (free tier). For Google Cloud Run, see [DEPLOY.md](DEPLOY.md).

## Prerequisites

- Railway account: [railway.app](https://railway.app)
- This repo connected to GitHub (for "Deploy from GitHub repo")

## Step 1: Create project and deploy from GitHub

1. In Railway, click **New Project**.
2. Choose **Deploy from GitHub repo** and select this repository.
3. Set **Root Directory** to `api` so the build runs in the `api/` folder (where `pom.xml` and `Procfile` live).

## Step 2: Build

Railway usually detects Java/Maven. If it does not:

- **Build Command**: `./mvnw -DskipTests package`
- The build runs in the root directory you set (`api/`), so the Maven wrapper is at `./mvnw` there.

This produces `target/api-0.0.1-SNAPSHOT.jar`.

## Step 3: Start command

Railway can use the **Procfile** in `api/`:

```text
web: java -jar target/api-0.0.1-SNAPSHOT.jar
```

If you configure the start command in the Railway UI instead, set:

```text
java -jar target/api-0.0.1-SNAPSHOT.jar
```

Railway sets the `PORT` environment variable; the app reads it via `server.port=${PORT:8080}` in `application.properties`.

## Step 4: Environment variables

In the Railway service, add the same variables you would use for production (see [DEPLOY.md](DEPLOY.md) for details):

| Variable | Required | Notes |
|----------|----------|--------|
| **GH_TOKEN** | Recommended | GitHub Personal Access Token (e.g. `public_repo`) to avoid rate limits |
| **ADMIN_API_KEY** | Optional | For admin endpoints (e.g. GET `/api/contact`) — e.g. `openssl rand -hex 32` |
| **SMTP_HOST**, **SMTP_PORT**, **SMTP_USERNAME**, **SMTP_PASSWORD** | If using contact form email | Same as in DEPLOY.md / ENV_FILE.md |
| **CONTACT_EMAIL**, **SMTP_FROM_EMAIL** | If using contact form | Where to receive/send mail |

No GCP-specific variables are needed.

## Step 5: Get the public URL and update the frontend

1. After the first deploy, open the service in Railway and go to **Settings** → **Networking** (or **Generate Domain**).
2. Copy the public URL (e.g. `https://your-app-name.up.railway.app`).
3. In this repo, set that URL in **one** place:
   - **`html/js/api-config.js`**: set `window.API_BASE_URL = 'https://your-actual-app.up.railway.app';`
4. Optionally keep the same value as the fallback in `html/js/api.js` and `html/pages/contact.html` (replace `YOUR_RAILWAY_APP` with your actual subdomain).
5. Push the frontend so GitHub Pages (or your host) serves the updated `api-config.js`.

## Free tier notes

- Railway’s free tier has usage limits (e.g. hours, sleep after inactivity). See [Railway pricing](https://railway.app/pricing) and docs.
- After inactivity, the app may sleep; the first request after that can be slower (cold start).

## Troubleshooting

- **Build fails**: Run locally from `api/`: `./mvnw clean package -DskipTests`. Fix any compilation errors.
- **CORS errors**: The API allows `https://*.up.railway.app`, `https://rickym270.github.io`, and local origins. Ensure the frontend is using the Railway URL from `api-config.js`.
- **Port**: The app uses `PORT` from Railway; do not set `server.port` in env unless you need to override.
