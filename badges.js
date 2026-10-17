// Godrank shared art: the 7 god-tier ranks, their crests, badges and the ranked bodygraph.
// Ladder runs from the 7th Great Power (North God) up to the 1st (Technique God).
(()=>{
window.RANKS = [
  {id:'north',     name:'North God',     jp:'北神', seat:7, hex:'#e8892f', dark:'#6e300a', light:'#ffc98a', lo:1,   hi:143,  tier:1, desc:'The 7th seat. Every ascent starts here. Raw strength, still finding its form.'},
  {id:'sword',     name:'Sword God',     jp:'剣神', seat:6, hex:'#c3cbd8', dark:'#525b6e', light:'#ffffff', lo:144, hi:286,  tier:2, desc:'The 6th seat. Clean, sharp technique on every rep.'},
  {id:'death',     name:'Death God',     jp:'死神', seat:5, hex:'#8a55ff', dark:'#1c0848', light:'#dccbff', lo:287, hi:429,  tier:3, desc:'The 5th seat. Stronger than most people in any gym.'},
  {id:'demon',     name:'Demon God',     jp:'魔神', seat:4, hex:'#ff3d55', dark:'#4d0710', light:'#ff9fab', lo:430, hi:572,  tier:4, desc:'The 4th seat and the first of the upper ranks. The gap from here up is huge.'},
  {id:'fighting',  name:'Fighting God',  jp:'闘神', seat:3, hex:'#f5c22f', dark:'#7d5000', light:'#fff2ad', lo:573, hi:715,  tier:5, desc:'The 3rd seat. Armor-plated, competition-level strength.'},
  {id:'dragon',    name:'Dragon God',    jp:'龍神', seat:2, hex:'#38dcbc', dark:'#075a4b', light:'#c9fff3', lo:716, hi:858,  tier:6, desc:'The 2nd seat. Elite strength, measured against the best in the world.'},
  {id:'technique', name:'Technique God', jp:'技神', seat:1, hex:'#62d2ff', dark:'#164f8f', light:'#efffff', lo:859, hi:1000, tier:7, desc:'The 1st seat. The top of the ladder. Nobody has ever been pushed off it.'},
];

window.rankFor = function(rating){
  const r = RANKS.find(x => rating <= x.hi) || RANKS[6];
  const span = (r.hi - r.lo + 1) / 3;
  const d = Math.max(0, Math.min(2, Math.floor((rating - r.lo) / span)));
  const lp = Math.max(0, Math.min(99, Math.round(((rating - r.lo) - d*span) / span * 100)));
  return {rank:r, div:['I','II','III'][d], lp};
};

/* ---- the seven crests, drawn on a 100x100 grid ---- */
window.EMBLEMS = {
  north: `<path d="M50 4 L61 27 L50 37 L39 27Z M50 14 L56 27 L50 32 L44 27Z"/>
    <path d="M47 39 L20 20 L28 47Z M53 39 L80 20 L72 47Z M27 49 L6 41 L24 58Z M73 49 L94 41 L76 58Z"/>
    <path d="M22 50 L78 50 L50 80Z M35 56 L65 56 L50 71Z"/>
    <path d="M45 62 H55 V84 H45Z M38 82 H62 V88 H38Z"/><circle cx="50" cy="94" r="4.5"/>`,
  sword: `<path d="M60 3 C28 32 26 70 76 98 C54 76 48 50 62 27 L67 31 L64 19Z"/>
    <path d="M54 46 L73 39 L58 55Z M55 61 L77 58 L60 68Z M61 75 L84 76 L67 82Z"/>`,
  death: `<path d="M28 34 A22 22 0 1 1 72 34 L63 34 A13 13 0 1 0 37 34Z"/><circle cx="50" cy="32" r="6"/>
    <path d="M45 46 H55 L58 78 L50 95 L42 78Z"/>
    <path d="M43 52 C30 38 10 46 15 61 C19 72 33 71 35 62 C28 63 25 57 31 54 C36 51 40 55 43 58Z"/>
    <path d="M57 52 C70 38 90 46 85 61 C81 72 67 71 65 62 C72 63 75 57 69 54 C64 51 60 55 57 58Z"/>
    <path d="M43 70 C34 74 26 84 32 90 C30 82 38 78 44 78Z M57 70 C66 74 74 84 68 90 C70 82 62 78 56 78Z"/>`,
  demon: `<path fill-rule="evenodd" d="M10 52 Q50 20 90 52 Q50 82 10 52Z M22 52 Q50 32 78 52 Q50 70 22 52Z"/>
    <circle cx="50" cy="51" r="11"/><circle cx="50" cy="51" r="5" fill="var(--bgc,#000)"/>
    <circle cx="8" cy="52" r="5"/><circle cx="92" cy="52" r="5"/>
    <path d="M47 4 L53 4 L50 26Z M20 14 L25 11 L34 31Z M80 14 L75 11 L66 31Z M6 30 L9 25 L24 38Z M94 30 L91 25 L76 38Z"/>
    <path d="M47 72 L53 72 L50 97Z M28 76 L33 79 L24 92Z M72 76 L67 79 L76 92Z"/>`,
  fighting: `<path fill-rule="evenodd" d="M10 36 L50 16 L90 36 L78 42 L78 74 L50 94 L22 74 L22 42Z M32 44 H68 V70 L50 83 L32 70Z"/>
    <path d="M27 31 L18 10 L40 25Z M73 31 L82 10 L60 25Z"/>
    <path d="M36 47 H45 L43 75 L36 69Z M64 47 H55 L57 75 L64 69Z M47 47 H53 L54 72 L50 79 L46 72Z"/>`,
  dragon: `<path d="M14 72 L26 60 L16 55 L32 50 L26 40 L42 42 L44 27 L56 36 L66 14 L70 32 L90 22 L80 41 L96 44 L80 54 L88 68 L70 63 L68 82 L56 70 L50 88 L44 72 L32 82 L34 68Z"/>
    <path d="M40 50 L54 46 L48 56Z" fill="var(--bgc,#000)"/>`,
  technique: `<path fill-rule="evenodd" d="M50 10 C60 24 60 40 50 50 C40 40 40 24 50 10Z M50 22 C54 30 54 36 50 41 C46 36 46 30 50 22Z"/>
    <path d="M44 14 C38 6 30 6 26 11 C33 11 37 15 40 21Z M56 14 C62 6 70 6 74 11 C67 11 63 15 60 21Z"/>
    <path d="M48 52 C34 36 18 34 4 41 C20 42 33 49 45 58Z M52 52 C66 36 82 34 96 41 C80 42 67 49 55 58Z"/>
    <path d="M47 58 C32 60 18 69 10 80 C27 72 39 68 48 64Z M53 58 C68 60 82 69 90 80 C73 72 61 68 52 64Z"/>
    <path d="M45 58 H55 L50 86Z"/>`,
  pendant: `<path d="M30 8 Q50 30 70 8" fill="none" stroke="currentColor" stroke-width="4"/>
    <path d="M50 26 L70 50 L50 94 L30 50Z M50 40 L60 52 L50 76 L40 52Z" fill-rule="evenodd"/><circle cx="50" cy="52" r="5"/>`,
};
window.emblem = function(key, size=40, color='currentColor'){
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" fill="${color}" style="color:${color}">${EMBLEMS[key]||''}</svg>`;
};

/* ---- badges ---- */
let _bid = 0;
const hexPts=(cx,cy,R)=>Array.from({length:6},(_,i)=>{const a=-Math.PI/2+i*Math.PI/3;return [cx+R*Math.cos(a),cy+R*Math.sin(a)]});
const P=a=>a.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');

function feathers(id, n, len, rise, tipCol){
  // broad layered blades sweeping out from the hex flanks, top feather longest
  let out='';
  for(const s of [-1,1]){
    for(let i=n-1;i>=0;i--){
      const ax=64+s*24, ay=50+i*9;
      const L=len*(1-i*0.16), r=rise*(1-i*0.35);
      const tx=ax+s*L, ty=ay-r;
      const w=7.5-i*0.5;
      const d=`M${ax} ${ay-w} C${ax+s*L*0.45} ${ay-w-r*0.55} ${tx-s*L*0.18} ${ty-3} ${tx} ${ty} C${tx-s*L*0.2} ${ty+w*0.9} ${ax+s*L*0.4} ${ay+w*0.8} ${ax} ${ay+w}Z`;
      out+=`<path d="${d}" fill="url(#${id}f)" stroke="${tipCol}" stroke-width="1" stroke-opacity=".55"/>`+
           `<path d="M${ax} ${ay-w} C${ax+s*L*0.45} ${ay-w-r*0.55} ${tx-s*L*0.18} ${ty-3} ${tx} ${ty}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.2"/>`;
    }
  }
  return out;
}
function thorns(id){
  // jagged dark wings for the Demon God tier (Titan style)
  let o='';
  for(const s of [-1,1]){
    const x=v=>64+s*v;
    o+=`<path d="M${x(28)} 54 C${x(44)} 40 ${x(52)} 30 ${x(58)} 14 L${x(54)} 30 C${x(60)} 26 ${x(64)} 22 ${x(62)} 12 C${x(70)} 30 ${x(60)} 44 ${x(48)} 52 C${x(58)} 50 ${x(64)} 56 ${x(62)} 68 C${x(56)} 58 ${x(48)} 58 ${x(40)} 62 C${x(48)} 66 ${x(52)} 74 ${x(48)} 84 C${x(44)} 72 ${x(38)} 68 ${x(30)} 68Z" fill="url(#${id}t)" stroke="#ff3d55" stroke-width="1" stroke-opacity=".7"/>`;
  }
  return o;
}


/* ---- per-tier glow & animation (SVG SMIL, so it works anywhere the SVG is inlined) ---- */
const AN=(attr,vals,dur,extra='')=>`<animate attributeName="${attr}" values="${vals}" dur="${dur}s" repeatCount="indefinite" ${extra}/>`;
const SPIN=(dur,from=0,to=360,c='0 0')=>`<animateTransform attributeName="transform" type="rotate" from="${from} ${c}" to="${to} ${c}" dur="${dur}s" repeatCount="indefinite"/>`;
function rnd(seed){let x=Math.sin(seed)*1e4;return x-Math.floor(x)}
function sparkle(x,y,sz,col,dur,begin){
  return `<g transform="translate(${x} ${y})"><path d="M0 -${sz} L${sz*.22} -${sz*.22} L${sz} 0 L${sz*.22} ${sz*.22} L0 ${sz} L-${sz*.22} ${sz*.22} L-${sz} 0 L-${sz*.22} -${sz*.22}Z" fill="${col}" opacity="0">
   ${AN('opacity','0;1;0',dur,`begin="${begin}s"`)}<animateTransform attributeName="transform" type="scale" values=".2;1.1;.2" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/></path></g>`;
}
function particle(x0,y0,x1,y1,rad,col,dur,begin,glowId){
  return `<circle r="${rad}" fill="${col}" ${glowId?`filter="url(#${glowId})"`:''} opacity="0">
   <animate attributeName="cx" values="${x0};${x1}" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>
   <animate attributeName="cy" values="${y0};${y1}" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>
   <animate attributeName="opacity" values="0;1;.8;0" keyTimes="0;.15;.7;1" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/></circle>`;
}
function fxLayers(id,r,outer){
  const t=r.tier,h=r.hex,l=r.light,k=r.dark;
  const glowCol={1:'#ff9a3d',2:'#e8f1ff',3:'#9a5cff',4:'#ff4a1c',5:'#ffd54a',6:'#3dffd2',7:'#9fe8ff'}[t];
  let defs=`<filter id="${id}bl" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="${t>=5?9:7}"/></filter>
    <filter id="${id}sb" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="1.6"/></filter>
    <clipPath id="${id}cl"><polygon points="${P(outer)}"/></clipPath>
    <linearGradient id="${id}gl" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity="${t===7?.95:.75}"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`;
  // soft pulsing glow behind every badge
  let under=`<g filter="url(#${id}bl)"><polygon points="${P(outer)}" fill="${glowCol}" transform="translate(64 64) scale(${t>=5?1.18:1.08}) translate(-64 -64)">${AN('opacity',t>=5?'.55;1;.55':'.35;.75;.35',t===4?1.4:2.8)}</polygon></g>`;
  // metallic glint sweeping across the hex
  const glintDur={1:3.6,2:2.6,3:4,4:3.4,5:2.8,6:3,7:2.2}[t];
  let over=`<g clip-path="url(#${id}cl)"><rect x="-60" y="-20" width="${t===2?14:20}" height="170" fill="url(#${id}gl)" transform="rotate(24 64 64)">${AN('x','-60;-60;160',glintDur,'keyTimes="0;.55;1"')}</rect></g>`;
  let shake='';

  if(t===1){ over+=sparkle(92,40,5,'#ffe2b0',2.4,.6); }
  if(t===2){ over+=sparkle(38,38,6,'#fff',1.9,0)+sparkle(94,84,4.5,'#fff',1.9,1); }
  if(t===3){ // dark void vortex behind
    defs+=`<radialGradient id="${id}vd"><stop offset="0" stop-color="#05010d" stop-opacity="1"/><stop offset=".55" stop-color="#1a0640" stop-opacity=".95"/><stop offset=".8" stop-color="#7a3dff" stop-opacity=".55"/><stop offset="1" stop-color="#7a3dff" stop-opacity="0"/></radialGradient>`;
    let arms='';for(let i=0;i<5;i++)arms+=`<path d="M0 0 C18 -8 36 2 46 24" fill="none" stroke="#b48cff" stroke-width="${2.4-i*.25}" stroke-linecap="round" opacity=".7" transform="rotate(${i*72})"/>`;
    under=`<g transform="translate(64 64)"><circle r="60" fill="url(#${id}vd)">${AN('r','56;62;56',3)}</circle><g>${arms}${SPIN(7,360,0)}</g><g opacity=".5" transform="scale(.6)">${arms}${SPIN(4.5)}</g></g>`+under;
    for(let i=0;i<5;i++){const a=rnd(i+3)*6.28;over+=particle(64+Math.cos(a)*52,64+Math.sin(a)*52,64,64,1.6,'#d6c2ff',2.2,i*.45,`${id}sb`);}
    over+=sparkle(40,46,5,'#e9dcff',2.6,.4);
  }
  if(t===4){ // fire licking up behind, embers rising, lava dripping
    defs+=`<linearGradient id="${id}fl" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff2a00"/><stop offset=".45" stop-color="#ff7a00"/><stop offset=".8" stop-color="#ffd23a" stop-opacity=".9"/><stop offset="1" stop-color="#fff2a0" stop-opacity="0"/></linearGradient>`;
    let fl='';[[34,26,1.0],[48,40,.8],[64,46,.9],[80,40,.75],[94,26,.95],[24,16,1.1],[104,16,1.05]].forEach(([x,hgt,d],i)=>{
      fl+=`<g transform="translate(${x} 56)"><path d="M-9 0 Q-12 -${hgt*.5} 0 -${hgt} Q12 -${hgt*.5} 9 0Z" fill="url(#${id}fl)" opacity=".9">
        <animateTransform attributeName="transform" type="scale" values="1 1;1.1 1.3;.9 .85;1 1" dur="${d}s" repeatCount="indefinite"/></path></g>`;});
    under=`<g filter="url(#${id}sb)">${fl}</g>`+under;
    for(let i=0;i<7;i++){const x=30+rnd(i+1)*68;over+=particle(x,50,x+(rnd(i+9)-.5)*24,-6,1.4+rnd(i)*1,i%2?'#ffb03a':'#ff5a1f',1.6+rnd(i+4),i*.3,`${id}sb`);}
    for(let i=0;i<2;i++){const x=58+i*12;over+=particle(x,104,x,124,1.8,'#ff4a1c',1.8,i*.9,`${id}sb`);}
  }
  if(t===5){ // angelic gold: rotating light rays, halo, rising light motes
    defs+=`<radialGradient id="${id}ry"><stop offset=".2" stop-color="#fff4c2" stop-opacity=".9"/><stop offset="1" stop-color="#ffd54a" stop-opacity="0"/></radialGradient>`;
    let rays='';for(let i=0;i<12;i++)rays+=`<path d="M-3 0 L0 -70 L3 0Z" fill="url(#${id}ry)" transform="rotate(${i*30})"/>`;
    under=`<g transform="translate(64 64)" opacity=".75"><g>${rays}${SPIN(14)}</g></g>`+under;
    over+=`<ellipse cx="64" cy="14" rx="20" ry="5" fill="none" stroke="#fff1a8" stroke-width="2.4" filter="url(#${id}sb)">${AN('opacity','.5;1;.5',2.2)}</ellipse><ellipse cx="64" cy="14" rx="20" ry="5" fill="none" stroke="#fffbe6" stroke-width="1.2"/>`;
    for(let i=0;i<6;i++){const x=24+rnd(i+2)*80;over+=particle(x,96,x+(rnd(i+7)-.5)*14,20,1.6,'#fff6c8',2.6,i*.45,`${id}sb`);}
    over+=sparkle(30,40,6,'#fff',2,.2)+sparkle(100,46,5,'#fff',2,1.1);
  }
  if(t===6){ // jade ember spirit: glowing void feathers falling from the wings
    for(let i=0;i<6;i++){const side=i%2?1:-1,x=64+side*(36+rnd(i+1)*22),y=44+rnd(i+5)*14,d=2.6+rnd(i+3)*1.2;
      over+=`<g opacity="0"><path d="M0 -6 C4 -2 4 3 0 7 C-4 3 -4 -2 0 -6Z" fill="#021a15" stroke="#5fffe0" stroke-width="1.2" filter="url(#${id}sb)"/><path d="M0 -6 C4 -2 4 3 0 7 C-4 3 -4 -2 0 -6Z" fill="#031d18" stroke="#c9fff3" stroke-width=".6"/>
        <animateTransform attributeName="transform" type="translate" values="${x} ${y};${x+side*8} ${y+30};${x-side*4} ${y+62}" dur="${d}s" begin="${i*.55}s" repeatCount="indefinite"/>
        ${AN('opacity','0;1;1;0',d,`keyTimes="0;.12;.7;1" begin="${i*.55}s"`)}</g>`;}
    for(let i=0;i<5;i++){const x=34+rnd(i+11)*60;over+=particle(x,80,x+(rnd(i)-.5)*20,10,1.3,i%2?'#ffb070':'#7affe4',2.2,i*.5,`${id}sb`);}
  }
  if(t===7){ // extreme crystal: prismatic glint, sparkles, and a periodic strike that crystal shards repel
    defs=defs.replace(`<stop offset=".5" stop-color="#fff" stop-opacity=".95"/>`,`<stop offset=".35" stop-color="#ffd6f6" stop-opacity=".8"/><stop offset=".5" stop-color="#fff" stop-opacity=".95"/><stop offset=".65" stop-color="#c6f4ff" stop-opacity=".8"/>`);
    const T=3.6, kt='0;.62;.66;.7;.74;.78;1';
    shake=`<animateTransform attributeName="transform" type="translate" values="0 0;0 0;-3 2;3 -2;-1.5 1;0 0;0 0" keyTimes="${kt}" dur="${T}s" repeatCount="indefinite"/>`;
    const shard=hexPts(64,64,44), shard2=hexPts(64,64,52);
    let shards='';for(let i=0;i<6;i++)shards+=`<polygon points="${P([shard[i],shard[(i+1)%6],shard2[(i+1)%6],shard2[i]])}" fill="#bff3ff" fill-opacity=".35" stroke="#fff" stroke-width="1.2"/>`;
    over+=`<path d="M128 -6 L100 30 L108 32 L80 58" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round" filter="url(#${id}sb)" opacity="0">${AN('opacity','0;0;1;0;0',T,'keyTimes="0;.6;.65;.7;1"')}</path>
      <circle cx="80" cy="54" r="6" fill="#fff" opacity="0" filter="url(#${id}sb)">${AN('opacity','0;0;1;0;0',T,'keyTimes="0;.62;.66;.72;1"')}${AN('r','4;4;14;22;22',T,'keyTimes="0;.62;.66;.72;1"')}</circle>
      <g opacity="0">${shards}${AN('opacity','0;0;1;.8;0;0',T,'keyTimes="0;.64;.68;.78;.9;1"')}</g>
      <circle cx="64" cy="64" r="36" fill="none" stroke="#dff8ff" stroke-width="2.5" opacity="0">${AN('r','36;36;36;74;74',T,'keyTimes="0;.66;.67;.85;1"')}${AN('opacity','0;0;.9;0;0',T,'keyTimes="0;.66;.67;.85;1"')}</circle>`;
    over+=sparkle(28,30,7,'#fff',1.6,0)+sparkle(102,92,6,'#ffe9a8',1.6,.5)+sparkle(100,24,5,'#c6f4ff',1.6,1)+sparkle(26,96,5,'#fff',1.6,1.3);
  }
  return {defs,under,over,shake};
}

window.badge = function(r, size=56, anim=size>=48){
  const id='b'+(_bid++), t=r.tier, h=r.hex, k=r.dark, l=r.light;
  const cx=64, cy=64, R=t===1?36:33;
  const outer=hexPts(cx,cy,R), inner=hexPts(cx,cy,R-8);
  // bevel facets, lit from the top-left
  const shade=[.55,.15,-.35,-.55,-.2,.35];
  let bevel='';
  for(let i=0;i<6;i++){
    const a=outer[i],b=outer[(i+1)%6],c=inner[(i+1)%6],d=inner[i];
    const s=shade[i], col=s>0?l:k;
    bevel+=`<polygon points="${P([a,b,c,d])}" fill="${h}"/><polygon points="${P([a,b,c,d])}" fill="${col}" opacity="${Math.abs(s)}"/>`;
  }
  // gem facets inside
  const g=hexPts(cx,cy,R-8), gi=hexPts(cx,cy,(R-8)*0.45);
  let gem='';
  for(let i=0;i<6;i++){
    const s=[.5,.25,-.25,-.45,-.15,.3][i];
    gem+=`<polygon points="${P([g[i],g[(i+1)%6],gi[(i+1)%6],gi[i]])}" fill="${s>0?'#fff':k}" opacity="${Math.abs(s)*0.55}"/>`;
  }
  let back='', front='';
  if(t===2){ // small side fins (Silver)
    for(const s of [-1,1]) back+=`<path d="M${cx+s*28} 56 L${cx+s*44} 50 L${cx+s*38} 64 L${cx+s*44} 72 L${cx+s*28} 72Z" fill="url(#${id}f)" stroke="${k}" stroke-width="1"/>`;
  }
  if(t===3) back=feathers(id,2,30,10,k);
  if(t===4){ back=thorns(id);
    for(const s of [-1,1]) front+=`<path d="M${cx+s*14} 36 C${cx+s*20} 22 ${cx+s*30} 16 ${cx+s*40} 16 C${cx+s*30} 22 ${cx+s*26} 30 ${cx+s*24} 40Z" fill="${k}" stroke="${h}" stroke-width="1.2"/>`; }
  if(t===5) back=feathers(id,3,40,16,k);
  if(t===6){ back=feathers(id,4,46,22,k);
    for(const s of [-1,1]) front+=`<path d="M${cx+s*10} 34 C${cx+s*14} 18 ${cx+s*24} 10 ${cx+s*34} 6 C${cx+s*28} 16 ${cx+s*24} 26 ${cx+s*22} 38Z" fill="url(#${id}f)" stroke="${k}" stroke-width="1"/>`; }
  if(t===7){ back=`<circle cx="${cx}" cy="${cy}" r="56" fill="url(#${id}halo)"/>`+feathers(id,5,52,28,'#d9a520')+
      `<path d="M104 4 L84 44 L94 44 L72 78 L80 50 L70 50Z" fill="#ffd34d" stroke="#fff6c2" stroke-width="1.2"/>`+
      `<path d="M30 112 L42 92 L38 104 L50 96Z" fill="#ffd34d" opacity=".9"/>`;
    front=`<path d="M${cx-12} 30 L${cx-6} 22 L${cx} 30 L${cx+6} 22 L${cx+12} 30 L${cx+10} 34 H${cx-10}Z" fill="#ffd34d" stroke="#8a5a00" stroke-width="1"/>`; }
  // tail ribbon under the hex for tiers 3+
  const tail = t>=3 ? `<path d="M${cx-11} ${cy+R-6} H${cx+11} V${cy+R+12} L${cx} ${cy+R+6} L${cx-11} ${cy+R+12}Z" fill="${k}" stroke="${h}" stroke-width="1.2"/>` : '';
  const trim = t===7 ? `<polygon points="${P(outer)}" fill="none" stroke="#ffd34d" stroke-width="2.4"/>` : '';
  const emSize=t===1?46:42;
  const F=anim?fxLayers(id,r,outer):{defs:'',under:'',over:'',shake:''};
  return `<svg viewBox="-14 -10 156 156" width="${size}" height="${size}" class="bdg" overflow="visible" aria-label="${r.name}">
  <defs>
   <linearGradient id="${id}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${l}"/><stop offset=".45" stop-color="${h}"/><stop offset="1" stop-color="${k}"/></linearGradient>
   <linearGradient id="${id}t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a0308"/><stop offset=".6" stop-color="#6b0a18"/><stop offset="1" stop-color="#14020a"/></linearGradient>
   <radialGradient id="${id}g" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="${l}"/><stop offset=".45" stop-color="${h}"/><stop offset="1" stop-color="${k}"/></radialGradient>
   <radialGradient id="${id}halo"><stop offset=".4" stop-color="${h}" stop-opacity=".45"/><stop offset="1" stop-color="${h}" stop-opacity="0"/></radialGradient>
   ${F.defs}
  </defs>
  ${F.under}<g>${F.shake}
  ${back}${tail}
  <polygon points="${P(outer)}" fill="${k}" transform="translate(0 3)" opacity=".7"/>
  ${bevel}
  <polygon points="${P(inner)}" fill="url(#${id}g)"/>${gem}
  <polygon points="${P(outer)}" fill="none" stroke="${k}" stroke-width="1.5"/>${trim}
  <g transform="translate(${cx-emSize/2} ${cy-emSize/2+1}) scale(${emSize/100})" fill="${k}" opacity=".55" style="--bgc:${h}"><g transform="translate(2 3)">${EMBLEMS[r.id]}</g></g>
  <g transform="translate(${cx-emSize/2} ${cy-emSize/2+1}) scale(${emSize/100})" fill="#fff" style="--bgc:${h}">${EMBLEMS[r.id]}</g>
  ${front}${F.over}</g></svg>`;
};

/* ---- ranked bodygraph (front + back), Liftoff-style light figure ---- */
// left half on a 200x400 canvas; the right half is mirrored
const SIL='M100 66 L90 68 C80 74 66 75 57 80 C47 85 43 97 43 112 L40 150 C38 166 35 186 33 205 C29 212 25 222 27 233 L36 235 C40 224 42 215 45 208 C49 189 52 171 55 152 L58 124 C60 142 62 162 66 182 C64 193 62 201 62 211 C60 241 61 270 66 292 C64 320 66 345 69 368 L65 384 C65 390 69 393 80 393 L90 393 C93 387 91 378 88 368 C90 345 92 320 93 296 C95 270 97 242 98 218 L100 216Z';
const BODY = {
  front: [
    ['traps','M90 70 C82 75 72 77 62 80 C74 82 84 84 93 87Z'],
    ['shoulders','M58 81 C48 85 44 97 44 113 C48 119 54 121 58 118 C60 104 64 92 70 86Z'],
    ['chest','M71 86 C80 84 92 84 99 86 V118 C90 123 78 123 68 116 C62 108 62 96 71 86Z'],
    ['biceps','M44 115 C42 128 42 140 44 150 C50 154 56 150 58 140 C58 130 58 124 57 120Z'],
    ['forearms','M44 152 C40 170 36 188 34 204 L44 206 C48 188 52 170 56 152Z'],
    ['core','M66 121 C68 140 68 160 70 180 C72 190 76 198 82 205 L84 191 C78 171 76 150 76 124Z'],
    ['core','M80 124 H98 V140 H81Z'],['core','M81 142 H98 V158 H82Z'],['core','M82 160 H98 V176 H83Z'],
    ['core','M83 178 H98 V207 C92 205 86 199 84 193Z'],
    ['quads','M64 214 C60 240 62 268 70 288 L78 290 C76 262 78 236 82 216 C76 210 70 208 64 214Z'],
    ['quads','M83 216 C79 238 79 262 81 290 C86 292 91 290 93 284 C95 262 95 240 92 222Z'],
    ['quads','M93 220 C96 222 97 224 97 228 L96 252 C95 242 94 232 93 224Z'],
    ['calves','M68 300 C66 320 68 345 72 362 L79 362 C79 340 81 318 83 300Z'],
    ['calves','M86 300 C90 320 90 345 87 362 L82 362 C82 340 84 318 86 300Z'],
  ],
  back: [
    ['traps','M100 64 L92 70 C82 75 70 77 62 80 C76 86 88 96 100 128Z'],
    ['shoulders','M58 81 C48 85 44 97 44 113 C48 119 54 121 58 118 C60 104 64 92 70 86Z'],
    ['triceps','M44 115 C42 130 42 142 46 152 C52 154 56 148 58 138 L57 120Z'],
    ['forearms','M44 154 C40 170 36 188 34 204 L44 206 C48 188 52 170 56 154Z'],
    ['back','M70 92 C66 118 68 150 74 172 C84 178 92 182 99 186 V132 C92 118 82 100 70 92Z'],
    ['back','M74 175 C76 187 78 196 80 203 H99 V189 C90 185 82 181 74 175Z'],
    ['glutes','M64 207 C62 223 66 237 78 243 C90 245 98 241 99 233 V205Z'],
    ['hams','M66 245 C64 263 66 281 72 292 L81 292 C81 272 80 258 80 247Z'],
    ['hams','M82 247 C88 263 92 279 92 292 L96 290 C97 270 96 256 96 245Z'],
    ['calves','M68 300 C62 318 66 336 76 347 L83 343 C85 327 85 313 83 300Z'],
    ['calves','M86 300 C92 314 92 330 88 343 L91 347 C96 331 96 313 92 300Z'],
  ],
};
const HEAD = side => side==='front' ? `
  <ellipse cx="100" cy="34" rx="17" ry="21" fill="#dcdced"/>
  <ellipse cx="82" cy="37" rx="3.5" ry="5" fill="#d2d2e4"/><ellipse cx="118" cy="37" rx="3.5" ry="5" fill="#d2d2e4"/>
  <path d="M83 28 C82 12 92 8 100 9 C110 8 119 12 117 28 C114 21 108 18 100 19 C92 18 86 21 83 28Z" fill="#c9c9dc"/>
  <circle cx="93" cy="35" r="2.4" fill="#8b8aa3"/><circle cx="107" cy="35" r="2.4" fill="#8b8aa3"/>
  <path d="M93 44 Q100 50 107 44" stroke="#8b8aa3" stroke-width="2" fill="none" stroke-linecap="round"/>` : `
  <ellipse cx="82" cy="37" rx="3.5" ry="5" fill="#d2d2e4"/><ellipse cx="118" cy="37" rx="3.5" ry="5" fill="#d2d2e4"/>
  <ellipse cx="100" cy="34" rx="17" ry="21" fill="#c9c9dc"/>`;
window.MUSCLE_NAMES={chest:'Chest',shoulders:'Shoulders',traps:'Traps',biceps:'Biceps',triceps:'Triceps',forearms:'Forearms',core:'Core',back:'Back',glutes:'Glutes',quads:'Quads',hams:'Hamstrings',calves:'Calves'};
// colorOf(muscle) -> hex, or null when unranked
window.bodygraph = function(side, colorOf, height=320){
  const half=BODY[side].map(([m,d])=>`<path d="${d}" fill="${colorOf(m)||'#c6c7da'}" stroke="#e9e9f5" stroke-width="1.3" stroke-linejoin="round"/>`).join('');
  const sil=`<path d="${SIL}" fill="#c6c7da"/>`;
  return `<svg viewBox="22 4 156 392" height="${height}" style="display:block;margin:0 auto">
   ${HEAD(side)}<path d="M90 52 H110 L111 72 H89Z" fill="#cfd0e1"/>
   ${sil}<g transform="translate(200 0) scale(-1 1)">${sil}</g>
   <path d="M30 222 C28 228 30 234 36 235 C40 224 42 215 45 208 L34 205 C31 210 29 216 30 222Z" fill="#dcdced"/>
   <path d="M170 222 C172 228 170 234 164 235 C160 224 158 215 155 208 L166 205 C169 210 171 216 170 222Z" fill="#dcdced"/>
   <path d="M66 372 L65 384 C65 390 69 393 80 393 L90 393 C93 387 91 378 88 370Z M134 372 L135 384 C135 390 131 393 120 393 L110 393 C107 387 109 378 112 370Z" fill="#dcdced"/>
   <g>${half}</g><g transform="translate(200 0) scale(-1 1)">${half}</g>
   <path d="M100 ${side==='front'?86:64} V${side==='front'?207:203}" stroke="#e9e9f5" stroke-width="1.3"/></svg>`;
};
})();
