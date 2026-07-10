// SVG frog character generator. Builds each frog from its palette +
// accessory, with poses (idle / cheer / sad) and built-in blinking.
// Returns SVG markup strings that screens inject into the DOM.

import { FROGS } from '../../data/frogs.js';

let uid = 0;

export function frogSVG(frogId, { pose = 'idle', width = 120 } = {}) {
  const f = FROGS[frogId] ?? FROGS.sprig;
  const id = `fr${uid++}`;
  const cheer = pose === 'cheer';
  const sad = pose === 'sad';

  const eyeOpen = sad ? 7 : 9;
  const pupilY = sad ? 32 : 30;

  const mouth = sad
    ? `<path d="M 44 62 Q 60 54 76 62" fill="none" stroke="#2c3e26" stroke-width="3.5" stroke-linecap="round"/>`
    : cheer
      ? `<path d="M 40 56 Q 60 76 80 56 Q 60 66 40 56 Z" fill="#5c2b28" stroke="#2c3e26" stroke-width="3"/>
         <path d="M 52 64 Q 60 70 68 64 L 66 67 Q 60 71 54 67 Z" fill="#ff8fa8"/>`
      : `<path d="M 40 58 Q 60 70 80 58" fill="none" stroke="#2c3e26" stroke-width="3.5" stroke-linecap="round"/>`;

  const arms = cheer
    ? `<g>
         <path d="M 24 58 Q 8 40 14 24" fill="none" stroke="${f.body}" stroke-width="10" stroke-linecap="round"/>
         <circle cx="14" cy="22" r="7" fill="${f.body}"/>
         <path d="M 96 58 Q 112 40 106 24" fill="none" stroke="${f.body}" stroke-width="10" stroke-linecap="round"/>
         <circle cx="106" cy="22" r="7" fill="${f.body}"/>
       </g>`
    : `<g>
         <ellipse cx="34" cy="86" rx="10" ry="7" fill="${dark(f.body)}"/>
         <ellipse cx="86" cy="86" rx="10" ry="7" fill="${dark(f.body)}"/>
       </g>`;

  const spots = f.spots
    ? `<circle cx="42" cy="66" r="4.5" fill="${f.spots}" opacity="0.85"/>
       <circle cx="80" cy="72" r="3.8" fill="${f.spots}" opacity="0.85"/>
       <circle cx="62" cy="82" r="3.2" fill="${f.spots}" opacity="0.85"/>`
    : '';

  return `
<svg viewBox="0 0 120 110" width="${width}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="${id}b" cx="0.4" cy="0.3" r="1">
      <stop offset="0" stop-color="${light(f.body)}"/>
      <stop offset="0.65" stop-color="${f.body}"/>
      <stop offset="1" stop-color="${dark(f.body)}"/>
    </radialGradient>
  </defs>
  <g class="frog-body-anim">
    <!-- back feet -->
    <ellipse cx="22" cy="100" rx="16" ry="8" fill="${dark(f.body)}"/>
    <ellipse cx="98" cy="100" rx="16" ry="8" fill="${dark(f.body)}"/>
    <!-- haunches -->
    <ellipse cx="26" cy="84" rx="15" ry="18" fill="${f.body}"/>
    <ellipse cx="94" cy="84" rx="15" ry="18" fill="${f.body}"/>
    ${arms}
    <!-- body -->
    <path d="M 60 18 C 28 18 18 46 18 70 C 18 94 36 104 60 104 C 84 104 102 94 102 70 C 102 46 92 18 60 18 Z" fill="url(#${id}b)" stroke="${dark(f.body)}" stroke-width="3"/>
    <!-- belly -->
    <ellipse cx="60" cy="76" rx="26" ry="22" fill="${f.belly}"/>
    ${spots}
    <!-- eyes -->
    <circle cx="38" cy="28" r="16" fill="${f.body}" stroke="${dark(f.body)}" stroke-width="3"/>
    <circle cx="82" cy="28" r="16" fill="${f.body}" stroke="${dark(f.body)}" stroke-width="3"/>
    <circle cx="38" cy="28" r="11" fill="#fff"/>
    <circle cx="82" cy="28" r="11" fill="#fff"/>
    <circle cx="${sad ? 38 : 40}" cy="${pupilY}" r="5.5" fill="#26301f"/>
    <circle cx="${sad ? 82 : 84}" cy="${pupilY}" r="5.5" fill="#26301f"/>
    <circle cx="${sad ? 40 : 42}" cy="${pupilY - 2}" r="2" fill="#fff"/>
    <circle cx="${sad ? 84 : 86}" cy="${pupilY - 2}" r="2" fill="#fff"/>
    <!-- blink lids -->
    <ellipse cx="38" cy="${28 - eyeOpen}" rx="11.5" ry="0" fill="${f.body}">
      <animate attributeName="ry" values="0;0;0;${eyeOpen + 3};0;0" keyTimes="0;0.6;0.86;0.9;0.94;1" dur="3.8s" repeatCount="indefinite"/>
      <animate attributeName="cy" values="${28 - eyeOpen};${28 - eyeOpen};${28 - eyeOpen};28;${28 - eyeOpen};${28 - eyeOpen}" keyTimes="0;0.6;0.86;0.9;0.94;1" dur="3.8s" repeatCount="indefinite"/>
    </ellipse>
    <ellipse cx="82" cy="${28 - eyeOpen}" rx="11.5" ry="0" fill="${f.body}">
      <animate attributeName="ry" values="0;0;0;${eyeOpen + 3};0;0" keyTimes="0;0.6;0.86;0.9;0.94;1" dur="3.8s" repeatCount="indefinite"/>
      <animate attributeName="cy" values="${28 - eyeOpen};${28 - eyeOpen};${28 - eyeOpen};28;${28 - eyeOpen};${28 - eyeOpen}" keyTimes="0;0.6;0.86;0.9;0.94;1" dur="3.8s" repeatCount="indefinite"/>
    </ellipse>
    ${sad ? `<path d="M 26 16 L 50 22 M 94 16 L 70 22" stroke="${dark(f.body)}" stroke-width="3" stroke-linecap="round"/>` : ''}
    <!-- cheeks -->
    <ellipse cx="30" cy="52" rx="7" ry="5" fill="${f.cheek}" opacity="0.6"/>
    <ellipse cx="90" cy="52" rx="7" ry="5" fill="${f.cheek}" opacity="0.6"/>
    <!-- nostrils -->
    <circle cx="54" cy="44" r="1.8" fill="#2c3e26"/>
    <circle cx="66" cy="44" r="1.8" fill="#2c3e26"/>
    ${mouth}
    ${accessory(f, id)}
  </g>
</svg>`;
}

