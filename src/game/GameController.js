// Screen router + persistent progress. Screens are mount functions
// that render into the stage and return a cleanup function.

import { mountMainMenu } from '../components/menus/MainMenu.js';
import { mountLevelSelect } from '../components/menus/LevelSelect.js';
import { mountGameScreen } from './GameScreen.js';
import { LEVELS } from '../data/levels.js';
import { Sound } from './effects/Sound.js';

const SAVE_KEY = 'frogapop.save.v1';

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

  isUnlocked(levelId) {
    if (levelId === 1) return true;
    return this.starsFor(levelId - 1) > 0;
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
      void this.wipe.offsetWidth; // restart animation
      this.wipe.classList.add(dir);
      this.wipe.addEventListener('animationend', finish, { once: true });
      // fallback: animations are suspended in hidden tabs
      setTimeout(finish, 550);
    });
  }

  gotoMenu() { this.goto(mountMainMenu); }
  gotoMap() { this.goto(mountLevelSelect); }
  gotoLevel(id) { this.goto(mountGameScreen, { levelId: id }); }

  buttonSound() { Sound.button(); }
}
