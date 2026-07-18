/**
 * Haptic and Audio feedback utilities.
 *
 * Wraps Capacitor's Haptics API with safe fallbacks for web,
 * and uses the Web Audio API to synthesize Corrupted Void sound effects.
 */

import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

// --- Audio Engine ---
let audioCtx: AudioContext | null = null;

function getAudioCtx() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

function playTone(freq: number, type: OscillatorType, duration: number, vol = 0.1) {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Envelope shaping (Attack -> Decay)
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Silently ignore audio errors
  }
}

// Sound profiles
const sounds = {
  light: () => playTone(800, 'sine', 0.05, 0.02),
  medium: () => playTone(200, 'triangle', 0.1, 0.05),
  heavy: () => {
    playTone(60, 'sawtooth', 0.3, 0.15); // Deep bass thud
    playTone(120, 'square', 0.2, 0.05);  // Crunch
  },
  success: () => {
    playTone(440, 'sine', 0.1, 0.05); // A4
    setTimeout(() => playTone(554.37, 'sine', 0.1, 0.05), 80); // C#5
    setTimeout(() => playTone(659.25, 'sine', 0.3, 0.05), 160); // E5
  },
  error: () => {
    playTone(150, 'square', 0.25, 0.1); // Dissonant low buzz
    playTone(158, 'square', 0.25, 0.1);
  }
};

// --- Haptics Engine ---
async function safeHaptic(fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
  } catch {
    // Silently ignore — haptics aren't available on web
  }
}

export const vibrateLight = () => {
  sounds.light();
  return safeHaptic(() => Haptics.impact({ style: ImpactStyle.Light }));
};

export const vibrateMedium = () => {
  sounds.medium();
  return safeHaptic(() => Haptics.impact({ style: ImpactStyle.Medium }));
};

export const vibrateHeavy = () => {
  sounds.heavy();
  return safeHaptic(() => Haptics.impact({ style: ImpactStyle.Heavy }));
};

export const vibrateSuccess = () => {
  sounds.success();
  return safeHaptic(() => Haptics.notification({ type: NotificationType.Success }));
};

export const vibrateError = () => {
  sounds.error();
  return safeHaptic(() => Haptics.notification({ type: NotificationType.Error }));
};
