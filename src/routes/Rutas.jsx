import { Routes, Route, Navigate } from "react-router-dom";

import useSesion from "../hooks/useSesion.js";
import useRoles from "../hooks/useRoles.js";

import Inicio from "../pages/Inicio.jsx";
import Acceso from "../pages/Acceso.jsx";
import Compra from "../pages/Compra.jsx";
import ProductosAdmin from "../pages/ProductosAdmin.jsx";
import RolesAdmin from "../pages/RolesAdmin.jsx";
import Perfil from "../pages/Perfil.jsx";
import Error from "../pages/Error.jsx";

import ProveedorCompra from "../context/ProveedorCompra.jsx";
import ProveedorProductos from "../context/ProveedorProductos.jsx";

const Rutas = () => {
  const { user, cargando } = useSesion();
  const { esAdmin, cargandoRol } = useRoles();

  // Se espera a comprobar la sesión
  if (cargando) {
    return null;
  }

  // Si hay usuario, esperamos a conocer su rol (para rutas admin)
  if (user && cargandoRol) {
    return null;
  }

  let vistaCompra = <Navigate to="/acceso" replace />;
  let vistaProductos = <Navigate to="/acceso" replace />;
  let vistaRoles = <Navigate to="/acceso" replace />;

  if (user) {
    vistaCompra = (
      <ProveedorCompra>
        <ProveedorProductos>
          <Compra />
        </ProveedorProductos>
      </ProveedorCompra>
    );

    // Productos solo para admin (experiencia de usuario)
    if (esAdmin) {
      vistaProductos = (
        <ProveedorProductos>
          <ProductosAdmin />
        </ProveedorProductos>
      );

      vistaRoles = <RolesAdmin />;
    } else {
      vistaProductos = <Navigate to="/compra" replace />;
      vistaRoles = <Navigate to="/compra" replace />;
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/acceso" element={<Acceso />} />

      <Route path="/compra" element={vistaCompra} />
      <Route path="/productos" element={vistaProductos} />
      <Route path="/roles" element={vistaRoles} />
      <Route path="/perfil" element={<Perfil />} />

      <Route path="*" element={<Error />} />
    </Routes>
  );
};

export default Rutas;
