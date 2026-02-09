import { Routes, Route, Navigate } from "react-router-dom";

import { useSesion } from "../hooks/useSesion.js";

import Inicio from "../pages/Inicio.jsx";
import Acceso from "../pages/Acceso.jsx";
import Compra from "../pages/Compra.jsx";
import ProductosAdmin from "../pages/ProductosAdmin.jsx";
import Error from "../pages/Error.jsx";

const Rutas = () => {
  const { sesionIniciada, cargando } = useSesion();

  // Se evita cargar rutas privadas mientras se obtiene la sesión.
  if (cargando) {
    return null;
  }

  let rutaCompra = <Navigate to="/acceso" replace />;
  let rutaProductos = <Navigate to="/acceso" replace />;

  if (sesionIniciada) {
    rutaCompra = <Compra />;
    rutaProductos = <ProductosAdmin />;
  }

  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/acceso" element={<Acceso />} />

      <Route path="/compra" element={rutaCompra} />

      <Route path="/productos" element={rutaProductos} />

      <Route path="*" element={<Error />} />
    </Routes>
  );
};

export { Rutas };
