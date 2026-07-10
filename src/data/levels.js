// Level definitions. Adding a level here automatically adds a node
// to the island map. `stars` are score thresholds for 1/2/3 stars.
// `collect` objectives count pineapples of a species cleared.

export const LEVELS = [
  // === ACT 1: SUNNY SHORES (Sprig's domain) ===
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

  // === ACT 2: CRYSTAL CAVES (Crystal's domain) ===
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

  // === ACT 3: MYSTIC MARSH (Merlin's domain) ===
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

  // === ACT 4: JADE JUNGLE (Jade's domain) ===
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

  // === ACT 5: SPARKLING SHORES (Sparkle's domain) ===
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

  // === ACT 6: EMBER PEAK (Blaze's domain) ===
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
  {
    id: 21, name: 'Phoenix Nest', frog: 'blaze', moves: 15,
    stars: [11500, 23000, 35000],
    collect: { prism: 22, fire: 22, crystal: 14 },
    intro: 'A nest of rebirth, prism and fire!',
  },

  // === ACT 7: STELLAR PEAK (Nova's domain) ===
  {
    id: 22, name: 'Starlight Glade', frog: 'nova', moves: 16,
    stars: [12000, 24000, 36500],
    collect: { cosmic: 24, crystal: 20 },
    intro: 'Nova glows under the starlight!',
  },
  {
    id: 23, name: 'Comet Crossing', frog: 'nova', moves: 15,
    stars: [12500, 25000, 38000],
    collect: { cosmic: 20, prism: 20, shadow: 14 },
    intro: 'Comets blaze with cosmic and shadow power!',
  },
  {
    id: 24, name: 'Nebula Nook', frog: 'nova', moves: 15,
    stars: [13000, 26000, 39500],
    collect: { shadow: 24, cosmic: 18, jungle: 14 },
    intro: 'A nebula of shadow and cosmic pineapples!',
  },

  // === ACT 8: SHADOW DEPTHS (Shadow's domain - NEW FROG) ===
  {
    id: 25, name: 'Shadow Veil', frog: 'shadow', moves: 16,
    stars: [13500, 27000, 41000],
    collect: { shadow: 26, cosmic: 16 },
    intro: 'Shadow rises from the depths!',
  },
  {
    id: 26, name: 'Eclipse Pass', frog: 'shadow', moves: 15,
    stars: [14000, 28000, 42500],
    collect: { shadow: 20, prism: 20, ice: 14 },
    intro: 'Eclipse brings shadow and prism together!',
  },
  {
    id: 27, name: 'Midnight Hollow', frog: 'shadow', moves: 15,
    stars: [14500, 29000, 44000],
    collect: { shadow: 24, crystal: 20, pink: 14 },
    intro: 'The hollow echoes with shadow energy!',
  },

  // === ACT 9: PARADISE PEAK (All frogs unite) ===
  {
    id: 28, name: 'Harmony Isle', frog: 'sprig', moves: 14,
    stars: [15000, 30000, 45500],
    collect: { golden: 16, pink: 16, jungle: 16, crystal: 12 },
    intro: 'All pineapples unite in harmony!',
  },
  {
    id: 29, name: 'Rainbow Ridge', frog: 'ruby', moves: 14,
    stars: [15500, 31000, 47000],
    collect: { prism: 18, cosmic: 18, shadow: 14, fire: 14 },
    intro: 'Ruby finds the rainbow ridge of prism pines!',
  },
  {
    id: 30, name: 'Paradise Peak', frog: 'sprig', moves: 13,
    stars: [16000, 32000, 48500],
    collect: { golden: 14, pink: 14, jungle: 14, crystal: 14, cosmic: 14, prism: 14, shadow: 14 },
    intro: 'FINAL LEVEL! Collect EVERY pineapple to restore Paradise!',
  },
];

export function getLevel(id) {
  return LEVELS.find((l) => l.id === id);
}