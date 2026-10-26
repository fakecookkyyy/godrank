// Godrank illustrations: colored cartoon exercise figures (one pose per movement pattern, dressed with the
// exercise's equipment) and colored equipment icons. All drawn as SVG on a 100x100 canvas.
(()=>{
const C={skin:'#f1c19b',skin2:'#d9a27c',shirt:'#3b82f6',shirt2:'#2563eb',shorts:'#1f2937',shorts2:'#111827',shoe:'#e5e7eb',hair:'#3b2416',
  bar:'#cbd5e1',barD:'#64748b',p1:'#ef4444',p2:'#2563eb',p3:'#1f2937',frame:'#64748b',frameD:'#475569',pad:'#dc2626',seat:'#334155',cable:'#e2e8f0',band:'#f59e0b'};
const L=(a,b,w,c)=>`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
const O=(p,r,c,extra='')=>`<circle cx="${p[0]}" cy="${p[1]}" r="${r}" fill="${c}" ${extra}/>`;
const off=(p,d)=>p&&[p[0]+d[0],p[1]+d[1]];

/* ---------- the figure ---------- */
// pose: head h, shoulder s, hip p, near limbs e,w,k,f ; far limbs e2,w2,k2,f2 (default: near limbs offset back)
function figure(P){
  const d=P.far||[-3,-1.5],e2=P.e2||off(P.e,d),w2=P.w2||off(P.w,d),k2=P.k2||off(P.k,d),f2=P.f2||off(P.f,d),s2=P.s2||off(P.s,d),p2=P.p2||off(P.p,d);
  let g='';
  // far side (darker)
  g+=L(p2,k2,10,C.shorts2)+L(k2,f2,7.5,C.skin2)+O(f2,3.6,'#cbd5e1');
  g+=L(s2,e2,7,C.shirt2)+L(e2,w2,6,C.skin2)+O(w2,3.4,C.skin2);
  // torso
  g+=L(P.s,P.p,15,C.shirt)+L(P.p,P.p,15,C.shorts);
  // near legs
  g+=L(P.p,P.k,10.5,C.shorts)+L(P.k,P.f,8,C.skin)+O(P.f,3.8,C.shoe);
  // head
  const hd=P.hd||[0,-1];g+=L(P.s,P.h,6,C.skin)+O(P.h,7.4,C.skin)+`<path d="M${P.h[0]-7.4+hd[0]} ${P.h[1]-0.5} a7.4 7.4 0 0 1 14.8 0 q-7.4 -4 -14.8 0z" fill="${C.hair}" transform="rotate(${P.hr||0} ${P.h[0]} ${P.h[1]})"/>`;
  // near arm
  g+=L(P.s,P.e,7.5,C.shirt)+L(P.e,P.w,6.5,C.skin)+O(P.w,3.6,C.skin);
  return g;
}

/* ---------- equipment pieces ---------- */
const plateEnd=(c,r=11,col=C.p1)=>O(c,r,col,`stroke="#0f172a" stroke-width="1.2"`)+O(c,r*.55,'#0f172a22')+O(c,2.2,C.bar);
const barH=(x1,x2,y,col=C.p1)=>L([x1,y],[x2,y],4,C.barD)+`<rect x="${x1-3}" y="${y-11}" width="6" height="22" rx="2" fill="${col}"/><rect x="${x2-3}" y="${y-11}" width="6" height="22" rx="2" fill="${col}"/><rect x="${x1+4}" y="${y-8}" width="3" height="16" rx="1" fill="${C.p2}"/><rect x="${x2-7}" y="${y-8}" width="3" height="16" rx="1" fill="${C.p2}"/>`;
const dbAt=(p,ang=0)=>`<g transform="translate(${p[0]} ${p[1]}) rotate(${ang})">${L([-6,0],[6,0],2.6,C.barD)}<rect x="-8.5" y="-4.5" width="4" height="9" rx="1.5" fill="${C.p3}"/><rect x="4.5" y="-4.5" width="4" height="9" rx="1.5" fill="${C.p3}"/></g>`;
const kbAt=p=>`<g transform="translate(${p[0]} ${p[1]+7})"><path d="M-4 -7 q4 -6 8 0" fill="none" stroke="${C.p3}" stroke-width="2.4"/><circle cx="0" cy="0" r="6.5" fill="${C.p3}"/><circle cx="-2" cy="-2" r="1.6" fill="#ffffff30"/></g>`;
const plateAt=p=>O(p,8,C.p1,`stroke="#0f172a" stroke-width="1.2"`)+O(p,2.2,'#0f172a');
const bench=(x1,x2,y,h=12)=>`<rect x="${x1}" y="${y}" width="${x2-x1}" height="5" rx="2.5" fill="${C.pad}"/>`+L([x1+5,y+5],[x1+5,y+h+5],3,C.frame)+L([x2-5,y+5],[x2-5,y+h+5],3,C.frame);
const floor=`<line x1="6" y1="94" x2="94" y2="94" stroke="#0f172a22" stroke-width="2"/>`;
const pulley=(top,hand)=>O(top,3,C.frame)+L(top,hand,1.4,C.cable)+`<rect x="${hand[0]-4}" y="${hand[1]-1.5}" width="8" height="3" rx="1.5" fill="${C.p3}"/>`;
const stack=x=>`<rect x="${x-5}" y="8" width="10" height="84" rx="2" fill="${C.frameD}"/>`+[0,1,2,3,4,5].map(i=>`<rect x="${x-4}" y="${60+i*5}" width="8" height="4" rx="1" fill="${C.p3}"/>`).join('');
const rails=`<rect x="12" y="6" width="3" height="88" fill="${C.frame}"/><rect x="85" y="6" width="3" height="88" fill="${C.frame}"/>`;
const bandLine=(a,b)=>`<path d="M${a[0]} ${a[1]} Q${(a[0]+b[0])/2+6} ${(a[1]+b[1])/2} ${b[0]} ${b[1]}" fill="none" stroke="${C.band}" stroke-width="2.6" stroke-linecap="round"/>`;
const machineFrame=`<rect x="70" y="10" width="20" height="84" rx="3" fill="${C.frameD}"/>`+[0,1,2,3,4].map(i=>`<rect x="72" y="${64+i*5.5}" width="16" height="4.5" rx="1" fill="${C.p3}"/>`).join('');
const pullBar=(y=10,x1=22,x2=78)=>L([x1,y],[x2,y],3.4,C.barD)+L([x1,y],[x1,94],3,C.frameD)+L([x2,y],[x2,94],3,C.frameD);
const dipBars=(y)=>L([22,y],[78,y],3.2,C.barD)+L([26,y],[26,94],3,C.frameD)+L([74,y],[74,94],3,C.frameD);

/* ---------- poses per movement pattern (side view facing right unless noted) ---------- */
const POSE={
  hpress:{h:[23,55],s:[31,58],p:[58,59],k:[70,53],f:[78,88],e:[35,46],w:[36,33],k2:[68,55],f2:[74,88],grip:'top',benchY:63,hr:-90},
  fly:{h:[23,55],s:[31,58],p:[58,59],k:[70,53],f:[78,88],e:[22,49],w:[18,40],e2:[44,49],w2:[48,40],grip:'both',benchY:63,hr:-90,far:[0,0]},
  pullover:{h:[30,55],s:[38,58],p:[64,59],k:[74,53],f:[82,88],e:[24,52],w:[12,50],grip:'top2',benchY:63,hr:-90},
  vpress:{front:1,h:[50,22],s:[40,34],s2:[60,34],p:[46,60],p2:[54,60],k:[44,77],k2:[56,77],f:[43,93],f2:[57,93],e:[30,26],w:[34,11],e2:[70,26],w2:[66,11],grip:'over'},
  lateral:{front:1,h:[50,22],s:[40,34],s2:[60,34],p:[46,60],p2:[54,60],k:[45,77],k2:[55,77],f:[44,93],f2:[56,93],e:[27,36],w:[15,37],e2:[73,36],w2:[85,37],grip:'sides'},
  upright:{front:1,h:[50,22],s:[40,34],s2:[60,34],p:[46,60],p2:[54,60],k:[45,77],k2:[55,77],f:[44,93],f2:[56,93],e:[30,32],w:[45,40],e2:[70,32],w2:[55,40],grip:'mid'},
  front:{h:[50,20],s:[48,32],p:[48,60],k:[49,77],f:[50,93],e:[60,32],w:[74,31],grip:'fwd'},
  rear:{h:[66,40],s:[58,44],p:[34,56],k:[38,75],f:[38,93],e:[60,58],w:[68,64],e2:[50,52],w2:[44,48],grip:'both2'},
  row:{h:[68,40],s:[60,45],p:[35,56],k:[42,74],f:[40,93],e:[50,54],w:[56,64],grip:'low'},
  vpull:{front:1,h:[50,26],s:[40,36],s2:[60,36],p:[47,62],p2:[53,62],k:[45,77],k2:[55,77],f:[44,91],f2:[56,91],e:[30,24],w:[34,11],e2:[70,24],w2:[66,11],grip:'hang'},
  hinge:{h:[66,44],s:[59,48],p:[38,58],k:[52,74],f:[50,93],e:[60,62],w:[60,74],grip:'floor'},
  squat:{h:[52,30],s:[48,40],p:[36,66],k:[56,72],f:[50,93],e:[40,46],w:[46,40],grip:'back'},
  legpress:{h:[22,60],s:[28,64],p:[46,76],k:[52,56],f:[68,52],e:[34,74],w:[40,80],grip:'sled'},
  lunge:{h:[50,22],s:[50,32],p:[50,58],k:[64,72],f:[66,93],k2:[42,78],f2:[30,92],e:[52,46],w:[54,58],far:[0,0],grip:'sidesD'},
  legext:{h:[30,26],s:[32,36],p:[38,62],k:[56,62],f:[74,54],e:[36,50],w:[44,60],grip:'seat'},
  legcurl:{h:[20,62],s:[28,64],p:[52,64],k:[70,64],f:[80,48],e:[24,74],w:[30,74],grip:'pad',hr:-90},
  hipthrust:{h:[18,50],s:[26,54],p:[52,52],k:[66,64],f:[70,93],e:[40,56],w:[52,48],grip:'hip',benchY:58},
  abduct:{front:1,h:[50,24],s:[40,36],s2:[60,36],p:[45,62],p2:[55,62],k:[30,72],k2:[70,72],f:[30,90],f2:[70,90],e:[34,52],w:[40,62],e2:[66,52],w2:[60,62],grip:'seat2'},
  calf:{h:[50,16],s:[50,28],p:[50,56],k:[51,73],f:[52,88],e:[44,42],w:[44,56],grip:'sidesD',block:1},
  curl:{h:[50,18],s:[48,30],p:[48,58],k:[49,75],f:[50,93],e:[48,46],w:[60,36],grip:'curl'},
  triext:{h:[46,18],s:[46,30],p:[46,58],k:[47,75],f:[48,93],e:[48,46],w:[56,60],grip:'push'},
  dip:{h:[50,26],s:[50,36],p:[50,60],k:[56,72],f:[46,82],e:[40,46],w:[30,52],e2:[60,46],w2:[70,52],grip:'dip',front:0,far:[0,0]},
  pushup:{h:[78,52],s:[70,58],p:[44,66],k:[30,72],f:[16,80],e:[70,70],w:[70,82],grip:'none'},
  shrug:{front:1,h:[50,18],s:[40,30],s2:[60,30],p:[46,58],p2:[54,58],k:[45,76],k2:[55,76],f:[44,93],f2:[56,93],e:[36,46],w:[36,62],e2:[64,46],w2:[64,62],grip:'shrug'},
  carry:{front:1,h:[50,18],s:[40,30],s2:[60,30],p:[46,58],p2:[54,58],k:[44,76],k2:[57,74],f:[43,93],f2:[60,90],e:[36,46],w:[36,62],e2:[64,46],w2:[64,62],grip:'shrug'},
  swing:{h:[64,32],s:[58,40],p:[40,58],k:[50,74],f:[46,93],e:[68,46],w:[78,46],grip:'fwd'},
  ext:{h:[74,52],s:[66,54],p:[42,52],k:[26,58],f:[14,64],e:[70,62],w:[64,56],grip:'none',roman:1},
  crunch:{h:[30,60],s:[38,66],p:[58,76],k:[70,62],f:[82,74],e:[30,70],w:[26,62],hr:-60,grip:'mat'},
  abs:{h:[50,26],s:[50,36],p:[50,62],k:[64,64],f:[64,84],e:[40,24],w:[40,12],e2:[60,24],w2:[60,12],grip:'hangbar',far:[0,0]},
  antirot:{h:[44,18],s:[44,30],p:[44,58],k:[44,75],f:[44,93],e:[56,32],w:[68,32],grip:'press'},
  hold:{h:[76,56],s:[68,62],p:[40,64],k:[26,68],f:[14,72],e:[68,72],w:[78,74],grip:'mat'},
  hang:{front:1,h:[50,26],s:[40,36],s2:[60,36],p:[47,62],p2:[53,62],k:[46,78],k2:[54,78],f:[46,92],f2:[54,92],e:[36,22],w:[36,11],e2:[64,22],w2:[64,11],grip:'hang'},
  wrist:{h:[34,24],s:[36,34],p:[38,62],k:[58,62],f:[60,90],e:[50,60],w:[62,58],grip:'curl2'},
  cardio:{front:1,h:[50,20],s:[40,32],s2:[60,32],p:[46,58],p2:[54,58],k:[45,75],k2:[55,75],f:[44,88],f2:[56,88],e:[34,48],w:[30,56],e2:[66,48],w2:[70,56],grip:'rope'},
  grip:{h:[50,18],s:[48,30],p:[48,58],k:[49,75],f:[50,93],e:[56,44],w:[64,44],grip:'none'},
};
// a few exercises get a different pattern pose than their rating pattern
const POSE_OF={'chest-dip':'dip','bench-dip':'dip','triceps-dip':'dip','push-up':'pushup','close-grip-push-up':'pushup','diamond-push-up':'pushup','pike-push-up':'vpress','handstand-push-up':'vpress','hindu-push-up':'pushup',
  'romanian-deadlift':'hinge','good-morning':'hinge','skull-crusher':'hpress','ez-bar-skull-crusher':'hpress','dumbbell-skull-crusher':'hpress','close-grip-bench-press':'hpress','jm-press':'hpress',
  'plank':'hold','side-plank':'hold','copenhagen-plank':'hold','hollow-hold':'crunch','l-sit':'abs','wall-sit':'squat','dead-hang':'hang','plate-pinch':'grip','farmer-s-walk':'carry','suitcase-carry':'carry','overhead-carry':'vpress',
  'face-pull':'row','band-pull-apart':'lateral','band-face-pull':'row','scaption-raise':'lateral','glute-bridge':'hipthrust','frog-pump':'hipthrust','single-leg-hip-thrust':'hipthrust','cable-pull-through':'hinge','kettlebell-swing':'swing',
  'step-up':'lunge','pistol-squat':'squat','sissy-squat':'squat','jump-squat':'squat','cossack-squat':'lunge','hack-squat':'squat','belt-squat':'squat','pendulum-squat':'squat',
  'mountain-climber':'pushup','plank-shoulder-tap':'pushup','renegade-row':'pushup','inverted-row':'row','ring-row':'row','superman':'ext','bird-dog':'hold','jefferson-curl':'hinge','dead-bug':'crunch','flutter-kicks':'crunch','lying-leg-raise':'crunch','reverse-crunch':'crunch',
  'russian-twist':'crunch','bicycle-crunch':'crunch','ab-wheel-rollout':'hold','barbell-rollout':'hold','stir-the-pot':'hold','dragon-flag':'crunch','v-up':'crunch','sit-up':'crunch','decline-sit-up':'crunch','weighted-sit-up':'crunch','cable-crunch':'crunch','machine-crunch':'crunch',
  'muscle-up':'vpull','rope-climb':'hang','scapular-pull-up':'hang','tibialis-raise':'calf','jump-rope':'cardio','straight-arm-pulldown':'triext','lat-prayer':'triext','cable-pullover':'triext'};

function poseFor(e){return POSE[POSE_OF[e.id]]||POSE[e.pat]||POSE.grip}

// equipment dressing depends on the grip type of the pose and the exercise's equipment
function dress(P,e){
  const eq=e.eq,g=P.grip;let back='',front='';
  const W=P.w,W2=P.w2||off(P.w,P.far||[-3,-1.5]);
  const heavy=['bb','sm','ez','tb','lm'].includes(eq);
  if(eq==='sm')back+=rails;
  if(P.benchY)back+=bench(14,62,P.benchY);
  if(P.block)back+=`<rect x="40" y="88" width="22" height="6" rx="2" fill="${C.frame}"/>`;
  if(P.roman)back+=`<rect x="34" y="56" width="16" height="6" rx="3" fill="${C.pad}" transform="rotate(-10 42 59)"/>`+L([40,62],[30,94],3,C.frame)+`<rect x="8" y="64" width="10" height="5" rx="2" fill="${C.pad}"/>`;
  if(['legext','abduct'].includes(e.pat)||g==='seat'||g==='seat2'){back+=machineFrame+`<rect x="24" y="60" width="26" height="6" rx="3" fill="${C.seat}"/><rect x="24" y="22" width="6" height="40" rx="3" fill="${C.seat}"/>`;}
  if(g==='sled')back+=`<rect x="12" y="62" width="40" height="7" rx="3" fill="${C.seat}" transform="rotate(25 30 66)"/><rect x="64" y="38" width="7" height="26" rx="2" fill="${C.frame}" transform="rotate(-25 68 51)"/>`+L([68,64],[88,92],3,C.frameD);
  if(g==='pad')back+=`<rect x="14" y="68" width="60" height="6" rx="3" fill="${C.seat}"/>`+L([30,74],[30,94],3,C.frame)+L([62,74],[62,94],3,C.frame)+O([80,48],4,C.pad);
  if(g==='hang'||g==='hangbar')back+=pullBar(P.w[1]);
  if(g==='dip')back+=dipBars(P.w[1]+1);
  if(g==='mat'||e.pat==='pushup')back+=`<rect x="8" y="${g==='mat'?84:86}" width="84" height="5" rx="2.5" fill="#7c3aed55"/>`;
  // cable / machine anchors
  if(eq==='cb'){back+=stack(88);const top=g==='hang'||g==='over'||e.pat==='vpull'||e.pat==='triext'||e.pat==='crunch'?[88,10]:g==='low'||g==='curl'||e.pat==='row'?[88,80]:[88,40];front+=pulley(top,W)}
  if(eq==='mc'&&!['legext','abduct','legpress','legcurl'].includes(e.pat)&&!(g==='seat'||g==='seat2'||g==='sled'||g==='pad'))back+=machineFrame+L([80,W[1]],W,3,C.frame);
  if(eq==='bd')front+=bandLine(W,P.f)+(P.front?bandLine(W2,P.f2||P.f):'');
  if(eq==='wb')front+=`<path d="M${P.p[0]-6} ${P.p[1]+2} Q${P.p[0]} ${P.p[1]+14} ${P.p[0]+6} ${P.p[1]+2}" fill="none" stroke="${C.p3}" stroke-width="1.6"/>`+plateAt([P.p[0],P.p[1]+18]);
  // the load in the hands
  const twoHands=P.front||['both','both2','sides','sidesD','shrug','dip'].includes(g);
  if(heavy){
    if(P.front&&['over','mid','shrug'].includes(g))front+=barH(14,86,(W[1]+W2[1])/2);
    else if(g==='hang'||g==='dip'||g==='hangbar'){}
    else front+=plateEnd(g==='floor'?[W[0],W[1]+6]:g==='back'?[P.s[0],P.s[1]-2]:W,g==='floor'?12:10);
  }else if(eq==='db'){front+=dbAt(W,P.front?90:0);if(twoHands||P.front)front+=dbAt(W2,P.front?90:0)}
  else if(eq==='kb'){front+=kbAt(W);if(P.front)front+=kbAt(W2)}
  else if(eq==='pl')front+=plateAt(W);
  return {back,front};
}

window.exIllu=function(e,size=48){
  const P=poseFor(e),{back,front}=dress(P,e);
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" style="display:block">${floor}${back}${figure(P)}${front}</svg>`;
};

/* ---------- equipment icons ---------- */
window.EQUIP_ICON={
  none:`<svg viewBox="0 0 100 100"><rect x="14" y="58" width="60" height="16" rx="3" fill="#8b5cf6" transform="skewX(-20)"/><circle cx="74" cy="60" r="16" fill="#7c3aed"/><circle cx="74" cy="60" r="11" fill="#8b5cf6"/><circle cx="74" cy="60" r="6" fill="#6d28d9"/><circle cx="74" cy="60" r="2" fill="#4c1d95"/>${L([30,22],[70,22],5,'#64748b')}${L([34,22],[34,40],4,'#475569')}${L([66,22],[66,40],4,'#475569')}</svg>`,
  small:`<svg viewBox="0 0 100 100">${dbAt([42,40],-25).replace('rotate(-25)','rotate(-25) scale(2.6)')}${dbAt([58,66],-25).replace('rotate(-25)','rotate(-25) scale(2.6)')}</svg>`,
  bars:`<svg viewBox="0 0 100 100"><g transform="rotate(-35 50 50)">${barH(14,86,50)}</g></svg>`,
  weighted:`<svg viewBox="0 0 100 100"><path d="M24 30 Q50 64 76 30" fill="none" stroke="#1f2937" stroke-width="7" stroke-linecap="round"/><path d="M50 50 L50 60" stroke="#94a3b8" stroke-width="3"/>${O([50,72],16,C.p1,'stroke="#0f172a" stroke-width="2"')}${O([50,72],4,'#0f172a')}</svg>`,
  smith:`<svg viewBox="0 0 100 100">${rails}${barH(14,86,40)}<rect x="10" y="88" width="80" height="6" rx="3" fill="${C.frameD}"/></svg>`,
  machines:`<svg viewBox="0 0 100 100">${machineFrame}<rect x="18" y="62" width="40" height="8" rx="4" fill="${C.seat}"/><rect x="18" y="20" width="9" height="44" rx="4" fill="${C.seat}"/>${L([60,40],[72,40],4,C.frame)}${L([34,70],[34,92],4,C.frame)}</svg>`,
  cable:`<svg viewBox="0 0 100 100">${stack(50)}${O([50,12],5,C.frame)}${L([50,12],[24,46],2,C.cable)}${L([50,12],[76,46],2,C.cable)}<rect x="17" y="44" width="14" height="5" rx="2.5" fill="${C.p3}"/><rect x="69" y="44" width="14" height="5" rx="2.5" fill="${C.p3}"/></svg>`,
  bands:`<svg viewBox="0 0 100 100">${['#ef4444','#f59e0b','#22c55e','#3b82f6','#8b5cf6'].map((c,i)=>`<rect x="14" y="${22+i*12}" width="72" height="9" rx="4.5" fill="${c}" transform="rotate(-12 50 ${26+i*12})"/>`).join('')}</svg>`,
};
})();
