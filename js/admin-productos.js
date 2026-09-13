/* ==========================================================================
   ADMIN-PRODUCTOS.JS
   Renderiza la tabla de productos del admin (admin-productos.html) y conecta
   los botones de Editar / Eliminar.
   ========================================================================== */

function renderizarTablaProductosAdmin(ocultarAcciones) {
  const cuerpo = document.getElementById("cuerpo-tabla-productos");
  if (!cuerpo) return;

  const productos = obtenerProductosAdmin();

  if (productos.length === 0) {
    cuerpo.innerHTML = `<tr><td colspan="6">No hay productos registrados todavía.</td></tr>`;
    return;
  }

  cuerpo.innerHTML = productos
    .map((producto) => {
      const agotado = producto.stock === 0;
      const stockBajo = !agotado && producto.stock <= producto.stockCritico;
      let estado = `<span class="stock-info">${producto.stock} unid.</span>`;
      if (agotado) estado = `<span class="stock-info stock-info--agotado">Agotado</span>`;
      else if (stockBajo) estado = `<span class="stock-info stock-info--critico">${producto.stock} unid. (crítico)</span>`;

      const acciones = ocultarAcciones
        ? ""
        : `
          <td class="tabla-acciones">
            <a href="admin-producto-form.html?id=${encodeURIComponent(producto.id)}" class="btn btn--ghost">Editar</a>
            <button type="button" class="btn btn--danger" data-eliminar="${producto.id}">Eliminar</button>
          </td>`;

      return `
        <tr>
          <td>${producto.id}</td>
          <td>${producto.nombre}</td>
          <td>${producto.categoria}</td>
          <td>${formatoCLP(producto.precio)}</td>
          <td>${estado}</td>
          ${acciones}
        </tr>
      `;
    })
    .join("");
}

function initAdminProductos() {
  const cuerpo = document.getElementById("cuerpo-tabla-productos");
  if (!cuerpo) return;

  const sesion = protegerAdmin(["Administrador", "Vendedor"]);
  if (!sesion) return;

  // el Vendedor solo puede visualizar: sin botón "Nuevo" ni acciones de editar/eliminar
  if (sesion.tipo === "Vendedor") {
    const botonNuevo = document.getElementById("btn-nuevo-producto");
    if (botonNuevo) botonNuevo.style.display = "none";
    document.querySelectorAll("th:last-child, td:last-child").forEach((celda) => {
      if (celda.tagName === "TH") celda.style.display = "none";
    });
  }

  renderizarTablaProductosAdmin(sesion.tipo === "Vendedor");

  cuerpo.addEventListener("click", function (e) {
    const boton = e.target.closest("button[data-eliminar]");
    if (!boton) return;

    const codigo = boton.dataset.eliminar;
    const confirmado = confirm(`¿Eliminar el producto ${codigo}? Esta acción no se puede deshacer.`);
    if (confirmado) {
      eliminarProductoAdmin(codigo);
      renderizarTablaProductosAdmin(sesion.tipo === "Vendedor");
    }
  });
}

document.addEventListener("DOMContentLoaded", initAdminProductos);
