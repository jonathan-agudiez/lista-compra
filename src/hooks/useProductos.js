import { useContext } from "react";
import { ProductosContext } from "../context/ProveedorProductos.jsx";

function useProductos() {
  const ctx = useContext(ProductosContext);
  if (!ctx) {
    throw new Error("useProductos debe usarse dentro de <ProveedorProductos>.");
  }
  return ctx;
}

export { useProductos };
