/**
 * Constants Index
 *
 * Barrel export for all application constants.
 */

// Core application constants (storage keys, item types, UI constants)
export * from './appConstants';

// Design system tokens (spacing, typography, colors, etc.)
// Note: Z_INDEX from designTokens is intentionally excluded to avoid
// collision with the more detailed Z_INDEX from zIndex.ts
export {
  SPACING, SPACING_NUM, FONT_SIZE, FONT_WEIGHT, LINE_HEIGHT,
  BORDER_RADIUS, SHADOW, TRANSITION, ANIMATION_DURATION,
  BREAKPOINT, OPACITY, INPUT_HEIGHT, BUTTON_PADDING, CARD_PADDING,
  spacing, glowShadow, SEMANTIC_COLORS, ACCENT_PRESETS,
  GLASS, GLASS_CLASSES, TOUCH_TARGET, CONTAINER, GRID,
  FOCUS, FOCUS_CLASSES,
  type Spacing, type FontSize, type BorderRadius, type Shadow,
  type GlassVariant, type AccentPreset, type SemanticColor,
} from './designTokens';

// Z-index hierarchy (authoritative z-index values for the app)
export * from './zIndex';
