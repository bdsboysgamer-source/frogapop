// Scai's Stall — the power-up market. A frog named Scai runs a counter
// with a horizontally-scrollable row of power-ups. Buy with coins, then
// equip up to 4 into your loadout.

import { POWERUPS, POWERUP_ORDER, LOADOUT_SIZE } from '../../data/powerups.js';
import { frogSVG } from '../characters/FrogArt.js';
import { Sound } from '../../game/effects/Sound.js';
import { icon } from '../ui/icons.js';

export function mountShop(stage, controller) {
  const el = document.createElement('div');
  el.className = 'screen shop-screen';
  stage.appendChild(el);

  function render() {
    const equipped = controller.loadout.length;
    el.innerHTML = `
      <div class="shop-bg"></div>
      <div class="shop-header">
        <button class="btn btn-blue btn-round" id="backBtn">${icon('back', { size: 26 })}</button>
        <div class="shop-title">Scai's Stall</div>
        <div class="coin-chip big">${icon('coin', { size: 22 })}<b>${controller.coins}</b></div>
      </div>

      <div class="stall">
        <div class="stall-roof"></div>
        <div class="stall-keeper">
          ${frogSVG('scout', { width: 118 })}
          <div class="stall-sign">Scai</div>
        </div>
        <div class="stall-counter">
          <div class="counter-rail" id="rail">
            ${POWERUP_ORDER.map((id) => card(id)).join('')}
          </div>
        </div>
      </div>

      <div class="loadout-bar">
        <span class="loadout-label">Loadout ${equipped}/${LOADOUT_SIZE}</span>
        <div class="loadout-slots">
          ${[...Array(LOADOUT_SIZE)].map((_, i) => {
            const id = controller.loadout[i];
            return id ? `<div class="lo-slot filled" style="--ptint:${POWERUPS[id].tint}">${icon(POWERUPS[id].icon, { size: 30 })}</div>` : `<div class="lo-slot"></div>`;
          }).join('')}
        </div>
      </div>
    `;

    el.querySelector('#backBtn').addEventListener('click', () => { Sound.button(); controller.gotoMenu(); });

    el.querySelectorAll('[data-buy]').forEach((b) => b.addEventListener('click', () => {
      const id = b.dataset.buy;
      if (controller.buyPowerup(id)) { Sound.specialCreated(); render(); }
      else { Sound.invalid(); b.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: 240 }); }
    }));

    el.querySelectorAll('[data-equip]').forEach((b) => b.addEventListener('click', () => {
      const id = b.dataset.equip;
      if (controller.toggleEquip(id)) { Sound.button(); render(); }
      else { Sound.invalid(); }
    }));
  }

  function card(id) {
    const p = POWERUPS[id];
    const owned = controller.owns(id);
    const equipped = controller.isEquipped(id);
    const canAfford = controller.coins >= p.price;
    let action;
    if (!owned) {
      action = `<button class="pw-buy ${canAfford ? '' : 'poor'}" data-buy="${id}">${icon('coin', { size: 20 })} ${p.price}</button>`;
    } else if (equipped) {
      action = `<button class="pw-equip on" data-equip="${id}">${icon('check', { size: 16 })} Equipped</button>`;
    } else {
      const full = controller.loadout.length >= LOADOUT_SIZE;
      action = `<button class="pw-equip ${full ? 'full' : ''}" data-equip="${id}">${full ? 'Loadout full' : 'Equip'}</button>`;
    }
    return `
      <div class="pw-card ${owned ? 'owned' : ''} ${equipped ? 'equipped' : ''}" style="--ptint:${p.tint}">
        <div class="pw-badge">${p.price === 0 ? 'STARTER' : owned ? 'OWNED' : ''}</div>
        <div class="pw-orb">${icon(p.icon, { size: 42 })}</div>
        <div class="pw-name">${p.name}</div>
        <div class="pw-blurb">${p.blurb}</div>
        ${action}
      </div>`;
  }

  render();
}
