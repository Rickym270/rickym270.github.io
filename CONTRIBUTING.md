# Contributing to rickym270.github.io

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/Rickym270/rickym270.github.io/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (browser, OS, etc.)
   - Screenshots if applicable

### Suggesting Features

1. Check if the feature has already been suggested
2. Create a new issue with:
   - Clear description of the feature
   - Use case and benefits
   - Any design mockups or examples

### Pull Requests

1. **Fork the repository** and create a branch from `master`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the coding standards below

3. **Write or update tests** as needed
   - UI changes should include Playwright tests
   - API changes should include API tests
   - See [Testing Documentation](docs/README.md) for details

4. **Run tests locally** before submitting
   ```bash
   # Run all tests
   npm test
   
   # Run API tests
   cd api && ./mvnw test
   ```

5. **Update documentation** if needed
   - Update README.md if adding new features
   - Update relevant docs in `docs/` directory
   - See [Documentation Index](docs/README.md)

6. **Commit your changes** with clear, descriptive messages
   ```bash
   git commit -m "Add feature: description of what you added"
   ```

7. **Push to your fork** and create a Pull Request
   - Fill out the PR template completely
   - Link to any related issues
   - Describe what changed and why

8. **Ensure CI tests pass** - All tests must pass before merge

## Coding Standards

### Frontend (HTML/CSS/JavaScript)

- **HTML**: Use semantic HTML5 elements
- **CSS**: Follow existing patterns in `html/css/modern.css`
  - Use CSS variables for colors/themes
  - Mobile-first responsive design
  - Follow BEM naming conventions where applicable
- **JavaScript**: 
  - Use modern ES6+ features
  - Follow existing module patterns
  - Add JSDoc comments for functions
  - Keep functions small and focused

### Backend (Java/Spring Boot)

- Follow Java naming conventions
- Use Spring Boot best practices
- Add JavaDoc comments for public methods
- Keep controllers thin, business logic in services
- Handle errors gracefully with proper HTTP status codes

### Testing

- Write tests for new features
- Follow existing test patterns
- Use descriptive test names
- Keep tests independent and isolated
- See [UI Testing Guide](docs/UI_TESTING.md) and [API Testing Guide](docs/TESTING.md)

## Development Setup

### Prerequisites

- Node.js 18.x (see [Node.js Setup](docs/NODE_SETUP.md))
- Java 17+ (for API development)
- Git

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rickym270/rickym270.github.io.git
   cd rickym270.github.io
   ```

2. **Install dependencies**
   ```bash
   npm install
   npx playwright install --with-deps
   ```

3. **Run tests** to verify setup
   ```bash
   npm test
   ```

4. **Start local development**
   ```bash
   # Frontend (port 4321)
   npm run serve
   
   # API (port 8080)
   cd api && ./mvnw spring-boot:run
   ```

See [README.md](README.md) for more details.

## Commit Message Guidelines

Use clear, descriptive commit messages:

- **Format**: `type: description`
- **Types**: `feat`, `fix`, `docs`, `test`, `refactor`, `style`, `chore`
- **Examples**:
  - `feat: add dark mode toggle to mobile menu`
  - `fix: resolve contact form submission timeout`
  - `docs: update API testing guide`
  - `test: add accessibility tests for home page`

## Pull Request Process

1. **Ensure all tests pass** locally
2. **Update documentation** if needed
3. **Follow the PR template** completely
4. **Request review** from maintainers
5. **Address feedback** promptly
6. **Squash commits** if requested before merge

## CI/CD

- All PRs automatically run tests via GitHub Actions
- Tests must pass before merge
- See [GitHub Workflows](.github/workflows/) for details

## Questions?

- Check [Documentation Index](docs/README.md)
- Review [README.md](README.md)
- Open an issue for questions

Thank you for contributing! 🎉

