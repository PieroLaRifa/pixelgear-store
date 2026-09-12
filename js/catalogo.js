/* ==========================================================================
   CATALOGO.JS
   Renderiza el listado de productos (productos.html) y la vista de detalle
   (detalle-producto.html) a partir del arreglo definido en productos.js.
   El botón "Añadir al carrito" respeta el stock disponible (regla de
   negocio definida para el carrito de compras).
   ========================================================================== */

function renderizarCatalogo() {
  const contenedor = document.getElementById("contenedor-productos");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  PRODUCTOS.forEach((producto) => {
    const articulo = document.createElement("article");
    articulo.className = "card";

    const agotado = producto.stock === 0;
    const stockBajo = !agotado && producto.stock <= producto.stockCritico;

    let mensajeStock = `<span class="stock-info">Stock: ${producto.stock}</span>`;
    if (agotado) {
      mensajeStock = `<span class="stock-info stock-info--agotado">Agotado</span>`;
    } else if (stockBajo) {
      mensajeStock = `<span class="stock-info stock-info--critico">¡Últimas unidades! (${producto.stock})</span>`;
    }

    articulo.innerHTML = `
      <a href="detalle-producto.html?id=${producto.id}">
        <img class="product-img" src="${producto.imagen}" alt="${producto.nombre}">
      </a>
      <h3><a href="detalle-producto.html?id=${producto.id}">${producto.nombre}</a></h3>
      <span class="price">${formatoCLP(producto.precio)}</span>
      ${mensajeStock}
      <button class="btn btn--ghost" data-id="${producto.id}" ${agotado ? "disabled" : ""}>
        ${agotado ? "Sin stock" : "Añadir al carrito"}
      </button>
    `;

    contenedor.appendChild(articulo);
  });

  contenedor.addEventListener("click", function (e) {
    const boton = e.target.closest("button[data-id]");
    if (!boton) return;
    const producto = buscarProductoPorId(boton.dataset.id);
    if (!producto) return;

    const cantidadFinal = agregarAlCarrito(producto, 1);
    boton.textContent = "¡Agregado! (" + cantidadFinal + ")";
    setTimeout(() => {
      boton.textContent = "Añadir al carrito";
    }, 1200);
  });
}

function renderizarDetalleProducto() {
  const contenedor = document.getElementById("detalle-producto");
  if (!contenedor) return;

  const idProducto = new URLSearchParams(window.location.search).get("id");
  const producto = buscarProductoPorId(idProducto);

  if (!producto) {
    contenedor.innerHTML = `
      <p>No encontramos ese producto. <a href="productos.html" style="color: var(--gold-bright);">Vuelve al catálogo</a>.</p>
    `;
    return;
  }

  const agotado = producto.stock === 0;

  contenedor.innerHTML = `
    <img class="product-img" src="${producto.imagen}" alt="${producto.nombre}">
    <div>
      <p style="color: var(--ink-dim); margin-bottom: 0.3rem;">
        <a href="productos.html" style="color: var(--ink-dim);">Productos</a> &gt; ${producto.categoria}
      </p>
      <h1 style="margin-bottom: 0.3rem;">${producto.nombre}</h1>
      <span class="price" style="font-size: 1.6rem;">${formatoCLP(producto.precio)}</span>
      <p style="margin-top: var(--space-2);">${producto.descripcion}</p>

      ${
        agotado
          ? '<p class="stock-info stock-info--agotado">Este producto está agotado por el momento.</p>'
          : `<p class="stock-info ${producto.stock <= producto.stockCritico ? "stock-info--critico" : ""}">Stock disponible: ${producto.stock}</p>`
      }

      <div class="selector-cantidad">
        <label for="detalle-cantidad" style="margin-bottom: 0;">Cantidad</label>
        <input type="number" id="detalle-cantidad" min="1" max="${producto.stock}" value="1" ${agotado ? "disabled" : ""}>
      </div>

      <button class="btn" id="btn-agregar-detalle" ${agotado ? "disabled" : ""}>
        ${agotado ? "Sin stock" : "Añadir al carrito"}
      </button>
    </div>
  `;

  const boton = document.getElementById("btn-agregar-detalle");
  const inputCantidad = document.getElementById("detalle-cantidad");

  if (boton) {
    boton.addEventListener("click", function () {
      const cantidad = Math.max(1, parseInt(inputCantidad.value, 10) || 1);
      const cantidadFinal = agregarAlCarrito(producto, cantidad);
      boton.textContent = "¡Agregado! (" + cantidadFinal + " en el carrito)";
      setTimeout(() => {
        boton.textContent = "Añadir al carrito";
      }, 1500);
    });
  }
}

function renderizarDestacados() {
  const contenedor = document.getElementById("contenedor-destacados");
  if (!contenedor) return;

  contenedor.innerHTML = "";
  PRODUCTOS.slice(0, 4).forEach((producto) => {
    const articulo = document.createElement("article");
    articulo.className = "card";
    articulo.innerHTML = `
      <a href="detalle-producto.html?id=${producto.id}">
        <img class="product-img" src="${producto.imagen}" alt="${producto.nombre}">
      </a>
      <h3><a href="detalle-producto.html?id=${producto.id}">${producto.nombre}</a></h3>
      <span class="price">${formatoCLP(producto.precio)}</span>
    `;
    contenedor.appendChild(articulo);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  renderizarCatalogo();
  renderizarDetalleProducto();
  renderizarDestacados();
});
