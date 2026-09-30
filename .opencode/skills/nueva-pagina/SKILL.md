---
name: nueva-pagina
description: Use when creating or adding a new page to the site (nuevo servicio, nuevo caso de éxito, nueva sección). Asegura que el bloque <head> SEO se replica en la página, se actualiza sitemap.xml y se añade el enlace en los índices y footers.
---

# Nueva página

No hay CMS ni plantillas: cada HTML es independiente y replica el `<head>` completo de las demás páginas. Copiar el esqueleto de una página existente es el paso correcto; no escribir el `<head>` de memoria.

## Pasos

1. **Copiar una página existente del mismo tipo** y editarla:
   - Servicio → `servicios/<otra>.html`
   - Caso de éxito → `casos-de-exito/<otro>.html`
2. **Adaptar el `<head>`** (está copiado íntegro en cada página):
   - `title` y `meta description`
   - `link rel="canonical"` y `og:url` → URL completa `https://www.ageinglabtech.com/<ruta>`
   - `og:title`, `og:description`, `twitter:title`, `twitter:description`
   - JSON-LD:
     - `BreadcrumbList` (posiciones 1–3, URLs completas)
     - `Service` para servicios · `WebPage` para casos de éxito · `CollectionPage` para índices
   - En casos de éxito, `og:type` es `"article"` (no `"website"`)
3. **Añadir la URL a `sitemap.xml`**:
   - Servicios: `<changefreq>monthly</changefreq><priority>0.8</priority>`
   - Casos de éxito: `<changefreq>yearly</changefreq><priority>0.7</priority>`
4. **Rutas**: páginas en subdirectorio usan `../` para assets compartidos (`../styles.css`, `../script.js`, `../img/...`); la raíz, sin prefijo. Los enlaces al inicio (logo, "Inicio", anclas de la landing) usan siempre la raíz absoluta: `/` y `/#seccion` (nunca `index.html` ni `../index.html`).
5. **Imágenes**: WebP en `img/servicios/` o `img/casos/`, siempre con `loading="lazy"`.
6. **Miga de pan** en el hero: `<nav aria-label="Miga de pan">` con enlaces relativos (`../`), salvo "Inicio" que apunta a `/`.
7. **Contenido en español** (`lang="es"`), mismo estilo redaccional que el resto del sitio.

## Si es un servicio nuevo (no solo una página)

- Añadir su `.card` a la pista "Qué hacemos" de `index.html` (`#tk`).
- Añadir su enlace a la columna "Qué hacemos" del **footer de TODAS las páginas** (cada página tiene su propio footer; en `servicios/` el enlace es relativo, p. ej. `href="nuevo-servicio.html"`).
- Añadir una opción al `<select name="interes">` del formulario de contacto: el mismo select existe en **todas las páginas** (sección de contacto al final de cada una), por lo que la opción nueva debe añadirse en todas.

## Si es un caso de éxito nuevo

- Añadir su `<li>` a `casos-de-exito/index.html`.
- Añadir su entrada al `ItemList` del JSON-LD `CollectionPage` en `casos-de-exito/index.html` (mantener posiciones consecutivas y URL completa).
- Si encaja en un sector, añadir el enlace a la lista del sector correspondiente en `index.html` (`#sectores`).

## Verificación final

Ejecutar la skill `verificar-enlaces` (o servir en local con `npx serve .` y revisar la página).
