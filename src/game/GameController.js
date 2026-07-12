import { mountMainMenu } from '../components/menus/MainMenu.js';
import { mountLevelSelect } from '../components/menus/LevelSelect.js';
import { mountGameScreen } from './GameScreen.js';
import { LEVELS, WORLDS } from '../data/levels.js';
import { POWERUPS, LOADOUT_SIZE } from '../data/powerups.js';
import { Sound } from './effects/Sound.js';

const SAVE_KEY = 'frogapop.save.v2';
const OLD_KEY = 'frogapop.save.v1';

function defaultSave() {
  return {
    v: 2,
    stars: {},               // levelId -> stars (0-3)
    best: {},                // levelId -> best score
    coins: 0,
    owned: { stomp: true },  // owned power-up ids
    loadout: ['stomp'],      // equipped, max LOADOUT_SIZE
    endless: { best: 0 },
    timetrial: { best: 0 },
    daily: { date: null, best: 0, played: false },
    achievements: {},        // id -> true
    settings: { sound: true, music: true, motion: true },
    account: null,           // { name, token }
    allUnlocked: false,
  };
}

export class GameController {
  constructor(stage) {
    this.stage = stage;
    this.wipe = document.getElementById('wipe');
    this.cleanup = null;
    this.transitioning = false;
    this.load();
  }

  /* ---------- progress / save ---------- */
  load() {
    let data = null;
    try { data = JSON.parse(localStorage.getItem(SAVE_KEY)); } catch { data = null; }
    if (!data) data = this.migrateOld();
    this.saveData = Object.assign(defaultSave(), data || {});
    const d = defaultSave();
    for (const k of ['endless', 'timetrial', 'daily', 'settings']) {
      this.saveData[k] = Object.assign(d[k], this.saveData[k] || {});
    }
    this.saveData.owned = this.saveData.owned || { stomp: true };
    this.saveData.owned.stomp = true; // starter always owned
    if (!Array.isArray(this.saveData.loadout) || !this.saveData.loadout.length) this.saveData.loadout = ['stomp'];
    this.saveData.achievements = this.saveData.achievements || {};
  }

  migrateOld() {
    try {
      const old = JSON.parse(localStorage.getItem(OLD_KEY));
      if (!old) return null;
      const s = defaultSave();
      s.stars = old.stars || {};
      s.allUnlocked = !!old.allUnlocked;
      return s;
    } catch { return null; }
  }

  persist() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(this.saveData)); } catch { /* private mode */ } }

  /* ---------- stars / levels ---------- */
  starsFor(levelId) { return this.saveData.stars[levelId] ?? 0; }
  totalStars() { return Object.values(this.saveData.stars).reduce((a, b) => a + b, 0); }
  levelsCompleted() { return Object.values(this.saveData.stars).filter((s) => s > 0).length; }
  bestFor(levelId) { return this.saveData.best[levelId] ?? 0; }

  isUnlocked(levelId) {
    if (this.saveData.allUnlocked) return true;
    if (levelId === 1) return true;
    return this.starsFor(levelId - 1) > 0;
  }

  isWorldUnlocked(worldId) {
    if (this.saveData.allUnlocked) return true;
    if (worldId === 1) return true;
    const w = WORLDS.find((x) => x.id === worldId);
    return w && this.levelsCompleted() >= w.unlockLevels;
  }

  currentLevelId() {
    for (const l of LEVELS) if (this.starsFor(l.id) === 0) return l.id;
    return LEVELS[LEVELS.length - 1].id;
  }

  /** Record a level result: stars, best score, and a coin reward. */
  recordResult(levelId, stars, score = 0) {
    const firstClear = this.starsFor(levelId) === 0;
    const prevStars = this.starsFor(levelId);
    if (stars > prevStars) this.saveData.stars[levelId] = stars;
    if (score > this.bestFor(levelId)) this.saveData.best[levelId] = score;
    const extraStars = Math.max(0, stars - prevStars);
    const coins = (firstClear ? 40 : 10) + extraStars * 25;
    this.addCoins(coins);
    this.persist();
    return coins;
  }

  recordEndless(score) {
    const best = score > this.saveData.endless.best;
    if (best) this.saveData.endless.best = score;
    this.addCoins(Math.floor(score / 400));
    this.persist();
    return best;
  }

  recordTimeTrial(score) {
    const best = score > this.saveData.timetrial.best;
    if (best) this.saveData.timetrial.best = score;
    this.addCoins(Math.floor(score / 500));
    this.persist();
    return best;
  }

  /* ---------- coins ---------- */
  get coins() { return this.saveData.coins; }
  addCoins(n) { this.saveData.coins = Math.max(0, (this.saveData.coins || 0) + Math.round(n)); this.persist(); }
  spendCoins(n) {
    if (this.saveData.coins < n) return false;
    this.saveData.coins -= n; this.persist(); return true;
  }

  /* ---------- power-ups ---------- */
  owns(id) { return id === 'stomp' || !!this.saveData.owned[id]; }
  buyPowerup(id) {
    const p = POWERUPS[id];
    if (!p || this.owns(id)) return false;
    if (!this.spendCoins(p.price)) return false;
    this.saveData.owned[id] = true;
    if (this.saveData.loadout.length < LOADOUT_SIZE && !this.saveData.loadout.includes(id)) {
      this.saveData.loadout.push(id);
    }
    this.persist();
    return true;
  }
  isEquipped(id) { return this.saveData.loadout.includes(id); }
  toggleEquip(id) {
    if (!this.owns(id)) return false;
    const i = this.saveData.loadout.indexOf(id);
    if (i >= 0) this.saveData.loadout.splice(i, 1);
    else { if (this.saveData.loadout.length >= LOADOUT_SIZE) return false; this.saveData.loadout.push(id); }
    this.persist();
    return true;
  }
  get loadout() { return this.saveData.loadout.filter((id) => this.owns(id)); }

  /* ---------- settings ---------- */
  get settings() { return this.saveData.settings; }
  setSetting(k, v) { this.saveData.settings[k] = v; this.persist(); }

  /* ---------- account ---------- */
  get account() { return this.saveData.account; }
  setAccount(acc) { this.saveData.account = acc; this.persist(); }
  signOut() { this.saveData.account = null; this.persist(); }

  /* ---------- achievements ---------- */
  hasAchievement(id) { return !!this.saveData.achievements[id]; }
  unlockAchievement(id) {
    if (this.hasAchievement(id)) return false;
    this.saveData.achievements[id] = true; this.persist(); return true;
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
  gotoEndless() { this.goto(mountGameScreen, { mode: 'endless' }); }
  gotoTimeTrial() { this.goto(mountGameScreen, { mode: 'timetrial' }); }
  gotoDaily() { this.goto(mountGameScreen, { mode: 'daily' }); }

  // lazy-loaded screens — avoids static import cycles and keeps first load small
  async gotoShop() { const { mountShop } = await import('../components/menus/Shop.js'); this.goto(mountShop); }
  async gotoSettings() { const { mountSettings } = await import('../components/menus/Settings.js'); this.goto(mountSettings); }
  async gotoLeaderboard(params) { const { mountLeaderboard } = await import('../components/menus/Leaderboard.js'); this.goto(mountLeaderboard, params); }
  async gotoAchievements() { const { mountAchievements } = await import('../components/menus/Achievements.js'); this.goto(mountAchievements); }
  async gotoIndex() { const { mountPineappleIndex } = await import('../components/menus/PineappleIndex.js'); this.goto(mountPineappleIndex); }

  buttonSound() { Sound.button(); }
}
