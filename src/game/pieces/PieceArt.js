// Procedural pineapple art. Every species is drawn as a cute character:
// gradient body, diamond lattice, leafy crown, and an expressive face.
// Pieces are rendered once into offscreen canvases (2x res) and cached.

import { PIECE_TYPES } from '../../data/pieceTypes.js';

const CACHE = new Map();
const BASE = 128; // logical size of a cached piece
const DPR = 2;

export function getPieceSprite(typeId, specialId = null) {
  const key = `${typeId}|${specialId ?? ''}`;
  if (CACHE.has(key)) return CACHE.get(key);
  const cv = document.createElement('canvas');
  cv.width = cv.height = BASE * DPR;
  const ctx = cv.getContext('2d');
  ctx.scale(DPR, DPR);
  if (specialId === 'rainbow') drawRainbow(ctx);
  else if (specialId === 'bomb') drawBomb(ctx, typeId);
  else if (specialId === 'rocketH' || specialId === 'rocketV') drawRocket(ctx, typeId, specialId === 'rocketV');
  else drawPineapple(ctx, PIECE_TYPES[typeId]);
  CACHE.set(key, cv);
  return cv;
}

/* ----------------------------------------------------------
   Core pineapple drawing
   ---------------------------------------------------------- */
function drawPineapple(ctx, t, opts = {}) {
  const cx = 64, cy = 74, rx = 40, ry = 46;

  if (t.glow) {
    const g = ctx.createRadialGradient(cx, cy, 10, cx, cy, 62);
    g.addColorStop(0, t.glow);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
  }

  drawLeafCrown(ctx, cx, 24, t);

  // body
  const grad = ctx.createLinearGradient(0, cy - ry, 0, cy + ry);
  grad.addColorStop(0, t.bodyLight);
  grad.addColorStop(0.45, t.body);
  grad.addColorStop(1, t.bodyDark);
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = shade(t.bodyDark, -18);
  ctx.stroke();

  // diamond lattice, clipped to body
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx - 1.5, ry - 1.5, 0, 0, Math.PI * 2);
  ctx.clip();
  ctx.strokeStyle = colorWithAlpha(t.bodyDark, 0.4);
  ctx.lineWidth = 2.2;
  for (let i = -6; i <= 6; i++) {
    ctx.beginPath();
    ctx.moveTo(cx + i * 14 - 40, cy - ry);
    ctx.lineTo(cx + i * 14 + 40, cy + ry);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + i * 14 + 40, cy - ry);
    ctx.lineTo(cx + i * 14 - 40, cy + ry);
    ctx.stroke();
  }
  // lattice dots
  ctx.fillStyle = colorWithAlpha(t.bodyLight, 0.55);
  for (let gy = 0; gy < 7; gy++) {
    for (let gx = 0; gx < 6; gx++) {
      const px = cx - 35 + gx * 14 + (gy % 2 ? 7 : 0);
      const py = cy - ry + 8 + gy * 13;
      ctx.beginPath();
      ctx.arc(px, py, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // top sheen
  const sheen = ctx.createRadialGradient(cx - 14, cy - 26, 2, cx - 14, cy - 26, 34);
  sheen.addColorStop(0, 'rgba(255,255,255,0.5)');
  sheen.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, 128, 128);
  ctx.restore();

  if (t.crystal) drawFrost(ctx, cx, cy, rx, ry);
  if (t.embers) drawEmbers(ctx, cx, cy, rx, ry);

  drawFace(ctx, cx, cy + 2, t, opts.mood ?? t.mood);
}

function drawLeafCrown(ctx, cx, topY, t) {
  const leaves = [
    { dx: 0, h: 38, w: 13, rot: 0 },
    { dx: -13, h: 33, w: 12, rot: -0.42 },
    { dx: 13, h: 33, w: 12, rot: 0.42 },
    { dx: -23, h: 25, w: 10, rot: -0.8 },
    { dx: 23, h: 25, w: 10, rot: 0.8 },
  ];
  for (const L of leaves) {
    ctx.save();
    ctx.translate(cx + L.dx, topY + 12);
    ctx.rotate(L.rot);
    const g = ctx.createLinearGradient(0, -L.h, 0, 0);
    g.addColorStop(0, t.leaf);
    g.addColorStop(1, t.leafDark);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, 2);
    ctx.quadraticCurveTo(-L.w, -L.h * 0.55, 0, -L.h);
    ctx.quadraticCurveTo(L.w, -L.h * 0.55, 0, 2);
    ctx.fill();
    ctx.lineWidth = 2.4;
    ctx.strokeStyle = shade(t.leafDark, -14);
    ctx.stroke();
    ctx.restore();
  }
}

