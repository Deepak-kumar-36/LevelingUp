import { Haptics, ImpactStyle } from '@capacitor/haptics';

export const vibrateLight = async () => {
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch (e) {
    // Ignore on web
  }
};

export const vibrateMedium = async () => {
  try {
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch (e) {
    // Ignore on web
  }
};

export const vibrateHeavy = async () => {
  try {
    await Haptics.impact({ style: ImpactStyle.Heavy });
  } catch (e) {
    // Ignore on web
  }
};

export const vibrateSuccess = async () => {
  try {
    await Haptics.notification({ type: 'SUCCESS' as any });
  } catch (e) {
    // Ignore on web
  }
};

export const vibrateError = async () => {
  try {
    await Haptics.notification({ type: 'ERROR' as any });
  } catch (e) {
    // Ignore on web
  }
};
