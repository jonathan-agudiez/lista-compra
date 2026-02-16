import { supabase } from "../supabase/supabaseClient.js";

const useSupabasePerfil = () => {
  const obtenerPerfil = async (userId) => {
    const resp = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (resp.error) throw resp.error;

    return resp.data ? resp.data : null;
  };

  const actualizarPerfil = async (userId, datos) => {
    const resp = await supabase
      .from("profiles")
      .update({
        full_name: datos.full_name,
        avatar_url: datos.avatar_url,
        description: datos.description,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (resp.error) throw resp.error;

    return true;
  };

  return { obtenerPerfil, actualizarPerfil };
};

export default useSupabasePerfil;
