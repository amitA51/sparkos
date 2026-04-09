# SparkOS Design System Guide

## Overview

SparkOS uses a unified design token system for consistent styling across the application. This guide documents all design decisions, tokens, and best practices.

---

## Design Tokens

### Color System

#### Primary Accent Colors
| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--accent` | `#007AFF` | `#0A84FF` | Primary interactive elements |
| `--accent-hover` | `#0066D6` | `#409CFF` | Hover state |
| `--accent-rgb` | `0, 122, 255` | - | RGB for opacity effects |

#### Semantic Colors
| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--success` | `#34C759` | `#30D158` | Success states |
| `--warning` | `#FF9500` | `#FF9F0A` | Warning states |
| `--error` | `#FF3B30` | `#FF453A` | Error states |
| `--info` | `#007AFF` | `#0A84FF` | Information |
| `--danger` | `#FF3B30` | `#FF453A` | Danger/delete actions |
| `--link` | `#3B82F6` | `#60A5FA` | Links |

#### Spark Accent System
| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--spark-accent` | `#a3e635` | `#b5f04a` | Lime green accent |
| `--spark-accent-secondary` | `#BF5AF2` | `#c77bf8` | Purple accent |
| `--spark-gold` | `#FFB800` | `#FFCC00` | Gold/achievement |
| `--spark-cyan` | `#00F0FF` | `#30DFFF` | Cyan accent |
| `--spark-violet` | `#7B61FF` | `#9B87FF` | Violet accent |
| `--spark-magenta` | `#FF006E` | `#FF4DA6` | Magenta accent |
| `--spark-rose` | `#F43F5E` | `#FF6B8A` | Rose accent |

#### Fitness Data Colors
| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--spark-fitness-hot` | `#FF3B30` | `#FF453A` | Most recent activity |
| `--spark-fitness-warm` | `#FF9500` | `#FF9F0A` | 1-3 days ago |
| `--spark-fitness-good` | `#FFD60A` | `#FFD60A` | 4-7 days ago |
| `--spark-fitness-cool` | `#30D158` | `#30D158` | Completed/active |
| `--spark-fitness-moderate` | `#0A84FF` | `#64D2FF` | Moderate activity |
| `--spark-inactive` | `#8E8E93` | `#636366` | No activity |

#### Background Colors
| Token | Light Mode | Dark Mode |
|-------|-----------|-----------|
| `--bg-primary` | `#F2F2F7` | `#000000` |
| `--bg-secondary` | `#FFFFFF` | `#1C1C1E` |
| `--bg-tertiary` | `#E5E5EA` | `#2C2C2E` |
| `--bg-card` | `#FFFFFF` | `#1C1C1E` |

#### Text Colors
| Token | Light Mode | Dark Mode |
|-------|-----------|-----------|
| `--text-primary` | `#000000` | `#FFFFFF` |
| `--text-secondary` | `rgba(60,60,67,0.6)` | `rgba(235,235,245,0.6)` |
| `--text-muted` | `rgba(60,60,67,0.3)` | `rgba(235,235,245,0.3)` |
| `--text-inverse` | `#FFFFFF` | `#000000` |

#### Border Colors
| Token | Light Mode | Dark Mode |
|-------|-----------|-----------|
| `--border-subtle` | `rgba(0,0,0,0.06)` | `rgba(255,255,255,0.06)` |
| `--border-default` | `rgba(0,0,0,0.1)` | `rgba(255,255,255,0.1)` |
| `--border-strong` | `rgba(0,0,0,0.15)` | `rgba(255,255,255,0.15)` |

---

## Typography

