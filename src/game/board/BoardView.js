// BoardView: renders the Board onto a canvas and orchestrates all
// gameplay animation — swaps, pops, physics-based falls, special
// effects, combos, hints, shuffles and the Mega Frog stomp.
//
// Logic stays in Board; this class only animates diffs and reports
// results upward through `events`.

import { Board } from '../logic/Board.js';
import { PIECE_TYPES } from '../../data/pieceTypes.js';
import { getPieceSprite } from '../pieces/PieceArt.js';
import { ParticleSystem, FloatingTextSystem } from '../effects/Particles.js';
import { ScreenShake } from '../effects/ScreenShake.js';
import { Sound } from '../effects/Sound.js';
import { frogSVG } from '../../components/characters/FrogArt.js';

const CELL = 48;
const DPR = 2;
const GRAVITY = 3400;      // px/s^2 for falling pieces
const BOUNCE = 0.22;

export class BoardView {
  constructor(canvas, events = {}, levelId = 1, neededTypes = {}) {
    this.canvas = canvas;
    this.events = events;
    this.board = new Board();
    this.board.setLevel(levelId, neededTypes); // Pass needed types for spawn bias
    this.cols = this.board.cols;
    this.rows = this.board.rows;

    this.w = this.cols * CELL;
    this.h = this.rows * CELL;
    canvas.width = this.w * DPR;
    canvas.height = this.h * DPR;
    this.ctx = canvas.getContext('2d');

    this.sprites = new Map();      // piece object -> sprite
    this.tweens = [];
    this.flashes = [];             // rocket streaks / bomb shockwaves / rainbow beams
    this.particles = new ParticleSystem();
    this.floaters = new FloatingTextSystem();
    this.shake = new ScreenShake();

    this.busy = false;
    this.enabled = true;
    this.selected = null;
    this.idleTime = 0;
    this.hintCells = null;
    this.time = 0;
    this.frogImages = new Map();
    this.frogJump = null;          // active mega-frog hop animation

    this.syncSprites(true);
    this.bindInput();

    this.lastTs = performance.now();
    this.running = true;
    const loop = (ts) => {
      if (!this.running) return;
      const dt = Math.min(0.05, (ts - this.lastTs) / 1000);
      this.lastTs = ts;
      this.update(dt);
      this.draw();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  destroy() {
    this.running = false;
  }

  /* ============================================================
     sprites & tweens
     ============================================================ */
  cellX(c) { return c * CELL + CELL / 2; }
  cellY(r) { return r * CELL + CELL / 2; }

  syncSprites(instant = false) {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const piece = this.board.at(r, c);
        if (piece && !this.sprites.has(piece)) {
          this.sprites.set(piece, {
            piece,
            x: this.cellX(c),
            y: instant ? this.cellY(r) : this.cellY(r) - CELL * 2,
            scale: 1, squash: 0, vy: 0,
            phase: Math.random() * Math.PI * 2,
            falling: !instant,
            targetY: this.cellY(r),
          });
        }
      }
    }
  }

  spriteAt(r, c) {
    const piece = this.board.at(r, c);
    return piece ? this.sprites.get(piece) : null;
  }

  tween(obj, props, dur, ease = easeOutCubic) {
    return new Promise((resolve) => {
      this.tweens.push({
        obj, dur, ease, resolve, t: 0,
        keys: Object.keys(props).map((k) => ({ k, from: obj[k], to: props[k] })),
      });
    });
  }

  wait(ms) {
    return new Promise((resolve) => this.tweens.push({ obj: null, dur: ms / 1000, t: 0, keys: [], ease: (x) => x, resolve }));
  }

  /* ============================================================
     input — one unified gesture pipeline for pointer, touch and
     mouse. Modern Pointer Events are used where available (with
     pointer capture, so a finger that slides off the canvas still
     tracks); a touch/mouse fallback covers older engines.

     Goals: native-feeling drags on Android + iOS, reliable swipe
     direction, fast-flick recognition, a dead-zone that ignores
     accidental micro-movement, and zero page scrolling mid-swipe.
     ============================================================ */
  bindInput() {
    // Stop the browser from claiming the gesture as a scroll/zoom.
    // This is the single biggest reason swipes felt flaky on Android.
    this.canvas.style.touchAction = 'none';
    this.canvas.style.userSelect = 'none';

    const rectCell = (clientX, clientY) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * this.w;
      const y = ((clientY - rect.top) / rect.height) * this.h;
      const c = Math.floor(x / CELL);
      const r = Math.floor(y / CELL);
      if (r < 0 || c < 0 || r >= this.rows || c >= this.cols) return null;
      return { r, c };
    };

    // gesture state
    const g = { active: false, id: null, cell: null, sx: 0, sy: 0, t0: 0, committed: false, moved: 0 };

