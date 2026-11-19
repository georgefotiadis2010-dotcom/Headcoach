const SOUND_STORAGE_KEY = 'headcoach_sound_enabled_v1';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) {
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') {
    void audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const val = window.localStorage.getItem(SOUND_STORAGE_KEY);
    return val === null ? true : val === 'true';
  } catch {
    return true;
  }
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SOUND_STORAGE_KEY, String(enabled));
  } catch {
    // Ignore storage errors
  }
}

function playTone(
  freq: number,
  durationSec: number,
  type: OscillatorType = 'sine',
  gainPeak = 0.06,
  delaySec = 0,
) {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime + delaySec;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(gainPeak, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + durationSec + 0.02);
}

export function playTap(): void {
  playTone(520, 0.055, 'triangle', 0.035);
}

export function playStepCheck(stepIndex: number): void {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  const freq = notes[Math.min(stepIndex, notes.length - 1)] ?? 659.25;
  playTone(freq, 0.11, 'triangle', 0.055);
}

export function playChallengeWin(): void {
  playTone(587.33, 0.12, 'triangle', 0.06, 0);
  playTone(880, 0.18, 'triangle', 0.065, 0.09);
}

export function playChallengeMiss(): void {
  playTone(260, 0.12, 'sine', 0.045, 0);
  playTone(210, 0.15, 'sine', 0.04, 0.08);
}

export function playDrillComplete(): void {
  playTone(523.25, 0.13, 'triangle', 0.06, 0);
  playTone(659.25, 0.13, 'triangle', 0.06, 0.08);
  playTone(783.99, 0.15, 'triangle', 0.065, 0.16);
  playTone(1046.5, 0.28, 'sine', 0.07, 0.24);
}

export function playPhaseCue(phaseName: string): void {
  const lower = phaseName.toLowerCase();
  if (lower.includes('inhale')) {
    playTone(440, 0.22, 'sine', 0.04);
  } else if (lower.includes('hold')) {
    playTone(523.25, 0.18, 'sine', 0.035);
  } else if (lower.includes('exhale')) {
    playTone(349.23, 0.26, 'sine', 0.04);
  } else {
    playTone(493.88, 0.2, 'sine', 0.04);
  }
}
