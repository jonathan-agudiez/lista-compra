import { Navigate } from "react-router-dom";
import useSesion from "../hooks/useSesion.js";

function RutaPrivada({ children }) {
  const { sesionIniciada } = useSesion();
  if (!sesionIniciada) return <Navigate to="/" replace />;
  return children;
}

export default RutaPrivada;
