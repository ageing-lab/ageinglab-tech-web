// Simulador de arquitectura IoT. Reglas generales: no emula firmware ni calcula autonomía ni coste.
'use strict';

const PIEZAS = {
  esp32: { t: 'mcu', n: 'ESP32', int: ['wifi', 'ble'] },
  esp8266: { t: 'mcu', n: 'ESP8266', int: ['wifi'] },
  stm32: { t: 'mcu', n: 'STM32', int: [] },
  arduino: { t: 'mcu', n: 'Arduino', int: [] },
  imu: { t: 'sen', n: 'Movimiento' },
  th: { t: 'sen', n: 'Temperatura y humedad' },
  dist: { t: 'sen', n: 'Distancia' },
  peso: { t: 'sen', n: 'Peso' },
  wifi: { t: 'rad', n: 'Wi-Fi' },
  ble: { t: 'rad', n: 'Bluetooth LE' },
  lora: { t: 'rad', n: 'LoRa' },
  bat: { t: 'pow', n: 'Batería Li-ion' },
  red: { t: 'pow', n: 'Alimentación de red' },
  pas: { t: 'dst', n: 'Pasarela o móvil' },
  nube: { t: 'dst', n: 'Nube' },
};
const GRUPOS = [['mcu', 'Microcontrolador'], ['sen', 'Sensores'], ['rad', 'Comunicación'], ['pow', 'Energía'], ['dst', 'Destino de los datos']];

function evaluar(ids) {
  const p = ids.map((k) => ({ k, ...PIEZAS[k] }));
  const de = (t) => p.filter((x) => x.t === t);
  const mcu = de('mcu')[0], rad = de('rad'), has = (k) => ids.includes(k);
  const r = [], add = (nivel, texto) => r.push({ nivel, texto });
  if (!mcu) add('falta', 'Falta el microcontrolador, que es el cerebro del dispositivo.');
  if (!de('sen').length) add('falta', 'Falta al menos un sensor que mida algo.');
  if (!de('pow').length) add('falta', 'Falta la fuente de energía.');
  if (!rad.length) add('falta', 'Falta cómo enviará los datos: Wi-Fi, Bluetooth LE o LoRa.');
  if (!de('dst').length) add('falta', 'Falta el destino de los datos: una pasarela o la nube.');
  rad.forEach((x) => { if (mcu && !mcu.int.includes(x.k)) add('aviso', `${mcu.n} no lleva ${x.n} de serie: hace falta un módulo externo o una variante que lo incluya.`); });
  if (has('ble') && !has('pas')) add('aviso', 'Bluetooth LE no llega a internet por sí solo: necesita una pasarela o un móvil que reciba los datos.');
  if (has('lora') && !has('pas')) add('aviso', 'LoRa necesita una pasarela que reciba los datos por radio y los reenvíe.');
  if (has('wifi') && !has('nube') && !has('pas')) add('aviso', 'Con Wi-Fi los datos necesitan un destino: la nube o una pasarela.');
  if (has('pas') && !has('nube')) add('info', 'Si los datos deben llegar a internet o guardarse, falta la nube detrás de la pasarela.');
  if (has('bat') && has('wifi')) add('aviso', 'Wi-Fi con batería es la combinación que más consume. Suele compensar dormir el dispositivo entre envíos o elegir Bluetooth LE o LoRa.');
  if (has('bat')) add('info', 'La batería Li-ion necesita circuito de carga y protección.');
  if (rad.length) add('info', 'Al llevar radio, el producto debe cumplir la normativa de equipos radioeléctricos (en la UE, la Directiva RED).');
  if (!r.some((x) => x.nivel === 'falta' || x.nivel === 'aviso')) r.unshift({ nivel: 'ok', texto: 'Sobre el papel, las piezas encajan. Falta validarlo con un prototipo real.' });
  add('info', 'Esta simulación no calcula autonomía ni coste: dependen del uso real y se miden sobre el prototipo.');
  return r;
}

if (typeof module !== 'undefined') module.exports = { evaluar, PIEZAS };

