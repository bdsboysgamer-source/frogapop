import{g as n,W as u,h as x,i as o,S as t,j as m,k as h}from"./index-DXORqUkk.js";function b(r,c){const a=document.createElement("div");a.className="screen sheet-screen pdex-screen",r.appendChild(a);const l=Object.keys(n).length,p=u.map(e=>{const s=c.isWorldUnlocked(e.id),d=x[e.id].map(i=>v(i,s)).join("");return`
      <div class="pdex-world">
        <span class="pdex-world-name">${e.name}</span>
        ${s?"":`<span class="pdex-world-lock">${o("lock",{size:16})} locked</span>`}
      </div>
      <div class="pdex-grid">${d}</div>`}).join("");a.innerHTML=`
    <div class="sheet-bg"></div>
    <div class="sheet-header">
      <button class="btn btn-blue btn-round" id="backBtn">${o("back",{size:26})}</button>
      <div class="sheet-title">Pineapple Index</div>
      <div class="ach-count">${l}</div>
    </div>
    <div class="sheet-body">${p}</div>
  `,a.querySelector("#backBtn").addEventListener("click",()=>{t.button(),c.gotoMenu()}),a.querySelectorAll(".pdex-card:not(.locked) .pdex-portrait").forEach(e=>{e.addEventListener("click",()=>{var s,d;t.ensure(),(d=(s=t).pop)==null||d.call(s,1),e.animate([{transform:"scale(1) rotate(0)"},{transform:"scale(1.15) rotate(-6deg)"},{transform:"scale(1.15) rotate(6deg)"},{transform:"scale(1) rotate(0)"}],{duration:400})})});function v(e,s){const d=n[e];return s?`<div class="pdex-card">
      <div class="pdex-portrait"><img src="${m(e).toDataURL()}" alt="${d.name}" width="72" height="72"/></div>
      <div class="pdex-info">
        <div class="pdex-name">${d.name}</div>
        <div class="pdex-desc">${h[e]||""}</div>
      </div>
    </div>`:`<div class="pdex-card locked">
        <div class="pdex-portrait"><span class="pdex-silhouette">?</span></div>
        <div class="pdex-info"><div class="pdex-name">? ? ?</div><div class="pdex-desc">Reach this world to discover it.</div></div>
      </div>`}}export{b as mountPineappleIndex};
