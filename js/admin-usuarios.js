/* ==========================================================================
   ADMIN-USUARIOS.JS
   Renderiza la tabla de usuarios del admin (admin-usuarios.html) y conecta
   los botones de Editar / Eliminar.
   ========================================================================== */

function renderizarTablaUsuariosAdmin() {
  const cuerpo = document.getElementById("cuerpo-tabla-usuarios");
  if (!cuerpo) return;

  const usuarios = obtenerUsuariosAdmin();

  if (usuarios.length === 0) {
    cuerpo.innerHTML = `<tr><td colspan="5">No hay usuarios registrados todavía.</td></tr>`;
    return;
  }

  const claseRol = {
    Administrador: "rol-tag--administrador",
    Vendedor: "rol-tag--vendedor",
    Cliente: "rol-tag--cliente"
  };

  cuerpo.innerHTML = usuarios
    .map((usuario) => {
      return `
        <tr>
          <td>${usuario.run}</td>
          <td>${usuario.nombre} ${usuario.apellidos}</td>
          <td>${usuario.correo}</td>
          <td><span class="rol-tag ${claseRol[usuario.tipo] || ""}">${usuario.tipo}</span></td>
          <td class="tabla-acciones">
            <a href="admin-usuario-form.html?id=${encodeURIComponent(usuario.run)}" class="btn btn--ghost">Editar</a>
            <button type="button" class="btn btn--danger" data-eliminar="${usuario.run}">Eliminar</button>
          </td>
        </tr>
      `;
    })
    .join("");
}

function initAdminUsuarios() {
  const cuerpo = document.getElementById("cuerpo-tabla-usuarios");
  if (!cuerpo) return;

  const sesion = protegerAdmin(["Administrador"]);
  if (!sesion) return;

  renderizarTablaUsuariosAdmin();

  cuerpo.addEventListener("click", function (e) {
    const boton = e.target.closest("button[data-eliminar]");
    if (!boton) return;

    const run = boton.dataset.eliminar;
    const confirmado = confirm(`¿Eliminar el usuario con RUN ${run}? Esta acción no se puede deshacer.`);
    if (confirmado) {
      eliminarUsuarioAdmin(run);
      renderizarTablaUsuariosAdmin();
    }
  });
}

document.addEventListener("DOMContentLoaded", initAdminUsuarios);
