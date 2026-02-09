import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient.js";
import { useNotificacion } from "../hooks/useNotificacion.js";

const SesionContext = createContext(null);

/*
  Contexto de sesión:
  - carga la sesión al arrancar
  - escucha cambios de autenticación
  - notifica errores por toast
*/
function ProveedorSesion({ children }) {
  const { notificar } = useNotificacion();
  const navegar = useNavigate();

  const [cargando, setCargando] = useState(true);
  const [session, setSession] = useState(null);
  const [sesionIniciada, setSesionIniciada] = useState(false);
  const [error, setError] = useState("");

  let user = null;
  if (session) {
    if (session.user) {
      user = session.user;
    }
  }

  useEffect(() => {
    let activo = true;

    const cargarSesion = async () => {
      try {
        setCargando(true);
        setError("");

        const respuesta = await supabase.auth.getSession();
        const data = respuesta.data;
        const errorSupabase = respuesta.error;

        if (errorSupabase) throw errorSupabase;

        if (activo) {
          if (data && data.session) {
            setSession(data.session);
            setSesionIniciada(true);
          } else {
            setSession(null);
            setSesionIniciada(false);
          }
        }
      } catch (e) {
        if (activo) {
          let msg = "Error al cargar la sesión";
          if (e) {
            if (e.message) msg = e.message;
          }
          setError(msg);
          notificar(msg, "error");
        }
      } finally {
        if (activo) setCargando(false);
      }
    };

    cargarSesion();

    const respuestaSub = supabase.auth.onAuthStateChange(function (event, sesionNueva) {
      if (!activo) return;

      if (sesionNueva) {
        setSession(sesionNueva);
        setSesionIniciada(true);

        // Al iniciar sesión se vuelve a inicio.
        if (event === "SIGNED_IN") {
          navegar("/");
        }
      } else {
        setSession(null);
        setSesionIniciada(false);

        // Al cerrar sesión se vuelve al acceso.
        if (event === "SIGNED_OUT") {
          navegar("/acceso");
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
  }, [notificar, navegar]);

  const signUp = async ({ email, password, fullName }) => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      const errorSupabase = respuesta.error;
      if (errorSupabase) throw errorSupabase;

      notificar("Cuenta creada. Si hace falta, revisar el correo para confirmar.", "warning");
    } catch (e) {
      let msg = "Error en el registro";
      if (e) {
        if (e.message) msg = e.message;
      }
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

      const respuesta = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      const errorSupabase = respuesta.error;
      if (errorSupabase) throw errorSupabase;

      notificar("Sesión iniciada correctamente.", "success");
    } catch (e) {
      let msg = "Error al iniciar sesión";
      if (e) {
        if (e.message) msg = e.message;
      }
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

      const respuesta = await supabase.auth.signOut();
      const errorSupabase = respuesta.error;

      if (errorSupabase) throw errorSupabase;

      notificar("Sesión cerrada.", "warning");
    } catch (e) {
      let msg = "Error al cerrar sesión";
      if (e) {
        if (e.message) msg = e.message;
      }
      setError(msg);
      notificar(msg, "error");
    } finally {
      setCargando(false);
    }
  };

  const value = {
    cargando,
    session,
    sesionIniciada,
    user,
    error,
    setError,
    signUp,
    signIn,
    signOut,
  };

  return <SesionContext.Provider value={value}>{children}</SesionContext.Provider>;
}

export { SesionContext, ProveedorSesion };
