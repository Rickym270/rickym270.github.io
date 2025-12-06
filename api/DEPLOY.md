# Cloud Run Deployment Guide

This guide walks you through deploying the Spring Boot API to Google Cloud Run.

## Prerequisites

1. **Install gcloud CLI** (if not already installed):
   ```bash
   # macOS
   brew install --cask google-cloud-sdk
   
   # Or follow: https://cloud.google.com/sdk/docs/install
   ```

2. **Initialize and authenticate**:
   ```bash
   gcloud init
   gcloud auth login
   gcloud auth application-default login
   ```

3. **Create GCP project and set it** (one-time):
   ```bash
   gcloud projects create ricky-portfolio-api --name="Ricky Portfolio API"
   gcloud config set project ricky-portfolio-api
   ```

4. **Enable required services** (one-time):
   ```bash
   gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
   ```

5. **Verify build compiles locally** (recommended before deploying):
   ```bash
   cd api
   ./mvnw clean package -DskipTests
   # Should complete without errors and create target/api-0.0.1-SNAPSHOT.jar
   ```

## Quick Deploy (Option 1: Using Makefile)

1. **Set environment variables**:
   ```bash
   export GH_TOKEN=your_github_pat_here
   export ADMIN_API_KEY=your_random_admin_key_here
   ```

2. **Deploy**:
   ```bash
   cd api
   make deploy
   ```

   Or with custom region/service:
   ```bash
   make deploy REGION=us-central1 SERVICE=ricky-api
   ```

## Quick Deploy (Option 2: Using deploy.sh script)

1. **Set environment variables**:
   ```bash
   export GH_TOKEN=your_github_pat_here
   export ADMIN_API_KEY=your_random_admin_key_here
   ```

2. **Deploy**:
   ```bash
   cd api
   ./deploy.sh [region] [service-name]
   
   # Examples:
   ./deploy.sh us-east1 ricky-api
   ./deploy.sh                    # Uses defaults: us-east1, ricky-api
   ```

## Manual Deploy (Option 3: Direct gcloud command)

From the `api/` directory:

```bash
cd api

REGION=us-east1
SERVICE=ricky-api

gcloud run deploy $SERVICE \
  --region $REGION \
  --source . \
  --allow-unauthenticated \
  --set-env-vars "GH_TOKEN=your_pat_here,ADMIN_API_KEY=your_random_admin_key" \
  --min-instances=0 \
  --max-instances=3
```

## Environment Variables

- **GH_TOKEN** (highly recommended): GitHub Personal Access Token to avoid rate limits
  - **Required for production** to avoid hitting GitHub API rate limits (5,000/hour vs 60/hour unauthenticated)
  - Generate at: https://github.com/settings/tokens
  - Scopes: `public_repo` (read access to public repos)
  - The service will log a warning if GH_TOKEN is not set
  - Without GH_TOKEN, you may see rate limit errors when checking project commit status

- **ADMIN_API_KEY** (optional): Random secret key for admin endpoints (e.g., `/api/contact` GET)
  - Generate with: `openssl rand -hex 32`

- **PROJECTS_GITHUB_TTL_MINUTES** (optional): Cache TTL for GitHub repository data (default: 720 = 12 hours)
  - Increase to reduce API calls, decrease for more frequent updates

- **PROJECTS_COMMIT_STATUS_TTL_MINUTES** (optional): Cache TTL for commit status checks (default: 60 = 1 hour)
  - Individual commit status checks are cached per repository

## Useful Commands

### View service URL
```bash
make service-url
# Or:
gcloud run services describe ricky-api --region us-east1 --format 'value(status.url)'
```

### View logs
```bash
make logs
# Or:
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=ricky-api" --limit 50
```

### Update environment variables
```bash
make set-env
# Or manually:
gcloud run services update ricky-api \
  --region us-east1 \
  --update-env-vars "GH_TOKEN=new_token,ADMIN_API_KEY=new_key"
```

### Test endpoints
```bash
make test
# Or manually:
API_URL=$(gcloud run services describe ricky-api --region us-east1 --format 'value(status.url)')
curl $API_URL/api/health
curl $API_URL/api/projects
```

## Cost Notes

- **Free tier**: ~2M requests/month, 180k vCPU-seconds, 360k GiB-seconds
- **Min instances = 0**: Scales to zero when idle (no idle cost)
- **Portfolio API**: Typically stays within free tier limits
- Monitor usage: https://console.cloud.google.com/billing

## Troubleshooting

### Build fails
- Ensure you're running from the `api/` directory (where `pom.xml` lives)
- Check Java 17 compatibility: Cloud Run supports Java 17+
- Verify compilation locally first: `./mvnw clean package -DskipTests`
- Check for compilation errors in the build output

### CORS errors
- Verify `@CrossOrigin(origins = "https://rickym270.github.io")` is on all controllers
- Check you're calling the Cloud Run URL, not localhost

### GitHub rate limits
- Set `GH_TOKEN` environment variable with a valid PAT
- Re-deploy with: `make deploy` or update env vars: `make set-env`

### Cold starts
- Normal for scale-to-zero (min-instances=0)
- First request may take 5-10 seconds
- To reduce: set `--min-instances=1` (may incur small cost)

## Next Steps

After deployment:

1. **Get your service URL**:
   ```bash
   make service-url
   ```

2. **Update your frontend** to use the Cloud Run URL instead of localhost:
   ```javascript
   const API = "https://ricky-api-xxxxx-uc.a.run.app";
   ```

3. **Test the endpoints**:
   ```bash
   make test
   ```

## Makefile Commands Reference

```bash
make help          # Show all available commands
make deploy        # Deploy to Cloud Run
make logs          # View service logs
make service-url   # Get service URL
make test          # Test deployed endpoints
make set-env       # Update environment variables (interactive)
make check-project # Verify GCP project is set
```

