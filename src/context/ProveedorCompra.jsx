import { createContext, useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient.js";
import useSesion from "../hooks/useSesion.js";

export const CompraContext = createContext(null);

/*
  Contexto de la parte "compra".
  Aquí se guardan las listas, el catálogo y los productos de la lista.
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

      const respuesta = await supabase
        .from("shopping_lists")
        .select("id, name, owner_id, created_at")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      const data = respuesta.data;
      const errorSupabase = respuesta.error;

      if (errorSupabase) throw errorSupabase;

      // Si data viene vacío, se usa array vacío
      const listasCargadas = data ? data : [];
      setListas(listasCargadas);

      // Si la lista activa no existe o es null, se pone la primera lista
      let nuevaActiva = null;

      if (listaActiva && listaActiva.id) {
        // Buscar si sigue existiendo en la lista nueva (con for clásico)
        for (let i = 0; i < listasCargadas.length; i++) {
          if (listasCargadas[i].id === listaActiva.id) {
            nuevaActiva = listasCargadas[i];
          }
        }
      }

      if (!nuevaActiva) {
        if (listasCargadas.length > 0) {
          nuevaActiva = listasCargadas[0];
        } else {
          nuevaActiva = null;
        }
      }

      setListaActiva(nuevaActiva);
    } catch (e) {
      // Mensaje sencillo sin optional chaining
      const msg = e && e.message ? e.message : "Error al cargar las listas";
      setError(msg);
    } finally {
      setCargando(false);
    }
  };

  const cargarCatalogo = async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await supabase
        .from("products")
        .select("id, name, weight, price, image_url, description")
        .order("name", { ascending: true });

      const data = respuesta.data;
      const errorSupabase = respuesta.error;

      if (errorSupabase) throw errorSupabase;

      setCatalogo(data ? data : []);
    } catch (e) {
      const msg = e && e.message ? e.message : "Error al cargar el catálogo";
      setError(msg);
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

      const respuesta = await supabase
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

      const data = respuesta.data;
      const errorSupabase = respuesta.error;

      if (errorSupabase) throw errorSupabase;

      const filas = data ? data : [];
      const normalizados = [];

      for (let i = 0; i < filas.length; i++) {
        const row = filas[i];

        normalizados.push({
          list_id: row.list_id,
          product_id: row.product_id,
          product: row.products ? row.products : null,
        });
      }

      setItems(normalizados);
    } catch (e) {
      const msg =
        e && e.message ? e.message : "Error al cargar los productos de la lista";
      setError(msg);
    } finally {
      setCargando(false);
    }
  };

  const crearLista = async ({ name }) => {
    if (!user) return;

    try {
      setCargando(true);
      setError("");

      const respuesta = await supabase
        .from("shopping_lists")
        .insert({ name: name, owner_id: user.id })
        .select("id, name, owner_id, created_at")
        .single();

      const data = respuesta.data;
      const errorSupabase = respuesta.error;

      if (errorSupabase) throw errorSupabase;

      // Recargar listas y poner la nueva activa
      await cargarListas();
      setListaActiva(data ? data : null);
    } catch (e) {
      const msg = e && e.message ? e.message : "Error al crear la lista";
      setError(msg);
    } finally {
      setCargando(false);
    }
  };

  const anadirProductoALista = async ({ list_id, product_id }) => {
    if (!list_id || !product_id) return;

    try {
      setCargando(true);
      setError("");

      const respuesta = await supabase
        .from("shopping_list_items")
        .insert({ list_id: list_id, product_id: product_id });

      const errorSupabase = respuesta.error;
      if (errorSupabase) throw errorSupabase;

      await cargarItems(list_id);
    } catch (e) {
      const msg =
        e && e.message ? e.message : "Error al añadir el producto a la lista";
      setError(msg);
    } finally {
      setCargando(false);
    }
  };

  const quitarProductoDeLista = async ({ list_id, product_id }) => {
    if (!list_id || !product_id) return;

    try {
      setCargando(true);
      setError("");

      const respuesta = await supabase
        .from("shopping_list_items")
        .delete()
        .eq("list_id", list_id)
        .eq("product_id", product_id);

      const errorSupabase = respuesta.error;
      if (errorSupabase) throw errorSupabase;

      await cargarItems(list_id);
    } catch (e) {
      const msg = e && e.message ? e.message : "Error al quitar el producto";
      setError(msg);
    } finally {
      setCargando(false);
    }
  };

  // Cuando cambia el usuario, se recargan listas y catálogo
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
  }, [user]);

  // Cuando cambia la lista activa, se recargan los items
  useEffect(() => {
    if (listaActiva && listaActiva.id) {
      cargarItems(listaActiva.id);
    } else {
      cargarItems(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listaActiva]);

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

  return (
    <CompraContext.Provider value={value}>{children}</CompraContext.Provider>
  );
};

export default ProveedorCompra;
