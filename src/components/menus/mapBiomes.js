// ============================================================
// mapBiomes.js — world identity for the level-select map.
//
// Each world defines: sky palette, ground palette, path colours,
// a set of parallax-layered SVG decorations, ambient particles
// and optional fog/lighting. The map controller (LevelSelect.js)
// consumes this data and lays it out for the current orientation.
//
// Decorations are described declaratively as { ax, cx, ... } where
//   ax = position ALONG the scroll axis within the world (0..1)
//   cx = position ACROSS the axis (0 = top/left, 1 = bottom/right)
// so a single description renders correctly whether the map is
// scrolling horizontally (desktop) or vertically (mobile).
// ============================================================

/* ---------- tiny svg helpers ---------- */
const S = (w, h, inner, vb) =>
  `<svg width="${w}" height="${h}" viewBox="${vb || `0 0 ${w} ${h}`}" xmlns="http://www.w3.org/2000/svg" style="overflow:visible;display:block">${inner}</svg>`;

function lerp(a, b, t) { return a + (b - a) * t; }

/* deterministic hash so a world always renders the same scenery */
export function splitmix(seed) {
  let s = seed | 0;
  return function () {
    s = (s + 0x9e3779b9) | 0;
    let z = s;
    z = Math.imul(z ^ (z >>> 16), 0x85ebca6b);
    z = Math.imul(z ^ (z >>> 13), 0xc2b2ae35);
    z = (z ^ (z >>> 16)) >>> 0;
    return z / 4294967296;
  };
}

/* ---------- reusable art ---------- */
function palm(h, hue = '#3fae4c', hueDark = '#2c8a3e', trunk = '#8a5a30') {
  return S(h, h, `
    <path d="M50 96 Q45 60 52 32" stroke="${trunk}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M50 96 Q45 60 52 32" stroke="rgba(255,255,255,0.25)" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-dasharray="3 7"/>
    <g fill="${hue}" stroke="${hueDark}" stroke-width="2.2">
      <path d="M52 32 Q22 18 8 30 Q28 36 52 32Z"/>
      <path d="M52 32 Q82 18 96 30 Q76 38 52 32Z"/>
      <path d="M52 32 Q30 6 12 8 Q32 26 52 32Z"/>
      <path d="M52 32 Q72 6 90 8 Q72 26 52 32Z"/>
      <path d="M52 32 Q52 2 44 -2 Q60 8 52 32Z"/>
    </g>
    <circle cx="46" cy="38" r="5" fill="#ffc53d" stroke="#c98a00" stroke-width="1.5"/>
    <circle cx="57" cy="40" r="4" fill="#ffc53d" stroke="#c98a00" stroke-width="1.5"/>`, '0 -6 100 102');
}

function mound(w, h, top, bot) {
  return S(w, h, `<path d="M0 ${h} Q${w * 0.5} -${h * 0.4} ${w} ${h} Z" fill="url(#g)"/>
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/></linearGradient></defs>`);
}

function crystal(h, c1, c2, glow) {
  const w = h * 0.6;
  // soft glow via a translucent painted ellipse instead of a costly SVG filter
  return S(w, h, `
    <ellipse cx="${w * 0.5}" cy="${h * 0.5}" rx="${w * 0.75}" ry="${h * 0.55}" fill="${glow}" opacity="0.5"/>
    <polygon points="${w * 0.5},0 ${w},${h * 0.32} ${w * 0.72},${h} ${w * 0.28},${h} 0,${h * 0.32}" fill="${c2}"/>
    <polygon points="${w * 0.5},0 ${w},${h * 0.32} ${w * 0.5},${h * 0.5}" fill="${c1}"/>
    <polygon points="${w * 0.5},0 0,${h * 0.32} ${w * 0.5},${h * 0.5}" fill="${c1}" opacity="0.7"/>
    <polygon points="${w * 0.5},${h * 0.5} ${w},${h * 0.32} ${w * 0.72},${h}" fill="${c1}" opacity="0.55"/>`);
}

