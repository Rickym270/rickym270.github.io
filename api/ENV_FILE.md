# .env File Support

The Spring Boot API now supports loading environment variables from a `.env` file.

## Location

Place your `.env` file in the `apps/api/` directory (same directory as `pom.xml`).

## File Format

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
CONTACT_EMAIL=your-email@gmail.com
SMTP_FROM_EMAIL=your-email@gmail.com
GH_TOKEN=your-github-token
ADMIN_API_KEY=your-admin-key
TURNSTILE_SECRET_KEY=your-turnstile-secret
OPENAI_API_KEY=your-openai-api-key
PROJECTS_GITHUB_TTL_MINUTES=720
PROJECTS_COMMIT_STATUS_TTL_MINUTES=60
```

**OPENAI_API_KEY** (optional): When set, blog search (`GET /api/search`) uses OpenAI embeddings for semantic ranking. The QA Loop Prep study helper (`POST /api/qa-prep/study-chat`) and attempt-first answer coach (`POST /api/qa-prep/attempt-coach`) use this key for chat completions and structured evaluation. When unset, search uses keyword-based ranking and those endpoints return `503` (suitable for CI and local development without a key).

## How It Works

1. **DotEnvConfig** loads the `.env` file on application startup
2. Variables are loaded into system properties
3. Environment variables take precedence over `.env` file values
4. Services (EmailService, TurnstileService, etc.) check both environment variables and system properties

## Priority Order

1. **Environment variables** (highest priority)
2. **System properties** (loaded from `.env` file)
3. **Default values** (if configured)

## Verification

When you start the API server, you should see:

```
[DotEnvConfig] ✓ Loaded X variables from .env file: /path/to/api/.env
[MailConfig] SMTP configured: smtp.gmail.com:587 (username: your-email@gmail.com)
```

If you see warnings instead:
- Check that `.env` file exists in `apps/api/` directory
- Verify file format (no spaces around `=`, one variable per line)
- Check that values don't contain `your-` placeholder text (those are skipped)

## Testing

1. **Start the API**:
   ```bash
   cd apps/api
   ./mvnw spring-boot:run
   ```

2. **Check startup logs** for `[DotEnvConfig]` and `[MailConfig]` messages

3. **Submit a contact form** - if email is configured, you should receive an email

4. **Check API logs** for `[EmailService] Contact email sent successfully`

## Troubleshooting

### ".env file not found"
- Ensure `.env` is in the `apps/api/` directory
- Check file permissions: `ls -la apps/api/.env`
- Verify you're running from the correct directory

### "No SMTP_HOST configured"
- Check that `SMTP_HOST` is set in `.env` file
- Verify the value doesn't contain `your-` (placeholder values are skipped)
- Check startup logs to see how many variables were loaded

### Email not sending
- Verify `SMTP_PASSWORD` is a valid App Password (for Gmail)
- Check `CONTACT_EMAIL` is set correctly
- Review API logs for email errors

