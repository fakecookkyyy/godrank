// Godrank anatomy: the anime anatomy image with muscle regions traced on top (image px coords, 1712x1152).
// Only the figure's left half is traced; the right half is mirrored around a center line.
(()=>{
const F={cx:513, limbCx:506, regions:{
  traps:[[506,240],[470,250],[440,262],[470,266],[506,264]],
  shoulders:[[392,264],[376,273],[365,300],[363,330],[369,358],[381,370],[394,355],[400,330],[406,305],[402,282]],
  chest:[[509,264],[470,262],[430,272],[410,300],[410,322],[428,342],[460,356],[490,360],[509,352]],
  biceps:[[380,374],[369,382],[359,410],[350,450],[347,480],[355,492],[375,492],[392,478],[400,445],[408,410],[410,386],[396,374]],
  forearms:[[347,496],[340,520],[334,560],[333,588],[344,597],[360,595],[372,580],[384,540],[394,505],[392,496]],
  core:[[511,362],[485,362],[472,372],[468,400],[470,440],[476,470],[488,488],[511,500]],
  obliques:[[434,347],[468,362],[466,400],[468,440],[474,470],[468,500],[450,508],[436,490],[432,450],[428,410],[430,375]],
  quads:[[434,508],[424,560],[412,620],[407,680],[412,730],[430,762],[455,770],[478,762],[496,730],[502,680],[504,620],[506,594],[480,560],[458,528]],
  calves:[[431,792],[415,830],[411,880],[418,940],[429,995],[450,1004],[470,995],[478,940],[482,880],[478,830],[470,792]],
}, limbs:['shoulders','biceps','forearms','quads','calves']};
const B={cx:1180, limbCx:1177, regions:{
  traps:[[1180,242],[1160,244],[1120,262],[1078,282],[1074,300],[1092,312],[1130,345],[1180,405]],
  shoulders:[[1076,284],[1054,271],[1039,290],[1033,320],[1037,350],[1049,367],[1066,350],[1074,320]],
  triceps:[[1048,370],[1032,374],[1021,400],[1011,440],[1008,480],[1017,495],[1040,498],[1054,480],[1062,440],[1070,400],[1072,376]],
  forearms:[[1009,497],[1001,530],[996,570],[996,592],[1010,598],[1026,592],[1036,560],[1048,520],[1052,500]],
  back:[[1092,314],[1130,347],[1180,407],[1180,440],[1150,470],[1128,498],[1110,470],[1098,430],[1086,390],[1080,345]],
  lowerback:[[1180,442],[1152,472],[1130,500],[1180,505]],
  glutes:[[1180,507],[1120,502],[1102,520],[1096,560],[1104,600],[1130,615],[1165,612],[1180,600]],
  hams:[[1102,617],[1092,640],[1083,690],[1081,740],[1092,780],[1120,790],[1150,785],[1170,760],[1176,700],[1178,640],[1170,617]],
  calves:[[1097,802],[1079,830],[1072,870],[1083,910],[1105,925],[1130,920],[1150,900],[1154,860],[1146,820],[1130,802]],
}, limbs:['shoulders','triceps','forearms','hams','calves']};
// muscle groups used by the app -> anatomy regions
const GROUP={chest:['F.chest'],shoulders:['F.shoulders','B.shoulders'],traps:['F.traps','B.traps'],biceps:['F.biceps'],triceps:['B.triceps'],
  forearms:['F.forearms','B.forearms'],core:['F.core','F.obliques'],back:['B.back','B.lowerback'],glutes:['B.glutes'],quads:['F.quads'],hams:['B.hams'],calves:['F.calves','B.calves']};
window.MUSCLE_NAMES={chest:'Chest',shoulders:'Shoulders',traps:'Traps',biceps:'Biceps',triceps:'Triceps',forearms:'Forearms',core:'Core',back:'Back',glutes:'Glutes',quads:'Quads',hams:'Hamstrings',calves:'Calves'};
window.MUSCLES=Object.keys(GROUP);

function polys(fig){
  const out=[];
  for(const [k,p] of Object.entries(fig.regions)){
    const c=fig.limbs.includes(k)?fig.limbCx:fig.cx;
    out.push([k,p],[k,p.map(([x,y])=>[2*c-x,y])]);
  }
  return out;
}
const FP=polys(F),BP=polys(B);
const toD=p=>'M'+p.map(q=>q.join(' ')).join('L')+'Z';
let uid=0;
// grey-ish rank colors (Sword God silver) vanish on the grey body: tint them steel blue so they still read as colored
const vivid=h=>{const c=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),mx=Math.max(...c),mn=Math.min(...c);
  if(mx-mn>40)return h;return '#'+c.map((v,i)=>Math.round(v*.45+[110,160,235][i]*.55).toString(16).padStart(2,'0')).join('')};
// darker tone of a #rrggbb color for muscle outlines
const shade=(h,f)=>'#'+[1,3,5].map(i=>Math.round(parseInt(h.slice(i,i+2),16)*f).toString(16).padStart(2,'0')).join('');
// colorOf(group) -> color or null; glow: Set of groups to pulse; view: 'both'|'front'|'back'
// viewBox zoomed onto one muscle group (used for the muscle filter tiles)
function focusBox(g){const rs=GROUP[g]||[];const front=rs.some(r=>r.startsWith('F.'));const pre=front?'F.':'B.',fig=front?FP:BP;
  const pts=fig.filter(([k])=>rs.includes(pre+k)).flatMap(([,p])=>p);if(!pts.length)return null;
  const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);let x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
  const s=Math.max(x1-x0,y1-y0)*1.35+40,cx=(x0+x1)/2,cy=(y0+y1)/2;return {vb:`${cx-s/2} ${cy-s/2} ${s} ${s}`,view:front?'front':'back'}}
