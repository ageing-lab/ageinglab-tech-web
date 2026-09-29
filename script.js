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
