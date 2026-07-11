// Leaderboard screen. Shows global (Cloudflare) boards when available,
// otherwise this device's local bests. Tabs across the score modes.

import { fetchBoard, isOnlineAvailable } from '../../net/leaderboard.js';
import { Sound } from '../../game/effects/Sound.js';
import { icon } from '../ui/icons.js';

const TABS = [
  { mode: 'endless', sub: null, ic: 'endless', label: 'Endless' },
  { mode: 'timetrial', sub: null, ic: 'timetrial', label: 'Time Trial' },
  { mode: 'daily', sub: () => new Date().toISOString().slice(0, 10), ic: 'daily', label: 'Daily' },
];

export function mountLeaderboard(stage, controller, params = {}) {
  const el = document.createElement('div');
  el.className = 'screen sheet-screen';
  stage.appendChild(el);

  // if opened from a result screen, focus that board; else default endless
  let active = 0;
  if (params.mode) {
    const idx = TABS.findIndex((t) => t.mode === params.mode);
    if (idx >= 0) active = idx;
  }
  const fixedSub = params.sub; // for level boards opened directly

  el.innerHTML = `
    <div class="sheet-bg"></div>
    <div class="sheet-header">
      <button class="btn btn-blue btn-round" id="backBtn">${icon('back', { size: 26 })}</button>
      <div class="sheet-title">Leaderboards</div>
      <div style="width:52px;"></div>
    </div>
    <div class="lb-tabs" id="tabs">
      ${params.mode === 'level'
        ? `<button class="lb-tab active">${params.title || 'Level'}</button>`
        : TABS.map((t, i) => `<button class="lb-tab ${i === active ? 'active' : ''}" data-tab="${i}">${icon(t.ic, { size: 18 })}${t.label}</button>`).join('')}
    </div>
    <div class="lb-status" id="status"></div>
    <div class="sheet-body"><div class="lb-list" id="list"></div></div>
  `;

  el.querySelector('#backBtn').addEventListener('click', () => { Sound.button(); (params.fromMenu !== false ? controller.gotoMenu() : controller.gotoMenu()); });

  el.querySelectorAll('[data-tab]').forEach((b) => b.addEventListener('click', () => {
    Sound.button();
    active = Number(b.dataset.tab);
    el.querySelectorAll('.lb-tab').forEach((t) => t.classList.toggle('active', t === b));
    load();
  }));

  async function load() {
    const list = el.querySelector('#list');
    const status = el.querySelector('#status');
    list.innerHTML = `<div class="lb-loading">Loading…</div>`;
    const tab = params.mode === 'level'
      ? { mode: 'level', sub: fixedSub }
      : { mode: TABS[active].mode, sub: typeof TABS[active].sub === 'function' ? TABS[active].sub() : TABS[active].sub };

    const online = await isOnlineAvailable();
    const { entries } = await fetchBoard({ mode: tab.mode, sub: tab.sub, limit: 25, account: controller.account });
    status.innerHTML = online
      ? `${icon('globe', { size: 16 })} Global rankings`
      : `This device only · <span class="lb-hint">sign in + deploy the server for global boards</span>`;

    if (!entries.length) { list.innerHTML = `<div class="lb-empty">No scores yet — be the first!</div>`; return; }
    list.innerHTML = entries.map((e, i) => {
      const rank = e.rank ?? i + 1;
      const medal = rank === 1 ? icon('medalGold', { size: 26 }) : rank === 2 ? icon('medalSilver', { size: 26 }) : rank === 3 ? icon('medalBronze', { size: 26 }) : `#${rank}`;
      return `<div class="lb-row ${e.you ? 'you' : ''}">
        <span class="lb-rank">${medal}</span>
        <span class="lb-name">${escapeHTML(e.name || 'Anon')}</span>
        <span class="lb-score">${Number(e.score).toLocaleString()}</span>
      </div>`;
    }).join('');
  }

  load();
}

function escapeHTML(s) { return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
