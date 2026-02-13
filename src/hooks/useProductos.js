import { useContext } from "react";
import { ProductosContext } from "../context/ProveedorProductos.jsx";

/*
  Hook para usar el contexto de productos.
*/
const useProductos = () => {
  const contexto = useContext(ProductosContext);

  if (contexto === null) {
    throw new Error("useProductos debe usarse dentro de ProveedorProductos");
  }

  return contexto;
};

export default useProductos;