function volcano(w) {
  const h = w * 0.7;
  return S(w, h, `
    <path d="M0 ${h} L${w * 0.34} ${h * 0.12} Q${w * 0.5} 0 ${w * 0.66} ${h * 0.12} L${w} ${h} Z" fill="url(#v)"/>
    <path d="M${w * 0.34} ${h * 0.12} Q${w * 0.5} 0 ${w * 0.66} ${h * 0.12} L${w * 0.6} ${h * 0.26} Q${w * 0.5} ${h * 0.2} ${w * 0.4} ${h * 0.26} Z" fill="#ff7a2e"/>
    <path d="M${w * 0.42} ${h * 0.2} Q${w * 0.5} ${h * 0.1} ${w * 0.58} ${h * 0.2} Q${w * 0.5} ${h * 0.3} ${w * 0.42} ${h * 0.2}Z" fill="#ffd24d"/>
    <defs><linearGradient id="v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a3324"/><stop offset="1" stop-color="#2c1810"/></linearGradient></defs>`);
}

function deadTree(h) {
  const w = h * 0.7;
  return S(w, h, `<g stroke="#1f120b" stroke-width="${h * 0.05}" stroke-linecap="round" fill="none">
    <path d="M${w * 0.5} ${h} L${w * 0.5} ${h * 0.4}"/>
    <path d="M${w * 0.5} ${h * 0.58} L${w * 0.22} ${h * 0.3}"/>
    <path d="M${w * 0.5} ${h * 0.5} L${w * 0.8} ${h * 0.22}"/>
    <path d="M${w * 0.5} ${h * 0.42} L${w * 0.36} ${h * 0.16}"/>
    <path d="M${w * 0.5} ${h * 0.4} L${w * 0.64} ${h * 0.14}"/></g>`);
}

function planet(r, c1, c2, ring) {
  const pad = ring ? r * 1.6 : r * 0.3;
  const size = r * 2 + pad * 2;
  const cx = size / 2, cy = size / 2;
  return S(size, size, `
    ${ring ? `<ellipse cx="${cx}" cy="${cy}" rx="${r * 1.7}" ry="${r * 0.5}" fill="none" stroke="${ring}" stroke-width="${r * 0.16}" opacity="0.85" transform="rotate(-18 ${cx} ${cy})"/>` : ''}
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#pg)"/>
    <circle cx="${cx - r * 0.32}" cy="${cy - r * 0.32}" r="${r * 0.9}" fill="rgba(255,255,255,0.18)"/>
    ${ring ? `<path d="M${cx - r * 1.7} ${cy} a${r * 1.7} ${r * 0.5} 0 0 0 ${r * 3.4} 0" fill="none" stroke="${ring}" stroke-width="${r * 0.16}" opacity="0.9" transform="rotate(-18 ${cx} ${cy})"/>` : ''}
    <defs><radialGradient id="pg" cx="35%" cy="32%"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></radialGradient></defs>`);
}

function prism(h) {
  const w = h * 0.5;
  return S(w, h, `
    <ellipse cx="${w * 0.5}" cy="${h * 0.5}" rx="${w * 0.8}" ry="${h * 0.55}" fill="rgba(255,255,255,0.35)" opacity="0.6"/>
    <polygon points="${w * 0.5},0 ${w},${h * 0.5} ${w * 0.5},${h} 0,${h * 0.5}" fill="url(#pr)"/>
    <polygon points="${w * 0.5},0 ${w},${h * 0.5} ${w * 0.5},${h * 0.5}" fill="rgba(255,255,255,0.4)"/>
    <defs><linearGradient id="pr" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ff9ecf"/><stop offset="0.35" stop-color="#ffe58a"/>
      <stop offset="0.6" stop-color="#8affc4"/><stop offset="0.85" stop-color="#8ecbff"/>
      <stop offset="1" stop-color="#c79bff"/></linearGradient></defs>`);
}

