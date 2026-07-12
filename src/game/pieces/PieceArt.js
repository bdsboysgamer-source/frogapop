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

  drawDecoBehind(ctx, cx, cy, rx, ry, t);
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
  drawDecoFront(ctx, cx, cy, rx, ry, t);
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
  if (mood === 'sleepy') {
    ctx.strokeStyle = '#3a2410';
    ctx.lineWidth = 2.6;
    ctx.lineCap = 'round';
    for (const s of [-1, 1]) {
      const ex = cx + s * eyeDX;
      ctx.beginPath();
      ctx.arc(ex, eyeY - 2, 7, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
    }
  } else {
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

/* ==========================================================
   Per-species accessories — a unique silhouette + emblem for
   every pineapple so no two are hard to tell apart.
   ========================================================== */

// small reusable primitives ---------------------------------
function flame(ctx, x, y, w, h, c1, c2) {
  const g = ctx.createLinearGradient(x, y, x, y - h);
  g.addColorStop(0, c2); g.addColorStop(0.55, c1); g.addColorStop(1, '#fff3b0');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(x - w, y);
  ctx.quadraticCurveTo(x - w * 0.7, y - h * 0.6, x - w * 0.2, y - h * 0.75);
  ctx.quadraticCurveTo(x + w * 0.2, y - h, x, y - h);
  ctx.quadraticCurveTo(x + w * 0.1, y - h * 0.7, x + w * 0.6, y - h * 0.55);
  ctx.quadraticCurveTo(x + w, y - h * 0.4, x + w, y);
  ctx.quadraticCurveTo(x, y + h * 0.16, x - w, y);
  ctx.fill();
}
function twinkle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - r * 2); ctx.quadraticCurveTo(x, y, x + r * 2, y);
  ctx.quadraticCurveTo(x, y, x, y + r * 2); ctx.quadraticCurveTo(x, y, x - r * 2, y);
  ctx.quadraticCurveTo(x, y, x, y - r * 2); ctx.fill();
}
function shinyDot(ctx, x, y, r, color, edge) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = color; ctx.fill();
  if (edge) { ctx.strokeStyle = edge; ctx.lineWidth = 1; ctx.stroke(); }
  ctx.beginPath(); ctx.arc(x - r * 0.32, y - r * 0.34, r * 0.34, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.fill();
}
function gemShape(ctx, x, y, w, h, c1, c2) {
  ctx.beginPath();
  ctx.moveTo(x, y - h); ctx.lineTo(x + w, y - h * 0.3); ctx.lineTo(x + w * 0.55, y + h);
  ctx.lineTo(x - w * 0.55, y + h); ctx.lineTo(x - w, y - h * 0.3); ctx.closePath();
  const g = ctx.createLinearGradient(x - w, y - h, x + w, y + h);
  g.addColorStop(0, '#ffffff'); g.addColorStop(0.5, c1); g.addColorStop(1, c2);
  ctx.fillStyle = g; ctx.fill();
  ctx.strokeStyle = c2; ctx.lineWidth = 1.4; ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x, y - h); ctx.lineTo(x, y + h); ctx.moveTo(x - w, y - h * 0.3); ctx.lineTo(x + w, y - h * 0.3); ctx.stroke();
}

