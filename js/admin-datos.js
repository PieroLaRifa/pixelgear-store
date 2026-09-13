/* ==========================================================================
   ADMIN-DATOS.JS
   Capa de datos del panel administrador. Como esta entrega no tiene backend,
   los mantenedores de Producto y Usuario viven en localStorage (claves
   separadas de las del carrito). Se "siembran" la primera vez con datos de
   ejemplo para que el listado no se vea vacío al abrir el admin.
   Compartido por admin.html, admin-productos.html, admin-producto-form.html,
   admin-usuarios.html y admin-usuario-form.html.
   ========================================================================== */

const CLAVE_ADMIN_PRODUCTOS = "pixelgear_admin_productos";
const CLAVE_ADMIN_USUARIOS = "pixelgear_admin_usuarios";

const CATEGORIAS_PRODUCTO = ["Teclados", "Mouse", "Audio", "Monitores", "Mobiliario"];
const TIPOS_USUARIO = ["Administrador", "Vendedor", "Cliente"];

/* -------------------- productos -------------------- */

function obtenerProductosAdmin() {
  const datos = localStorage.getItem(CLAVE_ADMIN_PRODUCTOS);
  if (datos) return JSON.parse(datos);

  // primera vez: se siembra con el catálogo público (productos.js)
  const semilla = typeof PRODUCTOS !== "undefined" ? JSON.parse(JSON.stringify(PRODUCTOS)) : [];
  localStorage.setItem(CLAVE_ADMIN_PRODUCTOS, JSON.stringify(semilla));
  return semilla;
}

function guardarProductosAdmin(lista) {
  localStorage.setItem(CLAVE_ADMIN_PRODUCTOS, JSON.stringify(lista));
}

function buscarProductoAdminPorCodigo(codigo) {
  return obtenerProductosAdmin().find((producto) => producto.id === codigo);
}

function guardarProductoAdmin(producto, codigoOriginal) {
  const lista = obtenerProductosAdmin();
  const indiceExistente = lista.findIndex((p) => p.id === (codigoOriginal || producto.id));

  if (indiceExistente >= 0) {
    lista[indiceExistente] = producto;
  } else {
    lista.push(producto);
  }
  guardarProductosAdmin(lista);
}

function eliminarProductoAdmin(codigo) {
  const lista = obtenerProductosAdmin().filter((producto) => producto.id !== codigo);
  guardarProductosAdmin(lista);
}

/* -------------------- usuarios -------------------- */

function obtenerUsuariosAdmin() {
  const datos = localStorage.getItem(CLAVE_ADMIN_USUARIOS);
  if (datos) return JSON.parse(datos);

  const semilla = [
    {
      run: "111111111",
      nombre: "Ana",
      apellidos: "Soto Pérez",
      correo: "ana.soto@duoc.cl",
      tipo: "Administrador",
      region: "0",
      comuna: "Santiago",
      direccion: "Av. Siempre Viva 123"
    },
    {
      run: "222222222",
      nombre: "Pedro",
      apellidos: "Vidal Rojas",
      correo: "pedro.vidal@gmail.com",
      tipo: "Vendedor",
      region: "1",
      comuna: "Valparaíso",
      direccion: "Calle Falsa 456"
    },
    {
      run: "333333333",
      nombre: "Camila",
      apellidos: "Muñoz Lara",
      correo: "camila.munoz@profesor.duoc.cl",
      tipo: "Cliente",
      region: "0",
      comuna: "Providencia",
      direccion: "Los Aromos 789"
    }
  ];
  localStorage.setItem(CLAVE_ADMIN_USUARIOS, JSON.stringify(semilla));
  return semilla;
}

function guardarUsuariosAdmin(lista) {
  localStorage.setItem(CLAVE_ADMIN_USUARIOS, JSON.stringify(lista));
}

function buscarUsuarioAdminPorRun(run) {
  return obtenerUsuariosAdmin().find((usuario) => usuario.run === run);
}

function guardarUsuarioAdmin(usuario, runOriginal) {
  const lista = obtenerUsuariosAdmin();
  const indiceExistente = lista.findIndex((u) => u.run === (runOriginal || usuario.run));

  if (indiceExistente >= 0) {
    lista[indiceExistente] = usuario;
  } else {
    lista.push(usuario);
  }
  guardarUsuariosAdmin(lista);
}

function eliminarUsuarioAdmin(run) {
  const lista = obtenerUsuariosAdmin().filter((usuario) => usuario.run !== run);
  guardarUsuariosAdmin(lista);
}

function buscarUsuarioAdminPorCorreo(correo) {
  return obtenerUsuariosAdmin().find(
    (usuario) => usuario.correo.toLowerCase() === correo.toLowerCase()
  );
}

/* -------------------- sesión (simulada, sin backend) --------------------
   El login no valida contraseña contra un servidor: en esta entrega
   confirmamos el correo contra el directorio de usuarios y determinamos
   el rol para decidir a dónde redirigir. La verificación real de
   credenciales llegará cuando se integre base de datos en la próxima
   evaluación. */

const CLAVE_SESION = "pixelgear_sesion";

function iniciarSesion(usuario) {
  localStorage.setItem(
    CLAVE_SESION,
    JSON.stringify({ run: usuario.run, nombre: usuario.nombre, correo: usuario.correo, tipo: usuario.tipo })
  );
}

function obtenerSesion() {
  const datos = localStorage.getItem(CLAVE_SESION);
  return datos ? JSON.parse(datos) : null;
}

function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
  window.location.href = "login.html";
}

/* Llamar al inicio de cada página del admin. Si no hay sesión con un rol
   permitido, redirige a login.html. Si hay sesión, pinta el saludo y el
   botón de cerrar sesión en el header, y oculta el link a "Usuarios" del
   menú lateral para el rol Vendedor (no debe ver ese mantenedor). */
function protegerAdmin(rolesPermitidos) {
  const sesion = obtenerSesion();
  if (!sesion || !rolesPermitidos.includes(sesion.tipo)) {
    alert("Debes iniciar sesión con un usuario autorizado para entrar aquí.");
    window.location.href = "login.html";
    return null;
  }

  const infoSesion = document.getElementById("admin-sesion-info");
  if (infoSesion) {
    infoSesion.innerHTML = `Hola, ${sesion.nombre} (${sesion.tipo}) &middot; <a href="#" id="btn-cerrar-sesion">Cerrar sesión</a>`;
    document.getElementById("btn-cerrar-sesion").addEventListener("click", function (e) {
      e.preventDefault();
      cerrarSesion();
    });
  }

  const linkUsuarios = document.getElementById("nav-admin-usuarios");
  if (linkUsuarios && sesion.tipo === "Vendedor") {
    linkUsuarios.style.display = "none";
  }

  return sesion;
}
