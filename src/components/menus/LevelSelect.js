// ============================================================
// LevelSelect — the island trail (built fresh, tropical/beachy).
//
// A vertical, winding sandy trail climbs a sunny island: level 1 at the
// shoreline, later levels further up. Wooden signposts mark each world,
// frog friends wave you on, and palms / huts / shells dress the path.
// Everything is a real SVG asset — no emoji. Centered column on desktop
// (scenery fills the gutters), full-width on mobile.
// ============================================================

import { LEVELS, WORLDS, levelsInWorld } from '../../data/levels.js';
import { FROGS } from '../../data/frogs.js';
import { frogSVG } from '../characters/FrogArt.js';
import { Sound } from '../../game/effects/Sound.js';
import { icon } from '../ui/icons.js';
import { palm, hut, signpost, shell, starfish, rock, grass, boat, cloud, nodeStars } from './islandAssets.js';

// per-world accent (subtle tropical variety, still beachy)
const WORLD_ACCENT = {
  1: { c: '#43b32a', deep: '#2c8a3e' },
  2: { c: '#1e9de2', deep: '#0f6f9c' },
  3: { c: '#f0921e', deep: '#c26a0c' },
  4: { c: '#9a7bff', deep: '#6a4fc0' },
  5: { c: '#ff5e9c', deep: '#d13f79' },
};

const SPACING = 96;      // vertical px between nodes
const PAD_TOP = 150;
const PAD_BOTTOM = 190;

function splitmix(seed) {
  let s = seed | 0;
  return function () {
    s = (s + 0x9e3779b9) | 0;
    let z = s;
    z = Math.imul(z ^ (z >>> 16), 0x85ebca6b);
    z = Math.imul(z ^ (z >>> 13), 0xc2b2ae35);
    z = (z ^ (z >>> 16)) >>> 0;
    return z / 4294967296;
  };
}

