const fs = require('fs'), path = require('path');
const marker = '<div><h3>Qué hacemos</h3>';

function walk(d) {
  let r = [];
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name === '.opencode' || e.name === '.git' || e.name === 'node_modules') continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) r = r.concat(walk(p));
    else if (e.name.endsWith('.html')) r.push(p);
  }
  return r;
}

let changed = 0;
for (const f of walk('.')) {
  const rel = f.split(path.sep).join('/');
  if (rel === 'servicios/index.html') continue;
  let s = fs.readFileSync(f, 'utf8');
  const i = s.indexOf(marker);
  if (i < 0) { console.log('SIN MARCADOR:', rel); continue; }
  const seg = s.slice(i, i + 700);
  let prefix;
  if (seg.includes('href="../servicios/')) prefix = '../';
  else if (seg.includes('href="/servicios/')) prefix = '/';
  else if (seg.includes('href="servicios/')) prefix = '';
  else { console.log('SIN PREFIJO:', rel); continue; }
  if (seg.includes('Todos los servicios')) { console.log('YA TIENE:', rel); continue; }
  const ins = marker + '<a href="' + prefix + 'servicios/">Todos los servicios</a>';
  s = s.slice(0, i) + ins + s.slice(i + marker.length);
  fs.writeFileSync(f, s, 'utf8');
  changed++;
  console.log('OK [' + prefix + ']:', rel);
}
console.log('Modificados:', changed);
