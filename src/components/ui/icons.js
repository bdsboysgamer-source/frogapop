// Hand-drawn SVG icon set — replaces every emoji in the UI with a real
// asset drawn in the tropical "beachy" style: warm, rounded, friendly.
//
// Usage: icon('coin', { size: 24 })  → returns an <svg> string.
// Monochrome icons use currentColor so they inherit the surrounding text
// colour; illustrative icons carry their own tropical palette.

const P = {
  gold: '#ffcf3f', goldDeep: '#f0a91e', goldShade: '#c9820c',
  sand: '#ffe6a7', sandDeep: '#e2b45f',
  leaf: '#3fae4c', leafDeep: '#2c8a3e',
  sky: '#4fc7ff', sea: '#1e9de2', seaDeep: '#0f6f9c',
  coral: '#ff7e5f', berry: '#ff5e9c',
  cocoa: '#7a4a1e', cocoaDeep: '#5c3a1e',
  cream: '#fffdf4', white: '#ffffff',
  purple: '#9a7bff',
};

const wrap = (size, inner, vb = 24) =>
  `<svg class="ic" width="${size}" height="${size}" viewBox="0 0 ${vb} ${vb}" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block">${inner}</svg>`;

const ICONS = {
  /* ---- navigation / actions (monochrome, currentColor) ---- */
  back: (s) => wrap(s, `<path d="M15 5 L8 12 L15 19" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`),
  next: (s) => wrap(s, `<path d="M9 5 L16 12 L9 19" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`),
  play: (s) => wrap(s, `<path d="M8 6 L18 12 L8 18 Z" fill="currentColor"/>`),
  pause: (s) => wrap(s, `<rect x="7" y="6" width="3.4" height="12" rx="1.2" fill="currentColor"/><rect x="13.6" y="6" width="3.4" height="12" rx="1.2" fill="currentColor"/>`),
  retry: (s) => wrap(s, `<path d="M6.5 12a5.5 5.5 0 1 0 1.8-4.1" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" fill="none"/><path d="M6 5.5 L7 9 L10.4 8" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`),
  check: (s) => wrap(s, `<path d="M5 12.5 L10 17 L19 7" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>`),
  plus: (s) => wrap(s, `<path d="M12 6 V18 M6 12 H18" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>`),
  close: (s) => wrap(s, `<path d="M7 7 L17 17 M17 7 L7 17" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>`),

  /* ---- home / hut ---- */
  home: (s) => wrap(s, `
    <path d="M4 11 L12 4 L20 11" stroke="${P.coral}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M6 10.5 V19 H18 V10.5" fill="${P.sand}" stroke="${P.cocoa}" stroke-width="1.6" stroke-linejoin="round"/>
    <rect x="10.2" y="13" width="3.6" height="6" rx="0.6" fill="${P.cocoa}"/>`),

  /* ---- settings gear (as a ship's wheel — beachy) ---- */
  gear: (s) => wrap(s, `
    <circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" stroke-width="2.2"/>
    <circle cx="12" cy="12" r="2.4" fill="currentColor"/>
    <g stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
      <path d="M12 2.5V6"/><path d="M12 18V21.5"/><path d="M2.5 12H6"/><path d="M18 12H21.5"/>
      <path d="M5.2 5.2 7.6 7.6"/><path d="M16.4 16.4 18.8 18.8"/><path d="M18.8 5.2 16.4 7.6"/><path d="M7.6 16.4 5.2 18.8"/>
    </g>`),

  /* ---- coin (gold with pineapple wink) ---- */
  coin: (s) => wrap(s, `
    <circle cx="12" cy="12" r="10" fill="${P.goldDeep}"/>
    <circle cx="12" cy="12" r="8.4" fill="${P.gold}"/>
    <circle cx="12" cy="12" r="8.4" fill="none" stroke="${P.goldShade}" stroke-width="1"/>
    <ellipse cx="9" cy="8.6" rx="2.4" ry="1.5" fill="#fff" opacity="0.55" transform="rotate(-25 9 8.6)"/>
    <path d="M12 8 Q9 12 12 16 Q15 12 12 8Z" fill="${P.goldShade}" opacity="0.75"/>`),

  /* ---- star (filled + outline) ---- */
  star: (s) => wrap(s, `<path d="M12 3 L14.7 9 L21 9.6 L16.2 13.9 L17.7 20 L12 16.6 L6.3 20 L7.8 13.9 L3 9.6 L9.3 9 Z" fill="${P.gold}" stroke="${P.goldShade}" stroke-width="1" stroke-linejoin="round"/>`),
  starOff: (s) => wrap(s, `<path d="M12 3 L14.7 9 L21 9.6 L16.2 13.9 L17.7 20 L12 16.6 L6.3 20 L7.8 13.9 L3 9.6 L9.3 9 Z" fill="rgba(0,0,0,0.18)" stroke="rgba(0,0,0,0.25)" stroke-width="1" stroke-linejoin="round"/>`),

  /* ---- lock ---- */
  lock: (s) => wrap(s, `
    <path d="M8 11 V8 a4 4 0 0 1 8 0 V11" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <rect x="5.5" y="10.5" width="13" height="9.5" rx="2.4" fill="currentColor"/>
    <circle cx="12" cy="15" r="1.6" fill="${P.cream}"/>`),

  /* ---- trophy ---- */
  trophy: (s) => wrap(s, `
    <path d="M7 4 H17 V9 a5 5 0 0 1 -10 0 Z" fill="${P.gold}" stroke="${P.goldShade}" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M7 5 H4 V7 a3 3 0 0 0 3 3" stroke="${P.goldShade}" stroke-width="1.6" fill="none"/>
    <path d="M17 5 H20 V7 a3 3 0 0 1 -3 3" stroke="${P.goldShade}" stroke-width="1.6" fill="none"/>
    <rect x="10.6" y="13.5" width="2.8" height="3.5" fill="${P.goldDeep}"/>
    <rect x="7.5" y="17" width="9" height="2.8" rx="1" fill="${P.cocoa}"/>`),

  /* ---- medals ---- */
  medalGold: (s) => medal(s, P.gold, P.goldShade, '1'),
  medalSilver: (s) => medal(s, '#dfe7ee', '#9fb0bd', '2'),
  medalBronze: (s) => medal(s, '#e6a86a', '#b5763a', '3'),

  /* ---- account (person in sun hat) ---- */
  account: (s) => wrap(s, `
    <circle cx="12" cy="9" r="3.6" fill="currentColor"/>
    <path d="M5.5 20 a6.5 6.5 0 0 1 13 0 Z" fill="currentColor"/>`),

  /* ---- audio ---- */
  soundOn: (s) => wrap(s, `
    <path d="M4 9.5 H7 L11.5 5.5 V18.5 L7 14.5 H4 Z" fill="currentColor"/>
    <path d="M14.5 9 a4 4 0 0 1 0 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
    <path d="M16.8 6.5 a7 7 0 0 1 0 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>`),
  soundOff: (s) => wrap(s, `
    <path d="M4 9.5 H7 L11.5 5.5 V18.5 L7 14.5 H4 Z" fill="currentColor"/>
    <path d="M15 9.5 L20 14.5 M20 9.5 L15 14.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`),
  music: (s) => wrap(s, `
    <path d="M9 18 V7 L18 5 V16" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>
    <ellipse cx="7" cy="18" rx="2.6" ry="2.2" fill="currentColor"/>
    <ellipse cx="16" cy="16" rx="2.6" ry="2.2" fill="currentColor"/>`),
  sparkle: (s) => wrap(s, `
    <path d="M12 3 Q13 9 19 10 Q13 11 12 17 Q11 11 5 10 Q11 9 12 3Z" fill="currentColor"/>
    <path d="M18.5 15 Q19 17.5 21.5 18 Q19 18.5 18.5 21 Q18 18.5 15.5 18 Q18 17.5 18.5 15Z" fill="currentColor" opacity="0.8"/>`),

  /* ---- modes ---- */
  adventure: (s) => wrap(s, `
    <path d="M4 6 L9 4 L15 6 L20 4 V18 L15 20 L9 18 L4 20 Z" fill="${P.sand}" stroke="${P.cocoa}" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M9 4 V18 M15 6 V20" stroke="${P.cocoa}" stroke-width="1.1" opacity="0.5"/>
    <path d="M7 14 q3 -5 6 -2 q3 3 5 -1" stroke="${P.coral}" stroke-width="1.5" stroke-dasharray="1.5 1.8" fill="none" stroke-linecap="round"/>
    <path d="M17.6 10.4 l1.4 1.4 -1.4 1.4 -1.4 -1.4 z" fill="${P.berry}"/>`),
  endless: (s) => wrap(s, `<path d="M8 12 a3.4 3.4 0 1 1 3.4 3.4 Q12 15 12.6 12 Q13.2 8.6 15.6 8.6 a3.4 3.4 0 1 1 0 6.8 Q13.2 15.4 12.6 12 Q12 8.6 11.4 8.6 a3.4 3.4 0 1 0 -3.4 3.4Z" fill="${P.sea}" stroke="${P.seaDeep}" stroke-width="0.8"/>`),
  timetrial: (s) => wrap(s, `
    <rect x="10.6" y="2.4" width="2.8" height="2.2" rx="0.6" fill="${P.coral}"/>
    <circle cx="12" cy="13.5" r="7.5" fill="${P.cream}" stroke="${P.coral}" stroke-width="2"/>
    <path d="M12 13.5 V9" stroke="${P.cocoaDeep}" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M17.6 6 l1.6 -1.6" stroke="${P.coral}" stroke-width="2" stroke-linecap="round"/>`),
  daily: (s) => wrap(s, `
    <rect x="4" y="5" width="16" height="15" rx="2.4" fill="${P.cream}" stroke="${P.sea}" stroke-width="1.8"/>
    <path d="M4 9 H20" stroke="${P.sea}" stroke-width="1.8"/>
    <rect x="7.5" y="3" width="2" height="4" rx="1" fill="${P.seaDeep}"/><rect x="14.5" y="3" width="2" height="4" rx="1" fill="${P.seaDeep}"/>
    <circle cx="12" cy="14.5" r="2.4" fill="${P.gold}"/>`),
  shop: (s) => wrap(s, `
    <path d="M4 8 L6 4 H18 L20 8 Z" fill="${P.berry}"/>
    <path d="M4 8 h16 v3 a2 2 0 0 1 -2 2 a2 2 0 0 1 -4 0 a2 2 0 0 1 -4 0 a2 2 0 0 1 -4 0 a2 2 0 0 1 -2 -2 Z" fill="${P.coral}"/>
    <rect x="5" y="12" width="14" height="8" fill="${P.sand}" stroke="${P.cocoa}" stroke-width="1.2"/>
    <rect x="9.5" y="14.5" width="5" height="5.5" fill="${P.cocoa}"/>`),

  /* ---- power-ups ---- */
  puStomp: (s) => wrap(s, `
    <ellipse cx="12" cy="16" rx="6" ry="4" fill="${P.leaf}" stroke="${P.leafDeep}" stroke-width="1.4"/>
    <circle cx="7.5" cy="9.5" r="1.8" fill="${P.leaf}" stroke="${P.leafDeep}" stroke-width="1.2"/>
    <circle cx="10.5" cy="8" r="1.6" fill="${P.leaf}" stroke="${P.leafDeep}" stroke-width="1.2"/>
    <circle cx="13.5" cy="8" r="1.6" fill="${P.leaf}" stroke="${P.leafDeep}" stroke-width="1.2"/>
    <circle cx="16.5" cy="9.5" r="1.8" fill="${P.leaf}" stroke="${P.leafDeep}" stroke-width="1.2"/>`),
  puShuffle: (s) => wrap(s, `
    <path d="M4 7 H9 q4 0 5 5 q1 5 5 5" stroke="${P.sea}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M4 17 H9 q4 0 5 -5 q1 -5 5 -5" stroke="${P.coral}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M16.5 4.5 L20 7 L16.5 9.5" stroke="${P.coral}" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M16.5 14.5 L20 17 L16.5 19.5" stroke="${P.sea}" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`),
  puSwap: (s) => wrap(s, `
    <circle cx="8" cy="8" r="3.4" fill="${P.gold}"/>
    <circle cx="16" cy="16" r="3.4" fill="${P.berry}"/>
    <path d="M13.5 8 h3.5 M17 8 l-2 -2 M17 8 l-2 2" stroke="${P.cocoaDeep}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10.5 16 h-3.5 M7 16 l2 -2 M7 16 l2 2" stroke="${P.cocoaDeep}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`),
  puLily: (s) => wrap(s, `
    <circle cx="12" cy="12" r="7" fill="${P.leafDeep}"/>
    <path d="M12 5 A7 7 0 0 1 12 19" fill="${P.leaf}"/>
    <path d="M12 12 L12 5" stroke="#0d5a2c" stroke-width="1.4"/>
    <circle cx="12" cy="12" r="2.6" fill="${P.coral}"/>
    <circle cx="10.6" cy="10.6" r="0.9" fill="#fff" opacity="0.8"/>`),
  puCross: (s) => wrap(s, `
    <path d="M12 3 V21 M3 12 H21" stroke="${P.gold}" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M12 3 V21 M3 12 H21" stroke="${P.white}" stroke-width="1.1" stroke-linecap="round"/>
    <circle cx="12" cy="12" r="2.4" fill="${P.coral}"/>`),
  puVanish: (s) => wrap(s, `
    <path d="M12 2 Q13.2 9.5 20 11 Q13.2 12.5 12 20 Q10.8 12.5 4 11 Q10.8 9.5 12 2Z" fill="${P.purple}"/>
    <circle cx="18" cy="17" r="1.4" fill="${P.berry}"/>
    <circle cx="6" cy="5.5" r="1.1" fill="${P.gold}"/>`),
  puTide: (s) => wrap(s, `
    <path d="M2 14 q3 -4 6 0 t6 0 t6 0 V21 H2 Z" fill="${P.sea}"/>
    <path d="M2 11 q3 -4 6 0 t6 0 t6 0" stroke="${P.sky}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M15 6 q2 1 1 3 M18 4.5 q2.5 1.5 1.2 4" stroke="${P.white}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`),
  puRainbow: (s) => wrap(s, `
    <path d="M4 19 a8 8 0 0 1 16 0" fill="none" stroke="${P.berry}" stroke-width="2.1"/>
    <path d="M6 19 a6 6 0 0 1 12 0" fill="none" stroke="${P.gold}" stroke-width="2.1"/>
    <path d="M8 19 a4 4 0 0 1 8 0" fill="none" stroke="${P.leaf}" stroke-width="2.1"/>
    <path d="M10 19 a2 2 0 0 1 4 0" fill="none" stroke="${P.sea}" stroke-width="2.1"/>`),

  /* ---- misc illustrative (achievements) ---- */
  pineapple: (s) => wrap(s, `
    <path d="M12 3 Q10 5 8 4 Q10 6 9 7 M12 3 Q14 5 16 4 Q14 6 15 7 M12 2 V7" stroke="${P.leafDeep}" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <ellipse cx="12" cy="14" rx="5.5" ry="7" fill="${P.gold}" stroke="${P.goldShade}" stroke-width="1.2"/>
    <path d="M8 10 L12 13 M12 10 L16 13 M8 14 L12 17 M12 14 L16 17" stroke="${P.goldShade}" stroke-width="1" opacity="0.7"/>`),
  globe: (s) => wrap(s, `
    <circle cx="12" cy="12" r="8.5" fill="${P.sea}" stroke="${P.seaDeep}" stroke-width="1.4"/>
    <path d="M6 9 q3 2 6 1 t5 -1 M5 14 q4 2 7 1 t6 0" stroke="${P.leaf}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <ellipse cx="12" cy="12" rx="3.4" ry="8.5" fill="none" stroke="${P.seaDeep}" stroke-width="1"/>`),
  bag: (s) => wrap(s, `
    <path d="M8 8 V6.5 a4 4 0 0 1 8 0 V8" stroke="${P.cocoa}" stroke-width="1.8" fill="none"/>
    <path d="M5.5 8 H18.5 L17.5 20 H6.5 Z" fill="${P.coral}" stroke="${P.cocoaDeep}" stroke-width="1.2" stroke-linejoin="round"/>`),
  bolt: (s) => wrap(s, `<path d="M13 2 L5 13 H11 L10 22 L19 9 H12 Z" fill="${P.gold}" stroke="${P.goldShade}" stroke-width="1.2" stroke-linejoin="round"/>`),
  crown: (s) => wrap(s, `<path d="M4 18 L5 8 L9.5 12 L12 6 L14.5 12 L19 8 L20 18 Z" fill="${P.gold}" stroke="${P.goldShade}" stroke-width="1.3" stroke-linejoin="round"/><rect x="4" y="18" width="16" height="2.6" rx="0.8" fill="${P.goldDeep}"/>`),
};

function medal(s, face, edge, num) {
  return wrap(s, `
    <path d="M8.5 3 L11 9 H13 L15.5 3" stroke="${P.coral}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <circle cx="12" cy="15" r="6.5" fill="${face}" stroke="${edge}" stroke-width="1.6"/>
    <text x="12" y="18.2" font-family="Lilita One, sans-serif" font-size="7" fill="${edge}" text-anchor="middle">${num}</text>`);
}

export function icon(name, opts = {}) {
  const size = opts.size || 24;
  const fn = ICONS[name];
  return fn ? fn(size) : '';
}

export function hasIcon(name) { return !!ICONS[name]; }