export function mountLevelSelect(stage, controller) {
  const root = document.createElement('div');
  root.className = 'screen level-select';
  stage.appendChild(root);

  let scrollEl = null;
  let onScroll = null;
  const total = LEVELS.length;
  const trailH = PAD_TOP + (total - 1) * SPACING + PAD_BOTTOM;

  /* ---- geometry: node positions (level 1 at bottom) ---- */
  function computePositions(colW) {
    const margin = Math.max(58, colW * 0.16);
    const amp = (colW - margin * 2) / 2;
    const center = colW / 2;
    return LEVELS.map((lv, i) => {
      const rng = splitmix(lv.id * 2654435761);
      const y = trailH - PAD_BOTTOM - i * SPACING;
      const wave = Math.sin(i * 0.62 + 0.4) * amp;
      const jitter = (rng() - 0.5) * amp * 0.18;
      const x = Math.max(margin, Math.min(colW - margin, center + wave + jitter));
      return { lv, x, y, i };
    });
  }

  function catmull(pts) {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      const p0 = pts[Math.max(0, i - 2)], p1 = pts[i - 1], p2 = pts[i], p3 = pts[Math.min(pts.length - 1, i + 1)];
      const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  }

  /* ---- decorations along the trail ---- */
  function buildDecor(pos, colW) {
    const items = [];
    const rng = splitmix(9173);
    const side = (x) => (x < colW / 2 ? 'right' : 'left'); // place decor on the open side
    // world markers (signpost + frog) at each world's first level
    for (const w of WORLDS) {
      const first = pos.find((p) => p.lv.id === w.startId);
      if (!first) continue;
      const acc = WORLD_ACCENT[w.id];
      const s = side(first.x);
      const sx = s === 'left' ? first.x - 120 : first.x + 120;
      items.push(`<div class="ls-sign" style="left:${(sx / colW) * 100}%;top:${first.y - 70}px;">${signpost(w.name, acc.c)}</div>`);
      const frogId = w.frog;
      const fx = s === 'left' ? first.x + 96 : first.x - 96;
      const locked = !controller.isWorldUnlocked(w.id);
      items.push(`<div class="ls-frog ls-bob" style="left:${(fx / colW) * 100}%;top:${first.y + 6}px;${locked ? 'filter:grayscale(0.8) brightness(0.85);' : ''}">
        <div class="ls-frog-name" style="--acc:${acc.c}">${FROGS[frogId]?.name || ''}</div>${frogSVG(frogId, { width: 78 })}</div>`);
    }
    // scattered scenery between nodes
    for (let i = 0; i < pos.length; i += 1) {
      const p = pos[i];
      if (rng() > 0.55) continue;
      const s = side(p.x);
      const off = 92 + rng() * 60;
      const dx = s === 'left' ? p.x - off : p.x + off;
      if (dx < 30 || dx > colW - 30) continue;
      const y = p.y - 20 + (rng() - 0.5) * 40;
      const pick = rng();
      let art, cls = 'ls-decor';
      if (pick < 0.28) { art = palm(120 + rng() * 50); cls += ' ls-sway'; }
      else if (pick < 0.42) { art = hut(96, ['#ff7e5f', '#4fc7ff', '#ffb03a'][(rng() * 3) | 0]); }
      else if (pick < 0.58) { art = shell(30 + rng() * 12, ['#ff9ec8', '#a0e8ff', '#ffd6a0'][(rng() * 3) | 0]); }
      else if (pick < 0.72) { art = starfish(30 + rng() * 12, ['#ffb03a', '#ff7e5f'][(rng() * 2) | 0]); }
      else if (pick < 0.84) { art = rock(40 + rng() * 20); }
      else if (pick < 0.94) { art = grass(40 + rng() * 16); }
      else { art = boat(84); cls += ' ls-bob'; }
      items.push(`<div class="${cls}" style="left:${(dx / colW) * 100}%;top:${y}px;">${art}</div>`);
    }
    return items.join('');
  }

  /* ---- nodes ---- */
  function buildNodes(pos, colW) {
    const currentId = controller.currentLevelId();
    return pos.map((p) => {
      const { lv } = p;
      const acc = WORLD_ACCENT[getWorldId(lv.id)];
      const unlocked = controller.isWorldUnlocked(getWorldId(lv.id)) && controller.isUnlocked(lv.id);
      const stars = controller.starsFor(lv.id);
      const state = !unlocked ? 'locked' : lv.id === currentId ? 'current' : stars > 0 ? 'done' : 'open';
      return `<button class="trail-node ${state}" data-level="${lv.id}" style="left:${(p.x / colW) * 100}%;top:${p.y}px;--acc:${acc.c};--accd:${acc.deep};">
        ${state === 'current' ? `<span class="node-flag">PLAY</span>` : ''}
        <span class="node-disc"><span class="node-face">${unlocked ? lv.id : icon('lock', { size: 26 })}</span></span>
        <span class="node-stars">${nodeStars(stars, unlocked)}</span>
      </button>`;
    }).join('');
  }

  function getWorldId(levelId) {
    const w = WORLDS.find((x) => levelId >= x.startId && levelId < x.startId + x.count);
    return w ? w.id : 1;
  }

  /* ---- render ---- */
  function render(preserveFrac = null) {
    if (scrollEl && onScroll) scrollEl.removeEventListener('scroll', onScroll);
    const vw = root.clientWidth || window.innerWidth;
    const colW = Math.min(vw, 560);
    const pos = computePositions(colW);
    const pathD = catmull(pos);
    const totalStars = controller.totalStars();
    const maxStars = total * 3;
    const curWorld = getWorldId(controller.currentLevelId());

    root.innerHTML = `
      <div class="ls-sky">
        <div class="ls-sun"></div>
        <div class="ls-cloud c1"></div><div class="ls-cloud c2"></div><div class="ls-cloud c3"></div>
        <div class="ls-sea"><div class="ls-wave"></div></div>
      </div>
      <div class="ls-scroll">
        <div class="ls-trail" style="height:${trailH}px;max-width:${colW}px;">
          <div class="ls-ground"></div>
          <svg class="ls-path" width="${colW}" height="${trailH}" viewBox="0 0 ${colW} ${trailH}" preserveAspectRatio="none">
            <path d="${pathD}" fill="none" stroke="rgba(120,80,30,0.22)" stroke-width="34" stroke-linecap="round"/>
            <path d="${pathD}" fill="none" stroke="#f3d79a" stroke-width="26" stroke-linecap="round"/>
            <path d="${pathD}" fill="none" stroke="#fff6df" stroke-width="8" stroke-linecap="round" stroke-dasharray="2 24"/>
          </svg>
          <div class="ls-decor-layer">${buildDecor(pos, colW)}</div>
          ${buildNodes(pos, colW)}
        </div>
      </div>
      <div class="ls-header">
        <button class="btn btn-blue btn-round" id="lsBack">${icon('back', { size: 26 })}</button>
        <div class="ls-title" id="lsTitle">${WORLDS.find((w) => w.id === curWorld)?.name || ''}</div>
        <div class="ls-stars">${icon('star', { size: 20 })}<b>${totalStars}</b><small>/${maxStars}</small></div>
      </div>
    `;

    scrollEl = root.querySelector('.ls-scroll');
    const sky = root.querySelector('.ls-sky');
    const titleEl = root.querySelector('#lsTitle');

    root.querySelector('#lsBack').addEventListener('click', () => { Sound.button(); controller.gotoMenu(); });
    root.querySelectorAll('.trail-node').forEach((n) => n.addEventListener('click', () => {
      const id = Number(n.dataset.level);
      Sound.ensure();
      if (!controller.isWorldUnlocked(getWorldId(id)) || !controller.isUnlocked(id)) {
        Sound.invalid();
        n.animate([{ transform: 'translate(-50%,-50%) rotate(0)' }, { transform: 'translate(-52%,-50%) rotate(-5deg)' }, { transform: 'translate(-48%,-50%) rotate(5deg)' }, { transform: 'translate(-50%,-50%) rotate(0)' }], { duration: 260 });
        return;
      }
      Sound.button(); controller.gotoLevel(id);
    }));

    // parallax sky + live world title on scroll
    let ticking = false;
    onScroll = () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => {
        const st = scrollEl.scrollTop;
        sky.style.transform = `translateY(${st * 0.12}px)`;
        // which world is near the viewport centre?
        const centreY = st + scrollEl.clientHeight / 2;
        const nearest = pos.reduce((a, p) => Math.abs(p.y - centreY) < Math.abs(a.y - centreY) ? p : a, pos[0]);
        const wname = WORLDS.find((w) => w.id === getWorldId(nearest.lv.id))?.name || '';
        if (titleEl.textContent !== wname) titleEl.textContent = wname;
        ticking = false;
      });
    };
    scrollEl.addEventListener('scroll', onScroll, { passive: true });

    // initial scroll → current level (or preserved)
    const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;
    let target;
    if (preserveFrac != null) target = preserveFrac * maxScroll;
    else {
      const cur = pos.find((p) => p.lv.id === controller.currentLevelId()) || pos[0];
      target = cur.y - scrollEl.clientHeight * 0.58;
    }
    scrollEl.scrollTop = Math.max(0, Math.min(maxScroll, target));
    onScroll();
  }

  /* ---- resize ---- */
  let rt = null;
  function onResize() {
    clearTimeout(rt);
    rt = setTimeout(() => {
      const frac = scrollEl ? scrollEl.scrollTop / Math.max(1, scrollEl.scrollHeight - scrollEl.clientHeight) : 0;
      render(frac);
    }, 160);
  }
  window.addEventListener('resize', onResize);

  render();

  return () => {
    clearTimeout(rt);
    if (scrollEl && onScroll) scrollEl.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
  };
}
