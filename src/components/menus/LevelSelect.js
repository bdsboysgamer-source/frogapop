// ============================================================
// LevelSelect.js — the world map.
//
// One continuous, parallax-scrolling surface holds every world.
// Desktop / landscape  → worlds run left→right, camera scrolls
//                        horizontally through distinct biomes.
// Mobile / portrait    → worlds stack top→bottom, camera scrolls
//                        vertically, laid out for a thumb reach.
//
// Layout is orientation-aware (not a scaled copy): the same biome
// data from mapBiomes.js is projected onto whichever axis scrolls.
// ============================================================

import { LEVELS, WORLDS, levelsInWorld } from '../../data/levels.js';
import { FROGS } from '../../data/frogs.js';
import { frogSVG } from '../characters/FrogArt.js';
import { Sound } from '../../game/effects/Sound.js';
import { THEMES, ParticleField, splitmix, blendHex } from './mapBiomes.js';

const PARALLAX = { far: 0.42, mid: 0.7 }; // visual speed multipliers vs. content

export function mountLevelSelect(stage, controller) {
  const root = document.createElement('div');
  root.className = 'screen map-screen';
  stage.appendChild(root);

  let horiz = isLandscape();
  let raf = null, particleRaf = null, lastTs = 0;
  let field = null;
  let layout = null;
  let scrollEl = null;
  let onScrollHandler = null;
  let docClick = null;

  /* ---------- orientation ---------- */
  function isLandscape() {
    return window.innerWidth >= 820 && window.innerWidth > window.innerHeight;
  }

  /* ---------- layout engine ---------- */
  function computeLayout() {
    horiz = isLandscape();
    const vw = root.clientWidth || window.innerWidth;
    const vh = root.clientHeight || window.innerHeight;

    // axis = scroll direction length per world; cross = perpendicular extent
    const worldSpan = horiz
      ? Math.max(1180, vw * 0.92)
      : Math.max(1120, vh * 1.05);
    const cross = horiz ? vh : vw;
    const contentLen = worldSpan * WORLDS.length;

    const nodes = [];
    const worldMeta = [];
    const pad = worldSpan * 0.12;
    const amp = horiz ? Math.min(cross * 0.24, 200) : Math.min(cross * 0.30, 150);
    const center = horiz ? cross * 0.54 : cross * 0.5;

    WORLDS.forEach((world, wi) => {
      const lvls = levelsInWorld(world.id);
      const wStart = wi * worldSpan;
      worldMeta.push({ world, wStart, span: worldSpan, center: wStart + worldSpan / 2 });
      const n = lvls.length;
      const rng = splitmix(world.id * 7919 + 13);
      lvls.forEach((lv, i) => {
        const t = n > 1 ? i / (n - 1) : 0.5;
        const ax = wStart + pad + t * (worldSpan - pad * 2);
        // continuous winding road: 1.5 sine waves per world + gentle jitter
        const phase = (wi * 1.5 + t * 1.5) * Math.PI * 2;
        const jitter = (rng() - 0.5) * amp * 0.25;
        const cx = center + Math.sin(phase) * amp + jitter;
        nodes.push({
          lv, world,
          axis: ax,
          cross: Math.max(46, Math.min(cross - 46, cx)),
        });
      });
    });

    return { vw, vh, worldSpan, cross, contentLen, nodes, worldMeta, center, amp };
  }

  /* project (axis, cross) to CSS left/top for the current orientation */
  function pos(axis, cross) {
    return horiz ? { left: axis, top: cross } : { left: cross, top: axis };
  }

  /* ---------- path geometry ---------- */
  function buildPath(nodes) {
    if (nodes.length < 2) return '';
    const pts = nodes.map((n) => pos(n.axis, n.cross));
    let d = `M ${pts[0].left} ${pts[0].top}`;
    for (let i = 1; i < pts.length; i++) {
      const p0 = pts[Math.max(0, i - 2)], p1 = pts[i - 1], p2 = pts[i], p3 = pts[Math.min(pts.length - 1, i + 1)];
      const c1x = p1.left + (p2.left - p0.left) / 6, c1y = p1.top + (p2.top - p0.top) / 6;
      const c2x = p2.left - (p3.left - p1.left) / 6, c2y = p2.top - (p3.top - p1.top) / 6;
      d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.left} ${p2.top}`;
    }
    return d;
  }

  /* ---------- decoration rendering ---------- */
  function renderDecorLayer(meta, kind) {
    const { worldSpan, cross } = layout;
    const items = [];
    for (const wm of meta) {
      const theme = THEMES[wm.world.id];
      const gen = theme[kind];
      if (!gen) continue;
      const rng = splitmix(wm.world.id * 104729 + kind.length * 31);
      for (const d of gen(rng)) {
        const axis = wm.wStart + d.ax * worldSpan;
        const crossPx = d.cx * cross;
        const p = pos(axis, crossPx);
        const scale = d.s != null ? ` scale(${d.s})` : '';
        // outer = position + scale (static); inner = animation (transform/opacity only)
        // keeps the anchor/scale from fighting the keyframes and stays GPU-friendly.
        const anim = d.anim ? ` ${d.anim}` : '';
        const delay = d.delay != null ? `animation-delay:${d.delay}s;` : '';
        items.push(
          `<div class="mb-item" style="left:${p.left}px;top:${p.top}px;transform:translate(-50%,-100%)${scale};transform-origin:bottom center;">` +
          `<div class="mb-anim${anim}" style="${delay}">${d.html}</div></div>`
        );
      }
    }
    return items.join('');
  }

  /* ---------- ground / terrain bands ---------- */
  function renderGround(meta) {
    const { worldSpan, cross, contentLen } = layout;
    const out = [];
    for (const wm of meta) {
      const g = THEMES[wm.world.id].ground;
      const start = wm.wStart;
      if (horiz) {
        // ground hugs the bottom edge; soft blend into neighbour handled by overlap
        out.push(`<div class="mb-ground" style="left:${start - 2}px;top:${cross * 0.72}px;width:${worldSpan + 4}px;height:${cross * 0.3}px;background:linear-gradient(180deg,${g[0]},${g[1]} 55%,${g[2]});"></div>`);
      } else {
        // terrain flanks both sides of the descending path
        out.push(`<div class="mb-ground" style="left:${-2}px;top:${start - 2}px;width:${cross * 0.2}px;height:${worldSpan + 4}px;background:linear-gradient(90deg,${g[2]},${g[1]} 60%,transparent);"></div>`);
        out.push(`<div class="mb-ground" style="left:${cross * 0.8}px;top:${start - 2}px;width:${cross * 0.2}px;height:${worldSpan + 4}px;background:linear-gradient(270deg,${g[2]},${g[1]} 60%,transparent);"></div>`);
      }
    }
    void contentLen;
    return out.join('');
  }

  /* ---------- node markup ---------- */
  function renderNodes(nodes) {
    const currentId = controller.currentLevelId();
    return nodes.map((nd) => {
      const { lv, world } = nd;
      const unlocked = controller.isWorldUnlocked(world.id) && controller.isUnlocked(lv.id);
      const stars = controller.starsFor(lv.id);
      const p = pos(nd.axis, nd.cross);
      const theme = THEMES[world.id];
      const state = !unlocked ? 'locked' : lv.id === currentId ? 'current' : stars > 0 ? 'done' : 'open';
      const style = `left:${p.left}px;top:${p.top}px;` +
        `--nc1:${theme.node.c1};--nc2:${theme.node.c2};--nc3:${theme.node.c3};--nring:${theme.node.ring};`;
      return `<button class="map-node ${state}" data-level="${lv.id}" data-world="${world.id}" style="${style}" aria-label="Level ${lv.id}${unlocked ? '' : ' locked'}">
          <span class="mn-face">${unlocked ? lv.id : '🔒'}</span>
          <span class="mn-stars">${starRow(stars, unlocked)}</span>
        </button>`;
    }).join('');
  }

  /* ---------- frog hosts (one per world, at its centre) ---------- */
  function renderFrogs(meta) {
    const { worldSpan, cross } = layout;
    return meta.map((wm) => {
      const theme = THEMES[wm.world.id];
      const axis = wm.wStart + worldSpan * 0.5;
      const crossPx = horiz ? cross * 0.5 : cross * 0.78;
      const p = pos(axis, crossPx);
      const frogId = wm.world.frog;
      const name = FROGS[frogId]?.name || '';
      const locked = !controller.isWorldUnlocked(wm.world.id);
      return `<div class="map-frog mb-bob" style="left:${p.left}px;top:${p.top}px;${locked ? 'filter:grayscale(0.85) brightness(0.8);' : ''}">
          <div class="map-frog-sign" style="--sign:${theme.node.c2};">${theme.icon} ${wm.world.name}</div>
          ${frogSVG(frogId, { width: 92 })}
          <div class="map-frog-name">${name}${locked ? ` · ${wm.world.unlockLevels}★ to unlock` : ''}</div>
        </div>`;
    }).join('');
  }

  /* ============================================================
     full render
     ============================================================ */
  function render(preserveScrollFrac = null) {
    stopLoops();
    root.innerHTML = '';
    layout = computeLayout();
    const { contentLen, cross, worldMeta, nodes } = layout;

    const axisPx = (n) => `${n}px`;
    const crossFull = horiz ? '100%' : `${cross}px`;
    const contentW = horiz ? axisPx(contentLen) : crossFull;
    const contentH = horiz ? crossFull : axisPx(contentLen);
    const svgW = horiz ? contentLen : cross;
    const svgH = horiz ? cross : contentLen;

    root.innerHTML = `
      <div class="map-sky"></div>
      <div class="map-light"></div>
      <div class="map-bg">
        <div class="map-layer far" data-speed="${PARALLAX.far}">${renderDecorLayer(worldMeta, 'far')}</div>
        <div class="map-layer mid" data-speed="${PARALLAX.mid}">${renderDecorLayer(worldMeta, 'mid')}</div>
      </div>
      <div class="map-scroll ${horiz ? 'h' : 'v'}">
        <div class="map-content" style="width:${contentW};height:${contentH};">
          ${renderGround(worldMeta)}
          <svg class="map-path" width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}" preserveAspectRatio="none">
            <path d="${buildPath(nodes)}" fill="none" stroke="rgba(0,0,0,0.18)" stroke-width="30" stroke-linecap="round"/>
            <path class="mp-fill" d="${buildPath(nodes)}" fill="none" stroke-width="22" stroke-linecap="round"/>
            <path class="mp-dash" d="${buildPath(nodes)}" fill="none" stroke-width="6" stroke-linecap="round" stroke-dasharray="1 26"/>
          </svg>
          <div class="map-decor near">${renderDecorLayer(worldMeta, 'near')}</div>
          ${renderFrogs(worldMeta)}
          ${renderNodes(nodes)}
          ${renderFog(worldMeta)}
        </div>
      </div>
      <canvas class="map-particles"></canvas>
      <div class="world-banner" id="worldBanner"><span class="wb-icon"></span><span class="wb-name"></span><small class="wb-tag">now entering</small></div>
      ${headerHTML()}`;

    scrollEl = root.querySelector('.map-scroll');
    const contentEl = root.querySelector('.map-content');
    const farEl = root.querySelector('.map-layer.far');
    const midEl = root.querySelector('.map-layer.mid');
    const skyEl = root.querySelector('.map-sky');
    void contentEl;

    // colour the path per centred world (done in updateScene)
    field = new ParticleField(root.querySelector('.map-particles'));

    wireHeader();
    wireNodes();

    // parallax + scene update — applyScroll() is synchronous so the first
    // paint is correct; the scroll listener throttles it through rAF.
    const applyScroll = () => {
      const s = horiz ? scrollEl.scrollLeft : scrollEl.scrollTop;
      farEl.style.transform = horiz ? `translate3d(${-s * PARALLAX.far}px,0,0)` : `translate3d(0,${-s * PARALLAX.far}px,0)`;
      midEl.style.transform = horiz ? `translate3d(${-s * PARALLAX.mid}px,0,0)` : `translate3d(0,${-s * PARALLAX.mid}px,0)`;
      updateScene(s, skyEl);
    };
    let scrollTicking = false;
    onScrollHandler = () => {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(() => { applyScroll(); scrollTicking = false; });
    };
    scrollEl.addEventListener('scroll', onScrollHandler, { passive: true });

    // initial scroll to current level (or preserved fraction on resize)
    const initFrac = preserveScrollFrac != null
      ? preserveScrollFrac
      : scrollFracForCurrent();
    const maxScroll = horiz
      ? scrollEl.scrollWidth - scrollEl.clientWidth
      : scrollEl.scrollHeight - scrollEl.clientHeight;
    const target = Math.max(0, Math.min(maxScroll, initFrac * maxScroll));
    if (horiz) scrollEl.scrollLeft = target; else scrollEl.scrollTop = target;
    applyScroll(); // paint correct parallax + biome immediately

    startLoops();
  }

  function scrollFracForCurrent() {
    const id = controller.currentLevelId();
    const nd = layout.nodes.find((n) => n.lv.id === id) || layout.nodes[0];
    const maxAxis = layout.contentLen;
    // centre the current node in the viewport
    const viewport = horiz ? layout.vw : layout.vh;
    const s = nd.axis - viewport / 2;
    return maxAxis > viewport ? s / (maxAxis - viewport) : 0;
  }

  /* ---------- fog wisps ---------- */
  function renderFog(meta) {
    const { worldSpan, cross } = layout;
    const out = [];
    for (const wm of meta) {
      const theme = THEMES[wm.world.id];
      if (!theme.fog) continue;
      const rng = splitmix(wm.world.id * 60013 + 7);
      for (let i = 0; i < 3; i++) {
        const axis = wm.wStart + (0.15 + rng() * 0.7) * worldSpan;
        const crossPx = (0.4 + rng() * 0.5) * cross;
        const p = pos(axis, crossPx);
        out.push(`<div class="mb-fog" style="left:${p.left}px;top:${p.top}px;--fog:${theme.fog};transform:scale(${1.2 + rng()});"><div class="mb-fogdrift" style="animation-delay:${-i * 9}s;"></div></div>`);
      }
    }
    return out.join('');
  }

  /* ---------- scene: sky blend, path colour, particle theme ---------- */
  let curWorldId = null;
  function updateScene(scroll, skyEl) {
    const { worldSpan, vw, vh } = layout;
    const viewport = horiz ? vw : vh;
    const centreAxis = scroll + viewport / 2;
    let idx = Math.floor(centreAxis / worldSpan);
    idx = Math.max(0, Math.min(WORLDS.length - 1, idx));
    const frac = Math.max(0, Math.min(1, (centreAxis - idx * worldSpan) / worldSpan));
    const a = THEMES[WORLDS[idx].id];
    const b = THEMES[WORLDS[Math.min(WORLDS.length - 1, idx + 1)].id];
    // blend most of the way through so transitions feel seamless
    const t = frac < 0.72 ? 0 : (frac - 0.72) / 0.28;
    const c0 = blendHex(a.sky[0], b.sky[0], t);
    const c1 = blendHex(a.sky[1], b.sky[1], t);
    const c2 = blendHex(a.sky[2], b.sky[2], t);
    skyEl.style.background = `linear-gradient(${horiz ? '180deg' : '160deg'}, ${c0}, ${c1} 52%, ${c2})`;

    const near = t < 0.5 ? a : b;
    if (near.id !== curWorldId) {
      const firstScene = curWorldId === null;
      curWorldId = near.id;
      // path colours: body + dotted centre line
      const fill = root.querySelector('.mp-fill');
      const dash = root.querySelector('.mp-dash');
      if (fill) fill.setAttribute('stroke', near.path.fill);
      if (dash) dash.setAttribute('stroke', near.path.dash);
      root.querySelector('.map-light').style.background = near.light || 'none';
      field?.setTheme(near.particles);
      // header world label
      const wl = root.querySelector('#mapWorldName');
      if (wl) wl.textContent = `${near.icon} ${near.name}`;
      syncSelectorActive(near.id);
      if (!firstScene) showWorldBanner(near); // biome-entry flourish
    }
  }

  /* a brief "now entering <biome>" banner when crossing worlds */
  let bannerTimer = null;
  function showWorldBanner(theme) {
    const b = root.querySelector('#worldBanner');
    if (!b) return;
    b.querySelector('.wb-icon').textContent = theme.icon;
    b.querySelector('.wb-name').textContent = theme.name;
    b.style.setProperty('--wbtint', theme.node.c2);
    b.classList.remove('show'); void b.offsetWidth; b.classList.add('show');
    clearTimeout(bannerTimer);
    bannerTimer = setTimeout(() => b.classList.remove('show'), 2000);
  }

  /* ============================================================
     header (back · world jump · stars)
     ============================================================ */
  function headerHTML() {
    const totalStars = controller.totalStars();
    const maxStars = LEVELS.length * 3;
    return `
      <div class="map-header">
        <button class="btn btn-blue btn-round" id="mapBack">←</button>
        <div class="map-worldbar">
          <button class="map-worldpick" id="mapWorldPick">
            <span id="mapWorldName">🏝️ Sunny Shores</span>
            <span class="wp-caret">▾</span>
          </button>
          <div class="map-worldmenu" id="mapWorldMenu">
            ${WORLDS.map((w) => {
              const unlocked = controller.isWorldUnlocked(w.id);
              const th = THEMES[w.id];
              return `<button class="wm-opt${unlocked ? '' : ' locked'}" data-world="${w.id}" ${unlocked ? '' : 'disabled'}>
                <span class="wm-icon">${unlocked ? th.icon : '🔒'}</span>
                <span class="wm-txt">${w.name}<small>${unlocked ? `Lv ${w.startId}–${w.startId + w.count - 1}` : `${w.unlockLevels} ★ to unlock`}</small></span>
              </button>`;
            }).join('')}
          </div>
        </div>
        <div class="map-stars"><span class="ms-star">⭐</span>${totalStars}<small>/${maxStars}</small></div>
      </div>`;
  }

  function wireHeader() {
    root.querySelector('#mapBack').addEventListener('click', () => { Sound.button(); controller.gotoMenu(); });
    const pick = root.querySelector('#mapWorldPick');
    const menu = root.querySelector('#mapWorldMenu');
    const close = () => { menu.classList.remove('open'); pick.classList.remove('open'); };
    pick.addEventListener('click', (e) => { e.stopPropagation(); Sound.button(); menu.classList.toggle('open'); pick.classList.toggle('open'); });
    menu.querySelectorAll('.wm-opt:not(.locked)').forEach((opt) => {
      opt.addEventListener('click', (e) => { e.stopPropagation(); Sound.button(); close(); scrollToWorld(Number(opt.dataset.world)); });
    });
    // one outside-click handler at a time (re-renders on resize would stack)
    if (docClick) document.removeEventListener('click', docClick);
    docClick = close;
    document.addEventListener('click', docClick);
  }

  function syncSelectorActive(worldId) {
    root.querySelectorAll('.wm-opt').forEach((o) =>
      o.classList.toggle('active', Number(o.dataset.world) === worldId));
  }

  function scrollToWorld(worldId) {
    const wm = layout.worldMeta.find((m) => m.world.id === worldId);
    if (!wm) return;
    const viewport = horiz ? layout.vw : layout.vh;
    const maxScroll = horiz ? scrollEl.scrollWidth - scrollEl.clientWidth : scrollEl.scrollHeight - scrollEl.clientHeight;
    const target = Math.max(0, Math.min(maxScroll, wm.center - viewport / 2));
    scrollEl.scrollTo(horiz ? { left: target, behavior: 'smooth' } : { top: target, behavior: 'smooth' });
  }

  /* ---------- node interaction ---------- */
  function wireNodes() {
    root.querySelectorAll('.map-node').forEach((node) => {
      node.addEventListener('click', () => {
        const id = Number(node.dataset.level);
        const wId = Number(node.dataset.world);
        Sound.ensure();
        if (!controller.isWorldUnlocked(wId) || !controller.isUnlocked(id)) {
          Sound.invalid();
          node.animate(
            [{ transform: 'translate(-50%,-50%) rotate(0)' }, { transform: 'translate(-52%,-50%) rotate(-4deg)' }, { transform: 'translate(-48%,-50%) rotate(4deg)' }, { transform: 'translate(-50%,-50%) rotate(0)' }],
            { duration: 260 }
          );
          return;
        }
        Sound.button();
        controller.gotoLevel(id);
      });
    });
  }

  /* ---------- animation loops ---------- */
  function startLoops() {
    lastTs = performance.now();
    const loop = (ts) => {
      const dt = Math.min(0.05, (ts - lastTs) / 1000);
      lastTs = ts;
      if (field) { field.update(dt); field.draw(); }
      particleRaf = requestAnimationFrame(loop);
    };
    particleRaf = requestAnimationFrame(loop);
  }
  function stopLoops() {
    if (raf) cancelAnimationFrame(raf), (raf = null);
    if (particleRaf) cancelAnimationFrame(particleRaf), (particleRaf = null);
    if (scrollEl && onScrollHandler) scrollEl.removeEventListener('scroll', onScrollHandler);
  }

  /* ---------- resize handling ---------- */
  let resizeTimer = null;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // preserve roughly where the player was looking
      let frac = 0;
      if (scrollEl && layout) {
        const maxScroll = horiz ? scrollEl.scrollWidth - scrollEl.clientWidth : scrollEl.scrollHeight - scrollEl.clientHeight;
        const s = horiz ? scrollEl.scrollLeft : scrollEl.scrollTop;
        frac = maxScroll > 0 ? s / maxScroll : 0;
      }
      curWorldId = null;
      render(frac);
    }, 180);
  }
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);

  render();

  /* ---------- cleanup ---------- */
  return () => {
    stopLoops();
    clearTimeout(resizeTimer);
    if (docClick) document.removeEventListener('click', docClick);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('orientationchange', onResize);
  };
}

/* ---------- helpers ---------- */
function starRow(n, unlocked) {
  if (!unlocked) return '';
  return [0, 1, 2].map((i) => `<span class="${i < n ? 'on' : ''}">★</span>`).join('');
}
