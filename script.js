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
document.querySelectorAll('.hero p,.hero .btn,.lead,.step,.why>div,.team figure,.ind a,.kpi,.cta p,.cta .btn').forEach(function(el){
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
}
[].forEach.call(document.querySelectorAll('.theme .t'),function(b){b.addEventListener('click',function(){try{localStorage.setItem(TK,b.getAttribute('data-v'))}catch(e){}tpaint()})});
tpaint()}
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost')){navigator.serviceWorker.register('/sw.js').catch(function(){})}
(function(){
var CK='al-consent';
function val(){try{var v=localStorage.getItem(CK);return v==='granted'||v==='denied'?v:null}catch(e){return null}}
function updG(a){try{if(typeof gtag==='function')gtag('consent','update',a)}catch(e){}}
var c=val();
if(c==='granted')updG({'analytics_storage':'granted','ad_storage':'granted','ad_user_data':'granted','ad_personalization':'granted'});
if(c)return;
var sub=/\/(servicios|soluciones|casos-de-exito)\//.test(location.pathname)?'../':'';
var b=document.createElement('div');
b.className='cookies';b.setAttribute('role','region');b.setAttribute('aria-label','Aviso de cookies');
b.innerHTML='<img class="ck-ico" src="'+sub+'img/cookie.svg" alt="" width="36" height="36" loading="lazy"><div class="ck-txt"><strong>Cookies</strong><p>Usamos cookies propias y de Google Analytics para entender cómo usas la web. Puedes aceptar o rechazar su uso; si lo rechizas, no se guardarán cookies de seguimiento. <a href="'+sub+'cookies.html">Política de cookies</a>.</p></div><div class="ck-acc"><button type="button" class="ck-ok">Aceptar</button><button type="button" class="ck-no">Rechazar</button></div>';
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
