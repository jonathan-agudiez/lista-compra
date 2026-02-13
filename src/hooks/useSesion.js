import { useContext } from "react";
import { SesionContext } from "../context/ProveedorSesion.jsx";

/*
  Hook personalizado para acceder fácilmente al contexto de sesión.
*/
const useSesion = () => {
  const contexto = useContext(SesionContext);

  // Si se usa fuera del Provider, se lanza un error
  if (contexto === null) {
    throw new Error("Este hook debe usarse dentro de ProveedorSesion");
  }

  return contexto;
};

export default useSesion;
