# SparkOS - New Clean Design System
**Created: 2026-04-08**

---

## 📁 Archive Location

All original files are preserved in: `design-archive/original-2026-04-08/`

### Files Archived

**CSS Files (src/styles/):**
- `design-tokens.css` - Original 630-line design tokens
- `themes.css` - Theme overrides (99 lines)
- `base.css` - Base styles (220 lines)
- `components.css` - Component classes (486 lines)
- `utilities.css` - Utilities and animations (732 lines)
- `index.css` - Entry point (26 lines)

**Standalone CSS:**
- `styles/roadmap-premium.css` - Roadmap premium styles (646 lines)
- `components/workout/workout-premium.css` - Workout module styles (965 lines)

**Config:**
- `tailwind.config.js` - Original Tailwind config (277 lines)

**Constants (TypeScript):**
- `constants/designTokens.ts` - Design tokens in TypeScript
- `constants/appConstants.ts` - App constants
- `constants/zIndex.ts` - Z-index hierarchy

---

## 📁 New File Structure

```
src/styles/
├── design-tokens.css   ← CSS Variables (colors, spacing, etc.)
├── base.css           ← Reset and base styles
├── components.css     ← Reusable component classes
└── index.css         ← Entry point (imports all)
```

---

## 🎨 How to Use

### 1. Import the Design System
```tsx
// In your main CSS file (index.css)
@import './styles/index.css';
```

### 2. Set Theme
```tsx
// Light mode (default)
document.documentElement.setAttribute('data-theme', 'light');

// Dark mode
document.documentElement.setAttribute('data-theme', 'dark');
```

---

## 🎯 Design Tokens (CSS Variables)

### Colors

#### Primary/Accent
```css
--accent         /* #007AFF - Main accent color */
--accent-hover  /* Hover state */
--accent-rgb    /* RGB values for rgba() */
```

#### Semantic
```css
--success   /* #34C759 - Success/positive */
--warning    /* #FF9500 - Warning */
--error      /* #FF3B30 - Error/danger */
--info       /* #007AFF - Information */
```

#### Gray Scale
```css
--gray-50   /* Lightest */
--gray-100
--gray-200
--gray-300
--gray-400
--gray-500
--gray-600
--gray-700
--gray-800
--gray-900   /* Darkest */
```

#### Background
```css
--bg-primary    /* Main background */
--bg-secondary  /* Cards, elevated surfaces */
--bg-tertiary   /* Tertiary surfaces */
--bg-card       /* Card backgrounds */
```

#### Text
```css
--text-primary    /* Main text */
--text-secondary  /* Secondary text */
--text-muted      /* Muted/disabled text */
--text-inverse    /* Text on dark backgrounds */
```

#### Borders
```css
--border-subtle   /* Subtle borders */
--border-default  /* Default borders */
--border-strong   /* Emphasized borders */
```

---

## 🧩 Component Classes

### Buttons

```html
<!-- Primary Button -->
<button class="btn btn-primary">Primary</button>

<!-- Secondary Button -->
<button class="btn btn-secondary">Secondary</button>

<!-- Ghost Button -->
<button class="btn btn-ghost">Ghost</button>

<!-- Danger Button -->
<button class="btn btn-danger">Delete</button>

<!-- Small Button -->
<button class="btn btn-sm btn-primary">Small</button>

<!-- Full Width -->
<button class="btn btn-full btn-primary">Full Width</button>

<!-- Icon Button -->
<button class="btn-icon">
  <Icon />
</button>
```

### Cards

```html
<!-- Basic Card -->
<div class="card">
  Card content
</div>

<!-- Interactive Card -->
<div class="card card-interactive">
  Clickable card
</div>

<!-- Elevated Card -->
<div class="card card-elevated">
  With stronger shadow
</div>

<!-- Bordered Card -->
<div class="card card-bordered">
  With border
</div>
```

### Inputs

```html
<!-- Input with Label -->
<label class="label">Email</label>
<input class="input" type="email" placeholder="Enter email" />

<!-- Error State -->
<input class="input input-error" type="text" />
```

### Badges

```html
<span class="badge">Default</span>
<span class="badge badge-primary">Primary</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-error">Error</span>
```

### Navigation

```html
<!-- Header -->
<header class="nav-header">
  <h1 class="nav-title">Title</h1>
</header>

<!-- Bottom Navigation -->
<nav class="nav-bottom">
  <a class="nav-item active">
    <Icon />
    <span>Home</span>
  </a>
  <a class="nav-item">
    <Icon />
    <span>Settings</span>
  </a>
</nav>
```

### Layout

```html
<!-- Container -->
<div class="container">
  Content with max-width
</div>

<!-- Section -->
<section class="section">
  Section content
</section>

<!-- Screen -->
<div class="screen">
  <header class="screen-header">...</header>
  <main class="screen-content">...</main>
</div>
```

