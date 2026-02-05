import { supabase } from "../supabase/supabaseClient.js";

export default function useSupabase() {
  const crearCuentaSupa = async (datosSesion) => {
    const { email, password, name } = datosSesion;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) throw error;
    return data;
  };

  const iniciarSesionSupa = async (datosSesion) => {
    const { email, password } = datosSesion;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) throw error;
    return data;
  };

  const obtenerUsuarioSupa = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  };

  const cerrarSesionSupa = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  };

  const suscripcion = (callback) => {
    const { data } = supabase.auth.onAuthStateChange(callback);
    return data.subscription;
  };

  return {
    crearCuentaSupa,
    iniciarSesionSupa,
    obtenerUsuarioSupa,
    cerrarSesionSupa,
    suscripcion,
  };
}
