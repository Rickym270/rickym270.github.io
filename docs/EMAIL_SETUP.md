# Email Configuration Guide

This guide explains how to configure email sending for the contact form.

## Overview

The contact form sends email notifications when someone submits a message. Email configuration is done via environment variables to keep credentials secure.

## Email Service Providers

You can use any SMTP-compatible email service:

### Option 1: Gmail (Recommended for testing)

1. **Enable App Passwords**:
   - Go to https://myaccount.google.com/apppasswords
   - Generate an app password (not your regular password)
   - Save this password

2. **Set Environment Variables**:
   ```bash
   export SMTP_HOST=smtp.gmail.com
   export SMTP_PORT=587
   export SMTP_USERNAME=your-email@gmail.com
   export SMTP_PASSWORD=your-app-password
   export CONTACT_EMAIL=your-email@gmail.com
   export SMTP_FROM_EMAIL=your-email@gmail.com
   ```

### Option 2: SendGrid (Recommended for production)

1. **Sign up**: https://sendgrid.com (free tier: 100 emails/day)

2. **Get API Key**:
   - Dashboard → Settings → API Keys
   - Create API Key with "Mail Send" permissions

3. **Set Environment Variables**:
   ```bash
   export SMTP_HOST=smtp.sendgrid.net
   export SMTP_PORT=587
   export SMTP_USERNAME=apikey
   export SMTP_PASSWORD=your-sendgrid-api-key
   export CONTACT_EMAIL=your-email@example.com
   export SMTP_FROM_EMAIL=noreply@yourdomain.com
   ```

### Option 3: Mailgun

1. **Sign up**: https://www.mailgun.com (free tier: 5,000 emails/month)

2. **Get SMTP Credentials**:
   - Dashboard → Sending → SMTP credentials

3. **Set Environment Variables**:
   ```bash
   export SMTP_HOST=smtp.mailgun.org
   export SMTP_PORT=587
   export SMTP_USERNAME=your-mailgun-username
   export SMTP_PASSWORD=your-mailgun-password
   export CONTACT_EMAIL=your-email@example.com
   export SMTP_FROM_EMAIL=noreply@yourdomain.com
   ```

## Configuration

### Local Development

Add to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.):
```bash
export SMTP_HOST=smtp.gmail.com
export SMTP_PORT=587
export SMTP_USERNAME=your-email@gmail.com
export SMTP_PASSWORD=your-app-password
export CONTACT_EMAIL=your-email@gmail.com
export SMTP_FROM_EMAIL=your-email@gmail.com
```

Then restart your terminal or run `source ~/.zshrc`.

### Cloud Run Deployment

Add environment variables when deploying:

```bash
gcloud run deploy ricky-api \
  --set-env-vars "SMTP_HOST=smtp.sendgrid.net,SMTP_PORT=587,SMTP_USERNAME=apikey,SMTP_PASSWORD=your-key,CONTACT_EMAIL=your@email.com,SMTP_FROM_EMAIL=noreply@yourdomain.com"
```

Or update your `Makefile`/`deploy.sh` to include these variables.

## Testing

1. **Start API server**:
   ```bash
   cd api
   ./mvnw spring-boot:run
   ```

2. **Submit contact form** on your site

3. **Check email inbox** - you should receive the notification

4. **Check API logs** - look for `[EmailService] Contact email sent successfully`

## Troubleshooting

### Email not sending

- **Check environment variables**: Ensure all SMTP variables are set
- **Check logs**: Look for `[EmailService]` messages in API logs
- **Test SMTP connection**: Use a tool like `telnet` or `swaks` to test SMTP
- **Gmail**: Make sure you're using an App Password, not your regular password
- **SendGrid**: Verify API key has "Mail Send" permission

### "CONTACT_EMAIL not configured" warning

- Set `CONTACT_EMAIL` environment variable to your email address
- This is the email that receives contact form submissions

### Email goes to spam

- Set `SMTP_FROM_EMAIL` to a domain you own
- Configure SPF/DKIM records for your domain
- Use a professional email service (SendGrid, Mailgun) instead of Gmail

## Security Notes

- **Never commit credentials** to git
- Use environment variables or secrets management
- For Cloud Run, use Secret Manager for sensitive values
- Rotate passwords/API keys regularly

## Fallback Behavior

If email configuration is missing or email sending fails:
- The contact form will still work
- Messages are stored in memory (can be retrieved via GET `/api/contact`)
- No error is shown to the user (email failure is logged but doesn't break the form)

