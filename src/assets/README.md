# Assets

All art and audio in this prototype is **generated at runtime**:

- `images/` — pineapple pieces are drawn procedurally in
  `src/game/pieces/PieceArt.js` (canvas, cached at 2× resolution);
  frogs in `src/components/characters/FrogArt.js` (parametric SVG).
  Drop real PNG/SVG exports here later and point those modules at them.
- `sounds/` — every SFX is synthesized with WebAudio in
  `src/game/effects/Sound.js`. Each named event (`pop`, `bomb`,
  `rainbow`, `ribbit`, …) is one function — replace the body with a
  sample player to swap in recorded audio.
- `animations/` — motion lives in CSS keyframes (`src/styles/main.css`)
  and the tween/physics systems in `src/game/board/BoardView.js`.

Keeping generators instead of binaries keeps the repo tiny and every
visual tweakable in code review.
