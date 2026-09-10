/* ==========================================================================
   CARRITO.JS
   Renderiza carrito.html a partir de lo guardado en localStorage y conecta
   los controles de cantidad / eliminar / vaciar. La regla de negocio
   (no superar el stock del producto) se valida contra el arreglo PRODUCTOS
   definido en productos.js.
   ========================================================================== */

function renderizarCarrito() {
  const contenedor = document.getElementById("contenedor-carrito");
  const resumen = document.getElementById("resumen-carrito");
  if (!contenedor) return;

  const carrito = obtenerCarrito();

  if (carrito.length === 0) {
    contenedor.innerHTML = `
      <div class="carrito-vacio">
        <p>Tu carrito está vacío por ahora.</p>
        <a href="productos.html" class="btn">Ver catálogo</a>
      </div>
    `;
    if (resumen) resumen.style.display = "none";
    return;
  }

  if (resumen) resumen.style.display = "flex";

  contenedor.innerHTML = "";
  carrito.forEach((item) => {
    const productoInfo = buscarProductoPorId(item.id);
    const stockMaximo = productoInfo ? productoInfo.stock : item.cantidad;

    const fila = document.createElement("div");
    fila.className = "fila-carrito";
    fila.innerHTML = `
      <div class="product-img-placeholder">${item.nombre.charAt(0)}</div>
      <div>
        <strong>${item.nombre}</strong><br>
        <span class="stock-info">${formatoCLP(item.precio)} c/u</span>
      </div>
      <div class="control-cantidad">
        <button type="button" data-accion="restar" data-id="${item.id}" aria-label="Quitar una unidad">-</button>
        <input type="number" min="1" max="${stockMaximo}" value="${item.cantidad}" data-id="${item.id}" data-input-cantidad>
        <button type="button" data-accion="sumar" data-id="${item.id}" aria-label="Agregar una unidad">+</button>
      </div>
      <div>
        <span class="price">${formatoCLP(item.precio * item.cantidad)}</span><br>
        <button type="button" class="btn btn--danger" style="padding: 0.3rem 0.8rem; font-size: 0.8rem; margin-top: 0.3rem;" data-accion="eliminar" data-id="${item.id}">Quitar</button>
      </div>
    `;
    contenedor.appendChild(fila);
  });

  const total = calcularTotalCarrito(carrito);
  const spanTotal = document.getElementById("total-carrito");
  if (spanTotal) spanTotal.textContent = formatoCLP(total);
}

function initCarrito() {
  const contenedor = document.getElementById("contenedor-carrito");
  if (!contenedor) return;

  renderizarCarrito();

  contenedor.addEventListener("click", function (e) {
    const boton = e.target.closest("button[data-accion]");
    if (!boton) return;

    const id = boton.dataset.id;
    const carrito = obtenerCarrito();
    const item = carrito.find((producto) => producto.id === id);
    if (!item) return;

    const productoInfo = buscarProductoPorId(id);
    const stockMaximo = productoInfo ? productoInfo.stock : item.cantidad;

    if (boton.dataset.accion === "sumar") {
      cambiarCantidadCarrito(id, item.cantidad + 1, stockMaximo);
    } else if (boton.dataset.accion === "restar") {
      cambiarCantidadCarrito(id, item.cantidad - 1, stockMaximo);
    } else if (boton.dataset.accion === "eliminar") {
      quitarDelCarrito(id);
    }
    renderizarCarrito();
  });

  contenedor.addEventListener("change", function (e) {
    const input = e.target.closest("input[data-input-cantidad]");
    if (!input) return;
    const id = input.dataset.id;
    const productoInfo = buscarProductoPorId(id);
    const stockMaximo = productoInfo ? productoInfo.stock : undefined;
    const nuevaCantidad = Math.max(1, parseInt(input.value, 10) || 1);
    cambiarCantidadCarrito(id, nuevaCantidad, stockMaximo);
    renderizarCarrito();
  });

  const botonVaciar = document.getElementById("btn-vaciar-carrito");
  if (botonVaciar) {
    botonVaciar.addEventListener("click", function () {
      vaciarCarrito();
      renderizarCarrito();
    });
  }

  const botonPagar = document.getElementById("btn-pagar");
  if (botonPagar) {
    botonPagar.addEventListener("click", function () {
      const carrito = obtenerCarrito();
      if (carrito.length === 0) return;
      alert("Compra simulada por " + formatoCLP(calcularTotalCarrito(carrito)) + ". ¡Gracias por tu compra!");
      vaciarCarrito();
      renderizarCarrito();
    });
  }
}

document.addEventListener("DOMContentLoaded", initCarrito);
