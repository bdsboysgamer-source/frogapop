import{i,S as l}from"./index-DEI2rJDN.js";const n=[{id:"firstPop",icon:"pineapple",name:"First Pop",desc:"Clear level 1",check:e=>e.starsFor(1)>0},{id:"stars30",icon:"star",name:"Star Gatherer",desc:"Earn 30 stars",check:e=>e.totalStars()>=30},{id:"stars100",icon:"star",name:"Star Hoarder",desc:"Earn 100 stars",check:e=>e.totalStars()>=100},{id:"stars300",icon:"sparkle",name:"Superstar",desc:"Earn all 300 stars",check:e=>e.totalStars()>=300},{id:"world5",icon:"globe",name:"Globe Hopper",desc:"Reach the Prism Realm",check:e=>e.levelsCompleted()>=75},{id:"rich",icon:"coin",name:"Deep Pockets",desc:"Save up 1,000 coins",check:e=>e.coins>=1e3},{id:"collector",icon:"bag",name:"Well Equipped",desc:"Own 5 power-ups",check:e=>Object.keys(e.saveData.owned).length>=5},{id:"loaded",icon:"shop",name:"Fully Loaded",desc:"Equip 4 power-ups",check:e=>e.loadout.length>=4},{id:"endless20k",icon:"endless",name:"Endless Ace",desc:"Score 20,000 in Endless",check:e=>e.saveData.endless.best>=2e4},{id:"time8k",icon:"bolt",name:"Speed Demon",desc:"Score 8,000 in Time Trial",check:e=>e.saveData.timetrial.best>=8e3},{id:"daily",icon:"daily",name:"Daily Devotee",desc:"Play a Daily Challenge",check:e=>!!e.saveData.daily.played},{id:"allWorlds",icon:"crown",name:"Champion",desc:"Clear all 100 levels",check:e=>e.levelsCompleted()>=100}];function h(e,a){const s=document.createElement("div");s.className="screen sheet-screen",e.appendChild(s);const t=n.filter(c=>c.check(a)).length;s.innerHTML=`
    <div class="sheet-bg"></div>
    <div class="sheet-header">
      <button class="btn btn-blue btn-round" id="backBtn">${i("back",{size:26})}</button>
      <div class="sheet-title">Trophies</div>
      <div class="ach-count">${t}/${n.length}</div>
    </div>
    <div class="sheet-body">
      <div class="ach-grid">
        ${n.map(c=>{const d=c.check(a);return`<div class="ach-card ${d?"on":"off"}">
            <div class="ach-icon">${d?i(c.icon,{size:40}):i("lock",{size:36})}</div>
            <div class="ach-name">${c.name}</div>
            <div class="ach-desc">${c.desc}</div>
          </div>`}).join("")}
      </div>
    </div>
  `,s.querySelector("#backBtn").addEventListener("click",()=>{l.button(),a.gotoMenu()})}export{h as mountAchievements};
