// Gameplay screen — mode-aware.
//   level    : campaign level (objectives + moves + stars)
//   daily    : one rotating seeded challenge per day (own leaderboard)
//   endless  : no move limit, chase the highest score, finish when ready
//   timetrial: 60 seconds, score as much as possible
//
// Power-ups come from the player's equipped loadout (bought at Scai's
// stall). Each charges from play and fires when full.

import { BoardView } from './board/BoardView.js';
import { HUD } from '../components/ui/HUD.js';
import { getLevel, LEVELS, getWorld } from '../data/levels.js';
import { getSpawnableForLevel } from '../data/pieceTypes.js';
import { FROGS, frogLine } from '../data/frogs.js';
import { frogSVG } from '../components/characters/FrogArt.js';
import { pieceIconHTML } from '../components/ui/pieceIcon.js';
import { POWERUPS } from '../data/powerups.js';
import { Sound } from './effects/Sound.js';
import { ParticleSystem } from './effects/Particles.js';
import { splitmix } from '../components/menus/mapBiomes.js';
import { submitScore } from '../net/leaderboard.js';

const TIME_TRIAL_SECONDS = 60;

const FROG_IDS = Object.keys(FROGS);

export function mountGameScreen(stage, controller, params = {}) {
  const mode = params.mode || 'level';
  const cfg = buildModeConfig(mode, params);
  const level = cfg.level;
  const frogId = level.frog;
  const frog = FROGS[frogId];

  const state = {
    score: 0,
    collected: {},
    ended: false,
    started: false,
    moves: level.moves,
    timeLeft: TIME_TRIAL_SECONDS,
    coinsAtStart: controller.coins,
  };

  const el = document.createElement('div');
  el.className = 'screen game-screen';
  el.dataset.mode = mode;
  el.innerHTML = `
    <div class="scene game-scene">
      <div class="cloud" style="top:44px;transform:scale(0.8);animation-duration:42s;animation-delay:-12s;opacity:0.6;"></div>
      <div class="cloud" style="top:120px;transform:scale(0.55);animation-duration:56s;animation-delay:-34s;opacity:0.4;"></div>
    </div>
  `;
  stage.appendChild(el);

  const col = document.createElement('div');
  col.className = 'game-col';
  el.appendChild(col);

  /* ---------- top HUD (mode-specific) ---------- */
  let hud = null;              // HUD instance for level/daily
  const top = document.createElement('div');
  top.className = 'hud-top mode-top';
  col.appendChild(top);

  if (cfg.useObjectives) {
    hud = new HUD(col, level);
    top.remove(); // HUD builds its own top rows
  } else {
    top.innerHTML = `
      <button class="btn btn-blue btn-round" id="pauseBtn" style="width:52px;height:52px;font-size:20px;align-self:center;">⏸</button>
      <div class="hud-pill" style="flex:0 0 auto;min-width:96px;">
        <div class="hud-label">${mode === 'timetrial' ? 'Time' : 'Run'}</div>
        <div class="hud-value" id="timerVal" style="font-size:24px;">${mode === 'timetrial' ? formatTime(state.timeLeft) : '∞'}</div>
      </div>
      <div class="hud-pill" style="flex:1;">
        <div class="hud-label">Score</div>
        <div class="hud-value" id="scoreVal" style="font-size:24px;">0</div>
      </div>
      ${mode === 'endless' ? `<button class="btn btn-pink btn-small" id="finishBtn" style="align-self:center;">FINISH</button>` : ''}
    `;
  }

  const coinBar = document.createElement('div');
  coinBar.className = 'game-coinbar';
  coinBar.innerHTML = `<span class="coin-chip">🪙 <b id="coinVal">${controller.coins}</b></span>`;
  col.appendChild(coinBar);

  /* ---------- board ---------- */
  const boardWrap = document.createElement('div');
  boardWrap.className = 'board-wrap';
  boardWrap.innerHTML = `
    <div class="board-frame" id="boardFrame"><canvas id="boardCanvas"></canvas></div>
    <div class="combo-banner" id="comboBanner"></div>
  `;
  col.appendChild(boardWrap);
  const comboBanner = boardWrap.querySelector('#comboBanner');
  const boardFrame = boardWrap.querySelector('#boardFrame');

  /* ---------- bottom: frog mascot + equipped power-ups ---------- */
  const loadout = controller.loadout;           // up to 4 owned ids
  const meters = {};                            // id -> charge value
  loadout.forEach((id) => { meters[id] = 0; });

  const bottom = document.createElement('div');
  bottom.className = 'hud-bottom';
  bottom.innerHTML = `
    <div class="frog-perch" id="frogPerch">${frogSVG(frogId, { width: 108 })}</div>
    <div class="speech-bubble" id="bubble"></div>
    <div class="power-buttons" id="powerButtons">
      ${loadout.length ? loadout.map((id) => {
        const p = POWERUPS[id];
        return `<button class="frog-power" data-power="${id}" style="--fill:0%;--ptint:${p.tint};" title="${p.name}">
          <span class="fp-inner">${p.icon}</span>
          <span class="fp-label">${p.name.split(' ')[0]}</span>
        </button>`;
      }).join('') : `<div class="no-powers">No power-ups equipped — visit Scai's stall! 🛖</div>`}
    </div>
  `;
  col.appendChild(bottom);

  const bubble = bottom.querySelector('#bubble');
  const perch = bottom.querySelector('#frogPerch');
  const powerEls = {};
  bottom.querySelectorAll('.frog-power').forEach((b) => { powerEls[b.dataset.power] = b; });

  let bubbleTimer = null;
  function say(kind) {
    bubble.textContent = frogLine(frogId, kind);
    bubble.classList.add('show');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => bubble.classList.remove('show'), 1700);
  }
  function frogCheer() {
    perch.classList.remove('cheer'); void perch.offsetWidth; perch.classList.add('cheer');
  }

  /* ---------- power charging ---------- */
  function chargePowers(amount) {
    for (const id of loadout) {
      const max = POWERUPS[id].charge;
      meters[id] = Math.min(max, meters[id] + amount);
      const btn = powerEls[id];
      if (btn) {
        btn.style.setProperty('--fill', `${(meters[id] / max) * 100}%`);
        btn.classList.toggle('ready', meters[id] >= max);
      }
    }
  }

  async function firePower(id) {
    const p = POWERUPS[id];
    if (!p || meters[id] < p.charge || state.ended || boardView.busy || !state.started) return;
    meters[id] = 0;
    powerEls[id].style.setProperty('--fill', '0%');
    powerEls[id].classList.remove('ready');
    say('power'); frogCheer();
    const bv = boardView;
    const common = bv.board.mostCommonType();
    const others = bv.board.types.filter((t) => t !== common);
    const target = others.length ? others[(Math.random() * others.length) | 0] : common;
    switch (p.method) {
      case 'stomp': return bv.playFrogPower(frogId);
      case 'shuffle': return bv.playFroggyShuffle();
      case 'swap': return bv.playFroggySwap(common, target);
      case 'clear': return bv.playFroggyClear(common);
      case 'rainbow': return bv.playFroggyRainbow(common);
      case 'lily': return bv.playLilyBomb();
      case 'cross': return bv.playCrossStrike();
      case 'tide': return bv.playTidalWave();
    }
  }
  for (const id of loadout) powerEls[id].addEventListener('click', () => firePower(id));

  /* ---------- score + coin display ---------- */
  const scoreEl = hud ? null : top.querySelector('#scoreVal');
  const coinValEl = coinBar.querySelector('#coinVal');
  let displayScore = 0, scoreRaf = null;
  function setScore(s) {
    state.score = s;
    if (hud) { hud.setScore(s); return; }
    const tick = () => {
      const diff = state.score - displayScore;
      if (Math.abs(diff) < 1) { displayScore = state.score; scoreEl.textContent = Math.round(displayScore).toLocaleString(); scoreRaf = null; return; }
      displayScore += diff * 0.16;
      scoreEl.textContent = Math.round(displayScore).toLocaleString();
      scoreRaf = requestAnimationFrame(tick);
    };
    if (!scoreRaf) tick();
  }

  /* ---------- board view + events ---------- */
  const boardView = new BoardView(
    boardWrap.querySelector('#boardCanvas'),
    {
      canMove: () => state.started && !state.ended && (cfg.hasMoves ? state.moves > 0 : true) && (mode !== 'timetrial' || state.timeLeft > 0),
      onMoveUsed: () => {
        if (!cfg.hasMoves) return;
        state.moves--;
        boardView.board.movesLeft = state.moves;
        hud?.setMoves(state.moves);
      },
      onScore: (points) => setScore(state.score + points),
      onCollect: (counts) => {
        const total = Object.values(counts).reduce((a, b) => a + b, 0);
        for (const [t, n] of Object.entries(counts)) state.collected[t] = (state.collected[t] ?? 0) + n;
        if (cfg.useObjectives) hud.setObjectives(state.collected);
        chargePowers(total * 1.15);
      },
      onCombo: (combo) => {
        const labels = ['', '', 'SWEET!', 'JUICY!', 'TROPICAL!', 'FROG-TASTIC!', 'LEGENDARY!'];
        comboBanner.textContent = `${labels[Math.min(combo, labels.length - 1)]} x${combo}`;
        comboBanner.classList.remove('show'); void comboBanner.offsetWidth; comboBanner.classList.add('show');
        frogCheer();
        if (combo >= 3) say('combo');
        chargePowers(combo * 2.2);
      },
      onSpecialCreated: () => { say('special'); chargePowers(9); },
      onSpecialFired: () => chargePowers(6),
      onSettled: () => checkEnd(),
    },
    cfg.boardLevelId,
    cfg.neededTypes
  );

  if (cfg.hasMoves) {
    state.moves = level.moves + boardView.board.moveBonus();
    boardView.board.totalMoves = state.moves;
    boardView.board.movesLeft = state.moves;
    hud?.setMoves(state.moves);
  } else {
    boardView.board.totalMoves = 999; boardView.board.movesLeft = 999;
  }
  boardFrame.dataset.size = boardView.board.rows;
  boardView.enabled = false;

  /* ---------- pause ---------- */
  const pauseBtn = hud ? hud.pauseButton : top.querySelector('#pauseBtn');
  pauseBtn.addEventListener('click', () => {
    if (state.ended) return;
    Sound.button();
    boardView.enabled = false;
    stopTimer();
    const ov = overlay(`
      <div class="card-title" style="font-size:30px;">Paused</div>
      <div style="width:84px;">${frogSVG(frogId, { width: 84 })}</div>
      <button class="btn btn-green" id="resumeBtn">RESUME</button>
      <div class="settings-row">
        <button class="btn btn-blue btn-round" id="sndBtn">${Sound.muted ? '🔇' : '🔊'}</button>
        ${mode === 'level' || mode === 'daily' ? `<button class="btn btn-pink btn-small" id="restartBtn">↺ RETRY</button>` : ''}
        <button class="btn btn-blue btn-small" id="exitBtn">🏠 EXIT</button>
      </div>`);
    ov.querySelector('#resumeBtn').addEventListener('click', () => {
      Sound.button(); closeOverlay(ov);
      if (state.started && !state.ended) { boardView.enabled = true; if (mode === 'timetrial') startTimer(); }
    });
    ov.querySelector('#sndBtn').addEventListener('click', (e) => { const m = Sound.toggleMute(); e.target.textContent = m ? '🔇' : '🔊'; if (!m) Sound.button(); });
    ov.querySelector('#restartBtn')?.addEventListener('click', () => { Sound.button(); restart(); });
    ov.querySelector('#exitBtn').addEventListener('click', () => { Sound.button(); exit(); });
  });

  if (mode === 'endless') top.querySelector('#finishBtn')?.addEventListener('click', () => { if (state.started && !state.ended) endEndlessOrTrial(); });

  function restart() {
    if (mode === 'level' || mode === 'daily') controller.gotoLevel(level.id);
    else if (mode === 'endless') controller.gotoEndless();
    else if (mode === 'timetrial') controller.gotoTimeTrial();
  }
  function exit() {
    if (mode === 'level') controller.gotoMap();
    else controller.gotoMenu();
  }

  /* ---------- time trial timer ---------- */
  let timerId = null;
  function startTimer() {
    if (mode !== 'timetrial' || timerId) return;
    let last = performance.now();
    timerId = setInterval(() => {
      const now = performance.now();
      state.timeLeft -= (now - last) / 1000; last = now;
      const tEl = top.querySelector('#timerVal');
      if (state.timeLeft <= 0) {
        state.timeLeft = 0; tEl.textContent = '0:00';
        stopTimer(); endEndlessOrTrial();
      } else {
        tEl.textContent = formatTime(state.timeLeft);
        tEl.classList.toggle('warn', state.timeLeft <= 10);
      }
    }, 100);
  }
  function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }

  /* ---------- end conditions ---------- */
  function objectivesDone() {
    return Object.entries(level.collect).every(([t, n]) => (state.collected[t] ?? 0) >= n);
  }
  function starsEarned() { return level.stars.filter((s) => state.score >= s).length; }

  function checkEnd() {
    if (state.ended) return;
    if (cfg.useObjectives) {
      if (objectivesDone()) {
        state.ended = true; boardView.enabled = false;
        const bonus = state.moves * 150;
        setScore(state.score + bonus);
        const stars = Math.max(1, starsEarned());
        const coins = mode === 'daily' ? finishDaily() : controller.recordResult(level.id, stars, state.score);
        submitScore({ mode, sub: cfg.sub, score: state.score, account: controller.account });
        setTimeout(() => showVictory(stars, bonus, coins), 650);
      } else if (state.moves <= 0) {
        state.ended = true; boardView.enabled = false;
        setTimeout(showDefeat, 550);
      }
    }
    // endless / timetrial end only via Finish / timer
  }

  function finishDaily() {
    const s = controller.saveData.daily;
    s.date = cfg.sub; s.played = true;
    if (state.score > (s.best || 0)) s.best = state.score;
    controller.addCoins(30);
    controller.persist();
    return 30;
  }

  function endEndlessOrTrial() {
    if (state.ended) return;
    state.ended = true; boardView.enabled = false; stopTimer();
    const best = mode === 'endless' ? controller.recordEndless(state.score) : controller.recordTimeTrial(state.score);
    const coins = controller.coins - state.coinsAtStart;
    submitScore({ mode, sub: cfg.sub, score: state.score, account: controller.account });
    setTimeout(() => showRunResult(best, coins), 500);
  }

  /* ---------- overlays ---------- */
  function overlay(inner) {
    const ov = document.createElement('div');
    ov.className = 'overlay';
    ov.innerHTML = `<div class="card overlay-card">${inner}</div>`;
    el.appendChild(ov);
    requestAnimationFrame(() => ov.classList.add('show'));
    return ov;
  }
  function closeOverlay(ov) { ov.classList.remove('show'); setTimeout(() => ov.remove(), 260); }

  function refreshCoins() { coinValEl.textContent = controller.coins; }

  function showIntro() {
    const objHTML = cfg.useObjectives
      ? `<div class="objective-row" style="gap:14px;">${Object.entries(level.collect).map(([t, n]) => `<div class="objective-chip">${pieceIconHTML(t, 34)}<span style="font-size:19px;">×${n}</span></div>`).join('')}</div>`
      : `<div class="result-sub">${cfg.introLine}</div>`;
    const ov = overlay(`
      <div style="width:96px;margin-top:-64px;filter:drop-shadow(0 8px 10px rgba(0,40,20,0.3));">${frogSVG(frogId, { width: 96 })}</div>
      <div class="card-title" style="font-size:24px;">${cfg.title}</div>
      ${cfg.subtitle ? `<div class="card-title" style="font-size:19px;">${cfg.subtitle}</div>` : ''}
      ${objHTML}
      <button class="btn btn-green pulse" id="goBtn">${cfg.startLabel}</button>
    `);
    ov.querySelector('#goBtn').addEventListener('click', () => {
      Sound.ensure(); Sound.button(); closeOverlay(ov);
      state.started = true; boardView.enabled = true;
      if (mode === 'timetrial') startTimer();
      say('hello');
    });
  }

  function showVictory(stars, bonus, coins) {
    Sound.win(); launchConfetti(); refreshCoins();
    const next = mode === 'level' ? LEVELS.find((l) => l.id === level.id + 1) : null;
    const ov = overlay(`
      <div class="result-title">${mode === 'daily' ? 'DAILY DONE!' : 'VICTORY!'}</div>
      ${cfg.useObjectives && mode !== 'daily' ? `<div class="stars-row">${[0, 1, 2].map((i) => `<span class="big-star ${i === 1 ? 'mid' : ''} ${i < stars ? '' : 'dim'}" style="animation-delay:${0.3 + i * 0.35}s">⭐</span>`).join('')}</div>` : ''}
      <div class="result-score">${state.score.toLocaleString()} pts</div>
      <div class="coin-reward">+${coins} 🪙</div>
      <div class="result-sub">"${frogLine(frogId, 'win')}"</div>
      <div class="settings-row" style="flex-wrap:wrap;justify-content:center;">
        <button class="btn btn-blue btn-small" id="exitBtn">${mode === 'level' ? '🗺️ MAP' : '🏠 HOME'}</button>
        <button class="btn btn-pink btn-small" id="lbBtn">🏆 RANKS</button>
        ${next ? `<button class="btn btn-green pulse btn-small" id="nextBtn">NEXT ▶</button>` : ''}
      </div>
    `);
    ov.querySelectorAll('.big-star:not(.dim)').forEach((s, i) => { s.classList.add('slam'); setTimeout(() => Sound.star(), 350 + i * 350); });
    ov.querySelector('#exitBtn').addEventListener('click', () => { Sound.button(); exit(); });
    ov.querySelector('#lbBtn').addEventListener('click', () => { Sound.button(); controller.gotoLeaderboard({ mode, sub: cfg.sub, title: cfg.title }); });
    ov.querySelector('#nextBtn')?.addEventListener('click', () => { Sound.button(); controller.gotoLevel(level.id + 1); });
  }

  function showDefeat() {
    Sound.lose();
    const ov = overlay(`
      <div class="result-title" style="filter:hue-rotate(180deg);">OUT OF MOVES</div>
      <div style="width:92px;">${frogSVG(frogId, { pose: 'sad', width: 92 })}</div>
      <div class="result-sub">"${frogLine(frogId, 'lose')}"</div>
      <div class="result-score">${state.score.toLocaleString()} pts</div>
      <div class="settings-row">
        <button class="btn btn-blue btn-small" id="exitBtn">${mode === 'level' ? '🗺️ MAP' : '🏠 HOME'}</button>
        <button class="btn btn-green pulse" id="retryBtn">↺ RETRY</button>
      </div>
    `);
    ov.querySelector('#retryBtn').addEventListener('click', () => { Sound.button(); restart(); });
    ov.querySelector('#exitBtn').addEventListener('click', () => { Sound.button(); exit(); });
  }

  function showRunResult(isBest, coins) {
    Sound.win(); if (isBest) launchConfetti(); refreshCoins();
    const label = mode === 'endless' ? 'ENDLESS RUN' : 'TIME UP!';
    const bestVal = mode === 'endless' ? controller.saveData.endless.best : controller.saveData.timetrial.best;
    const ov = overlay(`
      <div class="result-title">${label}</div>
      ${isBest ? `<div class="best-badge">🏅 NEW BEST!</div>` : ''}
      <div class="result-score">${state.score.toLocaleString()} pts</div>
      <div class="result-sub">Best: ${bestVal.toLocaleString()}</div>
      <div class="coin-reward">+${coins} 🪙</div>
      <div class="settings-row" style="flex-wrap:wrap;justify-content:center;">
        <button class="btn btn-blue btn-small" id="homeBtn">🏠 HOME</button>
        <button class="btn btn-pink btn-small" id="lbBtn">🏆 RANKS</button>
        <button class="btn btn-green pulse btn-small" id="againBtn">↺ AGAIN</button>
      </div>
    `);
    ov.querySelector('#homeBtn').addEventListener('click', () => { Sound.button(); controller.gotoMenu(); });
    ov.querySelector('#lbBtn').addEventListener('click', () => { Sound.button(); controller.gotoLeaderboard({ mode, sub: cfg.sub, title: label }); });
    ov.querySelector('#againBtn').addEventListener('click', () => { Sound.button(); restart(); });
  }

  /* ---------- confetti ---------- */
  let confettiRaf = null;
  function launchConfetti() {
    const cv = document.createElement('canvas');
    cv.className = 'fx-canvas';
    cv.width = stage.clientWidth * 2; cv.height = stage.clientHeight * 2;
    el.appendChild(cv);
    const ctx = cv.getContext('2d'); ctx.scale(2, 2);
    const ps = new ParticleSystem();
    const W = stage.clientWidth, H = stage.clientHeight;
    let bursts = 0;
    const burst = () => { ps.confetti(W * (0.2 + Math.random() * 0.6), H * 0.6, { count: 42, speed: 620 }); if (++bursts < 5) setTimeout(burst, 420); };
    burst();
    let last = performance.now();
    const loop = (ts) => {
      const dt = Math.min(0.05, (ts - last) / 1000); last = ts;
      ps.update(dt); ctx.clearRect(0, 0, W, H); ps.draw(ctx);
      if (ps.count > 0 || bursts < 5) confettiRaf = requestAnimationFrame(loop); else cv.remove();
    };
    confettiRaf = requestAnimationFrame(loop);
  }

  showIntro();
  if (window.__frogapop) Object.assign(window.__frogapop, { boardView, state, level, mode });

  return () => {
    boardView.destroy();
    hud?.destroy();
    stopTimer();
    clearTimeout(bubbleTimer);
    if (scoreRaf) cancelAnimationFrame(scoreRaf);
    if (confettiRaf) cancelAnimationFrame(confettiRaf);
  };
}

/* ============================================================
   mode configuration
   ============================================================ */
function buildModeConfig(mode, params) {
  if (mode === 'endless') {
    return {
      useObjectives: false, hasMoves: false, sub: null,
      boardLevelId: 30, neededTypes: {},
      level: synthLevel('endless', 'Endless', 0, {}),
      title: 'Endless Mode', subtitle: '', introLine: 'No limits — chase your highest score. Finish whenever you like!',
      startLabel: "LET'S GO!",
    };
  }
  if (mode === 'timetrial') {
    return {
      useObjectives: false, hasMoves: false, sub: null,
      boardLevelId: 22, neededTypes: {},
      level: synthLevel('timetrial', 'Time Trial', 0, {}),
      title: 'Time Trial', subtitle: '60 seconds', introLine: 'Score as many points as you can in 60 seconds!',
      startLabel: 'START!',
    };
  }
  if (mode === 'daily') {
    const date = new Date().toISOString().slice(0, 10);
    const rng = splitmix(Number(date.replace(/-/g, '')) | 0);
    const lid = 1 + Math.floor(rng() * 100);
    const pool = getSpawnableForLevel(lid);
    const safe = pool.slice(0, 4);
    const nT = 3;
    const collect = {};
    for (let k = 0; k < nT; k++) collect[safe[(k + (rng() * 4 | 0)) % 4]] = 10 + Math.floor(rng() * 5);
    const lvl = synthLevel('daily', 'Daily Challenge', 26, collect);
    lvl.stars = [999999, 999999, 999999]; // no stars for daily
    return {
      useObjectives: true, hasMoves: true, sub: date,
      boardLevelId: lid, neededTypes: collect,
      level: lvl,
      title: 'Daily Challenge', subtitle: date, introLine: '',
      startLabel: "LET'S POP!",
    };
  }
  // level
  const level = getLevel(params.levelId);
  const world = getWorld(params.levelId);
  return {
    useObjectives: true, hasMoves: true, sub: level.id,
    boardLevelId: level.id, neededTypes: level.collect,
    level,
    title: `${world.name} · Level ${level.id}`, subtitle: level.name, introLine: '',
    startLabel: "LET'S POP!",
  };
}

function synthLevel(id, name, moves, collect) {
  return { id, name, moves, collect, stars: [999999, 999999, 999999], frog: FROG_IDS[(Math.random() * FROG_IDS.length) | 0], intro: '' };
}

function formatTime(s) {
  s = Math.max(0, Math.ceil(s));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}
