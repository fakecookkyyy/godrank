// GodFX: real-time canvas effects for the god-tier badges (additive glow, particles, impacts).
// Particles are stateless (position = f(seed, time)), so any frame can be rendered exactly: GodFX.renderAt(t).
(()=>{
const TAU=Math.PI*2;let LITE=false;
const R=(i,s=0)=>{const x=Math.sin(i*127.1+s*311.7+.5)*43758.5453;return x-Math.floor(x)};
const fr=x=>x-Math.floor(x);
const ease=x=>1-Math.pow(1-x,3);

/* ---------- cached sprites ---------- */
const sprites={};
function glow(color,core='#ffffff',coreStop=.12){
  if(color.length===4)color='#'+color[1]+color[1]+color[2]+color[2]+color[3]+color[3];
  const key=color+core+coreStop;if(sprites[key])return sprites[key];
  const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');
  const gr=g.createRadialGradient(32,32,0,32,32,32);
  gr.addColorStop(0,core);gr.addColorStop(coreStop,color);gr.addColorStop(.45,color+'66');gr.addColorStop(1,color+'00');
  g.fillStyle=gr;g.fillRect(0,0,64,64);return sprites[key]=c;
}
const imgs={};
function badgeImg(r){
  if(imgs[r.id])return imgs[r.id];
  const im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(badge(r,512,false).replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" '));
  imgs[r.id]=im;return im;
}
// badge with a moving specular glint, composed offscreen
const off=document.createElement('canvas'),og=off.getContext('2d');
function drawBadge(ctx,im,x,y,s,glintP,glintW,prism){
  if(!im.complete||!im.naturalWidth)return;
  off.width=off.height=Math.ceil(s);
  og.clearRect(0,0,s,s);og.globalCompositeOperation='source-over';og.drawImage(im,0,0,s,s);
  if(glintP>-1&&glintP<2){
    og.globalCompositeOperation='source-atop';
    og.save();og.translate(s/2,s/2);og.rotate(-0.5);
    const gx=(glintP-.5)*s*1.6, w=s*glintW;
    const gr=og.createLinearGradient(gx-w,0,gx+w,0);
    if(prism){gr.addColorStop(0,'rgba(255,120,220,0)');gr.addColorStop(.35,'rgba(255,170,240,.55)');gr.addColorStop(.5,'rgba(255,255,255,.95)');gr.addColorStop(.65,'rgba(140,240,255,.55)');gr.addColorStop(1,'rgba(140,240,255,0)')}
    else{gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(.5,'rgba(255,255,255,.8)');gr.addColorStop(1,'rgba(255,255,255,0)')}
    og.fillStyle=gr;og.fillRect(-s,-s,s*2,s*2);og.restore();
  }
  ctx.globalAlpha=1;ctx.drawImage(off,x-s/2,y-s/2,s,s);
}
function dot(ctx,spr,x,y,size,a){if(a<=0)return;ctx.globalAlpha=Math.min(1,a);ctx.drawImage(spr,x-size/2,y-size/2,size,size)}
function star(ctx,x,y,r,a,col='#fff'){
  if(a<=0)return;ctx.globalAlpha=a;ctx.fillStyle=col;ctx.beginPath();
  for(let i=0;i<8;i++){const ang=i*TAU/8, rr=i%2?r*.18:r;ctx.lineTo(x+Math.cos(ang)*rr,y+Math.sin(ang)*rr)}ctx.fill();
  dot(ctx,glow(col),x,y,r*2.2,a*.8);
}
function aura(ctx,cx,cy,rad,col,a){
  const g=ctx.createRadialGradient(cx,cy,0,cx,cy,rad);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');
  ctx.globalAlpha=a;ctx.fillStyle=g;ctx.fillRect(cx-rad,cy-rad,rad*2,rad*2);
}
function hexPath(ctx,cx,cy,r,rot=0){ctx.beginPath();for(let i=0;i<6;i++){const a=-Math.PI/2+rot+i*TAU/6;ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r)}ctx.closePath()}

/* ---------- per-tier scenes ---------- */
// u = size unit (badge width), (cx,cy) center, t seconds
const SCENES={
north(ctx,u,cx,cy,t,im){
  ctx.globalCompositeOperation='lighter';
  aura(ctx,cx,cy,u*.75,'rgba(255,140,40,.55)',.55+.25*Math.sin(t*2.2));
  for(let i=0;i<16;i++){const life=3+R(i)*2,p=fr(t/life+R(i,1));const x=cx+(R(i,2)-.5)*u*1.1+Math.sin(t*1.5+i)*u*.04,y=cy+u*.45-p*u*1.1;
    dot(ctx,glow('#ffae4a','#fff3d6'),x,y,u*(.05+R(i,3)*.05),Math.sin(p*Math.PI)*.9)}
  ctx.globalCompositeOperation='source-over';
  drawBadge(ctx,im,cx,cy,u,fr(t/3.2)*2.4-.4,.12);
  ctx.globalCompositeOperation='lighter';
  star(ctx,cx+u*.3,cy-u*.28,u*.07,Math.max(0,Math.sin(t*2.6))*.9,'#ffe2b0');
},
sword(ctx,u,cx,cy,t,im){
  ctx.globalCompositeOperation='lighter';
  aura(ctx,cx,cy,u*.75,'rgba(200,225,255,.5)',.45+.2*Math.sin(t*3));
  ctx.globalCompositeOperation='source-over';
  drawBadge(ctx,im,cx,cy,u,fr(t/2.2)*2.4-.4,.08);
  ctx.globalCompositeOperation='lighter';
  // blade slash streak
  const p=fr(t/2.4);if(p<.22){const q=p/.22;ctx.save();ctx.translate(cx,cy);ctx.rotate(-.6);
    const a0=-2.4+q*3.2;ctx.lineCap='round';
    for(let k=0;k<10;k++){const a=a0-k*.07;ctx.globalAlpha=(1-k/10)*(1-q*.5);ctx.strokeStyle=k<2?'#ffffff':'#bcd9ff';ctx.lineWidth=u*(.035-k*.003);
      ctx.beginPath();ctx.arc(0,0,u*.58,a-.05,a);ctx.stroke()}ctx.restore()}
  for(let i=0;i<5;i++){const ph=fr(t/1.8+R(i)),a=Math.sin(ph*Math.PI);star(ctx,cx+(R(i,1)-.5)*u*1.1,cy+(R(i,2)-.5)*u*1.0,u*.06,a,'#ffffff')}
},
death(ctx,u,cx,cy,t,im){
  // void disc
  ctx.globalCompositeOperation='source-over';
  let g=ctx.createRadialGradient(cx,cy,0,cx,cy,u*.82);
  g.addColorStop(0,'rgba(0,0,0,.95)');g.addColorStop(.45,'rgba(10,0,30,.9)');g.addColorStop(.72,'rgba(70,20,160,.55)');g.addColorStop(1,'rgba(40,0,90,0)');
  ctx.globalAlpha=LITE?.35:1;ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,u*.82,0,TAU);ctx.fill();
  ctx.globalCompositeOperation='lighter';
  // spiral particles falling inward with trails
  for(let i=0;i<70;i++){const life=2.4+R(i)*1.6,p=fr(t/life+R(i,1));const arm=i%4;
    for(let k=0;k<4;k++){const pp=Math.max(0,p-k*.012);const rad=u*(.85-.6*ease(pp)),ang=arm*TAU/4+R(i,2)*.5+pp*5.5+t*.6;
      const x=cx+Math.cos(ang)*rad,y=cy+Math.sin(ang)*rad*.92;
      dot(ctx,glow(i%3?'#9b5cff':'#d9c2ff','#ffffff',.06),x,y,u*(.07-k*.012)*(1-pp*.5),Math.sin(pp*Math.PI)*(1-k*.25)*.8)}}
  aura(ctx,cx,cy,u*.7,'rgba(140,80,255,.45)',.5+.2*Math.sin(t*1.7));
  // orbiting crystal shards (back half)
  const shards=(front)=>{for(let i=0;i<6;i++){const a=t*.9+i*TAU/6,z=Math.sin(a);if((z>0)!==front)continue;
    const x=cx+Math.cos(a)*u*.62,y=cy+z*u*.16-u*.02,s=u*(.05+.02*z);
    ctx.globalAlpha=.65+.35*z;ctx.fillStyle=front?'#efe4ff':'#7a4ad8';ctx.beginPath();ctx.moveTo(x,y-s*1.6);ctx.lineTo(x+s*.7,y);ctx.lineTo(x,y+s*1.6);ctx.lineTo(x-s*.7,y);ctx.fill();
    dot(ctx,glow('#b48cff'),x,y,s*5,.5)}};
  shards(false);
  ctx.globalCompositeOperation='source-over';
  drawBadge(ctx,im,cx,cy,u,fr(t/3.6)*2.4-.4,.1);
  ctx.globalCompositeOperation='lighter';shards(true);
},
demon(ctx,u,cx,cy,t,im){
  ctx.globalCompositeOperation='lighter';
  const beat=Math.max(0,Math.sin(t*5))**6+Math.max(0,Math.sin(t*5-.6))**6*.6;
  aura(ctx,cx,cy,u*.85,'rgba(255,20,50,.6)',.45+.35*beat);
  // blood-red flame tongues licking up from all around the hex
  const tongues=(n,seed,scale,alpha)=>{for(let i=0;i<n;i++){const life=.55+R(i,seed)*.5,p=fr(t/life+R(i,seed+1));
    const ang=-Math.PI/2+(R(i,seed+2)-.5)*Math.PI*1.7;const rr=u*.36;
    const bx=cx+Math.cos(ang)*rr,by=cy+Math.sin(ang)*rr*.95;
    const x=bx+Math.sin(t*9+i)*u*.015*p,y=by-p*u*(.22+R(i,seed+3)*.28)*scale;
    const w=u*(.12-.07*p)*scale,h=w*(2.6+p*1.5);
    const col=p<.2?'#ff4060':p<.55?'#e8102c':'#8a0016';
    ctx.globalAlpha=(1-p)*alpha;ctx.drawImage(glow(col,p<.25?'#ffe2e8':col,.14),x-w/2,y-h*.6,w,h)}};
  tongues(90,1,1.35,.8);
  ctx.globalCompositeOperation='source-over';
  for(let i=0;i<8;i++){const life=1.6+R(i,7),p=fr(t/life+R(i,8));const x=cx+(R(i,9)-.5)*u*.6,y=cy-u*.42-p*u*.4;
    dot(ctx,glow('#220008','#220008',.4),x,y,u*(.12+p*.16),(1-p)*.22)}
  drawBadge(ctx,im,cx,cy,u,fr(t/3)*2.4-.4,.1);
  ctx.globalCompositeOperation='lighter';
  tongues(30,40,.9,.6);
  // embers and blood-lava drips
  for(let i=0;i<22;i++){const life=1.4+R(i,4),p=fr(t/life+R(i,5));const x=cx+(R(i,6)-.5)*u*.9+Math.sin(t*3+i)*u*.05,y=cy+u*.2-p*u*1.0;
    dot(ctx,glow('#ff2a44','#ffe0e6'),x,y,u*.045,Math.sin(p*Math.PI))}
  for(let i=0;i<3;i++){const p=fr(t/1.6+i/3);const x=cx+(i-1)*u*.06,y=cy+u*.5+p*p*u*.35;
    ctx.globalAlpha=1-p;ctx.fillStyle='#ff1a3a';ctx.beginPath();ctx.ellipse(x,y,u*.018,u*(.02+p*.03),0,0,TAU);ctx.fill();dot(ctx,glow('#ff1a3a'),x,y,u*.1,(1-p)*.8)}
},
fighting(ctx,u,cx,cy,t,im){
  ctx.globalCompositeOperation='lighter';
  // god rays
  ctx.save();ctx.translate(cx,cy);ctx.rotate(t*.18);
  for(let i=0;i<16;i++){ctx.rotate(TAU/16);const len=u*(.8+.15*Math.sin(t*2+i*1.7));
    const g=ctx.createLinearGradient(0,0,0,-len);g.addColorStop(0,'rgba(255,240,180,.55)');g.addColorStop(1,'rgba(255,200,60,0)');
    ctx.globalAlpha=.55+.3*Math.sin(t*1.3+i);ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-u*.03,0);ctx.lineTo(0,-len);ctx.lineTo(u*.03,0);ctx.fill()}
  ctx.restore();
  aura(ctx,cx,cy,u*.8,'rgba(255,210,80,.65)',.6+.25*Math.sin(t*2));
  ctx.globalCompositeOperation='source-over';
  drawBadge(ctx,im,cx,cy,u,fr(t/2.6)*2.4-.4,.12);
  ctx.globalCompositeOperation='lighter';
  // halo
  const hy=cy-u*.55+Math.sin(t*2)*u*.02;
  for(let k=3;k>=0;k--){ctx.globalAlpha=k?0.25:1;ctx.strokeStyle=k?'#ffd54a':'#fffbe6';ctx.lineWidth=u*(k?.03*k:.012);ctx.beginPath();ctx.ellipse(cx,hy,u*.2,u*.05,0,0,TAU);ctx.stroke()}
  // rising light feathers
  for(let i=0;i<14;i++){const life=2.5+R(i)*1.5,p=fr(t/life+R(i,1));const x=cx+(R(i,2)-.5)*u*1.2+Math.sin(t*1.2+i)*u*.05,y=cy+u*.5-p*u*1.2;
    ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(t+i)*.6);ctx.globalAlpha=Math.sin(p*Math.PI)*.85;ctx.fillStyle='#fff6d0';
    ctx.beginPath();ctx.ellipse(0,0,u*.012,u*.04,0,0,TAU);ctx.fill();ctx.restore();dot(ctx,glow('#ffd54a'),x,y,u*.09,Math.sin(p*Math.PI)*.6)}
  star(ctx,cx-u*.33,cy-u*.18,u*.08,Math.max(0,Math.sin(t*2.2)),'#fff');
  star(ctx,cx+u*.36,cy+u*.05,u*.06,Math.max(0,Math.sin(t*2.2+2)),'#fff');
},
dragon(ctx,u,cx,cy,t,im){
  ctx.globalCompositeOperation='lighter';
  aura(ctx,cx,cy,u*.85,'rgba(40,255,200,.5)',.5+.2*Math.sin(t*1.8));
  // spirit flames off the wings
  for(let i=0;i<70;i++){const life=1.2+R(i)*.8,p=fr(t/life+R(i,1));const side=i%2?1:-1;
    const x=cx+side*u*(.25+R(i,2)*.4)+Math.sin(t*4+i)*u*.02,y=cy-u*.05+R(i,3)*u*.25-p*u*.5;
    dot(ctx,glow(p<.3?'#7affe4':'#14b896',p<.15?'#eafff9':'#3dffd2',.1),x,y,u*(.12-.08*p),(1-p)*.6)}
  ctx.globalCompositeOperation='source-over';
  drawBadge(ctx,im,cx,cy,u,fr(t/2.8)*2.4-.4,.1);
  // falling void feathers
  for(let i=0;i<9;i++){const life=2.6+R(i,4)*1.2,p=fr(t/life+R(i,5));const side=i%2?1:-1;
    const x0=cx+side*u*(.3+R(i,6)*.32),x=x0+Math.sin(p*7+i)*u*.06,y=cy-u*.15+p*u*.9,rot=Math.sin(p*7+i)*.8+side*.4,a=Math.min(1,p*6)*(1-p);
    ctx.globalCompositeOperation='lighter';dot(ctx,glow('#3dffd2'),x,y,u*.16,a*.7);
    for(let k=1;k<4;k++)dot(ctx,glow('#7affe4'),x-Math.sin(p*7+i)*u*.01*k,y-k*u*.03,u*.03,a*(1-k/4)*.6);
    ctx.globalCompositeOperation='source-over';ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.globalAlpha=a;
    ctx.beginPath();ctx.moveTo(0,-u*.06);ctx.bezierCurveTo(u*.035,-u*.02,u*.035,u*.03,0,u*.065);ctx.bezierCurveTo(-u*.035,u*.03,-u*.035,-u*.02,0,-u*.06);
    ctx.fillStyle='#021a15';ctx.fill();ctx.strokeStyle='#8affea';ctx.lineWidth=u*.008;ctx.stroke();
    ctx.beginPath();ctx.moveTo(0,-u*.05);ctx.lineTo(0,u*.06);ctx.strokeStyle='#3dffd2';ctx.lineWidth=u*.004;ctx.stroke();ctx.restore()}
  ctx.globalCompositeOperation='lighter';
  for(let i=0;i<10;i++){const life=1.6+R(i,9),p=fr(t/life+R(i,10));dot(ctx,glow(i%2?'#ffb070':'#ff8a3d','#fff'),cx+(R(i,11)-.5)*u,cy+u*.3-p*u,u*.035,Math.sin(p*Math.PI))}
},
technique(ctx,u,cx,cy,t,im){
  const T=3.2,ph=fr(t/T),hit=.6,since=(ph-hit)*T;   // seconds since impact (negative before)
  const hue=(t*60)%360;
  ctx.globalCompositeOperation='lighter';
  aura(ctx,cx,cy,u*.9,`hsla(${190+Math.sin(t)*20},100%,70%,.55)`,.6+.25*Math.sin(t*2.4));
  aura(ctx,cx,cy,u*.55,`hsla(${hue},100%,75%,.25)`,.8);
  // orbiting prism shards (back)
  const shards=(front)=>{for(let i=0;i<8;i++){const a=-t*1.1+i*TAU/8,z=Math.sin(a);if((z>0)!==front)continue;
    const x=cx+Math.cos(a)*u*.66,y=cy+z*u*.2,s=u*(.045+.02*z);ctx.globalCompositeOperation=front?'source-over':'lighter';
    ctx.globalAlpha=.7+.3*z;ctx.fillStyle=`hsl(${(hue+i*45)%360},100%,${front?88:70}%)`;ctx.beginPath();ctx.moveTo(x,y-s*1.7);ctx.lineTo(x+s*.8,y);ctx.lineTo(x,y+s*1.7);ctx.lineTo(x-s*.8,y);ctx.fill();
    ctx.globalCompositeOperation='lighter';dot(ctx,glow('#9fe8ff'),x,y,s*5,.55)}};
  shards(false);
  // incoming strike
  if(ph>hit-.08&&ph<hit){const q=(ph-(hit-.08))/.08;ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
    for(let k=0;k<8;k++){const qq=Math.max(0,q-k*.05);const x=cx+u*(1.1-qq*.85),y=cy-u*(1.0-qq*.8);
      ctx.globalAlpha=(1-k/8);ctx.strokeStyle=k<2?'#ffffff':'#9fe8ff';ctx.lineWidth=u*(.04-k*.004);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+u*.12,y-u*.11);ctx.stroke()}}
  // badge with impact shake + flash
  let sx=0,sy=0;if(since>0&&since<.35){const d=1-since/.35;sx=Math.sin(since*90)*u*.035*d;sy=Math.cos(since*70)*u*.025*d}
  ctx.globalCompositeOperation='source-over';
  drawBadge(ctx,im,cx+sx,cy+sy,u,fr(t/2)*2.4-.4,.14,true);
  if(since>0&&since<.25){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=(1-since/.25)*.8;ctx.drawImage(off,cx+sx-u/2,cy+sy-u/2,u,u)}
  ctx.globalCompositeOperation='lighter';
  if(since>0&&since<1.1){
    const p=since/1.1;
    // shockwave
    ctx.globalAlpha=(1-p)*.9;ctx.strokeStyle='#dff8ff';ctx.lineWidth=u*.025*(1-p)+1;ctx.beginPath();ctx.arc(cx,cy,u*(.35+p*.65),0,TAU);ctx.stroke();
    // crystal barrier plates form, hold, then shatter outward
    const form=Math.min(1,since/.12),shatter=Math.max(0,(since-.45)/.65);
    for(let i=0;i<6;i++){const a=-Math.PI/2+i*TAU/6+TAU/12,push=shatter*u*.35,ox=Math.cos(a)*push,oy=Math.sin(a)*push;
      ctx.save();ctx.translate(cx+ox,cy+oy);ctx.rotate(shatter*(R(i)-.5)*2);
      ctx.globalAlpha=form*(1-shatter)*.75;ctx.fillStyle='rgba(190,240,255,.35)';ctx.strokeStyle='#ffffff';ctx.lineWidth=u*.01;
      const r1=u*.5,r2=u*.6,a0=a-TAU/12,a1=a+TAU/12;ctx.beginPath();
      ctx.moveTo(Math.cos(a0)*r1-ox*0,Math.sin(a0)*r1);ctx.lineTo(Math.cos(a1)*r1,Math.sin(a1)*r1);ctx.lineTo(Math.cos(a1)*r2,Math.sin(a1)*r2);ctx.lineTo(Math.cos(a0)*r2,Math.sin(a0)*r2);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore()}
    // spark burst at the hit point
    for(let i=0;i<18;i++){const a=-0.8+(R(i,3)-.5)*2.2,d=ease(Math.min(1,since/.6))*u*(.2+R(i,4)*.35);
      dot(ctx,glow(i%2?'#9fe8ff':'#ffe9a8','#fff'),cx+u*.25+Math.cos(a)*d,cy-u*.22+Math.sin(a)*d,u*.05,(1-p))}
  }
  // ambient crackling arcs
  const seg=Math.floor(t*12);
  if(R(seg,20)>.55){ctx.globalAlpha=.8;ctx.strokeStyle='#bff3ff';ctx.lineWidth=u*.008;ctx.beginPath();
    const a=R(seg,21)*TAU;let x=cx+Math.cos(a)*u*.42,y=cy+Math.sin(a)*u*.42;ctx.moveTo(x,y);
    for(let k=1;k<6;k++){const aa=a+k*.12;x=cx+Math.cos(aa)*u*(.42+(R(seg*7+k,22)-.5)*.12);y=cy+Math.sin(aa)*u*(.42+(R(seg*7+k,23)-.5)*.12);ctx.lineTo(x,y)}ctx.stroke()}
  shards(true);
  for(let i=0;i<6;i++){const ph2=fr(t/1.4+R(i)),a=Math.sin(ph2*Math.PI);star(ctx,cx+(R(i,1)-.5)*u*1.2,cy+(R(i,2)-.5)*u*1.1,u*.07,a,i%2?'#fff':'#c6f4ff')}
},
};

