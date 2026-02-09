import { useContext } from "react";
import { SesionContext } from "../context/ProveedorSesion.jsx";

function useSesion() {
  const ctx = useContext(SesionContext);
  if (!ctx) {
    throw new Error("useSesion debe usarse dentro de <ProveedorSesion>.");
  }
  return ctx;
}

export { useSesion };
