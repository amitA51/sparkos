/**
 * Z-Index Hierarchy for SparkOS
 * 
 * Strict ascending order to prevent overlay conflicts.
 * Modals and overlays MUST be higher than navigation elements.
 */

export const Z_INDEX = {
    // Background layers
    background: -10,
    backgroundEffects: 0,

    // Page content
    pageContent: 1,
    stickyHeader: 10,

    // Floating elements
    fab: 50,

    // Navigation (main app navigation bar)
    bottomNavBar: 100,

    // Overlays and modals (MUST be above navigation)
    backdrop: 900,
    overlay: 999,
    modal: 1000,
    bottomSheet: 1000,

    // Context menus and dropdowns
    dropdown: 1050,
    contextMenu: 1050,

    // Critical overlays (above everything)
    alert: 1100,
    toast: 1200,

    // System-level (splash, onboarding)
    splash: 2000,
} as const;

export type ZIndexLevel = keyof typeof Z_INDEX;

/**
 * Tailwind-compatible z-index class map
 * Use with ModalOverlay zLevel prop
 */
export const Z_INDEX_CLASSES = {
    default: 'z-50',
    modal: 'z-[1000]',
    high: 'z-[1000]',
    ultra: 'z-[1100]',
    extreme: 'z-[2000]',
} as const;
