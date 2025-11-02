.PHONY: deploy logs set-env check-project help

# Default values
REGION ?= us-east1
SERVICE ?= ricky-api

help: ## Show this help message
	@echo "Cloud Run Deployment Makefile"
	@echo ""
	@echo "Usage: make [target] [REGION=us-east1] [SERVICE=ricky-api]"
	@echo ""
	@echo "Targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\n", $$1, $$2}'

check-project: ## Check if GCP project is set
	@if [ -z "$$(gcloud config get-value project 2>/dev/null)" ]; then \
		echo "❌ Error: No GCP project set. Run: gcloud config set project YOUR_PROJECT_ID"; \
		exit 1; \
	fi
	@gcloud config get-value project

deploy: check-project ## Deploy to Cloud Run (requires GITHUB_TOKEN and ADMIN_API_KEY env vars)
	@if [ -z "$$GITHUB_TOKEN" ] || [ -z "$$ADMIN_API_KEY" ]; then \
		echo "⚠️  Warning: GITHUB_TOKEN and/or ADMIN_API_KEY not set"; \
		echo "   Run: export GITHUB_TOKEN=your_token ADMIN_API_KEY=your_key"; \
		echo ""; \
		read -p "Continue anyway? (y/N) " -n 1 -r; \
		echo ""; \
		if [[ ! $$REPLY =~ ^[Yy]$$ ]]; then \
			exit 1; \
		fi; \
	fi
	@echo "🚀 Deploying to Cloud Run..."
	@echo "   Project: $$(gcloud config get-value project)"
	@echo "   Service: $(SERVICE)"
	@echo "   Region:  $(REGION)"
	@ENV_VARS=""; \
	if [ -n "$$GITHUB_TOKEN" ]; then ENV_VARS="GITHUB_TOKEN=$$GITHUB_TOKEN"; fi; \
	if [ -n "$$ADMIN_API_KEY" ]; then \
		if [ -n "$$ENV_VARS" ]; then ENV_VARS="$$ENV_VARS,ADMIN_API_KEY=$$ADMIN_API_KEY"; \
		else ENV_VARS="ADMIN_API_KEY=$$ADMIN_API_KEY"; fi; \
	fi; \
	if [ -n "$$ENV_VARS" ]; then \
		gcloud run deploy $(SERVICE) \
			--region $(REGION) \
			--source . \
			--allow-unauthenticated \
			--set-env-vars "$$ENV_VARS" \
			--min-instances=0 \
			--max-instances=3; \
	else \
		gcloud run deploy $(SERVICE) \
			--region $(REGION) \
			--source . \
			--allow-unauthenticated \
			--min-instances=0 \
			--max-instances=3; \
	fi
	@echo ""
	@echo "✅ Deployment successful!"
	@make service-url

logs: ## View Cloud Run service logs
	@gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=$(SERVICE)" \
		--limit 50 \
		--format json \
		--project $$(gcloud config get-value project)

set-env: check-project ## Set environment variables (interactive)
	@read -p "GITHUB_TOKEN: " GITHUB_TOKEN; \
	read -p "ADMIN_API_KEY: " ADMIN_API_KEY; \
	echo ""; \
	ENV_VARS="GITHUB_TOKEN=$$GITHUB_TOKEN,ADMIN_API_KEY=$$ADMIN_API_KEY"; \
	gcloud run services update $(SERVICE) \
		--region $(REGION) \
		--update-env-vars "$$ENV_VARS" || \
	echo "Service not found. Deploy first with: make deploy"

service-url: ## Get the Cloud Run service URL
	@gcloud run services describe $(SERVICE) \
		--region $(REGION) \
		--format 'value(status.url)'

test: ## Test the deployed API endpoints
	@API_URL=$$(make service-url 2>/dev/null); \
	if [ -z "$$API_URL" ]; then \
		echo "❌ Service not found. Deploy first."; \
		exit 1; \
	fi; \
	echo "🧪 Testing $$API_URL"; \
	echo ""; \
	echo "Health:"; curl -s $$API_URL/api/health | jq . || curl -s $$API_URL/api/health; \
	echo ""; \
	echo "Projects (first 100 chars):"; curl -s $$API_URL/api/projects | head -c 100; echo "..."; \
	echo ""

