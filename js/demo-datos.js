// Simulador de revisión de calidad de datos. Reglas fijas, sin IA. Todo se procesa en el navegador.
'use strict';

const MUESTRA = [
  'id,edad,fecha_visita,ciudad,peso_kg,tension_sistolica',
  '101,78,2026-03-02,Madrid,71.5,132',
  '102,82,02/03/2026,madrid ,68,141',
  '103,,2026-03-04,Getafe,74,128',
  '104,75,2026-03-05,Getafe,69,NA',
  '105,80,2026-03-05,MADRID,72,135',
  '105,80,2026-03-05,MADRID,72,135',
  '106,79,2026-03-06,Getafe,70,138',
  '107,810,2026-03-07,Madrid,73,130',
  '108,77,2026-03-08,Alcorcón,"71,2",127',
  '109,84,2026-03-09,Getafe,66,133',
  '110,76,2026-03-10,Madrid,70,129',
  '111,81,2026-03-11,Getafe,300,136',
].join('\n');

const NULOS = new Set(['', 'na', 'n/a', 'null', 'nan', '-', '?', 'sin dato']);
const colapsa = (s) => s.trim().replace(/\s+/g, ' ');
const norm = (s) => colapsa(s).toLowerCase();
const esNulo = (s) => NULOS.has(norm(s));
const num = (s) => { const t = s.trim().replace(/\s/g, ''); return /^-?\d+([.,]\d+)?$/.test(t) ? Number(t.replace(',', '.')) : NaN; };
const ISO = /^(\d{4})-(\d{2})-(\d{2})$/, DMY = /^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/;
const fecha = (s) => {
  s = s.trim();
  if (ISO.test(s)) return { f: 'ISO', iso: s };
  const m = s.match(DMY);
  if (m && +m[2] >= 1 && +m[2] <= 12 && +m[1] >= 1 && +m[1] <= 31) return { f: 'DMY', iso: `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` };
  return null;
};

function parseCSV(texto) {
  const l1 = texto.split(/\r?\n/, 1)[0];
  const sep = (l1.match(/;/g) || []).length > (l1.match(/,/g) || []).length ? ';' : ',';
  const filas = []; let fila = [], celda = '', q = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (q) { if (c === '"') { if (texto[i + 1] === '"') { celda += '"'; i++; } else q = false; } else celda += c; }
    else if (c === '"') q = true;
    else if (c === sep) { fila.push(celda); celda = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && texto[i + 1] === '\n') i++; fila.push(celda); filas.push(fila); fila = []; celda = ''; }
    else celda += c;
  }
  if (celda || fila.length) { fila.push(celda); filas.push(fila); }
  return filas.filter((f) => f.some((x) => x.trim() !== ''));
}

