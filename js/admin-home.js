/* ==========================================================================
   ADMIN-HOME.JS
   Renderiza las tarjetas de estadísticas del home del admin (admin.html).
   ========================================================================== */

function renderizarStatsAdmin() {
  const contenedor = document.getElementById("admin-stats");
  if (!contenedor) return;

  const productos = obtenerProductosAdmin();
  const usuarios = obtenerUsuariosAdmin();
  const stockCritico = productos.filter(
    (p) => p.stock > 0 && p.stock <= p.stockCritico
  ).length;
  const agotados = productos.filter((p) => p.stock === 0).length;

  contenedor.innerHTML = `
    <div class="admin-stat-card">
      <strong>${productos.length}</strong>
      Productos totales
    </div>
    <div class="admin-stat-card">
      <strong>${usuarios.length}</strong>
      Usuarios registrados
    </div>
    <div class="admin-stat-card">
      <strong>${stockCritico}</strong>
      Con stock crítico
    </div>
    <div class="admin-stat-card">
      <strong>${agotados}</strong>
      Agotados
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", function () {
  const sesion = protegerAdmin(["Administrador", "Vendedor"]);
  if (!sesion) return;
  renderizarStatsAdmin();
});
