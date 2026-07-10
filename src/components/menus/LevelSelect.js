// Level select: a scrollable island map with a winding path,
// level nodes (locked / done / current) and frog guides camped
// beside the levels they host.

import { LEVELS } from '../../data/levels.js';
import { FROGS } from '../../data/frogs.js';
import { frogSVG } from '../characters/FrogArt.js';
import { Sound } from '../../game/effects/Sound.js';

const WORLD_H = 1850; // Increased height for 30 levels

export function mountLevelSelect(stage, controller) {
  const el = document.createElement('div');
  el.className = 'screen map-screen';

  // node positions: winding path from beach (bottom) to peak (top)
  const pos = LEVELS.map((_, i) => ({
    x: 215 + Math.sin(i * 0.9 + 0.6) * 145,
    y: WORLD_H - 130 - i * 62, // Slightly tighter spacing for 30 levels
  }));

  const pathD = pos.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : smoothSeg(pos[i - 1], p))).join(' ');

  // which frog guides which stretch of the map
  const frogSpots = [];
  let lastFrog = null;
  LEVELS.forEach((lv, i) => {
    if (lv.frog !== lastFrog) {
      lastFrog = lv.frog;
      const p = pos[i];
      // Position frog on alternating sides
      const side = (i % 2 === 0) ? -1 : 1;
      frogSpots.push({ 
        frog: lv.frog, 
        x: p.x + (side * 155), 
        y: p.y - 20 
      });
    }
  });

  const currentId = controller.currentLevelId();

  el.innerHTML = `
    <div class="map-scroll">
      <div class="map-world" style="height:${WORLD_H}px;position:relative;">
        <!-- island body -->
        <div style="position:absolute;left:-30%;right:-30%;top:80px;bottom:-40px;border-radius:45% 45% 0 0;
             background:linear-gradient(180deg,#8fdd6d 0%, #5cc35a 30%, #eed58f 78%, #f7e0a5 100%);
             box-shadow:inset 0 14px 0 rgba(255,255,255,0.25);"></div>
        <!-- summit snow -->
        <div style="position:absolute;left:25%;right:25%;top:60px;height:110px;border-radius:50%;
             background:radial-gradient(ellipse at center,#ffffff 0%,rgba(255,255,255,0) 70%);"></div>
        <div class="cloud" style="top:30px;animation-duration:38s;animation-delay:-9s;"></div>
        <div class="cloud" style="top:280px;transform:scale(0.75);animation-duration:52s;animation-delay:-30s;opacity:0.8;"></div>
        <div class="cloud" style="top:650px;transform:scale(0.9);animation-duration:44s;animation-delay:-18s;opacity:0.7;"></div>
        <div class="cloud" style="top:1050px;transform:scale(0.7);animation-duration:50s;animation-delay:-5s;opacity:0.6;"></div>
        <div class="cloud" style="top:1400px;transform:scale(0.85);animation-duration:40s;animation-delay:-25s;opacity:0.7;"></div>

        <svg width="430" height="${WORLD_H}" style="position:absolute;inset:0;pointer-events:none;" viewBox="0 0 430 ${WORLD_H}">
          <path d="${pathD}" fill="none" stroke="rgba(120,80,30,0.25)" stroke-width="26" stroke-linecap="round"/>
          <path d="${pathD}" fill="none" stroke="#fdf3d7" stroke-width="14" stroke-linecap="round" stroke-dasharray="2 24" stroke-dashoffset="6"/>
          ${decorPines(pos)}
        </svg>

        ${LEVELS.map((lv, i) => {
          const unlocked = controller.isUnlocked(lv.id);
          const stars = controller.starsFor(lv.id);
          const cls = !unlocked ? 'locked' : lv.id === currentId ? 'current' : '';
          return `
            <button class="level-node ${cls}" data-level="${lv.id}"
              style="left:${pos[i].x - 34}px;top:${pos[i].y - 34}px;">
              ${unlocked ? lv.id : '🔒'}
              <span class="node-stars">${starStr(stars)}</span>
            </button>`;
        }).join('')}

        ${frogSpots.map((s) => `
          <div class="map-frog floaty" style="left:${s.x - 38}px;top:${s.y - 60}px;width:76px;animation-delay:${(s.y % 7) * -0.4}s;" title="${FROGS[s.frog].name} the ${FROGS[s.frog].species}">
            ${frogSVG(s.frog, { width: 76 })}
            <div style="text-align:center;font-family:var(--font-display);font-size:13px;color:#fff;text-shadow:0 2px 3px rgba(0,60,40,0.6);margin-top:-6px;">${FROGS[s.frog].name}</div>
          </div>`).join('')}

        <div style="position:absolute;top:20px;left:50%;transform:translateX(-50%);font-family:var(--font-display);font-size:22px;color:#fff;text-shadow:0 2px 0 rgba(0,80,60,0.4);white-space:nowrap;">🏝️ Paradise Peak awaits!</div>
        
        <div style="position:absolute;bottom:20px;left:50%;transform:translateX(-50%);font-family:var(--font-body);font-size:14px;color:rgba(255,255,255,0.8);text-shadow:0 2px 0 rgba(0,80,60,0.4);">
          ${LEVELS.length} levels · ${Object.keys(FROGS).length} frogs
        </div>
      </div>
    </div>

    <div style="position:absolute;top:14px;left:14px;right:14px;display:flex;justify-content:space-between;align-items:center;z-index:20;pointer-events:none;">
      <button class="btn btn-blue btn-round" id="backBtn" style="width:52px;height:52px;font-size:22px;pointer-events:auto;">←</button>
      <div class="banner" style="font-size:20px;padding:8px 24px;">Frogapop Island</div>
      <div class="hud-pill" style="flex:0 0 auto;padding:6px 16px;pointer-events:auto;">
        <div class="hud-value" style="font-size:20px;">⭐ ${controller.totalStars()}<span style="font-size:14px;color:var(--c-cocoa-soft);">/${LEVELS.length * 3}</span></div>
      </div>
    </div>
  `;
  stage.appendChild(el);

  // scroll so the current level is visible
  const scroll = el.querySelector('.map-scroll');
  const curPos = pos[LEVELS.findIndex((l) => l.id === currentId)];
  scroll.scrollTop = Math.max(0, curPos.y - 480);

  el.querySelectorAll('.level-node').forEach((node) => {
    node.addEventListener('click', () => {
      const id = Number(node.dataset.level);
      Sound.ensure();
      if (!controller.isUnlocked(id)) {
        Sound.invalid();
        node.animate(
          [{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }],
          { duration: 240 }
        );
        return;
      }
      Sound.button();
      controller.gotoLevel(id);
    });
  });

  el.querySelector('#backBtn').addEventListener('click', () => {
    Sound.button();
    controller.gotoMenu();
  });
}

function starStr(n) {
  return '★★★'.slice(0, 3).split('').map((s, i) =>
    `<span style="color:${i < n ? '#ffd44d' : 'rgba(30,50,40,0.35)'}">★</span>`).join('');
}

function smoothSeg(a, b) {
  const mx = (a.x + b.x) / 2;
  return `C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
}

// little decorative pineapple bushes + flowers along the path
function decorPines(pos) {
  let out = '';
  pos.forEach((p, i) => {
    if (i % 2 === 0) {
      const dx = p.x > 215 ? 130 : -130;
      out += `<g transform="translate(${p.x + dx} ${p.y + 30})">
        <circle r="14" fill="#4cbf5b"/><circle cx="-11" cy="6" r="10" fill="#3fae4c"/><circle cx="11" cy="6" r="10" fill="#5cc95e"/>
        <circle cx="-4" cy="-6" r="3" fill="#ff8fc8"/><circle cx="7" cy="2" r="3" fill="#ffe14d"/>
      </g>`;
    }
  });
  return out;
}