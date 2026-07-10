// Trauma-based screen shake: effects add trauma, shake intensity
// decays smoothly, offset is sampled per-frame with jitter.

export class ScreenShake {
  constructor() {
    this.trauma = 0;
  }

  add(amount) {
    this.trauma = Math.min(1, this.trauma + amount);
  }

  update(dt) {
    this.trauma = Math.max(0, this.trauma - dt * 1.6);
  }

  get offset() {
    if (this.trauma <= 0.001) return { x: 0, y: 0, rot: 0 };
    const s = this.trauma * this.trauma; // quadratic falloff feels better
    return {
      x: (Math.random() * 2 - 1) * 14 * s,
      y: (Math.random() * 2 - 1) * 14 * s,
      rot: (Math.random() * 2 - 1) * 0.02 * s,
    };
  }
}
