// Godrank offline cache: app shell precached, everything else (fonts) cached on first use.
const V='godrank-v7';
const SHELL=['./','index.html','manifest.webmanifest','badges.js','godfx.js','anatomy-shapes.js','anatomy.js','exercises.js','illustrations.js','planner.js','voidbg.js',
  'assets/anatomy.jpg','assets/ranks/north.jpg','assets/ranks/sword.jpg','assets/ranks/death.jpg','assets/ranks/demon.jpg','assets/ranks/fighting.jpg','assets/ranks/dragon.jpg','assets/ranks/technique.jpg','assets/rudeus.jpg','assets/icons/icon-180.png','assets/icons/icon-192.png','assets/icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))));self.clients.claim()});
// network first (so updates land), cache as fallback when offline
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(V).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))))});
