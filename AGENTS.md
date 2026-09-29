# AGENTS.md

Sitio web corporativo estático de AgeingLab Tech. HTML + CSS + JavaScript vanilla, sin framework, sin build, sin dependencias (la única externa es Google Fonts). Publicado en GitHub Pages. No hay tests, lint ni pipeline de código: editar un archivo y servirlo localmente es todo el ciclo.

## Comandos

- Ver en local: `npx serve .` o `python -m http.server 8000`.
- Verificar enlaces rotos: script PowerShell en la sección "Verificación rápida de enlaces" del `README.md`.

## Convenciones que suelen pasar desapercibidas

- **Idioma:** todo el contenido en español (`lang="es"`).
- **Cada página HTML replica el bloque `<head>` completo** (canonical, Open Graph, Twitter Cards, JSON-LD: Organization/Service/BreadcrumbList). Al crear una página nueva: copiar el `<head>` de una existente, adaptar título/descripción/canonical/JSON-LD y **añadir su URL a `sitemap.xml`** (18 URLs actualmente).
- **Rutas relativas:** las páginas de subdirectorio (`servicios/`, `soluciones/`, `casos-de-exito/`) refieren a los assets compartidos con `../` (p. ej. `../styles.css`, `../script.js`); las de la raíz sin prefijo.
- **`styles.css` y `script.js` son compartidos por todas las páginas**: cualquier cambio afecta al sitio entero.
- **Tema** claro/oscuro/auto persistido en `localStorage` con la clave `al-theme`; el toggle (grupo `.theme`) está en la cabecera de cada página.
- **Formulario de contacto:** envía directamente a Formspree (`action="https://formspree.io/f/..."` en `index.html`); no hay backend ni API propia.
- **Imágenes:** WebP para casi todo; `loading="lazy"` en las imágenes; el vídeo del hero lleva `poster` y se pausa si `prefers-reduced-motion`.
- **Despliegue:** push a la rama que publica GitHub Pages (normalmente `main`); se publica el contenido de la raíz del repo. `CNAME` resuelve el dominio `ageinglabtech.com`; si cambia, actualizar ese archivo.

## Estructura

`index.html` (landing) + `servicios/` (una página por servicio), `soluciones/`, `casos-de-exito/` (índice + casos). Los assets van en `img/` (subcarpetas `servicios/`, `casos/`, `clientes/`). Ver `README.md` para el detalle.
