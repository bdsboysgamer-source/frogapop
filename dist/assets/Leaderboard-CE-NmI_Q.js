import{i as n,S as m,c as p,e as L}from"./index-C9nWCZ-P.js";const a=[{mode:"endless",sub:null,ic:"endless",label:"Endless"},{mode:"timetrial",sub:null,ic:"timetrial",label:"Time Trial"},{mode:"daily",sub:()=>new Date().toISOString().slice(0,10),ic:"daily",label:"Daily"}];function T(b,o,l={}){const s=document.createElement("div");s.className="screen sheet-screen",b.appendChild(s);let i=0;if(l.mode){const e=a.findIndex(t=>t.mode===l.mode);e>=0&&(i=e)}const f=l.sub;s.innerHTML=`
    <div class="sheet-bg"></div>
    <div class="sheet-header">
      <button class="btn btn-blue btn-round" id="backBtn">${n("back",{size:26})}</button>
      <div class="sheet-title">Leaderboards</div>
      <div style="width:52px;"></div>
    </div>
    <div class="lb-tabs" id="tabs">
      ${l.mode==="level"?`<button class="lb-tab active">${l.title||"Level"}</button>`:a.map((e,t)=>`<button class="lb-tab ${t===i?"active":""}" data-tab="${t}">${n(e.ic,{size:18})}${e.label}</button>`).join("")}
    </div>
    <div class="lb-status" id="status"></div>
    <div class="sheet-body"><div class="lb-list" id="list"></div></div>
  `,s.querySelector("#backBtn").addEventListener("click",()=>{m.button(),l.fromMenu,o.gotoMenu()}),s.querySelectorAll("[data-tab]").forEach(e=>e.addEventListener("click",()=>{m.button(),i=Number(e.dataset.tab),s.querySelectorAll(".lb-tab").forEach(t=>t.classList.toggle("active",t===e)),r()}));async function r(){const e=s.querySelector("#list"),t=s.querySelector("#status");e.innerHTML='<div class="lb-loading">Loading…</div>';const u=l.mode==="level"?{mode:"level",sub:f}:{mode:a[i].mode,sub:typeof a[i].sub=="function"?a[i].sub():a[i].sub},y=await p(),{entries:v}=await L({mode:u.mode,sub:u.sub,limit:25,account:o.account});if(t.innerHTML=y?`${n("globe",{size:16})} Global rankings`:'This device only · <span class="lb-hint">sign in + deploy the server for global boards</span>',!v.length){e.innerHTML='<div class="lb-empty">No scores yet — be the first!</div>';return}e.innerHTML=v.map((d,g)=>{const c=d.rank??g+1,h=c===1?n("medalGold",{size:26}):c===2?n("medalSilver",{size:26}):c===3?n("medalBronze",{size:26}):`#${c}`;return`<div class="lb-row ${d.you?"you":""}">
        <span class="lb-rank">${h}</span>
        <span class="lb-name">${S(d.name||"Anon")}</span>
        <span class="lb-score">${Number(d.score).toLocaleString()}</span>
      </div>`}).join("")}r()}function S(b){return String(b).replace(/[&<>"']/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[o])}export{T as mountLeaderboard};