function floatIsle(w, top, bot) {
  const h = w * 0.7;
  return S(w, h, `
    <ellipse cx="${w * 0.5}" cy="${h * 0.3}" rx="${w * 0.5}" ry="${h * 0.28}" fill="${top}"/>
    <path d="M${w * 0.02} ${h * 0.3} Q${w * 0.5} ${h * 1.15} ${w * 0.98} ${h * 0.3} Q${w * 0.75} ${h * 0.5} ${w * 0.5} ${h * 0.5} Q${w * 0.25} ${h * 0.5} ${w * 0.02} ${h * 0.3}Z" fill="${bot}"/>`);
}

function cloud(scale = 1) {
  return `<div class="mb-cloud" style="transform:scale(${scale})"></div>`;
}

/* ---------- ambient particle field ---------- */
export class ParticleField {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.parts = [];
    this.cfg = { kind: 'pollen', colors: ['#fff'], count: 40, speed: 14 };
    this.shooting = [];
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.resize();
  }
  resize() {
    const c = this.canvas;
    this.W = c.clientWidth; this.H = c.clientHeight;
    c.width = this.W * this.dpr; c.height = this.H * this.dpr;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }
  setTheme(cfg) {
    this.cfg = cfg;
    const n = cfg.count;
    while (this.parts.length < n) this.parts.push(this.spawn());
    if (this.parts.length > n) this.parts.length = n;
  }
  spawn(fromEdge = false) {
    const { kind } = this.cfg;
    const p = {
      x: Math.random() * this.W,
      y: Math.random() * this.H,
      r: 1 + Math.random() * 2.4,
      a: 0.3 + Math.random() * 0.6,
      tw: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * this.cfg.speed,
      vy: (Math.random() - 0.5) * this.cfg.speed,
      color: this.cfg.colors[(Math.random() * this.cfg.colors.length) | 0],
    };
    if (kind === 'ember' || kind === 'bubble') { p.vy = -(this.cfg.speed * (0.5 + Math.random())); p.vx = (Math.random() - 0.5) * 12; if (fromEdge) p.y = this.H + 10; }
    if (kind === 'pollen' || kind === 'sparkle') { p.vy = -(this.cfg.speed * (0.2 + Math.random() * 0.5)); }
    if (kind === 'ember') p.r = 1 + Math.random() * 2.2;
    return p;
  }
  update(dt) {
    const { kind } = this.cfg;
    for (const p of this.parts) {
      p.x += p.vx * dt; p.y += p.vy * dt; p.tw += dt * 3;
      if (kind === 'pollen' || kind === 'sparkle') p.x += Math.sin(p.tw) * 6 * dt;
      // wrap / recycle
      if (p.y < -12) { p.y = this.H + 8; p.x = Math.random() * this.W; p.color = this.cfg.colors[(Math.random() * this.cfg.colors.length) | 0]; }
      if (p.y > this.H + 12) p.y = -8;
      if (p.x < -12) p.x = this.W + 8; if (p.x > this.W + 12) p.x = -8;
    }
    // shooting stars for space
    if (kind === 'star') {
      if (Math.random() < dt * 0.35 && this.shooting.length < 2) {
        this.shooting.push({ x: Math.random() * this.W, y: Math.random() * this.H * 0.5, vx: 340 + Math.random() * 220, vy: 120 + Math.random() * 80, life: 1 });
      }
      for (let i = this.shooting.length - 1; i >= 0; i--) {
        const s = this.shooting[i];
        s.x += s.vx * dt; s.y += s.vy * dt; s.life -= dt * 1.1;
        if (s.life <= 0 || s.x > this.W + 60) this.shooting.splice(i, 1);
      }
    }
  }
  draw() {
    const ctx = this.ctx, { kind } = this.cfg;
    ctx.clearRect(0, 0, this.W, this.H);
    ctx.globalCompositeOperation = (kind === 'ember' || kind === 'star' || kind === 'sparkle') ? 'lighter' : 'source-over';
    for (const p of this.parts) {
      const tw = kind === 'star' || kind === 'sparkle' ? (0.35 + Math.abs(Math.sin(p.tw)) * 0.65) : 1;
      ctx.globalAlpha = p.a * tw;
      ctx.fillStyle = p.color;
      if (kind === 'star') {
        ctx.fillRect(p.x, p.y, p.r * 0.9, p.r * 0.9);
      } else {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        if (kind === 'ember' || kind === 'sparkle') {
          ctx.globalAlpha = p.a * tw * 0.3;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 2.6, 0, Math.PI * 2); ctx.fill();
        }
      }
    }
    for (const s of this.shooting) {
      ctx.globalAlpha = Math.max(0, s.life) * 0.9;
      const g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 0.08, s.y - s.vy * 0.08);
      g.addColorStop(0, '#ffffff'); g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.strokeStyle = g; ctx.lineWidth = 2; ctx.beginPath();
      ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx * 0.08, s.y - s.vy * 0.08); ctx.stroke();
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  }
}

