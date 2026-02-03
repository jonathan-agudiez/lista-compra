import { Navigate } from "react-router-dom";
import useSesion from "../hooks/useSesion.js";

/**
 * Envoltorio mínimo para proteger rutas.
 * Si no hay sesión activa, redirige a /acceso.
 */
const RutaPrivada = ({ children }) => {
  const { user, cargando } = useSesion();

  if (cargando) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/acceso" replace />;
  }

  return children;
};

export default RutaPrivada;
