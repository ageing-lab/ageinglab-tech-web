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
t.style.setProperty('--i',i)});
var mtc=document.querySelector('meta[name="theme-color"]');
if(mtc)mtc.setAttribute('content',getComputedStyle(document.documentElement).getPropertyValue('--bg').trim())
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
var b=document.createElement('div');
b.className='cookies';b.setAttribute('role','region');b.setAttribute('aria-label','Aviso de cookies');
b.innerHTML='<img class="ck-ico" src="/img/cookie.svg" alt="" width="36" height="36" loading="lazy"><div class="ck-txt"><strong>Cookies</strong><p>Usamos cookies propias y de Google Analytics para entender cómo usas la web. Puedes aceptar o rechazar su uso; si lo rechizas, no se guardarán cookies de seguimiento. <a href="/cookies.html">Política de cookies</a>.</p></div><div class="ck-acc"><button type="button" class="ck-ok">Aceptar</button><button type="button" class="ck-no">Rechazar</button></div>';
document.body.appendChild(b);
function close(){b.classList.add('out');setTimeout(function(){b.remove()},300)}
b.querySelector('.ck-ok').addEventListener('click',function(){try{localStorage.setItem(CK,'granted')}catch(e){}updG({'analytics_storage':'granted','ad_storage':'granted','ad_user_data':'granted','ad_personalization':'granted'});close()});
b.querySelector('.ck-no').addEventListener('click',function(){try{localStorage.setItem(CK,'denied')}catch(e){}close()});
setTimeout(function(){b.classList.add('in')},400);
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
var d=s.querySelector('details');
if(d)d.open=true;
s.scrollIntoView({block:'start'});
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


/* Estado de éxito tras el redirect de Formspree (?enviado=1) */
(function(){
if(!/[?&]enviado=1/.test(location.search))return;
var f=document.querySelector('.contact-form');
if(!f)return;
var box=document.createElement('div');
box.className='cf-ok';
box.setAttribute('role','status');
box.innerHTML='<p class="cf-ok-t">¡Gracias! Hemos recibido tu mensaje.</p><p>Te responderemos en menos de 48 h.</p>';
f.replaceWith(box);
var s=box.closest('section');
if(s)setTimeout(function(){s.scrollIntoView({block:'center'})},0);
})();

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
