/* ==========================================================================
   REGIONES.JS
   Arreglo complementario con regiones y comunas de Chile (subset representativo,
   suficiente para demostrar el select dependiente región -> comuna que pide
   la pauta). Usado por registro.html a través de validaciones.js.
   ========================================================================== */

const REGIONES = [
  {
    nombre: "Región Metropolitana de Santiago",
    comunas: ["Santiago", "Providencia", "Las Condes", "Ñuñoa", "Maipú", "Puente Alto"]
  },
  {
    nombre: "Región de Valparaíso",
    comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "San Antonio"]
  },
  {
    nombre: "Región del Biobío",
    comunas: ["Concepción", "Talcahuano", "Los Ángeles", "Chillán"]
  },
  {
    nombre: "Región de la Araucanía",
    comunas: ["Temuco", "Villarrica", "Angol"]
  },
  {
    nombre: "Región de Ñuble",
    comunas: ["Chillán", "San Carlos", "Bulnes"]
  },
  {
    nombre: "Región del Maule",
    comunas: ["Talca", "Curicó", "Linares", "Longaví"]
  }
];
