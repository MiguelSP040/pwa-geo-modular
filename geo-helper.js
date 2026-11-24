// Encapsula las API del navegador para reutilizarlas desde cualquier pantalla.
function traducirErrorGeolocalizacion(error) {
  switch (error.code) {
    case 1: return 'Permiso de ubicación denegado. Puedes habilitarlo en los ajustes del sitio de tu navegador o elegir una zona manualmente.';
    case 2: return 'No fue posible determinar tu ubicación. Elige una zona manualmente.';
    case 3: return 'Se agotó el tiempo de espera. Elige una zona manualmente o vuelve a intentar.';
    default: return 'No fue posible consultar tu ubicación. Elige una zona manualmente.';
  }
}

function obtenerUbicacionActual(opcionesPersonalizadas) {
  const opciones = Object.assign({ enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }, opcionesPersonalizadas);
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Este navegador no admite geolocalización. Elige una zona manualmente.'));
      return;
    }
    navigator.geolocation.getCurrentPosition((posicion) => {
      resolve({ latitud: posicion.coords.latitude, longitud: posicion.coords.longitude, precisionMetros: posicion.coords.accuracy, timestamp: posicion.timestamp });
    }, (error) => reject(new Error(traducirErrorGeolocalizacion(error))), opciones);
  });
}

function consultarEstadoPermisoGeo() {
  if (!navigator.permissions || !navigator.permissions.query) return Promise.resolve('prompt');
  return navigator.permissions.query({ name: 'geolocation' }).then((resultado) => resultado.state).catch(() => 'prompt');
}
