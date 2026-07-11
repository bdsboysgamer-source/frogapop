// SVG scenery for the level-select island trail. Everything here is a
// real drawn asset (no emoji), in the warm tropical style.

const S = (w, h, inner, vb) =>
  `<svg width="${w}" height="${h}" viewBox="${vb || `0 0 ${w} ${h}`}" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;overflow:visible">${inner}</svg>`;

/* ---------- palm tree ---------- */
export function palm(h = 150) {
  return S(h * 0.9, h, `
    <path d="M50 96 Q44 60 52 30" stroke="#8a5a30" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M50 96 Q44 60 52 30" stroke="#a5713f" stroke-width="3" fill="none" stroke-linecap="round" stroke-dasharray="3 7"/>
    <g fill="#3fae4c" stroke="#2c8a3e" stroke-width="2.4">
      <path d="M52 30 Q22 16 6 30 Q28 36 52 30Z"/>
      <path d="M52 30 Q82 16 98 30 Q76 38 52 30Z"/>
      <path d="M52 30 Q30 4 10 8 Q32 26 52 30Z"/>
      <path d="M52 30 Q74 4 94 8 Q72 26 52 30Z"/>
      <path d="M52 30 Q52 0 44 -4 Q60 8 52 30Z"/>
    </g>
    <circle cx="46" cy="36" r="5" fill="#ffc53d" stroke="#c98a00" stroke-width="1.6"/>
    <circle cx="57" cy="38" r="4.2" fill="#ffc53d" stroke="#c98a00" stroke-width="1.6"/>`, '-4 -6 104 104');
}

/* ---------- tiki / beach hut (world marker) ---------- */
export function hut(w = 130, accent = '#ff7e5f') {
  const h = w * 0.92;
  return S(w, h, `
    <rect x="${w * 0.22}" y="${h * 0.5}" width="${w * 0.56}" height="${h * 0.46}" fill="#d9a86a" stroke="#8a5a30" stroke-width="2"/>
    <rect x="${w * 0.22}" y="${h * 0.5}" width="${w * 0.56}" height="${h * 0.46}" fill="url(#bamboo)"/>
    <path d="M${w * 0.5} ${h * 0.06} L${w * 0.06} ${h * 0.52} L${w * 0.94} ${h * 0.52} Z" fill="${accent}" stroke="#b2452c" stroke-width="2" stroke-linejoin="round"/>
    <path d="M${w * 0.5} ${h * 0.22} L${w * 0.2} ${h * 0.52} L${w * 0.8} ${h * 0.52} Z" fill="#ffd9a0" opacity="0.35"/>
    <rect x="${w * 0.4}" y="${h * 0.62} " width="${w * 0.2}" height="${h * 0.34}" fill="#5c3a1e"/>
    <defs><pattern id="bamboo" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 0 V8" stroke="#8a5a30" stroke-width="1" opacity="0.4"/></pattern></defs>`);
}

/* ---------- wooden signpost (world name) ---------- */
export function signpost(label, accent = '#3fae4c') {
  const w = Math.max(150, label.length * 13 + 60);
  return S(w, 96, `
    <rect x="${w / 2 - 6}" y="40" width="12" height="54" rx="3" fill="#8a5a30"/>
    <rect x="${w / 2 - 6}" y="40" width="12" height="54" rx="3" fill="url(#grain)"/>
    <g>
      <rect x="8" y="8" width="${w - 16}" height="40" rx="8" fill="#c78a4a" stroke="#7a4a1e" stroke-width="3"/>
      <rect x="8" y="8" width="${w - 16}" height="40" rx="8" fill="url(#grain)"/>
      <rect x="8" y="8" width="${w - 16}" height="8" rx="8" fill="#e0b072" opacity="0.6"/>
      <circle cx="18" cy="28" r="2.4" fill="#7a4a1e"/><circle cx="${w - 18}" cy="28" r="2.4" fill="#7a4a1e"/>
      <text x="${w / 2}" y="35" font-family="Lilita One, sans-serif" font-size="19" fill="#fff5e0" text-anchor="middle" stroke="#7a4a1e" stroke-width="0.6" paint-order="stroke">${escapeXML(label)}</text>
    </g>
    <circle cx="${w / 2}" cy="46" r="4" fill="${accent}"/>
    <defs><pattern id="grain" width="20" height="6" patternUnits="userSpaceOnUse"><path d="M0 3 H20" stroke="#7a4a1e" stroke-width="0.7" opacity="0.25"/></pattern></defs>`);
}

