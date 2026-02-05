import { Routes, Route } from "react-router-dom";

import Inicio from "../pages/Inicio.jsx";
import Acceso from "../pages/Acceso.jsx";
import Compra from "../pages/Compra.jsx";
import Error from "../pages/Error.jsx";

import RutaPrivada from "./RutaPrivada.jsx";
import ProveedorCompra from "../context/ProveedorCompra.jsx";

const Rutas = () => {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/acceso" element={<Acceso />} />

      <Route
        path="/compra"
        element={
          <RutaPrivada>
            <ProveedorCompra>
              <Compra />
            </ProveedorCompra>
          </RutaPrivada>
        }
      />

      <Route path="*" element={<Error />} />
    </Routes>
  );
};

export default Rutas;