function accessory(f, id) {
  switch (f.accessory) {
    case 'leaf':
      return `<g transform="translate(60 -1) rotate(-8)">
        <path d="M 0 0 Q -22 -12 -34 2 Q -18 10 0 4 Q 18 10 34 2 Q 22 -12 0 0 Z" fill="#3fae4c" stroke="#2c8a3e" stroke-width="2.5"/>
        <line x1="-30" y1="1" x2="30" y2="1" stroke="#2c8a3e" stroke-width="2"/>
      </g>`;
    case 'crown':
      return `<g transform="translate(60 -2)">
        <path d="M -20 6 L -20 -10 L -10 -2 L 0 -14 L 10 -2 L 20 -10 L 20 6 Z" fill="#ffd44d" stroke="#c98a00" stroke-width="2.5"/>
        <circle cx="-13" cy="1" r="2.6" fill="#ff5e9c"/>
        <circle cx="0" cy="-1" r="3" fill="#4fc3e8"/>
        <circle cx="13" cy="1" r="2.6" fill="#7ee081"/>
      </g>`;
    case 'wizard':
      return `<g transform="translate(60 -4) rotate(-6)">
        <path d="M -26 8 Q 0 14 26 8 L 8 6 L 14 -34 L -2 4 Z" fill="#5a3d9e" stroke="#41297a" stroke-width="2.5"/>
        <path d="M -26 8 Q 0 16 26 8 Q 0 22 -26 8 Z" fill="#7657c9"/>
        <circle cx="9" cy="-16" r="2.6" fill="#ffe14d"/>
        <circle cx="2" cy="-2" r="2" fill="#ffe14d"/>
      </g>`;
    case 'explorer':
      return `<g transform="translate(60 -3)">
        <path d="M -30 4 Q 0 12 30 4 Q 28 -2 20 -3 Q 20 -18 0 -18 Q -20 -18 -20 -3 Q -28 -2 -30 4 Z" fill="#c9a066" stroke="#8a5a30" stroke-width="2.5"/>
        <path d="M -20 -4 Q 0 2 20 -4" fill="none" stroke="#8a5a30" stroke-width="3"/>
      </g>`;
    default:
      return '';
  }
}

function light(hex) { return mix(hex, '#ffffff', 0.35); }
function dark(hex) { return mix(hex, '#1a2a10', 0.3); }

function mix(a, b, t) {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const r = Math.round((pa >> 16) * (1 - t) + (pb >> 16) * t);
  const g = Math.round(((pa >> 8) & 255) * (1 - t) + ((pb >> 8) & 255) * t);
  const bl = Math.round((pa & 255) * (1 - t) + (pb & 255) * t);
  return `rgb(${r},${g},${bl})`;
}
