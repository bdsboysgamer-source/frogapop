// Settings — audio, motion, account (optional, for online leaderboards),
// and reset. Accounts have no login timeout: the token is stored locally
// forever. Playing never requires an account.

import { Sound } from '../../game/effects/Sound.js';
import { createAccount, isOnlineAvailable } from '../../net/leaderboard.js';
import { applySettings } from '../../game/settings.js';

export function mountSettings(stage, controller) {
  const el = document.createElement('div');
  el.className = 'screen sheet-screen';
  stage.appendChild(el);

  function render() {
    const s = controller.settings;
    const acct = controller.account;
    el.innerHTML = `
      <div class="sheet-bg"></div>
      <div class="sheet-header">
        <button class="btn btn-blue btn-round" id="backBtn">←</button>
        <div class="sheet-title">Settings</div>
        <div style="width:52px;"></div>
      </div>
      <div class="sheet-body">
        <div class="panel">
          <div class="panel-title">Audio & Motion</div>
          ${toggleRow('sound', '🔊 Sound effects', s.sound)}
          ${toggleRow('music', '🎵 Music', s.music)}
          ${toggleRow('motion', '✨ Animations', s.motion)}
        </div>

        <div class="panel">
          <div class="panel-title">Account <span class="panel-note">for online leaderboards</span></div>
          ${acct ? `
            <div class="acct-row">
              <div class="acct-name">👤 ${acct.name}${acct.token ? '' : ' <span class="acct-local">(local)</span>'}</div>
              <button class="btn btn-pink btn-small" id="signOut">Sign out</button>
            </div>
            <div class="panel-note">You can post scores to the global boards. No login ever expires.</div>
          ` : `
            <div class="acct-note">Play freely without an account — you only need one to post to the <b>global</b> leaderboards.</div>
            <div class="acct-form">
              <input id="nameInput" class="text-input" maxlength="16" placeholder="Choose a name" autocomplete="off" />
              <button class="btn btn-green btn-small" id="createBtn">Create</button>
            </div>
            <div class="acct-msg" id="acctMsg"></div>
          `}
        </div>

        <div class="panel">
          <div class="panel-title">Progress</div>
          <button class="btn btn-pink" id="resetBtn" style="width:100%;">↺ Reset all progress</button>
        </div>
      </div>
    `;

    el.querySelector('#backBtn').addEventListener('click', () => { Sound.button(); controller.gotoMenu(); });

    el.querySelectorAll('[data-toggle]').forEach((t) => t.addEventListener('click', () => {
      const k = t.dataset.toggle;
      const v = !controller.settings[k];
      controller.setSetting(k, v);
      applySettings(controller);
      if (k === 'sound' && v) Sound.button();
      render();
    }));

    const createBtn = el.querySelector('#createBtn');
    if (createBtn) createBtn.addEventListener('click', async () => {
      const input = el.querySelector('#nameInput');
      const msg = el.querySelector('#acctMsg');
      const name = input.value.trim();
      if (!/^[A-Za-z0-9 _-]{3,16}$/.test(name)) { msg.textContent = 'Name must be 3–16 letters/numbers.'; return; }
      Sound.button();
      createBtn.textContent = '…'; createBtn.disabled = true;
      const online = await isOnlineAvailable();
      let acc = null;
      if (online) acc = await createAccount(name);
      if (!acc) acc = { name, token: null }; // local-only name until the backend is live
      controller.setAccount(acc);
      msg.textContent = online && acc.token ? 'Account created!' : 'Saved locally (online boards will link once the server is live).';
      render();
    });

    el.querySelector('#signOut')?.addEventListener('click', () => { Sound.button(); controller.signOut(); render(); });

    el.querySelector('#resetBtn').addEventListener('click', () => {
      if (confirm('Reset ALL progress, coins and power-ups? This cannot be undone.')) {
        Sound.button();
        const acct2 = controller.account;
        controller.saveData = Object.assign(JSON.parse(JSON.stringify(controller.saveData)), {
          stars: {}, best: {}, coins: 0, owned: { stomp: true }, loadout: ['stomp'],
          endless: { best: 0 }, timetrial: { best: 0 }, daily: { date: null, best: 0, played: false },
          achievements: {},
        });
        controller.saveData.account = acct2; // keep account
        controller.persist();
        render();
      }
    });
  }

  function toggleRow(key, label, on) {
    return `<button class="toggle-row" data-toggle="${key}">
      <span>${label}</span>
      <span class="toggle ${on ? 'on' : ''}"><span class="knob"></span></span>
    </button>`;
  }

  render();
}
