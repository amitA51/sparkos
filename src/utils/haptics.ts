/**
 * Haptic Feedback Utility
 * Provides native-like vibration feedback for web apps on Android.
 * Designed to mimic iOS Taptic Engine patterns.
 *
 * Usage:
 *   triggerHaptic('light')     — named style (recommended)
 *   vibratePattern([200, 100]) — raw vibration pattern
 */

export type HapticStyle = 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning' | 'error';

const canVibrate = () =>
    typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';

export const triggerHaptic = (style: HapticStyle = 'light') => {
    if (!canVibrate()) return;

    try {
        switch (style) {
            case 'light':
                navigator.vibrate(10);
                break;
            case 'medium':
                navigator.vibrate(20);
                break;
            case 'heavy':
                navigator.vibrate(40);
                break;
            case 'selection':
                navigator.vibrate(5);
                break;
            case 'success':
                navigator.vibrate([10, 30, 10]);
                break;
            case 'warning':
                navigator.vibrate([30, 50, 10]);
                break;
            case 'error':
                navigator.vibrate([50, 100, 50, 100]);
                break;
        }
    } catch {
        // Ignore haptic errors
    }
};

/**
 * Fire a raw vibration pattern (for custom sequences like rest-timer end).
 * @param pattern — single duration in ms, or alternating vibrate/pause array
 */
export const vibratePattern = (pattern: number | readonly number[] | number[]) => {
    if (!canVibrate()) return;
    try {
        navigator.vibrate(pattern as number | number[]);
    } catch {
        // Ignore haptic errors
    }
};
