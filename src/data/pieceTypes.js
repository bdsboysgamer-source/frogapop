// Pineapple species definitions — 5 worlds × 5 themed types each (25 total).
// Adding a new pineapple = add an entry here; art, board logic,
// objectives and HUD icons all pick it up automatically.
//
// `deco` gives every species a unique accessory/emblem (drawn in
// PieceArt.js) so no two pineapples are hard to tell apart — silhouette
// and details distinguish them, not just colour.

export const PIECE_TYPES = {
  // ================================================================
  // WORLD 1 — Sunny Shores (tropical basics)
  // ================================================================
  golden: {
    id: 'golden', name: 'Golden Pineapple', deco: 'crown',
    body: '#ffc53d', bodyDark: '#e8930c', bodyLight: '#ffe9a3',
    leaf: '#58bb3d', leafDark: '#2e8b2e', cheek: '#ff9d5c', mood: 'happy',
  },
  pink: {
    id: 'pink', name: 'Pink Sugar Pineapple', deco: 'bow',
    body: '#ff8fc8', bodyDark: '#e0559d', bodyLight: '#ffd2e9',
    leaf: '#ff5e9c', leafDark: '#c93a78', cheek: '#ff5e9c', mood: 'sweet',
    glow: 'rgba(255, 150, 210, 0.55)',
  },
  ice: {
    id: 'ice', name: 'Ice Pineapple', deco: 'beanie',
    body: '#7fd4f5', bodyDark: '#2f96cf', bodyLight: '#d8f4ff',
    leaf: '#4fc3e8', leafDark: '#2380b8', cheek: '#8fc9ff', mood: 'cool',
  },
  fire: {
    id: 'fire', name: 'Fire Pineapple', deco: 'mohawk',
    body: '#ff5a34', bodyDark: '#d02c0e', bodyLight: '#ffa480', // redder orange (vs blaze's gold-orange)
    leaf: '#ff8f37', leafDark: '#d66510', cheek: '#ff4023', mood: 'fierce',
    embers: true, glow: 'rgba(255, 100, 50, 0.5)',
  },
  jungle: {
    id: 'jungle', name: 'Jungle Pineapple', deco: 'flower',
    body: '#8bd44a', bodyDark: '#4e9a1f', bodyLight: '#d2f0a8',
    leaf: '#2e8b4f', leafDark: '#1c6338', cheek: '#5cb838', mood: 'wild',
  },

  // ================================================================
  // WORLD 2 — Crystal Depths (cold / water / gem)
  // ================================================================
  crystal: {
    id: 'crystal', name: 'Crystal Pineapple', deco: 'gemspike',
    body: '#c8ecff', bodyDark: '#7fb8e0', bodyLight: '#ffffff',
    leaf: '#a8d8ea', leafDark: '#5a9ab8', cheek: '#d4e8f0', mood: 'crystalline',
    crystal: true, glow: 'rgba(160, 210, 255, 0.5)', pattern: 'diamond',
  },
  frost: {
    id: 'frost', name: 'Frost Pineapple', deco: 'earmuffs',
    body: '#a3d6f2', bodyDark: '#4a98cf', bodyLight: '#dcf3ff', // clearer icy blue
    leaf: '#7ec2e6', leafDark: '#3f86ae', cheek: '#a6d6ef', mood: 'cool',
    crystal: true, glow: 'rgba(150, 205, 255, 0.4)',
  },
  pearl: {
    id: 'pearl', name: 'Pearl Pineapple', deco: 'pearls',
    body: '#ffd7cc', bodyDark: '#e0a08e', bodyLight: '#fff0ea', // warm peach pearl
    leaf: '#f0c0b0', leafDark: '#c88a76', cheek: '#ffc2b0', mood: 'sweet',
    glow: 'rgba(255, 200, 180, 0.45)', pattern: 'shimmer',
  },
  aqua: {
    id: 'aqua', name: 'Aqua Pineapple', deco: 'bubbles',
    body: '#3fd0c8', bodyDark: '#159a9a', bodyLight: '#a6f0ea',
    leaf: '#2bbfb0', leafDark: '#127a78', cheek: '#7ce8dc', mood: 'cool',
    glow: 'rgba(60, 210, 200, 0.45)',
  },
  abyss: {
    id: 'abyss', name: 'Abyss Pineapple', deco: 'angler',
    body: '#3f4d78', bodyDark: '#232f52', bodyLight: '#7482aa',
    leaf: '#33436a', leafDark: '#18244a', cheek: '#6272a0', mood: 'mysterious',
    glow: 'rgba(70, 90, 150, 0.5)', shadow: true,
  },

  // ================================================================
  // WORLD 3 — Ember Wilds (fire / nature / spice)
  // ================================================================
  ember: {
    id: 'ember', name: 'Ember Pineapple', deco: 'smoke',
    body: '#a84420', bodyDark: '#6a2408', bodyLight: '#d07a3c', // deep rust/brown
    leaf: '#8a3a14', leafDark: '#571f06', cheek: '#c86636', mood: 'fierce',
    embers: true, glow: 'rgba(170, 70, 25, 0.5)',
  },
  wild: {
    id: 'wild', name: 'Wild Pineapple', deco: 'safari',
    body: '#cfa03a', bodyDark: '#8f6e18', bodyLight: '#ecce84',
    leaf: '#7a9a30', leafDark: '#4a6a18', cheek: '#b09050', mood: 'wild',
  },
  spice: {
    id: 'spice', name: 'Spice Pineapple', deco: 'chili',
    body: '#f5393f', bodyDark: '#c10f1f', bodyLight: '#ff7d72', // bright chilli red
    leaf: '#e03038', leafDark: '#a8121c', cheek: '#ff6a64', mood: 'fierce',
    glow: 'rgba(245, 55, 60, 0.45)',
  },
  thorn: {
    id: 'thorn', name: 'Thorn Pineapple', deco: 'thorns',
    body: '#5f8a3a', bodyDark: '#3c5e20', bodyLight: '#93bd68', // deeper green
    leaf: '#4d7a2c', leafDark: '#33581c', cheek: '#7faa50', mood: 'wild',
    pattern: 'spiky',
  },
  blaze: {
    id: 'blaze', name: 'Blaze Pineapple', deco: 'flamecrown',
    body: '#ff9f28', bodyDark: '#e06a08', bodyLight: '#ffcf80',
    leaf: '#f08020', leafDark: '#b05008', cheek: '#ffa850', mood: 'fierce',
    embers: true, glow: 'rgba(255, 150, 30, 0.6)',
  },

  // ================================================================
  // WORLD 4 — Cosmic Summit (space / stellar)
  // ================================================================
  cosmic: {
    id: 'cosmic', name: 'Cosmic Pineapple', deco: 'planet',
    body: '#7a3fd0', bodyDark: '#4a2296', bodyLight: '#bd94f5', // deep violet (vs shimmer's light magenta)
    leaf: '#7d54d8', leafDark: '#4f2f9c', cheek: '#e07eff', mood: 'stellar',
    glow: 'rgba(140, 80, 240, 0.6)', pattern: 'stars',
  },
  stellar: {
    id: 'stellar', name: 'Stellar Pineapple', deco: 'shootingstar',
    body: '#4f8cff', bodyDark: '#1f5ad8', bodyLight: '#a6c8ff',
    leaf: '#5088e8', leafDark: '#2058b0', cheek: '#90b8ff', mood: 'stellar',
    glow: 'rgba(70, 130, 255, 0.5)', pattern: 'stars',
  },
  lunar: {
    id: 'lunar', name: 'Lunar Pineapple', deco: 'nightcap',
    body: '#cfd2e6', bodyDark: '#989cba', bodyLight: '#eef0ff',
    leaf: '#b6bad4', leafDark: '#80839c', cheek: '#dcdef0', mood: 'sleepy',
    glow: 'rgba(190, 195, 230, 0.4)',
  },
  nova: {
    id: 'nova', name: 'Nova Pineapple', deco: 'sunburst',
    body: '#ffd23a', bodyDark: '#e0a410', bodyLight: '#fff0a0',
    leaf: '#ffb020', leafDark: '#c88008', cheek: '#ffd868', mood: 'radiant',
    glow: 'rgba(255, 210, 60, 0.6)',
  },
  eclipse: {
    id: 'eclipse', name: 'Eclipse Pineapple', deco: 'eclipse',
    body: '#514270', bodyDark: '#2f2350', bodyLight: '#7c6ba0',
    leaf: '#43356a', leafDark: '#261848', cheek: '#7a6a9a', mood: 'mysterious',
    glow: 'rgba(90, 60, 140, 0.55)', shadow: true,
  },

  // ================================================================
  // WORLD 5 — Prism Realm (light / rainbow / shimmer)
  // ================================================================
  prism: {
    id: 'prism', name: 'Prism Pineapple', deco: 'prism',
    body: '#ff8f7a', bodyDark: '#e04f45', bodyLight: '#ffcabf',
    leaf: '#ffb84d', leafDark: '#d98c2a', cheek: '#ffd88a', mood: 'radiant',
    glow: 'rgba(255, 150, 120, 0.6)', pattern: 'rainbow',
  },
  shimmer: {
    id: 'shimmer', name: 'Shimmer Pineapple', deco: 'sparkles',
    body: '#dd7ce4', bodyDark: '#ac44c2', bodyLight: '#f5d2f8', // orchid magenta (vs cosmic's violet)
    leaf: '#cf82dc', leafDark: '#9a4fb0', cheek: '#eaa6f0', mood: 'sweet',
    glow: 'rgba(215, 110, 235, 0.5)', sparkle: true,
  },
  gleam: {
    id: 'gleam', name: 'Gleam Pineapple', deco: 'sunglasses',
    body: '#ffe466', bodyDark: '#e0bc1c', bodyLight: '#fff6b8',
    leaf: '#f0d858', leafDark: '#b89820', cheek: '#ffe8a0', mood: 'happy',
    glow: 'rgba(255, 225, 90, 0.5)',
  },
  aurora: {
    id: 'aurora', name: 'Aurora Pineapple', deco: 'aurora',
    body: '#5fe6a0', bodyDark: '#22ad6c', bodyLight: '#b4ffd0',
    leaf: '#3fce88', leafDark: '#1c8a58', cheek: '#8ff0bc', mood: 'cool',
    glow: 'rgba(70, 230, 150, 0.45)',
  },
  glimmer: {
    id: 'glimmer', name: 'Glimmer Pineapple', deco: 'tiara',
    body: '#ffffff', bodyDark: '#cdd0e6', bodyLight: '#ffffff',
    leaf: '#e0e0f0', leafDark: '#a0a0c0', cheek: '#eef0ff', mood: 'crystalline',
    glow: 'rgba(225, 228, 255, 0.5)', pattern: 'shimmer',
  },
};

