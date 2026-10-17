// Godrank reminders: push sign-up, the state the service worker reads to word each reminder, and the setup code
// for the scheduled sender (.github/workflows/reminders.yml).
(()=>{
const VAPID_PUBLIC='BAXE3ZchkQiRMGRWluBniRp51MDqjBV8eBreUlo1BUQbD_fSvSrh1HW_0wnw-2nG8ObO6PnR5Ed3JltYYt725RM';
const b64u=s=>{const p='='.repeat((4-s.length%4)%4),b=atob((s+p).replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from(b,c=>c.charCodeAt(0))};
const N=()=>(S.notif||={on:false,times:{},evening:'21:00',eveOn:true,sub:null});
// what the reminder needs to know about you right now
function snapshot(){const today=sod(Date.now()),days=wDays(),last=days.length?days[days.length-1]:null;
  let miss=0;if(last!=null)for(let t=addDays(last,1);t<today;t=addDays(t,1))if(S.days.includes(new Date(t).getDay()))miss++;
  const o=overall(),rk=o?rankFor(o).rank:null,ix=rk?RANKS.indexOf(rk):-1,tp=typeForDate(today);
  return {name:S.name||'',day:tp?(DAYNAME[tp]||'Training'):'Training',miss,since:last!=null?Math.round((today-last)/864e5):0,streak:curStreak(),
    rank:rk?rk.name:'North God',next:RANKS[ix+1]?RANKS[ix+1].name:'Technique God',trained:last===today,at:Date.now()}}
let tm=0;window.syncReminderState=()=>{clearTimeout(tm);tm=setTimeout(()=>{if(!('caches' in self)||!S.setup)return;
  caches.open('godrank-state').then(c=>c.put('state',new Response(JSON.stringify(snapshot())))).catch(()=>{})},300)};
const supported=()=>'serviceWorker' in navigator&&'PushManager' in window&&'Notification' in window;
window.remindersOn=async()=>{const n=N();
  if(!supported()){toast(navigator.standalone===false||!matchMedia('(display-mode: standalone)').matches?'Open Godrank from your Home Screen to turn on reminders':'Notifications aren\'t supported here');return}
  const perm=await Notification.requestPermission();if(perm!=='granted'){toast('Notifications are blocked. Allow them in iPhone Settings → Notifications → Godrank');return}
  try{const reg=await navigator.serviceWorker.ready;let sub=await reg.pushManager.getSubscription();
    if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64u(VAPID_PUBLIC)});
    n.sub=sub.toJSON();n.on=true;S.days.forEach(d=>{n.times[d]||='07:00'});save();syncReminderState();render();toast('Reminders on. Copy your setup code next.')}
  catch(e){toast('Could not turn on reminders: '+e.message)}};
window.remindersOff=async()=>{const n=N();n.on=false;save();render()};
window.remindTest=async()=>{if(!supported()||Notification.permission!=='granted'){toast('Turn reminders on first');return}
  const reg=await navigator.serviceWorker.ready,m=GodrankMsg.pick('gym',snapshot(),[]);
  reg.showNotification(m.title,{body:m.body,icon:'assets/icons/icon-192.png',badge:'assets/icons/icon-192.png',tag:'godrank-test'})};
// everything the sender needs, as one code to paste into the repo secret GODRANK_PUSH
window.reminderCode=()=>{const n=N();const times={};S.days.forEach(d=>times[d]=n.times[d]||'07:00');
  return btoa(JSON.stringify({s:n.sub,tz:Intl.DateTimeFormat().resolvedOptions().timeZone,t:times,e:n.eveOn?n.evening:null}))};
window.remindCopy=async()=>{const c=reminderCode();try{await navigator.clipboard.writeText(c);toast('Setup code copied. Paste it to Claude.')}catch(e){prompt('Copy this setup code',c)}};
window.remindersCard=()=>{const n=N(),on=n.on&&n.sub;
  const sw=(v,f)=>`<button onclick="${f}" style="width:52px;height:30px;border-radius:999px;position:relative;flex:none;background:${v?'linear-gradient(135deg,#9ad3ff,#5b8dff)':'#2a2438'}"><span style="position:absolute;top:3px;${v?'right:3px':'left:3px'};width:24px;height:24px;border-radius:50%;background:#fff"></span></button>`;
  return `<div class="eyebrow" style="margin:18px 0 8px">Reminders</div>
   <div class="field"><label>Workout reminders</label>${sw(on,on?'remindersOff()':'remindersOn()')}</div>
   ${on?`${S.days.map(d=>`<div class="field"><label>${WD[d]} workout</label><input type="time" value="${n.times[d]||'07:00'}" onchange="S.notif.times[${d}]=this.value;save()"></div>`).join('')}
   <div class="field"><label>Evening check-in</label>${sw(n.eveOn,'S.notif.eveOn=!S.notif.eveOn;save();render()')}</div>
   ${n.eveOn?`<div class="field"><label>Check-in time</label><input type="time" value="${n.evening}" onchange="S.notif.evening=this.value;save()"></div>`:''}
   <div class="row" style="gap:8px"><button class="btn ghost" style="flex:1" onclick="remindTest()">Test notification</button><button class="btn" style="flex:1" onclick="remindCopy()">Copy setup code</button></div>
   <p class="dim" style="font-size:12px;margin-top:8px">Paste the setup code to Claude once, and again whenever you change these times or training days.</p>`
   :`<p class="dim" style="font-size:12px">Get a push at your workout time, and a check-in on training days if you skipped. Works from the Home Screen app.</p>`}`};
})();
