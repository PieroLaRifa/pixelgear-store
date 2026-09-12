/* ==========================================================================
   PRODUCTOS.JS
   Arreglo de productos en memoria (requerido por la pauta: "Listar productos
   mediante JavaScript. Crear un arreglo de productos. Mostrar los productos
   del arreglo"). En esta entrega no hay backend, así que el catálogo vive
   directamente aquí. Se reutiliza en productos.html y detalle-producto.html.
   ========================================================================== */

const PRODUCTOS = [
  {
    id: "TEC-001",
    nombre: "Teclado Mecánico Ashen",
    categoria: "Teclados",
    precio: 49990,
    stock: 12,
    stockCritico: 3,
    imagen: "img/productos/teclado-ashen.jpg",
    descripcion: "Switches mecánicos rojos, retroiluminación ámbar y estructura en aluminio cepillado. Pensado para sesiones largas sin fatiga."
  },
  {
    id: "MOU-002",
    nombre: "Mouse Ember Precision",
    categoria: "Mouse",
    precio: 29990,
    stock: 20,
    stockCritico: 5,
    imagen: "img/productos/mouse-ember.jpg",
    descripcion: "Sensor óptico de 16.000 DPI, 6 botones programables y peso ajustable para un agarre preciso en cada partida."
  },
  {
    id: "AUD-003",
    nombre: "Audífonos Bastión 7.1",
    categoria: "Audio",
    precio: 39990,
    stock: 8,
    stockCritico: 2,
    imagen: "img/productos/audifonos-bastion.jpg",
    descripcion: "Sonido envolvente 7.1, micrófono retráctil con cancelación de ruido y almohadillas de espuma viscoelástica."
  },
  {
    id: "MON-004",
    nombre: "Monitor Sigil 27\" 165Hz",
    categoria: "Monitores",
    precio: 189990,
    stock: 5,
    stockCritico: 2,
    imagen: "img/productos/monitor-sigil.jpg",
    descripcion: "Panel IPS de 27 pulgadas, 165Hz y 1ms de respuesta. Colores fieles para diseño y velocidad para competitivo."
  },
  {
    id: "TEC-005",
    nombre: "Teclado TKL Wraith",
    categoria: "Teclados",
    precio: 34990,
    stock: 0,
    stockCritico: 3,
    imagen: "img/productos/teclado-wraith.jpg",
    descripcion: "Formato compacto sin teclado numérico, switches táctiles silenciosos e iluminación por zona."
  },
  {
    id: "MOU-006",
    nombre: "Mouse Ligero Specter",
    categoria: "Mouse",
    precio: 24990,
    stock: 15,
    stockCritico: 4,
    imagen: "img/productos/mouse-specter.jpg",
    descripcion: "Carcasa perforada de 62 gramos, cable paracord flexible y switches ópticos de 80 millones de clics."
  },
  {
    id: "SIL-007",
    nombre: "Silla Gamer Throne",
    categoria: "Mobiliario",
    precio: 149990,
    stock: 4,
    stockCritico: 1,
    imagen: "img/productos/silla-throne.jpg",
    descripcion: "Respaldo reclinable 160°, apoyabrazos 4D y cojines lumbares incluidos. Soporta hasta 120 kg."
  },
  {
    id: "MIC-008",
    nombre: "Micrófono Herald USB",
    categoria: "Audio",
    precio: 44990,
    stock: 9,
    stockCritico: 3,
    imagen: "img/productos/microfono-herald.jpg",
    descripcion: "Cápsula condensadora de tres patrones polares, ideal para streaming y grabación de voz limpia."
  }
];

function formatoCLP(valor) {
  return "$" + valor.toLocaleString("es-CL");
}

function buscarProductoPorId(id) {
  return PRODUCTOS.find((producto) => producto.id === id);
}
