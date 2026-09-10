# Performance & Compositing

## GPU Accelerated Properties Only
- Always animate: `transform` (scale, translate, rotate), `opacity`, `filter`.
- Never animate layout triggers: `width`, `height`, `top`, `bottom`, `left`, `right`, `margin`, `padding`.

## `will-change` Rules
- Never use `will-change: all`.
- Use `will-change: transform` sparingly on elements that show frame stutter.
- Remove `will-change` when animation completes to free GPU memory.
