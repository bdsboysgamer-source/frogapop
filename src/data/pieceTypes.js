// Pineapple species definitions.
// Adding a new pineapple = add an entry here; art, board logic,
// objectives and HUD icons all pick it up automatically.

export const PIECE_TYPES = {
  golden: {
    id: 'golden',
    name: 'Golden Pineapple',
    body: '#ffc53d', bodyDark: '#e8930c', bodyLight: '#ffe9a3',
    leaf: '#58bb3d', leafDark: '#2e8b2e',
    cheek: '#ff9d5c',
    mood: 'happy',
  },
  pink: {
    id: 'pink',
    name: 'Pink Sugar Pineapple',
    body: '#ff8fc8', bodyDark: '#e0559d', bodyLight: '#ffd2e9',
    leaf: '#ff5e9c', leafDark: '#c93a78',
    cheek: '#ff5e9c',
    mood: 'sweet',
    glow: 'rgba(255, 150, 210, 0.55)',
  },
  ice: {
    id: 'ice',
    name: 'Ice Pineapple',
    body: '#7fd4f5', bodyDark: '#2f96cf', bodyLight: '#d8f4ff',
    leaf: '#4fc3e8', leafDark: '#2380b8',
    cheek: '#8fc9ff',
    mood: 'cool',
    crystal: true,
  },
  fire: {
    id: 'fire',
    name: 'Fire Pineapple',
    body: '#ff7a45', bodyDark: '#d63d17', bodyLight: '#ffc19a',
    leaf: '#ffb037', leafDark: '#e07514',
    cheek: '#ff4d2e',
    mood: 'fierce',
    embers: true,
    glow: 'rgba(255, 130, 60, 0.5)',
  },
  jungle: {
    id: 'jungle',
    name: 'Jungle Pineapple',
    body: '#8bd44a', bodyDark: '#4e9a1f', bodyLight: '#d2f0a8',
    leaf: '#2e8b4f', leafDark: '#1c6338',
    cheek: '#5cb838',
    mood: 'wild',
  },
  // === NEW PINEAPPLE TYPES ===
  cosmic: {
    id: 'cosmic',
    name: 'Cosmic Pineapple',
    body: '#b48cff', bodyDark: '#7b4fc4', bodyLight: '#e8dcff',
    leaf: '#9b6fe8', leafDark: '#6a3fa8',
    cheek: '#ff9dff',
    mood: 'stellar',
    glow: 'rgba(180, 140, 255, 0.6)',
    sparkle: true,
    pattern: 'stars',
  },
  crystal: {
    id: 'crystal',
    name: 'Crystal Pineapple',
    body: '#f0f8ff', bodyDark: '#b8d4e8', bodyLight: '#ffffff',
    leaf: '#a8d8ea', leafDark: '#5a9ab8',
    cheek: '#d4e8f0',
    mood: 'crystalline',
    crystal: true,
    glow: 'rgba(200, 230, 255, 0.5)',
    pattern: 'diamond',
    transparent: true,
  },
  shadow: {
    id: 'shadow',
    name: 'Shadow Pineapple',
    body: '#8a7a9a', bodyDark: '#4a3a5a', bodyLight: '#c8b8d8',
    leaf: '#6a5a7a', leafDark: '#3a2a4a',
    cheek: '#b89ac8',
    mood: 'mysterious',
    glow: 'rgba(138, 122, 154, 0.5)',
    shadow: true,
    pattern: 'dark',
  },
  prism: {
    id: 'prism',
    name: 'Prism Pineapple',
    body: '#ff9d9d', bodyDark: '#e05555', bodyLight: '#ffd8d8',
    leaf: '#ffb84d', leafDark: '#d98c2a',
    cheek: '#ffd88a',
    mood: 'radiant',
    glow: 'rgba(255, 200, 100, 0.6)',
    rainbow: true,
    pattern: 'rainbow',
  },
};

// The five species that spawn on the board (basic types for early levels)
export const SPAWNABLE = ['golden', 'pink', 'ice', 'fire', 'jungle'];

// Advanced types that appear in later levels
export const ADVANCED_TYPES = ['cosmic', 'crystal', 'shadow', 'prism'];

// Special piece kinds (created by big matches, never spawned)
export const SPECIALS = {
  rocketH: { id: 'rocketH', name: 'Rocket Pineapple' },
  rocketV: { id: 'rocketV', name: 'Rocket Pineapple' },
  bomb:    { id: 'bomb',    name: 'Bomb Pineapple' },
  rainbow: { id: 'rainbow', name: 'Rainbow Pineapple' },
};

// Get spawnable types based on level (early vs late game)
export function getSpawnableForLevel(levelId) {
  if (levelId >= 23) {
    // Late game: all 9 types
    return [...SPAWNABLE, ...ADVANCED_TYPES];
  } else if (levelId >= 16) {
    // Mid-late: basic 5 + cosmic + crystal + prism
    return [...SPAWNABLE, 'cosmic', 'crystal', 'prism'];
  } else if (levelId >= 10) {
    // Mid game: basic 5 + cosmic + crystal
    return [...SPAWNABLE, 'cosmic', 'crystal'];
  } else if (levelId >= 7) {
    // Early-mid: basic 5 + crystal
    return [...SPAWNABLE, 'crystal'];
  } else {
    // Early levels: just the basic 5
    return [...SPAWNABLE];
  }
}