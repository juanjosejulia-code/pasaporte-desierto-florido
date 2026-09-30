// Guarda el pasaporte en el teléfono para usarlo sin señal.
const CACHE = 'pasaporte-df-505b5692a5';
const ASSETS = ["./", "./index.html", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/favicon.svg", "./fotos/algarrobilla.jpg", "./fotos/anuanca-amarilla.jpg", "./fotos/anuanca-roja.jpg", "./fotos/azulillo.jpg", "./fotos/borlon-de-alforja.jpg", "./fotos/buenas-noches.jpg", "./fotos/carbonillo.jpg", "./fotos/cebollin.jpg", "./fotos/celestina.jpg", "./fotos/chinita.jpg", "./fotos/churqui.jpg", "./fotos/conanthera.jpg", "./fotos/copao.jpg", "./fotos/copiapoa-de-carrizal.jpg", "./fotos/coronilla-del-fraile.jpg", "./fotos/cristaria-calderana.jpg", "./fotos/cuerno-de-cabra.jpg", "./fotos/don-diego-de-la-noche.jpg", "./fotos/fenomeno.jpg", "./fotos/garra-de-leon.jpg", "./fotos/huilli.jpg", "./fotos/lagrima-de-la-virgen.jpg", "./fotos/lirio-amarillo.jpg", "./fotos/lirio-de-duna.jpg", "./fotos/lirio-del-campo.jpg", "./fotos/lirio-lila.jpg", "./fotos/malvilla.jpg", "./fotos/mariposita-blanca.jpg", "./fotos/oreja-de-zorro.jpg", "./fotos/ortiga-blanca.jpg", "./fotos/pacul.jpg", "./fotos/palo-negro.jpg", "./fotos/panorama.jpg", "./fotos/pata-de-guanaco.jpg", "./fotos/portada.jpg", "./fotos/quintral-del-quisco.jpg", "./fotos/retamo.jpg", "./fotos/rosita-de-campo.jpg", "./fotos/rosita.jpg", "./fotos/suspiro-blanco.jpg", "./fotos/suspiro.jpg", "./fotos/terciopelo.jpg", "./fotos/tupa.jpg", "./fotos/violeta-de-campo.jpg"];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((ks) => Promise.all(ks.filter((k) => k.startsWith('pasaporte-df-') && k !== CACHE && k !== CACHE + '-fuentes').map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    if (req.mode === 'navigate') {
      e.respondWith(fetch(req).then((r) => {
        const copia = r.clone();
        caches.open(CACHE).then((c) => c.put('./index.html', copia));
        return r;
      }).catch(() => caches.match('./index.html')));
      return;
    }
    e.respondWith(caches.match(req, { ignoreSearch: true }).then((r) => r || fetch(req)));
  } else if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(CACHE + '-fuentes').then((c) => c.match(req).then((hit) => {
      const red = fetch(req).then((r) => { c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || red;
    })));
  }
});
