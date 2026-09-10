# Surfaces, Radii & Shadows

## Concentric Border Radius
```
outer_radius = inner_radius + padding
```
- Example: Card with `p-4` (16px) and inner button with `rounded-lg` (8px) -> Card outer radius must be `16px + 8px = 24px` (`rounded-3xl` or `24px`).
- Failure to match concentric radii produces awkward pinched or bloated corners.

## Shadows for Elevation vs Borders for Structure
- **Borders**: Structure, dividers, state changes (focus-visible ring, selected state).
- **Shadows**: Elevation, hover lift, floating dialogs, dropdown menus.
```css
/* Layered depth shadow */
box-shadow: 
  0 1px 2px 0 rgb(0 0 0 / 0.05),
  0 4px 12px -2px rgb(0 0 0 / 0.08);
```

## Image Outlines
- Pure black at low opacity in light mode: `outline: 1px solid oklch(0 0 0 / 0.1)`
- Pure white at low opacity in dark mode: `outline: 1px solid oklch(1 0 0 / 0.1)`
- Never use tinted grays, slate, or zinc on image outlines.