/* ---------- little decorations ---------- */
export function shell(size = 34, c = '#ff9ec8') {
  return S(size, size, `
    <path d="M12 22 Q2 18 5 8 Q12 2 19 8 Q22 18 12 22Z" fill="${c}" stroke="#d76fa0" stroke-width="1.2"/>
    <path d="M12 21 V7 M8 20 Q7 13 10 7 M16 20 Q17 13 14 7" stroke="#d76fa0" stroke-width="1" fill="none"/>`, 24);
}
export function starfish(size = 34, c = '#ffb03a') {
  return S(size, size, `<path d="M12 2 L14.6 8.5 L21.5 9 L16 13.6 L18 20.5 L12 16.5 L6 20.5 L8 13.6 L2.5 9 L9.4 8.5Z" fill="${c}" stroke="#e08a12" stroke-width="1.2" stroke-linejoin="round"/><circle cx="12" cy="12" r="1.4" fill="#e08a12"/>`, 24);
}
export function rock(size = 40) {
  return S(size, size * 0.7, `<path d="M2 20 Q1 10 8 8 Q13 3 19 8 Q26 9 26 20 Z" fill="#9aa7ad" stroke="#6f7d84" stroke-width="1.4" stroke-linejoin="round"/><path d="M8 8 Q13 12 19 8" stroke="#b7c2c7" stroke-width="1.2" fill="none"/>`, 28);
}
export function grass(size = 40) {
  return S(size, size * 0.7, `<g fill="#54c157" stroke="#2f8f3e" stroke-width="1.2"><path d="M14 20 Q9 8 5 3 Q13 10 14 20Z"/><path d="M14 20 Q14 6 14 1 Q19 10 14 20Z"/><path d="M14 20 Q19 8 23 3 Q15 10 14 20Z"/></g>`, 28);
}
export function boat(w = 90) {
  const h = w * 0.7;
  return S(w, h, `
    <path d="M${w * 0.5} ${h * 0.1} L${w * 0.5} ${h * 0.6}" stroke="#7a4a1e" stroke-width="2.4"/>
    <path d="M${w * 0.5} ${h * 0.12} L${w * 0.82} ${h * 0.5} L${w * 0.5} ${h * 0.5} Z" fill="#ff7e5f"/>
    <path d="M${w * 0.5} ${h * 0.2} L${w * 0.28} ${h * 0.5} L${w * 0.5} ${h * 0.5} Z" fill="#4fc7ff"/>
    <path d="M${w * 0.12} ${h * 0.55} H${w * 0.88} L${w * 0.76} ${h * 0.82} H${w * 0.24} Z" fill="#c78a4a" stroke="#7a4a1e" stroke-width="2" stroke-linejoin="round"/>`);
}
export function cloud(scale = 1) { return `<div class="ls-cloud" style="transform:scale(${scale})"></div>`; }

/* ---------- level node face (SVG, sits inside a button) ---------- */
export function nodeStars(n, unlocked) {
  if (!unlocked) return '';
  const star = (on) => `<path d="M9 1.5 L11 6 L16 6.4 L12.2 9.6 L13.4 14.5 L9 11.8 L4.6 14.5 L5.8 9.6 L2 6.4 L7 6Z" fill="${on ? '#ffcf3f' : 'rgba(60,40,15,0.28)'}" stroke="${on ? '#c9820c' : 'none'}" stroke-width="0.8" stroke-linejoin="round"/>`;
  return `<svg class="node-stars-svg" width="54" height="18" viewBox="0 0 54 18" fill="none">
    <g transform="translate(1,2)">${star(n >= 1)}</g>
    <g transform="translate(18,0)">${star(n >= 2)}</g>
    <g transform="translate(35,2)">${star(n >= 3)}</g>
  </svg>`;
}

function escapeXML(s) { return String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }
