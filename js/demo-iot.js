// Simulador de arquitectura IoT. Reglas generales: no emula firmware ni calcula autonomía ni coste.
'use strict';

const PIEZAS = {
  esp32: { t: 'mcu', n: 'ESP32', int: ['wifi', 'ble'], d: 'Wi-Fi y Bluetooth LE integrados.' },
  esp8266: { t: 'mcu', n: 'ESP8266', int: ['wifi'], d: 'Wi-Fi integrado, sin Bluetooth.' },
  stm32: { t: 'mcu', n: 'STM32', int: [], d: 'ARM de bajo consumo; la radio va aparte.' },
  arduino: { t: 'mcu', n: 'Arduino', int: [], d: 'Prototipado rápido; la radio va aparte.' },
  imu: { t: 'sen', n: 'Movimiento', d: 'Acelerómetro: caídas, giros y actividad.' },
  th: { t: 'sen', n: 'Temperatura y humedad', s: 'Temp. y humedad', d: 'Clima del interior o del entorno.' },
  dist: { t: 'sen', n: 'Distancia', d: 'Presencia de personas u objetos cercanos.' },
  peso: { t: 'sen', n: 'Peso', d: 'Balanzas y control de cargas.' },
  wifi: { t: 'rad', n: 'Wi-Fi', d: 'Muchos datos y corta distancia, a cambio de más consumo.' },
  ble: { t: 'rad', n: 'Bluetooth LE', d: 'Muy poco consumo; llega a un móvil o a una pasarela.' },
  lora: { t: 'rad', n: 'LoRa', d: 'Larga distancia y bajo consumo, con pocos datos.' },
  bat: { t: 'pow', n: 'Batería Li-ion', d: 'Autonomía limitada: hay que gestionarla.' },
  red: { t: 'pow', n: 'Alimentación de red', s: 'Red eléctrica', d: 'Energía disponible sin límites.' },
  pas: { t: 'dst', n: 'Pasarela o móvil', d: 'Puente hacia internet: pasarela o teléfono.' },
  nube: { t: 'dst', n: 'Nube', d: 'Almacenamiento, APIs y paneles en internet.' },
};
const GRUPOS = [['mcu', 'Microcontrolador'], ['sen', 'Sensores'], ['rad', 'Comunicación'], ['pow', 'Energía'], ['dst', 'Destino de los datos']];
const ESENCIALES = ['mcu', 'sen', 'pow', 'rad', 'dst'];

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
  const mesa = $('io-mesa');
  if (mesa) {
    const svg = $('io-lin'), paleta = $('io-paleta'), res = $('io-res');
    const meter = $('io-meter'), cuenta = $('io-cuenta'), cnt = $('io-cnt'), pill = $('io-pill');
    const sel = $('io-ejemplo-sel'), hint = $('io-hint'), deshacerBtn = $('io-deshacer');
    const W = 700, H = 340, PW = 140, PH = 46, PASO = 10, SVGNS = 'http://www.w3.org/2000/svg';
    const ROT = { falta: 'Falta', aviso: 'Ojo', info: 'Nota', ok: 'Bien' };
    const TITULO = Object.fromEntries(GRUPOS);
    const COL = { sen: 16, mcu: 200, pow: 200, rad: 384, dst: 548 };
    const ICONO = {
      mcu: '<rect x="6.5" y="6.5" width="11" height="11" rx="2"/><path d="M9.5 3.5v3M14.5 3.5v3M9.5 17.5v3M14.5 17.5v3M3.5 9.5h3M3.5 14.5h3M17.5 9.5h3M17.5 14.5h3"/>',
      sen: '<path d="M3 12.5h3.6L9.2 6.2l3.7 11.6 2.4-5.3H21"/>',
      rad: '<path d="M4.6 9.7a10.4 10.4 0 0 1 14.8 0"/><path d="M7.7 13a6.1 6.1 0 0 1 8.6 0"/><path d="M10.5 16.3a2.2 2.2 0 0 1 3 0"/><circle cx="12" cy="19.6" r="1" fill="currentColor" stroke="none"/>',
      pow: '<rect x="2.5" y="8" width="15.5" height="9" rx="2.5"/><path d="M20.5 10.8v3"/><path d="m10 10.2-2.2 3h3.4L9 16.2"/>',
      dst: '<circle cx="12" cy="12" r="8.6"/><path d="M3.4 12h17.2"/><path d="M12 3.4c2.4 2.4 3.6 5.3 3.6 8.6S14.4 18.2 12 20.6C9.6 18.2 8.4 15.3 8.4 12S9.6 5.8 12 3.4z"/>',
    };
    const EJEMPLOS = [
      { n: 'Seguimiento en el domicilio', p: ['esp32', 'imu', 'ble', 'bat', 'pas', 'nube'] },
      { n: 'Balanza conectada a la nube', p: ['esp8266', 'peso', 'wifi', 'red', 'nube'] },
      { n: 'Sensor de campo con LoRa', p: ['stm32', 'th', 'lora', 'bat', 'pas', 'nube'] },
      { n: 'Bluetooth sin destino (incompleto)', p: ['esp32', 'imu', 'ble', 'bat'] },
    ];
    const icono = (t) => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONO[t]}</svg>`;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const snap = (v) => Math.round(v / PASO) * PASO;
    const tiene = (k) => piezas.some((q) => q.k === k);

    let piezas = [], historial = [], arrastrado = false, efecto = null, pillEstado = '', tecMov = false;

    function guardar() {
      historial.push(piezas.map((q) => ({ k: q.k, x: q.x, y: q.y })));
      if (historial.length > 60) historial.shift();
      acciones();
    }
    function acciones() { deshacerBtn.disabled = !historial.length; }
    function deshacer() {
      if (!historial.length) return;
      piezas = historial.pop();
      efecto = null;
      pinta();
    }

    GRUPOS.forEach(([t, nombre]) => {
      const g = document.createElement('div');
      g.className = 'io-gpo';
      const h = document.createElement('p');
      const dot = document.createElement('i');
      dot.className = 'io-dot io-' + t;
      dot.setAttribute('aria-hidden', 'true');
      h.append(dot, nombre);
      g.append(h);
      Object.entries(PIEZAS).forEach(([k, v]) => {
        if (v.t !== t) return;
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'io-b io-' + t;
        b.dataset.k = k;
        b.setAttribute('aria-pressed', 'false');
        b.innerHTML = icono(t);
        const sp = document.createElement('span');
        sp.textContent = v.n;
        b.append(sp);
        g.append(b);
      });
      paleta.append(g);
    });
    const botones = Array.prototype.slice.call(paleta.querySelectorAll('.io-b'));

    EJEMPLOS.forEach((ej, i) => {
      const o = document.createElement('option');
      o.value = String(i);
      o.textContent = ej.n;
      sel.append(o);
    });

    function aristas() {
      const e = [];
      const mcu = piezas.find((q) => PIEZAS[q.k].t === 'mcu');
      if (mcu) piezas.forEach((q) => {
        const t = PIEZAS[q.k].t;
        if (t === 'sen' || t === 'pow' || t === 'rad') e.push([mcu.k, q.k, t]);
      });
      piezas.filter((q) => PIEZAS[q.k].t === 'rad').forEach((q) => {
        const dst = q.k === 'wifi' ? (piezas.find((z) => z.k === 'nube') || piezas.find((z) => z.k === 'pas')) : piezas.find((z) => z.k === 'pas');
        if (dst) e.push([q.k, dst.k, 'rad']);
      });
      if (tiene('pas') && tiene('nube')) e.push(['pas', 'nube', 'dst']);
      return e;
    }

    function lineas() {
      svg.textContent = '';
      const c = (k) => { const q = piezas.find((z) => z.k === k); return q && [q.x + PW / 2, q.y + PH / 2]; };
      aristas().forEach(([a, b, t]) => {
        const p1 = c(a), p2 = c(b);
        if (!p1 || !p2) return;
        const dx = p2[0] - p1[0], dy = p2[1] - p1[1], d = Math.hypot(dx, dy) || 1;
        const off = Math.min(26, d * 0.16);
        const cx = (p1[0] + p2[0]) / 2 - (dy / d) * off, cy = (p1[1] + p2[1]) / 2 + (dx / d) * off;
        const p = document.createElementNS(SVGNS, 'path');
        p.setAttribute('d', `M${p1[0]} ${p1[1]} Q${cx} ${cy} ${p2[0]} ${p2[1]}`);
        p.setAttribute('class', `io-ln io-l-${t}`);
        p.dataset.ab = a + ' ' + b;
        svg.append(p);
      });
    }

    function resalta(k) {
      const on = !!k;
      svg.classList.toggle('io-focus', on);
      Array.prototype.forEach.call(svg.querySelectorAll('.io-ln'), (p) => {
        p.classList.toggle('io-hot', on && p.dataset.ab.split(' ').includes(k));
      });
    }

    function pintaPaleta() {
      botones.forEach((b) => {
        const v = PIEZAS[b.dataset.k], en = tiene(b.dataset.k);
        b.setAttribute('aria-pressed', en ? 'true' : 'false');
        b.title = v.d + (en ? ' Ya está en la mesa.' : '');
      });
    }

    function resultado(msgs) {
      res.textContent = '';
      msgs.forEach(({ nivel, texto }, i) => {
        const li = document.createElement('li');
        li.className = 'io-' + nivel;
        li.style.animationDelay = Math.min(i * 45, 320) + 'ms';
        const b = document.createElement('strong');
        b.textContent = ROT[nivel] + ': ';
        li.append(b, texto);
        res.append(li);
      });
    }

    function puntuacion(msgs, vacio) {
      const n = ESENCIALES.filter((t) => piezas.some((q) => PIEZAS[q.k].t === t)).length;
      Array.prototype.forEach.call(meter.children, (s, i) => s.classList.toggle('on', i < n));
      meter.classList.toggle('io-full', n === ESENCIALES.length);
      cuenta.textContent = `${n} de ${ESENCIALES.length}`;
      cnt.textContent = piezas.length ? `${piezas.length} ${piezas.length === 1 ? 'pieza en la mesa' : 'piezas en la mesa'}` : 'Mesa vacía';
      let est = '', txt = '';
      if (!vacio) {
        if (msgs.some((m) => m.nivel === 'falta')) { est = 'io-falta'; txt = 'Faltan piezas'; }
        else if (msgs.some((m) => m.nivel === 'aviso')) { est = 'io-aviso'; txt = 'Revisa los avisos'; }
        else { est = 'io-ok'; txt = 'Encajan'; }
      }
      if (!est) { pill.hidden = true; pill.className = 'io-pill'; pill.textContent = ''; pillEstado = ''; }
      else if (est !== pillEstado) {
        pillEstado = est;
        pill.hidden = false;
        pill.className = 'io-pill ' + est;
        pill.textContent = txt;
        void pill.offsetWidth;
        pill.classList.add('io-pop');
      }
    }

    function pinta() {
      mesa.querySelectorAll('.io-p,.io-vacio').forEach((e) => e.remove());
      if (!piezas.length) {
        const v = document.createElement('p');
        v.className = 'io-vacio';
        const i = document.createElement('span');
        i.className = 'io-vacio-i';
        i.setAttribute('aria-hidden', 'true');
        i.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v9M7.5 12h9"/></svg>';
        const t = document.createElement('strong');
        t.textContent = 'Mesa vacía';
        const s = document.createElement('span');
        s.className = 'io-vacio-t';
        s.textContent = 'Arrastra piezas hasta aquí o pulsa sobre ellas en la paleta.';
        v.append(i, t, s);
        mesa.append(v);
      }
      piezas.forEach((q) => {
        const v = PIEZAS[q.k];
        const d = document.createElement('div');
        d.className = 'io-p io-' + v.t;
        d.dataset.k = q.k;
        d.tabIndex = 0;
        d.style.left = q.x + 'px';
        d.style.top = q.y + 'px';
        d.setAttribute('aria-label', `${v.n} — ${TITULO[v.t].toLowerCase()}. Flechas para moverlo, Supr para quitarlo.`);
        d.innerHTML = icono(v.t);
        const sp = document.createElement('span');
        sp.className = 'io-pt';
        sp.textContent = v.s || v.n;
        const x = document.createElement('button');
        x.type = 'button';
        x.className = 'io-x';
        x.textContent = '×';
        x.setAttribute('aria-label', `Quitar ${v.n}`);
        x.addEventListener('click', (e) => { e.stopPropagation(); guardar(); quita(q); });
        d.append(sp, x);
        d.addEventListener('focus', () => resalta(q.k));
        d.addEventListener('blur', () => { tecMov = false; resalta(null); });
        d.addEventListener('keydown', (e) => teclaPieza(e, q));
        d.addEventListener('keyup', (e) => { if (e.key.indexOf('Arrow') === 0) tecMov = false; });
        if (efecto === 'todos') { d.classList.add('io-nue'); d.style.animationDelay = `${(piezas.indexOf(q) % 6) * 70}ms`; }
        else if (efecto === q.k) d.classList.add('io-nue');
        mesa.append(d);
      });
      efecto = null;
      lineas();
      const vacio = !piezas.length;
      const msgs = vacio
        ? [{ nivel: 'info', texto: 'Añade piezas a la mesa: aquí te diremos qué encaja, qué falta y qué conviene revisar.' }]
        : evaluar(piezas.map((q) => q.k));
      resultado(msgs);
      puntuacion(msgs, vacio);
      pintaPaleta();
      acciones();
    }

    function anade(k, x, y, hist) {
      if (tiene(k)) return false;
      const t = PIEZAS[k].t;
      if (hist !== false) guardar();
      if (t === 'mcu' || t === 'pow') piezas = piezas.filter((q) => PIEZAS[q.k].t !== t);
      if (x === undefined) {
        const n = piezas.filter((q) => PIEZAS[q.k].t === t).length;
        x = COL[t];
        y = t === 'pow' ? 250 : t === 'mcu' ? 110 : 16 + n * 62;
      }
      piezas.push({ k, x: snap(clamp(x, 0, W - PW)), y: snap(clamp(y, 0, H - PH)) });
      return true;
    }

    function anyade(k, x, y) {
      if (!anade(k, x, y)) { flash(k); return; }
      efecto = k;
      pinta();
    }

    function flash(k) {
      const el = mesa.querySelector(`.io-p[data-k="${k}"]`);
      if (!el) return;
      el.classList.remove('io-flash');
      void el.offsetWidth;
      el.classList.add('io-flash');
      el.focus({ preventScroll: true });
    }

    function quita(q) {
      piezas = piezas.filter((z) => z !== q);
      pinta();
    }

    function teclaPieza(e, q) {
      const k = e.key;
      const dir = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[k];
      if (dir) {
        e.preventDefault();
        if (!tecMov) { guardar(); tecMov = true; }
        const paso = PASO * (e.shiftKey ? 4 : 1);
        q.x = clamp(q.x + dir[0] * paso, 0, W - PW);
        q.y = clamp(q.y + dir[1] * paso, 0, H - PH);
        const el = mesa.querySelector(`.io-p[data-k="${q.k}"]`);
        if (el) { el.style.left = q.x + 'px'; el.style.top = q.y + 'px'; }
        lineas();
      } else if (k === 'Delete' || k === 'Backspace') {
        e.preventDefault();
        guardar();
        quita(q);
        const nxt = mesa.querySelector('.io-p');
        (nxt || botones[0]).focus({ preventScroll: true });
      } else if (k === ' ') {
        e.preventDefault();
      }
    }

    const dentro = (ev) => {
      const r = mesa.getBoundingClientRect();
      return ev.clientX >= r.left && ev.clientX <= r.right && ev.clientY >= r.top && ev.clientY <= r.bottom;
    };

    botones.forEach((b) => {
      b.addEventListener('click', () => { if (!arrastrado) anyade(b.dataset.k); });
      b.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'touch') return;
        const x0 = e.clientX, y0 = e.clientY;
        let g = null;
        const mv = (ev) => {
          if (!g && Math.hypot(ev.clientX - x0, ev.clientY - y0) > 6) {
            g = b.cloneNode(true);
            g.classList.add('io-g');
            document.body.append(g);
          }
          if (g) {
            g.style.left = ev.clientX + 10 + 'px';
            g.style.top = ev.clientY + 10 + 'px';
            mesa.classList.toggle('io-over', dentro(ev));
          }
        };
        const up = (ev) => {
          document.removeEventListener('pointermove', mv);
          document.removeEventListener('pointerup', up);
          document.removeEventListener('pointercancel', up);
          mesa.classList.remove('io-over');
          if (!g) return;
          g.remove();
          arrastrado = true;
          setTimeout(() => { arrastrado = false; }, 0);
          if (dentro(ev)) {
            const r = mesa.getBoundingClientRect();
            anyade(b.dataset.k, ev.clientX - r.left - PW / 2, ev.clientY - r.top - PH / 2);
          }
        };
        document.addEventListener('pointermove', mv);
        document.addEventListener('pointerup', up);
        document.addEventListener('pointercancel', up);
      });
    });

    mesa.addEventListener('pointerdown', (e) => {
      const el = e.target.closest('.io-p');
      if (!el || e.target.closest('.io-x')) return;
      const q = piezas.find((z) => z.k === el.dataset.k);
      if (!q) return;
      const dx = e.clientX - mesa.getBoundingClientRect().left - q.x;
      const dy = e.clientY - mesa.getBoundingClientRect().top - q.y;
      let movido = false;
      el.setPointerCapture(e.pointerId);
      el.classList.add('io-drag');
      const mv = (ev) => {
        if (!movido) { guardar(); movido = true; }
        const r = mesa.getBoundingClientRect();
        q.x = snap(clamp(ev.clientX - r.left - dx, 0, W - PW));
        q.y = snap(clamp(ev.clientY - r.top - dy, 0, H - PH));
        el.style.left = q.x + 'px';
        el.style.top = q.y + 'px';
        lineas();
      };
      const up = () => {
        el.removeEventListener('pointermove', mv);
        el.removeEventListener('pointerup', up);
        el.removeEventListener('pointercancel', up);
        el.classList.remove('io-drag');
      };
      el.addEventListener('pointermove', mv);
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
    });

    $('io-vaciar').addEventListener('click', () => {
      if (!piezas.length) return;
      guardar();
      piezas = [];
      efecto = null;
      pinta();
    });
    $('io-ejemplo').addEventListener('click', () => {
      const ej = EJEMPLOS[+sel.value] || EJEMPLOS[0];
      guardar();
      piezas = [];
      ej.p.forEach((k) => anade(k, undefined, undefined, false));
      efecto = 'todos';
      pinta();
    });
    deshacerBtn.addEventListener('click', deshacer);
    $('demo-iot').addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        deshacer();
      }
    });

    const scroller = mesa.parentNode;
    function pista() {
      hint.hidden = !(scroller.clientWidth > 2 && scroller.scrollWidth > scroller.clientWidth + 2);
    }
    window.addEventListener('resize', pista);
    const det = $('demo-iot').querySelector('details');
    if (det) det.addEventListener('toggle', () => requestAnimationFrame(pista));
    pista();

    pinta();
  }
}
