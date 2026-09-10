# Motion Implementation Plan: [Plan Title]

## Context
- **Target Surface**: [File / Component / Route]
- **Current Commit**: [git commit hash]
- **Severity**: [HIGH / MEDIUM / LOW]
- **Category**: [Easing & duration / Performance / etc.]

## Finding
- **Current Behavior**: [Description of the motion defect]
- **Code Reference**: `path/to/file.tsx:line`
```tsx
// Current code snippet
```

## Proposed Correction
- **Target Property**: [e.g. transition-timing-function, duration]
- **Target Values**: [e.g. cubic-bezier(0.16, 1, 0.3, 1), 200ms]
- **Exact Replacement**:
```tsx
// Corrected code snippet
```

## Step-by-Step Execution
1. [Step 1]
2. [Step 2]

## Feel-Check & Verification
- Test in browser with 0.2x animation speed / DevTools animations tab.
- Verify reduced motion compliance with `prefers-reduced-motion: reduce`.