if (typeof document !== 'undefined') {
  const $ = (id) => document.getElementById(id);
  const mesa = $('io-mesa'), svg = $('io-lin');
  const W = 700, H = 340, PW = 130, PH = 44, SVGNS = 'http://www.w3.org/2000/svg';
  const ROT = { falta: 'Falta', aviso: 'Ojo', info: 'Nota', ok: 'Bien' };
  let piezas = [], arrastrado = false;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  $('io-paleta').append(...GRUPOS.map(([t, nombre]) => {
    const g = document.createElement('div'), h = document.createElement('p');
    h.textContent = nombre; g.append(h);
    Object.entries(PIEZAS).filter(([, v]) => v.t === t).forEach(([k, v]) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'io-b io-' + t; b.dataset.k = k; b.textContent = v.n; g.append(b);
    });
    return g;
  }));

  function lineas() {
    svg.textContent = '';
    const c = (k) => { const q = piezas.find((z) => z.k === k); return q && [q.x + PW / 2, q.y + PH / 2]; };
    const un = (a, b) => {
      if (!a || !b) return;
      const l = document.createElementNS(SVGNS, 'line');
      l.setAttribute('x1', a[0]); l.setAttribute('y1', a[1]); l.setAttribute('x2', b[0]); l.setAttribute('y2', b[1]);
      l.setAttribute('stroke', 'currentColor'); l.setAttribute('stroke-opacity', '.5'); l.setAttribute('stroke-width', '2');
      svg.append(l);
    };
    const mcu = piezas.find((q) => PIEZAS[q.k].t === 'mcu');
    const m = mcu && c(mcu.k);
    piezas.forEach((q) => { if (['sen', 'pow', 'rad'].includes(PIEZAS[q.k].t)) un(m, c(q.k)); });
    piezas.filter((q) => PIEZAS[q.k].t === 'rad').forEach((q) => {
      if (q.k === 'wifi') un(c(q.k), c('nube') || c('pas')); else un(c(q.k), c('pas'));
    });
    un(c('pas'), c('nube'));
  }

  function resultado() {
    const ul = $('io-res'); ul.textContent = '';
    evaluar(piezas.map((q) => q.k)).forEach(({ nivel, texto }) => {
      const li = document.createElement('li'), b = document.createElement('strong');
      li.className = 'io-' + nivel; b.textContent = ROT[nivel] + ': '; li.append(b, texto); ul.append(li);
    });
  }

  function pinta() {
    mesa.querySelectorAll('.io-p,.io-vacio').forEach((e) => e.remove());
    if (!piezas.length) { const v = document.createElement('p'); v.className = 'io-vacio'; v.textContent = 'Arrastra piezas hasta aquí o pulsa sobre ellas para añadirlas.'; mesa.append(v); }
    piezas.forEach((q) => {
      const d = document.createElement('div'), x = document.createElement('button');
      d.className = 'io-p io-' + PIEZAS[q.k].t; d.dataset.k = q.k; d.style.left = q.x + 'px'; d.style.top = q.y + 'px';
      d.append(PIEZAS[q.k].n);
      x.type = 'button'; x.className = 'io-x'; x.textContent = '×'; x.setAttribute('aria-label', 'Quitar ' + PIEZAS[q.k].n);
      x.addEventListener('click', () => { piezas = piezas.filter((z) => z !== q); pinta(); });
      d.append(x); mesa.append(d);
    });
    lineas(); resultado();
  }

  function anade(k, x, y) {
    const t = PIEZAS[k].t;
    if (t === 'mcu' || t === 'pow') piezas = piezas.filter((q) => PIEZAS[q.k].t !== t);
    else if (piezas.some((q) => q.k === k)) return;
    if (x === undefined) {
      const n = piezas.filter((q) => PIEZAS[q.k].t === t).length;
      x = { sen: 16, mcu: 200, pow: 200, rad: 384, dst: 548 }[t];
      y = t === 'pow' ? 250 : t === 'mcu' ? 110 : 16 + n * 62;
    }
    piezas.push({ k, x: clamp(x, 0, W - PW), y: clamp(y, 0, H - PH) });
    pinta();
  }

  $('io-paleta').querySelectorAll('.io-b').forEach((b) => {
    b.addEventListener('click', () => { if (!arrastrado) anade(b.dataset.k); });
    b.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch') return;
      const x0 = e.clientX, y0 = e.clientY; let g = null;
      const mv = (ev) => {
        if (!g && Math.hypot(ev.clientX - x0, ev.clientY - y0) > 6) { g = b.cloneNode(true); g.classList.add('io-g'); document.body.append(g); }
        if (g) { g.style.left = ev.clientX + 8 + 'px'; g.style.top = ev.clientY + 8 + 'px'; }
      };
      const up = (ev) => {
        document.removeEventListener('pointermove', mv); document.removeEventListener('pointerup', up);
        if (!g) return;
        g.remove(); arrastrado = true; setTimeout(() => { arrastrado = false; }, 0);
        const r = mesa.getBoundingClientRect();
        if (ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom) anade(b.dataset.k, ev.clientX - r.left - PW / 2, ev.clientY - r.top - PH / 2);
      };
      document.addEventListener('pointermove', mv); document.addEventListener('pointerup', up);
    });
  });

  mesa.addEventListener('pointerdown', (e) => {
    const el = e.target.closest('.io-p');
    if (!el || e.target.closest('.io-x')) return;
    const q = piezas.find((z) => z.k === el.dataset.k), r = mesa.getBoundingClientRect();
    const dx = e.clientX - r.left - q.x, dy = e.clientY - r.top - q.y;
    el.setPointerCapture(e.pointerId);
    const mv = (ev) => {
      q.x = clamp(ev.clientX - r.left - dx, 0, W - PW); q.y = clamp(ev.clientY - r.top - dy, 0, H - PH);
      el.style.left = q.x + 'px'; el.style.top = q.y + 'px'; lineas();
    };
    const up = () => { el.removeEventListener('pointermove', mv); el.removeEventListener('pointerup', up); };
    el.addEventListener('pointermove', mv); el.addEventListener('pointerup', up);
  });

  $('io-vaciar').addEventListener('click', () => { piezas = []; pinta(); });
  $('io-ejemplo').addEventListener('click', () => { piezas = []; ['esp32', 'imu', 'ble', 'bat', 'pas', 'nube'].forEach((k) => anade(k)); });
  pinta();
}
