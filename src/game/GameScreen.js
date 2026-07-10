// Gameplay screen: wires the BoardView to the HUD, frog mascot,
// Mega Frog power meter, pause / victory / defeat overlays and the
// level's win-loss rules.

import { BoardView } from './board/BoardView.js';
import { HUD } from '../components/ui/HUD.js';
import { getLevel, LEVELS } from '../data/levels.js';
import { FROGS, frogLine } from '../data/frogs.js';
import { frogSVG } from '../components/characters/FrogArt.js';
import { pieceIconHTML } from '../components/ui/pieceIcon.js';
import { Sound } from './effects/Sound.js';
import { ParticleSystem } from './effects/Particles.js';

const POWER_MAX = 100;

export function mountGameScreen(stage, controller, { levelId }) {
  const level = getLevel(levelId);
  const frog = FROGS[level.frog];

  const state = {
    moves: level.moves,
    score: 0,
    collected: {},
    power: 0,
    ended: false,
    started: false,
    swapPower: 0,
    clearPower: 0,
    rainbowPower: 0,
    shufflePower: 0,
    // Track permanent power progress across levels
    permanentRainbowPower: parseInt(localStorage.getItem('frogapop_rainbow_power') || '0'),
  };

  const el = document.createElement('div');
  el.className = 'screen';
  el.style.background = 'linear-gradient(180deg, #45cfe4 0%, #7fe4da 45%, #1ba8c9 100%)';
  el.innerHTML = `
    <div class="scene">
      <div class="cloud" style="top:44px;transform:scale(0.8);animation-duration:42s;animation-delay:-12s;opacity:0.75;"></div>
      <div class="cloud" style="top:110px;transform:scale(0.55);animation-duration:56s;animation-delay:-34s;opacity:0.55;"></div>
      <div class="sea" style="height:22%;"></div>
      <div class="island" style="left:-16%;right:-16%;bottom:-10%;height:26%;"></div>
    </div>
  `;
  stage.appendChild(el);

  // centered column keeps HUD/board/frog together on wide screens
  const col = document.createElement('div');
  col.className = 'game-col';
  el.appendChild(col);

  const hud = new HUD(col, level);

  // board
  const boardWrap = document.createElement('div');
  boardWrap.className = 'board-wrap';
  boardWrap.innerHTML = `
    <div class="board-frame" id="boardFrame"><canvas id="boardCanvas"></canvas></div>
    <div class="combo-banner" id="comboBanner"></div>
  `;
  col.appendChild(boardWrap);

  // bottom HUD: frog mascot + power buttons
  const bottom = document.createElement('div');
  bottom.className = 'hud-bottom';
  bottom.innerHTML = `
    <div class="frog-perch" id="frogPerch">${frogSVG(level.frog, { width: 118 })}</div>
    <div class="speech-bubble" id="bubble"></div>
    <div class="power-buttons">
      <button class="frog-power" id="powerBtn" style="--fill:0%">
        <span class="fp-inner">🐸</span>
        <span class="fp-label">FROGGY POWER</span>
      </button>
      <button class="frog-power" id="swapPowerBtn" style="--fill:0%">
        <span class="fp-inner">🔄</span>
        <span class="fp-label">SWAP</span>
      </button>
      <button class="frog-power" id="clearPowerBtn" style="--fill:0%">
        <span class="fp-inner">✨</span>
        <span class="fp-label">CLEAR</span>
      </button>
      <button class="frog-power" id="rainbowPowerBtn" style="--fill:${Math.min(100, (state.permanentRainbowPower / POWER_MAX) * 100)}%">
        <span class="fp-inner">🌈</span>
        <span class="fp-label">RAINBOW</span>
      </button>
      <button class="frog-power" id="shufflePowerBtn" style="--fill:0%">
        <span class="fp-inner">🔀</span>
        <span class="fp-label">SHUFFLE</span>
      </button>
    </div>
  `;
  col.appendChild(bottom);

  const bubble = bottom.querySelector('#bubble');
  const perch = bottom.querySelector('#frogPerch');
  const powerBtn = bottom.querySelector('#powerBtn');
  const swapPowerBtn = bottom.querySelector('#swapPowerBtn');
  const clearPowerBtn = bottom.querySelector('#clearPowerBtn');
  const rainbowPowerBtn = bottom.querySelector('#rainbowPowerBtn');
  const shufflePowerBtn = bottom.querySelector('#shufflePowerBtn');
  const comboBanner = boardWrap.querySelector('#comboBanner');
  const boardFrame = boardWrap.querySelector('#boardFrame');

  // Set initial rainbow power from localStorage
  rainbowPowerBtn.classList.toggle('ready', state.permanentRainbowPower >= POWER_MAX);

  let bubbleTimer = null;
  function say(kind) {
    bubble.textContent = frogLine(level.frog, kind);
    bubble.classList.add('show');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => bubble.classList.remove('show'), 1700);
  }

  function frogCheer() {
    perch.classList.remove('cheer');
    void perch.offsetWidth;
    perch.classList.add('cheer');
  }

  function addPower(n) {
    if (state.ended) return;
    state.power = Math.min(POWER_MAX, state.power + n);
    powerBtn.style.setProperty('--fill', `${(state.power / POWER_MAX) * 100}%`);
    powerBtn.classList.toggle('ready', state.power >= POWER_MAX);
    
    // Other powers charge at different rates
    const swapCharge = n * 0.5;
    state.swapPower = Math.min(POWER_MAX, state.swapPower + swapCharge);
    swapPowerBtn.style.setProperty('--fill', `${(state.swapPower / POWER_MAX) * 100}%`);
    swapPowerBtn.classList.toggle('ready', state.swapPower >= POWER_MAX);
    
    const clearCharge = n * 0.5;
    state.clearPower = Math.min(POWER_MAX, state.clearPower + clearCharge);
    clearPowerBtn.style.setProperty('--fill', `${(state.clearPower / POWER_MAX) * 100}%`);
    clearPowerBtn.classList.toggle('ready', state.clearPower >= POWER_MAX);
    
    // RAINBOW POWER charges MUCH slower (only 10% of normal rate)
    const rainbowCharge = n * 0.1;
    state.permanentRainbowPower = Math.min(POWER_MAX, state.permanentRainbowPower + rainbowCharge);
    // Save to localStorage so it persists
    localStorage.setItem('frogapop_rainbow_power', String(state.permanentRainbowPower));
    rainbowPowerBtn.style.setProperty('--fill', `${(state.permanentRainbowPower / POWER_MAX) * 100}%`);
    rainbowPowerBtn.classList.toggle('ready', state.permanentRainbowPower >= POWER_MAX);
    
    const shuffleCharge = n * 0.4;
    state.shufflePower = Math.min(POWER_MAX, state.shufflePower + shuffleCharge);
    shufflePowerBtn.style.setProperty('--fill', `${(state.shufflePower / POWER_MAX) * 100}%`);
    shufflePowerBtn.classList.toggle('ready', state.shufflePower >= POWER_MAX);
  }

  /* ---------- board view + event wiring ---------- */
  // Pass the level's collect requirements to the board for spawn bias
  const boardView = new BoardView(
    boardWrap.querySelector('#boardCanvas'), 
    {
      canMove: () => state.started && !state.ended && state.moves > 0,
      onMoveUsed: () => {
        state.moves--;
        hud.setMoves(state.moves);
      },
      onScore: (points) => {
        state.score += points;
        hud.setScore(state.score);
      },
      onCollect: (counts) => {
        for (const [t, n] of Object.entries(counts))
          state.collected[t] = (state.collected[t] ?? 0) + n;
        hud.setObjectives(state.collected);
        addPower(Object.values(counts).reduce((a, b) => a + b, 0) * 1.2);
      },
      onCombo: (combo) => {
        const labels = ['', '', 'SWEET!', 'JUICY!', 'TROPICAL!', 'FROG-TASTIC!', 'LEGENDARY!'];
        comboBanner.textContent = `${labels[Math.min(combo, labels.length - 1)]} x${combo}`;
        comboBanner.classList.remove('show');
        void comboBanner.offsetWidth;
        comboBanner.classList.add('show');
        frogCheer();
        if (combo >= 3) say('combo');
        addPower(combo * 6);
      },
      onSpecialCreated: () => { say('special'); addPower(10); },
      onSpecialFired: () => addPower(8),
      onSettled: () => checkEnd(),
    }, 
    levelId,
    level.collect // Pass collect objectives for spawn bias
  );
  
  // Update board frame size attribute for CSS styling
  const boardSize = boardView.board.rows;
  boardFrame.dataset.size = boardSize;
  
  boardView.enabled = false;

  // FROGGY POWER - Stomp
  powerBtn.addEventListener('click', async () => {
    if (state.power < POWER_MAX || state.ended || boardView.busy || !state.started) return;
    state.power = 0;
    powerBtn.style.setProperty('--fill', '0%');
    powerBtn.classList.remove('ready');
    say('power');
    frogCheer();
    await boardView.playFrogPower(level.frog);
  });

  // SWAP POWER - Swap all of one type to another
  swapPowerBtn.addEventListener('click', async () => {
    if (state.swapPower < POWER_MAX || state.ended || boardView.busy || !state.started) return;
    state.swapPower = 0;
    swapPowerBtn.style.setProperty('--fill', '0%');
    swapPowerBtn.classList.remove('ready');
    
    const commonType = boardView.board.mostCommonType();
    const types = boardView.board.types;
    let targetType = commonType;
    const otherTypes = types.filter(t => t !== commonType);
    if (otherTypes.length > 0) {
      targetType = otherTypes[Math.floor(Math.random() * otherTypes.length)];
    }
    
    say('power');
    frogCheer();
    await boardView.playFroggySwap(commonType, targetType);
  });

  // CLEAR POWER - Clear all of one type
  clearPowerBtn.addEventListener('click', async () => {
    if (state.clearPower < POWER_MAX || state.ended || boardView.busy || !state.started) return;
    state.clearPower = 0;
    clearPowerBtn.style.setProperty('--fill', '0%');
    clearPowerBtn.classList.remove('ready');
    
    const commonType = boardView.board.mostCommonType();
    
    say('power');
    frogCheer();
    await boardView.playFroggyClear(commonType);
  });

  // RAINBOW POWER - Turn one type into rainbows (PERMANENT progress, slower charge)
  rainbowPowerBtn.addEventListener('click', async () => {
    if (state.permanentRainbowPower < POWER_MAX || state.ended || boardView.busy || !state.started) return;
    state.permanentRainbowPower = 0;
    localStorage.setItem('frogapop_rainbow_power', '0');
    rainbowPowerBtn.style.setProperty('--fill', '0%');
    rainbowPowerBtn.classList.remove('ready');
    
    const commonType = boardView.board.mostCommonType();
    
    say('power');
    frogCheer();
    await boardView.playFroggyRainbow(commonType);
  });

  // SHUFFLE POWER - Shuffle the board
  shufflePowerBtn.addEventListener('click', async () => {
    if (state.shufflePower < POWER_MAX || state.ended || boardView.busy || !state.started) return;
    state.shufflePower = 0;
    shufflePowerBtn.style.setProperty('--fill', '0%');
    shufflePowerBtn.classList.remove('ready');
    
    say('power');
    frogCheer();
    await boardView.playFroggyShuffle();
  });

  /* ---------- win / lose ---------- */
  function objectivesDone() {
    return Object.entries(level.collect).every(([t, n]) => (state.collected[t] ?? 0) >= n);
  }

  function starsEarned() {
    return level.stars.filter((s) => state.score >= s).length;
  }

  function checkEnd() {
    if (state.ended) return;
    if (objectivesDone()) {
      state.ended = true;
      boardView.enabled = false;
      const bonus = state.moves * 150;
      state.score += bonus;
      hud.setScore(state.score);
      const stars = Math.max(1, starsEarned());
      controller.recordResult(level.id, stars);
      setTimeout(() => showVictory(stars, bonus), 700);
    } else if (state.moves <= 0) {
      state.ended = true;
      boardView.enabled = false;
      setTimeout(showDefeat, 600);
    }
  }

  /* ---------- overlays ---------- */
  function overlay(innerHTML) {
    const ov = document.createElement('div');
    ov.className = 'overlay';
    ov.innerHTML = `<div class="card overlay-card">${innerHTML}</div>`;
    el.appendChild(ov);
    requestAnimationFrame(() => ov.classList.add('show'));
    return ov;
  }

  function closeOverlay(ov) {
    ov.classList.remove('show');
    setTimeout(() => ov.remove(), 260);
  }

  /* level intro */
  function showIntro() {
    const ov = overlay(`
      <div style="width:104px;margin-top:-72px;filter:drop-shadow(0 8px 10px rgba(0,40,20,0.3));">${frogSVG(level.frog, { width: 104 })}</div>
      <div class="card-title" style="font-size:26px;">Level ${level.id} · ${level.name}</div>
      <div class="result-sub">${level.intro}</div>
      <div class="objective-row" style="gap:16px;">
        ${Object.entries(level.collect).map(([t, n]) => `
          <div class="objective-chip">${pieceIconHTML(t, 38)}<span style="font-size:20px;">×${n}</span></div>`).join('')}
      </div>
      <div class="result-sub" style="font-size:14px;">in <b>${level.moves}</b> moves — ${frog.name} the ${frog.species} believes in you!</div>
      <button class="btn btn-green pulse" id="goBtn">LET'S POP!</button>
    `);
    ov.querySelector('#goBtn').addEventListener('click', () => {
      Sound.ensure();
      Sound.button();
      closeOverlay(ov);
      state.started = true;
      boardView.enabled = true;
      say('hello');
    });
  }

  /* pause */
  hud.pauseButton.addEventListener('click', () => {
    if (state.ended) return;
    Sound.button();
    boardView.enabled = false;
    const ov = overlay(`
      <div class="card-title" style="font-size:32px;">Paused</div>
      <div style="width:90px;">${frogSVG(level.frog, { width: 90 })}</div>
      <button class="btn btn-green" id="resumeBtn">RESUME</button>
      <div class="settings-row">
        <button class="btn btn-blue btn-round" id="sndBtn">${Sound.muted ? '🔇' : '🔊'}</button>
        <button class="btn btn-pink btn-small" id="restartBtn">↺ RETRY</button>
        <button class="btn btn-blue btn-small" id="mapBtn">🗺️ MAP</button>
      </div>
    `);
    ov.querySelector('#resumeBtn').addEventListener('click', () => {
      Sound.button();
      closeOverlay(ov);
      if (state.started && !state.ended) boardView.enabled = true;
    });
    ov.querySelector('#sndBtn').addEventListener('click', (e) => {
      const muted = Sound.toggleMute();
      e.target.textContent = muted ? '🔇' : '🔊';
      if (!muted) Sound.button();
    });
    ov.querySelector('#restartBtn').addEventListener('click', () => { Sound.button(); controller.gotoLevel(level.id); });
    ov.querySelector('#mapBtn').addEventListener('click', () => { Sound.button(); controller.gotoMap(); });
  });

  /* victory */
  function showVictory(stars, bonus) {
    Sound.win();
    launchConfetti();
    const next = LEVELS.find((l) => l.id === level.id + 1);
    const ov = overlay(`
      <div class="result-title">VICTORY!</div>
      <div class="stars-row">
        ${[0, 1, 2].map((i) => `
          <span class="big-star ${i === 1 ? 'mid' : ''} ${i < stars ? '' : 'dim'}"
            style="animation-delay:${0.3 + i * 0.35}s">⭐</span>`).join('')}
      </div>
      <div class="frog-chorus">
        <span class="fc-a">${frogSVG(level.frog, { pose: 'cheer', width: 84 })}</span>
        <span class="fc-b">${frogSVG(randomOtherFrog(level.frog), { pose: 'cheer', width: 84 })}</span>
        <span class="fc-c">${frogSVG(randomOtherFrog(level.frog), { pose: 'cheer', width: 84 })}</span>
      </div>
      <div class="result-sub">"${frogLine(level.frog, 'win')}"</div>
      <div class="result-score">${state.score.toLocaleString()} pts</div>
      ${bonus ? `<div class="result-sub" style="font-size:14px;">includes +${bonus.toLocaleString()} move bonus</div>` : ''}
      <div class="settings-row">
        <button class="btn btn-blue btn-small" id="vMapBtn">🗺️ MAP</button>
        ${next ? `<button class="btn btn-green pulse" id="nextBtn">NEXT ▶</button>`
               : `<button class="btn btn-pink" id="doneBtn">🏆 THE END!</button>`}
      </div>
    `);
    ov.querySelectorAll('.big-star:not(.dim)').forEach((s, i) => {
      s.classList.add('slam');
      setTimeout(() => Sound.star(), 350 + i * 350);
    });
    ov.querySelector('#vMapBtn').addEventListener('click', () => { Sound.button(); controller.gotoMap(); });
    ov.querySelector('#nextBtn')?.addEventListener('click', () => { Sound.button(); controller.gotoLevel(level.id + 1); });
    ov.querySelector('#doneBtn')?.addEventListener('click', () => { Sound.button(); controller.gotoMap(); });
  }

  /* defeat */
  function showDefeat() {
    Sound.lose();
    const encourage = [
      'So close! The pineapples got lucky this time.',
      'Every great popper misses one. Shake it off!',
      "The frogs still believe in you. One more try?",
    ];
    const ov = overlay(`
      <div class="result-title" style="background:linear-gradient(180deg,#9fd4ff 20%,#3a7bd5);-webkit-background-clip:text;background-clip:text;-webkit-text-stroke:2.5px #1e3a6e;">OUT OF MOVES</div>
      <div style="width:100px;">${frogSVG(level.frog, { pose: 'sad', width: 100 })}</div>
      <div class="result-sub">"${frogLine(level.frog, 'lose')}"</div>
      <div class="result-sub" style="font-size:14px;">${encourage[(Math.random() * encourage.length) | 0]}</div>
      <div class="result-score">${state.score.toLocaleString()} pts</div>
      <div class="settings-row">
        <button class="btn btn-blue btn-small" id="dMapBtn">🗺️ MAP</button>
        <button class="btn btn-green pulse" id="retryBtn">↺ RETRY</button>
      </div>
    `);
    ov.querySelector('#retryBtn').addEventListener('click', () => { Sound.button(); controller.gotoLevel(level.id); });
    ov.querySelector('#dMapBtn').addEventListener('click', () => { Sound.button(); controller.gotoMap(); });
  }

  /* confetti burst over the whole stage */
  let confettiRaf = null;
  function launchConfetti() {
    const cv = document.createElement('canvas');
    cv.className = 'fx-canvas';
    cv.width = stage.clientWidth * 2;
    cv.height = stage.clientHeight * 2;
    el.appendChild(cv);
    const ctx = cv.getContext('2d');
    ctx.scale(2, 2);
    const ps = new ParticleSystem();
    const W = stage.clientWidth, H = stage.clientHeight;
    let bursts = 0;
    const burst = () => {
      ps.confetti(W * (0.2 + Math.random() * 0.6), H * 0.65, { count: 44, speed: 620 });
      if (++bursts < 5) setTimeout(burst, 420);
    };
    burst();
    let last = performance.now();
    const loop = (ts) => {
      const dt = Math.min(0.05, (ts - last) / 1000);
      last = ts;
      ps.update(dt);
      ctx.clearRect(0, 0, W, H);
      ps.draw(ctx);
      if (ps.count > 0 || bursts < 5) confettiRaf = requestAnimationFrame(loop);
      else cv.remove();
    };
    confettiRaf = requestAnimationFrame(loop);
  }

  showIntro();

  if (window.__frogapop) Object.assign(window.__frogapop, { boardView, state, level });

  return () => {
    boardView.destroy();
    hud.destroy();
    clearTimeout(bubbleTimer);
    if (confettiRaf) cancelAnimationFrame(confettiRaf);
  };
}

function randomOtherFrog(exclude) {
  const ids = Object.keys(FROGS).filter((f) => f !== exclude);
  return ids[(Math.random() * ids.length) | 0];
}