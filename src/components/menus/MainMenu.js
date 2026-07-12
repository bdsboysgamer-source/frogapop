// Home hub — tropical beach scene, mode tiles, utility bar, coins and
// account. All icons are SVG assets (icons.js); no emoji.

import { frogSVG } from '../characters/FrogArt.js';
import { Sound } from '../../game/effects/Sound.js';
import { frogLine } from '../../data/frogs.js';
import { icon } from '../ui/icons.js';
import { palm } from './islandAssets.js';

export function mountMainMenu(stage, controller) {
  const el = document.createElement('div');
  el.className = 'screen hub-screen';

  const acct = controller.account;
  const daily = controller.saveData.daily;
  const dailyDone = daily.played && daily.date === new Date().toISOString().slice(0, 10);

  el.innerHTML = `
    <div class="scene">
      <div class="sun" style="top:46px;right:40px;"></div>
      <div class="cloud" style="top:70px;animation-duration:44s;animation-delay:-6s;"></div>
      <div class="cloud" style="top:150px;transform:scale(0.7);animation-duration:58s;animation-delay:-24s;opacity:0.8;"></div>
      <div class="cloud" style="top:230px;transform:scale(1.05);animation-duration:50s;animation-delay:-15s;opacity:0.7;"></div>
      <div class="sea"></div>
      <div class="sparkle-layer">
        ${[...Array(7)].map((_, i) => `<div class="sea-sparkle" style="left:${8 + i * 13}%;bottom:${4 + (i % 4) * 6}%;animation-duration:${2 + (i % 3)}s;animation-delay:${i * 0.4}s;"></div>`).join('')}
      </div>
      <div class="island" style="left:-14%;right:-14%;bottom:-8%;height:30%;"></div>
      <div class="palm" style="left:8px;bottom:150px;animation-delay:-1s;">${palm(120)}</div>
      <div class="palm" style="right:6px;bottom:150px;transform:scaleX(-1);">${palm(100)}</div>
      ${[...Array(4)].map((_, i) => `<div class="leaf-fall" style="left:${16 + i * 20}%;animation-duration:${9 + i * 2.2}s;animation-delay:${-i * 3}s;"><svg width="20" height="20" viewBox="0 0 20 20"><path d="M2 18 Q2 4 18 2 Q16 18 2 18Z" fill="#4cbf5b" stroke="#2c8a3e" stroke-width="1.5"/></svg></div>`).join('')}
    </div>

    <div class="hub-topbar">
      <div class="coin-chip big">${icon('coin', { size: 22 })}<b id="hubCoins">${controller.coins}</b></div>
      <button class="acct-chip" id="acctBtn">${icon('account', { size: 18 })}${acct ? acct.name : 'Sign in'}</button>
    </div>

    <div class="hub-logo">
      <span class="logo-main">${'Frogapop'.split('').map((ch, i) => `<span style="animation-delay:${i * 0.09}s">${ch}</span>`).join('')}</span>
      <span class="logo-sub">Pineapple Paradise</span>
    </div>

    <div class="hub-mascot" id="hubMascot">${frogSVG('sprig', { width: 128 })}</div>
    <div class="speech-bubble" id="hubBubble"></div>

    <div class="mode-grid">
      ${tile('tAdventure', 'adventure', 'Adventure', '100 levels', 'tile-adventure')}
      ${tile('tEndless', 'endless', 'Endless', `Best ${controller.saveData.endless.best.toLocaleString()}`, 'tile-endless')}
      ${tile('tTime', 'timetrial', 'Time Trial', `Best ${controller.saveData.timetrial.best.toLocaleString()}`, 'tile-time')}
      ${tile('tDaily', 'daily', 'Daily', dailyDone ? 'done today' : 'new today!', 'tile-daily')}
    </div>

    <div class="hub-utilbar">
      ${util('uIndex', 'pineapple', 'Index')}
      ${util('uShop', 'shop', 'Shop')}
      ${util('uRanks', 'trophy', 'Ranks')}
      ${util('uAch', 'medalGold', 'Trophies')}
      ${util('uSet', 'gear', 'Settings')}
    </div>
  `;
  stage.appendChild(el);

  const bubble = el.querySelector('#hubBubble');
  let bubbleTimer = null;
  const say = (text) => { bubble.textContent = text; bubble.classList.add('show'); clearTimeout(bubbleTimer); bubbleTimer = setTimeout(() => bubble.classList.remove('show'), 1900); };
  const helloTimer = setTimeout(() => say(frogLine('sprig', 'hello')), 800);

  el.querySelector('#hubMascot').addEventListener('click', () => { Sound.ensure(); Sound.ribbit(); say(frogLine('sprig', 'hello')); });

  const go = (fn) => { Sound.ensure(); Sound.button(); fn(); };
  el.querySelector('#tAdventure').addEventListener('click', () => go(() => controller.gotoMap()));
  el.querySelector('#tEndless').addEventListener('click', () => go(() => controller.gotoEndless()));
  el.querySelector('#tTime').addEventListener('click', () => go(() => controller.gotoTimeTrial()));
  el.querySelector('#tDaily').addEventListener('click', () => go(() => controller.gotoDaily()));
  el.querySelector('#uIndex').addEventListener('click', () => go(() => controller.gotoIndex()));
  el.querySelector('#uShop').addEventListener('click', () => go(() => controller.gotoShop()));
  el.querySelector('#uRanks').addEventListener('click', () => go(() => controller.gotoLeaderboard()));
  el.querySelector('#uAch').addEventListener('click', () => go(() => controller.gotoAchievements()));
  el.querySelector('#uSet').addEventListener('click', () => go(() => controller.gotoSettings()));
  el.querySelector('#acctBtn').addEventListener('click', () => go(() => controller.gotoSettings()));

  return () => clearTimeout(helloTimer);
}

function tile(id, ic, name, sub, cls) {
  return `<button class="mode-tile ${cls}" id="${id}">
    <span class="mt-icon">${icon(ic, { size: 46 })}</span>
    <span class="mt-name">${name}</span><span class="mt-sub">${sub}</span>
  </button>`;
}
function util(id, ic, label) {
  return `<button class="util-btn" id="${id}">${icon(ic, { size: 26 })}${label}</button>`;
}
