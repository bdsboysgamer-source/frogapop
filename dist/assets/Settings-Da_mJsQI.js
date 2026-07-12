import{i as b,S as u,b as m,c as f,d as y}from"./index-DEI2rJDN.js";function S(g,t){const e=document.createElement("div");e.className="screen sheet-screen",g.appendChild(e);function o(){var r;const s=t.settings,l=t.account;e.innerHTML=`
      <div class="sheet-bg"></div>
      <div class="sheet-header">
        <button class="btn btn-blue btn-round" id="backBtn">${b("back",{size:26})}</button>
        <div class="sheet-title">Settings</div>
        <div style="width:52px;"></div>
      </div>
      <div class="sheet-body">
        <div class="panel">
          <div class="panel-title">Audio & Motion</div>
          ${v("sound",s.sound?"soundOn":"soundOff","Sound effects",s.sound)}
          ${v("music","music","Music",s.music)}
          ${v("motion","sparkle","Animations",s.motion)}
        </div>

        <div class="panel">
          <div class="panel-title">Account <span class="panel-note">for online leaderboards</span></div>
          ${l?`
            <div class="acct-row">
              <div class="acct-name">${b("account",{size:20})} ${l.name}${l.token?"":' <span class="acct-local">(local)</span>'}</div>
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
          <button class="btn btn-pink" id="resetBtn" style="width:100%;">${b("retry",{size:22})} Reset all progress</button>
        </div>
      </div>
    `,e.querySelector("#backBtn").addEventListener("click",()=>{u.button(),t.gotoMenu()}),e.querySelectorAll("[data-toggle]").forEach(a=>a.addEventListener("click",()=>{const i=a.dataset.toggle,c=!t.settings[i];t.setSetting(i,c),m(t),i==="sound"&&c&&u.button(),o()}));const n=e.querySelector("#createBtn");n&&n.addEventListener("click",async()=>{const a=e.querySelector("#nameInput"),i=e.querySelector("#acctMsg"),c=a.value.trim();if(!/^[A-Za-z0-9 _-]{3,16}$/.test(c)){i.textContent="Name must be 3–16 letters/numbers.";return}u.button(),n.textContent="…",n.disabled=!0;const p=await f();let d=null;p&&(d=await y(c)),d||(d={name:c,token:null}),t.setAccount(d),i.textContent=p&&d.token?"Account created!":"Saved locally (online boards will link once the server is live).",o()}),(r=e.querySelector("#signOut"))==null||r.addEventListener("click",()=>{u.button(),t.signOut(),o()}),e.querySelector("#resetBtn").addEventListener("click",()=>{if(confirm("Reset ALL progress, coins and power-ups? This cannot be undone.")){u.button();const a=t.account;t.saveData=Object.assign(JSON.parse(JSON.stringify(t.saveData)),{stars:{},best:{},coins:0,owned:{stomp:!0},loadout:["stomp"],endless:{best:0},timetrial:{best:0},daily:{date:null,best:0,played:!1},achievements:{}}),t.saveData.account=a,t.persist(),o()}})}function v(s,l,n,r){return`<button class="toggle-row" data-toggle="${s}">
      <span>${b(l,{size:22})}${n}</span>
      <span class="toggle ${r?"on":""}"><span class="knob"></span></span>
    </button>`}o()}export{S as mountSettings};