// The five species that spawn on the board (basic types for early levels)
export const SPAWNABLE = ['golden', 'pink', 'ice', 'fire', 'jungle'];

// Special piece kinds (created by big matches, never spawned)
export const SPECIALS = {
  rocketH: { id: 'rocketH', name: 'Rocket Pineapple' },
  rocketV: { id: 'rocketV', name: 'Rocket Pineapple' },
  bomb:    { id: 'bomb',    name: 'Bomb Pineapple' },
  rainbow: { id: 'rainbow', name: 'Rainbow Pineapple' },
};

// —————————————————————————————————————————————————————
// WORLD DEFINITIONS for the gradual pool transition
// —————————————————————————————————————————————————————
export const WORLD_POOLS = {
  1: ['golden', 'pink', 'ice', 'fire', 'jungle'],
  2: ['crystal', 'frost', 'pearl', 'aqua', 'abyss'],
  3: ['ember', 'wild', 'spice', 'thorn', 'blaze'],
  4: ['cosmic', 'stellar', 'lunar', 'nova', 'eclipse'],
  5: ['prism', 'shimmer', 'gleam', 'aurora', 'glimmer'],
};

// The "bridge" types that blend between worlds
export const BRIDGE_NEXT = { 1: 'crystal', 2: 'ember', 3: 'cosmic', 4: 'prism' };
export const BRIDGE_PREV = { 2: 'jungle', 3: 'abyss', 4: 'blaze', 5: 'nova' };

