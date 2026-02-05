import { useContext } from "react";
import { CompraContext } from "../context/ProveedorCompra.jsx";

const useCompra = () => {
  const ctx = useContext(CompraContext);

  if (!ctx) {
    throw new Error("useCompra debe usarse dentro de ProveedorCompra");
  }

  return ctx;
};

export default useCompra;
