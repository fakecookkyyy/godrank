// Godrank Bodygraph: the Rudeus muscle map, every muscle painted live in the color of the rank it's at.
// assets/bodygraph/base.jpg = the drawing, labels.png = which muscle each pixel belongs to
// (value = 1 + muscle*6 + shading class, 255 = always grey, 0 = leave the drawing as is). Built by tools from piece.py.
(()=>{
const MUS=['chest','shoulders','traps','biceps','triceps','forearms','core','back','glutes','quads','hams','calves'];
const RL=[100.2,115.7,114.6,119.8,106.8,140.5]; // reference brightness of each original hue class
const LO=.14,HI=.32;
let src=null,loading=null;const cache=new Map();
function load(){if(src)return Promise.resolve(src);if(loading)return loading;
  const img=u=>new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src=u});
  return loading=Promise.all([img('assets/bodygraph/base.jpg'),img('assets/bodygraph/labels.png')]).then(([b,l])=>{
    const W=b.naturalWidth,H=b.naturalHeight,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d',{willReadFrequently:true});
    x.drawImage(b,0,0);const base=x.getImageData(0,0,W,H);x.clearRect(0,0,W,H);x.drawImage(l,0,0,W,H);const ld=x.getImageData(0,0,W,H).data;
    const lab=new Uint8Array(W*H);for(let i=0;i<lab.length;i++)lab[i]=ld[i*4];
    return src={W,H,base,lab}}).catch(e=>{loading=null;throw e})}
const hex=h=>h?[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)):null;
// paint the whole body for one set of muscle colors
function paint(cols,glow){const {W,H,base,lab}=src,out=new ImageData(new Uint8ClampedArray(base.data),W,H),d=out.data,o=base.data;
  const gl=glow.size?new ImageData(W,H):null,gd=gl?gl.data:null;const C=MUS.map(m=>hex(cols[m])),G=MUS.map(m=>glow.has(m));
  for(let p=0,i=0;p<lab.length;p++,i+=4){const v=lab[p];if(!v)continue;
    const r=o[i],g=o[i+1],b=o[i+2],lum=.3*r+.59*g+.11*b;
    if(v===255){d[i]=d[i+1]=d[i+2]=lum;continue}
    const mi=((v-1)/6)|0,t=C[mi];
    if(G[mi]){const q=i;gd[q]=124*.55+lum*.45;gd[q+1]=196*.55+lum*.45;gd[q+2]=255*.55+lum*.45;gd[q+3]=200}
    if(!t){d[i]=d[i+1]=d[i+2]=lum;continue} // unranked: plain grey
    const mx=Math.max(r,g,b),mn=Math.min(r,g,b),sat=(mx-mn)/(mx+1e-6);
    let f=lum/RL[(v-1)%6];f=f<.55?.55:f>1.25?1.25:f;let a=(sat-LO)/(HI-LO);a=a<0?0:a>1?1:a;
    d[i]=t[0]*f*a+lum*(1-a);d[i+1]=t[1]*f*a+lum*(1-a);d[i+2]=t[2]*f*a+lum*(1-a)}
  const c=document.createElement('canvas');c.width=W;c.height=H;c.getContext('2d').putImageData(out,0,0);if(gl){const g2=document.createElement('canvas');g2.width=W;g2.height=H;g2.getContext('2d').putImageData(gl,0,0);c._glow=g2}return c}
function key(cols,glow){return MUS.map(m=>cols[m]||'-').join()+'|'+MUS.filter(m=>glow.has(m)).join()}
function fill(){document.querySelectorAll('canvas.bgraph:not([data-done])').forEach(cv=>{const k=cv.dataset.k,j=cache.get(k);if(!j)return;
  cv.width=j.width;cv.height=j.height;cv.getContext('2d').drawImage(j,0,0);cv.dataset.done=1;cv.style.opacity=1;
  const gc=cv.nextElementSibling;if(j._glow&&gc&&gc.classList.contains('bgpulse')){gc.width=j.width;gc.height=j.height;gc.getContext('2d').drawImage(j._glow,0,0);gc.style.display='block'}})}
// muscle under a tap on a bodygraph canvas (null if none)
window.bodygraphHit=function(ev){if(!src)return null;const cv=ev.currentTarget,r=cv.getBoundingClientRect();
  const x=Math.floor((ev.clientX-r.left)/r.width*src.W),y=Math.floor((ev.clientY-r.top)/r.height*src.H);
  for(const [dx,dy] of [[0,0],[6,0],[-6,0],[0,6],[0,-6]]){const v=src.lab[(y+dy)*src.W+x+dx];if(v&&v!==255)return MUS[((v-1)/6)|0]}return null};
// colorOf(muscle) -> rank hex or null (unranked = grey); glow: muscles to pulse (today's workout)
window.bodygraph=function({colorOf=()=>null,glow=new Set(),onTap=''}={}){
  const cols={};MUS.forEach(m=>cols[m]=colorOf(m)||null);const k=key(cols,glow);
  const fxs=()=>window.BodyFX&&BodyFX.start(src,k,MUS.map(m=>cols[m]));
  setTimeout(()=>{if(cache.has(k)){fill();return fxs()}load().then(()=>{if(!cache.has(k)){if(cache.size>6)cache.delete(cache.keys().next().value);cache.set(k,paint(cols,glow))}fill();fxs()}).catch(()=>{})},0);
  return `<div style="position:relative;width:100%;aspect-ratio:3/2;border-radius:12px;overflow:hidden;background:#09122a">
    <canvas class="bgraph" data-k="${k.replace(/"/g,'')}" ${onTap?`onclick="${onTap}"`:''} aria-label="Bodygraph" style="position:absolute;inset:0;width:100%;height:100%;opacity:0;transition:opacity .15s;${onTap?'cursor:pointer':''}"></canvas>${(typeof S!=='undefined'&&S.bgfxOff)?'':`<canvas class="bgfx" data-k="${k.replace(/"/g,'')}" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none"></canvas>`}${glow.size?`<canvas class="bgpulse" style="position:absolute;inset:0;width:100%;height:100%;display:none;pointer-events:none;animation:bgpulse 1.8s ease-in-out infinite"></canvas>`:''}</div>`};
const st=document.createElement('style');st.textContent='@keyframes bgpulse{0%,100%{opacity:.08}50%{opacity:.75}}';document.head.appendChild(st);
})();
