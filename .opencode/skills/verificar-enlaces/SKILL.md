---
name: verificar-enlaces
description: Use after editing HTML, images or assets, or when asked to check the site (verificar enlaces, comprobar que no hay enlaces rotos). Runs the PowerShell link-check script and serves the site locally.
---

# Verificar el sitio

## Comprobar enlaces rotos

Ejecutar desde PowerShell en la raíz del repo (verifica que todas las referencias locales `src`, `href` y `poster` apuntan a archivos existentes; ignora URLs `http(s)://`):

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

Sin salida = todo correcto. Si aparece `FALTA: ...`, corregir la referencia o añadir el archivo.

Notas:
- El script solo comprueba recursos con extensión de imagen/vídeo. Los enlaces entre páginas (`.html`) se revisan visualmente o con `Test-Path` individual.
- Las rutas son relativas a la carpeta de cada HTML (los de subdirectorio usan `../`).

## Servir en local

No hay build: cualquier servidor estático sirve.

```bash
npx serve .            # o: python -m http.server 8000
```

Abrir `http://localhost:8000` (o el puerto del servidor) y revisar la página modificada, incluyendo el tema oscuro (el toggle `.theme` persiste en `localStorage` con la clave `al-theme`).
