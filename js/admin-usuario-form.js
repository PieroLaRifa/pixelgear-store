/* ==========================================================================
   ADMIN-USUARIO-FORM.JS
   Formulario compartido de "Nuevo usuario" y "Editar usuario" del admin.
   Mismas reglas que el registro público (RUN, nombre, apellidos, correo,
   región/comuna, dirección) más el campo "Tipo de usuario", que la pauta
   indica que solo se implementa en la vista administrativa.
   Requiere: js/regiones.js, js/validadores-comunes.js, js/admin-datos.js
   cargados antes que este script.
   ========================================================================== */

function poblarTiposUsuario() {
  const select = document.getElementById("usuario-tipo");
  if (!select) return;
  select.innerHTML = '<option value="">-- Selecciona un tipo --</option>';
  TIPOS_USUARIO.forEach((tipo) => {
    const opcion = document.createElement("option");
    opcion.value = tipo;
    opcion.textContent = tipo;
    select.appendChild(opcion);
  });
}

function poblarRegionesAdmin() {
  const selectRegion = document.getElementById("usuario-region");
  const selectComuna = document.getElementById("usuario-comuna");
  if (!selectRegion || !selectComuna || typeof REGIONES === "undefined") return;

  selectRegion.innerHTML = '<option value="">-- Selecciona la región --</option>';
  REGIONES.forEach((region, indice) => {
    const opcion = document.createElement("option");
    opcion.value = indice;
    opcion.textContent = region.nombre;
    selectRegion.appendChild(opcion);
  });

  function actualizarComunas(comunaPreseleccionada) {
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
      if (comuna === comunaPreseleccionada) opcion.selected = true;
      selectComuna.appendChild(opcion);
    });
    selectComuna.disabled = false;
  }

  selectRegion.addEventListener("change", () => actualizarComunas());
  // se expone para poder precargar la comuna correcta al editar
  selectRegion.dataset.actualizarComunas = "listo";
  poblarRegionesAdmin.actualizarComunas = actualizarComunas;
}

function initAdminUsuarioForm() {
  const form = document.getElementById("form-usuario-admin");
  if (!form) return;

  const sesion = protegerAdmin(["Administrador"]);
  if (!sesion) return;

  poblarTiposUsuario();
  poblarRegionesAdmin();

  const idParam = new URLSearchParams(window.location.search).get("id");
  const esEdicion = Boolean(idParam);

  const titulo = document.getElementById("titulo-form-usuario");
  const run = document.getElementById("usuario-run");
  const tipo = document.getElementById("usuario-tipo");
  const nombre = document.getElementById("usuario-nombre");
  const apellidos = document.getElementById("usuario-apellidos");
  const correo = document.getElementById("usuario-correo");
  const fechaNacimiento = document.getElementById("usuario-fecha-nacimiento");
  const region = document.getElementById("usuario-region");
  const comuna = document.getElementById("usuario-comuna");
  const direccion = document.getElementById("usuario-direccion");

  const err = {
    run: document.getElementById("error-usuario-run"),
    tipo: document.getElementById("error-usuario-tipo"),
    nombre: document.getElementById("error-usuario-nombre"),
    apellidos: document.getElementById("error-usuario-apellidos"),
    correo: document.getElementById("error-usuario-correo"),
    region: document.getElementById("error-usuario-region"),
    comuna: document.getElementById("error-usuario-comuna"),
    direccion: document.getElementById("error-usuario-direccion")
  };

  if (esEdicion) {
    const usuarioExistente = buscarUsuarioAdminPorRun(idParam);
    if (usuarioExistente) {
      titulo.textContent = "Editar usuario";
      run.value = usuarioExistente.run;
      run.disabled = true; // el RUN identifica al usuario, no se edita
      tipo.value = usuarioExistente.tipo;
      nombre.value = usuarioExistente.nombre;
      apellidos.value = usuarioExistente.apellidos;
      correo.value = usuarioExistente.correo;
      fechaNacimiento.value = usuarioExistente.fechaNacimiento || "";
      region.value = usuarioExistente.region;
      if (poblarRegionesAdmin.actualizarComunas) {
        poblarRegionesAdmin.actualizarComunas(usuarioExistente.comuna);
      }
      direccion.value = usuarioExistente.direccion;
    }
  }

  function validarRunCampo() {
    if (esEdicion) return true;
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
    if (buscarUsuarioAdminPorRun(valor)) {
      mostrarError(run, err.run, "Ya existe un usuario con ese RUN.");
      return false;
    }
    limpiarError(run, err.run);
    return true;
  }

  function validarTipoCampo() {
    if (tipo.value === "") {
      mostrarError(tipo, err.tipo, "Selecciona un tipo de usuario.");
      return false;
    }
    limpiarError(tipo, err.tipo);
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

  function validarCorreoCampo() {
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
  tipo.addEventListener("change", validarTipoCampo);
  nombre.addEventListener("input", validarNombreCampo);
  apellidos.addEventListener("input", validarApellidosCampo);
  correo.addEventListener("input", validarCorreoCampo);
  region.addEventListener("change", validarRegionCampo);
  comuna.addEventListener("change", validarComunaCampo);
  direccion.addEventListener("input", validarDireccionCampo);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const resultados = [
      validarRunCampo(),
      validarTipoCampo(),
      validarNombreCampo(),
      validarApellidosCampo(),
      validarCorreoCampo(),
      validarRegionCampo(),
      validarComunaCampo(),
      validarDireccionCampo()
    ];

    if (resultados.every(Boolean)) {
      const usuarioGuardado = {
        run: esEdicion ? idParam : run.value.trim(),
        tipo: tipo.value,
        nombre: nombre.value.trim(),
        apellidos: apellidos.value.trim(),
        correo: correo.value.trim(),
        fechaNacimiento: fechaNacimiento.value || "",
        region: region.value,
        comuna: comuna.value,
        direccion: direccion.value.trim()
      };
      guardarUsuarioAdmin(usuarioGuardado, esEdicion ? idParam : null);
      window.location.href = "admin-usuarios.html";
    }
  });
}

document.addEventListener("DOMContentLoaded", initAdminUsuarioForm);
