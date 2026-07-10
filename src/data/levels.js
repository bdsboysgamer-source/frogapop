export const WORLDS = [
  {
    id: 1,
    name: 'Sunny Shores',
    frog: 'sprig',
    unlockLevels: 0,
    startId: 1,
    count: 20,
    bg: 'linear-gradient(180deg, #45cfe4 0%, #7fe4da 45%, #1ba8c9 100%)',
  },
  {
    id: 2,
    name: 'Crystal Depths',
    frog: 'crystal',
    unlockLevels: 12,
    startId: 21,
    count: 20,
    bg: 'linear-gradient(180deg, #2a6a8a 0%, #1d5270 40%, #0f3a55 100%)',
  },
];

export function getWorld(levelId) {
  return WORLDS.find((w) => levelId >= w.startId && levelId < w.startId + w.count) || WORLDS[0];
}

export const LEVELS = [
  // ============================================================
  // WORLD 1: SUNNY SHORES (levels 1-20)
  // ============================================================
  {
    id: 1, name: 'Sunny Shores', frog: 'sprig', moves: 24,
    stars: [1500, 3000, 5000],
    collect: { golden: 15 },
    intro: 'Sprig needs golden pineapples to rebuild the beach hut!',
  },
  {
    id: 2, name: 'Sugar Lagoon', frog: 'sprig', moves: 22,
    stars: [2000, 4000, 6500],
    collect: { pink: 18, golden: 12 },
    intro: 'Sweeten the lagoon with pink sugar pines!',
  },
  {
    id: 3, name: 'Palm Grove', frog: 'scout', moves: 22,
    stars: [2500, 5000, 8000],
    collect: { jungle: 20, ice: 12 },
    intro: 'Scout is charting the grove. Gather jungle pines!',
  },
  {
    id: 4, name: 'Frostfruit Cove', frog: 'scout', moves: 20,
    stars: [3000, 6000, 9500],
    collect: { ice: 24 },
    intro: 'Brrr! The cove is packed with ice pineapples.',
  },
  {
    id: 5, name: 'Ember Hollow', frog: 'ruby', moves: 20,
    stars: [3500, 7000, 11000],
    collect: { fire: 22, jungle: 14 },
    intro: 'Ruby dares you to harvest the fire pines!',
  },
  {
    id: 6, name: 'Volcano Rim', frog: 'ruby', moves: 19,
    stars: [4000, 8000, 12500],
    collect: { fire: 20, golden: 20 },
    intro: 'Careful at the rim — big combos welcome!',
  },
  {
    id: 7, name: 'Crystal Caverns', frog: 'crystal', moves: 20,
    stars: [4500, 9000, 14000],
    collect: { ice: 22, pink: 14 },
    intro: 'Crystal sparkles in the icy caves!',
  },
  {
    id: 8, name: 'Gemstone Grotto', frog: 'crystal', moves: 19,
    stars: [5000, 10000, 15500],
    collect: { crystal: 18, ice: 18 },
    intro: 'Crystal pineapples glisten in the grotto!',
  },
  {
    id: 9, name: 'Frozen Falls', frog: 'crystal', moves: 18,
    stars: [5500, 11000, 17000],
    collect: { crystal: 22, ice: 20, golden: 14 },
    intro: 'The frozen falls hide crystalline treasures!',
  },
  {
    id: 10, name: 'Whispering Vines', frog: 'merlin', moves: 18,
    stars: [6000, 12000, 18500],
    collect: { jungle: 26, fire: 16 },
    intro: 'Merlin senses magic deep in the vines...',
  },
  {
    id: 11, name: 'Moonpool Shrine', frog: 'merlin', moves: 17,
    stars: [6500, 13000, 20000],
    collect: { cosmic: 20, pink: 22 },
    intro: 'Cosmic pineapples shimmer under the moon!',
  },
  {
    id: 12, name: 'Skyfruit Summit', frog: 'merlin', moves: 17,
    stars: [7000, 14000, 21500],
    collect: { cosmic: 24, fire: 24, golden: 14 },
    intro: 'The summit glows with cosmic power!',
  },
  {
    id: 13, name: 'Jade Canopy', frog: 'jade', moves: 18,
    stars: [7500, 15000, 23000],
    collect: { jungle: 28, pink: 18 },
    intro: 'Jade swings through the emerald canopy!',
  },
  {
    id: 14, name: 'Temple Ruins', frog: 'jade', moves: 17,
    stars: [8000, 16000, 24500],
    collect: { golden: 22, jungle: 20 },
    intro: 'Ancient ruins hide golden pineapples.',
  },
  {
    id: 15, name: 'Canopy Kingdom', frog: 'jade', moves: 16,
    stars: [8500, 17000, 26000],
    collect: { pink: 24, fire: 20, cosmic: 14 },
    intro: 'The canopy kingdom joins cosmic energy!',
  },
  {
    id: 16, name: 'Sparkling Shallows', frog: 'sparkle', moves: 17,
    stars: [9000, 18000, 27500],
    collect: { golden: 20, crystal: 20 },
    intro: 'Sparkle radiates through the shallows!',
  },
  {
    id: 17, name: 'Tidal Pools', frog: 'sparkle', moves: 16,
    stars: [9500, 19000, 29000],
    collect: { pink: 26, crystal: 16, golden: 10 },
    intro: 'Tidal pools shimmer with crystal pineapples.',
  },
  {
    id: 18, name: 'Coral Reef', frog: 'sparkle', moves: 16,
    stars: [10000, 20000, 30500],
    collect: { prism: 18, crystal: 18, golden: 14 },
    intro: 'A coral reef of prismatic pineapples!',
  },
  {
    id: 19, name: 'Ember Ascent', frog: 'blaze', moves: 17,
    stars: [10500, 21000, 32000],
    collect: { fire: 28, jungle: 14 },
    intro: 'Blaze climbs the ember ascent!',
  },
  {
    id: 20, name: 'Magma Core', frog: 'blaze', moves: 16,
    stars: [11000, 22000, 33500],
    collect: { fire: 24, prism: 20, golden: 12 },
    intro: 'The magma core burns with prismatic fire!',
  },

  // ============================================================
  // WORLD 2: CRYSTAL DEPTHS (levels 21-40)
  // Level 21 ≈ difficulty of level 15 (Canopy Kingdom)
  // ============================================================
  {
    id: 21, name: 'Phoenix Nest', frog: 'blaze', moves: 17,
    stars: [8000, 16000, 25000],
    collect: { prism: 18, fire: 18, crystal: 12 },
    intro: 'A nest of rebirth, prism and fire!',
  },
  {
    id: 22, name: 'Starlight Glade', frog: 'nova', moves: 17,
    stars: [9000, 18000, 28000],
    collect: { cosmic: 20, crystal: 16 },
    intro: 'Nova glows under the starlight!',
  },
  {
    id: 23, name: 'Comet Crossing', frog: 'nova', moves: 16,
    stars: [10000, 20000, 31000],
    collect: { cosmic: 18, prism: 16, shadow: 12 },
    intro: 'Comets blaze with cosmic and shadow power!',
  },
  {
    id: 24, name: 'Nebula Nook', frog: 'nova', moves: 16,
    stars: [10500, 21000, 32500],
    collect: { shadow: 20, cosmic: 16, jungle: 12 },
    intro: 'A nebula of shadow and cosmic pineapples!',
  },
  {
    id: 25, name: 'Shadow Veil', frog: 'shadow', moves: 16,
    stars: [11000, 22000, 34000],
    collect: { shadow: 22, cosmic: 14 },
    intro: 'Shadow rises from the depths!',
  },
  {
    id: 26, name: 'Eclipse Pass', frog: 'shadow', moves: 15,
    stars: [11500, 23000, 35500],
    collect: { shadow: 18, prism: 18, ice: 12 },
    intro: 'Eclipse brings shadow and prism together!',
  },
  {
    id: 27, name: 'Midnight Hollow', frog: 'shadow', moves: 15,
    stars: [12000, 24000, 37000],
    collect: { shadow: 20, crystal: 16, pink: 12 },
    intro: 'The hollow echoes with shadow energy!',
  },
  {
    id: 28, name: 'Harmony Isle', frog: 'sprig', moves: 15,
    stars: [12500, 25000, 38500],
    collect: { golden: 14, pink: 14, jungle: 14, crystal: 10 },
    intro: 'All pineapples unite in harmony!',
  },
  {
    id: 29, name: 'Rainbow Ridge', frog: 'ruby', moves: 14,
    stars: [13000, 26000, 40000],
    collect: { prism: 16, cosmic: 16, shadow: 12, fire: 12 },
    intro: 'Ruby finds the rainbow ridge of prism pines!',
  },
  {
    id: 30, name: 'Paradise Peak', frog: 'sprig', moves: 14,
    stars: [13500, 27000, 41500],
    collect: { golden: 12, pink: 12, jungle: 12, crystal: 12, cosmic: 12, prism: 12, shadow: 12 },
    intro: 'Collect every pineapple to restore Paradise!',
  },
  // World 2 levels 11-20: the hardest challenges
  {
    id: 31, name: 'Abyssal Trench', frog: 'shadow', moves: 15,
    stars: [14000, 28000, 43000],
    collect: { shadow: 24, prism: 18, ice: 14 },
    intro: 'Shadow descends into the abyssal trench!',
  },
  {
    id: 32, name: 'Coral Gate', frog: 'sparkle', moves: 15,
    stars: [14500, 29000, 44500],
    collect: { prism: 20, crystal: 18, golden: 14 },
    intro: 'Sparkle opens the coral gate!',
  },
  {
    id: 33, name: 'Frostfire Ridge', frog: 'ruby', moves: 14,
    stars: [15000, 30000, 46000],
    collect: { fire: 22, ice: 20, crystal: 14 },
    intro: 'Ruby braves the frostfire ridge!',
  },
  {
    id: 34, name: 'Astral Observatory', frog: 'merlin', moves: 14,
    stars: [15500, 31000, 47500],
    collect: { cosmic: 22, shadow: 18, prism: 14 },
    intro: 'Merlin reads the astral alignment!',
  },
  {
    id: 35, name: 'Sunken Temple', frog: 'crystal', moves: 14,
    stars: [16000, 32000, 49000],
    collect: { crystal: 24, ice: 18, pink: 14 },
    intro: 'Crystal explores the sunken temple!',
  },
  {
    id: 36, name: 'Thunder Plateau', frog: 'blaze', moves: 13,
    stars: [16500, 33000, 50500],
    collect: { fire: 22, jungle: 20, cosmic: 14 },
    intro: 'Blaze storms the thunder plateau!',
  },
  {
    id: 37, name: 'Moonlit Garden', frog: 'nova', moves: 13,
    stars: [17000, 34000, 52000],
    collect: { cosmic: 20, shadow: 18, prism: 16, pink: 12 },
    intro: 'Nova dances in the moonlit garden!',
  },
  {
    id: 38, name: 'Emerald Spire', frog: 'jade', moves: 13,
    stars: [17500, 35000, 53500],
    collect: { jungle: 22, crystal: 18, shadow: 14, fire: 12 },
    intro: 'Jade climbs the emerald spire!',
  },
  {
    id: 39, name: 'Crystal Peak', frog: 'crystal', moves: 12,
    stars: [18000, 36000, 55000],
    collect: { crystal: 22, prism: 20, cosmic: 16, ice: 14 },
    intro: 'Crystal reaches the crystalline peak!',
  },
  {
    id: 40, name: 'Frogapop Summit', frog: 'sprig', moves: 12,
    stars: [18500, 37000, 56500],
    collect: { golden: 14, pink: 14, jungle: 14, fire: 14, ice: 14, crystal: 14, cosmic: 14, prism: 14, shadow: 14 },
    intro: 'The ultimate summit! All frogs, all pineapples!',
  },
];

export function getLevel(id) {
  return LEVELS.find((l) => l.id === id);
}

export function levelsInWorld(worldId) {
  const w = WORLDS.find((x) => x.id === worldId);
  if (!w) return [];
  return LEVELS.filter((l) => l.id >= w.startId && l.id < w.startId + w.count);
}
