// Small helper: HTML <img> for a pineapple piece, rendered from the
// procedural piece art cache. Used by HUD objectives, menus, and maps.

import { getPieceSprite } from '../../game/pieces/PieceArt.js';

const urlCache = new Map();

export function pieceIconURL(typeId, special = null) {
  const key = `${typeId}|${special ?? ''}`;
  if (!urlCache.has(key)) urlCache.set(key, getPieceSprite(typeId, special).toDataURL());
  return urlCache.get(key);
}

export function pieceIconHTML(typeId, size = 32, special = null) {
  return `<img src="${pieceIconURL(typeId, special)}" width="${size}" height="${size}" alt="${typeId}" draggable="false"/>`;
}
