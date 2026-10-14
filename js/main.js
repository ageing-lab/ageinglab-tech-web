var hd=document.getElementById('hd'),mis=[].slice.call(document.querySelectorAll('.mi'));
function closeAll(){mis.forEach(function(m){m.classList.remove('open');m.firstElementChild.setAttribute('aria-expanded','false')})}
mis.forEach(function(m){var b=m.firstElementChild;b.addEventListener('click',function(e){e.stopPropagation();var o=m.classList.contains('open');closeAll();if(!o){m.classList.add('open');b.setAttribute('aria-expanded','true')}})});
document.addEventListener('click',closeAll);
var bg=document.getElementById('bg');
function setBurger(o){bg.setAttribute('aria-expanded',o?'true':'false');bg.setAttribute('aria-label',o?'Cerrar menú':'Abrir menú')}
setBurger(false);
document.addEventListener('keydown',function(e){if(e.key==='Escape'){closeAll();hd.classList.remove('open');setBurger(false)}});
bg.addEventListener('click',function(){setBurger(hd.classList.toggle('open'))});
if(document.documentElement.classList.contains('js')){
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.2});
document.querySelectorAll('main h1,main h2').forEach(function(h){
h.setAttribute('aria-label',h.textContent.trim());
h.innerHTML=h.textContent.trim().split(/\s+/).map(function(t,i){return '<span class="wd" aria-hidden="true"><span style="--i:'+i+'">'+t+'</span></span>'}).join(' ');
io.observe(h)});
document.querySelectorAll('.hero p,.hero .btn,.lead,.step,.why>div,.team figure,.people>li,.ind a,.kpi,.cta p,.cta .btn').forEach(function(el){
var i=Math.min([].indexOf.call(el.parentNode.children,el),5),d=i*.1+(el.closest('.hero')?.5:0);
el.classList.add('rv');el.style.setProperty('--d',d+'s');io.observe(el)})}
var hv=document.querySelector('.hv');if(hv&&matchMedia('(prefers-reduced-motion:reduce)').matches){hv.removeAttribute('autoplay');hv.pause()}
var dks=[].slice.call(document.querySelectorAll('.dark'));
function upd(){var o=hd.classList.contains('open')||mis.some(function(m){return m.classList.contains('open')});hd.classList.toggle('sc',scrollY>40||o);
var y=hd.getBoundingClientRect().bottom-30,dk=false;
if(!o)dks.forEach(function(d){var r=d.getBoundingClientRect();if(r.top<=y&&r.bottom>=y)dk=true});
hd.classList.toggle('ondark',dk)}
var mo=new MutationObserver(upd);mis.forEach(function(m){mo.observe(m,{attributes:true,attributeFilter:['class']})});
document.getElementById('bg').addEventListener('click',upd);
addEventListener('scroll',upd,{passive:true});upd();

