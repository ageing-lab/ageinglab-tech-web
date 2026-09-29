// Prototipo vivo: mini aplicación de ejemplo. Datos inventados y solo en memoria (se pierden al recargar).
'use strict';

const PLANTILLAS = {
  casos: {
    nombre: 'Seguimiento de casos', titulo: 'Seguimiento de casos',
    campos: [['Título', 'texto'], ['Responsable', 'texto'], ['Estado', 'lista', ['Nuevo', 'En curso', 'Cerrado']], ['Prioridad', 'lista', ['Alta', 'Media', 'Baja']], ['Fecha límite', 'fecha']],
    filas: [['Revisar informe trimestral', 'Laura', 'En curso', 'Alta', '2026-10-15'], ['Actualizar documentación', 'Diego', 'Nuevo', 'Media', '2026-11-02'], ['Cerrar incidencia de acceso', 'Sofía', 'Cerrado', 'Baja', '2026-09-20']],
  },
  inventario: {
    nombre: 'Inventario', titulo: 'Inventario',
    campos: [['Artículo', 'texto'], ['Ubicación', 'texto'], ['Cantidad', 'numero'], ['Estado', 'lista', ['En stock', 'Bajo mínimos', 'Agotado']]],
    filas: [['Guantes de nitrilo (caja)', 'Almacén A', 120, 'En stock'], ['Sensores de temperatura', 'Estantería 3', 8, 'Bajo mínimos'], ['Baterías de repuesto', 'Almacén B', 0, 'Agotado']],
  },
  citas: {
    nombre: 'Citas', titulo: 'Agenda de citas',
    campos: [['Persona', 'texto'], ['Motivo', 'texto'], ['Fecha', 'fecha'], ['Estado', 'lista', ['Pendiente', 'Confirmada', 'Cancelada']]],
    filas: [['Ana Pérez', 'Revisión', '2026-10-05', 'Confirmada'], ['Luis Gómez', 'Primera visita', '2026-10-07', 'Pendiente'], ['Carmen Ruiz', 'Cambio de fecha', '2026-10-12', 'Cancelada']],
  },
};
const TIPOS = { texto: 'Texto', numero: 'Número', fecha: 'Fecha', si: 'Sí / No', lista: 'Lista' };
const MAX_CAMPOS = 8;