### Loading/Skeleton

```html
<div class="skeleton" style="width: 100%; height: 20px;"></div>
```

---

## 📐 Spacing Scale

```css
--space-1   /* 4px */
--space-2   /* 8px */
--space-3   /* 12px */
--space-4   /* 16px */
--space-5   /* 20px */
--space-6   /* 24px */
--space-8   /* 32px */
--space-10  /* 40px */
--space-12  /* 48px */
--space-16  /* 64px */
--space-20  /* 80px */

/* Semantic */
--gap-xs   /* var(--space-1) */
--gap-sm   /* var(--space-2) */
--gap-md   /* var(--space-4) */
--gap-lg   /* var(--space-6) */
--gap-xl   /* var(--space-8) */
```

---

## 🔤 Typography

### Font Sizes
```css
--text-xs    /* 12px */
--text-sm    /* 14px */
--text-base  /* 16px (default) */
--text-lg    /* 18px */
--text-xl    /* 20px */
--text-2xl   /* 24px */
--text-3xl   /* 30px */
--text-4xl   /* 36px */
```

### Font Weights
```css
--weight-normal    /* 400 */
--weight-medium    /* 500 */
--weight-semibold  /* 600 */
--weight-bold      /* 700 */
```

---

## 🎨 Border Radius

```css
--radius-sm    /* 6px  */
--radius-md    /* 10px */
--radius-lg    /* 14px - Default buttons */
--radius-xl    /* 18px - Default cards */
--radius-2xl   /* 24px */
--radius-full  /* 9999px - Pills */
```

---

## 🌊 Motion

### Easing
```css
--ease-out     /* Smooth out */
--ease-in-out  /* Smooth in and out */
--ease-spring  /* Bouncy spring effect */
```

### Duration
```css
--duration-fast  /* 150ms - Hover effects */
--duration-base  /* 250ms - Default transitions */
--duration-slow  /* 400ms - Modals, animations */
```

---

## ⚠️ Special Modules - DO NOT TOUCH

These modules have their own independent design systems:

### 1. Workout Module (`components/workout/`)
- **CSS File:** `components/workout/workout-premium.css` (965 lines)
- **Theme Config:** `components/workout/themes.ts`
- **Colors:** Uses `--cosmos-*` variables (cosmos theme)
- **Note:** Has its own button, card, and glassmorphism system
- **DO NOT TOUCH** - Leave as-is

---

## 🔄 Theme System (Cleaned!)

The app uses a simplified theme hook:

### hooks/useThemeEffect.ts
```tsx
import { useThemeEffect, isDarkTheme } from '../../hooks/useThemeEffect';

// Usage:
const themeMode = isDarkTheme(themeSettings?.name) ? 'dark' : 'light';
useThemeEffect({ mode: themeMode });
```

### What it does:
- Sets `data-theme="light"` or `data-theme="dark"` on `<html>`
- Updates meta theme-color
- **Simple** - no complex density/font/animation classes

---

## 📁 Roadmap Module (Cleaned!)

### styles/roadmap.css
- **New clean file** using CSS variables from design-tokens.css
- **Backward compatible** - includes legacy class aliases
- Uses same spacing, colors, and shadows as main design system

### Components:
- Cards: `.roadmap-card`, `.roadmap-card-active`, `.roadmap-card-completed`
- Tasks: `.roadmap-task`, `.roadmap-task-completed`
- Tabs: `.roadmap-tab`, `.roadmap-tab-active`
- Progress: `.roadmap-progress`, `.roadmap-progress-fill`
- Timeline: `.roadmap-timeline`, `.roadmap-timeline-node`
- View switcher: `.roadmap-view-switcher`, `.roadmap-view-btn`, `.roadmap-view-btn-active`

---

## ⚠️ Rules

### DO ✅
- Use predefined component classes
- Use Tailwind utility classes for one-off styles
- Create new component classes if reused 3+ times
- Add new tokens to `design-tokens.css`

### DON'T ❌
- Use inline styles (`style={{}}`)
- Use hardcoded colors
- Create one-off CSS classes
- Duplicate existing tokens
- Touch workout or roadmap CSS files (they're separate systems)

---

## 🔧 Adding New Components

1. Add tokens to `design-tokens.css` if needed
2. Add component class to `components.css`
3. Document the component in this file

---

## 📱 Mobile Considerations

- Touch targets: minimum 44px (`--touch-target`)
- Safe areas: `env(safe-area-inset-*)`
- Nav height: `--nav-height` (80px)
- Content max width: `--content-max-width` (640px)

---

## 🌙 Dark Mode

Dark mode automatically inverts colors via CSS variables in `[data-theme="dark"]`.

Toggle with:
```tsx
document.documentElement.setAttribute('data-theme', 'dark');
// or
document.documentElement.setAttribute('data-theme', 'light');
```

---

**End of Documentation**
