var CACHE='ageinglab-v10';
var CORE=[
'/',
'/styles.css',
'/js/main.js',
'/js/service-worker.js',
'/manifest.json',
'/img/icons/favicon.ico',
'/img/logo.svg',
'/img/cookie.svg',
'/cookies.html',
'/privacidad.html',
'/aviso-legal.html',
'/img/hero-poster.webp',
'/fonts/fonts.css',
'/fonts/bricolage-grotesque-latin-1.woff2',
'/fonts/bricolage-grotesque-latin-ext-1.woff2',
'/fonts/source-sans-3-latin-1.woff2',
'/fonts/source-sans-3-latin-ext-1.woff2',
'/img/icons/icon-192.png',
'/img/icons/icon-512.png',
'/img/icons/icon-maskable-512.png',
'/img/icons/apple-touch-icon.png',
  '/soluciones/',
  '/casos-de-exito/',
  '/guias/',
  '/guias/ia-privada-en-hospitales.html',
  '/guias/integrar-fhir.html',
  '/guias/interfaces-para-mayores.html',
  '/guias/iot-sensores-domicilio.html',
  '/guias/transcripcion-clinica-privada.html',
  '/guias/software-a-medida-salud.html',
  '/guias/hardware-ia-local.html',
'/servicios/',
'/servicios/ia-privada-automatizacion.html',
'/servicios/decisiones-con-ia.html',
'/servicios/software-a-medida.html',
'/servicios/iot-y-hardware.html',
'/servicios/interfaces-para-mayores.html',
'/servicios/investigacion-e-innovacion.html',
'/casos-de-exito/velocidad-marcha.html',
'/casos-de-exito/interfaz-adherencia.html',
'/casos-de-exito/integracam.html',
'/casos-de-exito/ecare.html',
'/casos-de-exito/integracion-fhir.html',
'/casos-de-exito/gestion-casos-quirurgicos.html',
'/casos-de-exito/cuidame.html',
'/casos-de-exito/juegos-cognitivos-madrid.html',
'/casos-de-exito/ia-local.html'
];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(CORE)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==CACHE}).map(function(x){return caches.delete(x)}))}))});
self.addEventListener('fetch',function(e){
var r=e.request;
if(r.method!=='GET')return;
var u;try{u=new URL(r.url)}catch(x){return}
if(u.origin!==self.location.origin)return;
if(r.destination==='video'||/\.(mp4|webm|ogv)$/.test(u.pathname))return;
e.respondWith(caches.match(r).then(function(c){
var n=fetch(r).then(function(res){if(res.ok)e.waitUntil(caches.open(CACHE).then(function(c2){c2.put(r,res.clone())}));return res}).catch(function(){return c});
return c?(e.waitUntil(n),c):n}));
});