if (typeof document !== 'undefined') {
  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt !== undefined) e.textContent = txt; return e; };
  const msg = (t) => { $('pv-msg').textContent = t; };
  let campos = [], filas = [], n = 0;
  const nid = () => 'c' + (++n);
  const fmt = (c, v) => {
    if (c.tipo === 'si') return v === true ? 'Sí' : v === false ? 'No' : '';
    if (c.tipo === 'fecha' && /^\d{4}-\d{2}-\d{2}$/.test(v || '')) return v.split('-').reverse().join('/');
    return v ?? '';
  };

  function pintaFiltro() {
    const cl = campos.find((c) => c.tipo === 'lista'), s = $('pv-filtro'), prev = s.value;
    s.textContent = ''; s.hidden = !cl;
    if (!cl) return;
    s.append(new Option('Todos: ' + cl.nombre, ''));
    cl.opciones.forEach((o) => s.append(new Option(o, o)));
    if (cl.opciones.includes(prev)) s.value = prev;
  }

  function pintaForm() {
    const f = $('pv-form'); f.textContent = '';
    campos.forEach((c) => {
      const l = el('label', '', c.nombre); let i;
      if (c.tipo === 'lista') { i = el('select'); c.opciones.forEach((o) => i.append(new Option(o, o))); }
      else { i = el('input'); i.type = { texto: 'text', numero: 'number', fecha: 'date', si: 'checkbox' }[c.tipo]; }
      i.dataset.c = c.id; l.append(i); f.append(l);
    });
    const b = el('button', 'btn', 'Añadir registro'); b.type = 'submit'; f.append(b);
  }

  function pintaTabla() {
    const q = $('pv-buscar').value.trim().toLowerCase(), cl = campos.find((c) => c.tipo === 'lista'), fv = $('pv-filtro').value;
    const vis = filas.filter((f) => (!cl || !fv || f[cl.id] === fv) && (!q || campos.some((c) => String(fmt(c, f[c.id])).toLowerCase().includes(q))));
    const t = $('pv-t'); t.textContent = '';
    const hr = t.createTHead().insertRow();
    campos.forEach((c) => { const th = el('th', '', c.nombre); th.scope = 'col'; hr.append(th); });
    hr.append(el('th', '', 'Acciones'));
    const tb = t.createTBody();
    vis.forEach((f) => {
      const tr = tb.insertRow();
      campos.forEach((c) => { tr.insertCell().textContent = fmt(c, f[c.id]); });
      const b = el('button', 'pv-q', 'Quitar'); b.type = 'button'; b.setAttribute('aria-label', 'Quitar este registro');
      b.addEventListener('click', () => { filas.splice(filas.indexOf(f), 1); pintaTabla(); });
      tr.insertCell().append(b);
    });
    $('pv-n').textContent = vis.length === filas.length ? `${filas.length} registros` : `${vis.length} de ${filas.length} registros`;
    $('pv-vacio').hidden = vis.length > 0;
  }

  function pintaCampos() {
    const ul = $('pv-campos'); ul.textContent = '';
    campos.forEach((c) => {
      const li = el('li'), i = el('input'), b = el('button', 'pv-q', 'Quitar campo');
      i.type = 'text'; i.value = c.nombre; i.maxLength = 30; i.setAttribute('aria-label', 'Nombre del campo');
      i.addEventListener('input', () => { c.nombre = i.value.trim() || 'Sin nombre'; pintaFiltro(); pintaForm(); pintaTabla(); });
      b.type = 'button'; b.disabled = campos.length < 2;
      b.addEventListener('click', () => { campos = campos.filter((x) => x !== c); todo(); });
      li.append(i, el('span', 'pv-tipo', TIPOS[c.tipo]), b); ul.append(li);
    });
  }

  function todo() { pintaFiltro(); pintaForm(); pintaTabla(); pintaCampos(); }

  function carga(clave) {
    const p = PLANTILLAS[clave];
    campos = p.campos.map(([nombre, tipo, opciones]) => ({ id: nid(), nombre, tipo, opciones }));
    filas = p.filas.map((f) => Object.fromEntries(campos.map((c, i) => [c.id, f[i]])));
    $('pv-titulo').textContent = p.titulo; $('pv-buscar').value = ''; $('pv-filtro').value = ''; msg('');
    $('pv-plantillas').querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.p === clave)));
    todo();
  }

  Object.entries(PLANTILLAS).forEach(([k, p]) => {
    const b = el('button', 'btn', p.nombre); b.type = 'button'; b.dataset.p = k;
    b.addEventListener('click', () => carga(k)); $('pv-plantillas').append(b);
  });

  $('pv-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const fila = {};
    campos.forEach((c) => { const i = $('pv-form').querySelector(`[data-c="${c.id}"]`); fila[c.id] = c.tipo === 'si' ? i.checked : i.value.trim(); });
    const pri = campos.find((c) => c.tipo !== 'lista');
    if (pri && !fila[pri.id]) return msg(`Rellena el campo «${pri.nombre}» para añadir el registro.`);
    filas.unshift(fila); msg('Registro añadido.'); pintaForm(); pintaTabla();
  });

  $('pv-buscar').addEventListener('input', pintaTabla);
  $('pv-filtro').addEventListener('change', pintaTabla);
  $('pv-nuevo').addEventListener('click', () => {
    const nombre = $('pv-nn').value.trim();
    if (!nombre) return msg('Escribe el nombre del nuevo campo.');
    if (campos.length >= MAX_CAMPOS) return msg(`Esta demo admite hasta ${MAX_CAMPOS} campos.`);
    campos.push({ id: nid(), nombre: nombre.slice(0, 30), tipo: $('pv-nt').value });
    $('pv-nn').value = ''; msg(''); todo();
  });

  carga('casos');
}
