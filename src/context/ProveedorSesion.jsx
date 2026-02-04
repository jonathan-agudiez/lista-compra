import { createContext, useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient.js";

export const SesionContext = createContext(null);

const ProveedorSesion = ({ children }) => {
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

        const respuesta = await supabase.auth.getSession();
        const data = respuesta.data;
        const errorSupabase = respuesta.error;

        if (errorSupabase) throw errorSupabase;

        if (activo) {
          if (data && data.session) {
            setSession(data.session);
          } else {
            setSession(null);
          }
        }
      } catch (e) {
        if (activo) {
          const msg = e && e.message ? e.message : "Error al cargar la sesión";
          setError(msg);
        }
      } finally {
        if (activo) setCargando(false);
      }
    };

    cargarSesion();

    const respuestaSub = supabase.auth.onAuthStateChange(function (_event, sesionNueva) {
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

      // Cancelar suscripción (según lo que devuelva Supabase)
      if (
        respuestaSub &&
        respuestaSub.data &&
        respuestaSub.data.subscription &&
        respuestaSub.data.subscription.unsubscribe
      ) {
        respuestaSub.data.subscription.unsubscribe();
      }
    };
  }, []);

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
    } catch (e) {
      const msg = e && e.message ? e.message : "Error en el registro";
      setError(msg);
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
    } catch (e) {
      const msg = e && e.message ? e.message : "Error al iniciar sesión";
      setError(msg);
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
    } catch (e) {
      const msg = e && e.message ? e.message : "Error al cerrar sesión";
      setError(msg);
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
