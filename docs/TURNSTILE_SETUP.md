# Cloudflare Turnstile Setup Guide

This guide explains how to set up Cloudflare Turnstile CAPTCHA for the contact form.

## What is Cloudflare Turnstile?

Cloudflare Turnstile is a free, privacy-focused CAPTCHA alternative that provides bot protection without requiring users to solve puzzles. It's invisible to legitimate users and only challenges suspicious traffic.

## Setup Steps

### 1. Create a Cloudflare Account (if you don't have one)

1. Go to https://dash.cloudflare.com/sign-up
2. Sign up for a free account (no credit card required)

### 2. Add Your Site to Cloudflare (Optional)

- If your site is already on Cloudflare, skip this step
- If not, you can still use Turnstile without adding your site to Cloudflare

### 3. Create a Turnstile Site

1. Log in to Cloudflare Dashboard
2. Navigate to **Security** → **Turnstile**
3. Click **Add Site**
4. Enter your site domain (e.g., `rickym270.github.io`)
5. Choose widget mode:
   - **Managed** (recommended): Automatically challenges suspicious traffic
   - **Non-interactive**: Always invisible, but may allow more bots
   - **Invisible**: Completely invisible, challenges only when needed
6. Click **Create**

### 4. Get Your Site Key and Secret Key

After creating the site, you'll see:
- **Site Key**: Public key used in the frontend (safe to expose)
- **Secret Key**: Private key used in the backend (keep secret!)

### 5. Update Frontend (contact.html)

Replace `YOUR_SITE_KEY_HERE` in `html/pages/contact.html` with your Site Key:

```javascript
const TURNSTILE_SITE_KEY = 'your-actual-site-key-here';
```

And update the widget div:
```html
<div class="cf-turnstile" data-sitekey="your-actual-site-key-here" data-theme="auto"></div>
```

### 6. Set Backend Secret Key

Set the `TURNSTILE_SECRET_KEY` environment variable:

**For local development:**
```bash
export TURNSTILE_SECRET_KEY=your-secret-key-here
```

**For Cloud Run deployment:**
```bash
# Add to your deployment command
gcloud run deploy ricky-api \
  --set-env-vars "TURNSTILE_SECRET_KEY=your-secret-key-here,GH_TOKEN=...,ADMIN_API_KEY=..."
```

Or update your `Makefile`/`deploy.sh` to include it.

### 7. Test

1. Start your API server locally
2. Visit the contact page
3. Fill out the form and submit
4. Check that the Turnstile widget appears (or is invisible if using invisible mode)
5. Verify the form submits successfully

## How It Works

1. **Frontend**: Turnstile widget loads and generates a token
2. **Form Submission**: Token is sent to the backend with form data
3. **Backend Verification**: `TurnstileService` verifies the token with Cloudflare
4. **Result**: If valid, form is processed; if invalid, request is rejected

## Security Features

The contact form now has **three layers** of spam protection:

1. **Honeypot Field**: Hidden field that bots fill (rejected immediately)
2. **Cloudflare Turnstile**: Bot detection and verification
3. **Rate Limiting**: 5 minutes per IP address

## Troubleshooting

### Turnstile widget doesn't appear
- Check that the Turnstile script is loaded: `https://challenges.cloudflare.com/turnstile/v0/api.js`
- Verify your Site Key is correct
- Check browser console for errors

### "CAPTCHA verification failed" error
- Verify `TURNSTILE_SECRET_KEY` is set correctly
- Check that the secret key matches your site key
- Ensure your domain is added to the Turnstile site configuration

### Works locally but fails in production
- Ensure `TURNSTILE_SECRET_KEY` is set in Cloud Run environment variables
- Verify CORS settings allow requests from your domain
- Check Cloud Run logs for Turnstile verification errors

## Cost

**Cloudflare Turnstile is completely free** - no usage limits, no credit card required.

## Resources

- [Cloudflare Turnstile Documentation](https://developers.cloudflare.com/turnstile/)
- [Turnstile Dashboard](https://dash.cloudflare.com/?to=/:account/turnstile)

