---
name: InvertMantraOrbStyle
overview: Update `index.html` to keep a fixed gentle rainbow page background (conic/angular rays) while moving each mantra's gradient into the orb, plus add a central white‑rainbow glow and shrink the moon disc by 50% without changing the word circle diameter.
todos:
  - id: update-page-bg
    content: Add fixed conic rainbow gradient to body, update applyBackgroundGradient()
    status: completed
  - id: orb-gradient
    content: Build canvas-based orb texture with white-rainbow center + mantra colors
    status: completed
  - id: moon-disc
    content: Halve moon disc radius (1.5→0.75), adjust outline ring to match
    status: completed
---

# Invert Mantra Orb + Background

## Goals

- Keep a fixed, gentle rainbow background on the page (independent of mantra).
- **Conic gradient** (angular rays from center, NOT concentric rings) matching reference image.
- Move each mantra's `backgroundGradient` into the orb, layered with a central white‑rainbow glow.
- Orb edge fades to transparent for soft blend with background.
- Shrink the moon disc by 50% while preserving the mantra ring diameter.
- Keep existing fresnel glow layers on outer spheres.

## Approach

### 1. Fixed Conic Rainbow Background

Use CSS `conic-gradient` for angular rays radiating from viewport center:

```css
conic-gradient(from 90deg at 50% 50%,
  #e8e0f8 0deg,      /* Soft lavender */
  #e0e8f8 45deg,     /* Pale blue */
  #e0f0e8 90deg,     /* Soft mint */
  #f0ece0 135deg,    /* Cream */
  #f8e8e5 180deg,    /* Soft pink */
  #f0e0f8 225deg,    /* Lavender-pink */
  #e0e0f8 270deg,    /* Periwinkle */
  #e8f0f8 315deg,    /* Ice blue */
  #e8e0f8 360deg     /* Back to start */
)
```

Update `applyBackgroundGradient()` to always use this fixed gradient.

### 2. Orb Gradient Texture

Canvas-based texture generator:

- **Center (0-20%)**: Pure white (#ffffff)
- **Inner ring (20-40%)**: Soft pastel rainbow blend
- **Outer ring (40-90%)**: Mantra's backgroundGradient colors (inverted positions)
- **Edge (90-100%)**: Fade to transparent for soft blend

Cache textures by mantra ID. Apply to orb mesh material.

### 3. Moon Disc Resize

- Disc radius: 1.5 → 0.75
- Outline ring: 1.485-1.515 → 0.735-0.765
- Syllable ring stays at radius 1.7

### 4. Keep Fresnel Glow

Existing atmosphere shader spheres remain unchanged.

## Files

- [index.html](/Users/dorianiten/Library/CloudStorage/Dropbox/DEV-local/2025-11 mantra/index.html)

## Config Block (for maintainability)

```javascript
const ORB_STYLE = {
  textureSize: 1024,
  whiteCenter: { end: 0.20 },
  rainbowRing: { start: 0.20, end: 0.40 },
  mantraRing: { start: 0.40, end: 0.90 },
  fadeEdge: { start: 0.90, end: 1.0 },
  rainbowColors: ['#fff8f8', '#f8f0ff', '#f0f8ff', '#f8fff8', '#fffcf0']
};

const PAGE_RAINBOW = {
  type: 'conic',
  colors: [
    { color: '#e8e0f8', angle: 0 },
    { color: '#e0e8f8', angle: 45 },
    // ...
  ]
};
```