// Godrank offline cache: app shell precached, everything else (fonts) cached on first use.
importScripts('push-messages.js');
const V='godrank-v17';
const SHELL=['./','index.html','manifest.webmanifest','badges.js','godfx.js','anatomy-shapes.js','anatomy.js','bodygraph.js','push-messages.js','reminders.js','exercises.js','illustrations.js','planner.js','voidbg.js',
  'assets/anatomy.jpg','assets/ranks/north.jpg','assets/ranks/sword.jpg','assets/ranks/death.jpg','assets/ranks/demon.jpg','assets/ranks/fighting.jpg','assets/ranks/dragon.jpg','assets/ranks/technique.jpg','assets/ranks/multi.jpg','assets/bodygraph/base.jpg','assets/bodygraph/labels.png','assets/rudeus.jpg','assets/icons/icon-180.png','assets/icons/icon-192.png','assets/icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!=='godrank-state').map(k=>caches.delete(k)))));self.clients.claim()});
// network first (so updates land), cache as fallback when offline
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(V).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))))});

// reminders: the scheduled sender only says which kind ('gym' | 'evening' | 'test'); the wording comes from the
// state the app last saved, so it knows if you trained, how many sessions you skipped, your rank, ...
self.addEventListener('push',e=>{let kind='gym';try{kind=(e.data&&e.data.json().kind)||'gym'}catch(_){}
  e.waitUntil(caches.open('godrank-state').then(async c=>{
    const st=await c.match('state').then(r=>r?r.json():null).catch(()=>null),recent=await c.match('recent').then(r=>r?r.json():[]).catch(()=>[]);
    const m=GodrankMsg.pick(kind==='evening'?'evening':'gym',st,recent);
    await c.put('recent',new Response(JSON.stringify([m.id,...recent].slice(0,6))));
    return self.registration.showNotification(m.title,{body:m.body,icon:'assets/icons/icon-192.png',badge:'assets/icons/icon-192.png',tag:'godrank-'+kind})}))});
self.addEventListener('notificationclick',e=>{e.notification.close();
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(ws=>ws.length?ws[0].focus():clients.openWindow('./')))});
