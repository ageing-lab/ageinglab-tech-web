// Prueba interna: resumen en local con Transformers.js (WebGPU).
// No se registra en sitemap ni en el service worker. Sin Analytics a propósito.

const LIBS = [
  'https://cdn.jsdelivr.net/npm/@huggingface/transformers@4',
  'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3',
];

const $ = (id) => document.getElementById(id);
const sel = $('pr-modelo'), btnCargar = $('pr-cargar');
const prog = $('pr-prog'), fill = $('pr-fill'), ptxt = $('pr-ptxt'), estado = $('pr-estado');
const txt = $('pr-texto'), nChars = $('pr-n'), btnResumir = $('pr-resumir');
const salida = $('pr-salida'), meta = $('pr-meta');
const netN = $('pr-net'), netUrls = $('pr-urls'), offBadge = $('pr-offline');

const EJEMPLOS = [
  'Ejemplo 1 (ficticio) — Nota de consulta: paciente ficticio de 76 años que acude a revisión. Refiere caminar a diario unos veinte minutos con un bastón, dormir unas seis horas y tomar la medicación con algún olvido ocasional. La tensión registrada es 142/86. Marcha estable con apoyo puntual. Plan: revisar la medicación, mantener los paseos y citar en dos semanas para control.',
  'Ejemplo 2 (ficticio) — Informe de alta: paciente ficticio de 82 años ingresado por una prótesis de cadera. Evolución favorable, sin fiebre en las últimas 48 horas. Camina con andador por el pasillo con ayuda. Herida con buen aspecto. Al alta: analgesia pautada, ejercicios respiratorios, curas cada dos días y revisión en consulta en diez días. Se entrega hoja de ejercicios.',
  'Ejemplo 3 (ficticio) — Parte de enfermería a domicilio: visita de control. El paciente ficticio dice encontrarse bien, con apetito normal. Adherencia a la medicación en torno al 80 %. Se recuerda el pastillero semanal. Constantes estables. La vivienda está ordenada y hay un familiar que pasa cada tarde. Próxima visita en una semana.',
];

txt.value = EJEMPLOS[0];
nChars.textContent = String(txt.value.length);
document.querySelectorAll('[data-ej]').forEach((b) => {
  b.addEventListener('click', () => {
    txt.value = EJEMPLOS[+b.dataset.ej];
    nChars.textContent = String(txt.value.length);
  });
});
txt.addEventListener('input', () => { nChars.textContent = String(txt.value.length); });

// Aviso WebGPU
(async () => {
  const nota = $('gpu-nota');
  let ok = false;
  try {
    if (navigator.gpu && navigator.gpu.requestAdapter) ok = !!(await navigator.gpu.requestAdapter());
  } catch (e) { ok = false; }
  nota.innerHTML = ok
    ? 'WebGPU disponible en este equipo. Puedes cargar el modelo.'
    : '<strong>Sin WebGPU en este navegador o equipo.</strong> Prueba con Chrome o Edge en ordenador. Sin WebGPU el resumen será muy lento o fallará.';
})();

// Contador de red: se arma cuando el modelo está listo.
let netCount = 0;
const netList = [];
function paintNet() {
  netN.textContent = String(netCount);
  netUrls.textContent = netList.slice(-5).join('\n');
}
function contar(url) {
  if (!url || url.startsWith('data:') || url.startsWith('blob:')) return;
  netCount += 1;
  if (netList[netList.length - 1] !== url) netList.push(url);
  paintNet();
}
function armarContador() {
  netCount = 0;
  netList.length = 0;
  paintNet();
  const ofetch = window.fetch.bind(window);
  window.fetch = (...a) => {
    try {
      const u = a[0] && (typeof a[0] === 'string' ? a[0] : a[0].url);
      contar(String(u || ''));
    } catch (e) {}
    return ofetch(...a);
  };
  const oOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (m, u, ...r) {
    try { contar(String(u || '')); } catch (e) {}
    return oOpen.call(this, m, u, ...r);
  };
}
function pintaOffline() {
  offBadge.textContent = navigator.onLine ? '' : ' · Sin conexión: si el resumen funciona ahora, la prueba fuerte está superada.';
}
addEventListener('online', pintaOffline);
addEventListener('offline', pintaOffline);
pintaOffline();