/* ---------- colour blending for seamless sky transitions ---------- */
function hexToRgb(h) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
export function blendHex(a, b, t) {
  const A = hexToRgb(a), B = hexToRgb(b);
  return `rgb(${Math.round(lerp(A[0], B[0], t))},${Math.round(lerp(A[1], B[1], t))},${Math.round(lerp(A[2], B[2], t))})`;
}

/* ============================================================
   WORLD THEMES
   ============================================================ */
export const THEMES = {
  /* 1 — SUNNY SHORES : tropical beach, ocean, palms, warm light */
  1: {
    id: 1, name: 'Sunny Shores', icon: '🏝️',
    sky: ['#63d6ec', '#8fe9dd', '#d9f6c9'],
    ground: ['#ffe6a7', '#f2cd7c', '#e0b25f'],
    path: { fill: '#f3d290', edge: '#c99a4a', dash: '#fff6df' },
    node: { c1: '#ffe6a0', c2: '#e9b85c', c3: '#c68f3c', ring: '#f4d38a' },
    light: 'radial-gradient(120% 80% at 70% 0%, rgba(255,244,190,0.55), rgba(255,244,190,0) 60%)',
    particles: { kind: 'pollen', colors: ['#fff4c2', '#ffffff', '#ffe58a'], count: 34, speed: 16 },
    far: (rng) => {
      const out = [{ ax: 0.72, cx: 0.16, s: 1, anim: 'mb-sun', html: `<div class="mb-sun"></div>` }];
      for (let i = 0; i < 3; i++) out.push({ ax: 0.15 + i * 0.3 + rng() * 0.08, cx: 0.5, s: 0.8 + rng() * 0.4, html: mound(340, 120, '#7fd0a8', '#4fa9b0') });
      for (let i = 0; i < 4; i++) out.push({ ax: rng(), cx: 0.12 + rng() * 0.12, anim: 'mb-drift', delay: -i * 7, html: cloud(0.8 + rng() * 0.5) });
      return out;
    },
    mid: (rng) => {
      const out = [];
      for (let i = 0; i < 5; i++) out.push({ ax: 0.08 + i * 0.2 + (rng() - 0.5) * 0.06, cx: 0.82, s: 0.75 + rng() * 0.5, anim: 'mb-sway', delay: -rng() * 5, html: palm(150) });
      for (let i = 0; i < 3; i++) out.push({ ax: rng(), cx: 0.66, s: 0.7, html: mound(200, 90, '#8fe06a', '#4fb35a') });
      return out;
    },
    near: (rng) => {
      const out = [];
      for (let i = 0; i < 7; i++) out.push({ ax: rng(), cx: 0.98, s: 0.5 + rng() * 0.5, html: grassTuft('#54c157', '#2f8f3e') });
      for (let i = 0; i < 3; i++) out.push({ ax: 0.2 + i * 0.3, cx: 0.9, s: 0.6, anim: 'mb-bob', delay: -i, html: S(40, 30, `<ellipse cx="20" cy="18" rx="18" ry="10" fill="#ffd98a"/><ellipse cx="20" cy="16" rx="18" ry="10" fill="#ffe9b8"/>`) });
      return out;
    },
    water: true,
  },

  /* 2 — CRYSTAL DEPTHS : cavern, glowing crystals, cool fog */
  2: {
    id: 2, name: 'Crystal Depths', icon: '💎',
    sky: ['#123a54', '#0f5d73', '#0a3550'],
    ground: ['#2c6d84', '#1d4d63', '#12374a'],
    path: { fill: '#bfe9ff', edge: '#5aa0c4', dash: '#eaffff' },
    node: { c1: '#d6f2ff', c2: '#79c3e6', c3: '#3f86ad', ring: '#bfe9ff' },
    light: 'radial-gradient(90% 70% at 50% 40%, rgba(120,200,255,0.22), rgba(10,40,60,0) 65%)',
    fog: 'rgba(150,210,240,0.16)',
    particles: { kind: 'bubble', colors: ['#bfeaff', '#8fd6ff', '#e6ffff'], count: 30, speed: 22 },
    far: (rng) => {
      const out = [];
      for (let i = 0; i < 4; i++) out.push({ ax: 0.12 + i * 0.24 + rng() * 0.05, cx: 0.5, s: 0.9 + rng() * 0.5, html: mound(300, 150, '#1c536b', '#0d2f45') });
      for (let i = 0; i < 5; i++) out.push({ ax: rng(), cx: 0.02, s: 0.6 + rng(), anim: 'mb-glow', delay: -rng() * 4, html: stalactite(70 + rng() * 60, '#2f7089', '#173f56') });
      return out;
    },
    mid: (rng) => {
      const out = [];
      const cols = [['#d6f2ff', '#5aa8d4', 'rgba(120,210,255,0.7)'], ['#e7d6ff', '#a17ad4', 'rgba(180,140,255,0.6)'], ['#d6ffe9', '#5ad4a8', 'rgba(120,255,200,0.6)']];
      for (let i = 0; i < 7; i++) { const c = cols[(rng() * cols.length) | 0]; out.push({ ax: 0.05 + i * 0.14 + (rng() - 0.5) * 0.05, cx: 0.86, s: 0.6 + rng() * 0.7, anim: 'mb-glow', delay: -rng() * 3, html: crystal(150, c[0], c[1], c[2]) }); }
      return out;
    },
    near: (rng) => {
      const out = [];
      for (let i = 0; i < 6; i++) out.push({ ax: rng(), cx: 0.99, s: 0.4 + rng() * 0.5, anim: 'mb-glow', delay: -rng() * 3, html: crystal(90, '#eaffff', '#6ab8dd', 'rgba(120,210,255,0.7)') });
      return out;
    },
  },

  /* 3 — EMBER WILDS : volcanic jungle, lava, embers, smoky haze */
  3: {
    id: 3, name: 'Ember Wilds', icon: '🌋',
    sky: ['#3a1c22', '#7a2f1e', '#c0532a'],
    ground: ['#3a241c', '#28170f', '#1a0e08'],
    path: { fill: '#3a2620', edge: '#ff6a2e', dash: '#ffb057' },
    node: { c1: '#ffb865', c2: '#e2651f', c3: '#9c3410', ring: '#ff8a3a' },
    light: 'radial-gradient(100% 80% at 50% 100%, rgba(255,110,40,0.35), rgba(60,20,10,0) 60%)',
    fog: 'rgba(60,30,20,0.25)',
    particles: { kind: 'ember', colors: ['#ffd24d', '#ff8a2e', '#ff5a1e'], count: 44, speed: 34 },
    far: (rng) => {
      const out = [{ ax: 0.5, cx: 0.42, s: 1.5, html: volcano(360) }, { ax: 0.5, cx: 0.3, s: 1, anim: 'mb-smoke', html: `<div class="mb-smoke"></div>` }];
      for (let i = 0; i < 3; i++) out.push({ ax: 0.15 + i * 0.35, cx: 0.55, s: 0.9, html: mound(320, 150, '#4a2a1e', '#26140c') });
      return out;
    },
    mid: (rng) => {
      const out = [];
      for (let i = 0; i < 6; i++) out.push({ ax: 0.06 + i * 0.16 + (rng() - 0.5) * 0.05, cx: 0.84, s: 0.7 + rng() * 0.6, html: deadTree(150) });
      for (let i = 0; i < 4; i++) out.push({ ax: rng(), cx: 0.9, s: 0.6 + rng() * 0.5, anim: 'mb-glow', delay: -rng() * 2, html: lavaRock(90) });
      return out;
    },
    near: (rng) => {
      const out = [];
      for (let i = 0; i < 6; i++) out.push({ ax: rng(), cx: 0.99, s: 0.5 + rng() * 0.5, anim: 'mb-glow', delay: -rng() * 2, html: lavaRock(70) });
      return out;
    },
  },

  /* 4 — COSMIC SUMMIT : space peaks, planets, nebula, starfield */
  4: {
    id: 4, name: 'Cosmic Summit', icon: '🌌',
    sky: ['#0a0524', '#241246', '#4a2a6e'],
    ground: ['#2a1e52', '#1b1238', '#0e0824'],
    path: { fill: '#3a2b66', edge: '#9a7bff', dash: '#d9c7ff' },
    node: { c1: '#e6d6ff', c2: '#9a7bff', c3: '#5a3aa8', ring: '#c7a8ff' },
    light: 'radial-gradient(90% 80% at 30% 20%, rgba(150,100,255,0.28), rgba(10,5,36,0) 60%)',
    particles: { kind: 'star', colors: ['#ffffff', '#b9a8ff', '#8ec5ff', '#ffd6f0'], count: 70, speed: 4 },
    far: (rng) => {
      const out = [
        { ax: 0.7, cx: 0.2, s: 1, anim: 'mb-spin-slow', html: planet(56, '#ffd27a', '#d8891f', '#c9a6ff') },
        { ax: 0.2, cx: 0.32, s: 0.8, html: planet(40, '#9ad0ff', '#3a6fb0') },
        { ax: 0.45, cx: 0.28, s: 1, anim: 'mb-glow', html: nebula(360) },
      ];
      return out;
    },
    mid: (rng) => {
      const out = [];
      for (let i = 0; i < 5; i++) out.push({ ax: 0.08 + i * 0.2 + (rng() - 0.5) * 0.05, cx: 0.82, s: 0.7 + rng() * 0.6, anim: 'mb-float', delay: -rng() * 4, html: asteroid(130, '#4a3a72', '#241542') });
      for (let i = 0; i < 3; i++) out.push({ ax: rng(), cx: 0.55, s: 0.6, anim: 'mb-float', delay: -rng() * 5, html: asteroid(90, '#5a4a88', '#2c1c52') });
      return out;
    },
    near: (rng) => {
      const out = [];
      for (let i = 0; i < 6; i++) out.push({ ax: rng(), cx: 0.99, s: 0.5 + rng() * 0.5, anim: 'mb-float', delay: -rng() * 4, html: crystal(90, '#e6d6ff', '#8a6ad4', 'rgba(150,110,255,0.7)') });
      return out;
    },
  },

  /* 5 — PRISM REALM : rainbow crystal dream, aurora, light orbs */
  5: {
    id: 5, name: 'Prism Realm', icon: '✨',
    sky: ['#4a2a7a', '#8a4fb8', '#e07ac0'],
    ground: ['#b98ad8', '#8a5ab0', '#5f3a80'],
    path: { fill: '#e8d6ff', edge: '#c79bff', dash: '#ffffff' },
    node: { c1: '#ffffff', c2: '#c79bff', c3: '#8a5ab0', ring: '#ffd6f5' },
    light: 'radial-gradient(120% 90% at 50% 10%, rgba(255,220,255,0.4), rgba(90,40,120,0) 60%)',
    particles: { kind: 'sparkle', colors: ['#ff9ecf', '#ffe58a', '#8affc4', '#8ecbff', '#c79bff'], count: 46, speed: 12 },
    far: (rng) => {
      const out = [{ ax: 0.5, cx: 0.28, s: 1, anim: 'mb-aurora', html: `<div class="mb-aurora"></div>` }];
      for (let i = 0; i < 3; i++) out.push({ ax: 0.2 + i * 0.3, cx: 0.42, s: 0.8 + rng() * 0.4, anim: 'mb-float', delay: -rng() * 5, html: floatIsle(240, '#c79bff', '#7a4fa8') });
      return out;
    },
    mid: (rng) => {
      const out = [];
      for (let i = 0; i < 7; i++) out.push({ ax: 0.05 + i * 0.14 + (rng() - 0.5) * 0.05, cx: 0.84, s: 0.6 + rng() * 0.7, anim: 'mb-glow', delay: -rng() * 3, html: prism(150) });
      return out;
    },
    near: (rng) => {
      const out = [];
      for (let i = 0; i < 6; i++) out.push({ ax: rng(), cx: 0.99, s: 0.4 + rng() * 0.5, anim: 'mb-glow', delay: -rng() * 3, html: prism(90) });
      for (let i = 0; i < 4; i++) out.push({ ax: rng(), cx: 0.5, s: 0.5, anim: 'mb-float', delay: -rng() * 4, html: S(24, 24, `<circle cx="12" cy="12" r="8" fill="#fff" opacity="0.8"/><circle cx="12" cy="12" r="12" fill="#fff" opacity="0.25"/>`) });
      return out;
    },
  },
};

