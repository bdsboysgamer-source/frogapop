import { mountMainMenu } from '../components/menus/MainMenu.js';
import { mountLevelSelect } from '../components/menus/LevelSelect.js';
import { mountGameScreen } from './GameScreen.js';
import { LEVELS, WORLDS } from '../data/levels.js';
import { Sound } from './effects/Sound.js';

const SAVE_KEY = 'frogapop.save.v1';

// Power unlock thresholds (easily changeable — will be replaced by currency)
export const POWER_UNLOCK = {
  swap: 3,
  clear: 7,
  shuffle: 15,
  rainbow: 22,
};

export class GameController {
  constructor(stage) {
    this.stage = stage;
    this.wipe = document.getElementById('wipe');
    this.cleanup = null;
    this.transitioning = false;
    this.load();
  }

  /* ---------- progress ---------- */
  load() {
    try {
      this.saveData = JSON.parse(localStorage.getItem(SAVE_KEY)) ?? { stars: {} };
    } catch {
      this.saveData = { stars: {} };
    }
  }

  persist() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(this.saveData));
  }

  starsFor(levelId) {
    return this.saveData.stars[levelId] ?? 0;
  }

  totalStars() {
    return Object.values(this.saveData.stars).reduce((a, b) => a + b, 0);
  }

  levelsCompleted() {
    return Object.values(this.saveData.stars).filter((s) => s > 0).length;
  }

  isUnlocked(levelId) {
    if (levelId === 1) return true;
    const prev = this.starsFor(levelId - 1);
    if (prev > 0) return true;
    const w = this._worldFor(levelId);
    if (!w) return false;
    for (let i = w.startId; i < levelId; i++) {
      if (this.starsFor(i) > 0) return true;
    }
    return false;
  }

  isWorldUnlocked(worldId) {
    if (worldId === 1) return true;
    const w = WORLDS.find((x) => x.id === worldId);
    return w && this.levelsCompleted() >= w.unlockLevels;
  }

  _worldFor(levelId) {
    return WORLDS.find((w) => levelId >= w.startId && levelId < w.startId + w.count);
  }

  currentLevelId() {
    for (const l of LEVELS) if (this.starsFor(l.id) === 0) return l.id;
    return LEVELS[LEVELS.length - 1].id;
  }

  recordResult(levelId, stars) {
    if (stars > this.starsFor(levelId)) {
      this.saveData.stars[levelId] = stars;
      this.persist();
    }
  }

  /** Power is unlocked? (stomp always available) */
  powerUnlocked(powerId) {
    if (powerId === 'stomp') return true;
    const threshold = POWER_UNLOCK[powerId];
    if (threshold === undefined) return false;
    return this.levelsCompleted() >= threshold;
  }

  /* ---------- screen transitions ---------- */
  async goto(mountFn, params) {
    if (this.transitioning) return;
    this.transitioning = true;
    await this.playWipe('in');
    this.cleanup?.();
    this.stage.innerHTML = '';
    this.cleanup = mountFn(this.stage, this, params) ?? null;
    await this.playWipe('out');
    this.transitioning = false;
  }

  playWipe(dir) {
    return new Promise((resolve) => {
      let done = false;
      const finish = () => { if (!done) { done = true; resolve(); } };
      this.wipe.classList.remove('in', 'out');
      void this.wipe.offsetWidth;
      this.wipe.classList.add(dir);
      this.wipe.addEventListener('animationend', finish, { once: true });
      setTimeout(finish, 550);
    });
  }

  gotoMenu() { this.goto(mountMainMenu); }
  gotoMap() { this.goto(mountLevelSelect); }
  gotoLevel(id) { this.goto(mountGameScreen, { levelId: id }); }

  buttonSound() { Sound.button(); }
}
