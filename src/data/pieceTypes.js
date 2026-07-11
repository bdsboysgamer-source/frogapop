// Pineapple species definitions — 5 worlds × 5 themed types each (25 total).
// Adding a new pineapple = add an entry here; art, board logic,
// objectives and HUD icons all pick it up automatically.

export const PIECE_TYPES = {
  // ================================================================
  // WORLD 1 — Sunny Shores (tropical basics)
  // ================================================================
  golden: {
    id: 'golden', name: 'Golden Pineapple',
    body: '#ffc53d', bodyDark: '#e8930c', bodyLight: '#ffe9a3',
    leaf: '#58bb3d', leafDark: '#2e8b2e', cheek: '#ff9d5c', mood: 'happy',
  },
  pink: {
    id: 'pink', name: 'Pink Sugar Pineapple',
    body: '#ff8fc8', bodyDark: '#e0559d', bodyLight: '#ffd2e9',
    leaf: '#ff5e9c', leafDark: '#c93a78', cheek: '#ff5e9c', mood: 'sweet',
    glow: 'rgba(255, 150, 210, 0.55)',
  },
  ice: {
    id: 'ice', name: 'Ice Pineapple',
    body: '#7fd4f5', bodyDark: '#2f96cf', bodyLight: '#d8f4ff',
    leaf: '#4fc3e8', leafDark: '#2380b8', cheek: '#8fc9ff', mood: 'cool', crystal: true,
  },
  fire: {
    id: 'fire', name: 'Fire Pineapple',
    body: '#ff7a45', bodyDark: '#d63d17', bodyLight: '#ffc19a',
    leaf: '#ffb037', leafDark: '#e07514', cheek: '#ff4d2e', mood: 'fierce',
    embers: true, glow: 'rgba(255, 130, 60, 0.5)',
  },
  jungle: {
    id: 'jungle', name: 'Jungle Pineapple',
    body: '#8bd44a', bodyDark: '#4e9a1f', bodyLight: '#d2f0a8',
    leaf: '#2e8b4f', leafDark: '#1c6338', cheek: '#5cb838', mood: 'wild',
  },

  // ================================================================
  // WORLD 2 — Crystal Depths (cold / water / gem)
  // ================================================================
  crystal: {
    id: 'crystal', name: 'Crystal Pineapple',
    body: '#f0f8ff', bodyDark: '#b8d4e8', bodyLight: '#ffffff',
    leaf: '#a8d8ea', leafDark: '#5a9ab8', cheek: '#d4e8f0', mood: 'crystalline',
    crystal: true, glow: 'rgba(200, 230, 255, 0.5)', pattern: 'diamond', transparent: true,
  },
  frost: {
    id: 'frost', name: 'Frost Pineapple',
    body: '#c8e8f8', bodyDark: '#78b8d8', bodyLight: '#eaf8ff',
    leaf: '#88cce8', leafDark: '#4890b0', cheek: '#b0ddf0', mood: 'cool',
    crystal: true, glow: 'rgba(180, 220, 255, 0.4)',
  },
  pearl: {
    id: 'pearl', name: 'Pearl Pineapple',
    body: '#f5eef8', bodyDark: '#d0c0d8', bodyLight: '#fff8ff',
    leaf: '#e8ddf0', leafDark: '#b8a8c8', cheek: '#f0ddf8', mood: 'sweet',
    glow: 'rgba(220, 200, 240, 0.45)', pattern: 'shimmer',
  },
  aqua: {
    id: 'aqua', name: 'Aqua Pineapple',
    body: '#60d8d8', bodyDark: '#20a8b8', bodyLight: '#b0f0f0',
    leaf: '#48c8c8', leafDark: '#188898', cheek: '#80e8e8', mood: 'cool',
    glow: 'rgba(80, 210, 210, 0.45)',
  },
  abyss: {
    id: 'abyss', name: 'Abyss Pineapple',
    body: '#4a5a7a', bodyDark: '#2a3a5a', bodyLight: '#8a9aba',
    leaf: '#3a4a6a', leafDark: '#1a2a4a', cheek: '#6a7a9a', mood: 'mysterious',
    glow: 'rgba(60, 70, 110, 0.5)', shadow: true,
  },

  // ================================================================
  // WORLD 3 — Ember Wilds (fire / nature / spice)
  // ================================================================
  ember: {
    id: 'ember', name: 'Ember Pineapple',
    body: '#e87a3a', bodyDark: '#b84a18', bodyLight: '#f8ba8a',
    leaf: '#d86828', leafDark: '#a04010', cheek: '#f09050', mood: 'fierce',
    embers: true, glow: 'rgba(220, 110, 40, 0.5)',
  },
  wild: {
    id: 'wild', name: 'Wild Pineapple',
    body: '#c8a848', bodyDark: '#987a20', bodyLight: '#e8d090',
    leaf: '#7a9a30', leafDark: '#4a6a18', cheek: '#b09050', mood: 'wild',
  },
  spice: {
    id: 'spice', name: 'Spice Pineapple',
    body: '#e85858', bodyDark: '#c02828', bodyLight: '#f89888',
    leaf: '#d84040', leafDark: '#a01818', cheek: '#f07868', mood: 'sweet',
    glow: 'rgba(230, 70, 70, 0.45)',
  },
  thorn: {
    id: 'thorn', name: 'Thorn Pineapple',
    body: '#6a8a4a', bodyDark: '#4a6828', bodyLight: '#9aba78',
    leaf: '#5a7a38', leafDark: '#3a5820', cheek: '#8aaa60', mood: 'fierce',
    pattern: 'spiky',
  },
  blaze: {
    id: 'blaze', name: 'Blaze Pineapple',
    body: '#ff9030', bodyDark: '#d06010', bodyLight: '#ffc080',
    leaf: '#f08020', leafDark: '#b05008', cheek: '#ffa850', mood: 'fierce',
    embers: true, glow: 'rgba(255, 140, 30, 0.6)',
  },

  // ================================================================
  // WORLD 4 — Cosmic Summit (space / stellar)
  // ================================================================
  cosmic: {
    id: 'cosmic', name: 'Cosmic Pineapple',
    body: '#b48cff', bodyDark: '#7b4fc4', bodyLight: '#e8dcff',
    leaf: '#9b6fe8', leafDark: '#6a3fa8', cheek: '#ff9dff', mood: 'stellar',
    glow: 'rgba(180, 140, 255, 0.6)', sparkle: true, pattern: 'stars',
  },
  stellar: {
    id: 'stellar', name: 'Stellar Pineapple',
    body: '#6aa8ff', bodyDark: '#2878d8', bodyLight: '#b8d8ff',
    leaf: '#5088e8', leafDark: '#2058b0', cheek: '#90b8ff', mood: 'stellar',
    glow: 'rgba(80, 150, 255, 0.5)', sparkle: true, pattern: 'stars',
  },
  lunar: {
    id: 'lunar', name: 'Lunar Pineapple',
    body: '#d8d8e8', bodyDark: '#a0a0b8', bodyLight: '#f0f0ff',
    leaf: '#c0c0d8', leafDark: '#8080a0', cheek: '#e0e0f0', mood: 'cool',
    glow: 'rgba(200, 200, 230, 0.4)', crystal: true,
  },
  nova: {
    id: 'nova', name: 'Nova Pineapple',
    body: '#ffc840', bodyDark: '#d89810', bodyLight: '#ffe898',
    leaf: '#ffb020', leafDark: '#c88008', cheek: '#ffd868', mood: 'radiant',
    glow: 'rgba(255, 200, 50, 0.6)', sparkle: true,
  },
  eclipse: {
    id: 'eclipse', name: 'Eclipse Pineapple',
    body: '#5a4a7a', bodyDark: '#3a2a5a', bodyLight: '#8a7aaa',
    leaf: '#4a3a6a', leafDark: '#2a1a4a', cheek: '#7a6a9a', mood: 'mysterious',
    glow: 'rgba(70, 50, 100, 0.55)', shadow: true, pattern: 'dark',
  },

  // ================================================================
  // WORLD 5 — Prism Realm (light / rainbow / shimmer)
  // ================================================================
  prism: {
    id: 'prism', name: 'Prism Pineapple',
    body: '#ff9d9d', bodyDark: '#e05555', bodyLight: '#ffd8d8',
    leaf: '#ffb84d', leafDark: '#d98c2a', cheek: '#ffd88a', mood: 'radiant',
    glow: 'rgba(255, 200, 100, 0.6)', rainbow: true, pattern: 'rainbow',
  },
  shimmer: {
    id: 'shimmer', name: 'Shimmer Pineapple',
    body: '#f0d8ff', bodyDark: '#c8a0e8', bodyLight: '#fff0ff',
    leaf: '#d8b8f0', leafDark: '#a878c8', cheek: '#e8c8ff', mood: 'sweet',
    glow: 'rgba(220, 180, 255, 0.5)', sparkle: true,
  },
  gleam: {
    id: 'gleam', name: 'Gleam Pineapple',
    body: '#ffe88a', bodyDark: '#d8b840', bodyLight: '#fff4c8',
    leaf: '#f0d858', leafDark: '#b89820', cheek: '#ffe8a0', mood: 'happy',
    glow: 'rgba(255, 230, 100, 0.5)', sparkle: true,
  },
  aurora: {
    id: 'aurora', name: 'Aurora Pineapple',
    body: '#8af0b8', bodyDark: '#40c080', bodyLight: '#c8ffd8',
    leaf: '#60d898', leafDark: '#28a060', cheek: '#a8f0c8', mood: 'cool',
    glow: 'rgba(80, 240, 160, 0.4)', rainbow: true,
  },
  glimmer: {
    id: 'glimmer', name: 'Glimmer Pineapple',
    body: '#f8f8ff', bodyDark: '#c8c8e0', bodyLight: '#ffffff',
    leaf: '#e0e0f0', leafDark: '#a0a0c0', cheek: '#f0f0ff', mood: 'crystalline',
    glow: 'rgba(220, 220, 255, 0.45)', crystal: true, pattern: 'shimmer',
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
