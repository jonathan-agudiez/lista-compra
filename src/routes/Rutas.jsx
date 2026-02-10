import { Routes, Route, Navigate } from "react-router-dom";

import useSesion from "../hooks/useSesion.js";

import Inicio from "../pages/Inicio.jsx";
import Acceso from "../pages/Acceso.jsx";
import Compra from "../pages/Compra.jsx";
import ProductosAdmin from "../pages/ProductosAdmin.jsx";
import Error from "../pages/Error.jsx";

import ProveedorCompra from "../context/ProveedorCompra.jsx";
import ProveedorProductos from "../context/ProveedorProductos.jsx";

const Rutas = () => {
  const { user, cargando } = useSesion();

  // Se espera a comprobar la sesión
  if (cargando) {
    return null;
  }

  let vistaCompra = <Navigate to="/acceso" replace />;
  let vistaProductos = <Navigate to="/acceso" replace />;

  if (user) {
    vistaCompra = (
      <ProveedorCompra>
        <ProveedorProductos>
          <Compra />
        </ProveedorProductos>
      </ProveedorCompra>
    );

    vistaProductos = (
      <ProveedorProductos>
        <ProductosAdmin />
      </ProveedorProductos>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/acceso" element={<Acceso />} />

      <Route path="/compra" element={vistaCompra} />
      <Route path="/productos" element={vistaProductos} />

      <Route path="*" element={<Error />} />
    </Routes>
  );
};

export default Rutas;
