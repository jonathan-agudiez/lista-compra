import { supabase } from "../supabase/supabaseClient.js";

/*
  Consultas de listas de la compra.
  Se centraliza la comunicación con Supabase para no tocar la lógica del provider si cambia la BD.
*/
const useSupabaseCompra = () => {
  const obtenerListas = async (ownerId) => {
    const respuesta = await supabase
      .from("shopping_lists")
      .select("id, name, owner_id, created_at")
      .eq("owner_id", ownerId)
      .order("created_at", { ascending: false });

    if (respuesta.error) throw respuesta.error;
    return respuesta.data ? respuesta.data : [];
  };

  const crearLista = async (name, ownerId) => {
    const respuesta = await supabase
      .from("shopping_lists")
      .insert({ name: name, owner_id: ownerId })
      .select("id, name, owner_id, created_at")
      .single();

    if (respuesta.error) throw respuesta.error;
    return respuesta.data ? respuesta.data : null;
  };

  const borrarLista = async (listId) => {
    const respuesta = await supabase.from("shopping_lists").delete().eq("id", listId);
    if (respuesta.error) throw respuesta.error;
    return true;
  };

  const obtenerCatalogo = async () => {
    const respuesta = await supabase
      .from("products")
      .select("id, name, weight, price, image_url, description")
      .order("name", { ascending: true });

    if (respuesta.error) throw respuesta.error;
    return respuesta.data ? respuesta.data : [];
  };

  const obtenerItems = async (listId) => {
    const respuesta = await supabase
      .from("shopping_list_items")
      .select(
        `
          list_id,
          product_id,
          quantity,
          products:products (
            id,
            name,
            weight,
            price,
            image_url,
            description
          )
        `
      )
      .eq("list_id", listId);

    if (respuesta.error) throw respuesta.error;
    return respuesta.data ? respuesta.data : [];
  };

  const obtenerItemPorProducto = async (listId, productId) => {
    const respuesta = await supabase
      .from("shopping_list_items")
      .select("list_id, product_id, quantity")
      .eq("list_id", listId)
      .eq("product_id", productId)
      .maybeSingle();

    if (respuesta.error) throw respuesta.error;
    return respuesta.data ? respuesta.data : null;
  };

  const insertarItem = async (listId, productId, quantity) => {
    const respuesta = await supabase
      .from("shopping_list_items")
      .insert({ list_id: listId, product_id: productId, quantity: quantity });

    if (respuesta.error) throw respuesta.error;
    return true;
  };

  const actualizarCantidadItem = async (listId, productId, quantity) => {
    const respuesta = await supabase
      .from("shopping_list_items")
      .update({ quantity: quantity })
      .eq("list_id", listId)
      .eq("product_id", productId);

    if (respuesta.error) throw respuesta.error;
    return true;
  };

  const borrarItem = async (listId, productId) => {
    const respuesta = await supabase
      .from("shopping_list_items")
      .delete()
      .eq("list_id", listId)
      .eq("product_id", productId);

    if (respuesta.error) throw respuesta.error;
    return true;
  };

  return {
    obtenerListas,
    crearLista,
    borrarLista,
    obtenerCatalogo,
    obtenerItems,
    obtenerItemPorProducto,
    insertarItem,
    actualizarCantidadItem,
    borrarItem,
  };
};

export default useSupabaseCompra;
