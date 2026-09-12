/* ==========================================================================
   VALIDADORES-COMUNES.JS
   Funciones puras de validación reutilizadas por más de un formulario
   (registro público y mantenedor de usuarios del admin). Debe cargarse
   ANTES que validaciones.js o cualquier script de admin que las use.
   ========================================================================== */

const DOMINIOS_PERMITIDOS = ["duoc.cl", "profesor.duoc.cl", "gmail.com"];

function mostrarError(input, spanError, mensaje) {
  input.classList.add("input-error");
  input.classList.remove("field-ok");
  if (spanError) spanError.textContent = mensaje;
}

function limpiarError(input, spanError) {
  input.classList.remove("input-error");
  input.classList.add("field-ok");
  if (spanError) spanError.textContent = "";
}

function correoTieneDominioValido(correo) {
  const partes = correo.split("@");
  if (partes.length !== 2) return false;
  const dominio = partes[1].toLowerCase();
  return DOMINIOS_PERMITIDOS.includes(dominio);
}

/* Algoritmo estándar de validación de RUN chileno (módulo 11) */
function calcularDigitoVerificador(cuerpo) {
  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }
  const resto = 11 - (suma % 11);
  if (resto === 11) return "0";
  if (resto === 10) return "K";
  return String(resto);
}

function validarRun(runOriginal) {
  const run = runOriginal.toUpperCase().replace(/[.\-\s]/g, "");
  if (!/^[0-9]+[0-9K]$/.test(run)) return false;
  if (run.length < 7 || run.length > 9) return false;
  const cuerpo = run.slice(0, -1);
  const dv = run.slice(-1);
  return calcularDigitoVerificador(cuerpo) === dv;
}
