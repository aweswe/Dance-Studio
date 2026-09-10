# Enter & Exit Transitions

## Split and Stagger Entrances
- Stagger children by ~100ms for semantic cards, lists, or hero elements.
- Never stagger high-frequency actions (dropdown menus, autocompletes).

## Subtle Exits
- Small fixed translateY (e.g. -4px or +4px) rather than collapsing full container height.
- Exits should be faster and softer than enters.
- Both use snappy ease-out: `cubic-bezier(0.16, 1, 0.3, 1)` or `ease-out`.
