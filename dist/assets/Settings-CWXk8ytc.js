import{S as u,b as g,i as m,c as f}from"./index-CLZ6KYd-.js";function h(p,t){const e=document.createElement("div");e.className="screen sheet-screen",p.appendChild(e);function c(){var b;const o=t.settings,l=t.account;e.innerHTML=`
      <div class="sheet-bg"></div>
      <div class="sheet-header">
        <button class="btn btn-blue btn-round" id="backBtn">←</button>
        <div class="sheet-title">Settings</div>
        <div style="width:52px;"></div>
      </div>
      <div class="sheet-body">
        <div class="panel">
          <div class="panel-title">Audio & Motion</div>
          ${r("sound","🔊 Sound effects",o.sound)}
          ${r("music","🎵 Music",o.music)}
          ${r("motion","✨ Animations",o.motion)}
        </div>

        <div class="panel">
          <div class="panel-title">Account <span class="panel-note">for online leaderboards</span></div>
          ${l?`
            <div class="acct-row">
              <div class="acct-name">👤 ${l.name}${l.token?"":' <span class="acct-local">(local)</span>'}</div>
              <button class="btn btn-pink btn-small" id="signOut">Sign out</button>
            </div>
            <div class="panel-note">You can post scores to the global boards. No login ever expires.</div>
          `:`
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
    `,e.querySelector("#backBtn").addEventListener("click",()=>{u.button(),t.gotoMenu()}),e.querySelectorAll("[data-toggle]").forEach(n=>n.addEventListener("click",()=>{const a=n.dataset.toggle,i=!t.settings[a];t.setSetting(a,i),g(t),a==="sound"&&i&&u.button(),c()}));const s=e.querySelector("#createBtn");s&&s.addEventListener("click",async()=>{const n=e.querySelector("#nameInput"),a=e.querySelector("#acctMsg"),i=n.value.trim();if(!/^[A-Za-z0-9 _-]{3,16}$/.test(i)){a.textContent="Name must be 3–16 letters/numbers.";return}u.button(),s.textContent="…",s.disabled=!0;const v=await m();let d=null;v&&(d=await f(i)),d||(d={name:i,token:null}),t.setAccount(d),a.textContent=v&&d.token?"Account created!":"Saved locally (online boards will link once the server is live).",c()}),(b=e.querySelector("#signOut"))==null||b.addEventListener("click",()=>{u.button(),t.signOut(),c()}),e.querySelector("#resetBtn").addEventListener("click",()=>{if(confirm("Reset ALL progress, coins and power-ups? This cannot be undone.")){u.button();const n=t.account;t.saveData=Object.assign(JSON.parse(JSON.stringify(t.saveData)),{stars:{},best:{},coins:0,owned:{stomp:!0},loadout:["stomp"],endless:{best:0},timetrial:{best:0},daily:{date:null,best:0,played:!1},achievements:{}}),t.saveData.account=n,t.persist(),c()}})}function r(o,l,s){return`<button class="toggle-row" data-toggle="${o}">
      <span>${l}</span>
      <span class="toggle ${s?"on":""}"><span class="knob"></span></span>
    </button>`}c()}export{h as mountSettings};