window.anatomy=function({colorOf=()=>null,glow=new Set(),view='both',height=360,src='assets/anatomy.jpg',focus=null}={}){
  const id='an'+(uid++);const fb=focus&&focusBox(focus);if(fb)view=fb.view;
  const vb=fb?fb.vb:view==='front'?'290 10 450 1110':view==='back'?'955 10 450 1110':'280 10 1150 1110';
  const glowEl=d=>`<path d="${d}" fill-rule="evenodd" fill="#7cc4ff" fill-opacity=".18" stroke="#7cc4ff" stroke-width="7" filter="url(#${id}g)"><animate attributeName="opacity" values=".35;1;.35" dur="1.8s" repeatCount="indefinite"/></path><path d="${d}" fill-rule="evenodd" fill="none" stroke="#bfe4ff" stroke-width="2.5" stroke-opacity=".9"/>`;
  const region=(fig,prefix)=>{
    const sel={};for(const [g,list] of Object.entries(GROUP))for(const r of list)if(r.startsWith(prefix))(sel[r.slice(2)]||=[]).push(g);
    const SH=window.MUSCLE_SHAPES||{},done=new Set();
    return fig.map(([k,p])=>{const gs=sel[k]||[];const g=gs[0];let col=g&&colorOf(g);const gl=g&&glow.has(g);
      if(!col&&!gl)return '';
      // the cut-out shape covers both sides at once; fall back to the traced polygon
      let d=SH[prefix+k];if(d){if(done.has(k))return '';done.add(k)}else d=toD(p);
      // a rank color has its own painted body (assets/ranks/<rank>.jpg): show that painting cut to this muscle
      const rk=col&&(window.RANKS||[]).find(r=>r.hex===col);
      if(col)col=vivid(col);const dk=col&&shade(col,.5);
      if(rk){const cid=`${id}c${prefix[0]}${k}`;
        return `<clipPath id="${cid}"><path d="${d}" clip-rule="evenodd"/></clipPath><image href="assets/ranks/${rk.id}.jpg" x="0" y="0" width="1712" height="1152" clip-path="url(#${cid})"/><path d="${d}" fill="none" stroke="#05040a" stroke-width="1.5" stroke-opacity=".35" stroke-linejoin="round"/>`+
          (gl?glowEl(d):'')}
      return (col?`<path d="${d}" fill-rule="evenodd" fill="${col}" fill-opacity=".8"/><path d="${d}" fill-rule="evenodd" fill="${col}" fill-opacity=".45" style="mix-blend-mode:multiply"/><path d="${d}" fill="none" stroke="${dk}" stroke-width="2.5" stroke-opacity=".85" stroke-linejoin="round"/>`:'')+
        (gl?glowEl(d):'');}).join('');
  };
  return `<svg viewBox="${vb}" height="${height}" style="display:block;margin:0 auto;max-width:100%" aria-label="Muscle map">
   <defs><filter id="${id}g" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>
   <filter id="${id}k" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  2.2 2.6 1.2 0 -.42"/></filter>
   <linearGradient id="${id}fade" x1="0" y1="0" x2="0" y2="1"><stop offset=".8" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
   <mask id="${id}m"><rect x="0" y="0" width="1712" height="1152" fill="url(#${id}fade)"/></mask></defs>
   <g mask="url(#${id}m)"><image href="${src}" x="0" y="0" width="1712" height="1152" filter="url(#${id}k)"/>
   ${view!=='back'?region(FP,'F.'):''}${view!=='front'?region(BP,'B.'):''}</g></svg>`;
};
})();