let gen = null;
let cargando = false;

async function importaLib() {
  let ultimo = null;
  for (const u of LIBS) {
    try {
      return await import(u);
    } catch (e) { ultimo = e; }
  }
  throw ultimo || new Error('no-lib');
}

btnCargar.addEventListener('click', async () => {
  if (cargando || gen) return;
  cargando = true;
  btnCargar.disabled = true;
  prog.hidden = false;
  fill.style.width = '0%';
  ptxt.textContent = '0 %';
  estado.textContent = 'Descargando el modelo… (primera vez tarda varios minutos)';
  const pct = {};
  try {
    const { pipeline } = await importaLib();
    gen = await pipeline('text-generation', sel.value, {
      device: 'webgpu',
      dtype: 'q4',
      progress_callback: (e) => {
        if (e.status === 'progress' && e.file) {
          pct[e.file] = e.progress || 0;
          const v = Object.values(pct);
          const p = Math.round(v.reduce((a, b) => a + b, 0) / v.length);
          fill.style.width = p + '%';
          ptxt.textContent = p + ' %';
          estado.textContent = 'Descargando el modelo… ' + p + ' %';
        }
      },
    });
    cargando = false;
    prog.hidden = true;
    btnCargar.hidden = true;
    btnResumir.disabled = false;
    armarContador();
    estado.textContent = 'Listo. Contador de red a 0. Puedes desconectar el wifi y pulsar «Resumir»: sigue funcionando sin salir a internet (no recargues la página).';
    btnResumir.focus();
  } catch (err) {
    console.error(err);
    cargando = false;
    btnCargar.disabled = false;
    prog.hidden = true;
    estado.textContent = 'No se ha podido cargar el modelo. Prueba con Chrome o Edge en ordenador con WebGPU y buena conexión, y reinténtalo.';
  }
});

btnResumir.addEventListener('click', async () => {
  if (!gen) return;
  const texto = txt.value.trim();
  if (!texto) {
    salida.textContent = '';
    meta.textContent = 'Escribe o elige un texto de ejemplo primero.';
    return;
  }
  btnResumir.disabled = true;
  salida.textContent = '';
  meta.textContent = 'Resumiendo en tu dispositivo…';
  const t0 = performance.now();
  const sinRed = !navigator.onLine;
  try {
    const mensajes = [
      { role: 'system', content: 'Resume en español en 3 frases como máximo. Usa solo datos del texto, sin inventar nada.' },
      { role: 'user', content: 'Resume este texto:\n\n' + texto },
    ];
    const r = await gen(mensajes, { max_new_tokens: 160, do_sample: false });
    let t = '';
    const g = r && r[0] && r[0].generated_text;
    if (Array.isArray(g)) t = String((g[g.length - 1] && g[g.length - 1].content) || '');
    else if (typeof g === 'string') t = g;
    else t = String((r && r[0] && r[0].generated_text) || '');
    salida.textContent = t.trim() || 'El modelo no ha devuelto texto. Prueba con otro ejemplo.';
    const s = (performance.now() - t0) / 1000;
    const aprox = (salida.textContent.match(/\S+/g) || []).length;
    meta.textContent = sel.value + ' · ' + s.toFixed(1).replace('.', ',') + ' s · ~' + aprox + ' palabras'
      + (sinRed ? ' · generado SIN conexión: prueba fuerte superada.' : '');
  } catch (err) {
    console.error(err);
    meta.textContent = 'No se ha podido resumir. Reinténtalo.';
  } finally {
    btnResumir.disabled = false;
  }
});
