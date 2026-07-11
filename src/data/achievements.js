// Achievement definitions. `check(c)` derives unlocked state from the
// controller so we never have to hook every gameplay event.

export const ACHIEVEMENTS = [
  { id: 'firstPop', icon: 'pineapple', name: 'First Pop', desc: 'Clear level 1', check: (c) => c.starsFor(1) > 0 },
  { id: 'stars30', icon: 'star', name: 'Star Gatherer', desc: 'Earn 30 stars', check: (c) => c.totalStars() >= 30 },
  { id: 'stars100', icon: 'star', name: 'Star Hoarder', desc: 'Earn 100 stars', check: (c) => c.totalStars() >= 100 },
  { id: 'stars300', icon: 'sparkle', name: 'Superstar', desc: 'Earn all 300 stars', check: (c) => c.totalStars() >= 300 },
  { id: 'world5', icon: 'globe', name: 'Globe Hopper', desc: 'Reach the Prism Realm', check: (c) => c.levelsCompleted() >= 75 },
  { id: 'rich', icon: 'coin', name: 'Deep Pockets', desc: 'Save up 1,000 coins', check: (c) => c.coins >= 1000 },
  { id: 'collector', icon: 'bag', name: 'Well Equipped', desc: 'Own 5 power-ups', check: (c) => Object.keys(c.saveData.owned).length >= 5 },
  { id: 'loaded', icon: 'shop', name: 'Fully Loaded', desc: 'Equip 4 power-ups', check: (c) => c.loadout.length >= 4 },
  { id: 'endless20k', icon: 'endless', name: 'Endless Ace', desc: 'Score 20,000 in Endless', check: (c) => c.saveData.endless.best >= 20000 },
  { id: 'time8k', icon: 'bolt', name: 'Speed Demon', desc: 'Score 8,000 in Time Trial', check: (c) => c.saveData.timetrial.best >= 8000 },
  { id: 'daily', icon: 'daily', name: 'Daily Devotee', desc: 'Play a Daily Challenge', check: (c) => !!c.saveData.daily.played },
  { id: 'allWorlds', icon: 'crown', name: 'Champion', desc: 'Clear all 100 levels', check: (c) => c.levelsCompleted() >= 100 },
];
