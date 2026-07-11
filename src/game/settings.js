// Applies persisted settings to the running app (audio mute + motion).
import { Sound } from './effects/Sound.js';

export function applySettings(controller) {
  const s = controller.settings;
  // sound: keep Sound.muted (+ its own persisted flag) in sync
  Sound.muted = !s.sound;
  try { localStorage.setItem('frogapop.muted', Sound.muted ? '1' : '0'); } catch { /* ignore */ }
  // reduced motion: a body class the CSS honours
  document.body.classList.toggle('reduce-motion', !s.motion);
}
