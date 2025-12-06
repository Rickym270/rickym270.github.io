# Security Policy

## Supported Versions

We actively support the latest version of the codebase. Security updates are applied to the `master` branch.

| Version | Supported          |
| ------- | ------------------ |
| master  | :white_check_mark: |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

### How to Report

1. **Email**: Send details to the repository owner (check GitHub profile or open an issue for contact)
2. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment**: We'll acknowledge receipt within 48 hours
- **Assessment**: We'll assess the vulnerability and respond within 7 days
- **Fix Timeline**: Critical vulnerabilities are addressed immediately; others follow our release schedule
- **Disclosure**: We'll coordinate disclosure with you after a fix is available

## Security Best Practices

### For Contributors

- **Never commit secrets**: API keys, passwords, tokens, etc.
- **Use environment variables**: See [GitHub Secrets Guide](docs/GITHUB_SECRETS.md)
- **Review dependencies**: Keep dependencies up to date
- **Follow secure coding practices**: Validate input, sanitize output, use HTTPS

### For Users

- **Keep dependencies updated**: Run `npm audit` regularly
- **Use environment variables**: Never hardcode credentials
- **Review configuration**: Check [API Environment Variables](api/ENV_FILE.md)
- **Monitor logs**: Check for suspicious activity

## Known Security Features

### Frontend

- **CORS**: Configured to allow only trusted origins
- **Input Validation**: Client-side and server-side validation
- **XSS Protection**: Content sanitization and CSP headers (where applicable)

### Backend API

- **Rate Limiting**: Contact form has rate limiting (5 minutes per IP)
- **Honeypot Field**: Bot protection on contact form
- **Cloudflare Turnstile**: CAPTCHA verification (optional, see [Turnstile Setup](docs/TURNSTILE_SETUP.md))
- **API Key Authentication**: Admin endpoints require `X-API-Key` header
- **Input Validation**: All inputs validated and sanitized
- **Error Handling**: Errors don't expose sensitive information

### Infrastructure

- **HTTPS**: All production traffic uses HTTPS
- **Environment Variables**: Secrets stored as environment variables
- **GitHub Secrets**: CI/CD secrets stored securely in GitHub

## Security Checklist

When submitting code:

- [ ] No hardcoded secrets or credentials
- [ ] Input validation implemented
- [ ] Error messages don't expose sensitive info
- [ ] Dependencies are up to date (`npm audit`, `mvn dependency:check`)
- [ ] Security headers configured (where applicable)
- [ ] Tests cover security-related functionality
- [ ] Documentation updated if security-related

## Dependency Security

### Frontend

```bash
# Check for vulnerabilities
npm audit

# Fix automatically (if possible)
npm audit fix
```

### Backend

```bash
# Check for vulnerabilities
cd api && ./mvnw dependency-check:check
```

## Disclosure Policy

- **Private Disclosure**: Vulnerabilities are kept private until fixed
- **Coordinated Disclosure**: We work with reporters to coordinate public disclosure
- **Credit**: We credit security researchers who responsibly disclose vulnerabilities
- **Timeline**: Critical vulnerabilities are fixed immediately; others follow our release schedule

## Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [Spring Boot Security](https://spring.io/projects/spring-security)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

## Contact

For security concerns, please contact the repository owner through GitHub (check profile or open a private security issue).

**Do not use GitHub issues for security vulnerabilities.**

