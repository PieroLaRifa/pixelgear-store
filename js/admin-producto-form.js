/* ==========================================================================
   ADMIN-PRODUCTO-FORM.JS
   Formulario compartido de "Nuevo producto" y "Editar producto".
   Reglas de negocio definidas en las instrucciones oficiales:
   - Código: requerido, texto, mínimo 3 caracteres, sin máximo.
   - Nombre: requerido, máximo 100.
   - Descripción: opcional, máximo 500.
   - Precio: requerido, mínimo 0 (permite productos FREE), decimales OK.
   - Stock: requerido, mínimo 0, solo enteros.
   - Stock crítico: opcional, mínimo 0, solo enteros.
   - Categoría: requerida (select).
   - Imagen: opcional.
   Si la URL trae ?id=CODIGO, el formulario se precarga en modo edición.
   ========================================================================== */

function poblarCategorias() {
  const select = document.getElementById("producto-categoria");
  if (!select) return;
  select.innerHTML = '<option value="">-- Selecciona una categoría --</option>';
  CATEGORIAS_PRODUCTO.forEach((categoria) => {
    const opcion = document.createElement("option");
    opcion.value = categoria;
    opcion.textContent = categoria;
    select.appendChild(opcion);
  });
}

function initAdminProductoForm() {
  const form = document.getElementById("form-producto");
  if (!form) return;

  const sesion = protegerAdmin(["Administrador"]);
  if (!sesion) return;

  poblarCategorias();

  const idParam = new URLSearchParams(window.location.search).get("id");
  const esEdicion = Boolean(idParam);

  const titulo = document.getElementById("titulo-form-producto");
  const codigo = document.getElementById("producto-codigo");
  const nombre = document.getElementById("producto-nombre");
  const descripcion = document.getElementById("producto-descripcion");
  const precio = document.getElementById("producto-precio");
  const stock = document.getElementById("producto-stock");
  const stockCritico = document.getElementById("producto-stock-critico");
  const categoria = document.getElementById("producto-categoria");
  const imagen = document.getElementById("producto-imagen");

  const err = {
    codigo: document.getElementById("error-producto-codigo"),
    nombre: document.getElementById("error-producto-nombre"),
    descripcion: document.getElementById("error-producto-descripcion"),
    precio: document.getElementById("error-producto-precio"),
    stock: document.getElementById("error-producto-stock"),
    stockCritico: document.getElementById("error-producto-stock-critico"),
    categoria: document.getElementById("error-producto-categoria")
  };

  if (esEdicion) {
    const productoExistente = buscarProductoAdminPorCodigo(idParam);
    if (productoExistente) {
      titulo.textContent = "Editar producto";
      codigo.value = productoExistente.id;
      codigo.disabled = true; // el código no se edita, identifica al producto
      nombre.value = productoExistente.nombre;
      descripcion.value = productoExistente.descripcion || "";
      precio.value = productoExistente.precio;
      stock.value = productoExistente.stock;
      stockCritico.value = productoExistente.stockCritico || "";
      categoria.value = productoExistente.categoria;
      imagen.value = productoExistente.imagen || "";
    }
  }

  function validarCodigo() {
    if (esEdicion) return true; // deshabilitado, no se valida
    const valor = codigo.value.trim();
    if (valor === "") {
      mostrarError(codigo, err.codigo, "El código es obligatorio.");
      return false;
    }
    if (valor.length < 3) {
      mostrarError(codigo, err.codigo, "Mínimo 3 caracteres.");
      return false;
    }
    if (buscarProductoAdminPorCodigo(valor)) {
      mostrarError(codigo, err.codigo, "Ya existe un producto con ese código.");
      return false;
    }
    limpiarError(codigo, err.codigo);
    return true;
  }

  function validarNombre() {
    const valor = nombre.value.trim();
    if (valor === "") {
      mostrarError(nombre, err.nombre, "El nombre es obligatorio.");
      return false;
    }
    if (valor.length > 100) {
      mostrarError(nombre, err.nombre, "Máximo 100 caracteres.");
      return false;
    }
    limpiarError(nombre, err.nombre);
    return true;
  }

  function validarDescripcion() {
    if (descripcion.value.trim().length > 500) {
      mostrarError(descripcion, err.descripcion, "Máximo 500 caracteres.");
      return false;
    }
    limpiarError(descripcion, err.descripcion);
    return true;
  }

  function validarPrecio() {
    const valor = parseFloat(precio.value);
    if (precio.value === "" || isNaN(valor)) {
      mostrarError(precio, err.precio, "El precio es obligatorio.");
      return false;
    }
    if (valor < 0) {
      mostrarError(precio, err.precio, "El precio no puede ser negativo (mínimo 0, para productos gratis).");
      return false;
    }
    limpiarError(precio, err.precio);
    return true;
  }

  function validarStock() {
    const valor = stock.value;
    if (valor === "") {
      mostrarError(stock, err.stock, "El stock es obligatorio.");
      return false;
    }
    if (!/^\d+$/.test(valor)) {
      mostrarError(stock, err.stock, "Solo números enteros, mínimo 0.");
      return false;
    }
    limpiarError(stock, err.stock);
    return true;
  }

  function validarStockCritico() {
    const valor = stockCritico.value;
    if (valor === "") {
      limpiarError(stockCritico, err.stockCritico);
      return true; // es opcional
    }
    if (!/^\d+$/.test(valor)) {
      mostrarError(stockCritico, err.stockCritico, "Solo números enteros, mínimo 0.");
      return false;
    }
    limpiarError(stockCritico, err.stockCritico);
    return true;
  }

  function validarCategoria() {
    if (categoria.value === "") {
      mostrarError(categoria, err.categoria, "Selecciona una categoría.");
      return false;
    }
    limpiarError(categoria, err.categoria);
    return true;
  }

  codigo.addEventListener("input", validarCodigo);
  nombre.addEventListener("input", validarNombre);
  descripcion.addEventListener("input", validarDescripcion);
  precio.addEventListener("input", validarPrecio);
  stock.addEventListener("input", validarStock);
  stockCritico.addEventListener("input", validarStockCritico);
  categoria.addEventListener("change", validarCategoria);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const resultados = [
      validarCodigo(),
      validarNombre(),
      validarDescripcion(),
      validarPrecio(),
      validarStock(),
      validarStockCritico(),
      validarCategoria()
    ];

    if (resultados.every(Boolean)) {
      const productoGuardado = {
        id: esEdicion ? idParam : codigo.value.trim(),
        nombre: nombre.value.trim(),
        descripcion: descripcion.value.trim(),
        precio: parseFloat(precio.value),
        stock: parseInt(stock.value, 10),
        stockCritico: stockCritico.value === "" ? 0 : parseInt(stockCritico.value, 10),
        categoria: categoria.value,
        imagen: imagen.value.trim() || "img/productos/default.jpg"
      };
      guardarProductoAdmin(productoGuardado, esEdicion ? idParam : null);
      window.location.href = "admin-productos.html";
    }
  });
}

document.addEventListener("DOMContentLoaded", initAdminProductoForm);
