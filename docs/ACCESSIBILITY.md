# Accessibility

This document describes the accessibility features and practices used on the site.

## Features

- **Skip link**: A "Skip to main content" link is the first focusable element on the page. It is visually hidden until focused (keyboard or other focus), then appears so users can jump past the navigation to the main content.
- **Main landmark**: The primary content container has `role="main"` (via the `<main id="content">` element) and `tabindex="-1"` so it can receive focus when the skip link is activated or after SPA navigation.
- **Focus visibility**: Interactive controls (forms, buttons, links) have visible focus indicators. Where `outline` is removed for design, `:focus-visible` is used to show a clear focus ring for keyboard users.
- **SPA focus management**: When navigating between pages via the SPA, focus is moved to the main content area so screen reader and keyboard users are not left in the navigation.
- **Footer**: A desktop-first footer (`role="contentinfo"`) provides identity, quick links, and utility controls (theme, language, reduced motion, reset preferences) and a Back to top link. The footer may be hidden or simplified on small screens.
- **Mobile sidebar**: On small screens, the hamburger menu includes a PREFERENCES section with Language (EN/ES) and Dark Mode (toggle). Footer icons (contact, reset preferences) appear below. Reduced motion is available in the desktop footer and is still applied from stored or system preference on load. Controls are keyboard-accessible and stay in sync with the desktop footer. Coverage: `tests/mobile-sidebar.spec.ts`.

## Testing

Accessibility is covered by automated tests in **`tests/accessibility.spec.ts`** (landmarks, focus, skip link, etc.), **`tests/footer.spec.ts`** (footer visibility, identity, theme/language/reduced-motion/reset controls, quick links, Back to top), and **`tests/mobile-sidebar.spec.ts`** (mobile sidebar: PREFERENCES with Language and Dark Mode, footer icons). The accessibility suite includes:

- Heading hierarchy
- Images with alt text
- Links and buttons with accessible names
- Form inputs with labels
- Skip link presence and visibility when present
- Color contrast (basic check)
- Keyboard navigation and focus visibility
- ARIA landmarks (main, navigation)

Run the accessibility test suite:

```bash
npx playwright test tests/accessibility.spec.ts
```

## Contributing

When adding or changing UI, preserve or add focus styles, use semantic HTML and ARIA where appropriate, and ensure new content works with the skip link and main landmark.
