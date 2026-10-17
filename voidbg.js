// Godrank void background: monochrome drifting smoke, light from above, falling dark feathers, dust and film grain.
// Renders at reduced resolution and ~30fps; pauses when the page is hidden.
(()=>{
const TAU=Math.PI*2;
const R=(i,s=0)=>{const x=Math.sin(i*127.1+s*311.7+.5)*43758.5453;return x-Math.floor(x)};
const fr=x=>x-Math.floor(x);

// tileable fractal value noise, used as smoke texture
function noiseTile(size,seed){
  const c=document.createElement('canvas');c.width=c.height=size;const g=c.getContext('2d'),img=g.createImageData(size,size),d=img.data;
  const oct=[[3,.55],[6,.27],[12,.12],[24,.06]];
  const grids=oct.map(([n],k)=>Array.from({length:n*n},(_,i)=>R(i+k*999,seed)));
  const smooth=t=>t*t*(3-2*t);
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){let v=0;
    oct.forEach(([n,a],k)=>{const gx=x/size*n,gy=y/size*n,x0=Math.floor(gx),y0=Math.floor(gy),tx=smooth(gx-x0),ty=smooth(gy-y0),G=grids[k];
      const at=(i,j)=>G[((j%n+n)%n)*n+((i%n+n)%n)];
      v+=a*((at(x0,y0)*(1-tx)+at(x0+1,y0)*tx)*(1-ty)+(at(x0,y0+1)*(1-tx)+at(x0+1,y0+1)*tx)*ty)});
    v=Math.max(0,(v-.40)*3.4);v=v*v;const o=(y*size+x)*4;d[o]=d[o+1]=d[o+2]=255;d[o+3]=Math.min(255,v*255)}
  g.putImageData(img,0,0);
  // soften into smoke
  const o=document.createElement('canvas');o.width=o.height=size;const og=o.getContext('2d');
  for(const dx of [-size,0,size])for(const dy of [-size,0,size]){og.filter='blur(6px)';og.drawImage(c,dx,dy)}
  return o;
}
function grainTile(size){const c=document.createElement('canvas');c.width=c.height=size;const g=c.getContext('2d'),img=g.createImageData(size,size);
  for(let i=0;i<img.data.length;i+=4){const v=Math.random()*255;img.data[i]=img.data[i+1]=img.data[i+2]=v;img.data[i+3]=255}g.putImageData(img,0,0);return c}

function feather(g,len,rim){ // long asymmetric feather: curved shaft, wide trailing vane, split barbs, downy base
  const w=len*.15;
  g.beginPath();g.moveTo(0,-len*.5);
  g.bezierCurveTo(w*1.6,-len*.36,w*1.5,len*.12,w*.35,len*.36);   // wide trailing vane
  g.lineTo(w*.05,len*.38);
  g.bezierCurveTo(-w*.6,len*.12,-w*.75,-len*.3,0,-len*.5);       // narrow leading vane
  g.closePath();
  const fg=g.createLinearGradient(-w,0,w*1.5,0);fg.addColorStop(0,'#08080a');fg.addColorStop(.45,'#18181d');fg.addColorStop(1,'#050506');
  g.fillStyle=fg;g.fill();
  g.strokeStyle=`rgba(225,225,235,${rim})`;g.lineWidth=1;g.stroke();
  // splits in the vane
  g.strokeStyle='rgba(3,3,4,.95)';g.lineWidth=1.4;
  for(const [y,dir] of [[-.18,1],[.05,1],[-.05,-1]]){g.beginPath();g.moveTo(0,len*y);g.lineTo(dir*w*1.3,len*(y-.08));g.stroke()}
  // fine barbs
  g.lineWidth=.6;g.strokeStyle='rgba(0,0,0,.6)';
  for(let k=0;k<14;k++){const y=-len*.44+k*len*.058;g.beginPath();g.moveTo(0,y);g.lineTo(w*1.2,y-len*.06);g.stroke()}
  // shaft
  g.beginPath();g.moveTo(0,-len*.5);g.quadraticCurveTo(w*.15,0,-w*.1,len*.62);g.strokeStyle=`rgba(215,215,225,${rim*1.2})`;g.lineWidth=1.3;g.stroke();
  // downy base
  g.fillStyle=`rgba(200,200,210,${rim*.5})`;for(let k=0;k<6;k++){g.beginPath();g.ellipse((k-2.5)*w*.18,len*.42+k%2*2,w*.12,len*.03,0,0,Math.PI*2);g.fill()}
}


/* ---------- melting sky: black goo from the top, rank-colored lava glow ---------- */
const ease=x=>1-Math.pow(1-x,3);
function hexA(hex,a){const n=parseInt(hex.slice(1),16);return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`}
function lava(g,W,H,t,col,u,lvl=0){
  const top=H*.075;                                   // bottom edge of the melting sky
  const edge=x=>top+Math.sin(x/W*7+t*.35)*H*.012+Math.sin(x/W*17-t*.5)*H*.006+Math.sin(x/W*3.3+t*.2)*H*.01;
  // the goo curtain
  g.globalCompositeOperation='source-over';
  g.beginPath();g.moveTo(0,0);for(let x=0;x<=W;x+=W/40)g.lineTo(x,edge(x));g.lineTo(W,0);g.closePath();
  let gr=g.createLinearGradient(0,0,0,top*1.4);gr.addColorStop(0,'#000');gr.addColorStop(.85,'#050407');gr.addColorStop(1,'#0b0910');g.fillStyle=gr;g.fill();
  // glowing seam along the melt line
  g.globalCompositeOperation='lighter';g.filter=`blur(${3*u}px)`;g.beginPath();for(let x=0;x<=W;x+=W/40)g.lineTo(x,edge(x)+1);g.strokeStyle=hexA(col,.55);g.lineWidth=2*u;g.stroke();g.filter='none';
  g.beginPath();for(let x=0;x<=W;x+=W/40)g.lineTo(x,edge(x));g.strokeStyle='rgba(255,255,255,.12)';g.lineWidth=.8*u;g.stroke();
  // pool at the bottom
  const base=H*(1-.04-Math.min(1,lvl)*.86);  // surface height = body strength %
  const pool=x=>base+Math.sin(x/W*9-t*.6)*H*.006+Math.sin(x/W*21+t*.9)*H*.003;
  const splashes=[];
  // drips
  for(let i=0;i<11;i++){
    const T=6+R(i,30)*7,ph=fr(t/T+R(i,31)),x=W*((i+.3+R(i,32)*.4)/11),y0=edge(x),Lmax=H*(.07+R(i,33)*.16),w=(3+R(i,34)*4)*u;
    let L,bulb,dropY=null;
    if(ph<.62){const q=ease(ph/.62);L=Lmax*q;bulb=w*(.9+q*.9)}
    else{const q=(ph-.62)/.38;L=Lmax*(1-ease(Math.min(1,q*2.2)))*.35;bulb=w*.8;
      const tt=q*T*.38,yy=y0+Lmax+40*u*tt*tt*(H/(Lmax*6));dropY=yy;if(yy>pool(x))splashes.push([x,Math.min(1,(yy-pool(x))/(H*.05))]);}
    const tipY=y0+L;
    // neck + bulb
    g.globalCompositeOperation='source-over';
    g.beginPath();g.moveTo(x-w*1.6,y0-2);g.bezierCurveTo(x-w*.6,y0+L*.3,x-w*.5,tipY-bulb,x-bulb*.9,tipY);
    g.arc(x,tipY,bulb,Math.PI,0,true);g.bezierCurveTo(x+w*.5,tipY-bulb,x+w*.6,y0+L*.3,x+w*1.6,y0-2);g.closePath();
    g.fillStyle='#050407';g.fill();
    // magma core and glossy rim
    g.globalCompositeOperation='lighter';g.filter=`blur(${2.2*u}px)`;
    g.beginPath();g.moveTo(x,y0);g.lineTo(x,tipY);g.strokeStyle=hexA(col,.22);g.lineWidth=w*.45;g.stroke();
    g.beginPath();g.arc(x,tipY+bulb*.15,bulb*.42,0,Math.PI*2);g.fillStyle=hexA(col,.5);g.fill();g.filter='none';
    // thin hot rim on the drip's edge
    g.beginPath();g.arc(x,tipY,bulb,Math.PI*.15,Math.PI*.85);g.strokeStyle=hexA(col,.55);g.lineWidth=1*u;g.stroke();
    g.beginPath();g.arc(x-bulb*.35,tipY-bulb*.3,bulb*.18,0,Math.PI*2);g.fillStyle='rgba(255,255,255,.22)';g.fill();
    // falling droplet
    if(dropY!==null&&dropY<pool(x)){const dr=w*.9;g.globalCompositeOperation='source-over';g.beginPath();g.ellipse(x,dropY,dr*.8,dr*1.25,0,0,Math.PI*2);g.fillStyle='#050407';g.fill();
      g.globalCompositeOperation='lighter';g.filter=`blur(${2*u}px)`;g.beginPath();g.arc(x,dropY+dr*.2,dr*.45,0,Math.PI*2);g.fillStyle=hexA(col,.55);g.fill();g.filter='none';
      for(let k=1;k<5;k++){g.globalAlpha=.25*(1-k/5);g.beginPath();g.arc(x,dropY-k*dr*1.4,dr*.35,0,Math.PI*2);g.fillStyle=hexA(col,1);g.fill()}g.globalAlpha=1}
  }
  // the pool
  g.globalCompositeOperation='source-over';g.beginPath();g.moveTo(0,H);for(let x=0;x<=W;x+=W/40)g.lineTo(x,pool(x));g.lineTo(W,H);g.closePath();g.fillStyle='#030204';g.fill();
  g.globalCompositeOperation='lighter';g.filter=`blur(${4*u}px)`;g.beginPath();for(let x=0;x<=W;x+=W/40)g.lineTo(x,pool(x));g.strokeStyle=hexA(col,.5);g.lineWidth=3*u;g.stroke();g.filter='none';
  gr=g.createLinearGradient(0,base-H*.06,0,H);gr.addColorStop(0,hexA(col,0));gr.addColorStop(.08,hexA(col,.16));gr.addColorStop(.3,hexA(col,.06));gr.addColorStop(1,hexA(col,.1));g.fillStyle=gr;g.fillRect(0,base-H*.06,W,H-base+H*.06);
  // ripples where drops land
  for(const [x,a] of splashes){for(let k=0;k<3;k++){const rr=(a*3+k)*8*u;g.globalAlpha=Math.max(0,.6-a*.5-k*.15);g.beginPath();g.ellipse(x,pool(x)+2,rr*1.8,rr*.35,0,0,Math.PI*2);g.strokeStyle=hexA(col,1);g.lineWidth=1.2*u;g.stroke()}}g.globalAlpha=1;
  // embers rising from the pool
  for(let i=0;i<26;i++){const life=4+R(i,40)*5,p=fr(t/life+R(i,41)),x=W*R(i,42)+Math.sin(t*1.3+i)*8*u,y=base-p*H*.45;
    g.globalAlpha=Math.sin(p*Math.PI)*(.4+R(i,43)*.5);g.fillStyle=hexA(col,1);g.beginPath();g.arc(x,y,(.8+R(i,44)*1.3)*u,0,Math.PI*2);g.fill()}
  g.globalAlpha=1;g.globalCompositeOperation='source-over';
}

window.VoidBG={
  col:'#ff5a2a',
  color(hex){if(hex)this.col=hex},
  level(p){this.lvl=Math.max(0,Math.min(1,p||0))},
  mount(host){
    if(this.c)return;
    const c=document.createElement('canvas');c.className='voidbg';c.style.cssText='position:absolute;inset:0;width:100%;height:100%;z-index:0;transition:opacity .4s';host.prepend(c);this.c=c;const g=c.getContext('2d');
    const smoke=[noiseTile(256,1),noiseTile(256,7)],grain=grainTile(128);
    const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W=0,H=0,last=0,t0=performance.now();
    const size=()=>{const r=host.getBoundingClientRect(),s=.6;W=Math.round(r.width*s);H=Math.round(r.height*s);c.width=W;c.height=H};
    size();addEventListener('resize',size);
    const draw=now=>{
      if(this.off){g.clearRect(0,0,W,H);return}
      const t=(now-t0)/1000;
      g.globalCompositeOperation='source-over';g.globalAlpha=1;g.fillStyle='#030304';g.fillRect(0,0,W,H);
      // light from above, slowly breathing
      const lx=W*(.5+.08*Math.sin(t*.07)),br=.55+.15*Math.sin(t*.25);
      let gr=g.createRadialGradient(lx,-H*.12,0,lx,-H*.12,H*.9);gr.addColorStop(0,`rgba(240,240,250,${.34*br})`);gr.addColorStop(.3,`rgba(170,170,185,${.12*br})`);gr.addColorStop(1,'rgba(0,0,0,0)');
      g.fillStyle=gr;g.fillRect(0,0,W,H);
      // god rays
      g.globalCompositeOperation='lighter';
      for(let i=0;i<5;i++){const a=-.35+i*.17+Math.sin(t*.05+i)*.03,w=W*(.06+R(i)*.08),al=.025+.02*Math.sin(t*.3+i*1.7);
        g.save();g.translate(lx,-H*.1);g.rotate(a);const lg=g.createLinearGradient(0,0,0,H*1.2);lg.addColorStop(0,`rgba(255,255,255,${al})`);lg.addColorStop(1,'rgba(255,255,255,0)');
        g.fillStyle=lg;g.beginPath();g.moveTo(-w*.2,0);g.lineTo(w*.2,0);g.lineTo(w,H*1.2);g.lineTo(-w,H*1.2);g.fill();g.restore()}
      // cloud banks: lit masses near the light, fog at the bottom
      g.globalCompositeOperation='screen';
      for(let i=0;i<22;i++){const top=i<13,bx=fr(R(i,11)+t*(.004+R(i,12)*.006)*(i%2?1:-1))*W*1.4-W*.2,
        by=top?H*(R(i,13)*.3-.04):H*(.74+R(i,13)*.3),rad=Math.min(W,H)*(top?.22+R(i,14)*.28:.18+R(i,14)*.22),a=(top?.16:.10)+R(i,15)*.08;
        const cg=g.createRadialGradient(bx,by,0,bx,by,rad);cg.addColorStop(0,`rgba(225,225,235,${a})`);cg.addColorStop(.55,`rgba(150,150,165,${a*.45})`);cg.addColorStop(1,'rgba(0,0,0,0)');
        g.fillStyle=cg;g.fillRect(bx-rad,by-rad,rad*2,rad*2)}
      // drifting smoke texture
      for(let k=0;k<2;k++){const tile=smoke[k],sc=(k?2.6:3.6)*Math.max(W,H)/256,ox=fr(t*(k?.006:-.004))*256*sc,oy=fr(t*(k?-.003:.002))*256*sc;
        g.globalAlpha=k?.10:.14;for(let x=-ox-256*sc;x<W;x+=256*sc)for(let y=-oy-256*sc;y<H;y+=256*sc)g.drawImage(tile,x,y,256*sc,256*sc)}
      g.globalAlpha=1;
      // smoke is lit from above: darken it toward the middle and edges
      g.globalCompositeOperation='source-over';gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'rgba(3,3,4,0)');gr.addColorStop(.38,'rgba(3,3,4,.55)');gr.addColorStop(.62,'rgba(3,3,4,.7)');gr.addColorStop(1,'rgba(3,3,4,.15)');g.fillStyle=gr;g.fillRect(0,0,W,H);
      // heavier fog banks at the bottom
      gr=g.createLinearGradient(0,H*.6,0,H);gr.addColorStop(0,'rgba(120,120,130,0)');gr.addColorStop(1,'rgba(150,150,160,.16)');g.globalCompositeOperation='screen';g.fillStyle=gr;g.fillRect(0,H*.6,W,H*.4);
      // dust / stars
      g.globalCompositeOperation='lighter';
      for(let i=0;i<46;i++){const x=R(i,1)*W,y=fr(R(i,2)+t*.004*(1+R(i,3)))*H,tw=.3+.7*Math.max(0,Math.sin(t*(.6+R(i,4)*1.4)+i));
        g.globalAlpha=tw*(.25+R(i,5)*.5);g.fillStyle='#e8e8f0';g.fillRect(x,H-y,1+R(i,6)*1.2,1+R(i,6)*1.2)}
      // falling feathers
      g.globalCompositeOperation='source-over';
      for(let i=0;i<7;i++){const life=22+R(i,7)*16,p=fr(t/life+R(i,8)),x=W*(R(i,9)*1.1-.05)+Math.sin(t*.4+i*2)*W*.05,y=-40+p*(H+80),len=(26+R(i,10)*44)*(W/240);
        const near=R(i,10)>.7;g.save();g.translate(x,y);g.rotate(Math.sin(t*.5+i)*.7+i*.9);g.filter=near?'blur(1.6px)':'none';g.globalAlpha=Math.min(1,p*6,(1-p)*6)*(near?.6:.9);feather(g,near?len*1.5:len,.16+.22*(1-y/H));g.restore();g.filter='none'}
      g.globalAlpha=1;
      this.lv=(this.lv??this.lvl??0)+((this.lvl||0)-(this.lv??0))*.04;  // ease toward the new level
      lava(g,W,H,t,this.col,W/390,this.lv);
      // vignette
      gr=g.createRadialGradient(W/2,H*.45,Math.min(W,H)*.25,W/2,H*.5,Math.max(W,H)*.75);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,.75)');g.fillStyle=gr;g.fillRect(0,0,W,H);
      // film grain
      g.globalAlpha=.035;g.drawImage(grain,-(Math.random()*128|0),-(Math.random()*128|0),W+256,H+256);g.globalAlpha=1;
    };
    // requestAnimationFrame already stops while the app is in the background
    const loop=now=>{requestAnimationFrame(loop);if(now-last<33)return;last=now;draw(now)};
    if(reduce)draw(performance.now());else requestAnimationFrame(loop);
  },
  set(on){this.off=!on;if(this.c)this.c.style.opacity=on?1:0},
};
})();
