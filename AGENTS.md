# AGENTS.md

Sitio web corporativo estático de AgeingLab Tech. HTML + CSS + JavaScript vanilla, sin framework, sin build, sin dependencias (fuentes auto-hospedadas, sin CDN). Publicado en GitHub Pages. No hay tests, lint ni pipeline de código: editar un archivo y servirlo localmente es todo el ciclo.

## Comandos

- Ver en local: `npx serve .` o `python -m http.server 8000`.
- Verificar enlaces rotos: script PowerShell en la sección "Verificación rápida de enlaces" del `README.md`.

## Convenciones que suelen pasar desapercibidas

- **Idioma:** todo el contenido en español (`lang="es"`).
- **Cada página HTML replica el bloque `<head>` completo** (canonical, Open Graph, Twitter Cards, JSON-LD: Organization/Service/BreadcrumbList). Al crear una página nueva: copiar el `<head>` de una existente, adaptar título/descripción/canonical/JSON-LD y **añadir su URL a `sitemap.xml`** (30 URLs actualmente).
- **Títulos y descriptions:** `<title>` ≤ 60 caracteres y `meta description` ≤ 155; el mismo texto se replica en `og:title`/`og:description` y `twitter:title`/`twitter:description`. Patrón de título: `Página | AgeingLab Tech` (sin segmentos intermedios tipo `| Casos de éxito`).
- **Identidad:** AgeingLab Tech es un **servicio de AgeingLab** en el Centro de Tecnología Biomédica (UPM), no una empresa independiente. Mantener ese framing en copy visible (footer, `#nosotros`, `aviso-legal.html`) y en el JSON-LD `Organization` (`description`).
- **Footer unificado:** el bloque `<footer>` es idéntico en las 31 páginas con nav; solo cambia el prefijo de rutas (raíz `index.html`: sin prefijo y `#`; legales de la raíz: sin prefijo y `/#`; `404.html`: `/` y `/#`; subdirectorios: `../` y `/#`). Si se modifica, replicar el mismo footer en las 31 páginas.
- **Rutas relativas:** las páginas de subdirectorio (`servicios/`, `soluciones/`, `casos-de-exito/`, `guias/`) refieren a los assets compartidos con `../` (p. ej. `../styles.css`, `../js/main.js`); las de la raíz sin prefijo.
- **Enlaces al inicio:** logo, "Inicio", botón de contacto y anclas de la landing apuntan a la raíz absoluta (`/`, `/#contacto`), nunca a `index.html`. Así la barra de dirección queda limpia y `404.html` (servido bajo cualquier ruta) no rompe los enlaces.
- **Fuentes:** auto-hospedadas en `fonts/` (Google Fonts, licencia OFL) y enlazadas desde cada página con `fonts/fonts.css` + 2 preloads, usando el mismo prefijo relativo que `styles.css`. Pesos disponibles: Bricolage Grotesque 500/700 (títulos, por defecto 700) y Source Sans 3 400/600 (cuerpo); no existen otros pesos ni cursivas (se sintetizan). `404.html` usa rutas absolutas `/fonts/...` porque se sirve bajo cualquier URL. Al añadir un peso o subconjunto: copiar el `.woff2`, declararlo en `fonts/fonts.css` y añadirlo a `CORE` en `js/service-worker.js`.
- **`styles.css` y `js/main.js` son compartidos por todas las páginas**: cualquier cambio afecta al sitio entero.
- **Tema** claro/oscuro/auto persistido en `localStorage` con la clave `al-theme`; el toggle (grupo `.theme`) está en la cabecera de cada página.
- **Formulario de contacto:** envía directamente a Formspree (`action="https://formspree.io/f/..."` en `index.html`); no hay backend ni API propia.
- **Imágenes:** WebP para casi todo; `loading="lazy"` en las imágenes; el vídeo del hero lleva `poster` y se pausa si `prefers-reduced-motion`.
- **Despliegue:** push a la rama que publica GitHub Pages (normalmente `main`); se publica el contenido de la raíz del repo. `CNAME` resuelve el dominio `ageinglabtech.com`; si cambia, actualizar ese archivo.
- **PWA:** `manifest.json` + `js/service-worker.js` (service worker: precachea las 30 URLs del sitemap + assets compartidos y cachéa el resto bajo demanda; el sitio funciona offline). El `<head>` de cada página lleva las etiquetas PWA (`rel="manifest"` — con prefijo `../` en subdirectorios, `theme-color`, `apple-touch-icon`, metas de Apple); al crear una página nueva replicarlas y añadir su URL a `CORE` en `js/service-worker.js`.
- **`404.html`:** se sirve bajo cualquier ruta inexistente, así que usa rutas absolutas (`/servicios/`, `/#contacto`), lleva `meta robots noindex`, **sin** `canonical`, y jerarquía de encabezados h1 → h2 (`.sr-only`) → h3 del footer.

## Estructura

`index.html` (landing) + `servicios/` (índice de categoría + una página por servicio), `soluciones/`, `casos-de-exito/` (índice + 9 casos; `gestion-de-casos-implantes.html` es una redirección antigua sinindex), `guias/` (índice + 7 guías), y las páginas legales de la raíz (`aviso-legal.html`, `cookies.html`, `privacidad.html`, `404.html`). Los assets van en `img/` (subcarpetas `servicios/`, `casos/`, `clientes/`). Ver `README.md` para el detalle.
