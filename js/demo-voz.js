// Demo: voz a texto en el navegador (Whisper + Transformers.js). El audio no sale del dispositivo.
// Primera versión: librería y modelo desde el CDN de jsDelivr / Hugging Face, cargados con import()
// al pulsar «Activar la demo», para que la interfaz siga funcionando si el CDN no responde.
// Para dejar de depender de terceros, alójalos tú y cambia AUTOALOJADO a true (ver rutas abajo).

const CDN = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3';
const MODELO = 'onnx-community/whisper-base'; // multilingüe. Prueba también whisper-small
const AUTOALOJADO = false;
const MAX_SEG = 30;
const BARRAS = 24;

const $ = (id) => document.getElementById(id);
const ui = $('dv-ui'), btnCargar = $('dv-cargar'), txtCargar = $('dv-cargar-t');
const prog = $('dv-prog'), fill = $('dv-prog-fill'), ptxt = $('dv-prog-txt');
const panelRec = $('dv-rec'), btnGrabar = $('dv-grabar'), hint = $('dv-hint');
const meter = $('dv-meter'), tiempo = $('dv-time'), estado = $('dv-estado');
const salida = $('dv-texto'), copiar = $('dv-copiar');

let asr = null, grab = null, trozos = [], reloj = null, raf = 0;
let actx = null, analyser = null, stream = null, ocupado = false, cargando = false;
const barras = [];
for (let i = 0; i < BARRAS; i++) {
  const b = document.createElement('i');
  meter.appendChild(b);
  barras.push(b);
}

const AC = window.AudioContext || window.webkitAudioContext;
const setK = (k) => { ui.dataset.k = k; };
const msg = (t, k) => { estado.textContent = t; if (k) setK(k); };
const fmt = (s) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
const pintaCopiar = () => { copiar.hidden = !salida.textContent; };

function micOn(on) {
  btnGrabar.dataset.on = on ? '1' : '0';
  btnGrabar.setAttribute('aria-pressed', on ? 'true' : 'false');
  btnGrabar.setAttribute('aria-label', on ? 'Detener la grabación' : 'Empezar a grabar');
}

function paraNivel() {
  if (raf) cancelAnimationFrame(raf);
  raf = 0;
  barras.forEach((b) => { b.style.height = '12%'; });
}

function cierraAudio() {
  if (actx) { try { actx.close(); } catch (e) {} actx = null; }
  analyser = null;
}

function arrancaNivel() {
  if (!AC) return;
  try {
    actx = new AC();
    analyser = actx.createAnalyser();
    analyser.fftSize = 64;
    analyser.smoothingTimeConstant = .7;
    actx.createMediaStreamSource(stream).connect(analyser);
    const datos = new Uint8Array(analyser.frequencyBinCount);
    const paso = Math.max(1, Math.floor(datos.length / barras.length));
    const pinta = () => {
      analyser.getByteFrequencyData(datos);
      for (let i = 0; i < barras.length; i++) {
        const v = datos[Math.min(datos.length - 1, i * paso)] / 255;
        barras[i].style.height = Math.max(12, Math.round(v * 100)) + '%';
      }
      raf = requestAnimationFrame(pinta);
    };
    pinta();
  } catch (err) { console.error(err); }
}

function para() {
  if (reloj) { clearInterval(reloj); reloj = null; }
  if (grab && grab.state === 'recording') grab.stop();
}

async function transcribe() {
  paraNivel();
  cierraAudio();
  if (stream) { stream.getTracks().forEach((t) => t.stop()); stream = null; }
  micOn(false);
  hint.textContent = 'Pulsa el micrófono para grabar otra vez.';
  ocupado = true;
  btnGrabar.disabled = true;
  setK('work');
  msg('Transcribiendo en tu dispositivo…', 'work');
  salida.setAttribute('aria-busy', 'true');
  try {
    const buf = await new Blob(trozos).arrayBuffer();
    const ctx = new AC({ sampleRate: 16000 });
    const audio = (await ctx.decodeAudioData(buf)).getChannelData(0);
    ctx.close();
    const r = await asr(audio, { language: 'spanish', task: 'transcribe', chunk_length_s: 30 });
    const t = ((r && r.text) || '').trim();
    salida.textContent = t || 'No se ha entendido nada. Prueba a hablar más cerca del micrófono.';
    pintaCopiar();
    msg(t ? 'Hecho. Nada de esto ha salido de tu navegador.' : 'No se ha entendido nada. Prueba otra vez.', t ? 'ok' : 'err');
  } catch (err) {
    console.error(err);
    msg('No se ha podido transcribir la grabación. Inténtalo de nuevo.', 'err');
  } finally {
    salida.setAttribute('aria-busy', 'false');
    ocupado = false;
    btnGrabar.disabled = false;
  }
}