function analizar(tabla) {
  const cab = tabla[0].map((s) => s.trim());
  const datos = tabla.slice(1).map((f) => cab.map((_, i) => f[i] ?? ''));
  const flags = datos.map(() => cab.map(() => null));
  const meta = cab.map(() => ({ tipo: 'txt', canon: new Map() }));
  const incid = [];
  const vistos = new Set(), dup = new Set();
  datos.forEach((f, i) => { const k = f.map(norm).join('\u0001'); vistos.has(k) ? dup.add(i) : vistos.add(k); });
  if (dup.size) incid.push({ col: 'Filas', t: `${dup.size} fila(s) duplicada(s), ignorando mayúsculas y espacios.` });
  const act = datos.map((_, i) => i).filter((i) => !dup.has(i));

  cab.forEach((nombre, c) => {
    const marca = (idx, tipo) => idx.forEach((i) => { flags[i][c] = tipo; });
    const con = act.filter((i) => !esNulo(datos[i][c]));
    const vacios = act.filter((i) => esNulo(datos[i][c]));
    marca(vacios, 'miss');
    if (vacios.length) incid.push({ col: nombre, t: `${vacios.length} valor(es) vacío(s) o sin dato.` });
    if (!con.length) return;
    const val = (i) => datos[i][c];
    const pNum = con.filter((i) => !isNaN(num(val(i)))).length / con.length;
    const pFec = con.filter((i) => fecha(val(i))).length / con.length;

    if (pNum >= 0.8) {
      meta[c].tipo = 'num';
      const malos = con.filter((i) => isNaN(num(val(i))));
      marca(malos, 'fmt');
      if (malos.length) incid.push({ col: nombre, t: `${malos.length} valor(es) no numérico(s) en una columna numérica.` });
      const ok = con.filter((i) => !isNaN(num(val(i))));
      const dec = ok.filter((i) => /[.,]\d/.test(val(i)));
      const estilo = (i) => (val(i).includes(',') ? ',' : '.');
      if (new Set(dec.map(estilo)).size > 1) {
        const nComa = dec.filter((i) => estilo(i) === ',').length, nPunto = dec.length - nComa;
        const may = nComa === nPunto ? estilo(dec[0]) : nComa > nPunto ? ',' : '.';
        const min = dec.filter((i) => estilo(i) !== may);
        marca(min, 'fmt');
        incid.push({ col: nombre, t: `${min.length} valor(es) con separador decimal distinto (coma y punto mezclados).` });
      }
      const nums = ok.map((i) => num(val(i))).sort((a, b) => a - b);
      const consecutivo = new Set(nums).size === nums.length && nums.every(Number.isInteger) && nums[nums.length - 1] - nums[0] === nums.length - 1;
      const esId = /(^|[_\s])(id|cod|codigo|código)([_\s]|$)/i.test(nombre) || consecutivo;
      if (nums.length >= 8 && !esId) {
        const q = (p) => { const x = (nums.length - 1) * p, lo = Math.floor(x); return nums[lo] + (nums[Math.min(lo + 1, nums.length - 1)] - nums[lo]) * (x - lo); };
        const q1 = q(0.25), q3 = q(0.75), r = q3 - q1;
        if (r > 0) {
          const fuera = ok.filter((i) => { const v = num(val(i)); return v < q1 - 1.5 * r || v > q3 + 1.5 * r; });
          marca(fuera, 'out');
          if (fuera.length) incid.push({ col: nombre, t: `${fuera.length} valor(es) atípico(s), fuera de 1,5 veces el rango intercuartílico. Se marcan, no se modifican.` });
        }
      }
    } else if (pFec >= 0.8) {
      meta[c].tipo = 'fec';
      const malos = con.filter((i) => !fecha(val(i)));
      marca(malos, 'fmt');
      if (malos.length) incid.push({ col: nombre, t: `${malos.length} valor(es) que no parecen una fecha.` });
      const ok = con.filter((i) => fecha(val(i)));
      const nIso = ok.filter((i) => fecha(val(i)).f === 'ISO').length;
      if (nIso && nIso < ok.length) {
        const minF = nIso >= ok.length - nIso ? 'DMY' : 'ISO';
        const min = ok.filter((i) => fecha(val(i)).f === minF);
        marca(min, 'fmt');
        incid.push({ col: nombre, t: `${min.length} fecha(s) con formato distinto (mezcla de AAAA-MM-DD y DD/MM/AAAA).` });
      }
    } else {
      const grupos = new Map();
      con.forEach((i) => {
        const v = colapsa(val(i)), k = v.toLowerCase();
        if (!grupos.has(k)) grupos.set(k, new Map());
        grupos.get(k).set(v, (grupos.get(k).get(v) || 0) + 1);
      });
      grupos.forEach((m, k) => meta[c].canon.set(k, [...m.entries()].sort((a, b) => b[1] - a[1])[0][0]));
      const canon = (i) => meta[c].canon.get(norm(val(i)));
      const dif = con.filter((i) => val(i) !== canon(i));
      marca(dif, 'var');
      if (dif.length) incid.push({ col: nombre, t: `${dif.length} valor(es) con mayúsculas o espacios distintos al resto (por ejemplo «${val(dif[0]).trim()}» frente a «${canon(dif[0])}»).` });
    }
  });
  return { cab, datos, flags, meta, incid, dup };
}