[].forEach.call(document.querySelectorAll('nav a'),function(a){a.addEventListener('click',function(){hd.classList.remove('open');setBurger(false)})});
var thm=[].slice.call(document.querySelectorAll('.theme'));
if(thm.length){
var TK='al-theme';
function tcur(){var v;try{v=localStorage.getItem(TK)}catch(e){v=null}return v==='light'||v==='dark'?v:'auto'}
function tpaint(){
var v=tcur(),r=document.documentElement;
if(v==='auto')r.removeAttribute('data-theme');else r.setAttribute('data-theme',v);
thm.forEach(function(t){
var bs=[].slice.call(t.querySelectorAll('.t')),i=0;
bs.forEach(function(b,j){var on=b.getAttribute('data-v')===v;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on?'true':'false');if(on)i=j});
t.style.setProperty('--i',i)})
}
[].forEach.call(document.querySelectorAll('.theme .t'),function(b){b.addEventListener('click',function(){try{localStorage.setItem(TK,b.getAttribute('data-v'))}catch(e){}tpaint()})});
var mq=matchMedia('(prefers-color-scheme: dark)');
if(mq.addEventListener)mq.addEventListener('change',function(){if(tcur()==='auto')tpaint()});
tpaint()}
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost')){navigator.serviceWorker.register('/js/service-worker.js').catch(function(){})}
(function(){
var CK='al-consent';
function val(){try{var v=localStorage.getItem(CK);return v==='granted'||v==='denied'?v:null}catch(e){return null}}
function updG(a){try{if(typeof gtag==='function')gtag('consent','update',a)}catch(e){}}
var c=val();
if(c==='granted')updG({'analytics_storage':'granted','ad_storage':'granted','ad_user_data':'granted','ad_personalization':'granted'});
if(c)return;
var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
var sc=document.createElement('div');sc.className='ck-scrim';sc.setAttribute('aria-hidden','true');
var b=document.createElement('div');
b.className='cookies';b.setAttribute('role','region');b.setAttribute('aria-label','Aviso de cookies');
b.innerHTML='<div class="ck-cookie" aria-hidden="true"><img src="/img/cookie.svg" alt="" width="132" height="132" decoding="async"></div><div class="ck-crumbs" aria-hidden="true"></div><div class="ck-card"><div class="ck-txt"><strong>Tú decides qué cookies guardamos</strong><p>Usamos cookies propias y de Google Analytics para saber qué partes de la web te resultan útiles. Si las rechazas, no se guardará ninguna cookie de seguimiento. <a href="/cookies.html">Política de cookies</a></p></div><div class="ck-acc"><button type="button" class="ck-ok">Aceptar</button><button type="button" class="ck-no">Rechazar</button></div></div>';
document.body.appendChild(sc);document.body.appendChild(b);
var busy=false;
function close(){b.classList.remove('in');b.classList.add('out');sc.classList.remove('in');sc.classList.add('out');setTimeout(function(){b.remove();sc.remove()},350)}
function crumbs(){
var w=b.querySelector('.ck-crumbs'),cl=['#8a4b38','#da9f83','#3ee0c8','#ffffff'],h='',n=16;
for(var i=0;i<n;i++){var a=Math.PI*2*i/n+Math.random()*.4,d=80+Math.random()*100,z=7+Math.random()*8;
h+='<i style="--dx:'+Math.round(Math.cos(a)*d)+'px;--dy:'+Math.round(Math.sin(a)*d-24)+'px;--r:'+Math.round(Math.random()*360)+'deg;--s:'+z.toFixed(1)+'px;--c:'+cl[i%cl.length]+'"></i>'}
w.innerHTML=h}
function pick(v){
if(busy)return;busy=true;
[].forEach.call(b.querySelectorAll('button'),function(x){x.disabled=true});
try{localStorage.setItem(CK,v)}catch(e){}
if(v==='granted')updG({'analytics_storage':'granted','ad_storage':'granted','ad_user_data':'granted','ad_personalization':'granted'});
if(rm){close();return}
if(v==='granted'){crumbs();b.classList.add('munch');setTimeout(close,780)}
else{b.classList.add('nope');setTimeout(close,520)}}
b.querySelector('.ck-ok').addEventListener('click',function(){pick('granted')});
b.querySelector('.ck-no').addEventListener('click',function(){pick('denied')});
setTimeout(function(){b.classList.add('in');sc.classList.add('in')},400);
})();

