// Godrank planner: ratings (lb), weekly split, day generator with randomize/lock, and the progressive-overload coach.
(()=>{
/* ---------- ratings ---------- */
// standards for weighted-bodyweight moves are total load (bodyweight + added) over bodyweight
const WB_STD={vpull:2.0,dip:2.3,pushup:1.9,crunch:1.6,ext:1.6};
const LOWER=new Set(['legs']);
function sexF(ex,u){return u.sex==='f'?(LOWER.has(ex.group)?.75:.62):1}
// weighted standards scaled so God I ≈ elite (e.g. bench e1RM ≈ 2× bodyweight)
function stdOf(ex,u){return (ex.type==='w'?(ex.eq==='wb'?(WB_STD[ex.pat]||1.8):ex.std)*1.33:ex.std)*sexF(ex,u)}
window.rate=function(ex,w,r,u){
  if(!r)return 0;let x;
  if(ex.type==='w'){const load=ex.eq==='wb'?u.bw+(+w||0):(+w||0);if(!load)return 0;const e1=load*(1+r/30);x=860*Math.pow((e1/u.bw)/stdOf(ex,u),1.3)}
  else x=860*Math.pow(r/stdOf(ex,u),1.1);
  return Math.max(1,Math.min(1000,Math.round(x)));
};
// weight (or reps) needed at `reps` to reach a rating
function needFor(ex,R,reps,u){
  if(ex.type!=='w')return Math.ceil(stdOf(ex,u)*Math.pow(R/860,1/1.1));
  const e1=stdOf(ex,u)*u.bw*Math.pow(R/860,1/1.3);let w=e1/(1+reps/30);if(ex.eq==='wb')w-=u.bw;return Math.max(0,w);
}
const round5=w=>Math.max(5,Math.round(w/5)*5);
// next-division target for an exercise at a given rep count
window.rankHint=function(ex,rating,reps,u){
  const rf=rankFor(Math.max(1,rating||1)),span=(rf.rank.hi-rf.rank.lo+1)/3,di=['I','II','III'].indexOf(rf.div);
  const tgt=rating?Math.min(1000,Math.ceil(rf.rank.lo+(di+1)*span)):RANKS[0].lo+1;const nr=rankFor(tgt);
  const v=needFor(ex,tgt,reps,u);
  return {nr,txt:ex.type==='w'?`${Math.ceil(v/5)*5} lb × ${reps}`:ex.type==='time'?`${v}s`:`${v} reps`};
};

/* ---------- weekly split ---------- */
const SPLITS={
  2:['fullA','fullB'],
  3:['fullA','fullB','fullC'],
  3.5:['push','pull','legs'],
  4:['upper','lower','upper2','lower2'],
  5:['push','pull','legs','upper','lower'],
  6:['push','pull','legs','push2','pull2','legs2'],
  7:['push','pull','legs','push2','pull2','legs2','core'],
};
window.DAYNAME={push:'Push',push2:'Push',pull:'Pull',pull2:'Pull',legs:'Legs',legs2:'Legs',upper:'Upper Body',upper2:'Upper Body',lower:'Lower Body',lower2:'Lower Body',
  fullA:'Full Body A',fullB:'Full Body B',fullC:'Full Body C',core:'Core & Conditioning'};
window.splitFor=function(u){const n=Math.max(2,Math.min(7,(u.days||[]).length||3));return SPLITS[n===3&&u.exp==='adv'?3.5:n]};
window.splitName=function(u){const s=splitFor(u);return s.includes('push')&&s.includes('upper')?'Push / Pull / Legs + Upper / Lower':s.includes('push')?'Push / Pull / Legs':s.includes('upper')?'Upper / Lower':'Full Body'};

/* slot = which movement fills this spot. heavy = the day's main lift */
const S_=(pats,o={})=>({pats,...o});
const TEMPLATES={
  push:[S_(['hpress'],{mus:'chest',heavy:1}),S_(['vpress']),S_(['hpress','dip'],{mus:'chest',alt:1}),S_(['fly']),S_(['lateral']),S_(['triext'])],
  push2:[S_(['vpress'],{heavy:1}),S_(['hpress'],{mus:'chest'}),S_(['dip','pushup','hpress'],{mus:'chest',alt:1}),S_(['lateral']),S_(['fly']),S_(['triext'])],
  pull:[S_(['vpull'],{noTime:1}),S_(['row'],{heavy:1}),S_(['row','pullover']),S_(['rear']),S_(['curl']),S_(['curl','shrug'])],
  pull2:[S_(['hinge'],{mus:'back',heavy:1}),S_(['vpull']),S_(['row']),S_(['rear']),S_(['curl']),S_(['shrug'])],
  legs:[S_(['squat','legpress'],{heavy:1,mus:'quads'}),S_(['hinge'],{mus:'hams'}),S_(['lunge','legpress']),S_(['legcurl']),S_(['legext','hipthrust']),S_(['calf'])],
  legs2:[S_(['hinge'],{mus:'hams',heavy:1}),S_(['squat','legpress'],{mus:'quads'}),S_(['hipthrust']),S_(['legext']),S_(['legcurl']),S_(['calf'])],
  upper:[S_(['hpress'],{mus:'chest',heavy:1}),S_(['row']),S_(['vpress']),S_(['vpull']),S_(['lateral','fly']),S_(['curl']),S_(['triext'])],
  upper2:[S_(['vpull'],{heavy:1}),S_(['hpress'],{mus:'chest'}),S_(['row']),S_(['vpress']),S_(['rear','lateral']),S_(['triext']),S_(['curl'])],
  lower:[S_(['squat'],{heavy:1,mus:'quads'}),S_(['hinge'],{mus:'hams'}),S_(['lunge','legpress']),S_(['legcurl']),S_(['calf']),S_(['abs','crunch'])],
  lower2:[S_(['hinge'],{heavy:1}),S_(['legpress','squat'],{mus:'quads'}),S_(['hipthrust']),S_(['legext']),S_(['calf']),S_(['abs','crunch'])],
  fullA:[S_(['squat'],{heavy:1,mus:'quads'}),S_(['hpress'],{mus:'chest'}),S_(['row']),S_(['lateral']),S_(['curl','triext']),S_(['abs','crunch'])],
  fullB:[S_(['hinge'],{heavy:1}),S_(['vpress']),S_(['vpull']),S_(['lunge']),S_(['triext']),S_(['abs','hold'])],
  fullC:[S_(['legpress','squat'],{heavy:1,mus:'quads'}),S_(['hpress'],{mus:'chest',alt:1}),S_(['row','vpull']),S_(['rear','lateral']),S_(['curl']),S_(['calf'])],
  core:[S_(['abs'],{heavy:1}),S_(['crunch']),S_(['antirot']),S_(['hold']),S_(['carry']),S_(['swing'])],
};
// target muscles for a day (for the Home glow)
window.dayMuscles=function(type){const t=TEMPLATES[type]||[];const m=new Set();for(const s of t)for(const e of EXL)if(s.pats.includes(e.pat)&&(!s.mus||e.m[0]===s.mus)){m.add(e.m[0]);break}return m};

/* sets x reps by goal and slot role */
function prescription(slot,ex,u){
  const g=u.goal||'lean',beg=u.exp==='beg';
  if(ex.type==='time')return {sets:3,lo:20,hi:45};
  if(slot.heavy&&ex.kind==='compound')return g==='strength'?{sets:4,lo:3,hi:5}:g==='fat'?{sets:3,lo:8,hi:10}:{sets:beg?3:4,lo:6,hi:8};
  if(ex.kind==='compound')return g==='strength'?{sets:3,lo:5,hi:8}:g==='fat'?{sets:3,lo:10,hi:12}:{sets:3,lo:8,hi:12};
  return g==='strength'?{sets:beg?2:3,lo:8,hi:12}:{sets:beg?2:3,lo:10,hi:15};
}

/* seeded random */
function rng(seed){let s=seed>>>0||1;return()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return((s>>>0)%1e6)/1e6}}
const PREF_GYM={bb:6,tb:5,db:5,mc:4,cb:4,sm:3,ez:4,lm:3,wb:3,kb:2,bw:2,pl:1,bd:1,tm:1};
const PREF_HOME={db:6,kb:4,wb:3,bw:5,bd:3,pl:2,tm:2};
// regressions only show up for beginners
const EASY=/Assisted|Knee Push|Negative|Incline Push-Up|Wall Sit|Bodyweight Squat/;let beg=false;
function candidates(slot,loc,used){
  return EXL.filter(e=>slot.pats.includes(e.pat)&&(!slot.mus||e.m[0]===slot.mus)&&(loc!=='home'||e.home)&&!used.has(e.id)
    &&!(slot.noTime&&e.type==='time')&&e.pat!=='cardio'&&!(slot.heavy&&e.type==='reps'&&loc==='gym')&&(beg||!EASY.test(e.n)));
}
function score(e,slot,loc){const p=(loc==='home'?PREF_HOME:PREF_GYM)[e.eq]||1;return p+(e.staple?6:0)+(slot.heavy&&e.kind==='compound'?2:0)+(slot.heavy&&['bb','tb'].includes(e.eq)&&loc==='gym'?3:0)+(slot.alt&&/Incline|Dip/.test(e.n)?5:0)}

// Build a day. seed 0 = the sensible default (best staples). keep = {slotIndex: exerciseId} for locked picks
window.genDay=function(type,u,loc,seed=0,keep={}){
  beg=u.exp==='beg';
  const tpl=(TEMPLATES[type]||TEMPLATES.fullA).slice(0,u.exp==='beg'?5:6);
  const used=new Set(Object.values(keep)),r=rng(seed*7919+type.length*31+1);
  const items=tpl.map((slot,i)=>{
    let ex=keep[i]&&EXI[keep[i]];
    if(!ex){
      let c=candidates(slot,loc,used);
      if(!c.length)c=candidates({...slot,mus:null},loc,used);
      if(!c.length)return null;
      c.sort((a,b)=>score(b,slot,loc)-score(a,slot,loc));
      if(seed===0)ex=c[0];
      else{const pool=c.slice(0,Math.max(4,Math.ceil(c.length*.6)));const w=pool.map(e=>score(e,slot,loc));let t=r()*w.reduce((a,b)=>a+b,0);
        ex=pool.find((e,j)=>(t-=w[j])<=0)||pool[0];}
    }
    used.add(ex.id);
    return {id:ex.id,slot:i,locked:!!keep[i],...prescription(slot,ex,u)};
  }).filter(Boolean);
  // keep total volume in the 14-20 set range
  let total=items.reduce((a,b)=>a+b.sets,0);
  while(total>20&&items.length>4){total-=items.pop().sets}
  for(const it of items){if(total>=14)break;if(EXI[it.id].kind==='compound'&&it.sets<4){it.sets++;total++}}
  return items;
};
window.swapOptions=function(type,u,loc,slotIndex,usedIds){
  beg=u.exp==='beg';
  const tpl=TEMPLATES[type]||TEMPLATES.fullA,slot=tpl[slotIndex]||tpl[0];
  return candidates(slot,loc,new Set(usedIds)).sort((a,b)=>score(b,slot,loc)-score(a,slot,loc));
};

/* ---------- progressive overload coach ---------- */
function inc(ex){if(ex.type!=='w')return 0;if(ex.kind==='compound'&&ex.group==='legs'&&['bb','tb','mc','sm'].includes(ex.eq))return 10;return 5}
// last = {sets:[{w,r}]} from the previous session of this exercise
window.coach=function(ex,it,last,u,rating){
  const lo=it.lo,hi=it.hi;
  if(ex.type!=='w'){
    if(!last)return {w:0,r:hi,msg:`First time. Aim for ${hi}${ex.type==='time'?' seconds':' clean reps'}.`,tag:'new'};
    const best=Math.max(...last.sets.map(s=>s.r));const goal=best+(ex.type==='time'?5:1);
    return {w:0,r:goal,msg:`Last time you hit ${best}${ex.type==='time'?'s':''}. Go for ${goal} today.`,tag:'reps'};
  }
  if(!last){
    const R={beg:220,int:400,adv:560}[u.exp||'int'];let w=needFor(ex,R,hi,u);w=ex.eq==='wb'?Math.max(0,round5(w)):round5(w*.9);
    if(rating){const r2=needFor(ex,Math.max(1,rating-30),hi,u);w=ex.eq==='wb'?Math.max(0,round5(r2)):round5(r2)}
    return {w,r:lo,msg:`First time on this one. Start at ${w} lb and find a clean ${lo}–${hi}.`,tag:'new'};
  }
  const top=Math.max(...last.sets.map(s=>+s.w||0)),work=last.sets.filter(s=>(+s.w||0)>=top);
  const allTop=work.every(s=>s.r>=hi),miss=work.some(s=>s.r<lo),best=Math.max(...work.map(s=>s.r));
  if(allTop){const n=top+inc(ex);return {w:n,r:lo,msg:`Add +${inc(ex)} lb today. You owned ${hi} reps at ${top} lb last time.`,tag:'up'}}
  if(miss&&last.missed)return {w:round5(top*.92),r:lo,msg:`Drop to ${round5(top*.92)} lb and rebuild. Clean reps first.`,tag:'down'};
  if(miss)return {w:top,r:lo,msg:`Same ${top} lb. Get every set to ${lo} reps.`,tag:'hold'};
  return {w:top,r:Math.min(hi,best+1),msg:`Same ${top} lb. Beat last time: go for ${Math.min(hi,best+1)} reps.`,tag:'reps'};
};
})();
