import { useContext } from "react";
import { CompraContext } from "../context/ProveedorCompra.jsx";

/*
  Hook personalizado para acceder al contexto de compra.
*/
const useCompra = () => {
  const contexto = useContext(CompraContext);

  // Si no está dentro del Provider, se muestra un error
  if (contexto === null) {
    throw new Error("Este hook debe usarse dentro de ProveedorCompra");
  }

  return contexto;
};

export default useCompra;
