// Pure match-3 board logic. No rendering, no DOM — the BoardView
// drives this and animates the diffs it returns.
//
// Piece = { type: speciesId, special: null|'rocketH'|'rocketV'|'bomb'|'rainbow' }
// Cells are addressed as (row, col), row 0 at the top.

import { SPAWNABLE, getSpawnableForLevel } from '../../data/pieceTypes.js';

export const ROWS = 8;
export const COLS = 8;
export const MAX_ROWS = 10;
export const MAX_COLS = 10;

export class Board {
  constructor(types = SPAWNABLE, rows = ROWS, cols = COLS) {
    this.types = types;
    this.rows = rows;
    this.cols = cols;
    this.grid = [];
    this.levelId = 1;
    this.neededTypes = {}; // Track which types are needed for objectives
    this.fill();
  }

  // Set the level ID to determine which types can spawn
  setLevel(levelId, neededTypes = {}) {
    this.levelId = levelId;
    this.types = getSpawnableForLevel(levelId);
    this.neededTypes = neededTypes;
    this.movesLeft = null;
    this.totalMoves = null;
    
    // Increase board size for harder levels
    if (levelId >= 31) {
      this.rows = 10;
      this.cols = 10;
    } else if (levelId >= 21) {
      this.rows = 9;
      this.cols = 9;
    } else if (levelId >= 12) {
      this.rows = 9;
      this.cols = 9;
    } else {
      this.rows = 8;
      this.cols = 8;
    }
    
    this.fill();
    return this;
  }

  /** Extra moves for levels with diverse collect requirements */
  moveBonus() {
    const n = Object.keys(this.neededTypes).length;
    if (n >= 5) return 8;
    if (n >= 4) return 6;
    if (n >= 3) return 4;
    if (n >= 2) return 2;
    return 0;
  }

  randomType() {
    // ADAPTIVE BIAS: biases toward ALL needed types proportionally.
    // Ramping up as moves dwindle so it helps when struggling without
    // making early moves trivial.
    //
    //   moves left      bias chance
    //   ----------      -----------
    //   ≤ 15%            45%       (desperate)
    //   ≤ 30%            30%       (struggling)
    //   ≤ 50%            20%       (getting tight)
    //   > 50%            10%       (comfortable)
    //   unknown          12%       (fallback)
    //
    const neededKeys = Object.keys(this.neededTypes);
    if (neededKeys.length === 0) return this.types[(Math.random() * this.types.length) | 0];

    let biasChance = 0.12;
    if (this.movesLeft !== null && this.totalMoves !== null && this.totalMoves > 0) {
      const ratio = this.movesLeft / this.totalMoves;
      if (ratio <= 0.15) biasChance = 0.45;
      else if (ratio <= 0.30) biasChance = 0.30;
      else if (ratio <= 0.50) biasChance = 0.20;
      else biasChance = 0.10;
    }

    if (Math.random() < biasChance) {
      // Pick from needed types proportional to remaining count
      const available = neededKeys.filter(t => this.types.includes(t));
      if (available.length > 0) {
        const total = available.reduce((s, t) => s + (this.neededTypes[t] || 0), 0);
        let r = Math.random() * total;
        for (const t of available) {
          r -= (this.neededTypes[t] || 0);
          if (r <= 0) return t;
        }
        return available[available.length - 1];
      }
    }
    return this.types[(Math.random() * this.types.length) | 0];
  }

  /** Fill the board with no pre-existing matches and at least one move. */
  fill() {
    do {
      this.grid = [];
      for (let r = 0; r < this.rows; r++) {
        const row = [];
        for (let c = 0; c < this.cols; c++) {
          let type;
          let attempts = 0;
          do {
            type = this.randomType();
            attempts++;
            if (attempts > 100) break;
          } while (
            (c >= 2 && row[c - 1]?.type === type && row[c - 2]?.type === type) ||
            (r >= 2 && this.grid[r - 1][c]?.type === type && this.grid[r - 2][c]?.type === type)
          );
          row.push({ type, special: null });
        }
        this.grid.push(row);
      }
    } while (!this.hasAnyMove());
  }

  at(r, c) {
    if (r < 0 || c < 0 || r >= this.rows || c >= this.cols) return null;
    return this.grid[r][c];
  }

  swap(a, b) {
    const t = this.grid[a.r][a.c];
    this.grid[a.r][a.c] = this.grid[b.r][b.c];
    this.grid[b.r][b.c] = t;
  }

