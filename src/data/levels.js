export const WORLDS = [
  { id: 1, name: 'Sunny Shores', frog: 'sprig', unlockLevels: 0, startId: 1, count: 20 },
  { id: 2, name: 'Crystal Depths', frog: 'crystal', unlockLevels: 15, startId: 21, count: 20 },
  { id: 3, name: 'Ember Wilds', frog: 'ruby', unlockLevels: 35, startId: 41, count: 20 },
  { id: 4, name: 'Cosmic Summit', frog: 'merlin', unlockLevels: 55, startId: 61, count: 20 },
  { id: 5, name: 'Prism Realm', frog: 'sparkle', unlockLevels: 75, startId: 81, count: 20 },
];

export function getWorld(levelId) {
  return WORLDS.find((w) => levelId >= w.startId && levelId < w.startId + w.count) || WORLDS[0];
}

export const LEVELS = [

  // ── World 1: Sunny Shores (levels 1–20) ──
  { id:1, name:"Sandy Start", frog:"sprig", moves:26, stars:[5100,5700,6300], collect:{golden:10} },
  { id:2, name:"Shell Beach", frog:"sprig", moves:26, stars:[4600,5100,5600], collect:{pink:9} },
  { id:3, name:"Palm Row", frog:"sprig", moves:26, stars:[5000,5700,6200], collect:{ice:11} },
  { id:4, name:"Sunny Shoreline", frog:"sprig", moves:25, stars:[5100,5600,6100], collect:{fire:12} },
  { id:5, name:"Coconut Cove", frog:"scout", moves:25, stars:[5300,5900,6500], collect:{golden:15} },
  { id:6, name:"Coral Inlet", frog:"scout", moves:25, stars:[5600,6100,6600], collect:{pink:13} },
  { id:7, name:"Treasure Isle", frog:"scout", moves:25, stars:[5000,5400,6000], collect:{ice:12} },
  { id:8, name:"Surf Point", frog:"ruby", moves:25, stars:[5600,6200,6700], collect:{fire:14} },
  { id:9, name:"Driftwood Beach", frog:"ruby", moves:24, stars:[5300,5800,6700], collect:{golden:15} },
  { id:10, name:"Sandbar Crossing", frog:"ruby", moves:24, stars:[5900,6800,7500], collect:{pink:18} },
  { id:11, name:"Lighthouse Key", frog:"goldie", moves:24, stars:[5700,6400,7000], collect:{ice:8,fire:8} },
  { id:12, name:"Seafoam Bay", frog:"goldie", moves:24, stars:[5700,6300,7100], collect:{fire:8,golden:7} },
  { id:13, name:"Pelican Rock", frog:"goldie", moves:23, stars:[5700,6200,6900], collect:{golden:9,pink:9} },
  { id:14, name:"Mermaid Lagoon", frog:"crystal", moves:23, stars:[5600,6200,7000], collect:{pink:9,ice:9} },
  { id:15, name:"Sunken Skiff", frog:"crystal", moves:23, stars:[6200,7000,7800], collect:{ice:11,fire:10} },
  { id:16, name:"Anchor Isle", frog:"crystal", moves:23, stars:[6200,6900,7400], collect:{fire:10,golden:9} },
  { id:17, name:"Whirlpool Pass", frog:"merlin", moves:23, stars:[5500,6300,7100], collect:{golden:9,pink:9} },
  { id:18, name:"Shipwreck Shore", frog:"merlin", moves:22, stars:[6100,7100,7800], collect:{pink:11,ice:10} },
  { id:19, name:"Tidepool Terrace", frog:"merlin", moves:22, stars:[6100,6800,7600], collect:{ice:11,fire:10} },
  { id:20, name:"Paradise Pier", frog:"sprig", moves:22, stars:[6200,7300,8200], collect:{fire:12,golden:12} },

  // ── World 2: Crystal Depths (levels 21–40) ──
  { id:21, name:"Crystal Cove", frog:"crystal", moves:25, stars:[5900,6800,7600], collect:{crystal:8,frost:8} },
  { id:22, name:"Frosty Fjord", frog:"crystal", moves:25, stars:[5900,6600,7200], collect:{frost:8,pearl:7} },
  { id:23, name:"Glacier Gate", frog:"crystal", moves:25, stars:[6000,6600,7300], collect:{pearl:9,aqua:8} },
  { id:24, name:"Pearl Grotto", frog:"jade", moves:24, stars:[5900,6500,7400], collect:{aqua:9,crystal:9} },
  { id:25, name:"Aqua Atoll", frog:"jade", moves:24, stars:[6600,7200,8100], collect:{crystal:11,frost:10} },
  { id:26, name:"Crystal Canyon", frog:"jade", moves:24, stars:[6300,7000,7600], collect:{frost:10,pearl:9} },
  { id:27, name:"Frostfall Cave", frog:"sparkle", moves:24, stars:[5800,6400,7100], collect:{pearl:9,aqua:9} },
  { id:28, name:"Abyss Lookout", frog:"sparkle", moves:24, stars:[6500,7200,7700], collect:{aqua:10,crystal:10} },
  { id:29, name:"Pearl Dive", frog:"sparkle", moves:23, stars:[6500,7300,7800], collect:{crystal:11,frost:10} },
  { id:30, name:"Trench Run", frog:"shadow", moves:23, stars:[6500,7000,8100], collect:{frost:12,pearl:12} },
  { id:31, name:"Icy Inlet", frog:"shadow", moves:23, stars:[7100,7700,8600], collect:{pearl:8,aqua:7,crystal:7} },
  { id:32, name:"Aquifer Abyss", frog:"shadow", moves:23, stars:[7100,7600,8300], collect:{aqua:7,crystal:7,frost:7} },
  { id:33, name:"Frost Geode", frog:"merlin", moves:22, stars:[6700,7700,8600], collect:{crystal:8,frost:8,pearl:8} },
  { id:34, name:"Deepwater Dome", frog:"merlin", moves:22, stars:[6600,7400,8500], collect:{frost:8,pearl:8,aqua:8} },
  { id:35, name:"Glacier Maw", frog:"merlin", moves:22, stars:[6600,7400,8100], collect:{pearl:9,aqua:9,crystal:9} },
  { id:36, name:"Brine Basin", frog:"nova", moves:22, stars:[6700,7400,8300], collect:{aqua:9,crystal:8,frost:8} },
  { id:37, name:"Shard Spire", frog:"nova", moves:22, stars:[6800,7600,8100], collect:{crystal:8,frost:8,pearl:8} },
  { id:38, name:"Black Ice Cavern", frog:"nova", moves:21, stars:[6500,7500,8500], collect:{frost:9,pearl:9,aqua:9} },
  { id:39, name:"Subzero Sanctum", frog:"crystal", moves:21, stars:[6500,7500,8900], collect:{pearl:9,aqua:9,crystal:9} },
  { id:40, name:"Crystal Throne", frog:"crystal", moves:21, stars:[7300,8200,9000], collect:{aqua:10,crystal:10,frost:10} },

  // ── World 3: Ember Wilds (levels 41–60) ──
  { id:41, name:"Ember Approach", frog:"blaze", moves:24, stars:[7000,8100,8800], collect:{ember:11,wild:11} },
  { id:42, name:"Wild Thicket", frog:"blaze", moves:24, stars:[6900,7700,8300], collect:{wild:11,spice:10} },
  { id:43, name:"Spice Road", frog:"blaze", moves:24, stars:[6800,7600,8600], collect:{spice:12,thorn:11} },
  { id:44, name:"Thorn Hollow", frog:"ruby", moves:23, stars:[6700,7500,8300], collect:{thorn:12,ember:12} },
  { id:45, name:"Blaze Ridge", frog:"ruby", moves:23, stars:[7500,8400,9400], collect:{ember:13,wild:13} },
  { id:46, name:"Ashen Field", frog:"ruby", moves:23, stars:[7100,8300,8900], collect:{wild:13,spice:12} },
  { id:47, name:"Cinder Peak", frog:"shadow", moves:23, stars:[6700,7400,8600], collect:{spice:12,thorn:11} },
  { id:48, name:"Magma Flow", frog:"shadow", moves:23, stars:[7600,8500,9800], collect:{thorn:13,ember:13} },
  { id:49, name:"Scorched Gulch", frog:"shadow", moves:22, stars:[7200,8500,9300], collect:{ember:13,wild:13} },
  { id:50, name:"Lava Cascade", frog:"blaze", moves:22, stars:[7400,8200,9100], collect:{wild:15,spice:14} },
  { id:51, name:"Smoldering Bog", frog:"jade", moves:22, stars:[6500,7400,8800], collect:{spice:9,thorn:9,ember:9} },
  { id:52, name:"Brimstone Basin", frog:"jade", moves:22, stars:[6800,7800,8500], collect:{thorn:9,ember:9,wild:8} },
  { id:53, name:"Volcanic Vent", frog:"jade", moves:21, stars:[7100,8200,9100], collect:{ember:10,wild:9,spice:9} },
  { id:54, name:"Sulfur Springs", frog:"sparkle", moves:21, stars:[7400,8300,9200], collect:{wild:10,spice:10,thorn:9} },
  { id:55, name:"Firestorm Pass", frog:"sparkle", moves:21, stars:[7500,8700,9700], collect:{spice:11,thorn:10,ember:10} },
  { id:56, name:"Pyroclasm Plain", frog:"sparkle", moves:21, stars:[7600,8600,9700], collect:{thorn:10,ember:10,wild:10} },
  { id:57, name:"Ember Caldera", frog:"ruby", moves:21, stars:[7200,8300,9300], collect:{ember:10,wild:9,spice:9} },
  { id:58, name:"Inferno Gate", frog:"ruby", moves:20, stars:[7700,8600,9300], collect:{wild:11,spice:10,thorn:10} },
  { id:59, name:"Core Depths", frog:"blaze", moves:20, stars:[7400,8500,9400], collect:{spice:11,thorn:10,ember:10} },
  { id:60, name:"Magma Throne", frog:"blaze", moves:20, stars:[7600,8600,9700], collect:{thorn:12,ember:11,wild:11} },

  // ── World 4: Cosmic Summit (levels 61–80) ──
  { id:61, name:"Starfall Path", frog:"merlin", moves:23, stars:[7100,8200,9000], collect:{cosmic:9,stellar:9,lunar:8} },
  { id:62, name:"Lunar Meadow", frog:"merlin", moves:23, stars:[7300,8400,9200], collect:{stellar:9,lunar:8,nova:8} },
  { id:63, name:"Nova Crest", frog:"nova", moves:23, stars:[6800,7700,8600], collect:{lunar:9,nova:9,cosmic:9} },
  { id:64, name:"Eclipse Vale", frog:"nova", moves:22, stars:[7200,8100,9000], collect:{nova:10,cosmic:9,stellar:9} },
  { id:65, name:"Cosmic Ridge", frog:"nova", moves:22, stars:[7400,8500,9400], collect:{cosmic:10,stellar:10,lunar:10} },
  { id:66, name:"Stellar Plateau", frog:"crystal", moves:22, stars:[7300,8200,9200], collect:{stellar:10,lunar:10,nova:9} },
  { id:67, name:"Lunar Crater", frog:"crystal", moves:22, stars:[6600,7400,8300], collect:{lunar:9,nova:9,cosmic:9} },
  { id:68, name:"Nova Burst", frog:"crystal", moves:22, stars:[7900,8700,10000], collect:{nova:10,cosmic:10,stellar:10} },
  { id:69, name:"Eclipse Shadow", frog:"shadow", moves:21, stars:[7800,8800,9700], collect:{cosmic:10,stellar:10,lunar:10} },
  { id:70, name:"Astral Plain", frog:"shadow", moves:21, stars:[7700,9100,10100], collect:{stellar:11,lunar:11,nova:11} },
  { id:71, name:"Comet Trail", frog:"shadow", moves:21, stars:[7600,8500,9300], collect:{lunar:8,nova:8,cosmic:8,stellar:7} },
  { id:72, name:"Moonrise Point", frog:"merlin", moves:21, stars:[7700,8500,9300], collect:{nova:8,cosmic:8,stellar:7,lunar:7} },
  { id:73, name:"Nova Plateau", frog:"merlin", moves:20, stars:[7400,8400,9300], collect:{cosmic:8,stellar:8,lunar:8,nova:8} },
  { id:74, name:"Starforge", frog:"nova", moves:20, stars:[7300,8300,9400], collect:{stellar:9,lunar:8,nova:8,cosmic:8} },
  { id:75, name:"Cosmic Gate", frog:"nova", moves:20, stars:[7400,8300,8900], collect:{lunar:9,nova:9,cosmic:9,stellar:8} },
  { id:76, name:"Orbit Ring", frog:"nova", moves:20, stars:[7100,8000,8700], collect:{nova:9,cosmic:9,stellar:8,lunar:8} },
  { id:77, name:"Celestial Spire", frog:"sparkle", moves:20, stars:[7100,8200,9000], collect:{cosmic:8,stellar:8,lunar:8,nova:8} },
  { id:78, name:"Nebula Garden", frog:"sparkle", moves:19, stars:[7100,8300,9300], collect:{stellar:9,lunar:9,nova:9,cosmic:8} },
  { id:79, name:"Galaxy Core", frog:"merlin", moves:19, stars:[6800,8000,8900], collect:{lunar:9,nova:9,cosmic:9,stellar:8} },
  { id:80, name:"Cosmic Throne", frog:"merlin", moves:19, stars:[7700,9000,9700], collect:{nova:8,cosmic:8,stellar:8,lunar:7,prism:7} },

  // ── World 5: Prism Realm (levels 81–100) ──
  { id:81, name:"Prism Gate", frog:"sparkle", moves:22, stars:[7900,8800,9500], collect:{prism:10,shimmer:10,gleam:10} },
  { id:82, name:"Gleam Glade", frog:"sparkle", moves:22, stars:[7400,8300,9200], collect:{shimmer:10,gleam:9,aurora:9} },
  { id:83, name:"Shimmer Dale", frog:"crystal", moves:22, stars:[7600,8500,9800], collect:{gleam:11,aurora:10,prism:10} },
  { id:84, name:"Aurora Field", frog:"crystal", moves:21, stars:[7500,8800,9300], collect:{aurora:11,prism:10,shimmer:10} },
  { id:85, name:"Rainbow Rise", frog:"crystal", moves:21, stars:[7800,8800,9800], collect:{prism:12,shimmer:11,gleam:11} },
  { id:86, name:"Glimmer Grotto", frog:"nova", moves:21, stars:[7600,8800,9800], collect:{shimmer:11,gleam:11,aurora:10} },
  { id:87, name:"Prism Falls", frog:"nova", moves:21, stars:[7300,8300,9300], collect:{gleam:11,aurora:10,prism:10} },
  { id:88, name:"Shimmering Peak", frog:"nova", moves:21, stars:[7800,8700,9700], collect:{aurora:11,prism:11,shimmer:11} },
  { id:89, name:"Gleaming Vale", frog:"ruby", moves:20, stars:[7600,8500,9500], collect:{prism:11,shimmer:11,gleam:11} },
  { id:90, name:"Aurora Summit", frog:"ruby", moves:20, stars:[7800,8600,9500], collect:{shimmer:12,gleam:12,aurora:12} },
  { id:91, name:"Crystal Prism", frog:"ruby", moves:20, stars:[7400,8200,9000], collect:{gleam:9,aurora:9,prism:8,shimmer:8} },
  { id:92, name:"Shimmering Spire", frog:"jade", moves:20, stars:[7300,8000,8500], collect:{aurora:9,prism:8,shimmer:8,gleam:8} },
  { id:93, name:"Aurora Borealis", frog:"jade", moves:19, stars:[7200,8200,9200], collect:{prism:9,shimmer:9,gleam:9,aurora:8} },
  { id:94, name:"Prism Basin", frog:"jade", moves:19, stars:[7000,8300,9200], collect:{shimmer:9,gleam:9,aurora:9,prism:8} },
  { id:95, name:"Gleam Canyon", frog:"shadow", moves:19, stars:[7600,8600,9500], collect:{gleam:10,aurora:10,prism:9,shimmer:9} },
  { id:96, name:"Shimmering Depths", frog:"shadow", moves:19, stars:[7200,8000,8900], collect:{aurora:9,prism:9,shimmer:9,gleam:9} },
  { id:97, name:"Prism Cascade", frog:"shadow", moves:19, stars:[7000,7600,8900], collect:{prism:9,shimmer:9,gleam:9,aurora:8} },
  { id:98, name:"Aurora Garden", frog:"sparkle", moves:18, stars:[7600,8600,9700], collect:{shimmer:10,gleam:9,aurora:9,prism:9} },
  { id:99, name:"Rainbow Peak", frog:"sparkle", moves:18, stars:[8000,8800,9400], collect:{gleam:10,aurora:10,prism:9,shimmer:9} },
  { id:100, name:"Prism Throne", frog:"sparkle", moves:18, stars:[7700,8600,9900], collect:{aurora:9,prism:9,shimmer:8,gleam:8,glimmer:8} },
];

export function getLevel(id) {
  return LEVELS.find((l) => l.id === id);
}

export function levelsInWorld(worldId) {
  const w = WORLDS.find((x) => x.id === worldId);
  if (!w) return [];
  return LEVELS.filter((l) => l.id >= w.startId && l.id < w.startId + w.count);
}
