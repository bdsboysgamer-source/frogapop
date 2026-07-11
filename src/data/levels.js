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
  // ============================================================
  // WORLD 1 — Sunny Shores (levels 1–20)
  // Types: golden, pink, ice, fire, jungle + crystal bridge
  // ============================================================
  { id:1,  name:'Sandy Start',      frog:'sprig',  moves:24, stars:[1500,3000,5000],    collect:{golden:10} },
  { id:2,  name:'Shell Beach',      frog:'sprig',  moves:22, stars:[2000,4000,6500],    collect:{pink:12,golden:8} },
  { id:3,  name:'Palm Row',         frog:'sprig',  moves:22, stars:[2500,5000,8000],    collect:{jungle:14,ice:8} },
  { id:4,  name:'Sunny Shoreline',  frog:'sprig',  moves:20, stars:[3000,6000,9500],    collect:{ice:14} },
  { id:5,  name:'Coconut Cove',     frog:'scout',  moves:20, stars:[3500,7000,11000],   collect:{fire:12,golden:10} },
  { id:6,  name:'Coral Inlet',      frog:'scout',  moves:19, stars:[4000,8000,12500],   collect:{pink:14,jungle:10} },
  { id:7,  name:'Treasure Isle',    frog:'scout',  moves:19, stars:[4500,9000,14000],   collect:{golden:12,ice:8} },
  { id:8,  name:'Surf Point',       frog:'ruby',   moves:18, stars:[5000,10000,15500],  collect:{fire:14,pink:10} },
  { id:9,  name:'Driftwood Beach',  frog:'ruby',   moves:18, stars:[5500,11000,17000],  collect:{jungle:14,ice:10} },
  { id:10, name:'Sandbar Crossing', frog:'ruby',   moves:18, stars:[6000,12000,18500],  collect:{golden:12,fire:8,jungle:6} },
  { id:11, name:'Lighthouse Key',   frog:'goldie', moves:17, stars:[6500,13000,20000],  collect:{pink:14,golden:10} },
  { id:12, name:'Seafoam Bay',      frog:'goldie', moves:17, stars:[7000,14000,21500],  collect:{ice:12,fire:10,pink:6} },
  { id:13, name:'Pelican Rock',     frog:'goldie', moves:17, stars:[7500,15000,23000],  collect:{jungle:12,golden:10,ice:6} },
  { id:14, name:'Mermaid Lagoon',   frog:'crystal',moves:16, stars:[8000,16000,24500],  collect:{pink:12,fire:10,jungle:6} },
  { id:15, name:'Sunken Skiff',     frog:'crystal',moves:16, stars:[8500,17000,26000],  collect:{golden:10,ice:10,pink:8} },
  { id:16, name:'Anchor Isle',      frog:'crystal',moves:16, stars:[9000,18000,27500],  collect:{fire:12,jungle:10,golden:6} },
  { id:17, name:'Whirlpool Pass',   frog:'merlin', moves:15, stars:[9500,19000,29000],  collect:{ice:10,golden:8,jungle:8,pink:6} },
  { id:18, name:'Shipwreck Shore',  frog:'merlin', moves:15, stars:[10000,20000,30500], collect:{fire:10,pink:10,ice:8} },
  { id:19, name:'Tidepool Terrace', frog:'merlin', moves:15, stars:[10500,21000,32000], collect:{golden:8,jungle:8,fire:8,ice:6} },
  { id:20, name:'Paradise Pier',    frog:'sprig',  moves:14, stars:[11000,22000,33500], collect:{pink:10,golden:8,jungle:8,fire:6} },

  // ============================================================
  // WORLD 2 — Crystal Depths (levels 21–40)
  // Types: crystal, frost, pearl, aqua, abyss + jungle/ember bridge
  // ============================================================
  { id:21, name:'Crystal Cove',     frog:'crystal',moves:22, stars:[8000,16000,25000],  collect:{crystal:12,frost:8} },
  { id:22, name:'Frosty Fjord',     frog:'crystal',moves:21, stars:[8500,17000,26500],  collect:{pearl:14,aqua:8} },
  { id:23, name:'Glacier Gate',     frog:'crystal',moves:21, stars:[9000,18000,28000],  collect:{frost:14,crystal:10} },
  { id:24, name:'Pearl Grotto',     frog:'jade',   moves:20, stars:[9500,19000,29500],  collect:{abyss:12,pearl:10} },
  { id:25, name:'Aqua Atoll',       frog:'jade',   moves:20, stars:[10000,20000,31000], collect:{aqua:14,crystal:8} },
  { id:26, name:'Crystal Canyon',   frog:'jade',   moves:19, stars:[10500,21000,32500], collect:{crystal:12,frost:10,pearl:6} },
  { id:27, name:'Frostfall Cave',   frog:'sparkle',moves:19, stars:[11000,22000,34000], collect:{frost:12,aqua:10,crystal:6} },
  { id:28, name:'Abyss Lookout',    frog:'sparkle',moves:18, stars:[11500,23000,35500], collect:{abyss:12,pearl:10,frost:6} },
  { id:29, name:'Pearl Dive',       frog:'sparkle',moves:18, stars:[12000,24000,37000], collect:{pearl:12,crystal:10,aqua:6} },
  { id:30, name:'Trench Run',       frog:'shadow', moves:18, stars:[12500,25000,38500], collect:{abyss:12,frost:8,crystal:8,pearl:4} },
  { id:31, name:'Icy Inlet',        frog:'shadow', moves:17, stars:[13000,26000,40000], collect:{crystal:12,aqua:8,frost:6} },
  { id:32, name:'Aquifer Abyss',    frog:'shadow', moves:17, stars:[13500,27000,41500], collect:{aqua:12,abyss:10,crystal:6} },
  { id:33, name:'Frost Geode',      frog:'merlin', moves:17, stars:[14000,28000,43000], collect:{frost:10,pearl:10,abyss:6} },
  { id:34, name:'Deepwater Dome',   frog:'merlin', moves:16, stars:[14500,29000,44500], collect:{pearl:10,crystal:8,aqua:8} },
  { id:35, name:'Glacier Maw',      frog:'merlin', moves:16, stars:[15000,30000,46000], collect:{crystal:10,frost:8,abyss:8} },
  { id:36, name:'Brine Basin',      frog:'nova',   moves:16, stars:[15500,31000,47500], collect:{aqua:10,abyss:10,pearl:6,frost:4} },
  { id:37, name:'Shard Spire',      frog:'nova',   moves:15, stars:[16000,32000,49000], collect:{crystal:10,frost:8,abyss:6,pearl:6} },
  { id:38, name:'Black Ice Cavern', frog:'nova',   moves:15, stars:[16500,33000,50500], collect:{abyss:10,aqua:8,frost:6,crystal:6} },
  { id:39, name:'Subzero Sanctum',  frog:'crystal',moves:15, stars:[17000,34000,52000], collect:{crystal:8,frost:8,pearl:8,aqua:6} },
  { id:40, name:'Crystal Throne',   frog:'crystal',moves:14, stars:[17500,35000,53500], collect:{pearl:8,abyss:8,crystal:6,aqua:6,frost:4} },

  // ============================================================
  // WORLD 3 — Ember Wilds (levels 41–60)
  // Types: ember, wild, spice, thorn, blaze + abyss/cosmic bridge
  // ============================================================
  { id:41, name:'Ember Approach',   frog:'blaze',  moves:20, stars:[12000,24000,37000], collect:{ember:12,wild:8} },
  { id:42, name:'Wild Thicket',     frog:'blaze',  moves:19, stars:[12500,25000,38500], collect:{spice:14,thorn:8} },
  { id:43, name:'Spice Road',       frog:'blaze',  moves:19, stars:[13000,26000,40000], collect:{blaze:12,ember:10} },
  { id:44, name:'Thorn Hollow',     frog:'ruby',   moves:18, stars:[13500,27000,41500], collect:{wild:14,spice:8} },
  { id:45, name:'Blaze Ridge',      frog:'ruby',   moves:18, stars:[14000,28000,43000], collect:{ember:12,thorn:10} },
  { id:46, name:'Ashen Field',      frog:'ruby',   moves:18, stars:[14500,29000,44500], collect:{wild:12,blaze:10,spice:6} },
  { id:47, name:'Cinder Peak',      frog:'shadow', moves:17, stars:[15000,30000,46000], collect:{spice:12,ember:10,thorn:6} },
  { id:48, name:'Magma Flow',       frog:'shadow', moves:17, stars:[15500,31000,47500], collect:{blaze:12,wild:8,ember:6} },
  { id:49, name:'Scorched Gulch',   frog:'shadow', moves:17, stars:[16000,32000,49000], collect:{thorn:12,spice:8,wild:6} },
  { id:50, name:'Lava Cascade',     frog:'blaze',  moves:16, stars:[16500,33000,50500], collect:{ember:10,blaze:8,thorn:8,spice:4} },
  { id:51, name:'Smoldering Bog',   frog:'jade',   moves:16, stars:[17000,34000,52000], collect:{wild:10,spice:8,ember:6} },
  { id:52, name:'Brimstone Basin',  frog:'jade',   moves:16, stars:[17500,35000,53500], collect:{blaze:10,thorn:8,wild:6} },
  { id:53, name:'Volcanic Vent',    frog:'jade',   moves:15, stars:[18000,36000,55000], collect:{ember:8,wild:8,blaze:8} },
  { id:54, name:'Sulfur Springs',   frog:'sparkle',moves:15, stars:[18500,37000,56500], collect:{spice:10,thorn:8,ember:6} },
  { id:55, name:'Firestorm Pass',   frog:'sparkle',moves:15, stars:[19000,38000,58000], collect:{blaze:10,wild:8,spice:6} },
  { id:56, name:'Pyroclasm Plain',  frog:'sparkle',moves:14, stars:[19500,39000,59500], collect:{thorn:8,wild:8,ember:6,blaze:6} },
  { id:57, name:'Ember Caldera',    frog:'ruby',   moves:14, stars:[20000,40000,61000], collect:{ember:8,blaze:8,spice:6,thorn:6} },
  { id:58, name:'Inferno Gate',     frog:'ruby',   moves:14, stars:[20500,41000,62500], collect:{wild:8,spice:6,thorn:6,ember:6} },
  { id:59, name:'Core Depths',      frog:'blaze',  moves:13, stars:[21000,42000,64000], collect:{blaze:8,ember:6,wild:6,thorn:6} },
  { id:60, name:'Magma Throne',     frog:'blaze',  moves:13, stars:[21500,43000,65500], collect:{ember:8,blaze:8,spice:6,wild:6,thorn:4} },

  // ============================================================
  // WORLD 4 — Cosmic Summit (levels 61–80)
  // Types: cosmic, stellar, lunar, nova, eclipse + blaze/prism bridge
  // ============================================================
  { id:61, name:'Starfall Path',    frog:'merlin', moves:18, stars:[16000,32000,49000], collect:{cosmic:12,stellar:8} },
  { id:62, name:'Lunar Meadow',     frog:'merlin', moves:18, stars:[16500,33000,50500], collect:{lunar:14,nova:8} },
  { id:63, name:'Nova Crest',       frog:'nova',   moves:17, stars:[17000,34000,52000], collect:{eclipse:12,cosmic:10} },
  { id:64, name:'Eclipse Vale',     frog:'nova',   moves:17, stars:[17500,35000,53500], collect:{stellar:12,lunar:10} },
  { id:65, name:'Cosmic Ridge',     frog:'nova',   moves:17, stars:[18000,36000,55000], collect:{nova:12,eclipse:8,cosmic:6} },
  { id:66, name:'Stellar Plateau',  frog:'crystal',moves:16, stars:[18500,37000,56500], collect:{cosmic:10,lunar:10,stellar:6} },
  { id:67, name:'Lunar Crater',     frog:'crystal',moves:16, stars:[19000,38000,58000], collect:{nova:10,eclipse:8,cosmic:6} },
  { id:68, name:'Nova Burst',       frog:'crystal',moves:16, stars:[19500,39000,59500], collect:{stellar:10,lunar:8,nova:6} },
  { id:69, name:'Eclipse Shadow',   frog:'shadow', moves:15, stars:[20000,40000,61000], collect:{eclipse:10,cosmic:8,stellar:6} },
  { id:70, name:'Astral Plain',     frog:'shadow', moves:15, stars:[20500,41000,62500], collect:{nova:10,lunar:8,cosmic:6,eclipse:4} },
  { id:71, name:'Comet Trail',      frog:'shadow', moves:15, stars:[21000,42000,64000], collect:{cosmic:8,stellar:8,lunar:6,nova:4} },
  { id:72, name:'Moonrise Point',   frog:'merlin', moves:14, stars:[21500,43000,65500], collect:{lunar:10,nova:8,eclipse:6} },
  { id:73, name:'Nova Plateau',     frog:'merlin', moves:14, stars:[22000,44000,67000], collect:{stellar:8,cosmic:8,nova:6} },
  { id:74, name:'Starforge',        frog:'nova',   moves:14, stars:[22500,45000,68500], collect:{eclipse:8,cosmic:6,lunar:6,stellar:6} },
  { id:75, name:'Cosmic Gate',      frog:'nova',   moves:13, stars:[23000,46000,70000], collect:{cosmic:8,nova:8,lunar:6} },
  { id:76, name:'Orbit Ring',       frog:'nova',   moves:13, stars:[23500,47000,71500], collect:{stellar:8,eclipse:6,cosmic:6,nova:4} },
  { id:77, name:'Celestial Spire',  frog:'sparkle',moves:13, stars:[24000,48000,73000], collect:{nova:8,lunar:6,stellar:6,cosmic:4} },
  { id:78, name:'Nebula Garden',    frog:'sparkle',moves:12, stars:[24500,49000,74500], collect:{cosmic:6,stellar:6,lunar:6,eclipse:6} },
  { id:79, name:'Galaxy Core',      frog:'merlin', moves:12, stars:[25000,50000,76000], collect:{eclipse:8,cosmic:6,nova:6,stellar:4} },
  { id:80, name:'Cosmic Throne',    frog:'merlin', moves:12, stars:[25500,51000,77500], collect:{cosmic:8,stellar:6,nova:6,lunar:6,eclipse:4} },

  // ============================================================
  // WORLD 5 — Prism Realm (levels 81–100)
  // Types: prism, shimmer, gleam, aurora, glimmer + nova bridge
  // ============================================================
  { id:81, name:'Prism Gate',       frog:'sparkle',moves:17, stars:[20000,40000,61000], collect:{prism:12,shimmer:8} },
  { id:82, name:'Gleam Glade',      frog:'sparkle',moves:16, stars:[20500,41000,62500], collect:{gleam:14,aurora:8} },
  { id:83, name:'Shimmer Dale',     frog:'crystal',moves:16, stars:[21000,42000,64000], collect:{glimmer:12,prism:10} },
  { id:84, name:'Aurora Field',     frog:'crystal',moves:16, stars:[21500,43000,65500], collect:{shimmer:12,gleam:10} },
  { id:85, name:'Rainbow Rise',     frog:'crystal',moves:15, stars:[22000,44000,67000], collect:{prism:10,aurora:10,glimmer:6} },
  { id:86, name:'Glimmer Grotto',   frog:'nova',   moves:15, stars:[22500,45000,68500], collect:{gleam:10,shimmer:8,prism:6} },
  { id:87, name:'Prism Falls',      frog:'nova',   moves:15, stars:[23000,46000,70000], collect:{aurora:10,glimmer:8,gleam:6} },
  { id:88, name:'Shimmering Peak',  frog:'nova',   moves:14, stars:[23500,47000,71500], collect:{prism:10,shimmer:8,aurora:6} },
  { id:89, name:'Gleaming Vale',    frog:'ruby',   moves:14, stars:[24000,48000,73000], collect:{gleam:10,glimmer:8,shimmer:6} },
  { id:90, name:'Aurora Summit',    frog:'ruby',   moves:14, stars:[24500,49000,74500], collect:{aurora:8,prism:8,gleam:6,glimmer:4} },
  { id:91, name:'Crystal Prism',    frog:'ruby',   moves:13, stars:[25000,50000,76000], collect:{prism:8,glimmer:8,shimmer:6} },
  { id:92, name:'Shimmering Spire', frog:'jade',   moves:13, stars:[25500,51000,77500], collect:{shimmer:8,gleam:6,aurora:6,prism:4} },
  { id:93, name:'Aurora Borealis',  frog:'jade',   moves:13, stars:[26000,52000,79000], collect:{aurora:8,glimmer:6,gleam:6,shimmer:4} },
  { id:94, name:'Prism Basin',      frog:'jade',   moves:12, stars:[26500,53000,80500], collect:{prism:8,shimmer:6,glimmer:6} },
  { id:95, name:'Gleam Canyon',     frog:'shadow', moves:12, stars:[27000,54000,82000], collect:{gleam:8,aurora:6,prism:4,glimmer:4} },
  { id:96, name:'Shimmering Depths',frog:'shadow', moves:12, stars:[27500,55000,83500], collect:{shimmer:6,glimmer:6,aurora:6,gleam:4} },
  { id:97, name:'Prism Cascade',    frog:'shadow', moves:11, stars:[28000,56000,85000], collect:{prism:6,aurora:6,glimmer:6,shimmer:4} },
  { id:98, name:'Aurora Garden',    frog:'sparkle',moves:11, stars:[28500,57000,86500], collect:{aurora:6,gleam:6,shimmer:6,prism:4} },
  { id:99, name:'Rainbow Peak',     frog:'sparkle',moves:11, stars:[29000,58000,88000], collect:{prism:8,glimmer:6,aurora:4,shimmer:4,gleam:4} },
  { id:100,name:'Prism Throne',     frog:'sparkle',moves:10, stars:[29500,59000,89500], collect:{prism:8,shimmer:6,gleam:6,aurora:6,glimmer:4} },
];

export function getLevel(id) {
  return LEVELS.find((l) => l.id === id);
}

export function levelsInWorld(worldId) {
  const w = WORLDS.find((x) => x.id === worldId);
  if (!w) return [];
  return LEVELS.filter((l) => l.id >= w.startId && l.id < w.startId + w.count);
}
