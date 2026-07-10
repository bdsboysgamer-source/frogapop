import { BoardView } from './board/BoardView.js';
import { HUD } from '../components/ui/HUD.js';
import { getLevel, LEVELS, getWorld } from '../data/levels.js';
import { FROGS, frogLine } from '../data/frogs.js';
import { frogSVG } from '../components/characters/FrogArt.js';
import { pieceIconHTML } from '../components/ui/pieceIcon.js';
import { Sound } from './effects/Sound.js';
import { ParticleSystem } from './effects/Particles.js';

const POWER_MAX = 100;

const POWER_META = {
  stomp:   { name: 'FROGGY POWER', icon: '🐸', label: 'STOMP' },
  swap:    { name: 'SWAP',         icon: '🔄', label: 'SWAP' },
  clear:   { name: 'CLEAR',        icon: '✨', label: 'CLEAR' },
  rainbow: { name: 'RAINBOW',      icon: '🌈', label: 'RAINBOW' },
  shuffle: { name: 'SHUFFLE',      icon: '🔀', label: 'SHUFFLE' },
};

export function mountGameScreen(stage, controller, { levelId }) {
  const level = getLevel(levelId);
  const frog = FROGS[level.frog];
  const world = getWorld(levelId);

  const state = {
    score: 0,
    collected: {},
    power: 0,
    ended: false,
    started: false,
    swapPower: 0,
    clearPower: 0,
    rainbowPower: 0,
    shufflePower: 0,
    permanentRainbowPower: parseInt(localStorage.getItem('frogapop_rainbow_power') || '0'),
  };

  const el = document.createElement('div');
  el.className = 'screen';
  el.style.background = world.bg;
  el.innerHTML = `
    <div class="scene">
      <div class="cloud" style="top:44px;transform:scale(0.8);animation-duration:42s;animation-delay:-12s;opacity:0.75;"></div>
      <div class="cloud" style="top:110px;transform:scale(0.55);animation-duration:56s;animation-delay:-34s;opacity:0.55;"></div>
      <div class="sea" style="height:22%;"></div>
      <div class="island" style="left:-16%;right:-16%;bottom:-10%;height:26%;"></div>
    </div>
  `;
  stage.appendChild(el);

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

  // Check which powers are unlocked
  const unlocked = {
    stomp: true,
    swap: controller.powerUnlocked('swap'),
    clear: controller.powerUnlocked('clear'),
    rainbow: controller.powerUnlocked('rainbow'),
    shuffle: controller.powerUnlocked('shuffle'),
  };

  // bottom HUD: frog mascot + power buttons
  const bottom = document.createElement('div');
  bottom.className = 'hud-bottom';
  const powerBtns = Object.entries(POWER_META).filter(([id]) => id !== 'stomp')
    .map(([id, m]) => {
      const u = unlocked[id];
      return `<button class="frog-power${u ? '' : ' locked'}" id="${id}PowerBtn" style="--fill:0%">
        <span class="fp-inner">${u ? m.icon : '🔒'}</span>
        <span class="fp-label">${u ? m.label : 'LOCKED'}</span>
      </button>`;
    }).join('');
  bottom.innerHTML = `
    <div class="frog-perch" id="frogPerch">${frogSVG(level.frog, { width: 118 })}</div>
    <div class="speech-bubble" id="bubble"></div>
    <div class="power-buttons">
      <button class="frog-power" id="stompPowerBtn" style="--fill:0%">
        <span class="fp-inner">🐸</span>
        <span class="fp-label">STOMP</span>
      </button>
      ${powerBtns}
    </div>
  `;
  col.appendChild(bottom);

  const bubble = bottom.querySelector('#bubble');
  const perch = bottom.querySelector('#frogPerch');
  const powerBtnsEls = {};
  for (const id of Object.keys(POWER_META)) {
    powerBtnsEls[id] = bottom.querySelector(`#${id}PowerBtn`);
  }
  const comboBanner = boardWrap.querySelector('#comboBanner');
  const boardFrame = boardWrap.querySelector('#boardFrame');

  powerBtnsEls.rainbow?.classList.toggle('ready', state.permanentRainbowPower >= POWER_MAX);

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
    setFill('stomp', state.power);

    const swapCharge = n * 0.5;
    state.swapPower = Math.min(POWER_MAX, state.swapPower + swapCharge);
    setFill('swap', state.swapPower);

    const clearCharge = n * 0.5;
    state.clearPower = Math.min(POWER_MAX, state.clearPower + clearCharge);
    setFill('clear', state.clearPower);

    const rainbowCharge = n * 0.1;
    state.permanentRainbowPower = Math.min(POWER_MAX, state.permanentRainbowPower + rainbowCharge);
    localStorage.setItem('frogapop_rainbow_power', String(state.permanentRainbowPower));
    setFill('rainbow', state.permanentRainbowPower, true);

    const shuffleCharge = n * 0.4;
    state.shufflePower = Math.min(POWER_MAX, state.shufflePower + shuffleCharge);
    setFill('shuffle', state.shufflePower);
  }

  function setFill(id, val, permanent = false) {
    const el = powerBtnsEls[id];
    if (!el) return;
    el.style.setProperty('--fill', `${(val / POWER_MAX) * 100}%`);
    el.classList.toggle('ready', val >= POWER_MAX);
  }

  /* ---------- board view + event wiring ---------- */
  const boardView = new BoardView(
    boardWrap.querySelector('#boardCanvas'),
    {
      canMove: () => state.started && !state.ended && state.moves > 0,
      onMoveUsed: () => {
        state.moves--;
        boardView.board.movesLeft = state.moves;
        hud.setMoves(state.moves);
      },
      onScore: (points) => { state.score += points; hud.setScore(state.score); },
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
    level.collect
  );

  state.moves = level.moves + boardView.board.moveBonus();
  boardView.board.totalMoves = state.moves;
  boardView.board.movesLeft = state.moves;
  hud.setMoves(state.moves);

  const boardSize = boardView.board.rows;
  boardFrame.dataset.size = boardSize;
  boardView.enabled = false;

  // Power click handlers (only if unlocked)
  function canUsePower(id) {
    if (!unlocked[id]) return false;
    if (id === 'stomp') return state.power >= POWER_MAX;
    if (id === 'swap') return state.swapPower >= POWER_MAX;
    if (id === 'clear') return state.clearPower >= POWER_MAX;
    if (id === 'rainbow') return state.permanentRainbowPower >= POWER_MAX;
    if (id === 'shuffle') return state.shufflePower >= POWER_MAX;
    return false;
  }

  function usePower(id, fn) {
    return async () => {
      if (!canUsePower(id) || state.ended || boardView.busy || !state.started) return;
      if (id === 'stomp') { state.power = 0; setFill('stomp', 0); }
      if (id === 'swap') { state.swapPower = 0; setFill('swap', 0); }
      if (id === 'clear') { state.clearPower = 0; setFill('clear', 0); }
      if (id === 'rainbow') {
        state.permanentRainbowPower = 0;
        localStorage.setItem('frogapop_rainbow_power', '0');
        setFill('rainbow', 0);
      }
      if (id === 'shuffle') { state.shufflePower = 0; setFill('shuffle', 0); }
      say('power');
      frogCheer();
      await fn();
    };
  }

  powerBtnsEls.stomp.addEventListener('click', usePower('stomp', async () => {
    await boardView.playFrogPower(level.frog);
  }));

  powerBtnsEls.swap.addEventListener('click', usePower('swap', async () => {
    const commonType = boardView.board.mostCommonType();
    const types = boardView.board.types;
    const otherTypes = types.filter(t => t !== commonType);
    const targetType = otherTypes.length > 0
      ? otherTypes[Math.floor(Math.random() * otherTypes.length)]
      : commonType;
    await boardView.playFroggySwap(commonType, targetType);
  }));

  powerBtnsEls.clear.addEventListener('click', usePower('clear', async () => {
    await boardView.playFroggyClear(boardView.board.mostCommonType());
  }));

  powerBtnsEls.rainbow.addEventListener('click', usePower('rainbow', async () => {
    await boardView.playFroggyRainbow(boardView.board.mostCommonType());
  }));

  powerBtnsEls.shuffle.addEventListener('click', usePower('shuffle', async () => {
    await boardView.playFroggyShuffle();
  }));

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

  function showIntro() {
    const ov = overlay(`
      <div style="width:104px;margin-top:-72px;filter:drop-shadow(0 8px 10px rgba(0,40,20,0.3));">${frogSVG(level.frog, { width: 104 })}</div>
      <div class="card-title" style="font-size:26px;">${world.name} · Level ${level.id}</div>
      <div class="card-title" style="font-size:22px;">${level.name}</div>
      <div class="result-sub">${level.intro}</div>
      <div class="objective-row" style="gap:16px;">
        ${Object.entries(level.collect).map(([t, n]) => `
          <div class="objective-chip">${pieceIconHTML(t, 38)}<span style="font-size:20px;">×${n}</span></div>`).join('')}
      </div>
      <div class="result-sub" style="font-size:14px;">in <b>${state.moves}</b> moves — ${frog.name} the ${frog.species} believes in you!</div>
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

  /* confetti */
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
