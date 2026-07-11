import{L as c,f,P as $,a as u,S as n}from"./index-CLZ6KYd-.js";function E(v,t){const e=document.createElement("div");e.className="screen shop-screen",v.appendChild(e);function o(){const i=t.loadout.length;e.innerHTML=`
      <div class="shop-bg"></div>
      <div class="shop-header">
        <button class="btn btn-blue btn-round" id="backBtn">←</button>
        <div class="shop-title">Scai's Stall</div>
        <div class="coin-chip big">🪙 <b>${t.coins}</b></div>
      </div>

      <div class="stall">
        <div class="stall-roof"></div>
        <div class="stall-keeper">
          ${f("scout",{width:118})}
          <div class="stall-sign">Scai</div>
        </div>
        <div class="stall-counter">
          <div class="counter-rail" id="rail">
            ${$.map(s=>r(s)).join("")}
          </div>
        </div>
      </div>

      <div class="loadout-bar">
        <span class="loadout-label">Loadout ${i}/${c}</span>
        <div class="loadout-slots">
          ${[...Array(c)].map((s,a)=>{const d=t.loadout[a];return d?`<div class="lo-slot filled" style="--ptint:${u[d].tint}">${u[d].icon}</div>`:'<div class="lo-slot"></div>'}).join("")}
        </div>
      </div>
    `,e.querySelector("#backBtn").addEventListener("click",()=>{n.button(),t.gotoMenu()}),e.querySelectorAll("[data-buy]").forEach(s=>s.addEventListener("click",()=>{const a=s.dataset.buy;t.buyPowerup(a)?(n.specialCreated(),o()):(n.invalid(),s.animate([{transform:"translateX(0)"},{transform:"translateX(-6px)"},{transform:"translateX(6px)"},{transform:"translateX(0)"}],{duration:240}))})),e.querySelectorAll("[data-equip]").forEach(s=>s.addEventListener("click",()=>{const a=s.dataset.equip;t.toggleEquip(a)?(n.button(),o()):n.invalid()}))}function r(i){const s=u[i],a=t.owns(i),d=t.isEquipped(i),b=t.coins>=s.price;let l;if(!a)l=`<button class="pw-buy ${b?"":"poor"}" data-buy="${i}">🪙 ${s.price}</button>`;else if(d)l=`<button class="pw-equip on" data-equip="${i}">✓ Equipped</button>`;else{const p=t.loadout.length>=c;l=`<button class="pw-equip ${p?"full":""}" data-equip="${i}">${p?"Loadout full":"Equip"}</button>`}return`
      <div class="pw-card ${a?"owned":""} ${d?"equipped":""}" style="--ptint:${s.tint}">
        <div class="pw-badge">${s.price===0?"STARTER":a?"OWNED":""}</div>
        <div class="pw-orb">${s.icon}</div>
        <div class="pw-name">${s.name}</div>
        <div class="pw-blurb">${s.blurb}</div>
        ${l}
      </div>`}o()}export{E as mountShop};
