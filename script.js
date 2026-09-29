var hd=document.getElementById('hd'),mis=[].slice.call(document.querySelectorAll('.mi'));
function closeAll(){mis.forEach(function(m){m.classList.remove('open');m.firstElementChild.setAttribute('aria-expanded','false')})}
mis.forEach(function(m){var b=m.firstElementChild;b.addEventListener('click',function(e){e.stopPropagation();var o=m.classList.contains('open');closeAll();if(!o){m.classList.add('open');b.setAttribute('aria-expanded','true')}})});
document.addEventListener('click',closeAll);
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeAll()});
document.getElementById('bg').addEventListener('click',function(){hd.classList.toggle('open')});
if(document.documentElement.classList.contains('js')){
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.2});
document.querySelectorAll('main h1,main h2').forEach(function(h){
h.setAttribute('aria-label',h.textContent.trim());
h.innerHTML=h.textContent.trim().split(/\s+/).map(function(t,i){return '<span class="wd" aria-hidden="true"><span style="--i:'+i+'">'+t+'</span></span>'}).join(' ');
io.observe(h)});
document.querySelectorAll('.hero p,.hero .btn,.lead,.step,.why>div,.team figure,.ind a,.cta p,.cta .btn').forEach(function(el){
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

[].forEach.call(document.querySelectorAll('nav a'),function(a){a.addEventListener('click',function(){hd.classList.remove('open')})});
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
b.innerHTML='<img class="ck-ico" src="'+sub+'img/cookie.svg" alt="" width="36" height="36" loading="lazy"><div class="ck-txt"><strong>Cookies</strong><p>Usamos cookies propias y de Google Analytics para entender cómo usas la web. Puedes aceptar o rechazar su uso; si lo rechizas, no se guardarán cookies de seguimiento.</p></div><div class="ck-acc"><button type="button" class="ck-ok">Aceptar</button><button type="button" class="ck-no">Rechazar</button></div>';
document.body.appendChild(b);
function close(){b.classList.add('out');setTimeout(function(){b.remove()},300)}
b.querySelector('.ck-ok').addEventListener('click',function(){try{localStorage.setItem(CK,'granted')}catch(e){}updG({'analytics_storage':'granted','ad_storage':'granted','ad_user_data':'granted','ad_personalization':'granted'});close()});
b.querySelector('.ck-no').addEventListener('click',function(){try{localStorage.setItem(CK,'denied')}catch(e){}close()});
setTimeout(function(){b.classList.add('in')},400);
})();
