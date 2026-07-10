// Boot: create the full-window stage and hand control to the
// GameController. Layout is responsive — scenery fills the window,
// game content lives in a centered column.

import { GameController } from './game/GameController.js';

const app = document.getElementById('app');
const stage = document.createElement('div');
stage.className = 'stage';
app.appendChild(stage);

const controller = new GameController(stage);
controller.gotoMenu();

// dev/debug handle (also used by automated smoke tests)
window.__frogapop = { controller };
