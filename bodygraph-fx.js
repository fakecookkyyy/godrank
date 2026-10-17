// Godrank Bodygraph rank effects: each ranked muscle plays its rank's animation (Demon fire, Dragon feathers, ...),
// drawn on a half-res overlay and clipped to that muscle so effects never spill onto other muscles.
(()=>{
const S2=2;let masks=null;const sets=new Map();let raf=0,last=0;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
// per-muscle masks + spawn points, built once from the label map
function build(src){if(masks)return masks;const W=src.W/S2|0,H=src.H/S2|0;masks=[];
  for(let mi=0;mi<12;mi++){const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d'),im=x.createImageData(W,H),pts=[];
    let x0=W,y0=H,x1=0,y1=0,n=0;
    for(let y=0;y<H;y++)for(let X=0;X<W;X++){const v=src.lab[(y*S2)*src.W+X*S2];if(v&&v!==255&&(((v-1)/6)|0)===mi){const i=(y*W+X)*4;im.data[i+3]=255;n++;
      if(X<x0)x0=X;if(X>x1)x1=X;if(y<y0)y0=y;if(y>y1)y1=y;if(Math.random()<.02)pts.push([X,y])}}
    x.putImageData(im,0,0);masks.push({c,pts,box:[x0,y0,x1,y1],n})}
  return masks}
const rgba=(h,a)=>`rgba(${parseInt(h.slice(1,3),16)},${parseInt(h.slice(3,5),16)},${parseInt(h.slice(5,7),16)},${a})`;
// one effect "set" per bodygraph state: tinted masks + union clip + particles
function makeSet(src,cols){const M=build(src),W=src.W/S2|0,H=src.H/S2|0;const R=window.RANKS||[];
  const union=document.createElement('canvas');union.width=W;union.height=H;const ux=union.getContext('2d');
  const parts=[];
  cols.forEach((hex,mi)=>{if(!hex)return;const rk=R.find(r=>r.hex===hex);if(!rk||!M[mi].pts.length)return;
    ux.drawImage(M[mi].c,0,0);
    const tint=document.createElement('canvas');tint.width=W;tint.height=H;const tx=tint.getContext('2d');tx.drawImage(M[mi].c,0,0);tx.globalCompositeOperation='source-in';tx.fillStyle=rk.light;tx.fillRect(0,0,W,H);
    const clip=document.createElement('canvas');clip.width=W;clip.height=H;
    parts.push({mi,rk,tint,clip,m:M[mi],ph:Math.random()*6.28,ps:[],max:Math.max(2,Math.min(9,M[mi].n/700|0))})});
  return {W,H,union,parts}}
function spawn(p){const pt=p.m.pts[Math.random()*p.m.pts.length|0],t=p.rk.tier,[x0,y0,x1,y1]=p.m.box;
  const b={x:pt[0],y:pt[1],life:0,max:1.2+Math.random()*1.4,s:1+Math.random()*1.6,vx:0,vy:0,a:Math.random()*6.28};
  if(t===4){b.vy=-(10+Math.random()*14);b.vx=(Math.random()-.5)*4}                       // demon embers rise
  else if(t===6){b.y=y0+Math.random()*(y1-y0)*.4;b.vy=8+Math.random()*6;b.vx=(Math.random()-.5)*6;b.max=2.4} // dragon feathers fall
  else if(t===3){b.r=4+Math.random()*8;b.cx=pt[0];b.cy=pt[1];b.max=2.5}                    // death motes orbit
  else if(t===5){b.vy=-(5+Math.random()*5);b.max=2}                                          // fighting sparks drift up
  else if(t===7){b.max=.9+Math.random()*.6}                                                  // technique twinkles
  else{b.max=.7+Math.random()*.5}                                                            // north/sword glints
  return b}
function drawSet(cv,set,t,dt){const x=cv.getContext('2d');x.clearRect(0,0,set.W,set.H);
  for(const p of set.parts){const tier=p.rk.tier,c=p.clip.getContext('2d');c.clearRect(0,0,set.W,set.H);c.globalCompositeOperation='source-over';
    // breathing glow
    c.globalAlpha=.10+.10*(1+Math.sin(t*2+p.ph))/2+(tier>=5?.06:0);c.drawImage(p.tint,0,0);c.globalAlpha=1;
    const [x0,y0,x1,y1]=p.m.box,w=x1-x0,h=y1-y0;
    // light sweep for metal ranks (north bronze, sword silver, technique crystal)
    if(tier===1||tier===2||tier===7){const per=tier===2?2.2:3.4,u=((t+p.ph)%per)/per,sx=x0-w+u*w*3;
      const g=c.createLinearGradient(sx,y0,sx+w*.5,y1);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.5,tier===1?'rgba(255,214,150,.55)':'rgba(255,255,255,.6)');g.addColorStop(1,'rgba(255,255,255,0)');
      c.fillStyle=g;c.fillRect(x0,y0,w,h)}
    // particles
    while(p.ps.length<p.max)p.ps.push(spawn(p));
    for(const b of p.ps){b.life+=dt;const k=b.life/b.max,fade=Math.sin(Math.min(1,k)*Math.PI);
      if(tier===3){b.a+=dt*1.6;b.x=b.cx+Math.cos(b.a)*b.r;b.y=b.cy+Math.sin(b.a)*b.r*.6}else{b.x+=b.vx*dt;b.y+=b.vy*dt}
      if(tier===4){const r=b.s*2.2*(1-k*.5),g=c.createRadialGradient(b.x,b.y,0,b.x,b.y,r*2.5);g.addColorStop(0,`rgba(255,220,120,${.95*fade})`);g.addColorStop(.35,`rgba(255,70,40,${.8*fade})`);g.addColorStop(1,'rgba(120,0,10,0)');c.fillStyle=g;c.fillRect(b.x-r*2.5,b.y-r*2.5,r*5,r*5)}
      else if(tier===6){c.save();c.translate(b.x,b.y);c.rotate(Math.sin(t*2+b.a)*.6);c.fillStyle=rgba('#c9fff3',.85*fade);c.beginPath();c.ellipse(0,0,1.2*b.s,3.6*b.s,0,0,6.28);c.fill();c.restore()}
      else if(tier===3){const r=3.2*b.s,g=c.createRadialGradient(b.x,b.y,0,b.x,b.y,r);g.addColorStop(0,rgba('#efe4ff',.9*fade));g.addColorStop(.4,rgba('#a774ff',.45*fade));g.addColorStop(1,rgba('#a774ff',0));c.fillStyle=g;c.fillRect(b.x-r,b.y-r,r*2,r*2)}
      else{const r=(tier===7?2.6:tier===5?1.8:2)*b.s*fade,col=tier===5?'255,240,170':tier===1?'255,210,140':'255,255,255';
        c.strokeStyle=`rgba(${col},${.9*fade})`;c.lineWidth=.9;c.beginPath();c.moveTo(b.x-r,b.y);c.lineTo(b.x+r,b.y);c.moveTo(b.x,b.y-r);c.lineTo(b.x,b.y+r);c.stroke();
        c.fillStyle=`rgba(${col},${fade})`;c.beginPath();c.arc(b.x,b.y,.9,0,6.28);c.fill()}
      if(b.life>=b.max)Object.assign(b,spawn(p))}
    // technique: crystal shockwave ring now and then
    if(tier===7){const u=((t*.6+p.ph)%2.5);if(u<.8){const cx=(x0+x1)/2,cy=(y0+y1)/2;c.strokeStyle=`rgba(239,255,255,${.7*(1-u/.8)})`;c.lineWidth=1.4;c.beginPath();c.ellipse(cx,cy,u*w*.9,u*h*.6,0,0,6.28);c.stroke()}}
    // keep this muscle's effect inside this muscle
    c.globalCompositeOperation='destination-in';c.drawImage(p.m.c,0,0);
    x.globalCompositeOperation='lighter';x.drawImage(p.clip,0,0);x.globalCompositeOperation='source-over'}}
function loop(now){raf=0;const t=now/1000,dt=Math.min(.05,last?t-last:0);last=t;let any=false;
  document.querySelectorAll('canvas.bgfx[data-k]').forEach(cv=>{const set=sets.get(cv.dataset.k);if(!set||!cv.isConnected)return;any=true;
    if(cv.width!==set.W){cv.width=set.W;cv.height=set.H}drawSet(cv,set,t,dt)});
  if(any&&!document.hidden)raf=requestAnimationFrame(loop);else last=0}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!raf)raf=requestAnimationFrame(loop)});
// called by bodygraph.js once the body is painted for a set of colors
window.BodyFX={start(src,key,cols){if(reduce||(typeof S!=='undefined'&&S.bgfxOff))return;if(!sets.has(key)){if(sets.size>4)sets.delete(sets.keys().next().value);sets.set(key,makeSet(src,cols))}
  if(!raf)raf=requestAnimationFrame(loop)}};
})();
