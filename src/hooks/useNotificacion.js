import { useContext } from "react";
import { contextoNotificacion } from "../context/ProveedorNotificacion.jsx";

function useNotificacion() {
  const ctx = useContext(contextoNotificacion);
  if (!ctx) {
    throw new Error("useNotificacion debe usarse dentro de <ProveedorNotificacion>.");
  }
  return ctx;
}

export { useNotificacion };
