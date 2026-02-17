import { supabase } from "../supabase/supabaseClient.js";

const useSupabaseRoles = () => {
  const obtenerMiRol = async (userId) => {
    const resp = await supabase
      .from("roles")
      .select("rol")
      .eq("id_rol", userId)
      .maybeSingle();

    if (resp.error) throw resp.error;

    return resp.data && resp.data.rol ? resp.data.rol : "usuario";
  };

  const obtenerTodosLosRoles = async () => {
  const respRoles = await supabase
    .from("roles")
    .select("id_rol, rol, correo, created_at")
    .order("created_at", { ascending: true });

  if (respRoles.error) throw respRoles.error;

  const roles = respRoles.data ? respRoles.data : [];

  const respProfiles = await supabase
    .from("profiles")
    .select("user_id, full_name");

  // si falla por lo que sea, devolvemos roles sin nombre
  if (respProfiles.error) {
    return roles.map((r) => ({
      user_id: r.id_rol,
      role: r.rol,
      email: r.correo || "",
      created_at: r.created_at,
      full_name: "",
    }));
  }

  const profiles = respProfiles.data ? respProfiles.data : [];

  const resultado = roles.map((r) => {
    let nombre = "";

    for (let i = 0; i < profiles.length; i++) {
      if (profiles[i].user_id === r.id_rol) {
        nombre = profiles[i].full_name ? profiles[i].full_name : "";
        break;
      }
    }

    return {
      user_id: r.id_rol,
      role: r.rol,
      email: r.correo || "",
      created_at: r.created_at,
      full_name: nombre,
    };
  });

  return resultado;
};

  const actualizarRol = async (userId, nuevoRol) => {
    const resp = await supabase
      .from("roles")
      .update({ rol: nuevoRol })
      .eq("id_rol", userId);

    if (resp.error) throw resp.error;

    return true;
  };

  return { obtenerMiRol, obtenerTodosLosRoles, actualizarRol };
};

export default useSupabaseRoles;
