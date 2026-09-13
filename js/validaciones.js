/* ==========================================================================
   VALIDACIONES.JS
   Reglas de negocio definidas en el documento de instrucciones de la EV1:
   - Correo: solo dominios @duoc.cl, @profesor.duoc.cl y @gmail.com
   - Contraseña: 4 a 10 caracteres
   - RUN: sin puntos ni guion, dígito verificador correcto, 7 a 9 caracteres
   Cada formulario valida en tiempo real (evento "input"/"blur") y también
   al enviar, mostrando mensajes de error personalizados por campo.

   Requiere que js/validadores-comunes.js esté cargado antes que este script
   (define mostrarError, limpiarError, correoTieneDominioValido, validarRun).
   ========================================================================== */

/* -------------------- LOGIN (login.html) -------------------- */

function initLogin() {
  const form = document.getElementById("form-login");
  if (!form) return;

  const correo = document.getElementById("login-correo");
  const clave = document.getElementById("login-clave");
  const errCorreo = document.getElementById("error-login-correo");
  const errClave = document.getElementById("error-login-clave");

  function validarCorreoLogin() {
    const valor = correo.value.trim();
    if (valor === "") {
      mostrarError(correo, errCorreo, "El correo es obligatorio.");
      return false;
    }
    if (valor.length > 100) {
      mostrarError(correo, errCorreo, "Máximo 100 caracteres.");
      return false;
    }
    if (!correoTieneDominioValido(valor)) {
      mostrarError(correo, errCorreo, "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.");
      return false;
    }
    limpiarError(correo, errCorreo);
    return true;
  }

  function validarClaveLogin() {
    const valor = clave.value;
    if (valor === "") {
      mostrarError(clave, errClave, "La contraseña es obligatoria.");
      return false;
    }
    if (valor.length < 4 || valor.length > 10) {
      mostrarError(clave, errClave, "Debe tener entre 4 y 10 caracteres.");
      return false;
    }
    limpiarError(clave, errClave);
    return true;
  }

  correo.addEventListener("input", validarCorreoLogin);
  clave.addEventListener("input", validarClaveLogin);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const ok1 = validarCorreoLogin();
    const ok2 = validarClaveLogin();
    if (ok1 && ok2) {
      const usuarioEncontrado = typeof buscarUsuarioAdminPorCorreo === "function"
        ? buscarUsuarioAdminPorCorreo(correo.value.trim())
        : null;

      if (usuarioEncontrado) {
        iniciarSesion(usuarioEncontrado);
        if (usuarioEncontrado.tipo === "Administrador" || usuarioEncontrado.tipo === "Vendedor") {
          window.location.href = "admin.html";
        } else {
          alert(`¡Bienvenido, ${usuarioEncontrado.nombre}!`);
          window.location.href = "index.html";
        }
      } else {
        alert("No encontramos una cuenta con ese correo. ¿Ya te registraste?");
      }
    }
  });
}

/* -------------------- CONTACTO (contacto.html) -------------------- */

function initContacto() {
  const form = document.getElementById("form-contacto");
  if (!form) return;

  const nombre = document.getElementById("contacto-nombre");
  const correo = document.getElementById("contacto-correo");
  const mensaje = document.getElementById("contacto-mensaje");
  const errNombre = document.getElementById("error-contacto-nombre");
  const errCorreo = document.getElementById("error-contacto-correo");
  const errMensaje = document.getElementById("error-contacto-mensaje");

  function validarNombre() {
    const valor = nombre.value.trim();
    if (valor === "") {
      mostrarError(nombre, errNombre, "El nombre es obligatorio.");
      return false;
    }
    if (valor.length > 100) {
      mostrarError(nombre, errNombre, "Máximo 100 caracteres.");
      return false;
    }
    limpiarError(nombre, errNombre);
    return true;
  }

  function validarCorreoContacto() {
    const valor = correo.value.trim();
    // el correo es opcional en este formulario, pero si se escribe algo,
    // debe cumplir el formato y dominio permitido.
    if (valor === "") {
      limpiarError(correo, errCorreo);
      return true;
    }
    if (valor.length > 100) {
      mostrarError(correo, errCorreo, "Máximo 100 caracteres.");
      return false;
    }
    if (!correoTieneDominioValido(valor)) {
      mostrarError(correo, errCorreo, "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.");
      return false;
    }
    limpiarError(correo, errCorreo);
    return true;
  }

  function validarMensaje() {
    const valor = mensaje.value.trim();
    if (valor === "") {
      mostrarError(mensaje, errMensaje, "Cuéntanos en qué te ayudamos.");
      return false;
    }
    if (valor.length > 500) {
      mostrarError(mensaje, errMensaje, "Máximo 500 caracteres.");
      return false;
    }
    limpiarError(mensaje, errMensaje);
    return true;
  }

  nombre.addEventListener("input", validarNombre);
  correo.addEventListener("input", validarCorreoContacto);
  mensaje.addEventListener("input", validarMensaje);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const ok1 = validarNombre();
    const ok2 = validarCorreoContacto();
    const ok3 = validarMensaje();
    if (ok1 && ok2 && ok3) {
      alert("Mensaje enviado. ¡Gracias por escribirnos!");
      form.reset();
      [nombre, correo, mensaje].forEach((el) => el.classList.remove("field-ok"));
    }
  });
}

