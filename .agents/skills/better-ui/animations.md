# Animations & Interactions

## Scale on Press
Tactile feedback on button click:
```css
/* CSS */
button:active:not([disabled]) {
  transform: scale(0.96);
  transition: transform 100ms cubic-bezier(0.2, 0, 0, 1);
}
```
```html
<!-- Tailwind -->
<button class="active:scale-[0.96] transition-transform duration-100 ease-out">Click</button>
```

## Suppress Transitions on Theme Switch
Prevents color smearing when toggling dark/light mode:
```ts
export function toggleTheme() {
  const css = document.createElement('style');
  css.appendChild(
    document.createTextNode(
      '*,*::before,*::after{transition:none !important}'
    )
  );
  document.head.appendChild(css);
  
  // Toggle dark class
  document.documentElement.classList.toggle('dark');
  
  // Force reflow
  window.getComputedStyle(css).opacity;
  
  // Restore next frame
  requestAnimationFrame(() => {
    document.head.removeChild(css);
  });
}
```
