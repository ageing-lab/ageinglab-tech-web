# Plan: des-IA-izar el copy sin perder SEO ni estructura

Fecha: 2026-10-08
Estado: pendiente de decidir alcance / tono / ejecución
Origen: análisis de marcas de IA en `index.html`, `soluciones/`, `servicios/`, `casos-de-exito/`, `guias/`

## 0. Principios (para no romper lo que ya funciona)

1. **No tocar `<head>`, SEO, `sitemap.xml`, footer, rutas ni PWA.** Solo copy visible del `<body>`.
2. **Todo en español, tono AgeingLab Tech = servicio de AgeingLab / UPM**, no empresa independiente. Mantener framing en `#nosotros` / footer / JSON-LD.
3. **Conservar los antídotos humanos** que ya funcionan y reutilizarlos como modelo:
   - "te decimos honestamente por dónde ir"
   - "Cifras medidas [...] no estimaciones"
   - cifras propias: 16GB VRAM, Qwen 27B, 20-50 tok/s, ~1.200€, 46 personas, 82 años, SUS 83,7, FHIR/GMV, WCAG.
4. **Regla anti-IA:** cada afirmación genérica se sustituye por *dato + verbo + entregable* o se elimina. Nada de añadir más texto, el objetivo es recortar y concretar.

## 1. Manual de estilo anti-patrones (aplicar en todos los lotes)

| Patrón a eliminar | Ejemplo actual | Sustitución tipo |
|---|---|---|
| Tríada solemne abstracta | "trazabilidad, seguridad y disponibilidad" x4 en `ia-local.html` | 1 sola mención + especificación: qué log, qué cifrado, qué uptime/SLA. En las otras 3 secciones, eliminar o referenciar. |
| Bucle "de forma estándar" | `integracion-fhir.html` x4 | Dejar 1 definición, resto: nombrar recursos/perfiles/HAPI/auth concretos. Contar usos de "estándar" (hoy 8 en 5 párrafos → objetivo ≤2). |
| `No es X, es/sino Y` / `No solo... sino` | `ia-privada-automatizacion.html`, `integrar-fhir.html` x2, `interfaces-para-mayores.html` | Reescribir en afirmativo + prueba: "Consultan tu ERP por API y ejecutan X con registro" en vez de "no solo responden, sino...". |
| Anáfora `No hace falta...` x4 | `hardware-ia-local.html #no-hagas` | Romper simetría: 2 en negativo + 2 en afirmativo con cifra, variar longitud, añadir "cuándo sí hace falta". |
| `no un extra / no cosmética / no un trámite` x5 guías | FHIR, hardware, IoT, software, transcripción | Variar 4 de 5: eliminar 2, dejar 1 como "incluido en el precio/entrega", otro como "lo validamos con X". |
| Metáfora poética / eslogan | "La TV como punto de encuentro", "no una isla", "donde más vive la integración", "motor de decisión", "de forma accionable" | Sustituir por literal técnico: qué hace, para quién, con qué stack. |
| Definición Wikipedia intercalada | "Jitsi, una solución...", "HTML5, una tecnología actual...", "La fragilidad es un estado..." | Mover a nota/aside o eliminar si rompe relato del caso. |
| Absolutistas sin mecanismo | "siempre", "totalmente privado", "100%", "hasta que funciona sin ayuda" | Añadir mecanismo o criterio de salida: "criterio SUS>80", "revisión clínica obligatoria", "límites definidos en X". |
| Repetición plantilla casos | `Desarrollamos... / El trabajo incluyó: / Es el tipo...` + CTA idéntico x9 | Diferenciar cierres: 3 variantes de CTA rotadas, y en `#resultados` exigir 1 métrica o 1 cambio observable (no parafrasear `#solucion`). |

## 2. Lotes propuestos (orden por impacto)

### Lote 1 — Casos rojos (mayor tufo)
- `casos-de-exito/ia-local.html`: unificar tríada a 1 mención + ficha técnica (16GB, 1.200€, Qwen 27B ya están en aside → referenciar, no repetir). Reescribir `#contexto` circular ("el dato no podía salir, así que la IA tenía que estar dentro").
- `casos-de-exito/integracion-fhir.html`: deduplicar las 4 frases "basado en el estándar FHIR...", dejar 1 + añadir detalle técnico real del proyecto GMV.
- `casos-de-exito/gestion-casos-quirurgicos.html`: corregir cacofonía "avisos que avisaran", quitar "integral" o definir qué integra, sustituir "ha impulsado una metodología basada en nuevas tecnologías" por cambio concreto.

### Lote 2 — Servicios rojos
- `servicios/ia-privada-automatizacion.html`: quitar `no solo... sino`, "para liberar tiempo", "a tu ritmo", "hoja de ruta priorizada" → poner entregables (auditoría = qué documentos, qué límites).
- `servicios/decisiones-con-ia.html`: eliminar "motor de decisión" (3x), "accionable", "se afinan", "realmente relevantes / descartamos el ruido" → "predicen X con precisión/recall Y validado en tus datos".

### Lote 3 — Guías
- `guias/hardware-ia-local.html #no-hagas` + `guias/integrar-fhir.html` (2x `no es...`) + variar los 5 `no un extra`.
- `guias/software-a-medida-salud.html`: romper paralelismo "X gana cuando... / Y gana cuando..." + `Del problema al software...`.
- `guias/iot-sensores-domicilio.html`, `interfaces-para-mayores.html`, `transcripcion-clinica-privada.html`: quitar clickbait ("lo que casi nadie..."), aforismos ("Si solo se ha probado en laboratorio, no se ha probado"), tríada final vacía.

### Lote 4 — Landing + transversales amarillos
- `index.html:85,120`: fusionar las 2 frases circulares "donde la innovación/tecnología importan" en 1 con sectores reales (salud, envejecimiento, biomedicina + 3 hospitales).
- `soluciones/index.html:86-94`: deduplicar "privado / no se comparte / dentro de tu entorno" (hoy 4-5x en un bloque → 2x max).
- `servicios/index.html:98`: corregir bug "Servicios de Construimos..." (es plantilla, no IA, pero canta).
- `servicios/investigacion-e-innovacion.html`: concretar "track record" con N líneas/proyectos/publicaciones, quitar "que vayan surgiendo".

## 3. Verificación por lote

1. `grep` de control tras cada lote: `no solo`, `no es.*sino`, `no un extra`, `trazabilidad.*seguridad.*disponibilidad`, `de forma estándar`, `de principio a fin`, `integral`, `accionable`, `motor de decisión`.
   Objetivo: 0 `no solo... sino`, ≤2 "estándar" por página, 0 tríadas abstractas repetidas.
2. Servir en local (`python -m http.server 8000`) + pasada del script de enlaces del `README.md` (skill `verificar-enlaces`) — solo lectura, sin cambios de rutas.
3. Revisión humana: ¿cada sección responde a *qué se entregó / con qué dato*? Si solo editorializa, recortar.

## 4. Decisiones pendientes

1. Alcance: solo rojos / rojos+amarillos (recomendado) / sitio completo.
2. Tono referencia: técnico-concreto (recomendado) / cercano-humano / institucional UPM.
3. Ejecución: por lotes (recomendado) / todo de golpe / solo plan.
