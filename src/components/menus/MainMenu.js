// Home hub: logo, mode tiles (Adventure / Endless / Time Trial / Daily),
// a utility bar (Shop / Ranks / Achievements / Settings), coin balance
// and account status. Styled with the bold new "neon lily-pond" theme.

import { frogSVG } from '../characters/FrogArt.js';
import { Sound } from '../../game/effects/Sound.js';
import { frogLine } from '../../data/frogs.js';

export function mountMainMenu(stage, controller) {
  const el = document.createElement('div');
  el.className = 'screen hub-screen';

  const acct = controller.account;
  const daily = controller.saveData.daily;
  const dailyDone = daily.played && daily.date === new Date().toISOString().slice(0, 10);

  el.innerHTML = `
    <div class="hub-bg">
      <div class="hub-glow"></div>
      ${[...Array(5)].map((_, i) => `<div class="hub-lily" style="left:${8 + i * 21}%;top:${60 + (i % 3) * 12}%;animation-delay:${-i * 1.7}s;transform:scale(${0.6 + (i % 3) * 0.2});"></div>`).join('')}
      ${[...Array(6)].map((_, i) => `<div class="hub-firefly" style="left:${10 + i * 15}%;top:${20 + (i % 4) * 18}%;animation-delay:${-i * 1.3}s;"></div>`).join('')}
    </div>

    <div class="hub-topbar">
      <div class="coin-chip big">🪙 <b id="hubCoins">${controller.coins}</b></div>
      <button class="acct-chip" id="acctBtn">${acct ? `👤 ${acct.name}` : '👤 Sign in'}</button>
    </div>

    <div class="hub-logo">
      <span class="logo-main">${'Frogapop'.split('').map((ch, i) => `<span style="animation-delay:${i * 0.09}s">${ch}</span>`).join('')}</span>
      <span class="logo-sub">🐸 Pond Party 🍍</span>
    </div>

    <div class="hub-mascot" id="hubMascot">${frogSVG('sprig', { width: 128 })}</div>
    <div class="speech-bubble" id="hubBubble"></div>

    <div class="mode-grid">
      <button class="mode-tile tile-adventure" id="tAdventure">
        <span class="mt-icon">🗺️</span><span class="mt-name">Adventure</span><span class="mt-sub">100 levels</span>
      </button>
      <button class="mode-tile tile-endless" id="tEndless">
        <span class="mt-icon">♾️</span><span class="mt-name">Endless</span><span class="mt-sub">Best ${controller.saveData.endless.best.toLocaleString()}</span>
      </button>
      <button class="mode-tile tile-time" id="tTime">
        <span class="mt-icon">⏱️</span><span class="mt-name">Time Trial</span><span class="mt-sub">Best ${controller.saveData.timetrial.best.toLocaleString()}</span>
      </button>
      <button class="mode-tile tile-daily" id="tDaily">
        <span class="mt-icon">📅</span><span class="mt-name">Daily</span><span class="mt-sub">${dailyDone ? '✓ done today' : 'new today!'}</span>
      </button>
    </div>

    <div class="hub-utilbar">
      <button class="util-btn" id="uShop"><span>🛖</span>Shop</button>
      <button class="util-btn" id="uRanks"><span>🏆</span>Ranks</button>
      <button class="util-btn" id="uAch"><span>🏅</span>Trophies</button>
      <button class="util-btn" id="uSet"><span>⚙️</span>Settings</button>
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
  el.querySelector('#uShop').addEventListener('click', () => go(() => controller.gotoShop()));
  el.querySelector('#uRanks').addEventListener('click', () => go(() => controller.gotoLeaderboard()));
  el.querySelector('#uAch').addEventListener('click', () => go(() => controller.gotoAchievements()));
  el.querySelector('#uSet').addEventListener('click', () => go(() => controller.gotoSettings()));
  el.querySelector('#acctBtn').addEventListener('click', () => go(() => controller.gotoSettings()));

  return () => clearTimeout(helloTimer);
}