  /* ------------------------------------------------------------
     Match detection: horizontal + vertical runs of >= 3, merged
     into groups so L/T intersections can become bombs.
     Each group: { type, cells:Set("r,c"), runs:[{dir,len}] }
     ------------------------------------------------------------ */
  findMatchGroups() {
    const runs = [];
    // horizontal
    for (let r = 0; r < this.rows; r++) {
      let c = 0;
      while (c < this.cols) {
        const p = this.at(r, c);
        if (!p) { c++; continue; }
        let end = c + 1;
        while (end < this.cols && this.at(r, end)?.type === p.type) end++;
        if (end - c >= 3) runs.push({ dir: 'h', r, c, len: end - c, type: p.type });
        c = end;
      }
    }
    // vertical
    for (let c = 0; c < this.cols; c++) {
      let r = 0;
      while (r < this.rows) {
        const p = this.at(r, c);
        if (!p) { r++; continue; }
        let end = r + 1;
        while (end < this.rows && this.at(end, c)?.type === p.type) end++;
        if (end - r >= 3) runs.push({ dir: 'v', r, c, len: end - r, type: p.type });
        r = end;
      }
    }

    // merge overlapping runs of the same type into groups
    const groups = [];
    for (const run of runs) {
      const cells = [];
      for (let i = 0; i < run.len; i++) {
        cells.push(run.dir === 'h' ? `${run.r},${run.c + i}` : `${run.r + i},${run.c}`);
      }
      let target = null;
      for (const g of groups) {
        if (g.type === run.type && cells.some((k) => g.cells.has(k))) { target = g; break; }
      }
      if (!target) {
        target = { type: run.type, cells: new Set(), runs: [] };
        groups.push(target);
      }
      cells.forEach((k) => target.cells.add(k));
      target.runs.push(run);
    }
    return groups;
  }

  /** What special (if any) does a match group create? */
  static specialForGroup(group) {
    const maxLen = Math.max(...group.runs.map((r) => r.len));
    const hasH = group.runs.some((r) => r.dir === 'h');
    const hasV = group.runs.some((r) => r.dir === 'v');
    if (maxLen >= 5) return 'rainbow';
    if (hasH && hasV) return 'bomb';
    if (maxLen === 4) {
      return group.runs.find((r) => r.len === 4).dir === 'h' ? 'rocketH' : 'rocketV';
    }
    return null;
  }

  /* ------------------------------------------------------------
     Resolve one wave of matches.
     preferredCells: cells (e.g. the swapped ones) where a created
     special should land.
     Returns null if no matches, else:
     { cleared:[{r,c,piece}], created:[{r,c,special,type}],
       effects:[{kind,r,c,...}] }
     ------------------------------------------------------------ */
  resolveWave(preferredCells = []) {
    const groups = this.findMatchGroups();
    if (groups.length === 0) return null;

    const clearedKeys = new Set();
    const created = [];
    const effects = [];

    for (const g of groups) {
      const special = Board.specialForGroup(g);
      let anchor = null;
      if (special) {
        anchor =
          preferredCells.find((p) => g.cells.has(`${p.r},${p.c}`)) ??
          keyToCell([...g.cells][Math.floor(g.cells.size / 2)]);
        created.push({ r: anchor.r, c: anchor.c, special, type: g.type });
      }
      for (const key of g.cells) {
        if (anchor && key === `${anchor.r},${anchor.c}`) continue;
        clearedKeys.add(key);
      }
    }

    // chain-activate any specials caught in the blast
    this.expandSpecials(clearedKeys, effects, created);

    const cleared = [...clearedKeys].map((key) => {
      const { r, c } = keyToCell(key);
      return { r, c, piece: this.grid[r][c] };
    }).filter((x) => x.piece);

    // apply to grid
    for (const { r, c } of cleared) this.grid[r][c] = null;
    for (const cr of created) {
      const p = this.grid[cr.r][cr.c];
      if (p) {
        p.type = cr.type;
        p.special = cr.special;
      } else {
        this.grid[cr.r][cr.c] = { type: cr.type, special: cr.special };
      }
    }

    return { cleared, created, effects };
  }

