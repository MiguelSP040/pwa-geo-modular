const adjuntar = document.getElementById('adjuntar');
const prepermiso = document.getElementById('prepermiso');
const aviso = document.getElementById('aviso');
const formularioZona = document.getElementById('formulario-zona');
const zona = document.getElementById('zona');
const zonaPersonalizada = document.getElementById('zona-personalizada');

function mostrarManual(mensaje) {
  prepermiso.hidden = true;
  formularioZona.hidden = false;
  document.getElementById('mostrar-manual').hidden = true;
  if (mensaje) aviso.textContent = mensaje;
}

function leerUbicacion(promesa) {
  aviso.textContent = 'Consultando tu ubicación…';
  adjuntar.disabled = true;
  prepermiso.hidden = true;
  promesa.then((ubicacion) => {
    document.getElementById('vacio').hidden = true;
    document.getElementById('resultado-manual').hidden = true;
    document.getElementById('resultado').hidden = false;
    document.getElementById('calidad').textContent = ubicacion.precisionMetros < 30 ? 'Precisión GPS alta' : 'Ubicación aproximada (Wi-Fi / IP)';
    document.getElementById('latitud').textContent = ubicacion.latitud.toFixed(6);
    document.getElementById('longitud').textContent = ubicacion.longitud.toFixed(6);
    document.getElementById('precision').textContent = '± ' + Math.round(ubicacion.precisionMetros) + ' m';
    document.getElementById('fecha').textContent = new Date(ubicacion.timestamp).toLocaleString('es-MX');
    aviso.textContent = 'Ubicación obtenida correctamente.';
  }).catch((error) => mostrarManual(error.message)).then(() => { adjuntar.disabled = false; });
}

adjuntar.addEventListener('click', () => {
  aviso.textContent = '';
  consultarEstadoPermisoGeo().then((estado) => {
    if (estado === 'denied') mostrarManual('El permiso está bloqueado. Actívalo en los ajustes del sitio de tu navegador o elige una zona manualmente.');
    else if (estado === 'granted') leerUbicacion(obtenerUbicacionActual());
    else prepermiso.hidden = false;
  });
});
document.getElementById('confirmar').addEventListener('click', () => leerUbicacion(obtenerUbicacionActual()));
document.getElementById('cancelar').addEventListener('click', () => mostrarManual('Puedes seleccionar tu zona sin compartir coordenadas.'));
document.getElementById('mostrar-manual').addEventListener('click', () => mostrarManual(''));
zona.addEventListener('change', () => {
  const otra = zona.value === 'otra';
  document.getElementById('otra-zona').hidden = !otra;
  zonaPersonalizada.required = otra;
});
formularioZona.addEventListener('submit', (event) => {
  event.preventDefault();
  const elegida = zona.value === 'otra' ? zonaPersonalizada.value.trim() : zona.value;
  if (!elegida) { aviso.textContent = 'Escribe tu zona o ciudad.'; return; }
  document.getElementById('zona-elegida').textContent = elegida;
  document.getElementById('vacio').hidden = true;
  document.getElementById('resultado').hidden = true;
  document.getElementById('resultado-manual').hidden = false;
  aviso.textContent = 'Zona seleccionada correctamente.';
});
function actualizarConexion() { document.getElementById('conexion').textContent = navigator.onLine ? 'En línea' : 'Sin conexión'; }
window.addEventListener('online', actualizarConexion);
window.addEventListener('offline', actualizarConexion);
actualizarConexion();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => { aviso.textContent = 'No se pudo activar el modo sin conexión. Usa localhost o HTTPS.'; });
