/* ==========================================================================
   MAIN.JS
   Lógica compartida por todas las páginas de la tienda.
   Por ahora: mantener el contador del carrito (localStorage) sincronizado
   en el header, sin importar en qué página esté el usuario.
   El detalle de "añadir/quitar producto" se implementa en productos.html /
   detalle-producto.html / carrito.html.
   ========================================================================== */

/* ==========================================================================
   MAIN.JS
   Lógica compartida por todas las páginas de la tienda:
   - Contador del carrito en el header (todas las páginas).
   - Funciones de manipulación del carrito en localStorage, usadas por
     productos.html, detalle-producto.html y carrito.html.
   Regla de negocio del carrito: no se puede agregar más unidades de un
   producto que las que indica su stock disponible.
   ========================================================================== */

const CLAVE_CARRITO = "pixelgear_carrito";

function obtenerCarrito() {
  const datos = localStorage.getItem(CLAVE_CARRITO);
  return datos ? JSON.parse(datos) : [];
}

function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  actualizarContadorCarrito();
}

function agregarAlCarrito(producto, cantidad) {
  const carrito = obtenerCarrito();
  const existente = carrito.find((item) => item.id === producto.id);
  const cantidadActual = existente ? existente.cantidad : 0;

  const limite = Math.min(5, producto.stock);

  if (cantidadActual + cantidad > limite) {
    alert("PixelGear: máximo 5 unidades por producto.");
    return cantidadActual;
  }

  const cantidadFinal = cantidadActual + cantidad;

  if (existente) {
    existente.cantidad = cantidadFinal;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: cantidadFinal
    });
  }

  guardarCarrito(carrito);
  return cantidadFinal;
}

function quitarDelCarrito(id) {
  const carrito = obtenerCarrito().filter((item) => item.id !== id);
  guardarCarrito(carrito);
}

function cambiarCantidadCarrito(id, nuevaCantidad, stockMaximo) {
  const carrito = obtenerCarrito();
  const item = carrito.find((producto) => producto.id === id);
  if (!item) return;

  if (nuevaCantidad <= 0) {
    quitarDelCarrito(id);
    return;
  }
  item.cantidad = stockMaximo ? Math.min(nuevaCantidad, stockMaximo) : nuevaCantidad;
  guardarCarrito(carrito);
}

function vaciarCarrito() {
  guardarCarrito([]);
}

function calcularTotalCarrito(carrito) {
  return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
}

function actualizarContadorCarrito() {
  const carrito = obtenerCarrito();
  const totalItems = carrito.reduce((acumulado, item) => acumulado + item.cantidad, 0);
  document.querySelectorAll("#cant-carrito").forEach((span) => {
    span.textContent = totalItems;
  });
}

document.addEventListener("DOMContentLoaded", actualizarContadorCarrito);
