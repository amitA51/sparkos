# SparkOS Design System - Archive Documentation
**Archived on: 2026-04-08**
**Purpose: Before redesign cleanup**

---

## 📁 Original File Structure

### CSS Files (src/styles/)
```
src/styles/
├── design-tokens.css  (630 lines) - כל משתני ה-CSS
├── themes.css         (99 lines)  - הגדרות נושאים
├── base.css           (220 lines) - סגנונות בסיס
├── components.css     (486 lines) - רכיבים מוכנים
├── utilities.css      (732 lines) - כלי עזר ואנימציות
└── index.css          (26 lines)  - נקודת כניסה
```

### Config
```
tailwind.config.js     (277 lines)
```

---

## 🎨 Design Tokens (design-tokens.css)

### Color System

#### iOS Primary Colors
```css
--color-ios-blue: #007AFF
--color-ios-green: #34C759
--color-ios-red: #FF3B30
--color-ios-orange: #FF9500
--color-ios-yellow: #FFCC00
--color-ios-teal: #5AC8FA
--color-ios-purple: #AF52DE
--color-ios-indigo: #5856D6
--color-ios-pink: #FF2D55
```

#### Semantic Colors
```css
--color-success: #34C759
--color-warning: #FF9500
--color-error: #FF3B30
--color-info: #007AFF
```

#### Accent System
```css
--color-accent-cyan: #007AFF
--color-accent-violet: #5856D6
--color-accent-magenta: #FF2D55
--color-accent-gold: #FF9500
```

#### Neutrals (Light Mode)
```css
--color-gray-50: rgba(0, 0, 0, 0.02)
--color-gray-100: rgba(0, 0, 0, 0.04)
--color-gray-200: rgba(0, 0, 0, 0.08)
--color-gray-300: rgba(0, 0, 0, 0.12)
--color-gray-400: rgba(0, 0, 0, 0.18)
--color-gray-500: rgba(0, 0, 0, 0.25)
--color-gray-600: rgba(60, 60, 67, 0.6)
--color-gray-700: rgba(60, 60, 67, 0.7)
--color-gray-800: rgba(60, 60, 67, 0.8)
--color-gray-900: rgba(0, 0, 0, 0.9)
```

#### Surface Colors
```css
--color-surface-glass: rgba(255, 255, 255, 0.80)
--color-surface-hover: rgba(0, 0, 0, 0.04)
--color-surface-pressed: rgba(0, 0, 0, 0.06)
--color-border-subtle: rgba(0, 0, 0, 0.06)
--color-border-strong: rgba(0, 0, 0, 0.12)
```

#### Dynamic/Theme Variables
```css
--bg-primary: #F2F2F7
--bg-secondary: #FFFFFF
--bg-tertiary: #E5E5EA
--bg-card: #FFFFFF
--text-primary: #000000
--text-secondary: rgba(60, 60, 67, 0.6)
--text-muted: rgba(60, 60, 67, 0.3)
--text-on-accent: #FFFFFF
--dynamic-accent-start: #007AFF
--dynamic-accent-end: #5856D6
--accent-gradient: linear-gradient(135deg, #007AFF, #5856D6)
```

---

## 🔤 Typography

### Font Families
```css
--font-body: 'Satoshi', system-ui, sans-serif
--font-heading: 'Clash Display', system-ui, sans-serif
--font-mono: 'JetBrains Mono', monospace
```

### Font Sizes (Major Third Scale)
```css
--font-size-xs: 0.64rem    (~10px)
--font-size-sm: 0.8rem     (~13px)
--font-size-base: 1rem     (16px)
--font-size-md: 1.125rem   (18px)
--font-size-lg: 1.25rem    (20px)
--font-size-xl: 1.563rem   (~25px)
--font-size-2xl: 1.953rem  (~31px)
--font-size-3xl: 2.441rem  (~39px)
--font-size-4xl: 3.052rem  (~49px)
--font-size-5xl: 3.815rem  (~61px)
--font-size-6xl: 4.768rem  (~76px)
```

### Font Weights
```css
--font-weight-light: 300
--font-weight-regular: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700
--font-weight-extrabold: 800
```

---

## 📐 Spacing (8px Grid)

```css
--space-1: 0.25rem   (4px)
--space-2: 0.5rem    (8px)
--space-3: 0.75rem   (12px)
--space-4: 1rem       (16px)
--space-5: 1.25rem    (20px)
--space-6: 1.5rem     (24px)
--space-7: 1.75rem    (28px)
--space-8: 2rem       (32px)
--space-9: 2.25rem    (36px)
--space-10: 2.5rem    (40px)
--space-12: 3rem      (48px)
--space-14: 3.5rem    (56px)
--space-16: 4rem      (64px)
```

---

## 🌊 Motion & Animation

### Easing Functions
```css
--ease-spring-stiff: cubic-bezier(0.34, 1.56, 0.64, 1)
--ease-spring-soft: cubic-bezier(0.175, 0.885, 0.32, 1.275)
--ease-spring-gentle: cubic-bezier(0.22, 1, 0.36, 1)
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)
--ease-in-out-smooth: cubic-bezier(0.65, 0, 0.35, 1)
```

