import{L as u,i as n,f,P as q,a as p,S as o}from"./index-DXORqUkk.js";function m(r,i){const e=document.createElement("div");e.className="screen shop-screen",r.appendChild(e);function c(){const t=i.loadout.length;e.innerHTML=`
      <div class="shop-bg"></div>
      <div class="shop-header">
        <button class="btn btn-blue btn-round" id="backBtn">${n("back",{size:26})}</button>
        <div class="shop-title">Scai's Stall</div>
        <div class="coin-chip big">${n("coin",{size:22})}<b>${i.coins}</b></div>
      </div>

      <div class="stall">
        <div class="stall-roof"></div>
        <div class="stall-keeper">
          ${f("scout",{width:118})}
          <div class="stall-sign">Scai</div>
        </div>
        <div class="stall-counter">
          <div class="counter-rail" id="rail">
            ${q.map(s=>b(s)).join("")}
          </div>
        </div>
      </div>

      <div class="loadout-bar">
        <span class="loadout-label">Loadout ${t}/${u}</span>
        <div class="loadout-slots">
          ${[...Array(u)].map((s,a)=>{const d=i.loadout[a];return d?`<div class="lo-slot filled" style="--ptint:${p[d].tint}">${n(p[d].icon,{size:30})}</div>`:'<div class="lo-slot"></div>'}).join("")}
        </div>
      </div>
    `,e.querySelector("#backBtn").addEventListener("click",()=>{o.button(),i.gotoMenu()}),e.querySelectorAll("[data-buy]").forEach(s=>s.addEventListener("click",()=>{const a=s.dataset.buy;i.buyPowerup(a)?(o.specialCreated(),c()):(o.invalid(),s.animate([{transform:"translateX(0)"},{transform:"translateX(-6px)"},{transform:"translateX(6px)"},{transform:"translateX(0)"}],{duration:240}))})),e.querySelectorAll("[data-equip]").forEach(s=>s.addEventListener("click",()=>{const a=s.dataset.equip;i.toggleEquip(a)?(o.button(),c()):o.invalid()}))}function b(t){const s=p[t],a=i.owns(t),d=i.isEquipped(t),$=i.coins>=s.price;let l;if(!a)l=`<button class="pw-buy ${$?"":"poor"}" data-buy="${t}">${n("coin",{size:20})} ${s.price}</button>`;else if(d)l=`<button class="pw-equip on" data-equip="${t}">${n("check",{size:16})} Equipped</button>`;else{const v=i.loadout.length>=u;l=`<button class="pw-equip ${v?"full":""}" data-equip="${t}">${v?"Loadout full":"Equip"}</button>`}return`
      <div class="pw-card ${a?"owned":""} ${d?"equipped":""}" style="--ptint:${s.tint}">
        <div class="pw-badge">${s.price===0?"STARTER":a?"OWNED":""}</div>
        <div class="pw-orb">${n(s.icon,{size:42})}</div>
        <div class="pw-name">${s.name}</div>
        <div class="pw-blurb">${s.blurb}</div>
        ${l}
      </div>`}c()}export{m as mountShop};
