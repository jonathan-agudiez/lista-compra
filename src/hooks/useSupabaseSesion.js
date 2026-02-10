import { supabase } from "../supabase/supabaseClient.js";

/*
  Consultas de autenticación.
  Se centraliza la comunicación con Supabase para evitar usar supabase en los providers.
*/
const useSupabaseSesion = () => {
  const obtenerSesion = async () => {
    const respuesta = await supabase.auth.getSession();
    if (respuesta.error) throw respuesta.error;
    return respuesta.data && respuesta.data.session ? respuesta.data.session : null;
  };

  const suscribirseAuth = (callback) => {
    const respuesta = supabase.auth.onAuthStateChange(callback);
    return respuesta;
  };

  const crearCuenta = async ({ email, password, fullName }) => {
    const respuesta = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (respuesta.error) throw respuesta.error;
    return respuesta.data;
  };

  const iniciarSesion = async ({ email, password }) => {
    const respuesta = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (respuesta.error) throw respuesta.error;
    return respuesta.data;
  };

  const cerrarSesion = async () => {
    const respuesta = await supabase.auth.signOut();
    if (respuesta.error) throw respuesta.error;
    return true;
  };

  return {
    obtenerSesion,
    suscribirseAuth,
    crearCuenta,
    iniciarSesion,
    cerrarSesion,
  };
};

export default useSupabaseSesion;