### Font Families
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', Consolas, monospace;
```

### Font Sizes
| Token | Value | Tailwind Class | Usage |
|-------|-------|----------------|-------|
| `--text-xs` | `0.75rem` (12px) | `text-xs` | Small labels |
| `--text-sm` | `0.875rem` (14px) | `text-sm` | Secondary text |
| `--text-base` | `1rem` (16px) | `text-base` | Body text |
| `--text-lg` | `1.125rem` (18px) | `text-lg` | Large text |
| `--text-xl` | `1.25rem` (20px) | `text-xl` | Headings small |
| `--text-2xl` | `1.5rem` (24px) | `text-2xl` | Headings medium |
| `--text-3xl` | `1.875rem` (30px) | `text-3xl` | Headings large |
| `--text-4xl` | `2.25rem` (36px) | `text-4xl` | Headings XL |
| `0.6875rem` | 11px | `text-micro` | Micro labels |

### Font Weights
| Token | Value | Tailwind Class |
|-------|-------|----------------|
| `--weight-normal` | 400 | `font-normal` |
| `--weight-medium` | 500 | `font-medium` |
| `--weight-semibold` | 600 | `font-semibold` |
| `--weight-bold` | 700 | `font-bold` |

---

## Spacing (8px Grid)

| Token | Value | Tailwind Class | Usage |
|-------|-------|----------------|-------|
| `--space-0` | 0 | `p-0` | No spacing |
| `--space-1` | 4px | `p-1` | Micro spacing |
| `--space-2` | 8px | `p-2` | Small spacing |
| `--space-3` | 12px | `p-3` | Medium-small |
| `--space-4` | 16px | `p-4` | Standard |
| `--space-5` | 20px | `p-5` | Medium |
| `--space-6` | 24px | `p-6` | Large |
| `--space-8` | 32px | `p-8` | Extra large |
| `--space-10` | 40px | `p-10` | Section |
| `--space-12` | 48px | `p-12` | Large section |
| `--space-16` | 64px | `p-16` | Page |

---

## Border Radius

| Token | Value | Tailwind Class | Usage |
|-------|-------|----------------|-------|
| `--radius-sm` | 6px | `rounded-sm` | Badges, tags |
| `--radius-md` | 10px | `rounded-md` | Buttons, inputs |
| `--radius-lg` | 14px | `rounded-lg` | Cards, modals |
| `--radius-xl` | 18px | `rounded-xl` | Large cards |
| `--radius-2xl` | 24px | `rounded-2xl` | Bottom sheets |
| `--radius-full` | 9999px | `rounded-full` | Pills, circles |

---

## Shadows

### Standard Shadows
```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.03);
```

### Glow Shadows
```css
--glow-accent: 0 0 12px rgba(var(--spark-accent-rgb), 0.4);
--glow-accent-strong: 0 0 20px rgba(var(--spark-accent-rgb), 0.5);
--glow-secondary: 0 0 12px rgba(var(--spark-accent-secondary-rgb), 0.4);
--glow-gold: 0 0 12px rgba(var(--spark-gold-rgb), 0.4);
--glow-success: 0 0 12px rgba(48, 209, 88, 0.4);
--glow-cyan: 0 0 12px rgba(0, 240, 255, 0.4);
--glow-warning: 0 0 12px rgba(255, 149, 0, 0.4);
```

---

## Motion

### Transition Durations
```css
--duration-fast: 150ms;   /* Quick interactions */
--duration-base: 250ms;   /* Standard transitions */
--duration-slow: 400ms;   /* Page transitions */
```

### Easing Functions
```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);        /* Smooth out */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);   /* In and out */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* Bouncy spring */
```

---

## Usage Guide

### Using Tailwind Classes (Recommended)

```tsx
// Primary button
<button className="bg-spark-accent text-text-primary rounded-xl shadow-glow-accent">
  Click me
</button>

// Card
<div className="bg-bg-card rounded-2xl border border-border-subtle shadow-md">
  Content
</div>

// Fitness indicator
<div className="bg-fitness-hot" />  {/* Hot/Recent */}
<div className="bg-fitness-warm" /> {/* Warm */}
<div className="bg-fitness-good" /> {/* Good */}
<div className="bg-fitness-cool" /> {/* Cool/Complete */}
```

### Using CSS Variables

```tsx
// Inline styles with CSS variables
<div style={{
  background: 'var(--bg-card)',
  border: '1px solid var(--border-subtle)',
  boxShadow: 'var(--shadow-md)',
  borderRadius: 'var(--radius-2xl)',
}}>
  Content
