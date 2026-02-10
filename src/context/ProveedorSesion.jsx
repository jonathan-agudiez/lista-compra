import { createContext, useEffect, useState } from "react";
import useNotificacion from "../hooks/useNotificacion.js";
import useSupabaseSesion from "../hooks/useSupabaseSesion.js";

export const SesionContext = createContext(null);

const ProveedorSesion = ({ children }) => {
  const { notificar } = useNotificacion();
  const supaSesion = useSupabaseSesion();

  const [cargando, setCargando] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState("");

  // Usuario actual (si no hay sesión, es null)
  let user = null;
  if (session && session.user) {
    user = session.user;
  }

  useEffect(() => {
    let activo = true;

    const cargarSesion = async () => {
      try {
        setCargando(true);
        setError("");

        const sesionActual = await supaSesion.obtenerSesion();
        if (activo) setSession(sesionActual);
      } catch (e) {
        if (activo) {
          const msg = e && e.message ? e.message : "Error al cargar la sesión";
          setError(msg);
          notificar(msg, "error");
        }
      } finally {
        if (activo) setCargando(false);
      }
    };

    cargarSesion();

    const respuestaSub = supaSesion.suscribirseAuth(function (_event, sesionNueva) {
      if (activo) {
        if (sesionNueva) {
          setSession(sesionNueva);
        } else {
          setSession(null);
        }
      }
    });

    return () => {
      activo = false;

      if (
        respuestaSub &&
        respuestaSub.data &&
        respuestaSub.data.subscription &&
        respuestaSub.data.subscription.unsubscribe
      ) {
        respuestaSub.data.subscription.unsubscribe();
      }
    };
  }, [notificar]);

  const signUp = async ({ email, password, fullName }) => {
    try {
      setCargando(true);
      setError("");

      await supaSesion.crearCuenta({ email: email, password: password, fullName: fullName });

      notificar("Cuenta creada. Si hace falta, revisa el correo para confirmar.", "warning");
    } catch (e) {
      const msg = e && e.message ? e.message : "Error en el registro";
      setError(msg);
      notificar(msg, "error");
    } finally {
      setCargando(false);
    }
  };

  const signIn = async ({ email, password }) => {
    try {
      setCargando(true);
      setError("");

      await supaSesion.iniciarSesion({ email: email, password: password });

      notificar("Sesión iniciada correctamente.", "success");
    } catch (e) {
      const msg = e && e.message ? e.message : "Error al iniciar sesión";
      setError(msg);
      notificar(msg, "error");
    } finally {
      setCargando(false);
    }
  };

  const signOut = async () => {
    try {
      setCargando(true);
      setError("");

      await supaSesion.cerrarSesion();

      notificar("Sesión cerrada.", "warning");
    } catch (e) {
      const msg = e && e.message ? e.message : "Error al cerrar sesión";
      setError(msg);
      notificar(msg, "error");
    } finally {
      setCargando(false);
    }
  };

  const value = {
    cargando,
    session,
    user,
    error,
    signUp,
    signIn,
    signOut,
    setError,
  };

  return (
    <SesionContext.Provider value={value}>{children}</SesionContext.Provider>
  );
};

export default ProveedorSesion;
