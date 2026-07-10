// Canvas particle system: pops, bursts, trails, confetti, sparkles.
// Owned by BoardView (board-space) and by end screens (full screen).

export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  burst(x, y, color, { count = 12, speed = 260, size = 6, gravity = 500, life = 0.6, shape = 'circle', spread = Math.PI * 2, angle = 0 } = {}) {
    for (let i = 0; i < count; i++) {
      const a = angle + (Math.random() - 0.5) * spread;
      const sp = speed * (0.4 + Math.random() * 0.8);
      this.particles.push({
        x, y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        size: size * (0.5 + Math.random()),
        color: Array.isArray(color) ? color[(Math.random() * color.length) | 0] : color,
        life: life * (0.6 + Math.random() * 0.7),
        age: 0,
        gravity,
        shape,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 12,
      });
    }
  }

  juicePop(x, y, colors) {
    this.burst(x, y, colors, { count: 14, speed: 240, size: 5.5, gravity: 620, life: 0.55 });
    this.burst(x, y, '#ffffff', { count: 5, speed: 130, size: 3.5, gravity: 200, life: 0.4, shape: 'sparkle' });
  }

  leafPuff(x, y, color = '#58bb3d') {
    this.burst(x, y, color, { count: 5, speed: 150, size: 6, gravity: 320, life: 0.6, shape: 'leaf' });
  }

  trail(x, y, color) {
    this.particles.push({
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 10,
      vx: (Math.random() - 0.5) * 40,
      vy: (Math.random() - 0.5) * 40,
      size: 4 + Math.random() * 4,
      color, life: 0.35, age: 0, gravity: 0, shape: 'circle', rot: 0, vrot: 0,
    });
  }

  ring(x, y, color, { radius = 60, count = 20 } = {}) {
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      this.particles.push({
        x, y,
        vx: Math.cos(a) * radius * 4,
        vy: Math.sin(a) * radius * 4,
        size: 5,
        color, life: 0.45, age: 0, gravity: 0, shape: 'circle', rot: 0, vrot: 0, drag: 6,
      });
    }
  }

  confetti(x, y, { count = 40, speed = 500 } = {}) {
    const colors = ['#ff5e7e', '#ff9d4d', '#ffe14d', '#7ee081', '#5ec8ff', '#b48cff', '#ff8fc8'];
    for (let i = 0; i < count; i++) {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
      const sp = speed * (0.4 + Math.random() * 0.9);
      this.particles.push({
        x, y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        size: 5 + Math.random() * 5,
        color: colors[(Math.random() * colors.length) | 0],
        life: 1.6 + Math.random(),
        age: 0, gravity: 420, shape: 'confetti',
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 14,
        drag: 1.6,
      });
    }
  }

  update(dt) {
    const ps = this.particles;
    for (let i = ps.length - 1; i >= 0; i--) {
      const p = ps[i];
      p.age += dt;
      if (p.age >= p.life) { ps.splice(i, 1); continue; }
      const drag = p.drag ?? 0;
      p.vx -= p.vx * drag * dt;
      p.vy -= p.vy * drag * dt;
      p.vy += p.gravity * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vrot * dt;
    }
  }

  draw(ctx) {
    for (const p of this.particles) {
      const t = p.age / p.life;
      const alpha = t < 0.7 ? 1 : 1 - (t - 0.7) / 0.3;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      const s = p.size * (p.shape === 'confetti' ? 1 : 1 - t * 0.5);
      if (p.shape === 'sparkle') {
        ctx.beginPath();
        ctx.moveTo(0, -s * 2);
        ctx.quadraticCurveTo(0, 0, s * 2, 0);
        ctx.quadraticCurveTo(0, 0, 0, s * 2);
        ctx.quadraticCurveTo(0, 0, -s * 2, 0);
        ctx.quadraticCurveTo(0, 0, 0, -s * 2);
        ctx.fill();
      } else if (p.shape === 'confetti') {
        ctx.fillRect(-s / 2, -s / 3, s, s * 0.66);
      } else if (p.shape === 'leaf') {
        ctx.beginPath();
        ctx.ellipse(0, 0, s, s * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, s, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  get count() { return this.particles.length; }
}

/* Floating score numbers & labels rendered in board space */
export class FloatingTextSystem {
  constructor() {
    this.items = [];
  }

  add(x, y, text, { color = '#fff', size = 26, stroke = '#7c4a12', life = 0.9 } = {}) {
    this.items.push({ x, y, text, color, size, stroke, life, age: 0 });
  }

  update(dt) {
    for (let i = this.items.length - 1; i >= 0; i--) {
      const it = this.items[i];
      it.age += dt;
      if (it.age >= it.life) this.items.splice(i, 1);
    }
  }

  draw(ctx) {
    for (const it of this.items) {
      const t = it.age / it.life;
      const scale = t < 0.18 ? 0.4 + (t / 0.18) * 0.75 : 1.15 - Math.min(0.15, (t - 0.18) * 0.4);
      const rise = 46 * easeOutCubic(t);
      const alpha = t < 0.65 ? 1 : 1 - (t - 0.65) / 0.35;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(it.x, it.y - rise);
      ctx.scale(scale, scale);
      ctx.font = `${it.size}px 'Lilita One', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineWidth = 5;
      ctx.lineJoin = 'round';
      ctx.strokeStyle = it.stroke;
      ctx.strokeText(it.text, 0, 0);
      ctx.fillStyle = it.color;
      ctx.fillText(it.text, 0, 0);
      ctx.restore();
    }
  }
}

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
