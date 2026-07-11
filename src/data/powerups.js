// Power-up roster. All power-ups are bought with coins at Scai's stall
// and equipped into a loadout of up to 4. During a level each equipped
// power-up charges from play and can be fired when full.
//
// `charge` = how much charge energy is needed to fill the meter (higher
// = stronger / slower to charge). `method` maps to a BoardView.playX().

export const LOADOUT_SIZE = 4;

export const POWERUPS = {
  stomp: {
    id: 'stomp', name: 'Froggy Stomp', icon: '🐸', price: 0, charge: 60,
    method: 'stomp', tint: '#57c96b', starter: true,
    blurb: 'A mighty frog hops across the board and stomps 9 tiles flat.',
  },
  shuffle: {
    id: 'shuffle', name: 'Big Shuffle', icon: '🔀', price: 300, charge: 55,
    method: 'shuffle', tint: '#5aa8e6',
    blurb: 'Shake up the whole board when you run out of good moves.',
  },
  swap: {
    id: 'swap', name: 'Color Swap', icon: '🔄', price: 500, charge: 70,
    method: 'swap', tint: '#f0b429',
    blurb: 'Turn every tile of one kind into another — instant combos.',
  },
  lily: {
    id: 'lily', name: 'Lily Bomb', icon: '💣', price: 600, charge: 75,
    method: 'lily', tint: '#ef6aa8',
    blurb: 'Lob a lily bomb that blasts a 3×3 crater in the board.',
  },
  cross: {
    id: 'cross', name: 'Cross Strike', icon: '✳️', price: 750, charge: 80,
    method: 'cross', tint: '#7be0ff',
    blurb: 'Zap a full row and a full column at the same time.',
  },
  clear: {
    id: 'clear', name: 'Big Vanish', icon: '✨', price: 700, charge: 80,
    method: 'clear', tint: '#c79bff',
    blurb: 'Vanish every tile of the most common kind on the board.',
  },
  tide: {
    id: 'tide', name: 'Tidal Wave', icon: '🌊', price: 900, charge: 85,
    method: 'tide', tint: '#3fb9d6',
    blurb: 'A wave sweeps in and washes away two whole rows.',
  },
  rainbow: {
    id: 'rainbow', name: 'Rainbow Rush', icon: '🌈', price: 1100, charge: 95,
    method: 'rainbow', tint: '#ff6a8a',
    blurb: 'Charm an entire color into dazzling rainbow pineapples.',
  },
};

// display order on Scai's stall
export const POWERUP_ORDER = ['stomp', 'shuffle', 'swap', 'lily', 'cross', 'clear', 'tide', 'rainbow'];

export function getPowerup(id) { return POWERUPS[id]; }
