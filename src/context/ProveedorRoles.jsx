import { createContext, useEffect, useState } from "react";

import useNotificacion from "../hooks/useNotificacion.js";
import useSesion from "../hooks/useSesion.js";
import useSupabaseRoles from "../hooks/useSupabaseRoles.js";

export const RolesContext = createContext(null);

/*
  Proveedor de Roles:
  - Carga el rol del usuario logueado.
  - Permite listar roles (solo admin) y modificarlos (solo admin).
*/
const ProveedorRoles = ({ children }) => {
  const { notificar } = useNotificacion();
  const { user } = useSesion();
  const supaRoles = useSupabaseRoles();

  const [cargandoRol, setCargandoRol] = useState(false);
  const [miRol, setMiRol] = useState("usuario");

  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");

  const esAdmin = miRol === "admin";

  useEffect(() => {
    let activo = true;

    const cargarRol = async () => {
      try {
        setCargandoRol(true);
        setError("");

        if (!user) {
          if (activo) setMiRol("usuario");
          return;
        }

        const rol = await supaRoles.obtenerMiRol(user.id);
        if (activo) setMiRol(rol);
      } catch (e) {
        const msg = e && e.message ? e.message : "Error al cargar el rol";
        if (activo) {
          setError(msg);
          setMiRol("usuario");
        }
        // Si falta la fila de roles (usuario antiguo creado antes del trigger), no mostramos error.
        if (msg && msg.toLowerCase().includes("single json")) {
          // silencio
        } else {
          notificar(msg, "error");
        }
      } finally {
        if (activo) setCargandoRol(false);
      }
    };

    cargarRol();

    return () => {
      activo = false;
    };
  }, [user, notificar]);

  const cargarRoles = async () => {
    try {
      setError("");

      if (!esAdmin) {
        notificar("No autorizado.", "error");
        return false;
      }

      const lista = await supaRoles.obtenerTodosLosRoles();
      setRoles(lista);
      return true;
    } catch (e) {
      const msg = e && e.message ? e.message : "Error al cargar roles";
      setError(msg);
      notificar(msg, "error");
      return false;
    }
  };

  const cambiarRol = async (userId, nuevoRol) => {
    try {
      setError("");

      if (!esAdmin) {
        notificar("No autorizado.", "error");
        return false;
      }

      if (nuevoRol !== "usuario" && nuevoRol !== "admin") {
        notificar("Rol no válido.", "error");
        return false;
      }

      await supaRoles.actualizarRol(userId, nuevoRol);

      // Actualización simple en memoria
      const copia = roles.map((r) => {
        if (r.user_id === userId) {
          return { ...r, role: nuevoRol };
        }
        return r;
      });

      setRoles(copia);
      notificar("Rol actualizado.", "success");
      return true;
    } catch (e) {
      const msg = e && e.message ? e.message : "Error al actualizar rol";
      setError(msg);
      notificar(msg, "error");
      return false;
    }
  };

  const value = {
    cargandoRol,
    miRol,
    esAdmin,
    roles,
    error,
    cargarRoles,
    cambiarRol,
    setError,
  };

  return <RolesContext.Provider value={value}>{children}</RolesContext.Provider>;
};

export default ProveedorRoles;
