// Demo: voz a texto en el navegador (Whisper + Transformers.js). El audio no sale del dispositivo.
// Primera versión: librería y modelo desde el CDN de jsDelivr / Hugging Face.
// Para dejar de depender de terceros, alójalos tú y cambia AUTOALOJADO a true (ver rutas abajo).
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3';

const MODELO = 'onnx-community/whisper-base'; // multilingüe. Prueba también whisper-small
const AUTOALOJADO = false;
const MAX_SEG = 30;

if (AUTOALOJADO) {
  env.allowRemoteModels = false;
  env.allowLocalModels = true;
  env.localModelPath = '/modelos/';           // /modelos/onnx-community/whisper-base/...
  env.backends.onnx.wasm.wasmPaths = '/vendor/'; // archivos .wasm de onnxruntime-web
}

const $ = (id) => document.getElementById(id);
const btnCargar = $('dv-cargar'), btnGrabar = $('dv-grabar'), estado = $('dv-estado'), salida = $('dv-texto');
let asr = null, rec = null, trozos = [], timer = null;

const msg = (t) => { estado.textContent = t; };

btnCargar.addEventListener('click', async () => {
  btnCargar.disabled = true;
  try {
    const pct = {};
    asr = await pipeline('automatic-speech-recognition', MODELO, {
      dtype: 'q8',
      device: 'wasm',
      progress_callback: (e) => {
        if (e.status === 'progress' && e.file) {
          pct[e.file] = e.progress || 0;
          const v = Object.values(pct);
          msg('Descargando el modelo… ' + Math.round(v.reduce((a, b) => a + b, 0) / v.length) + '%');
        }
      },
    });
    msg('Listo. Pulsa «Grabar» y habla en español.');
    btnCargar.hidden = true;
    btnGrabar.hidden = false;
  } catch (err) {
    console.error(err);
    msg('No se ha podido cargar el modelo. Comprueba tu conexión e inténtalo de nuevo.');
    btnCargar.disabled = false;
  }
});

btnGrabar.addEventListener('click', async () => {
  if (rec && rec.state === 'recording') return rec.stop();
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    trozos = [];
    rec = new MediaRecorder(stream);
    rec.ondataavailable = (e) => trozos.push(e.data);
    rec.onstop = async () => {
      clearTimeout(timer);
      stream.getTracks().forEach((t) => t.stop());
      btnGrabar.textContent = 'Grabar';
      btnGrabar.disabled = true;
      msg('Transcribiendo en tu dispositivo…');
      try {
        const buf = await new Blob(trozos).arrayBuffer();
        const ctx = new AudioContext({ sampleRate: 16000 });
        const audio = (await ctx.decodeAudioData(buf)).getChannelData(0);
        ctx.close();
        const r = await asr(audio, { language: 'spanish', task: 'transcribe', chunk_length_s: 30 });
        salida.textContent = r.text.trim() || 'No se ha entendido nada. Prueba a hablar más cerca del micrófono.';
        msg('Hecho. Nada de esto ha salido de tu navegador.');
      } catch (err) {
        console.error(err);
        msg('No se ha podido transcribir la grabación. Inténtalo de nuevo.');
      }
      btnGrabar.disabled = false;
    };
    rec.start();
    btnGrabar.textContent = 'Parar';
    msg('Grabando… (máximo ' + MAX_SEG + ' segundos)');
    timer = setTimeout(() => rec.state === 'recording' && rec.stop(), MAX_SEG * 1000);
  } catch (err) {
    console.error(err);
    msg('No se puede usar el micrófono. Permite el acceso en el navegador e inténtalo de nuevo.');
  }
});
