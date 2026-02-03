import { createContext, useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient.js";

export const SesionContext = createContext(null);

const ProveedorSesion = ({ children }) => {
  const [cargando, setCargando] = useState(true);
  const [session, setSession] = useState(null);
  const [error, setError] = useState("");

  const user = session?.user ?? null;

  useEffect(() => {
    let activo = true;

    const cargarSesion = async () => {
      try {
        setCargando(true);
        setError("");

        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (activo) setSession(data.session ?? null);
      } catch (e) {
        if (activo) setError(e?.message ?? "Error al cargar la sesión");
      } finally {
        if (activo) setCargando(false);
      }
    };

    cargarSesion();

    const { data: suscripcion } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (activo) setSession(session ?? null);
      }
    );

    return () => {
      activo = false;
      suscripcion?.subscription?.unsubscribe();
    };
  }, []);

  const signUp = async ({ email, password, fullName }) => {
    try {
      setCargando(true);
      setError("");

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;
    } catch (e) {
      setError(e?.message ?? "Error en el registro");
    } finally {
      setCargando(false);
    }
  };

  const signIn = async ({ email, password }) => {
    try {
      setCargando(true);
      setError("");

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (e) {
      setError(e?.message ?? "Error al iniciar sesión");
    } finally {
      setCargando(false);
    }
  };

  const signOut = async () => {
    try {
      setCargando(true);
      setError("");

      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (e) {
      setError(e?.message ?? "Error al cerrar sesión");
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
