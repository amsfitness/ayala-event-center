const V='ayala-independent-v1';
const CORE=['./','index.html','manifest.webmanifest'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('ayala-')&&k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  if(url.origin!==self.location.origin)return;
  // Keep a tested application shell available; do not cache authentication redirects.
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>{
    if(hit)return hit;
    return fetch(e.request).then(r=>{
      if(r.ok&&!r.redirected&&r.type==='basic'){const cp=r.clone();e.waitUntil(caches.open(V).then(c=>c.put(e.request,cp)))}
      return r;
    }).catch(()=>e.request.mode==='navigate'?caches.match('index.html'):Response.error());
  }));
});