/* Modo simulación "persona mayor" (solo en servicios/interfaces-para-mayores.html) */
(function(){
var btn=document.getElementById('sim-start');
if(!btn)return;
var KEY='al-sim',root=document.documentElement;
var nav=document.getElementById('simnav'),prog=document.getElementById('simprog');
var prev=document.getElementById('simprev'),exitB=document.getElementById('simexit'),next=document.getElementById('simnext');
var slides=[].slice.call(document.querySelectorAll('main [data-slide]'));
slides.sort(function(a,b){return (+a.dataset.slide)-(+b.dataset.slide)});
var total=slides.length?+slides[slides.length-1].dataset.slide:0;
var texts=[].slice.call(document.querySelectorAll('[data-sim-text]'));
var on=false,cur=0;
function slideEl(n){for(var i=0;i<slides.length;i++){if(+slides[i].dataset.slide===n)return slides[i]}return null}
function headOf(n){var s=slideEl(n);return s?s.querySelector('h1,h2,h3'):null}
function paint(){
slides.forEach(function(s){s.classList.toggle('on',+s.dataset.slide===cur)});
prev.disabled=cur<=1;next.disabled=cur>=total;
var h=headOf(cur);
prog.textContent='Pantalla '+cur+' de '+total+(h?' — '+h.textContent.trim():'');
if(on){try{sessionStorage.setItem(KEY,String(cur))}catch(e){}}
}
function go(n){cur=Math.max(1,Math.min(total,n));paint();
if(readOn)readScreen();
var a=document.activeElement;
if(on&&(!a||a===document.body||!a.offsetParent)){var t=next.disabled?prev:next;if(t)t.focus()}
}
function focusSlide(){var h=headOf(cur);if(h){h.setAttribute('tabindex','-1');h.focus({preventScroll:true})}}
function enter(start,quiet){
if(on)return;
on=true;
root.setAttribute('data-sim','mayor');
texts.forEach(function(el){
if(el._simHtml===undefined){el._simHtml=el.innerHTML;el._simAria=el.getAttribute('aria-label')}
el.innerHTML=el.dataset.simText;
if(el._simAria!==null)el.setAttribute('aria-label',el.dataset.simText);
});
cur=start>=1&&start<=total?start:1;
paint();
if(!quiet)setTimeout(focusSlide,0);
}
function leave(){
if(!on)return;
on=false;
stopSpeech();
readOn=false;
readBtn.setAttribute('aria-pressed','false');
root.removeAttribute('data-sim');
texts.forEach(function(el){
el.innerHTML=el._simHtml;
if(el._simAria!==null)el.setAttribute('aria-label',el._simAria);else el.removeAttribute('aria-label')});
slides.forEach(function(s){s.classList.remove('on')});
try{sessionStorage.removeItem(KEY)}catch(e){}
var s=slideEl(cur);
if(s){var de=document.documentElement,old=de.style.scrollBehavior;de.style.scrollBehavior='auto';s.scrollIntoView({block:'start'});de.style.scrollBehavior=old}
focusSlide();
}
btn.addEventListener('click',function(){enter(1)});
prev.addEventListener('click',function(){go(cur-1)});
next.addEventListener('click',function(){go(cur+1)});
exitB.addEventListener('click',leave);
/* Lector de pantalla: lee la pantalla visible en voz alta, elemento a
   elemento, y resalta con .sim-hl lo que se está escuchando (Web Speech API) */
var synth=window.speechSynthesis||null;
var readOn=false,readTok=0;
var readBtn=document.getElementById('simread');
var readLbl=readBtn?readBtn.querySelector('.sim-l'):null;
function clearHl(){[].slice.call(root.querySelectorAll('.sim-hl')).forEach(function(e){e.classList.remove('sim-hl')})}
function readUI(talking){readBtn.classList.toggle('talking',talking);if(readLbl)readLbl.textContent=talking?'Escuchando':'Leer'}
function stopSpeech(){readTok++;if(synth)synth.cancel();clearHl();readUI(false)}
function readScreen(){
if(!synth||!readOn)return;
var my=++readTok;
synth.cancel();
clearHl();
var s=slideEl(cur);
if(!s)return;
var els=[].slice.call(s.querySelectorAll('h1,h2,h3,p,li,summary,label,button'));
var items=[];
els.forEach(function(el){var t=el.textContent.replace(/\s+/g,' ').trim();if(t)items.push([el,t])});
if(!items.length)return;
var i=0;
function pick(u){var vs=synth.getVoices();for(var j=0;j<vs.length;j++){if(vs[j].lang&&vs[j].lang.toLowerCase().indexOf('es')===0){u.voice=vs[j];break}}}
function step(){
if(i>=items.length||my!==readTok)return;
var el=items[i][0],tx=items[i][1];
el.classList.add('sim-hl');
readUI(true);
var u=new SpeechSynthesisUtterance(tx);
u.lang='es-ES';
pick(u);
u.onend=function(){if(my!==readTok)return;el.classList.remove('sim-hl');i++;if(i<items.length)step();else readUI(false)};
u.onerror=function(){if(my!==readTok)return;el.classList.remove('sim-hl');readUI(false)};
synth.speak(u);
}
step();
}
readBtn.addEventListener('click',function(){
readOn=!readOn;
readBtn.setAttribute('aria-pressed',readOn?'true':'false');
if(readOn)readScreen();else stopSpeech();
});
/* Alto contraste: conmuta data-contrast en el modo simulación */
var conBtn=document.getElementById('simcontrast');
conBtn.addEventListener('click',function(){
var hc=root.hasAttribute('data-contrast');
if(hc)root.removeAttribute('data-contrast');else root.setAttribute('data-contrast','alto');
conBtn.setAttribute('aria-pressed',hc?'false':'true');
});
document.addEventListener('keydown',function(e){
if(!on)return;
var t=e.target;
if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.tagName==='SELECT'||t.isContentEditable))return;
if(e.key==='Escape'){leave()}
else if(e.key==='ArrowRight'){e.preventDefault();go(cur+1)}
else if(e.key==='ArrowLeft'){e.preventDefault();go(cur-1)}
});
var back=0;try{back=+sessionStorage.getItem(KEY)||0}catch(e){}
if(back>=1)enter(back,true);
})();
/* "Prueba tú mismo" del hero: despliega la demo y baja hasta ella */
[].forEach.call(document.querySelectorAll('.hero a[data-prueba]'),function(a){
a.addEventListener('click',function(e){
e.preventDefault();
var s=document.querySelector(a.getAttribute('href'));
if(!s)return;
var d=s.tagName==='DETAILS'?s:s.querySelector('details');
if(d)d.open=true;
(d||s).scrollIntoView({block:'start'});
});
});

