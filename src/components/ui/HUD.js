// Gameplay HUD: moves, score progress bar with star markers,
// collect-objectives with live counts, and the combo banner.

import { pieceIconHTML } from './pieceIcon.js';

export class HUD {
  constructor(container, level) {
    this.level = level;
    this.maxScore = level.stars[2] * 1.08;

    this.root = document.createElement('div');
    this.root.innerHTML = `
      <div class="hud-top">
        <button class="btn btn-blue btn-round" id="pauseBtn" style="width:52px;height:52px;font-size:20px;align-self:center;">⏸</button>
        <div class="hud-pill" style="flex:0 0 92px;">
          <div class="hud-label">Moves</div>
          <div class="hud-value" id="movesVal">${level.moves}</div>
        </div>
        <div class="hud-pill" style="flex:1;">
          <div class="hud-label">Score</div>
          <div class="hud-value" id="scoreVal" style="font-size:22px;">0</div>
          <div class="score-bar-wrap">
            <div class="score-bar" id="scoreBar"></div>
            ${level.stars.map((s, i) => `<div class="score-star" id="star${i}" style="left:${(s / this.maxScore) * 100}%;">⭐</div>`).join('')}
          </div>
        </div>
      </div>
      <div class="hud-top" style="padding-top:6px;">
        <div class="hud-pill" style="padding:4px 8px;">
          <div class="objective-row" id="objRow">
            ${Object.entries(level.collect).map(([type, count]) => `
              <div class="objective-chip" data-type="${type}">
                ${pieceIconHTML(type, 30)}
                <span class="obj-count">0/${count}</span>
              </div>`).join('')}
          </div>
        </div>
      </div>
    `;
    container.appendChild(this.root);

    this.movesEl = this.root.querySelector('#movesVal');
    this.scoreEl = this.root.querySelector('#scoreVal');
    this.barEl = this.root.querySelector('#scoreBar');
    this.starEls = level.stars.map((_, i) => this.root.querySelector(`#star${i}`));
    this.displayScore = 0;
    this.targetScore = 0;
    this._raf = null;
  }

  get pauseButton() { return this.root.querySelector('#pauseBtn'); }

  setMoves(n) {
    this.movesEl.textContent = n;
    this.movesEl.classList.toggle('warn', n <= 5);
    this.movesEl.animate([{ transform: 'scale(1.3)' }, { transform: 'scale(1)' }], { duration: 200 });
  }

  setScore(score) {
    this.targetScore = score;
    this.barEl.style.width = `${Math.min(100, (score / this.maxScore) * 100)}%`;
    this.level.stars.forEach((s, i) => {
      if (score >= s && !this.starEls[i].classList.contains('earned')) {
        this.starEls[i].classList.add('earned');
      }
    });
    if (!this._raf) this.tickScore();
  }

  tickScore() {
    const diff = this.targetScore - this.displayScore;
    if (Math.abs(diff) < 1) {
      this.displayScore = this.targetScore;
      this.scoreEl.textContent = Math.round(this.displayScore).toLocaleString();
      this._raf = null;
      return;
    }
    this.displayScore += diff * 0.14;
    this.scoreEl.textContent = Math.round(this.displayScore).toLocaleString();
    this._raf = requestAnimationFrame(() => this.tickScore());
  }

  /** progress: { type: collectedCount } */
  setObjectives(progress) {
    let allDone = true;
    for (const [type, needed] of Object.entries(this.level.collect)) {
      const chip = this.root.querySelector(`.objective-chip[data-type="${type}"]`);
      const got = Math.min(progress[type] ?? 0, needed);
      const countEl = chip.querySelector('.obj-count');
      const done = got >= needed;
      if (!done) allDone = false;
      const label = done ? `<span class="obj-check">✔</span>` : `${got}/${needed}`;
      if (countEl.innerHTML !== label) {
        countEl.innerHTML = label;
        chip.classList.toggle('done', done);
        chip.animate([{ transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 180 });
      }
    }
    return allDone;
  }

  destroy() {
    if (this._raf) cancelAnimationFrame(this._raf);
  }
}