import { LEVELS, WORLDS, levelsInWorld } from '../../data/levels.js';
import { FROGS } from '../../data/frogs.js';
import { frogSVG } from '../characters/FrogArt.js';
import { Sound } from '../../game/effects/Sound.js';

const WORLD_H_PC = 920;

export function mountLevelSelect(stage, controller) {
  const el = document.createElement('div');
  el.className = 'screen map-screen';
  stage.appendChild(el);
  let activeWorldId = 1;

  /* ---------- helpers ---------- */
  function worldSelectorHTML() {
    const cur = WORLDS.find((w) => w.id === activeWorldId) || WORLDS[0];
    return `
      <button class="btn btn-blue btn-round" id="backBtn">←</button>
      <div class="world-selector" id="worldSelector">
        <button class="world-selector-trigger" id="worldTrigger">
          <span id="worldName">${cur.name}</span>
          <span class="arrow">▼</span>
        </button>
        <div class="world-selector-dropdown" id="worldDropdown">
          ${WORLDS.map((w) => {
            const unlocked = controller.isWorldUnlocked(w.id);
            return `<button class="ws-option${w.id === activeWorldId ? ' active' : ''}${unlocked ? '' : ' locked'}" data-world="${w.id}" ${unlocked ? '' : 'disabled'}>
              <span class="ws-icon">${!unlocked ? '🔒' : w.id === activeWorldId ? '🏝️' : '🗺️'}</span>
              <span>${w.name}</span>
              <span class="ws-info">${unlocked ? `Lv ${w.startId}–${w.startId + w.count - 1}` : `Need ${w.unlockLevels} levels`}</span>
            </button>`;
          }).join('')}
        </div>
      </div>
      <div class="hud-pill" style="flex:0 0 auto;padding:6px 16px;">
        <div class="hud-value" style="font-size:20px;">⭐ ${controller.totalStars()}<span style="font-size:14px;color:var(--c-cocoa-soft);">/${LEVELS.length * 3}</span></div>
      </div>`;
  }

  /* ---------- build map ---------- */
  function buildMap() {
    const world = WORLDS.find((w) => w.id === activeWorldId) || WORLDS[0];
    const lvls = levelsInWorld(world.id);
    const n = lvls.length;
    const worldH = WORLD_H_PC + (n - 20) * 14;
    const padTop = worldH * 0.20;
    const spacing = n > 1 ? (worldH - padTop - worldH * 0.10) / (n - 1) : 0;

    const pos = lvls.map((lv, i) => ({
      x: 215 + Math.sin(i * 0.9 + 0.6) * 145,
      y: padTop + i * spacing,
      levelId: lv.id,
    }));

    const worldUnlocked = controller.isWorldUnlocked(world.id);
    const pathD = pos.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : smoothSeg(pos[i - 1], p))).join(' ');

    const frogSpots = [];
    let lastFrog = null;
    lvls.forEach((lv, i) => {
      if (lv.frog !== lastFrog) {
        lastFrog = lv.frog;
        const side = (i % 2 === 0) ? -1 : 1;
        frogSpots.push({ frog: lv.frog, x: pos[i].x + side * 155, y: pos[i].y - 20 });
      }
    });

    const currentId = controller.currentLevelId();

    // Build level nodes HTML
    const nodesHTML = lvls.map((lv, i) => {
      const unlocked = worldUnlocked && controller.isUnlocked(lv.id);
      const stars = controller.starsFor(lv.id);
      const cls = !unlocked ? 'locked' : lv.id === currentId ? 'current' : '';
      return `<button class="level-node ${cls}" data-level="${lv.id}"
        style="left:${pos[i].x - 34}px;top:${pos[i].y - 34}px;">
        ${unlocked ? lv.id : '🔒'}
        <span class="node-stars">${starStr(stars)}</span>
      </button>`;
    }).join('');

    return { world, lvls, pos, worldUnlocked, currentId, worldH, pathD, frogSpots, nodesHTML };
  }

  /* ---------- render ---------- */
  function render() {
    // Remove old content
    const oldScroll = el.querySelector('.map-scroll');
    if (oldScroll) oldScroll.remove();

    const data = buildMap();

    const scroll = document.createElement('div');
    scroll.className = 'map-scroll';
    scroll.innerHTML = `
      <div class="map-world" style="height:${data.worldH}px;position:relative;">
        <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,0.12) 0%,rgba(255,255,255,0) 40%,rgba(0,60,90,0.1) 100%);"></div>
        <div style="position:absolute;left:-30%;right:-30%;top:80px;bottom:-40px;border-radius:45% 45% 0 0;
             background:linear-gradient(180deg,#8fdd6d 0%,#5cc35a 30%,#eed58f 78%,#f7e0a5 100%);box-shadow:inset 0 14px 0 rgba(255,255,255,0.25);"></div>
        <div style="position:absolute;left:-30%;right:-30%;bottom:-40px;height:60px;border-radius:50% 50% 0 0;background:linear-gradient(180deg,#f7e0a5,#f0c878);"></div>
        <div style="position:absolute;left:25%;right:25%;top:60px;height:110px;border-radius:50%;background:radial-gradient(ellipse at center,#ffffff 0%,rgba(255,255,255,0) 70%);"></div>
        <div class="cloud" style="top:30px;animation-duration:38s;animation-delay:-9s;"></div>
        <div class="cloud" style="top:${data.worldH * 0.12}px;transform:scale(0.6);animation-duration:48s;animation-delay:-25s;opacity:0.6;"></div>
        <div class="cloud" style="top:${data.worldH * 0.25}px;transform:scale(0.8);animation-duration:42s;animation-delay:-18s;opacity:0.65;"></div>
        <div class="cloud" style="top:${data.worldH * 0.40}px;transform:scale(0.65);animation-duration:50s;animation-delay:-8s;opacity:0.55;"></div>
        <div class="cloud" style="top:${data.worldH * 0.55}px;transform:scale(0.85);animation-duration:44s;animation-delay:-30s;opacity:0.6;"></div>
        <svg width="430" height="${data.worldH}" style="position:absolute;inset:0;pointer-events:none;" viewBox="0 0 430 ${data.worldH}">
          <path d="${data.pathD}" fill="none" stroke="rgba(120,80,30,0.25)" stroke-width="26" stroke-linecap="round"/>
          <path d="${data.pathD}" fill="none" stroke="#fdf3d7" stroke-width="14" stroke-linecap="round" stroke-dasharray="2 24" stroke-dashoffset="6"/>
        </svg>
        ${data.nodesHTML}
        ${data.frogSpots.map((s) =>
          `<div class="map-frog floaty" style="left:${s.x - 38}px;top:${s.y - 60}px;width:76px;animation-delay:${(s.y % 7) * -0.4}s;" title="${FROGS[s.frog].name}">
            ${frogSVG(s.frog, { width: 76 })}
            <div style="text-align:center;font-family:var(--font-display);font-size:13px;color:#fff;text-shadow:0 2px 3px rgba(0,60,40,0.6);margin-top:-6px;">${FROGS[s.frog].name}</div>
          </div>`
        ).join('')}
        ${data.worldUnlocked ? '' : `
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;z-index:10;pointer-events:none;">
            <div style="font-family:var(--font-display);font-size:36px;color:#fff;text-shadow:0 4px 0 rgba(0,0,0,0.4);">🔒</div>
            <div style="font-family:var(--font-display);font-size:22px;color:#fff;text-shadow:0 3px 0 rgba(0,0,0,0.4);margin-top:10px;">Complete ${data.world.unlockLevels} levels to unlock!</div>
          </div>`}
      </div>`;
    el.appendChild(scroll);

    // Scroll to first unplayed level
    const firstNew = data.lvls.find((lv) => data.worldUnlocked && controller.isUnlocked(lv.id) && controller.starsFor(lv.id) === 0);
    const target = firstNew || data.lvls[data.lvls.length - 1];
    const tp = data.pos.find((p) => p.levelId === target.id);
    if (tp) {
      requestAnimationFrame(() => {
        scroll.scrollTop = Math.max(0, tp.y - el.clientHeight * 0.28);
      });
    }

    // Level node clicks
    scroll.querySelectorAll('.level-node').forEach((node) => {
      node.addEventListener('click', () => {
        const id = Number(node.dataset.level);
        Sound.ensure();
        if (!data.worldUnlocked || !controller.isUnlocked(id)) {
          Sound.invalid();
          node.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: 240 });
          return;
        }
        Sound.button();
        controller.gotoLevel(id);
      });
    });
  }

  /* ---------- header (always rebuilt when world changes) ---------- */
  let headerEl = null;

  function buildHeader() {
    if (headerEl) headerEl.remove();
    headerEl = document.createElement('div');
    headerEl.className = 'world-header';
    headerEl.style.cssText = 'position:absolute;top:14px;left:14px;right:14px;display:flex;justify-content:space-between;align-items:center;z-index:20;';
    headerEl.innerHTML = worldSelectorHTML();
    el.appendChild(headerEl);

    // Back button
    headerEl.querySelector('#backBtn').addEventListener('click', () => { Sound.button(); controller.gotoMenu(); });

    // World trigger
    const trigger = headerEl.querySelector('#worldTrigger');
    const dropdown = headerEl.querySelector('#worldDropdown');

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      Sound.button();
      const open = dropdown.classList.contains('open');
      dropdown.classList.toggle('open');
      trigger.classList.toggle('open');
    });

    // Dropdown options
    dropdown.querySelectorAll('.ws-option:not(.locked)').forEach((opt) => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const w = Number(opt.dataset.world);
        if (w === activeWorldId) { closeDropdown(); return; }
        activeWorldId = w;
        Sound.button();
        closeDropdown();
        fullRender();
      });
    });

    function closeDropdown() {
      dropdown.classList.remove('open');
      trigger.classList.remove('open');
    }

    // Close dropdown on outside click (bubble phase, not capture)
    const outsideHandler = (e) => {
      if (!dropdown.contains(e.target) && !trigger.contains(e.target)) {
        closeDropdown();
        document.removeEventListener('click', outsideHandler);
      }
    };
    // Only add when dropdown opens, remove on close
    const origToggle = trigger.click; // not used, we patch via observer

    // Simpler: just listen on document always
    document.addEventListener('click', (e) => {
      if (dropdown.classList.contains('open') && !dropdown.contains(e.target) && !trigger.contains(e.target)) {
        closeDropdown();
      }
    });
  }

  function fullRender() {
    render();
    buildHeader();
  }

  fullRender();
}

function starStr(n) {
  return '★★★'.slice(0, 3).split('').map((s, i) =>
    `<span style="color:${i < n ? '#ffd44d' : 'rgba(30,50,40,0.35)'}">★</span>`).join('');
}

function smoothSeg(a, b) {
  return `C ${(a.x + b.x) / 2} ${a.y}, ${(a.x + b.x) / 2} ${b.y}, ${b.x} ${b.y}`;
}
