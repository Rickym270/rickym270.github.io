# Deploy API to Render

This guide walks through deploying the Spring Boot API to [Render](https://render.com) (free tier) using Docker. For Google Cloud Run or Railway, see [DEPLOY.md](DEPLOY.md) or [DEPLOY_RAILWAY.md](DEPLOY_RAILWAY.md).

## Prerequisites

- Render account: [render.com](https://render.com)
- This repo connected to GitHub (for "Deploy from GitHub repo")

## Step 1: Create Web Service and connect repo

1. In Render, go to **Dashboard** → **New** → **Web Service**.
2. Connect your GitHub account if needed, then select this repository.
3. Set **Root Directory** to `api` so the build context is the `api/` folder (where the Dockerfile lives).

## Step 2: Use Docker

1. In the service configuration, choose **Docker** as the environment (Render will build and run using `api/Dockerfile`).
2. Render will run `docker build` in the root directory you set (`api/`), then run the resulting image. No separate build or start command is required when using a Dockerfile.

The Dockerfile builds the JAR with Maven and runs it with a JRE. The app reads `PORT` from the environment (Render sets this automatically).

## Step 3: Environment variables

In the Render service, go to **Environment** and add the same variables you would use for production (see [DEPLOY.md](DEPLOY.md) for details):


| Variable                                                           | Required                    | Notes                                                                       |
| ------------------------------------------------------------------ | --------------------------- | --------------------------------------------------------------------------- |
| **GH_TOKEN**                                                       | Recommended                 | GitHub Personal Access Token (e.g. `public_repo`) to avoid rate limits      |
| **ADMIN_API_KEY**                                                  | Optional                    | For admin endpoints (e.g. GET `/api/contact`) — e.g. `openssl rand -hex 32` |
| **SMTP_HOST**, **SMTP_PORT**, **SMTP_USERNAME**, **SMTP_PASSWORD** | If using contact form email | Same as in DEPLOY.md / ENV_FILE.md                                          |
| **CONTACT_EMAIL**, **SMTP_FROM_EMAIL**                             | If using contact form       | Where to receive/send mail                                                  |


No GCP- or Railway-specific variables are needed.

## Step 4: Deploy and get the public URL

1. Click **Create Web Service** (or **Save** if editing). Render will build the Docker image and deploy.
2. After the first deploy, open the service and copy the public URL (e.g. `https://your-app-name.onrender.com`).
3. In this repo, set that URL in **one** place:
  - `**html/js/api-config.js`**: set `window.API_BASE_URL = 'https://your-actual-app.onrender.com';`
4. Push the frontend so GitHub Pages (or your host) serves the updated `api-config.js`.

## Free tier notes

- Render’s free tier includes **750 instance hours per month** per workspace. See [Render pricing](https://render.com/pricing) and [Deploy for Free](https://render.com/free).
- Free web services **spin down after 15 minutes of inactivity** and take about **1 minute** to wake on the next request (cold start).
- Ephemeral filesystem: any file changes inside the container are lost on redeploy or spin-down.

## Troubleshooting

- **Build fails**: Run locally from `api/`: `docker build -t api-local .` and fix any Docker or Maven errors. Ensure `./mvnw -DskipTests package` succeeds in `api/`.
- **CORS errors**: The API allows `https://*.onrender.com`, `https://rickym270.github.io`, and local origins. Ensure the frontend is using the Render URL from `api-config.js`.
- **Port**: The app uses `PORT` from Render; do not set `server.port` in env unless you need to override.

