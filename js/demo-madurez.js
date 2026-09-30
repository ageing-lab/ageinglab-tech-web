// Escalera de madurez tecnológica (TRL): guía orientativa. No evalúa proyectos ni guarda nada.
'use strict';

const ETAPAS = ['Idea y prueba de concepto', 'Prototipo y validación', 'Demostración y despliegue'];
const NIVELES = [
  { n: 'Principios básicos observados',
    s: 'Hay una base científica o técnica que sugiere que la idea es posible, pero todavía no hay nada construido.',
    c: 'Puedes explicar en qué principio se apoya la idea y qué evidencia hay a su favor.',
    t: 'Definir bien el problema y la hipótesis, y valorar si la tecnología, incluida la IA, aporta algo. Todavía no toca construir.' },
  { n: 'Concepto tecnológico formulado',
    s: 'La idea se ha convertido en un concepto concreto: qué haría, para quién y con qué tecnología, aunque sea sobre el papel.',
    c: 'Tienes un boceto del sistema y una lista de requisitos, pero nada funcionando.',
    t: 'Definir el proyecto técnico: alcance, requisitos y arquitectura preliminar, y decidir qué hay que demostrar primero.' },
  { n: 'Prueba de concepto experimental',
    s: 'Se ha probado la parte más crítica de la idea de forma aislada, con un experimento o un montaje sencillo.',
    c: 'Has visto funcionar lo más arriesgado, aunque sea con datos o piezas de prueba.',
    t: 'Construir un primer prototipo que junte las piezas clave y decidir con qué datos o usuarios se va a validar.' },
  { n: 'Validación en laboratorio',
    s: 'Las piezas funcionan juntas en condiciones controladas.',
    c: 'El prototipo funciona en tu entorno de pruebas, con datos o casos preparados.',
    t: 'Probar con datos y situaciones más reales, medir el rendimiento y ajustar la arquitectura antes de salir del entorno controlado.' },
  { n: 'Validación en entorno relevante',
    s: 'El prototipo se ha probado en un entorno parecido al real, aunque no sea el definitivo.',
    c: 'Lo han usado personas o datos reales en un piloto controlado.',
    t: 'Endurecer el prototipo: fiabilidad, seguridad y usabilidad, y preparar la integración con los sistemas de la organización.' },
  { n: 'Demostración en entorno relevante',
    s: 'Un prototipo representativo funciona en un entorno relevante y se ha demostrado con resultados.',
    c: 'Puedes enseñar resultados medidos con usuarios o datos reales.',
    t: 'Cerrar la arquitectura de producción y planificar el paso a un sistema completo, con su integración y su mantenimiento.' },
  { n: 'Prototipo demostrado en entorno operativo',
    s: 'El sistema se ha demostrado funcionando en su entorno operativo real, aunque todavía como prototipo.',
    c: 'Está en uso real, con supervisión, en condiciones normales de trabajo.',
    t: 'Resolver lo que falta para producción: despliegue, monitorización, documentación y los requisitos normativos que apliquen.' },
  { n: 'Sistema completo y cualificado',
    s: 'El sistema está terminado y ha superado las pruebas y validaciones necesarias.',
    c: 'Está completo, probado y documentado, y cumple los requisitos que le aplican.',
    t: 'Preparar el despliegue o la fabricación a escala. La certificación y la industrialización suelen requerir socios especializados.' },
  { n: 'Sistema probado en entorno operativo real',
    s: 'El sistema funciona en producción, con uso real sostenido.',
    c: 'Lleva tiempo en uso real y hay datos de cómo se comporta.',
    t: 'Mantener, mejorar y ampliar: actualizaciones, soporte y nuevas funciones a partir de lo que enseña el uso real.' },
];

if (typeof module !== 'undefined') module.exports = { NIVELES, ETAPAS };