/* ---------- more art used above ---------- */
function grassTuft(c1, c2) {
  return S(50, 34, `<g fill="${c1}" stroke="${c2}" stroke-width="1.5">
    <path d="M25 34 Q18 14 10 6 Q22 16 25 34Z"/>
    <path d="M25 34 Q25 10 25 2 Q30 16 25 34Z"/>
    <path d="M25 34 Q32 14 40 6 Q28 16 25 34Z"/></g>`);
}
function stalactite(h, c1, c2) {
  const w = h * 0.4;
  return S(w, h, `<path d="M0 0 L${w} 0 L${w * 0.5} ${h} Z" fill="url(#st)"/>
    <defs><linearGradient id="st" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>`);
}
function lavaRock(w) {
  const h = w * 0.7;
  return S(w, h, `
    <ellipse cx="${w * 0.5}" cy="${h * 0.8}" rx="${w * 0.6}" ry="${h * 0.3}" fill="rgba(255,90,20,0.5)" opacity="0.6"/>
    <path d="M2 ${h} Q0 ${h * 0.4} ${w * 0.3} ${h * 0.3} Q${w * 0.5} ${h * 0.1} ${w * 0.7} ${h * 0.32} Q${w} ${h * 0.4} ${w - 2} ${h} Z" fill="#2a1810"/>
    <path d="M${w * 0.3} ${h} Q${w * 0.35} ${h * 0.6} ${w * 0.5} ${h * 0.55}" stroke="#ff6a2e" stroke-width="3" fill="none"/>
    <path d="M${w * 0.6} ${h} Q${w * 0.62} ${h * 0.7} ${w * 0.72} ${h * 0.62}" stroke="#ffb04d" stroke-width="2.5" fill="none"/>`);
}
function asteroid(w, c1, c2) {
  const h = w * 0.6;
  return S(w, h, `<ellipse cx="${w * 0.5}" cy="${h * 0.55}" rx="${w * 0.48}" ry="${h * 0.4}" fill="url(#ag)"/>
    <ellipse cx="${w * 0.5}" cy="${h * 0.42}" rx="${w * 0.42}" ry="${h * 0.24}" fill="rgba(255,255,255,0.12)"/>
    <circle cx="${w * 0.35}" cy="${h * 0.55}" r="${w * 0.06}" fill="rgba(0,0,0,0.2)"/>
    <circle cx="${w * 0.62}" cy="${h * 0.62}" r="${w * 0.05}" fill="rgba(0,0,0,0.2)"/>
    <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>`);
}
function nebula(w) {
  const h = w * 0.6;
  return `<div class="mb-nebula" style="width:${w}px;height:${h}px"></div>`;
}
