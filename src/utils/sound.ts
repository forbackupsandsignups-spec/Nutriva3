/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Plays a pleasant, subtle harmonic chime using Web Audio API
 * No external sound files required, works offline and reliably.
 */
export const playNotificationChime = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Harmonic bell sequence: C6 (1046.5Hz) -> E6 (1318.5Hz) -> G6 (1567.98Hz)
    const notes = [
      { freq: 523.25, time: 0, duration: 0.25, gain: 0.15 },
      { freq: 659.25, time: 0.08, duration: 0.35, gain: 0.2 },
      { freq: 783.99, time: 0.16, duration: 0.45, gain: 0.25 }
    ];

    notes.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, now + note.time);

      gain.gain.setValueAtTime(0, now + note.time);
      gain.gain.linearRampToValueAtTime(note.gain, now + note.time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + note.time + note.duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + note.time);
      osc.stop(now + note.time + note.duration);
    });

    // Close context after playback completes
    setTimeout(() => {
      if (ctx.state !== 'closed') {
        ctx.close().catch(() => {});
      }
    }, 1000);
  } catch {
    // AudioContext might be blocked until user interaction or disabled
  }
};
