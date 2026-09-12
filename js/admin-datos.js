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
