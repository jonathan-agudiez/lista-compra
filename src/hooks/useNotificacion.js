import { useContext } from "react";
import { NotificacionContext } from "../context/NotificacionContext.jsx";

export default function useNotificacion() {
  const ctx = useContext(NotificacionContext);
  if (!ctx) throw new Error("useNotificacion debe usarse dentro de <ProveedorNotificacion>.");
  return ctx;
}
