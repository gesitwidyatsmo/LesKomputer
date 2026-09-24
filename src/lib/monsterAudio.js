// ─── Web Audio API Synthesizer untuk Game Monster Pemakan Huruf (Backspace vs Delete) ───
// Berjalan mandiri tanpa dependensi file eksternal (zero latency, hemat kuota & anti-CORS)

class MonsterAudioEngine {
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

  // Suara Ketukan Tombol Keyboard (Key Click)
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

  // 1. Suara Monster Backspace Memakan Huruf Kiri (Chomp Renyah Nada Menurun)
  playMunchBackspace() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Nada chomp 1 (Square + Noise)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.14);

      // Crunch renyah ekstra
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = "square";
      osc2.frequency.setValueAtTime(320, now + 0.03);
      osc2.frequency.exponentialRampToValueAtTime(120, now + 0.1);
      gain2.gain.setValueAtTime(0.18, now + 0.03);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.03);
      osc2.stop(now + 0.11);
    } catch {}
  }

  // 2. Suara Monster Delete Memakan Huruf Kanan (Snap Ceria Nada Naik)
  playMunchDelete() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(580, now + 0.11);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);

      // "Pop" bubble ekstra
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(500, now + 0.04);
      osc2.frequency.exponentialRampToValueAtTime(800, now + 0.09);
      gain2.gain.setValueAtTime(0.2, now + 0.04);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.04);
      osc2.stop(now + 0.1);
    } catch {}
  }

  // 3. Suara Monster Tersedak / Salah Tombol (Uh-oh / Choke)
  playChoke() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.15);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.19);
    } catch {}
  }

  // 4. Suara Kata Berhasil Dibersihkan Sempurna (Triumphant Chime)
  playWordComplete() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const noteTime = now + idx * 0.06;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.22, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.24);
      });
    } catch {}
  }

  // 5. Suara Pergeseran Kursor (Panah Kiri / Kanan)
  playCursorMove() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.04);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch {}
  }

  // 6. Suara Hitung Mundur 3-2-1
  playAlertPulse() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.09);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.095);
    } catch {}
  }

  // 7. Suara Pembuka Babak / Wave Start
  playWaveStart() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      notes.forEach((freq, idx) => {
        const noteTime = now + idx * 0.07;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.24, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.2);
      });
    } catch {}
  }

  // 8. Suara Kehilangan Perisai / Nyawa
  playShieldDamage() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.22);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }

  // 9. Suara Kemenangan Akbar (Victory Grand Finale)
  playVictory() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const chords = [
        { notes: [523.25, 659.25, 783.99], time: 0 },
        { notes: [587.33, 739.99, 880.0], time: 0.18 },
        { notes: [659.25, 830.61, 987.77], time: 0.36 },
        { notes: [783.99, 987.77, 1174.66, 1567.98], time: 0.56 },
      ];

      chords.forEach((ch) => {
        ch.notes.forEach((freq) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, now + ch.time);

          gain.gain.setValueAtTime(0.18, now + ch.time);
          gain.gain.exponentialRampToValueAtTime(0.001, now + ch.time + 0.5);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now + ch.time);
          osc.stop(now + ch.time + 0.52);
        });
      });
    } catch {}
  }
}

export const monsterAudio = new MonsterAudioEngine();
