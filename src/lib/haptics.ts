/**
 * Haptic feedback utilities.
 *
 * Wraps Capacitor's Haptics API with safe fallbacks for web.
 * Every call is wrapped in a try/catch so the app never crashes
 * on platforms that don't support haptics.
 */

import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

async function safeHaptic(fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
  } catch {
    // Silently ignore — haptics aren't available on web
  }
}

export const vibrateLight = () => safeHaptic(() => Haptics.impact({ style: ImpactStyle.Light }));
export const vibrateMedium = () => safeHaptic(() => Haptics.impact({ style: ImpactStyle.Medium }));
export const vibrateHeavy = () => safeHaptic(() => Haptics.impact({ style: ImpactStyle.Heavy }));
export const vibrateSuccess = () => safeHaptic(() => Haptics.notification({ type: NotificationType.Success }));
export const vibrateError = () => safeHaptic(() => Haptics.notification({ type: NotificationType.Error }));
