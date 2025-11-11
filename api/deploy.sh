#!/bin/bash
#
# Deploy Spring Boot API to Google Cloud Run
# Usage: ./deploy.sh [region] [service-name]
#
# Prerequisites:
# - gcloud CLI installed and authenticated
# - GCP project created and set
# - Required services enabled (Cloud Run, Cloud Build, Artifact Registry)

set -e

# Default values
REGION=${1:-us-east1}
SERVICE=${2:-ricky-api}
PROJECT_ID=$(gcloud config get-value project 2>/dev/null || echo "")

if [ -z "$PROJECT_ID" ]; then
    echo "❌ Error: No GCP project set. Run: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo "🚀 Deploying to Cloud Run..."
echo "   Project: $PROJECT_ID"
echo "   Service: $SERVICE"
echo "   Region:  $REGION"
echo ""

# Check if environment variables are set
if [ -z "$GH_TOKEN" ]; then
    echo "⚠️  Warning: GH_TOKEN not set. GitHub API calls may be rate-limited."
    echo "   Set it with: export GH_TOKEN=your_token"
    echo ""
fi

if [ -z "$ADMIN_API_KEY" ]; then
    echo "⚠️  Warning: ADMIN_API_KEY not set. Admin endpoints will be disabled."
    echo "   Set it with: export ADMIN_API_KEY=your_random_key"
    echo ""
fi

# Build env vars string
ENV_VARS=""
if [ -n "$GH_TOKEN" ]; then
    ENV_VARS="GH_TOKEN=$GH_TOKEN"
fi
if [ -n "$ADMIN_API_KEY" ]; then
    if [ -n "$ENV_VARS" ]; then
        ENV_VARS="$ENV_VARS,ADMIN_API_KEY=$ADMIN_API_KEY"
    else
        ENV_VARS="ADMIN_API_KEY=$ADMIN_API_KEY"
    fi
fi

# Deploy command
DEPLOY_CMD="gcloud run deploy $SERVICE \\
  --region $REGION \\
  --source . \\
  --allow-unauthenticated \\
  --min-instances=0 \\
  --max-instances=3"

if [ -n "$ENV_VARS" ]; then
    DEPLOY_CMD="$DEPLOY_CMD \\
  --set-env-vars \"$ENV_VARS\""
fi

echo "📦 Running deployment..."
eval $DEPLOY_CMD

if [ $? -eq 0 ]; then
    SERVICE_URL=$(gcloud run services describe $SERVICE --region $REGION --format 'value(status.url)')
    echo ""
    echo "✅ Deployment successful!"
    echo "   Service URL: $SERVICE_URL"
    echo ""
    echo "🧪 Test endpoints:"
    echo "   curl $SERVICE_URL/api/health"
    echo "   curl $SERVICE_URL/api/projects"
    echo ""
else
    echo "❌ Deployment failed!"
    exit 1
fi

