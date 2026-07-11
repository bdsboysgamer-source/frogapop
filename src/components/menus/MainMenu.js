// Main menu: animated tropical scene, bouncing logo, mascot frog,
// floating pineapples, and the big juicy PLAY button.

import { frogSVG } from '../characters/FrogArt.js';
import { pieceIconHTML } from '../ui/pieceIcon.js';
import { Sound } from '../../game/effects/Sound.js';
import { frogLine } from '../../data/frogs.js';

export function mountMainMenu(stage, controller) {
  const el = document.createElement('div');
  el.className = 'screen';
  el.innerHTML = `
    <div class="scene">
      <div class="sun" style="top:46px;right:38px;"></div>
      <div class="cloud" style="top:70px;animation-duration:34s;animation-delay:-6s;"></div>
      <div class="cloud" style="top:150px;transform:scale(0.7);animation-duration:46s;animation-delay:-24s;"></div>
      <div class="cloud" style="top:230px;transform:scale(1.15);animation-duration:40s;animation-delay:-15s;"></div>
      <div class="sea"></div>
      <div class="sparkle-layer">
        ${[...Array(8)].map((_, i) => `<div class="sea-sparkle" style="left:${8 + i * 12}%;bottom:${4 + (i % 4) * 7}%;animation-duration:${(2 + (i % 3))}s;animation-delay:${i * 0.4}s;"></div>`).join('')}
      </div>
      <div class="island" style="left:-14%;right:-14%;bottom:-8%;height:34%;"></div>
      <div class="palm" style="left:16px;bottom:200px;animation-delay:-1s;">${palmSVG(110)}</div>
      <div class="palm" style="right:10px;bottom:190px;transform:scaleX(-1);">${palmSVG(90)}</div>
      ${[...Array(5)].map((_, i) => `
        <div class="leaf-fall" style="left:${12 + i * 19}%;animation-duration:${9 + i * 2.4}s;animation-delay:${-i * 3.1}s;">
          <svg width="22" height="22" viewBox="0 0 20 20"><path d="M2 18 Q2 4 18 2 Q16 18 2 18Z" fill="#4cbf5b" stroke="#2c8a3e" stroke-width="1.5"/></svg>
        </div>`).join('')}
    </div>

    <div style="margin-top:96px;z-index:2;" class="floaty">
      <div class="logo">
        <span class="logo-main">${'Frogapop'.split('').map((ch, i) => `<span style="animation-delay:${i * 0.09}s">${ch}</span>`).join('')}</span>
        <span class="logo-sub">🍍 Pineapple Paradise 🍍</span>
      </div>
    </div>

    <div style="position:absolute;bottom:172px;left:50%;transform:translateX(-50%);z-index:3;display:flex;flex-direction:column;align-items:center;gap:16px;">
      <button class="btn btn-green pulse" id="playBtn">▶&nbsp; PLAY</button>
      <div class="row">
        <button class="btn btn-blue btn-round" id="soundBtn" title="Sound">${Sound.muted ? '🔇' : '🔊'}</button>
        <button class="btn btn-pink btn-round" id="resetBtn" title="Reset progress">↺</button>
      </div>
    </div>

    <div id="mascot" style="position:absolute;bottom:26px;left:24px;z-index:3;cursor:pointer;filter:drop-shadow(0 8px 8px rgba(0,40,20,0.35));">
      ${frogSVG('sprig', { width: 150 })}
    </div>
    <div class="speech-bubble" id="menuBubble" style="left:150px;bottom:130px;"></div>

    <div style="position:absolute;bottom:34px;right:26px;z-index:3;display:flex;gap:2px;align-items:flex-end;">
      <span class="floaty" style="animation-delay:-0.5s;cursor:pointer;" id="goldenPine">${pieceIconHTML('golden', 56)}</span>
      <span class="floaty" style="animation-delay:-1.4s">${pieceIconHTML('pink', 44)}</span>
      <span class="floaty" style="animation-delay:-2.2s">${pieceIconHTML('ice', 38)}</span>
    </div>
  `;
  stage.appendChild(el);

  const bubble = el.querySelector('#menuBubble');
  let bubbleTimer = null;
  const say = (text) => {
    bubble.textContent = text;
    bubble.classList.add('show');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => bubble.classList.remove('show'), 1800);
  };

  const helloTimer = setTimeout(() => say(frogLine('sprig', 'hello')), 900);

  el.querySelector('#mascot').addEventListener('click', () => {
    Sound.ensure();
    Sound.ribbit();
    say(frogLine('sprig', 'hello'));
    const anim = el.querySelector('#mascot .frog-body-anim');
    const perch = el.querySelector('#mascot');
    perch.classList.remove('cheer');
    anim.style.animation = 'frogCheer 0.55s cubic-bezier(.34,1.8,.5,1) 1';
    setTimeout(() => (anim.style.animation = ''), 600);
  });

  el.querySelector('#playBtn').addEventListener('click', () => {
    Sound.ensure();
    Sound.button();
    controller.gotoMap();
  });

  const soundBtn = el.querySelector('#soundBtn');
  soundBtn.addEventListener('click', () => {
    Sound.ensure();
    const muted = Sound.toggleMute();
    soundBtn.textContent = muted ? '🔇' : '🔊';
    if (!muted) Sound.button();
  });

  // Golden pineapple → 3 clicks → cheat unlock
  let pineClicks = 0;
  let pineTimer = null;
  el.querySelector('#goldenPine').addEventListener('click', () => {
    pineClicks++;
    clearTimeout(pineTimer);
    pineTimer = setTimeout(() => { pineClicks = 0; }, 1200);
    if (pineClicks >= 3) {
      pineClicks = 0;
      Sound.ensure();
      const pw = prompt('Enter unlock password:');
      if (pw && pw.toLowerCase() === 'ribbit') {
        controller.saveData.allUnlocked = true;
        controller.persist();
        say('All levels unlocked!');
      }
    }
  });

  el.querySelector('#resetBtn').addEventListener('click', () => {
    Sound.button();
    if (confirm('Reset all level progress?')) {
      controller.saveData = { stars: {} };
      controller.persist();
      say('Fresh start! Ribbit!');
    }
  });

  return () => clearTimeout(helloTimer);
}

function palmSVG(h) {
  return `<svg width="${h}" height="${h}" viewBox="0 0 100 100">
    <path d="M 48 96 Q 44 60 50 34" stroke="#8a5a30" stroke-width="9" fill="none" stroke-linecap="round"/>
    <path d="M 48 96 Q 44 60 50 34" stroke="#a5713f" stroke-width="4" fill="none" stroke-linecap="round" stroke-dasharray="3 8"/>
    <g fill="#3fae4c" stroke="#2c8a3e" stroke-width="2.5">
      <path d="M 50 34 Q 20 20 6 34 Q 26 40 50 34 Z"/>
      <path d="M 50 34 Q 80 20 94 34 Q 74 40 50 34 Z"/>
      <path d="M 50 34 Q 30 8 10 12 Q 30 28 50 34 Z"/>
      <path d="M 50 34 Q 70 8 90 12 Q 70 28 50 34 Z"/>
      <path d="M 50 34 Q 50 4 42 0 Q 58 10 50 34 Z"/>
    </g>
    <circle cx="44" cy="40" r="6" fill="#ffc53d" stroke="#c98a00" stroke-width="2"/>
    <circle cx="56" cy="42" r="5" fill="#ffc53d" stroke="#c98a00" stroke-width="2"/>
  </svg>`;
}
