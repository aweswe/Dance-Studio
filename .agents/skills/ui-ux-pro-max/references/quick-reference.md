# UI/UX Quick Reference Guide

## 1. Accessibility (CRITICAL)
- Color contrast minimum 4.5:1 for normal text (WCAG AA), 3:1 for large text (>18pt or >14pt bold).
- Never use color alone to convey meaning (add icons or text indicators).
- All interactive elements must have visible `:focus-visible` indicators (2px outline minimum).
- All buttons without text must have `aria-label`.
- All decorative images must have `alt=""` and `aria-hidden="true"`.

## 2. Touch & Interaction (CRITICAL)
- Touch targets must be at least 44×44px (WCAG 2.5.5) or 48×48px (Material).
- Minimum 8px spacing between clickable elements to avoid fat-finger errors.
- Any action taking >200ms must show immediate visual feedback (loading spinner, disabled state, skeleton).

## 3. Performance (HIGH)
- Target Cumulative Layout Shift (CLS) < 0.1: always reserve space for images and dynamic blocks.
- Use modern formats (WebP, AVIF) with appropriate `sizes` attribute.
- Lazy-load offscreen media with `loading="lazy"`.

## 4. Style Selection (HIGH)
- Match style to product archetype: Entertainment / Dance -> Kinetic, high contrast, vibrant accents, dark mode default.
- Never use emojis as functional UI icons; use SVGs (Lucide, Radix, Heroicons).
- Maintain consistent border-radius tokens across surface levels.

## 5. Layout & Responsive (HIGH)
- Mobile-first breakpoints: 320px, 640px (sm), 768px (md), 1024px (lg), 1280px (xl).
- Zero horizontal overflow (`overflow-x: hidden` on viewport roots).
- Fluid typography using `clamp(min, preferred, max)`.

## 6. Typography & Color (MEDIUM)
- Base body text: minimum 16px, line-height 1.5–1.6.
- Heading line-height: 1.05–1.25.
- Line length limit: 45–75 characters (~60–80ch) for prose readability.
- Semantic tokens: `--color-canvas`, `--color-surface`, `--color-ink`, `--color-line`, `--color-brand`.

## 7. Animation (MEDIUM)
- Micro-interactions: 150–200ms ease-out.
- Dialog / modal transitions: 200–300ms.
- Respect `prefers-reduced-motion: reduce`.
- Only animate `transform` and `opacity`.

## 8. Forms & Feedback (MEDIUM)
- Labels must always be visible; never rely solely on placeholders.
- Errors must appear adjacent to the erroneous input with `aria-describedby`.
- Auto-focus the first error on failed submission.

## 9. Navigation Patterns (HIGH)
- Maximum 5 primary destinations in bottom navigation or mobile drawer.
- Preserve scroll position on navigation where expected.
- Deep links must always restore state.