function drawDecoBehind(ctx, cx, cy, rx, ry, t) {
  switch (t.deco) {
    case 'sunburst': {                 // nova — radiant rays
      ctx.save(); ctx.translate(cx, cy - 2);
      for (let i = 0; i < 12; i++) {
        ctx.rotate(Math.PI / 6);
        const g = ctx.createLinearGradient(0, -ry - 4, 0, -ry - 26);
        g.addColorStop(0, 'rgba(255,225,120,0.95)'); g.addColorStop(1, 'rgba(255,190,40,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.moveTo(-5, -ry - 4); ctx.lineTo(0, -ry - 28); ctx.lineTo(5, -ry - 4); ctx.closePath(); ctx.fill();
      }
      ctx.restore(); break;
    }
    case 'aurora': {                   // aurora — northern-light ribbons
      ctx.save(); ctx.globalAlpha = 0.75;
      const cols = ['#8af0b8', '#7ec8ff', '#c79bff'];
      for (let k = 0; k < 3; k++) {
        ctx.strokeStyle = cols[k]; ctx.lineWidth = 6 - k * 1.4; ctx.lineCap = 'round';
        ctx.beginPath();
        for (let x = -42; x <= 42; x += 4) {
          const y = 14 - k * 7 + Math.sin(x / 11 + k * 1.3) * 6;
          if (x === -42) ctx.moveTo(cx + x, y); else ctx.lineTo(cx + x, y);
        }
        ctx.stroke();
      }
      ctx.restore(); break;
    }
    case 'eclipse': {                  // eclipse — glowing corona ring above
      ctx.save();
      const g = ctx.createRadialGradient(cx, 16, 4, cx, 16, 18);
      g.addColorStop(0, 'rgba(255,240,200,0)'); g.addColorStop(0.7, 'rgba(255,220,150,0.85)'); g.addColorStop(1, 'rgba(255,200,120,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, 16, 18, 0, Math.PI * 2); ctx.fill();
      ctx.restore(); break;
    }
    default: break;
  }
}

function drawDecoFront(ctx, cx, cy, rx, ry, t) {
  const topY = cy - ry;   // ≈ 28  (top of the body)
  ctx.save();
  switch (t.deco) {
    case 'crown': {                    // golden — royal crown
      const y = 14, w = 26;
      ctx.beginPath();
      ctx.moveTo(cx - w, y + 10); ctx.lineTo(cx - w, y + 2);
      ctx.lineTo(cx - w * 0.5, y + 8); ctx.lineTo(cx, y - 4);
      ctx.lineTo(cx + w * 0.5, y + 8); ctx.lineTo(cx + w, y + 2);
      ctx.lineTo(cx + w, y + 10); ctx.closePath();
      const g = ctx.createLinearGradient(0, y - 4, 0, y + 12);
      g.addColorStop(0, '#fff0a8'); g.addColorStop(0.5, '#ffcf3f'); g.addColorStop(1, '#e08a00');
      ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = '#b56a00'; ctx.stroke();
      for (const [dx, c] of [[-w * 0.5, '#ff5e7e'], [0, '#5ec8ff'], [w * 0.5, '#7ee081']]) shinyDot(ctx, cx + dx, y + 5, 2.6, c);
      break;
    }
    case 'bow': {                      // pink — ribbon bow + heart
      const y = 18;
      ctx.fillStyle = '#ff4f95'; ctx.strokeStyle = '#c93a78'; ctx.lineWidth = 1.6;
      for (const s of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(cx, y); ctx.quadraticCurveTo(cx + s * 20, y - 11, cx + s * 18, y);
        ctx.quadraticCurveTo(cx + s * 20, y + 11, cx, y); ctx.fill(); ctx.stroke();
      }
      shinyDot(ctx, cx, y, 4, '#ff7fb0', '#c93a78');
      ctx.fillStyle = colorWithAlpha('#ff4f95', 0.9);
      ctx.beginPath(); ctx.moveTo(cx, cy - 20); ctx.bezierCurveTo(cx - 7, cy - 27, cx - 10, cy - 18, cx, cy - 13); ctx.bezierCurveTo(cx + 10, cy - 18, cx + 7, cy - 27, cx, cy - 20); ctx.fill();
      break;
    }
    case 'beanie': {                   // ice — knit winter cap
      ctx.fillStyle = '#2f96cf';
      ctx.beginPath(); ctx.moveTo(cx - 26, 22); ctx.quadraticCurveTo(cx, -8, cx + 26, 22); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 1.4;
      for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(cx + i * 7, 22); ctx.quadraticCurveTo(cx + i * 7, 4, cx + i * 3, -3); ctx.stroke(); }
      ctx.fillStyle = '#eaf8ff';
      ctx.beginPath(); ctx.moveTo(cx - 27, 18); ctx.quadraticCurveTo(cx, 30, cx + 27, 18); ctx.lineTo(cx + 27, 24); ctx.quadraticCurveTo(cx, 36, cx - 27, 24); ctx.closePath(); ctx.fill();
      shinyDot(ctx, cx, -2, 5, '#eaf8ff', '#9cd4ee');
      break;
    }
    case 'mohawk': {                   // fire — flame mohawk
      flame(ctx, cx - 12, 26, 6, 20, '#ff7a2e', '#ff4d2e');
      flame(ctx, cx, 22, 8, 30, '#ffab2e', '#ff5a1e');
      flame(ctx, cx + 12, 26, 6, 20, '#ff7a2e', '#ff4d2e');
      break;
    }
    case 'flower': {                   // jungle — hibiscus flower
      const fx = cx + 20, fy = 18;
      ctx.fillStyle = '#ff5470'; ctx.strokeStyle = '#d13a55'; ctx.lineWidth = 1.2;
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath(); ctx.ellipse(fx + Math.cos(a) * 6, fy + Math.sin(a) * 6, 5.5, 4, a, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }
      shinyDot(ctx, fx, fy, 3.6, '#ffd24d', '#e0a400');
      break;
    }
    case 'gemspike': {                 // crystal — clear crystal spike + diamond
      gemShape(ctx, cx, 10, 8, 16, '#bfe6ff', '#5aa0d0');
      gemShape(ctx, cx, cy - 22, 5, 6, '#dff2ff', '#7fb8e0');
      break;
    }
    case 'earmuffs': {                 // frost — fuzzy earmuffs
      ctx.strokeStyle = '#eaf8ff'; ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(cx, 30, 30, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      for (const s of [-1, 1]) shinyDot(ctx, cx + s * 27, 26, 8, '#dff2ff', '#a8d8ea');
      break;
    }
    case 'pearls': {                   // pearl — pearl necklace + forehead pearl
      ctx.save();
      for (let i = -3; i <= 3; i++) shinyDot(ctx, cx + i * 8, cy + ry - 12 + Math.abs(i) * 1.6, 3.4, '#fff6ff', '#d3b6c8');
      ctx.restore();
      shinyDot(ctx, cx, cy - 22, 4, '#fff8ff', '#d3b6c8');
      break;
    }
    case 'bubbles': {                  // aqua — floating bubbles + water drop
      for (const [bx, by, r] of [[cx - 30, cy - 18, 5], [cx + 30, cy - 6, 4], [cx + 26, cy + 22, 3.2], [cx - 26, cy + 20, 3.6]]) {
        ctx.beginPath(); ctx.arc(bx, by, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 1.6; ctx.stroke();
        ctx.beginPath(); ctx.arc(bx - r * 0.3, by - r * 0.3, r * 0.28, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.fill();
      }
      ctx.fillStyle = '#eaffff';
      ctx.beginPath(); ctx.moveTo(cx, cy - 26); ctx.quadraticCurveTo(cx + 6, cy - 18, cx, cy - 14); ctx.quadraticCurveTo(cx - 6, cy - 18, cx, cy - 26); ctx.fill();
      break;
    }
    case 'angler': {                   // abyss — anglerfish lure
      ctx.strokeStyle = '#2a3a5a'; ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(cx, topY - 2); ctx.quadraticCurveTo(cx - 16, 6, cx - 4, 2); ctx.stroke();
      const g = ctx.createRadialGradient(cx - 4, 2, 0, cx - 4, 2, 10);
      g.addColorStop(0, '#eaffff'); g.addColorStop(0.5, '#9fe8ff'); g.addColorStop(1, 'rgba(120,220,255,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx - 4, 2, 10, 0, Math.PI * 2); ctx.fill();
      shinyDot(ctx, cx - 4, 2, 3.4, '#eaffff', '#7fd4f5');
      break;
    }
    case 'smoke': {                    // ember — rising smoke wisps
      ctx.strokeStyle = 'rgba(120,110,105,0.7)'; ctx.lineWidth = 4; ctx.lineCap = 'round';
      for (const dx of [-10, 6]) {
        ctx.beginPath(); ctx.moveTo(cx + dx, topY - 2);
        ctx.bezierCurveTo(cx + dx - 8, 16, cx + dx + 8, 10, cx + dx, 0); ctx.stroke();
      }
      break;
    }
    case 'safari': {                   // wild — explorer headband + tusk + stripes
      ctx.fillStyle = '#a0552a'; ctx.strokeStyle = '#6e3a18'; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(cx - 26, 30); ctx.quadraticCurveTo(cx, 20, cx + 26, 30); ctx.lineTo(cx + 26, 36); ctx.quadraticCurveTo(cx, 26, cx - 26, 36); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#c26a2a';
      ctx.beginPath(); ctx.moveTo(cx - 26, 33); ctx.lineTo(cx - 36, 28); ctx.lineTo(cx - 30, 40); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(90,50,20,0.6)'; ctx.lineWidth = 2.4;
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(cx + s * 22, cy - 2); ctx.lineTo(cx + s * 28, cy + 4); ctx.stroke(); }
      break;
    }
    case 'chili': {                    // spice — chili pepper hat + sweat drop
      ctx.fillStyle = '#2e8b3f'; ctx.lineWidth = 2; ctx.strokeStyle = '#1c6330';
      ctx.beginPath(); ctx.moveTo(cx, 8); ctx.lineTo(cx, 16); ctx.stroke();
      const g = ctx.createLinearGradient(cx - 8, 14, cx + 14, 30);
      g.addColorStop(0, '#ff5a4a'); g.addColorStop(1, '#c01818');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(cx - 6, 16); ctx.quadraticCurveTo(cx + 20, 14, cx + 14, 34); ctx.quadraticCurveTo(cx + 6, 24, cx - 6, 16); ctx.fill();
      ctx.fillStyle = '#9fe8ff';
      ctx.beginPath(); ctx.moveTo(cx + 24, cy - 14); ctx.quadraticCurveTo(cx + 29, cy - 8, cx + 24, cy - 5); ctx.quadraticCurveTo(cx + 19, cy - 8, cx + 24, cy - 14); ctx.fill();
      break;
    }
    case 'thorns': {                   // thorn — spikes around the body
      ctx.fillStyle = shade(t.bodyDark, -30); ctx.strokeStyle = shade(t.bodyDark, -50); ctx.lineWidth = 1;
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + (i / 10) * Math.PI * 2;
        const ex = cx + Math.cos(a) * rx, ey = cy + Math.sin(a) * ry;
        const tx = cx + Math.cos(a) * (rx + 9), ty = cy + Math.sin(a) * (ry + 9);
        const px = -Math.sin(a) * 4, py = Math.cos(a) * 4;
        ctx.beginPath(); ctx.moveTo(ex + px, ey + py); ctx.lineTo(tx, ty); ctx.lineTo(ex - px, ey - py); ctx.closePath(); ctx.fill(); ctx.stroke();
      }
      break;
    }
    case 'flamecrown': {               // blaze — ring of flames
      flame(ctx, cx - 20, 30, 5, 16, '#ffb02e', '#ff6a1e');
      flame(ctx, cx - 10, 26, 6, 24, '#ffc23e', '#ff7a1e');
      flame(ctx, cx, 22, 7, 30, '#ffd24d', '#ff8a1e');
      flame(ctx, cx + 10, 26, 6, 24, '#ffc23e', '#ff7a1e');
      flame(ctx, cx + 20, 30, 5, 16, '#ffb02e', '#ff6a1e');
      break;
    }
    case 'planet': {                   // cosmic — ringed planet antenna
      ctx.strokeStyle = '#c4a6ff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, topY); ctx.lineTo(cx, 16); ctx.stroke();
      shinyDot(ctx, cx, 12, 6, '#d8b0ff', '#8a5ad0');
      ctx.strokeStyle = '#ffd24d'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(cx, 12, 11, 4, -0.35, 0, Math.PI * 2); ctx.stroke();
      twinkle(ctx, cx - 24, cy - 16, 2.4, '#fff');
      twinkle(ctx, cx + 24, cy + 8, 2, '#ffd6ff');
      break;
    }
    case 'shootingstar': {             // stellar — shooting star with trail
      ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(cx - 22, 24); ctx.quadraticCurveTo(cx - 6, 8, cx + 12, 8); ctx.stroke();
      ctx.fillStyle = '#fff6b0'; drawStar(ctx, cx + 14, 8, 7);
      ctx.fillStyle = '#a6c8ff'; twinkle(ctx, cx - 24, cy + 6, 2.4, '#cfe0ff');
      break;
    }
    case 'nightcap': {                 // lunar — sleeping cap + crescent moon
      const g = ctx.createLinearGradient(cx - 20, 0, cx + 24, 24);
      g.addColorStop(0, '#b6bad4'); g.addColorStop(1, '#8083a0');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(cx - 22, 26); ctx.quadraticCurveTo(cx - 10, 2, cx + 6, 6); ctx.quadraticCurveTo(cx + 30, 10, cx + 26, -6); ctx.quadraticCurveTo(cx + 20, 18, cx + 20, 26); ctx.closePath(); ctx.fill();
      shinyDot(ctx, cx + 27, -7, 5, '#eef0ff', '#b6bad4');
      ctx.fillStyle = '#ffe98a';
      ctx.beginPath(); ctx.arc(cx, cy - 21, 5.5, Math.PI * 0.35, Math.PI * 1.65); ctx.arc(cx + 2.6, cy - 21, 4.4, Math.PI * 1.55, Math.PI * 0.45, true); ctx.fill();
      break;
    }
    case 'eclipse': {                  // eclipse — dark disc emblem
      ctx.fillStyle = '#1b1330';
      ctx.beginPath(); ctx.arc(cx, cy - 20, 7, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#c9a6ff'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(cx, cy - 20, 8.4, 0, Math.PI * 2); ctx.stroke();
      break;
    }
    case 'prism': {                    // prism — glass prism casting a rainbow
      gemShape(ctx, cx, 12, 9, 12, '#ffffff', '#cdd6ff');
      const rc = ['#ff5e7e', '#ffd24d', '#7ee081', '#5ec8ff'];
      for (let i = 0; i < rc.length; i++) { ctx.strokeStyle = rc[i]; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(cx + 8, 12); ctx.lineTo(cx + 22, 6 + i * 3.4); ctx.stroke(); }
      break;
    }
    case 'sparkles': {                 // shimmer — scattered twinkles + star
      for (const [sx, sy, r] of [[cx - 28, cy - 20, 3.4], [cx + 28, cy - 10, 2.6], [cx + 22, cy + 24, 3], [cx - 22, cy + 22, 2.4], [cx, topY - 4, 3.6]]) twinkle(ctx, sx, sy, r, '#fff');
      ctx.fillStyle = '#fff0ff'; drawStar(ctx, cx, cy - 22, 5);
      break;
    }
    case 'sunglasses': {               // gleam — cool shades
      ctx.fillStyle = '#26303a';
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(cx + s * 15, cy - 8, 11, 8.5, 0, 0, Math.PI * 2); ctx.fill(); }
      ctx.strokeStyle = '#26303a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - 5, cy - 9); ctx.lineTo(cx + 5, cy - 9); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 2; ctx.lineCap = 'round';
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(cx + s * 15 - 4, cy - 11); ctx.lineTo(cx + s * 15 + 1, cy - 6); ctx.stroke(); }
      break;
    }
    case 'aurora': {                   // aurora — small star cluster on brow
      twinkle(ctx, cx, cy - 22, 3.4, '#eaffff');
      twinkle(ctx, cx - 22, cy + 2, 2.2, '#c8ffe0');
      twinkle(ctx, cx + 22, cy - 2, 2.2, '#c8f0ff');
      break;
    }
    case 'tiara': {                    // glimmer — jewelled tiara + glitter
      const y = cy - 24;
      ctx.strokeStyle = '#ffd24d'; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.moveTo(cx - 20, y + 6); ctx.quadraticCurveTo(cx, y - 8, cx + 20, y + 6); ctx.stroke();
      gemShape(ctx, cx, y - 4, 4, 5, '#d8ecff', '#7fb8e0');
      shinyDot(ctx, cx - 12, y + 2, 2.4, '#ff9ecf', '#d76fa0');
      shinyDot(ctx, cx + 12, y + 2, 2.4, '#8affc4', '#40c080');
      twinkle(ctx, cx - 26, cy + 8, 2.4, '#fff'); twinkle(ctx, cx + 26, cy + 6, 2, '#fff');
      break;
    }
    default: break;
  }
  ctx.restore();
}
