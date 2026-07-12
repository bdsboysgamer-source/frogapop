// Pineapple species definitions — 5 worlds × 5 themed types each (25 total).
// Adding a new pineapple = add an entry here; art, board logic,
// objectives and HUD icons all pick it up automatically.
//
// Palette rule: any set of pineapples that can spawn together (a world's
// 5 types + the "bridge" types that blend in) uses SIX clearly different
// colour families — so nothing looks alike at a glance. On top of that,
// every species has a unique `deco` accessory (drawn in PieceArt.js).

export const PIECE_TYPES = {
  // ================================================================
  // WORLD 1 — Sunny Shores :  gold · pink · cyan · red · green
  // ================================================================
  golden: {
    id: 'golden', name: 'Golden Pineapple', deco: 'crown',
    body: '#ffc53d', bodyDark: '#e0890a', bodyLight: '#ffe6a0',
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
    body: '#33cfe6', bodyDark: '#1493b2', bodyLight: '#a6eef7', // cyan
    leaf: '#22b6d0', leafDark: '#147e98', cheek: '#7fe0f0', mood: 'cool',
  },
  fire: {
    id: 'fire', name: 'Fire Pineapple', deco: 'mohawk',
    body: '#ff5a34', bodyDark: '#d02c0e', bodyLight: '#ffa480', // red-orange
    leaf: '#ff8f37', leafDark: '#d66510', cheek: '#ff4023', mood: 'fierce',
    embers: true, glow: 'rgba(255, 100, 50, 0.5)',
  },
  jungle: {
    id: 'jungle', name: 'Jungle Pineapple', deco: 'flower',
    body: '#7bc73f', bodyDark: '#4a9a1c', bodyLight: '#c6ec96', // grass green
    leaf: '#2e8b4f', leafDark: '#1c6338', cheek: '#5cb838', mood: 'wild',
  },

  // ================================================================
  // WORLD 2 — Crystal Depths :  white · periwinkle · peach · teal · navy
  // ================================================================
  crystal: {
    id: 'crystal', name: 'Crystal Pineapple', deco: 'gemspike',
    body: '#e9f2fb', bodyDark: '#bccddd', bodyLight: '#ffffff', // near-white
    leaf: '#b8d4e6', leafDark: '#7fa0b8', cheek: '#d4e4f0', mood: 'crystalline',
    crystal: true, glow: 'rgba(190, 215, 240, 0.5)', pattern: 'diamond',
  },
  frost: {
    id: 'frost', name: 'Frost Pineapple', deco: 'earmuffs',
    body: '#9fb2f0', bodyDark: '#6577d8', bodyLight: '#d6ddff', // periwinkle
    leaf: '#8496e8', leafDark: '#5566c0', cheek: '#b0bcf5', mood: 'cool',
    crystal: true, glow: 'rgba(160, 175, 240, 0.45)',
  },
  pearl: {
    id: 'pearl', name: 'Pearl Pineapple', deco: 'pearls',
    body: '#ffcfae', bodyDark: '#e09e70', bodyLight: '#fff0e2', // peach
    leaf: '#f0bf9e', leafDark: '#c88a64', cheek: '#ffbf9e', mood: 'sweet',
    glow: 'rgba(255, 195, 165, 0.45)', pattern: 'shimmer',
  },
  aqua: {
    id: 'aqua', name: 'Aqua Pineapple', deco: 'bubbles',
    body: '#1fbf9f', bodyDark: '#0d8a70', bodyLight: '#82e6d0', // teal
    leaf: '#15ad90', leafDark: '#0b7860', cheek: '#6fe0c8', mood: 'cool',
    glow: 'rgba(40, 200, 170, 0.45)',
  },
  abyss: {
    id: 'abyss', name: 'Abyss Pineapple', deco: 'angler',
    body: '#2f3f70', bodyDark: '#19244a', bodyLight: '#6474a2', // navy
    leaf: '#293a64', leafDark: '#15224a', cheek: '#556394', mood: 'mysterious',
    glow: 'rgba(60, 80, 145, 0.5)', shadow: true,
  },

  // ================================================================
  // WORLD 3 — Ember Wilds :  brown · mustard · red · forest · orange
  // ================================================================
  ember: {
    id: 'ember', name: 'Ember Pineapple', deco: 'smoke',
    body: '#9a4a22', bodyDark: '#5e290c', bodyLight: '#c67a44', // dark brown
    leaf: '#7e3a16', leafDark: '#4e2208', cheek: '#bf6636', mood: 'fierce',
    embers: true, glow: 'rgba(170, 80, 30, 0.5)',
  },
  wild: {
    id: 'wild', name: 'Wild Pineapple', deco: 'safari',
    body: '#b6d92e', bodyDark: '#7fa018', bodyLight: '#dcef8a', // lime (breaks the warm cluster)
    leaf: '#8fb020', leafDark: '#5e7810', cheek: '#c8e05a', mood: 'wild',
  },
  spice: {
    id: 'spice', name: 'Spice Pineapple', deco: 'chili',
    body: '#ee2f36', bodyDark: '#b60f18', bodyLight: '#ff7068', // pure red
    leaf: '#d82a30', leafDark: '#a01218', cheek: '#ff645c', mood: 'fierce',
    glow: 'rgba(240, 45, 55, 0.45)',
  },
  thorn: {
    id: 'thorn', name: 'Thorn Pineapple', deco: 'thorns',
    body: '#4f8f4a', bodyDark: '#2f6030', bodyLight: '#86bd72', // forest green
    leaf: '#3f7a3a', leafDark: '#2a521f', cheek: '#7faa60', mood: 'wild',
    pattern: 'spiky',
  },
  blaze: {
    id: 'blaze', name: 'Blaze Pineapple', deco: 'flamecrown',
    body: '#ff8a1e', bodyDark: '#d65e08', bodyLight: '#ffbe6e', // bright orange
    leaf: '#f07a12', leafDark: '#b0500a', cheek: '#ffa64a', mood: 'fierce',
    embers: true, glow: 'rgba(255, 140, 20, 0.55)',
  },

  // ================================================================
  // WORLD 4 — Cosmic Summit :  violet · blue · lilac-grey · amber · indigo
  // ================================================================
  cosmic: {
    id: 'cosmic', name: 'Cosmic Pineapple', deco: 'planet',
    body: '#9a4fe0', bodyDark: '#5f28ac', bodyLight: '#cba0f5', // bright violet
    leaf: '#8a54d8', leafDark: '#5a2f9c', cheek: '#d68eff', mood: 'stellar',
    glow: 'rgba(150, 80, 235, 0.6)', pattern: 'stars',
  },
  stellar: {
    id: 'stellar', name: 'Stellar Pineapple', deco: 'shootingstar',
    body: '#3f7dff', bodyDark: '#1c4fd8', bodyLight: '#a6c0ff', // blue
    leaf: '#3f70e8', leafDark: '#2050b0', cheek: '#8fb4ff', mood: 'stellar',
    glow: 'rgba(70, 130, 255, 0.5)', pattern: 'stars',
  },
  lunar: {
    id: 'lunar', name: 'Lunar Pineapple', deco: 'nightcap',
    body: '#c6c4e2', bodyDark: '#9490b8', bodyLight: '#efeeff', // lilac grey
    leaf: '#b4b0d4', leafDark: '#82809c', cheek: '#dcdcf0', mood: 'sleepy',
    glow: 'rgba(190, 190, 225, 0.4)',
  },
  nova: {
    id: 'nova', name: 'Nova Pineapple', deco: 'sunburst',
    body: '#ff9414', bodyDark: '#d66404', bodyLight: '#ffc25c', // orange (vs gleam's lemon)
    leaf: '#f08414', leafDark: '#b85c08', cheek: '#ffb048', mood: 'radiant',
    glow: 'rgba(255, 150, 20, 0.6)',
  },
  eclipse: {
    id: 'eclipse', name: 'Eclipse Pineapple', deco: 'eclipse',
    body: '#352a60', bodyDark: '#1b1440', bodyLight: '#5e5090', // deep indigo
    leaf: '#2e2456', leafDark: '#181038', cheek: '#6a5c96', mood: 'mysterious',
    glow: 'rgba(90, 60, 150, 0.55)', shadow: true,
  },

  // ================================================================
  // WORLD 5 — Prism Realm :  coral · magenta · lemon · mint · white
  // ================================================================
  prism: {
    id: 'prism', name: 'Prism Pineapple', deco: 'prism',
    body: '#ff6f86', bodyDark: '#e03a58', bodyLight: '#ffb0c0', // rose-coral (vs nova's orange)
    leaf: '#ff8f7a', leafDark: '#d95a48', cheek: '#ffb0a0', mood: 'radiant',
    glow: 'rgba(255, 120, 140, 0.6)', pattern: 'rainbow',
  },
  shimmer: {
    id: 'shimmer', name: 'Shimmer Pineapple', deco: 'sparkles',
    body: '#e85ad0', bodyDark: '#b42aa0', bodyLight: '#f7b0ec', // magenta
    leaf: '#d85ac8', leafDark: '#a83098', cheek: '#f28ce0', mood: 'sweet',
    glow: 'rgba(230, 90, 205, 0.5)', sparkle: true,
  },
  gleam: {
    id: 'gleam', name: 'Gleam Pineapple', deco: 'sunglasses',
    body: '#e4ee48', bodyDark: '#c2c81a', bodyLight: '#f6f7a4', // lime-lemon (clearly not orange)
    leaf: '#cfd824', leafDark: '#9aa010', cheek: '#eef080', mood: 'happy',
    glow: 'rgba(225, 240, 90, 0.5)',
  },
  aurora: {
    id: 'aurora', name: 'Aurora Pineapple', deco: 'aurora',
    body: '#33d98a', bodyDark: '#17a864', bodyLight: '#9ff0c4', // spring green
    leaf: '#22c078', leafDark: '#128a58', cheek: '#7ce8b0', mood: 'cool',
    glow: 'rgba(60, 225, 150, 0.45)',
  },
  glimmer: {
    id: 'glimmer', name: 'Glimmer Pineapple', deco: 'tiara',
    body: '#ffffff', bodyDark: '#cfd4ea', bodyLight: '#ffffff', // pure white
    leaf: '#dfe2f2', leafDark: '#9ea2c2', cheek: '#eef0ff', mood: 'crystalline',
    glow: 'rgba(220, 225, 255, 0.5)', pattern: 'shimmer',
  },
};