### Duration Scale
```css
--duration-instant: 0ms
--duration-fast: 150ms
--duration-base: 250ms
--duration-slow: 400ms
--duration-slower: 600ms
--duration-slowest: 800ms
```

---

## 🎯 Borders & Radius

```css
--radius-sm: 8px
--radius-md: 12px    (Buttons)
--radius-lg: 16px    (Cards)
--radius-xl: 20px    (Modals)
--radius-2xl: 24px
--radius-3xl: 28px
--radius-full: 9999px (Pills)

--radius-button: 20px
--radius-card: 24px
--radius-modal: 28px
--radius-pill: 9999px
```

---

## ☁️ Shadows

```css
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04)
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06)
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.06)
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.06)
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.06)
--shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.12)
--shadow-3xl: 0 35px 60px rgba(0, 0, 0, 0.15)

--shadow-glow-cyan: 0 0 20px rgba(0, 122, 255, 0.25)
--shadow-glow-violet: 0 0 20px rgba(88, 86, 214, 0.25)
```

---

## 🌓 Dark Mode

Dark mode overrides all variables in `[data-theme="dark"]`:

```css
[data-theme="dark"] {
  --bg-primary: #000000
  --bg-secondary: #1C1C1E
  --bg-card: #1C1C1E
  --text-primary: #FFFFFF
  --text-secondary: rgba(235, 235, 245, 0.6)
  --dynamic-accent-start: #0A84FF
  --dynamic-accent-end: #5E5CE6
  /* ... more overrides */
}
```

---

## 🧩 Component Classes (components.css)

### Cards
```css
.spark-card
.spark-card-interactive
.spark-card-accent-cyan
.spark-card-accent-violet
.spark-card-accent-success
.spark-card-accent-gold
```

### Buttons
```css
.btn-aurora
.btn-titanium
.spark-btn
.spark-btn-ghost
.spark-btn-sm
.glass-action-btn
```

### Glass Effects
```css
.glass
.glass-heavy
.glass-subtle
.glass-nebula
.glass-nebula-heavy
.glass-obsidian
```

### Badges
```css
.badge-glow
.badge-glow-cyan
.badge-glow-error
.badge-glow-success
.badge-glow-gold
.spark-badge
.spark-badge-success
```

---

## 🛠 Utility Classes (utilities.css)

### Screen Layout
```css
.screen-shell
.screen-header
.screen-title
.screen-content-safe
```

### Glass Morphism
```css
.glass-morphism
.glass-morphism-heavy
```

### Touch Targets
```css
.touch-target      (44px min)
.touch-target-lg   (48px min)
```

### Safe Areas
```css
.safe-area-top
.safe-area-bottom
.safe-area-left
.safe-area-right
.safe-area-all
```

### Text Utilities
```css
.text-accent-dynamic
.text-accent-highlight
.text-gradient-premium
```

### Animation Utilities
```css
.animate-float
.animate-pulse-slow
.animate-shimmer
.animate-shine
.animate-slide-up-stagger
.animate-bump-up
.animate-premium-fade-in
.animate-premium-scale-in
```

### Stagger Delays
```css
.stagger-1 through .stagger-8
```

---

## 🎬 Keyframe Animations

```css
@keyframes float
@keyframes shimmer
@keyframes shine
@keyframes pulse-glow
@keyframes gradient-flow
@keyframes blink
@keyframes slideUpStagger
@keyframes revealBlur
@keyframes tilt
@keyframes aurora-flow
@keyframes border-shimmer
@keyframes bounce-in
@keyframes shake
@keyframes checkmark-draw
@keyframes premium-fade-in
@keyframes premium-scale-in
```

---

## 📱 Mobile System

```css
--nav-height: 88px
--nav-bottom-offset: 24px
--mobile-gutter: 0.75rem (12px)
--tablet-gutter: 1rem (16px)
--desktop-gutter: 1.5rem (24px)
--touch-target-min: 48px
```

---

## 🔧 Tailwind Config Mapping

Tailwind maps to CSS variables:
- `bg-blue-500` → `var(--color-ios-blue)` → `#007AFF`
- `text-primary` → `var(--text-primary)`
- `font-sans` → `'Satoshi'`
- `rounded-xl` → `var(--radius-xl)` → `20px`
- `shadow-lg` → `var(--shadow-lg)`
- etc.

---

## ⚠️ Problems in Original System

1. **Duplicate Variables** - Some variables defined in multiple places
2. **Too Many Color Variants** - 50+ gray shades with confusing names
3. **Complex Glass System** - 6 different glass variants
4. **Inline Styles** - Components use inline CSS instead of classes
5. **Confusing Naming** - "cosmos", "obsidian", "nebula" mixed metaphors
6. **Heavy Animations** - Many keyframes, some unused
7. **Theme Complexity** - Multiple theme systems layered

---

## 📋 How to Recreate

If you need to restore the original design:

1. Copy all files from `design-archive/original-2026-04-08/styles/` back to `src/styles/`
2. Copy `design-archive/original-2026-04-08/config/tailwind.config.js` to root
3. Ensure fonts are loaded:
   - Satoshi from `/fonts/satoshi/`
   - Clash Display from `/fonts/clash-display/`
   - JetBrains Mono from CDN or local

4. Add `data-theme="light"` or `data-theme="dark"` to body/html

---

**End of Documentation**