/* -------------------- REGISTRO (registro.html) -------------------- */

function poblarRegiones() {
  const selectRegion = document.getElementById("registro-region");
  const selectComuna = document.getElementById("registro-comuna");
  if (!selectRegion || !selectComuna || typeof REGIONES === "undefined") return;

  selectRegion.innerHTML = '<option value="">-- Selecciona la región --</option>';
  REGIONES.forEach((region, indice) => {
    const opcion = document.createElement("option");
    opcion.value = indice;
    opcion.textContent = region.nombre;
    selectRegion.appendChild(opcion);
  });

  function actualizarComunas() {
    selectComuna.innerHTML = '<option value="">-- Selecciona la comuna --</option>';
    if (selectRegion.value === "") {
      selectComuna.disabled = true;
      return;
    }
    const region = REGIONES[selectRegion.value];
    region.comunas.forEach((comuna) => {
      const opcion = document.createElement("option");
      opcion.value = comuna;
      opcion.textContent = comuna;
      selectComuna.appendChild(opcion);
    });
    selectComuna.disabled = false;
  }

  selectRegion.addEventListener("change", actualizarComunas);
  actualizarComunas();
}

function initRegistro() {
  const form = document.getElementById("form-registro");
  if (!form) return;

  poblarRegiones();

  const run = document.getElementById("registro-run");
  const nombre = document.getElementById("registro-nombre");
  const apellidos = document.getElementById("registro-apellidos");
  const correo = document.getElementById("registro-correo");
  const clave = document.getElementById("registro-clave");
  const claveConfirmar = document.getElementById("registro-clave-confirmar");
  const region = document.getElementById("registro-region");
  const comuna = document.getElementById("registro-comuna");
  const direccion = document.getElementById("registro-direccion");

  const err = {
    run: document.getElementById("error-registro-run"),
    nombre: document.getElementById("error-registro-nombre"),
    apellidos: document.getElementById("error-registro-apellidos"),
    correo: document.getElementById("error-registro-correo"),
    clave: document.getElementById("error-registro-clave"),
    claveConfirmar: document.getElementById("error-registro-clave-confirmar"),
    region: document.getElementById("error-registro-region"),
    comuna: document.getElementById("error-registro-comuna"),
    direccion: document.getElementById("error-registro-direccion")
  };

  function validarRunCampo() {
    const valor = run.value.trim();
    if (valor === "") {
      mostrarError(run, err.run, "El RUN es obligatorio.");
      return false;
    }
    if (valor.length < 7 || valor.length > 9) {
      mostrarError(run, err.run, "Debe tener entre 7 y 9 caracteres, sin puntos ni guion.");
      return false;
    }
    if (!validarRun(valor)) {
      mostrarError(run, err.run, "El RUN ingresado no es válido.");
      return false;
    }
    limpiarError(run, err.run);
    return true;
  }

  function validarNombreCampo() {
    const valor = nombre.value.trim();
    if (valor === "") {
      mostrarError(nombre, err.nombre, "El nombre es obligatorio.");
      return false;
    }
    if (valor.length > 50) {
      mostrarError(nombre, err.nombre, "Máximo 50 caracteres.");
      return false;
    }
    limpiarError(nombre, err.nombre);
    return true;
  }

  function validarApellidosCampo() {
    const valor = apellidos.value.trim();
    if (valor === "") {
      mostrarError(apellidos, err.apellidos, "Los apellidos son obligatorios.");
      return false;
    }
    if (valor.length > 100) {
      mostrarError(apellidos, err.apellidos, "Máximo 100 caracteres.");
      return false;
    }
    limpiarError(apellidos, err.apellidos);
    return true;
  }

  function validarCorreoRegistro() {
    const valor = correo.value.trim();
    if (valor === "") {
      mostrarError(correo, err.correo, "El correo es obligatorio.");
      return false;
    }
    if (valor.length > 100) {
      mostrarError(correo, err.correo, "Máximo 100 caracteres.");
      return false;
    }
    if (!correoTieneDominioValido(valor)) {
      mostrarError(correo, err.correo, "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.");
      return false;
    }
    limpiarError(correo, err.correo);
    return true;
  }

  function validarClaveRegistro() {
    const valor = clave.value;
    if (valor === "") {
      mostrarError(clave, err.clave, "La contraseña es obligatoria.");
      return false;
    }
    if (valor.length < 4 || valor.length > 10) {
      mostrarError(clave, err.clave, "Debe tener entre 4 y 10 caracteres.");
      return false;
    }
    limpiarError(clave, err.clave);
    return true;
  }

  function validarClaveConfirmarRegistro() {
    if (claveConfirmar.value === "") {
      mostrarError(claveConfirmar, err.claveConfirmar, "Confirma tu contraseña.");
      return false;
    }
    if (claveConfirmar.value !== clave.value) {
      mostrarError(claveConfirmar, err.claveConfirmar, "Las contraseñas no coinciden.");
      return false;
    }
    limpiarError(claveConfirmar, err.claveConfirmar);
    return true;
  }

  function validarRegionCampo() {
    if (region.value === "") {
      mostrarError(region, err.region, "Selecciona una región.");
      return false;
    }
    limpiarError(region, err.region);
    return true;
  }

  function validarComunaCampo() {
    if (comuna.value === "") {
      mostrarError(comuna, err.comuna, "Selecciona una comuna.");
      return false;
    }
    limpiarError(comuna, err.comuna);
    return true;
  }

  function validarDireccionCampo() {
    const valor = direccion.value.trim();
    if (valor === "") {
      mostrarError(direccion, err.direccion, "La dirección es obligatoria.");
      return false;
    }
    if (valor.length > 300) {
      mostrarError(direccion, err.direccion, "Máximo 300 caracteres.");
      return false;
    }
    limpiarError(direccion, err.direccion);
    return true;
  }

  run.addEventListener("input", validarRunCampo);
  nombre.addEventListener("input", validarNombreCampo);
  apellidos.addEventListener("input", validarApellidosCampo);
  correo.addEventListener("input", validarCorreoRegistro);
  clave.addEventListener("input", validarClaveRegistro);
  claveConfirmar.addEventListener("input", validarClaveConfirmarRegistro);
  region.addEventListener("change", validarRegionCampo);
  comuna.addEventListener("change", validarComunaCampo);
  direccion.addEventListener("input", validarDireccionCampo);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const resultados = [
      validarRunCampo(),
      validarNombreCampo(),
      validarApellidosCampo(),
      validarCorreoRegistro(),
      validarClaveRegistro(),
      validarClaveConfirmarRegistro(),
      validarRegionCampo(),
      validarComunaCampo(),
      validarDireccionCampo()
    ];
    if (resultados.every(Boolean)) {
      if (typeof guardarUsuarioAdmin === "function") {
        guardarUsuarioAdmin({
          run: run.value.trim(),
          tipo: "Cliente",
          nombre: nombre.value.trim(),
          apellidos: apellidos.value.trim(),
          correo: correo.value.trim(),
          region: region.value,
          comuna: comuna.value,
          direccion: direccion.value.trim()
        });
      }
      alert("¡Registro exitoso! Ya puedes iniciar sesión.");
      window.location.href = "login.html";
    }
  });
}

/* -------------------- inicio -------------------- */

document.addEventListener("DOMContentLoaded", function () {
  initLogin();
  initContacto();
  initRegistro();
});
