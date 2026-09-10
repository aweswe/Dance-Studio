# Motion & Animation Audit Rules

## 1. Purpose & Frequency
- Never animate high-frequency repeated interactions (>50 times/day like command palettes, text typing, rapid keystrokes).
- Instant UI for direct manipulation; animate only state transitions and asynchronous loading resolution.
- Avoid animating `scale(0)` or large layout shifts that displace surrounding content.

## 2. Easing & Duration
- Standard UI transitions: 150ms–250ms with `cubic-bezier(0.16, 1, 0.3, 1)` or snappy ease-out.
- Never use `ease-in` for entering elements (it feels sluggish/delayed).
- Exits should be faster than entrances (e.g. entrance 200ms, exit 150ms).

## 3. Physicality & Origin
- `transform-origin` must match the trigger location (e.g. dropdown originates from the trigger button, not random center).
- Respect momentum and physical direction.

## 4. Interruptibility
- Dynamic animations must be cancellable / interruptible without jumping or locking user input.
- CSS transitions on `max-height` or layout properties cause hitching; prefer transform/opacity.

## 5. Performance
- Animate only GPU-composited properties: `transform`, `opacity`, `filter`.
- Never animate `width`, `height`, `top`, `left`, `margin`, `padding` during frequent interactions.
- Avoid forced synchronous layouts (layout thrashing).

## 6. Accessibility
- Always wrap non-essential motion in `@media (prefers-reduced-motion: reduce)`.
- Provide instantaneous or crossfade-only alternatives for reduced motion users.

## 7. Cohesion & Tokens
- Use centralized motion tokens: `--duration-*`, `--ease-*`.
- Do not define ad-hoc one-off cubic bezier curves across disparate components.

## 8. Missed Opportunities
- Meaningful state changes (e.g. tab switches, cart additions, modal dialog entrances) that feel jarring when instantaneous.