  /**
   * Any special piece inside clearedKeys fires its effect, possibly
   * catching more specials — resolved breadth-first.
   * `protectedCells` (newly created specials) are not consumed.
   */
  expandSpecials(clearedKeys, effects, protectedCells = []) {
    const isProtected = (r, c) => protectedCells.some((p) => p.r === r && p.c === c);
    const queue = [...clearedKeys];
    const processed = new Set();
    while (queue.length) {
      const key = queue.shift();
      if (processed.has(key)) continue;
      processed.add(key);
      const { r, c } = keyToCell(key);
      if (isProtected(r, c)) { clearedKeys.delete(key); continue; }
      const piece = this.at(r, c);
      if (!piece) continue;
      clearedKeys.add(key);
      if (!piece.special) continue;

      const add = (rr, cc) => {
        if (rr < 0 || cc < 0 || rr >= this.rows || cc >= this.cols) return;
        if (isProtected(rr, cc)) return;
        const k = `${rr},${cc}`;
        if (!processed.has(k)) queue.push(k);
      };

      if (piece.special === 'rocketH') {
        effects.push({ kind: 'rocketH', r, c });
        for (let cc = 0; cc < this.cols; cc++) add(r, cc);
      } else if (piece.special === 'rocketV') {
        effects.push({ kind: 'rocketV', r, c });
        for (let rr = 0; rr < this.rows; rr++) add(rr, c);
      } else if (piece.special === 'bomb') {
        effects.push({ kind: 'bomb', r, c });
        for (let rr = r - 1; rr <= r + 1; rr++)
          for (let cc = c - 1; cc <= c + 1; cc++) add(rr, cc);
      } else if (piece.special === 'rainbow') {
        const target = this.mostCommonType();
        effects.push({ kind: 'rainbow', r, c, targetType: target });
        for (let rr = 0; rr < this.rows; rr++)
          for (let cc = 0; cc < this.cols; cc++)
            if (this.at(rr, cc)?.type === target && !this.at(rr, cc).special) add(rr, cc);
      }
    }
  }

  /** Fire a rainbow that was deliberately swapped with `otherType`. */
  activateRainbow(cell, otherType) {
    const clearedKeys = new Set([`${cell.r},${cell.c}`]);
    const effects = [{ kind: 'rainbow', ...cell, targetType: otherType }];
    for (let r = 0; r < this.rows; r++)
      for (let c = 0; c < this.cols; c++)
        if (this.at(r, c)?.type === otherType) clearedKeys.add(`${r},${c}`);
    this.expandSpecials(clearedKeys, effects);
    const cleared = [...clearedKeys].map((key) => {
      const { r, c } = keyToCell(key);
      return { r, c, piece: this.grid[r][c] };
    }).filter((x) => x.piece);
    for (const { r, c } of cleared) this.grid[r][c] = null;
    return { cleared, created: [], effects };
  }

  /** Fire a special that was swapped (not matched). */
  activateSpecialAt(cell) {
    const clearedKeys = new Set([`${cell.r},${cell.c}`]);
    const effects = [];
    this.expandSpecials(clearedKeys, effects);
    const cleared = [...clearedKeys].map((key) => {
      const { r, c } = keyToCell(key);
      return { r, c, piece: this.grid[r][c] };
    }).filter((x) => x.piece);
    for (const { r, c } of cleared) this.grid[r][c] = null;
    return { cleared, created: [], effects };
  }

  /** FROGGY POWER: Clear random cells */
  frogStomp(count = 10) {
    const candidates = [];
    for (let r = 0; r < this.rows; r++)
      for (let c = 0; c < this.cols; c++)
        if (this.at(r, c)) candidates.push({ r, c });
    shuffle(candidates);
    const picked = candidates.slice(0, count);
    const clearedKeys = new Set(picked.map((p) => `${p.r},${p.c}`));
    const effects = [];
    this.expandSpecials(clearedKeys, effects);
    const cleared = [...clearedKeys].map((key) => {
      const { r, c } = keyToCell(key);
      return { r, c, piece: this.grid[r][c] };
    }).filter((x) => x.piece);
    for (const { r, c } of cleared) this.grid[r][c] = null;
    return { cleared, created: [], effects, stomps: picked };
  }

  // ============================================================
  // POWER-UPS
  // ============================================================