function limpiar(a) {
  const filas = [];
  a.datos.forEach((f, i) => {
    if (a.dup.has(i)) return;
    filas.push({ i, v: f.map((v, c) => {
      if (esNulo(v)) return '';
      const m = a.meta[c];
      if (m.tipo === 'num') return isNaN(num(v)) ? v.trim() : v.trim().replace(',', '.');
      if (m.tipo === 'fec') { const d = fecha(v); return d ? d.iso : v.trim(); }
      return m.canon.get(norm(v)) ?? colapsa(v);
    }) });
  });
  return filas;
}

if (typeof module !== 'undefined') module.exports = { parseCSV, analizar, limpiar, MUESTRA };

if (typeof document !== 'undefined') {
  const $ = (id) => document.getElementById(id);
  const ETQ = { miss: 'vacío', fmt: 'formato distinto', var: 'escritura distinta', out: 'valor atípico' };
  const MAX = 40;
  let actual = null, limpio = false;
  const msg = (t) => { $('dd-msg').textContent = t; };

  function dibuja() {
    const a = actual, t = $('dd-t');
    t.textContent = '';
    const hr = t.createTHead().insertRow();
    a.cab.forEach((h) => { const th = document.createElement('th'); th.scope = 'col'; th.textContent = h; hr.appendChild(th); });
    const tb = t.createTBody();
    const filas = limpio ? limpiar(a) : a.datos.map((v, i) => ({ i, v }));
    filas.slice(0, MAX).forEach(({ i, v }) => {
      const tr = tb.insertRow();
      if (!limpio && a.dup.has(i)) { tr.className = 'dd-dup'; tr.title = 'fila duplicada'; }
      v.forEach((x, c) => {
        const td = tr.insertCell();
        let f = a.flags[i][c];
        if (limpio && f !== 'out' && f !== 'miss') f = null;
        td.textContent = x.trim() === '' ? '(vacío)' : x;
        if (f) { td.className = 'dd-' + f; td.title = ETQ[f]; }
      });
    });
    $('dd-mas').textContent = filas.length > MAX ? `Se muestran las primeras ${MAX} de ${filas.length} filas.` : '';
    $('dd-alt').textContent = limpio ? 'Ver datos originales' : 'Ver datos limpios';
    $('dd-tabla-t').textContent = limpio ? 'Datos tras la limpieza automática' : 'Datos originales con las incidencias marcadas';
  }

  function ejecutar(texto) {
    const tabla = parseCSV(texto.replace(/^\uFEFF/, ''));
    if (tabla.length < 2) return msg('El archivo necesita una fila de cabecera y al menos una fila de datos.');
    if (tabla.length > 5001) return msg('El archivo tiene más de 5.000 filas. Esta demo trabaja con archivos pequeños.');
    msg('');
    actual = analizar(tabla); limpio = false;
    const total = actual.dup.size + actual.flags.flat().filter(Boolean).length;
    $('dd-resumen').textContent = total
      ? `${actual.datos.length} filas y ${actual.cab.length} columnas revisadas. Incidencias detectadas: ${total}.`
      : 'No se han detectado incidencias con estas reglas. Eso no garantiza que los datos sean correctos.';
    const ul = $('dd-incid'); ul.textContent = '';
    actual.incid.forEach(({ col, t }) => {
      const li = document.createElement('li'), b = document.createElement('strong');
      b.textContent = col; li.append(b, ': ' + t); ul.appendChild(li);
    });
    $('dd-res').hidden = false;
    dibuja();
  }

  $('dd-revisar').addEventListener('click', () => ejecutar(MUESTRA));
  $('dd-alt').addEventListener('click', () => { limpio = !limpio; dibuja(); });
  $('dd-archivo').addEventListener('change', async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 1e6) return msg('El archivo pesa más de 1 MB. Prueba con uno más pequeño.');
    const buf = await f.arrayBuffer();
    let txt;
    try { txt = new TextDecoder('utf-8', { fatal: true }).decode(buf); } catch { txt = new TextDecoder('windows-1252').decode(buf); }
    ejecutar(txt);
  });
}
