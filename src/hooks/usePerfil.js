import { useContext } from "react";
import { PerfilContext } from "../context/ProveedorPerfil.jsx";

const usePerfil = () => {
  const ctx = useContext(PerfilContext);
  if (ctx === null) throw new Error("usePerfil fuera de ProveedorPerfil");
  return ctx;
};

export default usePerfil;
