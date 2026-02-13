import { supabase } from "../supabase/supabaseClient.js";

/*
  Comunicación con Supabase para la gestión de roles.
  La idea es que si algún día migramos a otro BaaS/MySQL,
  se cambie este archivo (o su equivalente) y no el resto del proyecto.
*/
const useSupabaseRoles = () => {
  const obtenerMiRol = async (userId) => {
    const resp = await supabase
      .from("roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (resp.error) {
      // PGRST116 suele indicar que no hay fila (o hay más de una) para .single/.maybeSingle
      // En esta práctica, si no existe fila todavía, asumimos rol 'usuario' para no romper el login.
      if (resp.error.code === "PGRST116") {
        return "usuario";
      }
      throw resp.error;
    }

    if (resp.data && resp.data.role) {
      return resp.data.role;
    }
    return "usuario";
  };

  const obtenerRoles = async () => {
    const resp = await supabase
      .from("roles")
      .select("user_id, role, created_at")
      .order("created_at", { ascending: true });

    if (resp.error) throw resp.error;

    if (resp.data) {
      return resp.data;
    }
    return [];
  };

  const actualizarRol = async (userId, nuevoRol) => {
    const resp = await supabase
      .from("roles")
      .update({ role: nuevoRol })
      .eq("user_id", userId);

    if (resp.error) throw resp.error;

    return true;
  };

  return {
    obtenerMiRol,
    obtenerRoles,
    actualizarRol,
  };
};

export default useSupabaseRoles;
