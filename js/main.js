// Base de datos local de productos
const productos = [
    {
        id: 1,
        nombre: "Teclado Mecánico TKL Switch Red",
        categoria: "Teclados",
        precio: 45990,
        stock: 5,
        badge: "Nuevo",
        imagen: "https://via.placeholder.com/300x200/1B1712/D3A94C?text=Teclado+TKL",
        descripcion: "Switches mecánicos lineales con respuesta ultrarrápida."
    },
    {
        id: 2,
        nombre: "Mouse Ultraligero 16000 DPI",
        categoria: "Ratones",
        precio: 32000,
        stock: 12,
        badge: "Oferta",
        imagen: "https://via.placeholder.com/300x200/1B1712/D3A94C?text=Mouse+Gamer",
        descripcion: "Sensor óptico de máxima precisión y cable liviano."
    },
    {
        id: 3,
        nombre: "Audífonos Surround 7.1",
        categoria: "Audio",
        precio: 54990,
        stock: 2, // Stock crítico
        badge: "Últimas unidades",
        imagen: "https://via.placeholder.com/300x200/1B1712/D3A94C?text=Audifonos+7.1",
        descripcion: "Aislamiento acústico pasivo y micrófono omnidireccional."
    },
    {
        id: 4,
        nombre: "Monitor Curvo 144Hz 24''",
        categoria: "Monitores",
        precio: 159990,
        stock: 0,
        badge: "Agotado",
        imagen: "https://via.placeholder.com/300x200/1B1712/D3A94C?text=Monitor+144Hz",
        descripcion: "Panel VA con 1ms de tiempo de respuesta."
    }
];

// Cargar productos en la vista
document.addEventListener("DOMContentLoaded", () => {
    renderizarProductos();
    actualizarContadorCarrito();
});

function renderizarProductos() {
    const contenedor = document.getElementById("contenedor-productos");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    productos.forEach(prod => {
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("card");

        const esAgotado = prod.stock === 0;
        const claseBadge = esAgotado ? "badge--agotado" : (prod.badge === "Oferta" ? "badge--oferta" : "");

        tarjeta.innerHTML = `
            <span class="badge ${claseBadge}">${prod.badge}</span>
            <img src="${prod.imagen}" alt="${prod.nombre}">
            <h3>${prod.nombre}</h3>
            <p>${prod.descripcion}</p>
            <div class="price">$${prod.precio.toLocaleString("es-CL")}</div>
            <p><small>Stock disponible: ${prod.stock}</small></p>
            <button 
                class="btn ${esAgotado ? 'btn--ghost' : ''}" 
                onclick="agregarAlCarrito(${prod.id})"
                ${esAgotado ? 'disabled' : ''}>
                ${esAgotado ? 'Sin Stock' : 'Agregar al Carrito'}
            </button>
        `;

        contenedor.appendChild(tarjeta);
    });
}

// Lógica del Carrito usando localStorage (Rúbrica D)
function agregarAlCarrito(idProducto) {
    let carrito = JSON.parse(localStorage.getItem("carrito_pixelgear")) || [];
    const productoEncontrado = productos.find(p => p.id === idProducto);

    if (!productoEncontrado || productoEncontrado.stock === 0) return;

    const itemEnCarrito = carrito.find(item => item.id === idProducto);

    if (itemEnCarrito) {
        if (itemEnCarrito.cantidad < productoEncontrado.stock) {
            itemEnCarrito.cantidad++;
        } else {
            alert("Has alcanzado el límite de stock disponible de este producto.");
            return;
        }
    } else {
        carrito.push({
            id: productoEncontrado.id,
            nombre: productoEncontrado.nombre,
            precio: productoEncontrado.precio,
            cantidad: 1
        });
    }

    localStorage.setItem("carrito_pixelgear", JSON.stringify(carrito));
    actualizarContadorCarrito();
    alert(`¡${productoEncontrado.nombre} agregado al carrito!`);
}

function actualizarContadorCarrito() {
    const contador = document.getElementById("cant-carrito");
    if (!contador) return;

    const carrito = JSON.parse(localStorage.getItem("carrito_pixelgear")) || [];
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    
    contador.textContent = totalItems;
}