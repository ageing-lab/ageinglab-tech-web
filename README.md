# AgeingLab Tech — Sitio web

Sitio web corporativo estático de **AgeingLab Tech** (https://www.ageinglabtech.com), publicado en **GitHub Pages**.

Sin framework ni build: HTML + CSS + JavaScript vanilla. La única dependencia externa es Google Fonts.

## Estructura

```
index.html                 # Landing
styles.css                 # Hoja de estilos global (temas claro/oscuro/auto)
script.js                  # Menú móvil, animaciones (IntersectionObserver), tema
hero.mp4 / hero-poster.webp  # Vídeo de fondo del hero
img/
  servicios/               # Imágenes de las fichas de servicio
  casos/                   # Capturas y fotos de los casos de éxito
  clientes/                # Logos de clientes
  equipo-*.webp           # Fotos del equipo
  logo.svg
  icons/                  # Iconos PWA (192, 512, maskable y apple-touch 180)
servicios/                 # 6 fichas de servicio (una página por servicio)
soluciones/                # Página de soluciones de IA privada
casos-de-exito/           # 10 casos de éxito + índice
manifest.json              # PWA: manifiesto (instalable como app)
sw.js                    # PWA: service worker con caché offline del sitio completo
sitemap.xml                # Indexación (21 URLs)
robots.txt
CNAME                      # Dominio personalizado (ageinglabtech.com)
```

## Cómo abrirlo en local

Cualquier servidor estático sirve. Sin dependencias que instalar:

```bash
# opción 1: Node
npx serve .

# opción 2: Python
python -m http.server 8000
```

Después abrir `http://localhost:8000` (o el puerto que use el servidor).

## Despliegue

1. Subir los cambios a la rama que publica GitHub Pages (normalmente `main`).
2. GitHub Pages publica el contenido de la raíz del repo.
3. El dominio `www.ageinglabtech.com` lo resuelve `CNAME`; si cambia, actualizar ese archivo.

## Convenciones

- **Idioma:** español (`lang="es"`).
- **SEO en cada página:** `canonical`, Open Graph, Twitter Cards y JSON-LD (Organization / Service / BreadcrumbList). Al crear una página nueva, replicar el bloque `<head>` de una página existente y añadir su URL a `sitemap.xml`.
- **Tema:** claro / oscuro / automático, persistido en `localStorage` (`al-theme`). El toggle está en la cabecera de todas las páginas.
- **Contacto:** formulario vía [Formspree](https://formspree.io) (`index.html`, `action="https://formspree.io/f/..."`). Las respuestas llegan a la cuenta de Formspree.
- **Imágenes:** WebP para casi todo. Si se añaden JPG grandes, comprimirlos a WebP (p. ej. con `sharp` o `cwebp`) y actualizar las referencias HTML.
- **Rendimiento:** las imágenes llevan `loading="lazy"`; el vídeo del hero tiene `poster` y se pausa si `prefers-reduced-motion`.
- **PWA:** cada página replica las etiquetas PWA en el `<head>` (`rel="manifest"`, `theme-color`, `apple-touch-icon` y metas de Apple); en páginas de subdirectorio se usan rutas con `../` (`../manifest.json`, `../img/icons/...`). `sw.js` precachea las 21 URLs del sitemap + los assets compartidos y cachéa el resto bajo demanda (el sitio funciona offline). Al crear una página nueva: replicar también esas etiquetas y añadir su URL a la lista `CORE` de `sw.js`.

## Verificación rápida de enlaces

Para comprobar que todas las referencias locales (img, poster, src) apuntan a archivos existentes:

```powershell
Get-ChildItem -Recurse -Filter *.html -File | ForEach-Object {
  $dir = $_.Directory.FullName
  $html = [IO.File]::ReadAllText($_.FullName)
  [regex]::Matches($html, '(?:src|href|poster)="([^"]+\.(?:jpg|jpeg|webp|png|svg|mp4))"') |
    ForEach-Object {
      $ref = $_.Groups[1].Value
      if ($ref -notmatch '^https?://' -and -not (Test-Path -LiteralPath (Join-Path $dir $ref))) {
        Write-Output "FALTA: $ref (en $($_.Name))"
      }
    }
}
```
