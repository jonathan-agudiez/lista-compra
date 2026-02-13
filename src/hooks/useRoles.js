import { useContext } from "react";
import { RolesContext } from "../context/ProveedorRoles.jsx";

/*
  Hook personalizado para acceder al contexto de roles.
*/
const useRoles = () => {
  const contexto = useContext(RolesContext);

  if (contexto === null) {
    throw new Error("Este hook debe usarse dentro de ProveedorRoles");
  }

  return contexto;
};

export default useRoles;
