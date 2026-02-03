"use strict";

const convertirEuros = (cantidad) => {
   return cantidad.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
}

const convertirPeso = (cantidad) => {
  return Number(cantidad).toLocaleString("es-ES");
};

export {convertirEuros, convertirPeso};