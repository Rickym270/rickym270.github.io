# GitHub Secrets Setup Guide

This guide explains how to configure GitHub Secrets for CI/CD workflows.

## Why GitHub Secrets?

- **Security**: Secrets are encrypted and never exposed in logs or code
- **CI/CD**: Required for running tests and deployments in GitHub Actions
- **Best Practice**: Never commit sensitive credentials to version control

## Required Secrets

### Email Configuration (Required for Contact Form)

1. **SMTP_HOST**
   - Value: `smtp.gmail.com` (for Gmail)
   - Or your SMTP provider's hostname

2. **SMTP_PORT**
   - Value: `587` (for Gmail with TLS)
   - Or your SMTP provider's port

3. **SMTP_USERNAME**
   - Value: Your Gmail address (e.g., `your-email@gmail.com`)

4. **SMTP_PASSWORD**
   - Value: Gmail App Password (16 characters)
   - **Not your regular Gmail password!**
   - Generate at: https://myaccount.google.com/apppasswords

5. **CONTACT_EMAIL**
   - Value: Email address where contact form submissions should be sent
   - Example: `your-email@gmail.com`

6. **SMTP_FROM_EMAIL**
   - Value: Email address shown as sender
   - Example: `contact@rickym270.github.io` or `your-email@gmail.com`

### Optional Secrets

7. **GH_TOKEN**
   - Value: GitHub Personal Access Token (for fetching repo data)
   - Generate at: https://github.com/settings/tokens
   - Scopes needed: `public_repo` (read-only)
   - **Note**: Must be named `GH_TOKEN` (not `GITHUB_TOKEN`) because GitHub reserves the `GITHUB_` prefix

8. **ADMIN_API_KEY**
   - Value: Custom API key for admin endpoints
   - Used for retrieving contact messages via `/api/contact` GET endpoint

9. **TURNSTILE_SECRET_KEY**
   - Value: Cloudflare Turnstile secret key
   - Get from: https://dash.cloudflare.com/
   - Used for spam protection on contact form

## How to Add Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Enter the **Name** (exactly as listed above, case-sensitive)
5. Enter the **Value**
6. Click **Add secret**
7. Repeat for each secret

## Verification

After adding secrets, your GitHub Actions workflows will automatically use them. You can verify by:

1. Running a workflow manually (`workflow_dispatch`)
2. Checking the workflow logs (secrets are masked in logs)
3. Testing the contact form endpoint in CI

## Local Development

For local development, use the `.env` file (see `api/.env.example`):

1. Copy `api/.env.example` to `api/.env`
2. Fill in your actual values
3. The `.env` file is already in `.gitignore` - **never commit it!**

## Security Best Practices

✅ **DO:**
- Use GitHub Secrets for CI/CD
- Use `.env` files for local development (gitignored)
- Use App Passwords for Gmail (not regular passwords)
- Rotate secrets periodically
- Use different credentials for production vs development

❌ **DON'T:**
- Commit `.env` files to git
- Hardcode secrets in code
- **Hardcode secrets in documentation examples** - always use environment variables (e.g., `${ADMIN_API_KEY}`) or placeholders (e.g., `your-admin-key`)
- Share secrets in chat/email
- Use production secrets in development

## Troubleshooting

### "Secret not found" in CI
- Verify the secret name matches exactly (case-sensitive)
- Check that secrets are added to the correct repository
- Ensure the workflow has access to secrets (not in `pull_request` from forks)

### Email not sending in CI
- Verify all SMTP secrets are set correctly
- Check that `SMTP_PASSWORD` is an App Password (not regular password)
- Review API server logs in workflow artifacts

### Contact form works locally but not in CI
- Ensure all required secrets are configured in GitHub
- Check that secrets are not empty or contain placeholder values

## Documentation Examples

When writing documentation that includes API key examples:

✅ **DO:**
- Use environment variable references: `curl -H "X-API-Key: \${ADMIN_API_KEY}" ...`
- Use clear placeholders: `ADMIN_API_KEY="your-admin-key"`
- Add security warnings: "Never hardcode API keys in production"

❌ **DON'T:**
- Use example keys like `"my-secret-key"` or `"test-key-123"` that could be mistaken for real keys
- Hardcode actual API keys in documentation
- Include credentials in code examples without warnings