async function empieza() {
  let st;
  try {
    st = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (err) {
    console.error(err);
    msg('No se puede usar el micrófono. Permite el acceso en el navegador e inténtalo de nuevo.', 'err');
    return;
  }
  stream = st;
  trozos = [];
  grab = new MediaRecorder(stream);
  grab.ondataavailable = (e) => { if (e.data && e.data.size) trozos.push(e.data); };
  grab.onstop = transcribe;
  try {
    grab.start();
  } catch (err) {
    console.error(err);
    stream.getTracks().forEach((t) => t.stop());
    stream = null;
    msg('Este navegador no ha podido iniciar la grabación. Inténtalo con otro navegador.', 'err');
    return;
  }
  micOn(true);
  msg('Grabando en tu dispositivo…', 'rec');
  hint.textContent = 'Pulsa para parar y transcribir.';
  tiempo.textContent = '0:00 / ' + fmt(MAX_SEG);
  tiempo.classList.remove('hot');
  arrancaNivel();
  const t0 = Date.now();
  reloj = setInterval(() => {
    const s = Math.floor((Date.now() - t0) / 1000);
    tiempo.textContent = fmt(Math.min(s, MAX_SEG)) + ' / ' + fmt(MAX_SEG);
    if (s >= MAX_SEG - 5) tiempo.classList.add('hot');
    if (s >= MAX_SEG) para();
  }, 250);
}

if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
  btnCargar.disabled = true;
  txtCargar.textContent = 'Micrófono no disponible';
  msg('Esta página no puede usar el micrófono: ábrela en HTTPS (o localhost) con un navegador actual.', 'err');
} else {
  btnCargar.addEventListener('click', async () => {
    if (cargando || asr) return;
    cargando = true;
    btnCargar.disabled = true;
    txtCargar.textContent = 'Descargando…';
    prog.hidden = false;
    fill.style.width = '0%';
    ptxt.textContent = '0 %';
    msg('Descargando el modelo…', 'load');
    const pct = {};
    try {
      const { pipeline, env } = await import(CDN);
      if (AUTOALOJADO) {
        env.allowRemoteModels = false;
        env.allowLocalModels = true;
        env.localModelPath = '/modelos/';           // /modelos/onnx-community/whisper-base/...
        env.backends.onnx.wasm.wasmPaths = '/vendor/'; // archivos .wasm de onnxruntime-web
      }
      asr = await pipeline('automatic-speech-recognition', MODELO, {
        dtype: 'q8',
        device: 'wasm',
        progress_callback: (e) => {
          if (e.status === 'progress' && e.file) {
            pct[e.file] = e.progress || 0;
            const v = Object.values(pct);
            const p = Math.round(v.reduce((a, b) => a + b, 0) / v.length);
            fill.style.width = p + '%';
            ptxt.textContent = p + ' %';
            msg('Descargando el modelo… ' + p + ' %', 'load');
          }
        },
      });
      fill.style.width = '100%';
      ptxt.textContent = '100 %';
      cargando = false;
      btnCargar.hidden = true;
      prog.hidden = true;
      panelRec.hidden = false;
      hint.textContent = 'Pulsa el micrófono y habla en español. Máximo ' + MAX_SEG + ' segundos.';
      msg('Listo. Pulsa el micrófono y habla en español.', 'ok');
      btnGrabar.focus();
    } catch (err) {
      console.error(err);
      cargando = false;
      btnCargar.disabled = false;
      txtCargar.textContent = 'Reintentar';
      prog.hidden = true;
      msg('No se ha podido cargar el modelo. Comprueba tu conexión e inténtalo de nuevo.', 'err');
    }
  });
}

btnGrabar.addEventListener('click', () => {
  if (ocupado) return;
  if (grab && grab.state === 'recording') para();
  else empieza();
});

copiar.addEventListener('click', async () => {
  const t = salida.textContent;
  try {
    await navigator.clipboard.writeText(t);
  } catch (err) {
    const ta = document.createElement('textarea');
    ta.value = t;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    ta.remove();
  }
  copiar.textContent = 'Copiado ✓';
  setTimeout(() => { copiar.textContent = 'Copiar'; }, 1800);
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden && grab && grab.state === 'recording') para();
});
