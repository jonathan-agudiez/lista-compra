import { useContext } from "react";
import { CompraContext } from "../context/ProveedorCompra.jsx";

function useCompra() {
  const ctx = useContext(CompraContext);
  if (!ctx) {
    throw new Error("useCompra debe usarse dentro de <ProveedorCompra>.");
  }
  return ctx;
}

export { useCompra };