</div>
```

### Using TypeScript Tokens

```tsx
import { COLORS, TYPOGRAPHY, RADIUS, SHADOWS } from '../styles/design-tokens';

<div style={{
  backgroundColor: COLORS.spark.accent.DEFAULT,
  borderRadius: RADIUS.lg,
  boxShadow: SHADOWS.md,
}}>
  Content
</div>
```

---

## Component Guidelines

### Cards
- Use `UltraCard` component for elevated cards
- Border radius: `rounded-2xl` (24px)
- Background: `bg-bg-card`
- Border: `border border-border-subtle`
- Shadow: `shadow-md`

### Buttons
- Use `Button` component from `components/ui/Button.tsx`
- Border radius: `rounded-xl` (18px)
- Touch target: minimum 44px height
- Transition: `duration-fast ease-out`

### Inputs
- Border radius: `rounded-lg` (14px)
- Background: `bg-bg-secondary`
- Border: `border-border-default`
- Focus: `focus:border-primary focus:ring-2 focus:ring-primary/20`

### Badges
- Border radius: `rounded-full`
- Use semantic colors from design tokens
- Use Tailwind opacity modifiers: `bg-success/10 text-success`

---

## Migration Guide

### Old → New Color Mappings

| Old Hardcoded | New Token | Tailwind Class |
|---------------|-----------|----------------|
| `#a3e635` | `--spark-accent` | `bg-spark-accent` |
| `#BF5AF2` | `--spark-accent-secondary` | `bg-spark-accent-secondary` |
| `#30D158` | `--spark-fitness-cool` | `bg-fitness-cool` |
| `#FF3B30` | `--spark-fitness-hot` | `bg-fitness-hot` |
| `#FF9500` | `--spark-fitness-warm` | `bg-fitness-warm` |
| `#FFD60A` | `--spark-fitness-good` | `bg-fitness-good` |
| `#8E8E93` | `--spark-inactive` | `bg-fitness-inactive` |
| `#FFB800` | `--spark-gold` | `bg-achievement-gold` |

### Old → New Radius Mappings

| Old | New | Tailwind Class |
|-----|-----|----------------|
| `rounded-[24px]` | `rounded-2xl` | `rounded-2xl` |
| `rounded-[28px]` | `rounded-2xl` | `rounded-2xl` |

---

## Dark Mode

All components should use CSS variables to ensure proper dark mode support:

```tsx
// ❌ Don't use hardcoded colors
<div className="text-white bg-black">

// ✅ Use design tokens
<div className="text-text-primary bg-bg-primary">
```

---

## File Structure

```
src/styles/
├── design-tokens.css     # CSS variables (single source of truth)
├── design-tokens.ts      # TypeScript mappings
├── base.css             # Base styles
├── components.css       # Component-specific styles
└── index.css           # Main entry point
```

---

## Best Practices

1. **Always use design tokens** - Never hardcode colors, sizes, or other design values
2. **Use Tailwind for common patterns** - Leverage the Tailwind config for consistency
3. **Use CSS variables for complex components** - When Tailwind classes become unwieldy
4. **Test in both themes** - Ensure dark mode works for all new components
5. **Follow spacing grid** - Use 4px/8px increments for all spacing
6. **Use semantic names** - Prefer `success`, `warning`, `error` over specific colors

---

## Contributing

When adding new design tokens:
1. Add to `design-tokens.css` (CSS variables)
2. Add to `design-tokens.ts` (TypeScript)
3. Add to `tailwind.config.js` (Tailwind classes)
4. Update this guide

When updating existing components:
1. Replace hardcoded values with design tokens
2. Test in both light and dark modes
3. Update affected components' documentation