  froggySwap(fromType, toType) {
    const clearedKeys = new Set();
    const effects = [];
    const swapped = [];
    
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const p = this.at(r, c);
        if (p && p.type === fromType && !p.special) {
          p.type = toType;
          swapped.push({ r, c, from: fromType, to: toType });
          clearedKeys.add(`${r},${c}`);
        }
      }
    }
    
    this.expandSpecials(clearedKeys, effects);
    
    const cleared = [...clearedKeys].map((key) => {
      const { r, c } = keyToCell(key);
      return { r, c, piece: this.grid[r][c] };
    }).filter((x) => x.piece);
    
    for (const { r, c } of cleared) this.grid[r][c] = null;
    return { cleared, created: [], effects, swapped };
  }

  froggyRainbow(targetType) {
    const created = [];
    const clearedKeys = new Set();
    const effects = [];
    const rainbowed = [];
    
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const p = this.at(r, c);
        if (p && p.type === targetType && !p.special) {
          p.special = 'rainbow';
          rainbowed.push({ r, c });
          created.push({ r, c, special: 'rainbow', type: p.type });
          clearedKeys.add(`${r},${c}`);
        }
      }
    }
    
    this.expandSpecials(clearedKeys, effects, created);
    
    const cleared = [...clearedKeys].map((key) => {
      const { r, c } = keyToCell(key);
      return { r, c, piece: this.grid[r][c] };
    }).filter((x) => x.piece);
    
    for (const { r, c } of cleared) this.grid[r][c] = null;
    return { cleared, created, effects, rainbowed };
  }

  froggyClear(targetType) {
    const clearedKeys = new Set();
    const effects = [];
    const clearedCells = [];
    
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const p = this.at(r, c);
        if (p && p.type === targetType) {
          clearedKeys.add(`${r},${c}`);
          clearedCells.push({ r, c });
        }
      }
    }
    
    this.expandSpecials(clearedKeys, effects);
    
    const cleared = [...clearedKeys].map((key) => {
      const { r, c } = keyToCell(key);
      return { r, c, piece: this.grid[r][c] };
    }).filter((x) => x.piece);
    
    for (const { r, c } of cleared) this.grid[r][c] = null;
    return { cleared, created: [], effects, clearedCells };
  }

  froggyShuffle() {
    const pieces = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.at(r, c)) {
          pieces.push(this.grid[r][c]);
        }
      }
    }
    
    let attempts = 0;
    do {
      shuffle(pieces);
      let idx = 0;
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          if (this.at(r, c)) {
            this.grid[r][c] = pieces[idx++];
          }
        }
      }
      attempts++;
    } while ((this.findMatchGroups().length > 0 || !this.hasAnyMove()) && attempts < 30);

    return { success: true, attempts };
  }

  /* -------- extra power-up effects (Lily Bomb / Cross Strike / Tidal Wave) -------- */

  /** count needed-objective pieces in a row (bias power-ups toward goals) */
  _neededInRow(r) {
    let n = 0;
    for (let c = 0; c < this.cols; c++) { const p = this.at(r, c); if (p && this.neededTypes[p.type]) n++; }
    return n;
  }
  _neededInCol(c) {
    let n = 0;
    for (let r = 0; r < this.rows; r++) { const p = this.at(r, c); if (p && this.neededTypes[p.type]) n++; }
    return n;
  }
  _collect(clearedKeys, effects) {
    const cleared = [...clearedKeys].map((key) => {
      const { r, c } = keyToCell(key);
      return { r, c, piece: this.grid[r][c] };
    }).filter((x) => x.piece);
    for (const { r, c } of cleared) this.grid[r][c] = null;
    return { cleared, created: [], effects };
  }

  /** LILY BOMB: blast a 3×3 crater, centred on a dense/needed spot. */
  lilyBomb() {
    let best = { r: 1, c: 1, score: -1 };
    for (let r = 1; r < this.rows - 1; r++)
      for (let c = 1; c < this.cols - 1; c++) {
        let s = 0;
        for (let dr = -1; dr <= 1; dr++)
          for (let dc = -1; dc <= 1; dc++) {
            const p = this.at(r + dr, c + dc);
            if (p) s += this.neededTypes[p.type] ? 2 : 1;
          }
        if (s > best.score) best = { r, c, score: s };
      }
    const keys = new Set();
    for (let dr = -1; dr <= 1; dr++)
      for (let dc = -1; dc <= 1; dc++)
        if (this.at(best.r + dr, best.c + dc)) keys.add(`${best.r + dr},${best.c + dc}`);
    const effects = [{ kind: 'bomb', r: best.r, c: best.c }];
    this.expandSpecials(keys, effects);
    return { ...this._collect(keys, effects), center: { r: best.r, c: best.c } };
  }

  /** CROSS STRIKE: clear the fullest needed row + column. */
  crossStrike() {
    let br = 0, bc = 0, bs = -1;
    for (let r = 0; r < this.rows; r++) { const s = this._neededInRow(r); if (s > bs) { bs = s; br = r; } }
    bs = -1;
    for (let c = 0; c < this.cols; c++) { const s = this._neededInCol(c); if (s > bs) { bs = s; bc = c; } }
    const keys = new Set();
    for (let c = 0; c < this.cols; c++) if (this.at(br, c)) keys.add(`${br},${c}`);
    for (let r = 0; r < this.rows; r++) if (this.at(r, bc)) keys.add(`${r},${bc}`);
    const effects = [{ kind: 'rocketH', r: br, c: bc }, { kind: 'rocketV', r: br, c: bc }];
    this.expandSpecials(keys, effects);
    return this._collect(keys, effects);
  }

  /** TIDAL WAVE: sweep away the two fullest needed rows. */
  tidalWave() {
    const ranked = [];
    for (let r = 0; r < this.rows; r++) ranked.push({ r, s: this._neededInRow(r) });
    ranked.sort((a, b) => b.s - a.s);
    const rows = ranked.slice(0, 2).map((x) => x.r);
    const keys = new Set();
    const effects = [];
    for (const r of rows) {
      effects.push({ kind: 'rocketH', r, c: (this.cols / 2) | 0 });
      for (let c = 0; c < this.cols; c++) if (this.at(r, c)) keys.add(`${r},${c}`);
    }
    this.expandSpecials(keys, effects);
    return this._collect(keys, effects);
  }

  mostCommonType() {
    const counts = {};
    for (let r = 0; r < this.rows; r++)
      for (let c = 0; c < this.cols; c++) {
        const p = this.at(r, c);
        if (p && !p.special) counts[p.type] = (counts[p.type] ?? 0) + 1;
      }
    let best = this.types[0], bestN = -1;
    for (const [t, n] of Object.entries(counts)) if (n > bestN) { best = t; bestN = n; }
    return best;
  }

  /* ------------------------------------------------------------
     Gravity: pieces fall straight down; new pieces spawn above.
     Returns { falls:[{piece, fromR, toR, c}], spawns:[{piece, r, c, order}] }
     ------------------------------------------------------------ */
  applyGravity() {
    const falls = [];
    const spawns = [];
    for (let c = 0; c < this.cols; c++) {
      let write = this.rows - 1;
      for (let r = this.rows - 1; r >= 0; r--) {
        const p = this.grid[r][c];
        if (!p) continue;
        if (write !== r) {
          this.grid[write][c] = p;
          this.grid[r][c] = null;
          falls.push({ piece: p, fromR: r, toR: write, c });
        }
        write--;
      }
      let order = 0;
      for (let r = write; r >= 0; r--) {
        const piece = { type: this.randomType(), special: null };
        this.grid[r][c] = piece;
        spawns.push({ piece, r, c, order: order++ });
      }
    }
    return { falls, spawns };
  }

  /* ------------------------------------------------------------
     Valid-move detection & shuffling
     ------------------------------------------------------------ */
  wouldMatch(a, b) {
    this.swap(a, b);
    const ok = this.findMatchGroups().length > 0;
    this.swap(a, b);
    return ok;
  }

  hasAnyMove() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const p = this.at(r, c);
        if (p?.special) return true;
        if (c + 1 < this.cols && this.wouldMatch({ r, c }, { r, c: c + 1 })) return true;
        if (r + 1 < this.rows && this.wouldMatch({ r, c }, { r: r + 1, c })) return true;
      }
    }
    return false;
  }

  shuffleBoard() {
    const pieces = [];
    for (let r = 0; r < this.rows; r++)
      for (let c = 0; c < this.cols; c++) pieces.push(this.grid[r][c]);
    let guard = 0;
    do {
      shuffle(pieces);
      let i = 0;
      for (let r = 0; r < this.rows; r++)
        for (let c = 0; c < this.cols; c++) this.grid[r][c] = pieces[i++];
      guard++;
    } while ((this.findMatchGroups().length > 0 || !this.hasAnyMove()) && guard < 60);
  }
}

function keyToCell(key) {
  const [r, c] = key.split(',').map(Number);
  return { r, c };
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}