/* Vídeos de YouTube: la miniatura se incrusta en la página al pulsar.
   Sin JS, o abriendo el archivo en file:// (sin origen, YouTube da error 153), el enlace va a YouTube. */
[].forEach.call(document.querySelectorAll('.vplay[data-embed]'),function(a){
a.addEventListener('click',function(e){
if(location.protocol==='file:')return;
e.preventDefault();
var src=a.getAttribute('data-embed'),box=a.parentNode,f=document.createElement('iframe');
if(location.protocol==='http:'||location.protocol==='https:')src+='&origin='+encodeURIComponent(location.origin)+'&widget_referrer='+encodeURIComponent(location.href);
f.src=src;
f.title=a.getAttribute('data-title')||'Vídeo de YouTube';
f.setAttribute('allow','accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
f.setAttribute('referrerpolicy','strict-origin-when-cross-origin');
f.setAttribute('allowfullscreen','');
box.innerHTML='';
box.appendChild(f);
f.focus();
});
});


/* Relleno automático del desplegable "interes": si la página no trae ninguna
   opción marcada (o marca el placeholder), se elige una sola. */
[].forEach.call(document.querySelectorAll('.contact-form select[name="interes"]'),function(s){
if(s.value)return;
var os=[].slice.call(s.options).filter(function(o){return o.value&&!o.disabled});
if(!os.length)return;
var fallback=os.filter(function(o){return o.value==='Aún no lo sé'})[0]||os[0];
s.value=fallback.value;
});




/* Equipo: foco de luz que sigue al puntero */
(function(){
var ps=[].slice.call(document.querySelectorAll('.person'));
if(!ps.length||!matchMedia('(hover:hover)').matches)return;
ps.forEach(function(p){p.addEventListener('pointermove',function(e){var r=p.getBoundingClientRect();p.style.setProperty('--mx',(e.clientX-r.left)+'px');p.style.setProperty('--my',(e.clientY-r.top)+'px')})});
})();

/* ===== GA4 · eventos de conversión =====
   Consent Mode v2 (en el <head>) decide si los hits van con cookies o modelados;
   aquí solo se empujan los eventos a dataLayer. */
(function(){
if(typeof gtag!=='function')return;
function ev(n,p){try{gtag('event',n,p)}catch(e){}}
function label(el){return((el&&el.textContent)||'').replace(/\s+/g,' ').trim().slice(0,60)}

/* 1 · Envío del formulario de contacto (Formspree).
   Se retrasa la navegación para que el beacon llegue a GA antes de salir. */
document.addEventListener('submit',function(e){
var f=e.target;
if(!f||f.tagName!=='FORM'||!/formspree\.io/.test(f.getAttribute('action')||''))return;
e.preventDefault();
var s=f.querySelector('select[name="interes"]');
ev('contact_submit',{page:location.pathname,interes:s?s.value:''});
var sent=false;
setTimeout(function(){
if(sent)return;sent=true;
try{HTMLFormElement.prototype.submit.call(f)}catch(x){try{f.submit()}catch(y){}}
},250);
},true);

/* 2 · Clic en cualquier CTA (botones y enlaces a #contacto) */
document.addEventListener('click',function(e){
var a=e.target&&e.target.closest?e.target.closest('a.btn, a[href*="#contacto"]'):null;
if(!a||a.hasAttribute('data-prueba'))return;
ev('cta_click',{page:location.pathname,cta:label(a),target:a.getAttribute('href')||''});
},true);

/* 3 · Apertura de demos: "Prueba tú mismo" (hero) y acordeones de las fichas */
document.addEventListener('click',function(e){
var t=e.target;
if(!t||!t.closest)return;
var p=t.closest('[data-prueba]');
if(p){ev('demo_open',{page:location.pathname,demo:(p.getAttribute('href')||'').replace('#','')||'cta',via:'cta'});return}
var sm=t.closest('.prueba summary');
if(!sm)return;
var d=sm.parentNode,sec=d.closest('section');
ev('demo_open',{page:location.pathname,demo:(sec&&sec.id)||d.id||'acordeon',via:'accordion'});
},true);
})();

/* Simulador de velocidad de tokens: escribe una respuesta de ejemplo
   a ~30 tokens/s (1 token ≈ 1 palabra). En index.html e ia-local.html. */
(function(){
var boxes=document.querySelectorAll('[data-tok-sim]');
if(!boxes.length)return;
var TEXT='Informe de prueba (datos ficticios): la paciente, de 78 años, presenta marcha estable con apoyo puntual. Se recomienda revisar la medicación actual, mantener los paseos diarios y citar en dos semanas para control. No se observan signos de alarma y la adherencia al plan se mantiene en torno al 80 %. Este borrador se ha generado dentro del servidor local, sin que ningún dato salga del edificio.';
var toks=TEXT.match(/\S+\s*/g)||[];
var reduced=false;
try{reduced=matchMedia('(prefers-reduced-motion:reduce)').matches}catch(e){}
function fmtT(ms){return (ms/1000).toFixed(1).replace('.',',')+' s'}
[].forEach.call(boxes,function(box){
var out=box.querySelector('[data-tok-out]');
var btn=box.querySelector('[data-tok-go]');
var meta=box.querySelector('[data-tok-meta]');
if(!out||!btn||!meta)return;
var RATE=+(box.getAttribute('data-rate')||30)||30;
function paint(n,ms){meta.textContent=n+' tokens · '+fmtT(ms)+' · '+RATE+' tokens/s'}
var timer=null;
btn.addEventListener('click',function(){
if(timer)return;
out.textContent='';
var cur=document.createElement('span');
cur.className='tok-cur';cur.setAttribute('aria-hidden','true');
out.appendChild(cur);
var i=0,t0=performance.now();
btn.textContent='Generando…';
paint(0,0);
if(reduced){
out.textContent=TEXT;
paint(toks.length,1000*toks.length/RATE);
btn.textContent='Repetir a '+RATE+' tokens/s';
return;
}
timer=setInterval(function(){
var el=performance.now()-t0;
var want=Math.min(toks.length,Math.floor(el*RATE/1000));
while(i<want){
cur.insertAdjacentText('beforebegin',toks[i]);
i++;
}
paint(i,el);
if(i>=toks.length){
clearInterval(timer);timer=null;
cur.remove();
btn.textContent='Repetir a '+RATE+' tokens/s';
if(typeof gtag==='function'){try{gtag('event','demo_open',{page:location.pathname,demo:'simulador-tokens',via:'button'})}catch(e){}}
}
},33);
});
});
})();

/* Relleno de la sección a 30 tokens/s: el botón [data-tok-fill] vacía
   los textos de su sección (h2, párrafos y KPIs) y los reescribe
   palabra a palabra a 30 tokens/s, conservando enlaces y formato. */
(function(){
var btns=document.querySelectorAll('[data-tok-fill]');
if(!btns.length)return;
var RATE=30;
var reduced=false;
try{reduced=matchMedia('(prefers-reduced-motion:reduce)').matches}catch(e){}
function fmtT(ms){return (ms/1000).toFixed(1).replace('.',',')+' s'}
[].forEach.call(btns,function(btn){
var sec=btn.closest('section');
if(!sec)return;
var meta=sec.querySelector('[data-tok-fill-meta]');
var status=sec.querySelector('[data-tok-fill-status]');
var nodes=[];
[].forEach.call(sec.querySelectorAll('h2, p.lead, .kpi'),function(el){
var w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null);
var n;
while(n=w.nextNode()){
if(/\S/.test(n.nodeValue))nodes.push({n:n,full:n.nodeValue});
}
});
if(!nodes.length)return;
var toks=[];
nodes.forEach(function(o){
var m=o.full.match(/\S+\s*/g)||[];
m.forEach(function(t){toks.push({n:o.n,t:t})});
});
function paint(c,ms){if(meta)meta.textContent=c+' tokens · '+fmtT(ms)+' · '+RATE+' tokens/s'}
var timer=null;
var cur=document.createElement('span');
cur.className='tok-cur';cur.setAttribute('aria-hidden','true');
btn.addEventListener('click',function(){
if(timer)return;
/* Salto instantáneo al inicio de la sección, sin transición suave */
var de=document.documentElement,old=de.style.scrollBehavior;
de.style.scrollBehavior='auto';
try{sec.scrollIntoView({block:'start'})}catch(e){sec.scrollIntoView()}
de.style.scrollBehavior=old;
nodes.forEach(function(o){o.n.nodeValue=''});
if(cur.parentNode)cur.remove();
var i=0,t0=performance.now();
btn.textContent='Generando…';
paint(0,0);
if(status)status.textContent='';
if(reduced){
nodes.forEach(function(o){o.n.nodeValue=o.full});
paint(toks.length,1000*toks.length/RATE);
btn.textContent='Repetir la prueba';
if(status)status.textContent='Texto mostrado al completo.';
return;
}
timer=setInterval(function(){
var el=performance.now()-t0;
var want=Math.min(toks.length,Math.floor(el*RATE/1000));
while(i<want){
var tk=toks[i];
tk.n.nodeValue+=tk.t;
i++;
}
if(i<toks.length){
var cn=toks[Math.min(i,toks.length-1)].n;
if(cn.parentNode)cn.parentNode.insertBefore(cur,cn.nextSibling);
}
paint(i,el);
if(i>=toks.length){
clearInterval(timer);timer=null;
if(cur.parentNode)cur.remove();
btn.textContent='Repetir la prueba';
if(status)status.textContent='Texto regenerado a 30 tokens por segundo de media.';
if(typeof gtag==='function'){try{gtag('event','demo_open',{page:location.pathname,demo:'relleno-30-tokens',via:'button'})}catch(e){}}
}
},33);
});
});
})();