if (typeof document !== 'undefined') {
  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt !== undefined) e.textContent = txt; return e; };
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const det = document.querySelector('#demo-madurez .prueba');
  const r = $('mt-r'), esc = $('mt-esc'), orb = esc.querySelector('.mt-orb');
  const num = $('mt-num'), res = document.querySelector('#demo-madurez .mt-res');
  const stages = Array.prototype.slice.call(document.querySelectorAll('#demo-madurez .mt-st'));
  const burst = $('mt-burst');
  const barras = [];
  let abierto = false, rafId = 0, burstFin = 0, prev = 1;

  const par = (id, titulo, texto) => { const p = $(id); p.textContent = ''; p.append(el('strong', '', titulo + ' '), texto); };

  function cuenta(v) {
    if (rafId) cancelAnimationFrame(rafId);
    if (reduce) { num.textContent = v; return; }
    const desde = parseInt(num.textContent, 10) || 0;
    if (desde === v) return;
    const t0 = performance.now(), dur = 420;
    const paso = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      num.textContent = Math.round(desde + (v - desde) * e);
      if (k < 1) rafId = requestAnimationFrame(paso); else rafId = 0;
    };
    rafId = requestAnimationFrame(paso);
  }

  function fiereza() {
    if (reduce) return;
    if (burstFin) clearTimeout(burstFin);
    burst.innerHTML = '';
    const colores = ['#3ee0c8', '#786eff', '#ffd166', '#fff'];
    for (let i = 0; i < 18; i++) {
      const p = el('i');
      p.style.setProperty('--a', Math.round(Math.random() * 360) + 'deg');
      p.style.setProperty('--d', Math.round(70 + Math.random() * 90) + 'px');
      p.style.setProperty('--c', colores[i % 4]);
      burst.appendChild(p);
    }
    burst.classList.remove('go'); void burst.offsetWidth; burst.classList.add('go');
    burstFin = setTimeout(() => { burst.classList.remove('go'); burst.innerHTML = ''; burstFin = 0; }, 1200);
  }

  function pon(v) {
    const d = NIVELES[v - 1], txt = 'Nivel ' + v + ': ' + d.n;
    r.value = v; r.setAttribute('aria-valuetext', txt);
    r.style.setProperty('--fill', (v / 9 * 100) + '%');
    barras.forEach((b, i) => {
      b.classList.toggle('mt-on', i + 1 <= v);
      b.classList.toggle('mt-act', i + 1 === v);
      b.setAttribute('aria-pressed', String(i + 1 === v));
    });
    const etapa = Math.floor((v - 1) / 3);
    $('mt-eta').textContent = 'Etapa ' + (etapa + 1) + ' de 3 · ' + ETAPAS[etapa];
    $('mt-tit').textContent = txt;
    par('mt-sig', 'Qué significa:', d.s);
    par('mt-sen', 'Cómo saber que estás aquí:', d.c);
    par('mt-toc', 'Qué suele tocar ahora:', d.t);
    stages.forEach((s, i) => s.classList.toggle('on', i === etapa));
    const b = barras[v - 1];
    orb.style.left = (b.offsetLeft + b.offsetWidth / 2) + 'px';
    orb.style.top = (b.offsetTop - 12) + 'px';
    if (abierto && v !== prev && !reduce) { orb.classList.remove('mt-hop'); void orb.offsetWidth; orb.classList.add('mt-hop'); }
    prev = v;
    if (!reduce) { res.classList.remove('sw'); void res.offsetWidth; res.classList.add('sw'); }
    cuenta(v);
    if (v === 9) fiereza();
  }

  NIVELES.forEach((d, i) => {
    const b = el('button', 'mt-p', String(i + 1));
    b.type = 'button';
    b.style.setProperty('--i', i);
    b.setAttribute('aria-label', 'Nivel ' + (i + 1) + ': ' + d.n);
    b.addEventListener('click', () => pon(i + 1));
    barras.push(b);
    esc.append(b);
  });
  stages.forEach((s) => s.addEventListener('click', () => pon(+s.dataset.n)));
  r.addEventListener('input', () => pon(+r.value));
  det.addEventListener('toggle', () => {
    if (det.open && !abierto) {
      abierto = true;
      esc.classList.add('in');
      requestAnimationFrame(() => pon(+r.value));
    }
  });
  pon(1);
}
