/* ==========================================================================
   ADMIN.JS
   Renderiza la tabla de mantenedor de stock a partir del arreglo PRODUCTOS.
   Identifica y aplica clases de estilo cuando un producto está en 
   stock crítico o agotado.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  const tbody = document.getElementById("tabla-admin-productos");
  
  // Verifica que exista la tabla y el arreglo PRODUCTOS de productos.js
  if (!tbody || typeof PRODUCTOS === "undefined") return;

  tbody.innerHTML = "";

  PRODUCTOS.forEach((producto) => {
    const tr = document.createElement("tr");

    let estadoTexto = "Normal";
    let estadoClase = "stock-info";

    // Evaluación de inventario basada en las propiedades del producto
    if (producto.stock === 0) {
      estadoTexto = "Agotado";
      estadoClase = "stock-info stock-info--agotado";
    } else if (producto.stock <= producto.stockCritico) {
      estadoTexto = "Stock Crítico";
      estadoClase = "stock-info stock-info--critico";
    }

    // Formateo de las celdas de la tabla usando formatoCLP
    tr.innerHTML = `
      <td>${producto.id}</td>
      <td><strong>${producto.nombre}</strong></td>
      <td>${producto.categoria}</td>
      <td>${formatoCLP(producto.precio)}</td>
      <td>${producto.stock}</td>
      <td>${producto.stockCritico}</td>
      <td><span class="${estadoClase}">${estadoTexto}</span></td>
    `;

    tbody.appendChild(tr);
  });
});