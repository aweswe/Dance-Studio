# Pro Rules & Pre-Delivery Checklist

## Pre-Delivery Checklist

### Visual & Typography
- [ ] No raw hex codes hardcoded inside components; all colors use CSS variables/Tailwind tokens.
- [ ] Headlines use fluid clamp scaling and tight line-heights (1.05–1.15).
- [ ] Body copy lines stay under 75 characters.
- [ ] Concentric radii: outer radius = inner radius + padding.

### Interaction & Feedback
- [ ] Buttons have `active:scale-[0.96]` tactile press feedback.
- [ ] All inputs have clear focus rings (`ring-2 ring-brand ring-offset-2`).
- [ ] Form submit buttons disable and show spinner while request is inflight.
- [ ] Icon stroke weights match adjacent text weights (1.5px regular, 2px semibold).

### Performance & Motion
- [ ] Zero layout-triggering properties animated (`width`, `height`, `top`, `margin`).
- [ ] `prefers-reduced-motion` suppresses or reduces non-essential animations.
- [ ] Theme toggling suppresses transitions temporarily to prevent smearing.
- [ ] Images have explicit width/height to eliminate Cumulative Layout Shift (CLS).

### Accessibility & Semantics
- [ ] Headings follow strict h1 -> h2 -> h3 hierarchy with no skipped levels.
- [ ] Contrast ratio meets minimum 4.5:1 for body and 3:1 for large display headers.
- [ ] Mobile navigation closes on route navigation or outside click with Escape key support.