// Short, fun flavour text for the Pineapple Index.
export const PINEAPPLE_DESC = {
  golden:  'The original sun-soaked classic. Wears the crown for a reason.',
  pink:    'Sugar-sweet and proud of it. Bakes friendship, not enemies.',
  ice:     'Keeps its cool under pressure. Never sweats a combo.',
  fire:    'Hot-headed but big-hearted. Handle with oven mitts.',
  jungle:  'Raised by toucans. Absolutely feral, weirdly polite.',
  crystal: 'So clear you can see its dreams — mostly of matching.',
  frost:   'Ear-muffed and unbothered. Winter is its whole personality.',
  pearl:   'Found in a deep-sea clam. Fancy, glossy, a little smug.',
  aqua:    'Blows bubbles instead of talking. Very go-with-the-flow.',
  abyss:   'Lives where the light gives up. Brought its own lamp.',
  ember:   'Still glowing from last week’s bonfire. Smells like campfire.',
  wild:    'Explorer at heart. Has definitely eaten a bug on purpose.',
  spice:   'One bite and you’ll cry happy tears. Bring milk.',
  thorn:   'Prickly outside, prickly inside — but fiercely loyal.',
  blaze:   'Turned the heat up and lost the dial. Pure chaos energy.',
  cosmic:  'Made of stardust and bad decisions. Orbits the snack table.',
  stellar: 'A shooting star that decided to be a fruit instead.',
  lunar:   'Perpetually one nap away from greatness. Zzz…',
  nova:    'Shines so bright it needs shades. Gave them to Gleam.',
  eclipse: 'Mysterious, moody, and always slightly in shadow.',
  prism:   'Splits sunlight into pure joy. A rainbow with a face.',
  shimmer: 'Twinkles when it’s happy — which is always. Sparkle overload.',
  gleam:   'Too cool for the room. Shades on, indoors, at night.',
  aurora:  'Dances like the northern lights. Never steps on toes.',
  glimmer: 'Pure light in pineapple form. Wears a tiara, obviously.',
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
