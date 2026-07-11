// Trophies screen — a grid of achievements, unlocked state derived live.

import { ACHIEVEMENTS } from '../../data/achievements.js';
import { Sound } from '../../game/effects/Sound.js';
import { icon } from '../ui/icons.js';

export function mountAchievements(stage, controller) {
  const el = document.createElement('div');
  el.className = 'screen sheet-screen';
  stage.appendChild(el);

  const unlocked = ACHIEVEMENTS.filter((a) => a.check(controller));
  const count = unlocked.length;

  el.innerHTML = `
    <div class="sheet-bg"></div>
    <div class="sheet-header">
      <button class="btn btn-blue btn-round" id="backBtn">${icon('back', { size: 26 })}</button>
      <div class="sheet-title">Trophies</div>
      <div class="ach-count">${count}/${ACHIEVEMENTS.length}</div>
    </div>
    <div class="sheet-body">
      <div class="ach-grid">
        ${ACHIEVEMENTS.map((a) => {
          const on = a.check(controller);
          return `<div class="ach-card ${on ? 'on' : 'off'}">
            <div class="ach-icon">${on ? icon(a.icon, { size: 40 }) : icon('lock', { size: 36 })}</div>
            <div class="ach-name">${a.name}</div>
            <div class="ach-desc">${a.desc}</div>
          </div>`;
        }).join('')}
      </div>
    </div>
  `;

  el.querySelector('#backBtn').addEventListener('click', () => { Sound.button(); controller.gotoMenu(); });
}