/* ---------- mounting & loop ---------- */
const live=new Set();let raf=0,t0=performance.now(),frozen=null,frame=0;
const PAD=1.7; // canvas is this many times the badge size, so effects can spill out
function draw(m,t){
  const {ctx,px,r}=m;ctx.setTransform(1,0,0,1,0,0);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;ctx.clearRect(0,0,px,px);
  LITE=m.lite;
  if(LITE){ctx.globalCompositeOperation='lighter';const u=px/PAD,g=ctx.createRadialGradient(px/2,px/2,0,px/2,px/2,u*.8);g.addColorStop(0,r.hex+'aa');g.addColorStop(1,r.hex+'00');ctx.globalAlpha=.55+.2*Math.sin((t+m.offset)*2.4);ctx.fillStyle=g;ctx.fillRect(0,0,px,px);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}
  SCENES[r.id](ctx,px/PAD,px/2,px/2,t+m.offset,badgeImg(r));ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
}
function loop(){
  const t=frozen??(performance.now()-t0)/1000;
  frame++;
  // small badges (list rows) render at 1x and every other frame to stay light on phones
  for(const m of live){if(!m.el.isConnected){live.delete(m);continue}if(m.vis&&!(m.lite&&frame&1))draw(m,t)}
  raf=live.size?requestAnimationFrame(loop):0;
}
const io=('IntersectionObserver' in window)?new IntersectionObserver(es=>es.forEach(e=>{const m=e.target._gfx;if(m)m.vis=e.isIntersecting})):null;
window.GodFX={
  // returns placeholder HTML; call GodFX.scan() after inserting it
  html(r,size){return `<span class="gfx" data-r="${r.id}" data-s="${size}" style="display:inline-block;width:${size}px;height:${size}px;position:relative;vertical-align:middle"></span>`},
  scan(root=document){
    root.querySelectorAll('.gfx:not([data-on])').forEach(el=>{
      const r=RANKS.find(x=>x.id===el.dataset.r);if(!r)return;el.dataset.on=1;
      const size=+el.dataset.s,lite=size<72,css=size*PAD,dpr=lite?1.5:Math.min(2,window.devicePixelRatio||1),px=Math.round(css*dpr);
      const c=document.createElement('canvas');c.width=c.height=px;
      c.style.cssText=`position:absolute;left:${-(css-size)/2}px;top:${-(css-size)/2}px;width:${css}px;height:${css}px;pointer-events:none`;
      el.appendChild(c);
      const m={el,ctx:c.getContext('2d'),px,r,vis:true,lite,offset:(r.tier*1.7+size)%5};el._gfx=m;live.add(m);io&&io.observe(el);
      badgeImg(r);
    });
    if(!raf&&live.size)raf=requestAnimationFrame(loop);
  },
  renderAt(t){frozen=t;for(const m of live)draw(m,t)},
};
})();
