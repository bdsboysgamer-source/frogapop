import{S as v,i as h,d as p}from"./index-CLZ6KYd-.js";const a=[{mode:"endless",sub:null,label:"♾️ Endless"},{mode:"timetrial",sub:null,label:"⏱️ Time Trial"},{mode:"daily",sub:()=>new Date().toISOString().slice(0,10),label:"📅 Daily"}];function T(c,i,n={}){const s=document.createElement("div");s.className="screen sheet-screen",c.appendChild(s);let l=0;if(n.mode){const e=a.findIndex(t=>t.mode===n.mode);e>=0&&(l=e)}const m=n.sub;s.innerHTML=`
    <div class="sheet-bg"></div>
    <div class="sheet-header">
      <button class="btn btn-blue btn-round" id="backBtn">←</button>
      <div class="sheet-title">🏆 Leaderboards</div>
      <div style="width:52px;"></div>
    </div>
    <div class="lb-tabs" id="tabs">
      ${n.mode==="level"?`<button class="lb-tab active">${n.title||"Level"}</button>`:a.map((e,t)=>`<button class="lb-tab ${t===l?"active":""}" data-tab="${t}">${e.label}</button>`).join("")}
    </div>
    <div class="lb-status" id="status"></div>
    <div class="sheet-body"><div class="lb-list" id="list"></div></div>
  `,s.querySelector("#backBtn").addEventListener("click",()=>{v.button(),n.fromMenu,i.gotoMenu()}),s.querySelectorAll("[data-tab]").forEach(e=>e.addEventListener("click",()=>{v.button(),l=Number(e.dataset.tab),s.querySelectorAll(".lb-tab").forEach(t=>t.classList.toggle("active",t===e)),b()}));async function b(){const e=s.querySelector("#list"),t=s.querySelector("#status");e.innerHTML='<div class="lb-loading">Loading…</div>';const u=n.mode==="level"?{mode:"level",sub:m}:{mode:a[l].mode,sub:typeof a[l].sub=="function"?a[l].sub():a[l].sub},f=await h(),{entries:r}=await p({mode:u.mode,sub:u.sub,limit:25,account:i.account});if(t.innerHTML=f?"🌐 Global rankings":'📱 This device only · <span class="lb-hint">sign in + deploy the server for global boards</span>',!r.length){e.innerHTML='<div class="lb-empty">No scores yet — be the first! 🐸</div>';return}e.innerHTML=r.map((o,y)=>{const d=o.rank??y+1,g=d===1?"🥇":d===2?"🥈":d===3?"🥉":`#${d}`;return`<div class="lb-row ${o.you?"you":""}">
        <span class="lb-rank">${g}</span>
        <span class="lb-name">${L(o.name||"Anon")}</span>
        <span class="lb-score">${Number(o.score).toLocaleString()}</span>
      </div>`}).join("")}b()}function L(c){return String(c).replace(/[&<>"']/g,i=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[i])}export{T as mountLeaderboard};
