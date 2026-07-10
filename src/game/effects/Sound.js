// Sound placeholder system — every effect is synthesized with WebAudio
// so the prototype is fully audible with zero asset files. Swapping in
// real recorded SFX later means replacing one function body per name.

class SoundSystem {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('frogapop.muted') === '1';
  }

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.5;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('frogapop.muted', this.muted ? '1' : '0');
    return this.muted;
  }

  tone({ freq = 440, endFreq, dur = 0.15, type = 'sine', vol = 0.4, delay = 0, attack = 0.005 }) {
    if (this.muted || !this.ensure()) return;
    const t0 = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (endFreq) osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), t0 + dur);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(g).connect(this.master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  noise({ dur = 0.2, vol = 0.3, delay = 0, freq = 1200, q = 1, sweepTo }) {
    if (this.muted || !this.ensure()) return;
    const t0 = this.ctx.currentTime + delay;
    const len = Math.max(1, (dur * this.ctx.sampleRate) | 0);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const filt = this.ctx.createBiquadFilter();
    filt.type = 'bandpass';
    filt.frequency.setValueAtTime(freq, t0);
    if (sweepTo) filt.frequency.exponentialRampToValueAtTime(sweepTo, t0 + dur);
    filt.Q.value = q;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    src.connect(filt).connect(g).connect(this.master);
    src.start(t0);
  }

  /* ------- named game events ------- */

  button() { this.tone({ freq: 660, endFreq: 880, dur: 0.09, type: 'triangle', vol: 0.35 }); }

  swap() { this.noise({ dur: 0.12, vol: 0.18, freq: 900, sweepTo: 2400, q: 2 }); }

  invalid() {
    this.tone({ freq: 220, endFreq: 160, dur: 0.12, type: 'square', vol: 0.12 });
    this.tone({ freq: 165, endFreq: 120, dur: 0.14, type: 'square', vol: 0.1, delay: 0.06 });
  }

  pop(combo = 1) {
    const base = 420 + Math.min(combo, 8) * 90;
    this.tone({ freq: base, endFreq: base * 1.9, dur: 0.13, type: 'sine', vol: 0.4 });
    this.noise({ dur: 0.08, vol: 0.22, freq: 2600, q: 0.8 });
  }

  land() { this.tone({ freq: 200, endFreq: 130, dur: 0.06, type: 'sine', vol: 0.12 }); }

  specialCreated() {
    [523, 659, 784].forEach((f, i) => this.tone({ freq: f, dur: 0.14, type: 'triangle', vol: 0.3, delay: i * 0.06 }));
  }

  rocket() {
    this.noise({ dur: 0.4, vol: 0.35, freq: 500, sweepTo: 4200, q: 1.4 });
    this.tone({ freq: 300, endFreq: 1400, dur: 0.35, type: 'sawtooth', vol: 0.12 });
  }

  bomb() {
    this.tone({ freq: 150, endFreq: 40, dur: 0.5, type: 'sine', vol: 0.6 });
    this.noise({ dur: 0.45, vol: 0.4, freq: 300, sweepTo: 80, q: 0.6 });
  }

  rainbow() {
    [523, 622, 784, 932, 1047, 1245].forEach((f, i) =>
      this.tone({ freq: f, dur: 0.22, type: 'triangle', vol: 0.22, delay: i * 0.05 }));
    this.noise({ dur: 0.5, vol: 0.1, freq: 5000, q: 0.5 });
  }

  ribbit() {
    this.tone({ freq: 130, endFreq: 190, dur: 0.11, type: 'sawtooth', vol: 0.18 });
    this.tone({ freq: 110, endFreq: 170, dur: 0.13, type: 'sawtooth', vol: 0.18, delay: 0.13 });
  }

  frogPower() {
    this.ribbit();
    [392, 494, 587, 784].forEach((f, i) => this.tone({ freq: f, dur: 0.18, type: 'square', vol: 0.12, delay: 0.25 + i * 0.07 }));
  }

  stomp() {
    this.tone({ freq: 260, endFreq: 90, dur: 0.16, type: 'sine', vol: 0.4 });
    this.noise({ dur: 0.1, vol: 0.2, freq: 1800, q: 1 });
  }

  star() {
    this.tone({ freq: 880, endFreq: 1760, dur: 0.25, type: 'triangle', vol: 0.35 });
    this.noise({ dur: 0.2, vol: 0.1, freq: 6000, q: 0.5 });
  }

  win() {
    [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) =>
      this.tone({ freq: f, dur: i >= 5 ? 0.5 : 0.16, type: 'triangle', vol: 0.32, delay: i * 0.13 }));
  }

  lose() {
    [392, 349, 311, 262].forEach((f, i) =>
      this.tone({ freq: f, dur: 0.3, type: 'triangle', vol: 0.26, delay: i * 0.22 }));
  }
}

export const Sound = new SoundSystem();