    // commit threshold scales with the on-screen cell size so it feels
    // the same on a dense phone and a large desktop board.
    const commitThreshold = () => {
      const rect = this.canvas.getBoundingClientRect();
      const cellPx = rect.width / this.cols;
      return Math.max(9, cellPx * 0.34);
    };
    const DEAD_ZONE = 7;              // px — below this a gesture is a tap
    const FLICK_MS = 260;             // a quick sub-threshold drag still swipes

    const swipe = (from, dx, dy) => {
      const dir = Math.abs(dx) > Math.abs(dy)
        ? { r: 0, c: Math.sign(dx) }
        : { r: Math.sign(dy), c: 0 };
      const target = { r: from.r + dir.r, c: from.c + dir.c };
      if (target.r < 0 || target.c < 0 || target.r >= this.rows || target.c >= this.cols) return;
      this.selected = null;
      this.trySwap(from, target);
    };

    const begin = (clientX, clientY, pointerId, evt) => {
      if (this.busy || !this.enabled) return;
      if (g.active) return;                 // ignore secondary fingers
      Sound.ensure();
      const cell = rectCell(clientX, clientY);
      g.active = true; g.id = pointerId ?? null; g.cell = cell;
      g.sx = clientX; g.sy = clientY; g.t0 = performance.now();
      g.committed = false; g.moved = 0;
      this.idleTime = 0;
      if (cell) {
        const sp = this.spriteAt(cell.r, cell.c);
        if (sp) this.bounceSprite(sp);
      }
      if (evt && this.canvas.setPointerCapture && pointerId != null) {
        try { this.canvas.setPointerCapture(pointerId); } catch { /* noop */ }
      }
    };

    const move = (clientX, clientY) => {
      if (!g.active || g.committed || !g.cell) return;
      if (this.busy || !this.enabled) { g.active = false; return; }
      const dx = clientX - g.sx;
      const dy = clientY - g.sy;
      g.moved = Math.max(g.moved, Math.hypot(dx, dy));
      if (Math.max(Math.abs(dx), Math.abs(dy)) >= commitThreshold()) {
        g.committed = true;
        swipe(g.cell, dx, dy);
      }
    };

    const end = (clientX, clientY) => {
      if (!g.active) return;
      const wasCommitted = g.committed;
      const cell = g.cell;
      const dx = clientX - g.sx;
      const dy = clientY - g.sy;
      const dist = Math.hypot(dx, dy);
      const dt = performance.now() - g.t0;
      g.active = false; g.id = null; g.cell = null; g.committed = false;

      if (wasCommitted || !cell) return;

      // a fast flick that ended before crossing the threshold still swipes
      if (dist > DEAD_ZONE && (dist >= commitThreshold() * 0.55 || dt <= FLICK_MS)) {
        swipe(cell, dx, dy);
        return;
      }
      if (dist <= DEAD_ZONE) {
        // tap: select, then tap-swap an adjacent cell
        if (this.selected && isAdjacent(this.selected, cell)) {
          const a = this.selected; this.selected = null; this.trySwap(a, cell);
        } else if (this.selected && this.selected.r === cell.r && this.selected.c === cell.c) {
          this.selected = null;
        } else {
          this.selected = cell;
        }
      }
    };

    const cancel = () => { g.active = false; g.id = null; g.cell = null; g.committed = false; };

