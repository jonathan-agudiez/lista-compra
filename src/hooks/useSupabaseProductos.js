import { supabase } from "../supabase/supabaseClient.js";

/*
  Consultas de productos.
  Se centraliza la comunicación con Supabase para evitar usar supabase en los providers.
*/
const useSupabaseProductos = () => {
  const obtenerProductos = async () => {
    const resp = await supabase
      .from("products")
      .select("id, name, weight, price, image_url, description")
      .order("name", { ascending: true });

    if (resp.error) throw resp.error;
    return resp.data ? resp.data : [];
  };

  const crearProducto = async (nuevo) => {
    const resp = await supabase.from("products").insert(nuevo);
    if (resp.error) throw resp.error;
    return true;
  };

  const actualizarProducto = async (id, cambios) => {
    const resp = await supabase.from("products").update(cambios).eq("id", id);
    if (resp.error) throw resp.error;
    return true;
  };

  const borrarProducto = async (id) => {
    const resp = await supabase.from("products").delete().eq("id", id);
    if (resp.error) throw resp.error;
    return true;
  };

  return {
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    borrarProducto,
  };
};

export default useSupabaseProductos;
