# Design System

## Colors

### Core Palette (Light Mode)
```css
--background: #f5f2ed;     /* Cream */
--foreground: #1a1a1a;     /* Charcoal */
--card: #ffffff;
--primary: #1a1a1a;
--secondary: #e8e2da;
--muted: #d4cdc4;          /* Sand */
--destructive: #8b0000;
--border: #d4cdc4;
```

### Brand Colors
```css
--sand: #d4cdc4;
--warm-gray: #8a8a8a;
--charcoal: #1a1a1a;
--cream: #f5f2ed;
--black: #000000;
```

### Material Surfaces
```css
--surface-travertine: #E8E4DF;  /* Earthy, grounded */
--surface-oak: #C9B99A;         /* Warm, natural */
--surface-plaster: #F5F3F0;     /* Hand-finished */
--surface-linen: #EDE9E3;       /* Textural, calm */
--surface-glass: rgba(255, 255, 255, 0.08);
--surface-upholstery: #D8D2C9;  /* Tactile, inviting */
--accent-brass: #C4A962;        /* Refined accent */
```

---

## Typography

### Fonts
- **Display:** Saol Display (served via `/api/fonts/`)
- **Sans:** Inter (system fallback: system-ui)
- **Mono:** Geist Mono

### Tracking Presets
```css
--tracking-display: -0.02em;  /* Hero headlines */
--tracking-title: -0.01em;    /* Section titles */
--tracking-label: 0.15em;     /* Navigation, labels */
--tracking-wide: 0.2em;       /* Eyebrows */
--tracking-ultra: 0.3em;      /* Decorative */
```

### Heading Rules
- h1: Saol Display, weight 400, tracking-display
- h2, h3: Saol Display, weight 400, tracking-title
- h4, h5, h6: Saol Display, weight 400, tracking-label, uppercase

---

## Spacing

- Radius: 0rem (sharp corners)
- Standard spacing: Tailwind scale (4, 6, 8, 12, 16, 24)

---

## Animation Utilities

### Easing
```css
.ease-cinematic { cubic-bezier(0.22, 1, 0.36, 1) }
.ease-expo-out { cubic-bezier(0.16, 1, 0.3, 1) }
.ease-spring { cubic-bezier(0.5, 1.5, 0.8, 1) }
```

### Animations
- `.animate-fade-in-blur` - Fade in with blur
- `.animate-scale-up` - Scale reveal
- `.animate-slide-left/right` - Slide entrances
- `.animate-wipe-reveal` - Clip-path wipe
- `.animate-line-draw` - Line draw effect
- `.animate-float` - Subtle ambient motion
- `.animate-scroll` - Infinite scroll
- `.animate-marquee` - Press logo marquee

### Stagger Delays
`.stagger-1` through `.stagger-8` (0.05s increments)

### Hover Effects
- `.hover-lift` - Translate Y with shadow
- `.hover-zoom` - Scale 1.05
- `.press-effect` - Scale 0.98 on active

---

## Component Patterns

### Inquiry Button
```css
.btn-inquiry {
  bg-charcoal text-cream
  Clip-path brass wipe on hover
  Min height 44px touch target
}
```

### Editorial Link
```css
.editorial-link {
  Scale-x underline on hover
  Origin left
}
```

### Gallery Card
```css
.gallery-card {
  Transform 0.5s cinematic
  Opacity 0.3s ease
}
```

### Project Card
```css
.project-card {
  Shadow on hover
  TranslateY -2px
}
```

---

## Image Conventions

- Product images: 4:5 aspect ratio (400x500)
- Gallery images: Various, responsive
- Hero images: Full viewport
- Loading: Shimmer gradient animation
- Placeholder: bg-muted

---

## Accessibility

- prefers-reduced-motion respected
- prefers-contrast: high supported
- Focus: 1px charcoal + 3px cream outline
- Touch targets: min 44px
- Safe area padding for notched devices
