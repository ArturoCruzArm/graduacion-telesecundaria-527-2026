/**
 * evento-loader.js — Graduación Escolar
 * Carga datos de eventos_config y los aplica al DOM via data-campo
 * Foro 7 © 2026
 */
(function () {
  var SB_URL  = 'https://nzpujmlienzfetqcgsxz.supabase.co';
  var SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56cHVqbWxpZW56ZmV0cWNnc3h6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2ODYzMzYsImV4cCI6MjA5MDI2MjMzNn0.xl3lsb-KYj5tVLKTnzpbsdEGoV9ySnswH4eyRuyEH1s';
  var H = { apikey: SB_ANON, Authorization: 'Bearer ' + SB_ANON };
  var SLUG = 'graduacion-telesecundaria-527-2026';

  // [seccion, key] → selector CSS → atributo opcional
  var BINDINGS = [
    // Escuela
    { seccion: 'escuela',      key: 'nombre',           sel: '[data-campo="escuela-nombre"]' },
    { seccion: 'escuela',      key: 'contacto_nombre',  sel: '[data-campo="escuela-contacto"]' },
    // Sesión fotográfica
    { seccion: 'sesion',       key: 'fecha',            sel: '[data-campo="sesion-fecha"]' },
    { seccion: 'sesion',       key: 'hora',             sel: '[data-campo="sesion-hora"]' },
    { seccion: 'sesion',       key: 'orden_grupos',     sel: '[data-campo="sesion-orden-grupos"]' },
    // Ceremonia (misa)
    { seccion: 'ceremonia',    key: 'fecha',            sel: '[data-campo="ceremonia-fecha"]' },
    { seccion: 'ceremonia',    key: 'hora',             sel: '[data-campo="ceremonia-hora"]' },
    { seccion: 'ceremonia',    key: 'lugar',            sel: '[data-campo="ceremonia-lugar"]' },
    { seccion: 'ceremonia',    key: 'direccion',        sel: '[data-campo="ceremonia-direccion"]' },
    { seccion: 'ceremonia',    key: 'maps_url',         sel: '[data-campo="ceremonia-maps"]', attr: 'href' },
    // Recepción (fiesta)
    { seccion: 'recepcion',    key: 'hora',             sel: '[data-campo="recepcion-hora"]' },
    { seccion: 'recepcion',    key: 'hora_fin',         sel: '[data-campo="recepcion-hora_fin"]' },
    { seccion: 'recepcion',    key: 'lugar',            sel: '[data-campo="recepcion-lugar"]' },
    { seccion: 'recepcion',    key: 'direccion',        sel: '[data-campo="recepcion-direccion"]' },
    { seccion: 'recepcion',    key: 'maps_url',         sel: '[data-campo="recepcion-maps"]', attr: 'href' },
    { seccion: 'recepcion',    key: 'itinerario',       sel: '[data-campo="recepcion-itinerario"]' },
    // Invitación
    { seccion: 'invitacion_web', key: 'frase',          sel: '[data-campo="invitacion-frase"]' },
  ];

  fetch(SB_URL + '/rest/v1/eventos?slug=eq.' + encodeURIComponent(SLUG) + '&select=id&limit=1', { headers: H })
    .then(function(r) { return r.json(); })
    .then(function(arr) {
      if (!arr || !arr[0]) return;
      return fetch(SB_URL + '/rest/v1/eventos_config?evento_id=eq.' + arr[0].id + '&select=seccion,datos', { headers: H });
    })
    .then(function(r) { return r && r.json(); })
    .then(function(cfgArr) {
      if (!cfgArr) return;
      var cfg = {};
      cfgArr.forEach(function(r) { cfg[r.seccion] = r.datos || {}; });
      window.EVENTO_CONFIG = cfg;

      BINDINGS.forEach(function(b) {
        var val = cfg[b.seccion] && cfg[b.seccion][b.key];
        if (!val) return;
        document.querySelectorAll(b.sel).forEach(function(el) {
          if (b.attr) el.setAttribute(b.attr, val);
          else el.textContent = val;
        });
      });
    })
    .catch(function() {});
})();
