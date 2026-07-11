import{S as t}from"./index-CLZ6KYd-.js";const n=[{id:"firstPop",icon:"🍍",name:"First Pop",desc:"Clear level 1",check:e=>e.starsFor(1)>0},{id:"stars30",icon:"⭐",name:"Star Gatherer",desc:"Earn 30 stars",check:e=>e.totalStars()>=30},{id:"stars100",icon:"🌟",name:"Star Hoarder",desc:"Earn 100 stars",check:e=>e.totalStars()>=100},{id:"stars300",icon:"💫",name:"Superstar",desc:"Earn all 300 stars",check:e=>e.totalStars()>=300},{id:"world5",icon:"🌍",name:"Globe Hopper",desc:"Reach the Prism Realm",check:e=>e.levelsCompleted()>=75},{id:"rich",icon:"🪙",name:"Deep Pockets",desc:"Save up 1,000 coins",check:e=>e.coins>=1e3},{id:"collector",icon:"🎒",name:"Well Equipped",desc:"Own 5 power-ups",check:e=>Object.keys(e.saveData.owned).length>=5},{id:"loaded",icon:"🧰",name:"Fully Loaded",desc:"Equip 4 power-ups",check:e=>e.loadout.length>=4},{id:"endless20k",icon:"♾️",name:"Endless Ace",desc:"Score 20,000 in Endless",check:e=>e.saveData.endless.best>=2e4},{id:"time8k",icon:"⚡",name:"Speed Demon",desc:"Score 8,000 in Time Trial",check:e=>e.saveData.timetrial.best>=8e3},{id:"daily",icon:"📅",name:"Daily Devotee",desc:"Play a Daily Challenge",check:e=>!!e.saveData.daily.played},{id:"allWorlds",icon:"🏆",name:"Champion",desc:"Clear all 100 levels",check:e=>e.levelsCompleted()>=100}];function r(e,a){const s=document.createElement("div");s.className="screen sheet-screen",e.appendChild(s);const i=n.filter(c=>c.check(a)).length;s.innerHTML=`
    <div class="sheet-bg"></div>
    <div class="sheet-header">
      <button class="btn btn-blue btn-round" id="backBtn">←</button>
      <div class="sheet-title">🏅 Trophies</div>
      <div class="ach-count">${i}/${n.length}</div>
    </div>
    <div class="sheet-body">
      <div class="ach-grid">
        ${n.map(c=>{const d=c.check(a);return`<div class="ach-card ${d?"on":"off"}">
            <div class="ach-icon">${d?c.icon:"🔒"}</div>
            <div class="ach-name">${c.name}</div>
            <div class="ach-desc">${c.desc}</div>
          </div>`}).join("")}
      </div>
    </div>
  `,s.querySelector("#backBtn").addEventListener("click",()=>{t.button(),a.gotoMenu()})}export{r as mountAchievements};
