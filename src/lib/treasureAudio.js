// ─── Web Audio API Synthesizer untuk Detektif Harta Karun ──────────
// Berjalan mandiri tanpa dependensi file eksternal (zero-latency, hemat kuota)

class TreasureAudioEngine {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
  }

  init() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  toggleSound(forceState) {
    if (typeof forceState === "boolean") {
      this.soundEnabled = forceState;
    } else {
      this.soundEnabled = !this.soundEnabled;
    }
    return this.soundEnabled;
  }

  // Suara getaran peti / gembok saat diklik 1 kali (Clack-Wobble)
  playClickWobble() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // 1. Suara kayu/gembok bergetar
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }

  // Suara peti terbuka & koin emas meletup (Ka-ching! + Coin Chime)
  playChestOpen(isDiamond = false) {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Denting kunci terbuka (Latch Pop)
      const latchOsc = this.ctx.createOscillator();
      const latchGain = this.ctx.createGain();
      latchOsc.type = "sine";
      latchOsc.frequency.setValueAtTime(520, now);
      latchOsc.frequency.exponentialRampToValueAtTime(880, now + 0.06);
      latchGain.gain.setValueAtTime(0.3, now);
      latchGain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
      latchOsc.connect(latchGain);
      latchGain.connect(this.ctx.destination);
      latchOsc.start(now);
      latchOsc.stop(now + 0.06);

      // 2. Koin emas bergemerincing (Coin Jingle arpeggio)
      const notes = isDiamond
        ? [880.0, 1174.66, 1479.98, 1760.0, 2349.32] // Emas Berlian cerah
        : [523.25, 659.25, 783.99, 1046.5]; // Koin Emas Standar

      notes.forEach((freq, idx) => {
        const noteTime = now + 0.04 + idx * 0.045;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.22, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.22);
      });
    } catch {}
  }

  // Suara jebakan meletus jika peti bom terbuka (Trap Boom)
  playTrapExplode() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Dentuman bass rendah
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.linearRampToValueAtTime(30, now + 0.3);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {}
  }

  // Suara gembok berputar (Unlocking Ratchet)
  playLockTick(step = 1) {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(440 * (1 + step * 0.25), now);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  // Suara transisi ruang selesai (Room Clear Fanfare)
  playRoomFanfare() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [392.0, 440.0, 523.25, 659.25, 783.99]; // G4, A4, C5, E5, G5

      notes.forEach((freq, idx) => {
        const noteTime = now + idx * 0.07;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.25, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.28);
      });
    } catch {}
  }

  // Suara kemenangan mahkota kerajaan (Grand Victory Fanfare)
  playGrandVictory() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const fanfare = [
        { f: 523.25, d: 0.12 }, // C5
        { f: 659.25, d: 0.12 }, // E5
        { f: 783.99, d: 0.12 }, // G5
        { f: 1046.5, d: 0.4 },  // C6
      ];

      let t = now;
      fanfare.forEach((n) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(n.f, t);

        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + n.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + n.d);

        t += n.d + 0.03;
      });
    } catch {}
  }
}

export const treasureAudio = new TreasureAudioEngine();