    if (window.PointerEvent) {
      this.canvas.addEventListener('pointerdown', (e) => {
        if (e.button != null && e.button !== 0 && e.pointerType === 'mouse') return;
        e.preventDefault();
        begin(e.clientX, e.clientY, e.pointerId, e);
      });
      this.canvas.addEventListener('pointermove', (e) => {
        if (!g.active || (g.id != null && e.pointerId !== g.id)) return;
        e.preventDefault();
        move(e.clientX, e.clientY);
      });
      const up = (e) => {
        if (g.id != null && e.pointerId !== g.id) return;
        end(e.clientX, e.clientY);
        if (this.canvas.releasePointerCapture && e.pointerId != null) {
          try { this.canvas.releasePointerCapture(e.pointerId); } catch { /* noop */ }
        }
      };
      this.canvas.addEventListener('pointerup', up);
      this.canvas.addEventListener('pointercancel', cancel);
    } else {
      // legacy fallback: touch (non-passive so we can preventDefault) + mouse
      this.canvas.addEventListener('touchstart', (e) => {
        const t = e.changedTouches[0];
        e.preventDefault();
        begin(t.clientX, t.clientY, t.identifier, null);
      }, { passive: false });
      this.canvas.addEventListener('touchmove', (e) => {
        const t = e.changedTouches[0];
        e.preventDefault();
        move(t.clientX, t.clientY);
      }, { passive: false });
      this.canvas.addEventListener('touchend', (e) => {
        const t = e.changedTouches[0];
        end(t.clientX, t.clientY);
      });
      this.canvas.addEventListener('touchcancel', cancel);

      let mouseDown = false;
      this.canvas.addEventListener('mousedown', (e) => { mouseDown = true; begin(e.clientX, e.clientY, null, null); });
      this.canvas.addEventListener('mousemove', (e) => { if (mouseDown) move(e.clientX, e.clientY); });
      window.addEventListener('mouseup', (e) => { if (mouseDown) { mouseDown = false; end(e.clientX, e.clientY); } });
    }
  }

  bounceSprite(sp) {
    sp.squash = Math.max(sp.squash, 0.25);
  }

  /* ============================================================
     swap flow
     ============================================================ */
  async trySwap(a, b) {
    if (this.busy || !this.enabled) return;
    if (this.events.canMove && !this.events.canMove()) return;
    const pa = this.board.at(a.r, a.c);
    const pb = this.board.at(b.r, b.c);
    if (!pa || !pb) return;
    this.busy = true;
    this.hintCells = null;
    this.idleTime = 0;

    Sound.swap();
    this.board.swap(a, b);
    await this.animateSwap(a, b);

    const rainA = pa.special === 'rainbow';
    const rainB = pb.special === 'rainbow';
    let firstWave = null;

    if (rainA && rainB) {
      // double rainbow: clear the whole board
      const cleared = [];
      for (let r = 0; r < this.rows; r++)
        for (let c = 0; c < this.cols; c++) {
          const p = this.board.at(r, c);
          if (p) { cleared.push({ r, c, piece: p }); this.board.grid[r][c] = null; }
        }
      firstWave = { cleared, created: [], effects: [{ kind: 'rainbow', r: b.r, c: b.c, targetType: null }] };
      this.shake.add(0.9);
    } else if (rainA || rainB) {
      const cell = rainA ? b : a; // rainbow ends at the *other* cell after swap
      const rainbowCell = rainA ? { r: b.r, c: b.c } : { r: a.r, c: a.c };
      const otherType = rainA ? pb.type : pa.type;
      firstWave = this.board.activateRainbow(rainbowCell, otherType);
      void cell;
    } else if (pa.special || pb.special) {
      // swapping a rocket/bomb fires it (both if both special)
      const keys = new Set();
      if (pa.special) keys.add(`${b.r},${b.c}`);
      if (pb.special) keys.add(`${a.r},${a.c}`);
      const effects = [];
      this.board.expandSpecials(keys, effects);
      const cleared = [...keys].map((key) => {
        const [r, c] = key.split(',').map(Number);
        return { r, c, piece: this.board.grid[r][c] };
      }).filter((x) => x.piece);
      for (const { r, c } of cleared) this.board.grid[r][c] = null;
      firstWave = { cleared, created: [], effects };
    } else {
      firstWave = this.board.resolveWave([a, b]);
      if (!firstWave) {
        // invalid move: swap back with a huff
        this.board.swap(a, b);
        Sound.invalid();
        await this.animateSwap(a, b, true);
        this.busy = false;
        return;
      }
    }

    this.events.onMoveUsed?.();
    await this.runCascades(firstWave);
    this.busy = false;
  }

  async animateSwap(a, b, failed = false) {
    const spA = this.spriteAt(a.r, a.c) ?? this.spriteAt(b.r, b.c);
    const spB = this.spriteAt(b.r, b.c) ?? spA;
    // after board.swap, piece at a is the one that was at b
    const s1 = this.sprites.get(this.board.at(a.r, a.c));
    const s2 = this.sprites.get(this.board.at(b.r, b.c));
    void spA; void spB;
    const dur = failed ? 0.16 : 0.2;
    const p = [];
    if (s1) p.push(this.tween(s1, { x: this.cellX(a.c), y: this.cellY(a.r) }, dur, easeOutBack));
    if (s2) p.push(this.tween(s2, { x: this.cellX(b.c), y: this.cellY(b.r) }, dur, easeOutBack));
    await Promise.all(p);
    if (failed) { if (s1) this.bounceSprite(s1); if (s2) this.bounceSprite(s2); }
  }

  /* ============================================================
     cascade engine
     ============================================================ */
  async runCascades(firstWave) {
    let combo = 0;
    let wave = firstWave;
    while (wave) {
      combo++;
      await this.playWave(wave, combo);
      await this.playGravity();
      wave = this.board.resolveWave();
    }
    if (!this.board.hasAnyMove()) await this.playShuffle();
    this.events.onSettled?.();
  }

  async playWave(wave, combo) {
    const { cleared, created, effects } = wave;
    if (combo >= 2) this.events.onCombo?.(combo);

    // special activation effects first (visual + audio + shake)
    for (const fx of effects) {
      if (fx.kind === 'rocketH' || fx.kind === 'rocketV') {
        Sound.rocket();
        this.shake.add(0.3);
        this.flashes.push({ kind: fx.kind, r: fx.r, c: fx.c, age: 0, life: 0.4 });
      } else if (fx.kind === 'bomb') {
        Sound.bomb();
        this.shake.add(0.55);
        this.flashes.push({ kind: 'bomb', r: fx.r, c: fx.c, age: 0, life: 0.5 });
        this.particles.ring(this.cellX(fx.c), this.cellY(fx.r), '#ffb037', { radius: 60 });
      } else if (fx.kind === 'rainbow') {
        Sound.rainbow();
        this.shake.add(0.45);
        this.flashes.push({ kind: 'rainbow', r: fx.r, c: fx.c, age: 0, life: 0.6 });
      }
      this.events.onSpecialFired?.(fx.kind);
    }

    // scoring
    const base = 60;
    const points = cleared.length * base * combo + effects.length * 120;
    if (cleared.length) {
      const cx = cleared.reduce((s, x) => s + this.cellX(x.c), 0) / cleared.length;
      const cy = cleared.reduce((s, x) => s + this.cellY(x.r), 0) / cleared.length;
      this.floaters.add(cx, cy, `+${points}`, {
        color: combo >= 3 ? '#ffe14d' : '#ffffff',
        size: Math.min(40, 22 + cleared.length * 1.5 + combo * 3),
      });
      this.events.onScore?.(points);
      const collected = {};
      for (const { piece } of cleared) collected[piece.type] = (collected[piece.type] ?? 0) + 1;
      this.events.onCollect?.(collected);
    }

    // pop the cleared sprites with a slight stagger
    Sound.pop(combo);
    const pops = [];
    cleared.forEach(({ r, c, piece }, i) => {
      const sp = this.sprites.get(piece);
      if (!sp) return;
      pops.push(this.popSprite(sp, i * 0.014, piece));
      void r; void c;
    });

    // announce created specials
    for (const cr of created) {
      const names = { rocketH: 'ROCKET!', rocketV: 'ROCKET!', bomb: 'BOMB!', rainbow: 'RAINBOW!' };
      Sound.specialCreated();
      this.floaters.add(this.cellX(cr.c), this.cellY(cr.r) - 20, names[cr.special], {
        color: '#7ee0ff', size: 24, stroke: '#1e5a8a', life: 1.0,
      });
      this.particles.ring(this.cellX(cr.c), this.cellY(cr.r), '#ffffff', { radius: 40, count: 14 });
      const sp = this.sprites.get(this.board.at(cr.r, cr.c));
      if (sp) { sp.scale = 1.6; this.tween(sp, { scale: 1 }, 0.35, easeOutBack); }
      this.events.onSpecialCreated?.(cr.special);
    }

    await Promise.all(pops.length ? pops : [this.wait(120)]);
  }

  popSprite(sp, delay, piece) {
    sp.popping = true;
    return (async () => {
      if (delay) await this.wait(delay * 1000);
      const t = PIECE_TYPES[piece.type];
      const colors = t ? [t.body, t.bodyLight, t.leaf] : ['#fff'];
      await this.tween(sp, { scale: 1.25 }, 0.09, easeOutCubic);
      this.particles.juicePop(sp.x, sp.y, colors);
      if (t) this.particles.leafPuff(sp.x, sp.y - 14, t.leaf);
      await this.tween(sp, { scale: 0 }, 0.12, easeInCubic);
      this.sprites.delete(piece);
    })();
  }

  async playGravity() {
    const { falls, spawns } = this.board.applyGravity();
    const waiting = [];

    for (const f of falls) {
      const sp = this.sprites.get(f.piece);
      if (!sp) continue;
      sp.falling = true;
      sp.vy = 0;
      sp.targetY = this.cellY(f.toR);
      sp.x = this.cellX(f.c);
      waiting.push(sp);
    }
    for (const s of spawns) {
      const sp = {
        piece: s.piece,
        x: this.cellX(s.c),
        y: -CELL / 2 - s.order * CELL * 1.05,
        scale: 1, squash: 0, vy: 0,
        phase: Math.random() * Math.PI * 2,
        falling: true,
        targetY: this.cellY(s.r),
      };
      this.sprites.set(s.piece, sp);
      waiting.push(sp);
    }
    if (!waiting.length) return;
    // resolve when every falling sprite has settled
    await new Promise((resolve) => {
      const check = () => {
        if (waiting.every((sp) => !sp.falling)) resolve();
        else requestAnimationFrame(check);
      };
      check();
    });
    await this.wait(40);
  }

  async playShuffle() {
    this.floaters.add(this.w / 2, this.h / 2, 'SHUFFLE!', { color: '#fff', size: 40, stroke: '#1e5a8a', life: 1.2 });
    Sound.specialCreated();
    this.board.shuffleBoard();
    const moves = [];
    for (let r = 0; r < this.rows; r++)
      for (let c = 0; c < this.cols; c++) {
        const sp = this.spriteAt(r, c);
        if (sp) moves.push(this.tween(sp, { x: this.cellX(c), y: this.cellY(r) }, 0.5, easeInOutCubic));
      }
    await Promise.all(moves);
  }

  /* ============================================================
     Mega Frog Power - FROGGY POWER
     ============================================================ */
  async playFrogPower(frogId = 'sprig') {
    if (this.busy) return false;
    this.busy = true;
    Sound.frogPower();

    const img = await this.getFrogImage(frogId);
    const wave = this.board.frogStomp(9);
    const stomps = wave.stomps;

    // frog hops across the board, stomping each target
    this.frogJump = { img, x: -CELL, y: -CELL, scale: 1 };
    const stompedKeys = new Set();
    for (const cell of stomps) {
      const tx = this.cellX(cell.c);
      const ty = this.cellY(cell.r);
      await this.hopTo(tx, ty);
      Sound.stomp();
      this.shake.add(0.28);
      stompedKeys.add(`${cell.r},${cell.c}`);
      const hit = wave.cleared.find((x) => x.r === cell.r && x.c === cell.c);
      if (hit) {
        const sp = this.sprites.get(hit.piece);
        if (sp) this.popSprite(sp, 0, hit.piece);
      }
      this.particles.ring(tx, ty, '#7ee081', { radius: 40, count: 12 });
      this.floaters.add(tx, ty - 14, 'POP!', { color: '#b6ff9e', size: 20, stroke: '#1d6b2e', life: 0.6 });
    }
    // hop off screen
    await this.hopTo(this.w + CELL, -CELL);
    this.frogJump = null;

    // clear any chained pieces the stomps caught (specials etc.)
    const rest = wave.cleared.filter((x) => !stompedKeys.has(`${x.r},${x.c}`));
    const pops = [];
    rest.forEach((x, i) => {
      const sp = this.sprites.get(x.piece);
      if (sp) pops.push(this.popSprite(sp, i * 0.02, x.piece));
    });
    for (const fx of wave.effects) {
      if (fx.kind.startsWith('rocket')) { Sound.rocket(); this.flashes.push({ kind: fx.kind, r: fx.r, c: fx.c, age: 0, life: 0.4 }); }
      if (fx.kind === 'bomb') { Sound.bomb(); this.shake.add(0.5); this.flashes.push({ kind: 'bomb', r: fx.r, c: fx.c, age: 0, life: 0.5 }); }
    }
    await Promise.all(pops.length ? pops : [this.wait(50)]);

    const points = wave.cleared.length * 80;
    this.events.onScore?.(points);
    const collected = {};
    for (const { piece } of wave.cleared) collected[piece.type] = (collected[piece.type] ?? 0) + 1;
    this.events.onCollect?.(collected);
    this.floaters.add(this.w / 2, this.h / 2, `+${points}`, { color: '#b6ff9e', size: 36, stroke: '#1d6b2e' });

    await this.playGravity();
    let next = this.board.resolveWave();
    if (next) await this.runCascades(next);
    else {
      if (!this.board.hasAnyMove()) await this.playShuffle();
      this.events.onSettled?.();
    }
    this.busy = false;
    return true;
  }

  /* ============================================================
     POWER-UPS
     ============================================================ */

  // FROGGY SWAP - Swap all of one type to another
  async playFroggySwap(fromType, toType) {
    if (this.busy) return false;
    this.busy = true;
    Sound.frogPower();

    const wave = this.board.froggySwap(fromType, toType);
    this.shake.add(0.4);
    
    // Show effect
    this.floaters.add(this.w / 2, this.h / 2, `SWAP: ${fromType} → ${toType}`, { 
      color: '#ffe14d', size: 28, stroke: '#1e5a8a', life: 1.2 
    });
    
    // Pop the swapped pieces
    const pops = [];
    for (const item of wave.swapped || []) {
      const sp = this.spriteAt(item.r, item.c);
      if (sp) {
        const piece = this.board.at(item.r, item.c);
        if (piece) {
          this.particles.ring(sp.x, sp.y, '#ffe14d', { radius: 30, count: 8 });
          if (sp) {
            sp.scale = 1.3;
            this.tween(sp, { scale: 1 }, 0.3, easeOutBack);
          }
        }
      }
    }
    
    // Process the resulting matches
    if (wave.cleared && wave.cleared.length > 0) {
      // Clear the swapped pieces that matched
      for (const { r, c, piece } of wave.cleared) {
        const sp = this.sprites.get(piece);
        if (sp) {
          pops.push(this.popSprite(sp, 0.02 * pops.length, piece));
        }
        this.board.grid[r][c] = null;
      }
    }
    
    await Promise.all(pops.length ? pops : [this.wait(50)]);
    
    // Score points
    const points = (wave.cleared?.length || 0) * 50;
    if (points > 0) {
      this.events.onScore?.(points);
      const collected = {};
      for (const { piece } of wave.cleared || []) {
        collected[piece.type] = (collected[piece.type] ?? 0) + 1;
      }
      this.events.onCollect?.(collected);
    }
    
    // Continue cascades
    await this.playGravity();
    let next = this.board.resolveWave();
    if (next) await this.runCascades(next);
    else {
      if (!this.board.hasAnyMove()) await this.playShuffle();
      this.events.onSettled?.();
    }
    
    this.busy = false;
    return true;
  }

  // FROGGY RAINBOW - Turn all of one type into rainbows
  async playFroggyRainbow(targetType) {
    if (this.busy) return false;
    this.busy = true;
    Sound.frogPower();

    const wave = this.board.froggyRainbow(targetType);
    this.shake.add(0.5);
    
    this.floaters.add(this.w / 2, this.h / 2, `🌈 RAINBOW ${targetType}!`, { 
      color: '#b48cff', size: 28, stroke: '#1e5a8a', life: 1.2 
    });
    
    // Flash rainbow effect
    this.flashes.push({ kind: 'rainbow', r: 0, c: 0, age: 0, life: 0.8 });
    
    // Animate the rainbowed pieces
    for (const { r, c } of wave.rainbowed || []) {
      const sp = this.spriteAt(r, c);
      if (sp) {
        sp.scale = 1.6;
        this.tween(sp, { scale: 1 }, 0.4, easeOutBack);
        this.particles.ring(sp.x, sp.y, '#b48cff', { radius: 35, count: 12 });
      }
    }
    
    // Process the resulting matches
    if (wave.cleared && wave.cleared.length > 0) {
      const pops = [];
      for (const { r, c, piece } of wave.cleared) {
        const sp = this.sprites.get(piece);
        if (sp) {
          pops.push(this.popSprite(sp, 0.02 * pops.length, piece));
        }
        this.board.grid[r][c] = null;
      }
      await Promise.all(pops.length ? pops : [this.wait(50)]);
    }
    
    // Score points
    const points = (wave.cleared?.length || 0) * 60 + (wave.rainbowed?.length || 0) * 30;
    if (points > 0) {
      this.events.onScore?.(points);
      const collected = {};
      for (const { piece } of wave.cleared || []) {
        collected[piece.type] = (collected[piece.type] ?? 0) + 1;
      }
      this.events.onCollect?.(collected);
    }
    
    // Continue cascades
    await this.playGravity();
    let next = this.board.resolveWave();
    if (next) await this.runCascades(next);
    else {
      if (!this.board.hasAnyMove()) await this.playShuffle();
      this.events.onSettled?.();
    }
    
    this.busy = false;
    return true;
  }

  // FROGGY CLEAR - Clear all of one type
  async playFroggyClear(targetType) {
    if (this.busy) return false;
    this.busy = true;
    Sound.frogPower();

    const wave = this.board.froggyClear(targetType);
    this.shake.add(0.3);
    
    this.floaters.add(this.w / 2, this.h / 2, `✨ CLEAR ${targetType}!`, { 
      color: '#ffffff', size: 28, stroke: '#1e5a8a', life: 1.2 
    });
    
    // Pop all cleared pieces
    const pops = [];
    for (const { r, c } of wave.clearedCells || []) {
      const piece = this.board.at(r, c);
      if (piece) {
        const sp = this.sprites.get(piece);
        if (sp) {
          pops.push(this.popSprite(sp, 0.015 * pops.length, piece));
        }
        this.board.grid[r][c] = null;
      }
    }
    
    await Promise.all(pops.length ? pops : [this.wait(50)]);
    
    // Score points
    const points = (wave.cleared?.length || 0) * 40;
    if (points > 0) {
      this.events.onScore?.(points);
      const collected = {};
      for (const { piece } of wave.cleared || []) {
        collected[piece.type] = (collected[piece.type] ?? 0) + 1;
      }
      this.events.onCollect?.(collected);
    }
    
    // Continue cascades
    await this.playGravity();
    let next = this.board.resolveWave();
    if (next) await this.runCascades(next);
    else {
      if (!this.board.hasAnyMove()) await this.playShuffle();
      this.events.onSettled?.();
    }
    
    this.busy = false;
    return true;
  }

  // FROGGY SHUFFLE - Shuffle the board
  async playFroggyShuffle() {
    if (this.busy) return false;
    this.busy = true;
    Sound.frogPower();
    
    this.floaters.add(this.w / 2, this.h / 2, '🔀 SHUFFLE!', { 
      color: '#ffffff', size: 32, stroke: '#1e5a8a', life: 1.2 
    });
    
    this.shake.add(0.2);
    
    // Shuffle the board
    this.board.froggyShuffle();
    
    // Animate pieces to new positions
    const moves = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const sp = this.spriteAt(r, c);
        if (sp) {
          moves.push(this.tween(sp, { x: this.cellX(c), y: this.cellY(r) }, 0.5, easeInOutCubic));
        }
      }
    }
    await Promise.all(moves);
    
    // Resolve any matches from the shuffle
    let next = this.board.resolveWave();
    if (next) await this.runCascades(next);
    else {
      if (!this.board.hasAnyMove()) await this.playShuffle();
      this.events.onSettled?.();
    }
    
    this.busy = false;
    return true;
  }

  hopTo(tx, ty) {
    const fj = this.frogJump;
    const sx = fj.x, sy = fj.y;
    const height = 90;
    return new Promise((resolve) => {
      this.tweens.push({
        obj: fj, dur: 0.24, t: 0, ease: (x) => x, resolve,
        keys: [],
        onUpdate: (t) => {
          fj.x = sx + (tx - sx) * t;
          fj.y = sy + (ty - sy) * t - Math.sin(t * Math.PI) * height;
          fj.scale = 1 + Math.sin(t * Math.PI) * 0.15;
        },
      });
    });
  }

  getFrogImage(frogId) {
    if (this.frogImages.has(frogId)) return Promise.resolve(this.frogImages.get(frogId));
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => { this.frogImages.set(frogId, img); resolve(img); };
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(frogSVG(frogId, { width: 120 }))}`;
    });
  }

  /* ============================================================
     per-frame update & draw
     ============================================================ */
  update(dt) {
    this.time += dt;
    this.shake.update(dt);
    this.particles.update(dt);
    this.floaters.update(dt);

    // tweens
    for (let i = this.tweens.length - 1; i >= 0; i--) {
      const tw = this.tweens[i];
      tw.t += dt;
      const t = Math.min(1, tw.t / tw.dur);
      const e = tw.ease(t);
      for (const k of tw.keys) tw.obj[k.k] = k.from + (k.to - k.from) * e;
      tw.onUpdate?.(e);
      if (t >= 1) {
        this.tweens.splice(i, 1);
        tw.resolve?.();
      }
    }

    // falling physics
    let landed = false;
    for (const sp of this.sprites.values()) {
      if (sp.falling) {
        sp.vy += GRAVITY * dt;
        sp.y += sp.vy * dt;
        if (sp.y >= sp.targetY) {
          if (sp.vy > 260) {
            sp.y = sp.targetY;
            sp.vy = -sp.vy * BOUNCE;
            sp.squash = Math.max(sp.squash, 0.3);
            landed = true;
          } else {
            sp.y = sp.targetY;
            sp.vy = 0;
            sp.falling = false;
          }
        }
      }
      sp.squash = Math.max(0, sp.squash - dt * 2.4);
    }
    if (landed && !this._landThrottle) {
      this._landThrottle = true;
      Sound.land();
      setTimeout(() => (this._landThrottle = false), 90);
    }

    // flashes
    for (let i = this.flashes.length - 1; i >= 0; i--) {
      this.flashes[i].age += dt;
      if (this.flashes[i].age >= this.flashes[i].life) this.flashes.splice(i, 1);
    }

    // self-heal sprite/grid identity drift (safety net; runs when idle)
    this._sweepT = (this._sweepT ?? 0) + dt;
    if (!this.busy && this._sweepT > 1) {
      this._sweepT = 0;
      const onGrid = new Set();
      for (let r = 0; r < this.rows; r++)
        for (let c = 0; c < this.cols; c++) {
          const p = this.board.at(r, c);
          if (!p) continue;
          onGrid.add(p);
          const sp = this.sprites.get(p);
          if (!sp) {
            this.sprites.set(p, {
              piece: p, x: this.cellX(c), y: this.cellY(r),
              scale: 0.4, squash: 0, vy: 0, phase: Math.random() * Math.PI * 2,
              falling: false, targetY: this.cellY(r),
            });
            this.tween(this.sprites.get(p), { scale: 1 }, 0.25, easeOutBack);
          }
        }
      for (const [piece, sp] of this.sprites) {
        if (!onGrid.has(piece) && !sp.popping) this.sprites.delete(piece);
      }
    }

    // idle hint
    if (!this.busy && this.enabled) {
      this.idleTime += dt;
      if (this.idleTime > 4.5 && !this.hintCells) this.hintCells = this.findHint();
    } else {
      this.idleTime = 0;
      this.hintCells = null;
    }
  }

  findHint() {
    for (let r = 0; r < this.rows; r++)
      for (let c = 0; c < this.cols; c++) {
        if (c + 1 < this.cols && this.board.wouldMatch({ r, c }, { r, c: c + 1 }))
          return [{ r, c }, { r, c: c + 1 }];
        if (r + 1 < this.rows && this.board.wouldMatch({ r, c }, { r: r + 1, c }))
          return [{ r, c }, { r: r + 1, c }];
      }
    return null;
  }

  draw() {
    const ctx = this.ctx;
    ctx.save();
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, this.w, this.h);

    const off = this.shake.offset;
    ctx.translate(this.w / 2 + off.x, this.h / 2 + off.y);
    ctx.rotate(off.rot);
    ctx.translate(-this.w / 2, -this.h / 2);

    // checkerboard cells
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        ctx.fillStyle = (r + c) % 2 === 0 ? 'rgba(255, 253, 235, 0.28)' : 'rgba(214, 245, 200, 0.20)';
        roundRect(ctx, c * CELL + 2, r * CELL + 2, CELL - 4, CELL - 4, 9);
        ctx.fill();
      }
    }

    // selection / hint highlights
    if (this.selected) this.drawCellGlow(this.selected, 'rgba(255, 230, 120, 0.85)');
    if (this.hintCells) {
      const pulse = 0.5 + Math.sin(this.time * 5) * 0.35;
      for (const cell of this.hintCells) this.drawCellGlow(cell, `rgba(255,255,255,${pulse.toFixed(2)})`);
    }

    // sprites (sorted so falling pieces draw over settled ones)
    const list = [...this.sprites.values()];
    list.sort((a, b) => a.y - b.y);
    for (const sp of list) {
      const piece = sp.piece;
      const img = getPieceSprite(piece.type, piece.special);
      const breath = 1 + Math.sin(this.time * 2.1 + sp.phase) * 0.012;
      let sx = sp.scale * breath;
      let sy = sp.scale * breath;
      if (sp.squash > 0) {
        sy *= 1 - sp.squash * 0.45;
        sx *= 1 + sp.squash * 0.3;
      }
      const isSel = this.selected && this.spriteAt(this.selected.r, this.selected.c) === sp;
      if (isSel) {
        const wob = 1 + Math.sin(this.time * 9) * 0.06;
        sx *= wob; sy *= wob;
      }
      // pulsing halo behind specials
      if (piece.special) {
        const pulse = 0.35 + Math.sin(this.time * 4 + sp.phase) * 0.15;
        const g = ctx.createRadialGradient(sp.x, sp.y, 4, sp.x, sp.y, CELL * 0.62);
        g.addColorStop(0, `rgba(255,255,255,${pulse.toFixed(2)})`);
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, CELL * 0.62, 0, Math.PI * 2);
        ctx.fill();
      }
      const size = CELL * 1.06;
      ctx.drawImage(img, sp.x - (size * sx) / 2, sp.y - (size * sy) / 2, size * sx, size * sy);
    }

    this.drawFlashes(ctx);
    this.particles.draw(ctx);

    // mega frog on top
    if (this.frogJump) {
      const fj = this.frogJump;
      const s = 74 * fj.scale;
      ctx.drawImage(fj.img, fj.x - s / 2, fj.y - s * 0.8, s, s * 0.92);
    }

    this.floaters.draw(ctx);
    ctx.restore();
  }

  drawCellGlow(cell, color) {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    roundRect(ctx, cell.c * CELL + 3, cell.r * CELL + 3, CELL - 6, CELL - 6, 10);
    ctx.stroke();
    ctx.restore();
  }

  drawFlashes(ctx) {
    for (const f of this.flashes) {
      const t = f.age / f.life;
      const alpha = 1 - t;
      if (f.kind === 'rocketH' || f.kind === 'rocketV') {
        const y = this.cellY(f.r);
        const x = this.cellX(f.c);
        ctx.save();
        ctx.globalAlpha = alpha;
        const thick = CELL * (0.75 - t * 0.4);
        if (f.kind === 'rocketH') {
          const g = ctx.createLinearGradient(0, y - thick, 0, y + thick);
          g.addColorStop(0, 'rgba(255,200,80,0)');
          g.addColorStop(0.5, '#fff6d0');
          g.addColorStop(1, 'rgba(255,200,80,0)');
          ctx.fillStyle = g;
          ctx.fillRect(0, y - thick / 2, this.w, thick);
        } else {
          const g = ctx.createLinearGradient(x - thick, 0, x + thick, 0);
          g.addColorStop(0, 'rgba(255,200,80,0)');
          g.addColorStop(0.5, '#fff6d0');
          g.addColorStop(1, 'rgba(255,200,80,0)');
          ctx.fillStyle = g;
          ctx.fillRect(x - thick / 2, 0, thick, this.h);
        }
        ctx.restore();
      } else if (f.kind === 'bomb') {
        const x = this.cellX(f.c), y = this.cellY(f.r);
        const rad = CELL * (0.5 + t * 2.6);
        ctx.save();
        ctx.globalAlpha = alpha * 0.9;
        ctx.strokeStyle = '#ffd27a';
        ctx.lineWidth = 10 * (1 - t) + 2;
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = alpha * 0.35;
        const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
        g.addColorStop(0, '#fff1c0');
        g.addColorStop(1, 'rgba(255,150,60,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (f.kind === 'rainbow') {
        ctx.save();
        ctx.globalAlpha = alpha * 0.5;
        const g = ctx.createLinearGradient(0, 0, this.w, this.h);
        ['#ff5e7e', '#ffe14d', '#7ee081', '#5ec8ff', '#b48cff'].forEach((c, i, arr) =>
          g.addColorStop(i / (arr.length - 1), c));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, this.w, this.h);
        ctx.restore();
      }
    }
  }
}

/* ---------------- helpers ---------------- */
function isAdjacent(a, b) {
  return Math.abs(a.r - b.r) + Math.abs(a.c - b.c) === 1;
}
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
function easeInCubic(t) { return t * t * t; }
function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
function easeOutBack(t) { const c = 1.4; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }