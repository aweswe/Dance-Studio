# Icon Transitions & Optics

## Contextual Icon Transitions
Transitioning between icons (e.g. play/pause, check/copy, theme sun/moon):
- Animate with: `opacity`, `scale`, and `blur`.
- Specific values:
  - Scale: `0.25` -> `1`
  - Opacity: `0` -> `1`
  - Blur: `4px` -> `0px`

## Icon Optics & Weight
- Regular text (400) -> `1.5px` icon stroke.
- Semibold / Bold text (600/700) -> `2px` icon stroke.
- Use `currentColor` so icons inherit text color and hover states automatically.
- Adjust play buttons or asymmetric icons optically with 1px manual margin/padding nudge.
