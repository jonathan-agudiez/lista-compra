import { createContext, useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient.js";
import useSesion from "../hooks/useSesion.js";

export const CompraContext = createContext(null);

/**
 * Contexto de la parte "compra".
 * La idea es tener en un sitio: listas, catálogo de productos y los items.
 */
const ProveedorCompra = ({ children }) => {
  const { user } = useSesion();

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const [listas, setListas] = useState([]);
  const [listaActiva, setListaActiva] = useState(null);

  const [catalogo, setCatalogo] = useState([]);
  const [items, setItems] = useState([]);

  const cargarListas = async () => {
    if (!user) return;

    try {
      setCargando(true);
      setError("");

      const { data, error } = await supabase
        .from("shopping_lists")
        .select("id, name, owner_id, created_at")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setListas(data ?? []);

      // Si no hay lista activa (o ya no existe), selecciono la primera.
      setListaActiva((prev) => {
        const existe = (data ?? []).find((l) => l.id === prev?.id);
        if (existe) return existe;
        return (data ?? [])[0] ?? null;
      });
    } catch (e) {
      setError(e?.message ?? "Error al cargar las listas");
    } finally {
      setCargando(false);
    }
  };

  const cargarCatalogo = async () => {
    try {
      setCargando(true);
      setError("");

      const { data, error } = await supabase
        .from("products")
        .select("id, name, weight, price, image_url, description")
        .order("name", { ascending: true });

      if (error) throw error;

      setCatalogo(data ?? []);
    } catch (e) {
      setError(e?.message ?? "Error al cargar el catálogo");
    } finally {
      setCargando(false);
    }
  };

  const cargarItems = async (listId) => {
    if (!listId) {
      setItems([]);
      return;
    }

    try {
      setCargando(true);
      setError("");

      const { data, error } = await supabase
        .from("shopping_list_items")
        .select(
          `
          list_id,
          product_id,
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

      if (error) throw error;

      const normalizados = (data ?? []).map((row) => ({
        list_id: row.list_id,
        product_id: row.product_id,
        product: row.products ?? null,
      }));

      setItems(normalizados);
    } catch (e) {
      setError(e?.message ?? "Error al cargar los productos de la lista");
    } finally {
      setCargando(false);
    }
  };

  const crearLista = async ({ name }) => {
    if (!user) return;

    try {
      setCargando(true);
      setError("");

      const { data, error } = await supabase
        .from("shopping_lists")
        .insert({ name, owner_id: user.id })
        .select("id, name, owner_id, created_at")
        .single();

      if (error) throw error;

      // Recargo para que quede todo ordenado y consistente.
      await cargarListas();
      setListaActiva(data ?? null);
    } catch (e) {
      setError(e?.message ?? "Error al crear la lista");
    } finally {
      setCargando(false);
    }
  };

  const anadirProductoALista = async ({ list_id, product_id }) => {
    if (!list_id || !product_id) return;

    try {
      setCargando(true);
      setError("");

      const { error } = await supabase
        .from("shopping_list_items")
        .insert({ list_id, product_id });

      if (error) throw error;

      await cargarItems(list_id);
    } catch (e) {
      // Si está repetido suele dar error por clave duplicada.
      setError(e?.message ?? "Error al añadir el producto a la lista");
    } finally {
      setCargando(false);
    }
  };

  const quitarProductoDeLista = async ({ list_id, product_id }) => {
    if (!list_id || !product_id) return;

    try {
      setCargando(true);
      setError("");

      const { error } = await supabase
        .from("shopping_list_items")
        .delete()
        .eq("list_id", list_id)
        .eq("product_id", product_id);

      if (error) throw error;

      await cargarItems(list_id);
    } catch (e) {
      setError(e?.message ?? "Error al quitar el producto");
    } finally {
      setCargando(false);
    }
  };

  // Cuando cambia el usuario, recargo listas y catálogo.
  useEffect(() => {
    if (!user) {
      setListas([]);
      setListaActiva(null);
      setItems([]);
      return;
    }

    cargarListas();
    cargarCatalogo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Cuando cambia la lista activa, recargo items.
  useEffect(() => {
    cargarItems(listaActiva?.id ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listaActiva?.id]);
  const value = {
      cargando,
      error,
      setError,
      listas,
      listaActiva,
      setListaActiva,
      catalogo,
      items,
      cargarListas,
      cargarCatalogo,
      cargarItems,
      crearLista,
      anadirProductoALista,
      quitarProductoDeLista,
  };

  return <CompraContext.Provider value={value}>{children}</CompraContext.Provider>;
};

export default ProveedorCompra;
