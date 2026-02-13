
import { supabase } from "../supabase/supabaseClient.js";

const useSupabaseRoles = () => {

  const obtenerMiRol = async (userId) => {
    const resp = await supabase
      .from("roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (resp.error) throw resp.error;

    return resp.data && resp.data.role ? resp.data.role : "usuario";
  };

  /*
    IMPORTANTE:
    No se puede hacer join directo a auth.users desde PostgREST de forma sencilla.
    Para mostrar display_name/email, usamos una tabla PUBLIC "user_info"
    (user_id, email, display_name) mantenida por trigger o rellenada por SQL.
  */
  const obtenerTodosLosRoles = async () => {
    const respRoles = await supabase
      .from("roles")
      .select("user_id, role, created_at")
      .order("created_at", { ascending: true });

    if (respRoles.error) throw respRoles.error;

    const listaRoles = respRoles.data ? respRoles.data : [];

    // Intentamos obtener información de usuario (si existe la tabla user_info)
    const respInfo = await supabase
      .from("user_info")
      .select("user_id, email, display_name");

    // Si falla porque la tabla aún no existe o por permisos, devolvemos roles sin info
    if (respInfo.error) {
      return listaRoles.map((r) => ({
        ...r,
        email: "",
        display_name: "",
      }));
    }

    const listaInfo = respInfo.data ? respInfo.data : [];

    // Mezcla simple (2DAW) por user_id
    const resultado = listaRoles.map((r) => {
      let info = null;
      for (let i = 0; i < listaInfo.length; i++) {
        if (listaInfo[i].user_id === r.user_id) {
          info = listaInfo[i];
          break;
        }
      }

      return {
        ...r,
        email: info && info.email ? info.email : "",
        display_name: info && info.display_name ? info.display_name : "",
      };
    });

    return resultado;
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
    obtenerTodosLosRoles,
    actualizarRol,
  };
};

export default useSupabaseRoles;