function drawFace(ctx, cx, cy, t, mood) {
  const eyeY = cy - 8;
  const eyeDX = 15;
  // eyes
  for (const s of [-1, 1]) {
    const ex = cx + s * eyeDX;
    ctx.beginPath();
    ctx.ellipse(ex, eyeY, 8.5, mood === 'cool' ? 6.5 : 9.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(60,30,10,0.5)';
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(ex + 1.5, eyeY + 1, 4.6, 0, Math.PI * 2);
    ctx.fillStyle = '#3a2410';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ex + 3, eyeY - 1, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
  }
  // fierce / cool brows
  ctx.strokeStyle = '#3a2410';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  if (mood === 'fierce') {
    for (const s of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(cx + s * (eyeDX + 8), eyeY - 16);
      ctx.lineTo(cx + s * (eyeDX - 6), eyeY - 11);
      ctx.stroke();
    }
  } else if (mood === 'cool') {
    for (const s of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(cx + s * (eyeDX + 8), eyeY - 12);
      ctx.lineTo(cx + s * (eyeDX - 7), eyeY - 13);
      ctx.stroke();
    }
  }
  // blush
  ctx.fillStyle = colorWithAlpha(t.cheek, 0.5);
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(cx + s * 26, cy + 3, 6, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // mouth
  ctx.strokeStyle = '#3a2410';
  ctx.lineWidth = 3;
  if (mood === 'sweet') {
    ctx.beginPath();
    ctx.arc(cx, cy + 8, 7, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy + 12, 3.4, 0, Math.PI);
    ctx.fillStyle = '#ff7fa8';
    ctx.fill();
  } else if (mood === 'fierce') {
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy + 9);
    ctx.quadraticCurveTo(cx, cy + 15, cx + 8, cy + 9);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 3, cy + 11.5);
    ctx.lineTo(cx + 6, cy + 8);
    ctx.lineTo(cx + 8, cy + 11);
    ctx.fillStyle = '#fff';
    ctx.fill();
  } else if (mood === 'cool') {
    ctx.beginPath();
    ctx.moveTo(cx - 6, cy + 11);
    ctx.quadraticCurveTo(cx + 3, cy + 14, cx + 9, cy + 9);
    ctx.stroke();
  } else if (mood === 'wild') {
    ctx.beginPath();
    ctx.arc(cx, cy + 7, 8.5, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy + 7, 8.5, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.fillStyle = 'rgba(120,40,20,0.85)';
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(cx, cy + 7, 8, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  }
}

function drawFrost(ctx, cx, cy, rx, ry) {
  ctx.save();
  // crystal shards poking from behind bottom
  ctx.fillStyle = 'rgba(220, 245, 255, 0.9)';
  ctx.strokeStyle = 'rgba(90, 170, 220, 0.9)';
  ctx.lineWidth = 2;
  const shards = [ [-26, 30, -8], [-10, 38, 4], [12, 36, -3], [26, 28, 9] ];
  for (const [dx, len, tilt] of shards) {
    ctx.save();
    ctx.translate(cx + dx, cy + ry - 12);
    ctx.rotate((tilt * Math.PI) / 180);
    ctx.beginPath();
    ctx.moveTo(-6, 0);
    ctx.lineTo(0, len * 0.55);
    ctx.lineTo(6, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  // sparkles
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  for (const [sx, sy, r] of [ [cx - 24, cy - 20, 3], [cx + 28, cy - 8, 2.4], [cx + 16, cy + 26, 2.8] ]) {
    drawSparkle(ctx, sx, sy, r);
  }
  ctx.restore();
}

function drawEmbers(ctx, cx, cy, rx, ry) {
  ctx.save();
  const embers = [ [cx - 26, cy + 18, 3.4], [cx + 24, cy + 26, 2.6], [cx + 30, cy - 12, 2.2], [cx - 14, cy + 34, 2.8] ];
  for (const [ex, ey, r] of embers) {
    const g = ctx.createRadialGradient(ex, ey, 0, ex, ey, r * 3);
    g.addColorStop(0, 'rgba(255,240,150,1)');
    g.addColorStop(0.4, 'rgba(255,150,50,0.85)');
    g.addColorStop(1, 'rgba(255,80,20,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(ex, ey, r * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawSparkle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.moveTo(x, y - r * 2);
  ctx.quadraticCurveTo(x, y, x + r * 2, y);
  ctx.quadraticCurveTo(x, y, x, y + r * 2);
  ctx.quadraticCurveTo(x, y, x - r * 2, y);
  ctx.quadraticCurveTo(x, y, x, y - r * 2);
  ctx.fill();
}

/* ----------------------------------------------------------
   Special pieces
   ---------------------------------------------------------- */
function drawRocket(ctx, typeId, vertical) {
  const t = PIECE_TYPES[typeId] ?? PIECE_TYPES.golden;
  ctx.save();
  ctx.translate(64, 64);
  if (vertical) ctx.rotate(Math.PI / 2);
  ctx.translate(-64, -64);

  // speed glow
  const g = ctx.createRadialGradient(64, 64, 8, 64, 64, 60);
  g.addColorStop(0, 'rgba(255,255,255,0.55)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);

  // flame tail
  const flame = ctx.createLinearGradient(6, 0, 52, 0);
  flame.addColorStop(0, 'rgba(255,90,30,0)');
  flame.addColorStop(0.6, '#ffb037');
  flame.addColorStop(1, '#fff3b0');
  ctx.fillStyle = flame;
  ctx.beginPath();
  ctx.moveTo(6, 64);
  ctx.quadraticCurveTo(30, 50, 52, 56);
  ctx.lineTo(52, 72);
  ctx.quadraticCurveTo(30, 78, 6, 64);
  ctx.fill();

  // rocket body (a mini pineapple capsule)
  const grad = ctx.createLinearGradient(0, 40, 0, 90);
  grad.addColorStop(0, t.bodyLight);
  grad.addColorStop(0.5, t.body);
  grad.addColorStop(1, t.bodyDark);
  ctx.beginPath();
  ctx.ellipse(76, 64, 34, 25, 0, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = shade(t.bodyDark, -18);
  ctx.stroke();

  // lattice
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(76, 64, 32.5, 23.5, 0, 0, Math.PI * 2);
  ctx.clip();
  ctx.strokeStyle = colorWithAlpha(t.bodyDark, 0.4);
  ctx.lineWidth = 2;
  for (let i = -5; i <= 5; i++) {
    ctx.beginPath(); ctx.moveTo(76 + i * 12 - 30, 40); ctx.lineTo(76 + i * 12 + 30, 90); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(76 + i * 12 + 30, 40); ctx.lineTo(76 + i * 12 - 30, 90); ctx.stroke();
  }
  ctx.restore();

  // nose cone (leaf crown as the nose)
  ctx.save();
  ctx.translate(108, 64);
  ctx.rotate(Math.PI / 2);
  drawLeafCrownMini(ctx, 0, 0, t);
  ctx.restore();

  // fins
  ctx.fillStyle = t.leafDark;
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(48, 64 + s * 16);
    ctx.lineTo(34, 64 + s * 34);
    ctx.lineTo(56, 64 + s * 22);
    ctx.closePath();
    ctx.fill();
  }

  // porthole face
  ctx.beginPath();
  ctx.arc(80, 62, 12, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.strokeStyle = shade(t.bodyDark, -18);
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = '#3a2410';
  ctx.beginPath(); ctx.arc(77, 60, 2.6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(85, 60, 2.6, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#3a2410';
  ctx.lineWidth = 2.4;
  ctx.beginPath(); ctx.arc(81, 64, 4, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();

  // motion streaks
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  for (const [y, x1, x2] of [ [44, 14, 34], [64, 4, 20], [84, 14, 34] ]) {
    ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
  }
  ctx.restore();
}

function drawLeafCrownMini(ctx, cx, cy, t) {
  for (const [rot, h] of [ [0, 24], [-0.5, 18], [0.5, 18] ]) {
    ctx.save();
    ctx.translate(cx, cy + 6);
    ctx.rotate(rot);
    ctx.fillStyle = t.leaf;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-8, -h * 0.55, 0, -h);
    ctx.quadraticCurveTo(8, -h * 0.55, 0, 0);
    ctx.fill();
    ctx.strokeStyle = shade(t.leafDark, -10);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }
}

function drawBomb(ctx, typeId) {
  const t = PIECE_TYPES[typeId] ?? PIECE_TYPES.fire;
  const cx = 64, cy = 74, r = 40;

  // danger glow
  const halo = ctx.createRadialGradient(cx, cy, 10, cx, cy, 62);
  halo.addColorStop(0, 'rgba(255,120,60,0.5)');
  halo.addColorStop(1, 'rgba(255,120,60,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, 128, 128);

  // fuse
  ctx.strokeStyle = '#8a5a30';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx + 6, cy - r + 4);
  ctx.quadraticCurveTo(cx + 18, cy - r - 14, cx + 34, cy - r - 8);
  ctx.stroke();
  // spark
  const sg = ctx.createRadialGradient(cx + 36, cy - r - 8, 0, cx + 36, cy - r - 8, 12);
  sg.addColorStop(0, '#fff8c0');
  sg.addColorStop(0.5, '#ffb037');
  sg.addColorStop(1, 'rgba(255,120,40,0)');
  ctx.fillStyle = sg;
  ctx.beginPath();
  ctx.arc(cx + 36, cy - r - 8, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  drawSparkle(ctx, cx + 36, cy - r - 8, 3.5);

  // round body tinted by species
  const grad = ctx.createRadialGradient(cx - 12, cy - 14, 6, cx, cy, r + 6);
  grad.addColorStop(0, shade(t.body, 22));
  grad.addColorStop(0.55, shade(t.bodyDark, -8));
  grad.addColorStop(1, shade(t.bodyDark, -38));
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = shade(t.bodyDark, -45);
  ctx.stroke();

  // lattice
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r - 2, 0, Math.PI * 2);
  ctx.clip();
  ctx.strokeStyle = 'rgba(0,0,0,0.28)';
  ctx.lineWidth = 2.2;
  for (let i = -5; i <= 5; i++) {
    ctx.beginPath(); ctx.moveTo(cx + i * 15 - 40, cy - r); ctx.lineTo(cx + i * 15 + 40, cy + r); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + i * 15 + 40, cy - r); ctx.lineTo(cx + i * 15 - 40, cy + r); ctx.stroke();
  }
  ctx.restore();

  // worried face
  ctx.fillStyle = '#fff';
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(cx + s * 14, cy - 6, 8, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#241407';
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(cx + s * 14, cy - 5, 4.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#fff';
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(cx + s * 14 + 1.6, cy - 7, 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = '#241407';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy + 12, 5.5, 1.15 * Math.PI, 1.85 * Math.PI);
  ctx.stroke();

  // countdown ring
  ctx.strokeStyle = 'rgba(255, 210, 90, 0.9)';
  ctx.lineWidth = 3.5;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.arc(cx, cy, r + 7, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawRainbow(ctx) {
  const cx = 64, cy = 74, rx = 40, ry = 46;

  // aura
  const halo = ctx.createRadialGradient(cx, cy, 10, cx, cy, 64);
  halo.addColorStop(0, 'rgba(255,255,255,0.75)');
  halo.addColorStop(0.6, 'rgba(200,160,255,0.35)');
  halo.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, 128, 128);

  drawLeafCrown(ctx, cx, 24, { leaf: '#7ee081', leafDark: '#2c8a3e' });

  // rainbow banded body
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.clip();
  const bands = ['#ff5e7e', '#ff9d4d', '#ffe14d', '#7ee081', '#5ec8ff', '#b48cff'];
  const bandH = (ry * 2) / bands.length;
  bands.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect(cx - rx, cy - ry + i * bandH, rx * 2, bandH + 1);
  });
  // lattice
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 2.2;
  for (let i = -6; i <= 6; i++) {
    ctx.beginPath(); ctx.moveTo(cx + i * 14 - 40, cy - ry); ctx.lineTo(cx + i * 14 + 40, cy + ry); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + i * 14 + 40, cy - ry); ctx.lineTo(cx + i * 14 - 40, cy + ry); ctx.stroke();
  }
  const sheen = ctx.createRadialGradient(cx - 14, cy - 26, 2, cx - 14, cy - 26, 34);
  sheen.addColorStop(0, 'rgba(255,255,255,0.6)');
  sheen.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, 128, 128);
  ctx.restore();

  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = '#7a4fa8';
  ctx.stroke();

  // starry eyes face
  const eyeY = cy - 6;
  ctx.fillStyle = '#fff';
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(cx + s * 15, eyeY, 9, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#5a3d8a';
  for (const s of [-1, 1]) drawStar(ctx, cx + s * 15, eyeY, 5.5);
  ctx.strokeStyle = '#5a3d8a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy + 8, 8, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();

  // orbiting sparkles
  ctx.fillStyle = '#fff';
  drawSparkle(ctx, cx - 34, cy - 24, 3.2);
  drawSparkle(ctx, cx + 36, cy + 4, 2.6);
  drawSparkle(ctx, cx + 24, cy - 34, 2.2);
}

function drawStar(ctx, x, y, r) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

/* ----------------------------------------------------------
   color helpers
   ---------------------------------------------------------- */
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amt));
  const b = Math.max(0, Math.min(255, (n & 0xff) + amt));
  return `rgb(${r},${g},${b})`;
}
function colorWithAlpha(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 0xff},${n & 0xff},${a})`;
}
