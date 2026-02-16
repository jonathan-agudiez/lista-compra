import { createContext, useState } from "react";
import useSesion from "../hooks/useSesion.js";
import useSupabasePerfil from "../hooks/useSupabasePerfil.js";
import useNotificacion from "../hooks/useNotificacion.js";

export const PerfilContext = createContext(null);

const ProveedorPerfil = ({ children }) => {
  const { user } = useSesion();
  const supaPerfil = useSupabasePerfil();
  const { notificar } = useNotificacion();

  const [perfil, setPerfil] = useState(null);
  const [cargandoPerfil, setCargandoPerfil] = useState(false);

  const cargarPerfil = async () => {
    try {
      if (!user) return false;

      setCargandoPerfil(true);

      const data = await supaPerfil.obtenerPerfil(user.id);
      setPerfil(data);

      return true;
    } catch (e) {
      notificar("Error al cargar perfil", "error");
      return false;
    } finally {
      setCargandoPerfil(false);
    }
  };

  const guardarPerfil = async (datos) => {
    try {
      if (!user) return false;

      await supaPerfil.actualizarPerfil(user.id, datos);

      setPerfil({ ...perfil, ...datos });

      notificar("Perfil actualizado", "success");
      return true;
    } catch (e) {
      notificar("Error al guardar perfil", "error");
      return false;
    }
  };

  return (
    <PerfilContext.Provider
      value={{ perfil, cargandoPerfil, cargarPerfil, guardarPerfil }}
    >
      {children}
    </PerfilContext.Provider>
  );
};

export default ProveedorPerfil;
