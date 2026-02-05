import { Routes, Route } from "react-router-dom";

import Inicio from "../pages/Inicio.jsx";
import Acceso from "../pages/Acceso.jsx";
import Compra from "../pages/Compra.jsx";
import ProductosAdmin from "../pages/ProductosAdmin.jsx";
import Error from "../pages/Error.jsx";

import ProveedorCompra from "../context/ProveedorCompra.jsx";
import ProveedorProductos from "../context/ProveedorProductos.jsx";

const Rutas = () => {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/acceso" element={<Acceso />} />

      <Route
        path="/compra"
        element={
          <ProveedorCompra>
            <ProveedorProductos>
              <Compra />
            </ProveedorProductos>
          </ProveedorCompra>
        }
      />

      <Route
        path="/productos"
        element={
          <ProveedorProductos>
            <ProductosAdmin />
          </ProveedorProductos>
        }
      />

      <Route path="*" element={<Error />} />
    </Routes>
  );
};

export default Rutas;
