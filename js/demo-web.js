// Constructor de webs de ejemplo: maqueta con contenido de relleno. No genera código ni guarda nada.
'use strict';

const SECCIONES = { cab: 'Cabecera y menú', por: 'Portada', ser: 'Servicios', nos: 'Sobre nosotros', faq: 'Preguntas frecuentes', con: 'Contacto', pie: 'Pie de página' };
const CORTO = { por: 'Inicio', ser: 'Servicios', nos: 'Nosotros', faq: 'Preguntas', con: 'Contacto' };
const ESTILOS = { sobrio: 'Sobrio', moderno: 'Moderno', calido: 'Cálido' };

if (typeof document !== 'undefined') {
  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt !== undefined) e.textContent = txt; return e; };
  const on = { cab: true, por: true, ser: false, nos: false, faq: false, con: false, pie: false };
  let orden = ['por', 'ser', 'nos', 'faq', 'con'], estilo = 'sobrio', movil = false;
  const nombre = () => $('wb-nombre').value.trim() || 'Tu negocio';
  const lema = () => $('wb-lema').value.trim() || 'Una frase que explique lo que haces';
  const bloque = (titulo) => { const s = el('div', 'wb-s'); if (titulo) s.append(el('div', 'wb-h', titulo)); return s; };

  const CONSTR = {
    cab: () => { const h = el('div', 'wb-cab'), nav = el('div', 'wb-nav'); h.append(el('strong', '', nombre())); orden.filter((k) => on[k]).forEach((k) => nav.append(el('span', '', CORTO[k]))); h.append(nav); return h; },
    por: () => { const s = el('div', 'wb-s wb-por'); s.append(el('div', 'wb-t', lema()), el('p', '', 'Aquí iría una descripción breve de lo que ofreces y a quién se lo ofreces.'), el('span', 'wb-bt', 'Contáctanos')); return s; },
    ser: () => { const s = bloque('Servicios'), g = el('div', 'wb-g'); ['Servicio uno', 'Servicio dos', 'Servicio tres'].forEach((t) => { const c = el('div', 'wb-c'); c.append(el('strong', '', t), el('p', '', 'Texto de ejemplo para explicar este servicio.')); g.append(c); }); s.append(g); return s; },
    nos: () => { const s = bloque('Sobre nosotros'); s.append(el('p', '', `Aquí contarías la historia de ${nombre()}, quién está detrás y por qué hacéis lo que hacéis.`)); return s; },
    faq: () => { const s = bloque('Preguntas frecuentes'); ['Primera pregunta de ejemplo', 'Segunda pregunta de ejemplo', 'Tercera pregunta de ejemplo'].forEach((q) => { const d = el('details'); d.append(el('summary', '', q), el('p', '', 'Respuesta de ejemplo.')); s.append(d); }); return s; },
    con: () => { const s = bloque('Contacto'), f = el('div', 'wb-f'); ['Nombre', 'Correo'].forEach((p) => { const i = el('input'); i.placeholder = p; i.disabled = true; i.setAttribute('aria-label', p); f.append(i); }); f.append(el('span', 'wb-bt', 'Enviar')); s.append(f); return s; },
    pie: () => { const f = el('div', 'wb-pie'); f.append(el('span', '', `© ${new Date().getFullYear()} ${nombre()}`), el('span', '', 'Privacidad · Aviso legal · Cookies')); return f; },
  };

  function pinta() {
    const p = $('wb-prev'); p.textContent = ''; p.className = 'wb-prev wb-' + estilo;
    $('wb-marco').classList.toggle('wb-m', movil);
    const claves = [on.cab && 'cab', ...orden.filter((k) => on[k]), on.pie && 'pie'].filter(Boolean);
    claves.forEach((k) => p.append(CONSTR[k]()));
    if (!claves.length) p.append(el('p', 'wb-vacio', 'Tu web está vacía. Marca secciones en el panel.'));
    $('wb-n').textContent = claves.length === 1 ? 'Tu web tiene 1 sección.' : `Tu web tiene ${claves.length} secciones.`;
  }

  function lista() {
    const ul = $('wb-lista'); ul.textContent = '';
    ['cab', ...orden, 'pie'].forEach((k) => {
      const li = el('li'), l = el('label'), c = el('input');
      c.type = 'checkbox'; c.checked = on[k]; c.addEventListener('change', () => { on[k] = c.checked; pinta(); });
      l.append(c, ' ' + SECCIONES[k]); li.append(l);
      if (orden.includes(k)) {
        [['↑', -1, 'Subir'], ['↓', 1, 'Bajar']].forEach(([t, d, a]) => {
          const b = el('button', 'wb-mv', t), i = orden.indexOf(k), et = `${a} ${SECCIONES[k]}`;
          b.type = 'button'; b.setAttribute('aria-label', et); b.disabled = i + d < 0 || i + d >= orden.length;
          b.addEventListener('click', () => { [orden[i], orden[i + d]] = [orden[i + d], orden[i]]; lista(); pinta(); const n = $('wb-lista').querySelector(`[aria-label="${et}"]`); if (n && !n.disabled) n.focus(); });
          li.append(b);
        });
      }
      ul.append(li);
    });
  }

  function grupo(id, ops, ini, cb) {
    const g = $(id);
    Object.entries(ops).forEach(([k, n]) => {
      const b = el('button', 'wb-op', n); b.type = 'button'; b.dataset.k = k; b.setAttribute('aria-pressed', String(k === ini));
      b.addEventListener('click', () => { g.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); cb(k); });
      g.append(b);
    });
  }

  grupo('wb-estilos', ESTILOS, estilo, (k) => { estilo = k; pinta(); });
  grupo('wb-disp', { esc: 'Escritorio', mov: 'Móvil' }, 'esc', (k) => { movil = k === 'mov'; pinta(); });
  $('wb-nombre').addEventListener('input', pinta);
  $('wb-lema').addEventListener('input', pinta);
  lista(); pinta();
}
