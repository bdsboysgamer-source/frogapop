// Pineapple Index — a collectible gallery of all 25 pineapple species,
// grouped by world, each with its portrait and a short fun description.

import { PIECE_TYPES, PINEAPPLE_DESC, WORLD_POOLS, WORLDS_META } from '../../data/pieceTypes.js';
import { getPieceSprite } from '../../game/pieces/PieceArt.js';
import { icon } from '../ui/icons.js';
import { Sound } from '../../game/effects/Sound.js';

export function mountPineappleIndex(stage, controller) {
  const el = document.createElement('div');
  el.className = 'screen sheet-screen pdex-screen';
  stage.appendChild(el);

  const total = Object.keys(PIECE_TYPES).length;

  const sections = WORLDS_META.map((w) => {
    const unlocked = controller.isWorldUnlocked(w.id);
    const cards = WORLD_POOLS[w.id].map((id) => card(id, unlocked)).join('');
    return `
      <div class="pdex-world">
        <span class="pdex-world-name">${w.name}</span>
        ${unlocked ? '' : `<span class="pdex-world-lock">${icon('lock', { size: 16 })} locked</span>`}
      </div>
      <div class="pdex-grid">${cards}</div>`;
  }).join('');

  el.innerHTML = `
    <div class="sheet-bg"></div>
    <div class="sheet-header">
      <button class="btn btn-blue btn-round" id="backBtn">${icon('back', { size: 26 })}</button>
      <div class="sheet-title">Pineapple Index</div>
      <div class="ach-count">${total}</div>
    </div>
    <div class="sheet-body">${sections}</div>
  `;

  el.querySelector('#backBtn').addEventListener('click', () => { Sound.button(); controller.gotoMenu(); });

  // little wobble when you poke a portrait
  el.querySelectorAll('.pdex-card:not(.locked) .pdex-portrait').forEach((p) => {
    p.addEventListener('click', () => {
      Sound.ensure(); Sound.pop?.(1);
      p.animate([{ transform: 'scale(1) rotate(0)' }, { transform: 'scale(1.15) rotate(-6deg)' }, { transform: 'scale(1.15) rotate(6deg)' }, { transform: 'scale(1) rotate(0)' }], { duration: 400 });
    });
  });

  function card(id, unlocked) {
    const t = PIECE_TYPES[id];
    if (!unlocked) {
      return `<div class="pdex-card locked">
        <div class="pdex-portrait"><span class="pdex-silhouette">?</span></div>
        <div class="pdex-info"><div class="pdex-name">? ? ?</div><div class="pdex-desc">Reach this world to discover it.</div></div>
      </div>`;
    }
    const src = getPieceSprite(id).toDataURL();
    return `<div class="pdex-card">
      <div class="pdex-portrait"><img src="${src}" alt="${t.name}" width="72" height="72"/></div>
      <div class="pdex-info">
        <div class="pdex-name">${t.name}</div>
        <div class="pdex-desc">${PINEAPPLE_DESC[id] || ''}</div>
      </div>
    </div>`;
  }
}