/**
 * Gradual pool transition across 20-level worlds.
 * Each level gets 6 spawnable types.
 */
export function getSpawnableForLevel(levelId) {
  const w = worldAtLevel(levelId);
  if (!w) return [...(WORLD_POOLS[1] || [])];

  const phase = levelId - w.startId + 1; // 1–20 within the world
  const pool = [...WORLD_POOLS[w.id]];   // this world's 5 types

  if (w.id < 5) {
    const next = WORLD_POOLS[w.id + 1];
    if (phase <= 10) {
      // Steady: 5 this world + 1 bridge from next
      pool.push(BRIDGE_NEXT[w.id]);
    } else if (phase <= 15) {
      // Preview: 5 this world + 1 from next
      pool.push(next[0]);
    } else {
      // Transition: 4 this world + 2 from next
      pool.pop();
      pool.push(next[0], next[1]);
    }
  } else {
    // World 5 — steady with bridge from world 4
    pool.push(BRIDGE_PREV[5]);
  }
  return pool;
}

function worldAtLevel(levelId) {
  return WORLDS_META.find((w) => levelId >= w.startId && levelId < w.startId + w.count);
}

export const WORLDS_META = [
  { id: 1, name: 'Sunny Shores',   startId: 1,   count: 20 },
  { id: 2, name: 'Crystal Depths', startId: 21,  count: 20 },
  { id: 3, name: 'Ember Wilds',    startId: 41,  count: 20 },
  { id: 4, name: 'Cosmic Summit',  startId: 61,  count: 20 },
  { id: 5, name: 'Prism Realm',    startId: 81,  count: 20 },
];
