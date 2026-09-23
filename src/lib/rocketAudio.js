// ─── Web Audio API Synthesizer untuk Game Peluncuran Roket (Fokus: Enter) ───
// Berjalan mandiri tanpa dependensi file eksternal (zero latency, hemat kuota & anti-CORS)

class RocketAudioEngine {
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

  // 1. Suara Ketukan Tombol Terminal Retro (Key Click)
  playKeyClick() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.03);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch {}
  }

  // 2. Suara Kode Lengkap & Layar Siap Luncur (Ready Beep)
  playCodeReady() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [587.33, 880.0].forEach((freq, idx) => {
        const noteTime = now + idx * 0.07;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "square";
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.18, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.085);
      });
    } catch {}
  }

  // 3. Suara Sirene Peringatan Hitung Mundur (Blinking Launch Alert)
  playAlertPulse() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.linearRampToValueAtTime(880, now + 0.1);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }

  // 4. Suara Gemuruh Ignisi & Semburan Api Roket (Rocket Thruster Rumble)
  playLaunchIgnition() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 4A. Noise generator untuk gemuruh api roket
      const bufferSize = this.ctx.sampleRate * 0.45;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(350, now);
      filter.frequency.linearRampToValueAtTime(80, now + 0.45);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.45, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.45);

      // 4B. Tonal boom pendorong
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.35);

      oscGain.gain.setValueAtTime(0.35, now);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {}
  }

  // 5. Suara Peluncuran Sempurna di Zona Hijau (Perfect Ignition Bonus Chime)
  playPerfectChime() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const noteTime = now + idx * 0.05;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.25, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.2);
      });
    } catch {}
  }

  // 6. Suara Salah Tekan / Kerusakan Perisai (Shield Damage Buzz)
  playShieldDamage() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(70, now + 0.2);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {}
  }

  // 7. Suara Mulai Misi (Mission Start Upbeat Horn)
  playWaveStart() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [261.63, 329.63, 392.0, 523.25]; // C4, E4, G4, C5
      notes.forEach((freq, idx) => {
        const noteTime = now + idx * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.28, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.18);
      });
    } catch {}
  }

  // 8. Suara Kemenangan Orbit / Tamat Misi Penuh
  playVictory() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const arpeggios = [
        { f: 523.25, d: 0.1 },
        { f: 659.25, d: 0.1 },
        { f: 783.99, d: 0.1 },
        { f: 1046.5, d: 0.2 },
        { f: 783.99, d: 0.1 },
        { f: 1046.5, d: 0.35 },
      ];

      let elapsed = 0;
      arpeggios.forEach((n) => {
        const noteTime = now + elapsed;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(n.f, noteTime);

        gain.gain.setValueAtTime(0.3, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + n.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + n.d);

        elapsed += n.d * 0.85;
      });
    } catch {}
  }
}

export const rocketAudio = new RocketAudioEngine();
export default rocketAudio;