/* ===== Transiciones entre páginas =====
   El CSS (@view-transition) hace el fundido. Aquí se nombra el título pulsado en la página
   de origen y el h1 en la de destino para que se transformen uno en otro. */
(function(){
var NAME='vt-title',KEY='al-vt',last=null;
document.addEventListener('click',function(e){var a=e.target&&e.target.closest?e.target.closest('a[href]'):null;last=a||null},true);
function path(u){try{var x=new URL(u,location.href);return x.origin===location.origin?x.pathname.replace(/index\.html$/,''):null}catch(e){return null}}
function heading(a){
var h=a.closest('h1,h2,h3')||a.querySelector('h2,h3');
if(h)return h;
var box=a.closest('article,li,.card');
return box?box.querySelector('h2,h3'):null}
window.addEventListener('pageswap',function(e){
if(!e.viewTransition||!e.activation||!e.activation.entry||!last)return;
var to=path(e.activation.entry.url);
if(!to||to!==path(last.href)||to===path(location.href))return;
var h=heading(last);
if(!h)return;
h.style.viewTransitionName=NAME;
try{sessionStorage.setItem(KEY,'1')}catch(x){}});
window.addEventListener('pagereveal',function(e){
var on=false;
try{on=sessionStorage.getItem(KEY)==='1';sessionStorage.removeItem(KEY)}catch(x){}
if(!on||!e.viewTransition)return;
var h=document.querySelector('main h1');
if(h)h.style.viewTransitionName=NAME});
/* Precarga la página al acercar el cursor o al empezar a pulsar: la transición se siente inmediata */
if(window.HTMLScriptElement&&HTMLScriptElement.supports&&HTMLScriptElement.supports('speculationrules')){
var s=document.createElement('script');s.type='speculationrules';
s.textContent=JSON.stringify({prefetch:[{where:{href_matches:'/*'},eagerness:'moderate'}]});
document.head.appendChild(s)}
})();
