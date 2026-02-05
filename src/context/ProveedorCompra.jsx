import { createContext, useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient.js";
import useSesion from "../hooks/useSesion.js";

export const CompraContext = createContext(null);

/*
  Contexto de la parte "compra".
  Se guardan listas, catálogo y productos de la lista activa.
*/
const ProveedorCompra = ({ children }) => {
  const { user } = useSesion();

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const [listas, setListas] = useState([]);
  const [listaActiva, setListaActiva] = useState(null);

  const [catalogo, setCatalogo] = useState([]);
  const [items, setItems] = useState([]);

  // Totales del listado (en gramos y euros)
  const [pesoTotal, setPesoTotal] = useState(0);
  const [precioTotal, setPrecioTotal] = useState(0);

  // Umbral para “coger el coche” (15kg = 15000g)
  const umbralCoche = 15000;

  const formatearFecha = (iso) => {
    if (!iso) return "";
    const fecha = new Date(iso);
    if (Number.isNaN(fecha.getTime())) return "";

    const d = String(fecha.getDate()).padStart(2, "0");
    const m = String(fecha.getMonth() + 1).padStart(2, "0");
    const y = String(fecha.getFullYear());

    return d + "/" + m + "/" + y;
  };

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

      const listasCargadas = data ? data : [];
      setListas(listasCargadas);

      // Si la lista activa no existe, se selecciona la primera
      let nuevaActiva = null;

      if (listaActiva && listaActiva.id) {
        for (let i = 0; i < listasCargadas.length; i++) {
          if (listasCargadas[i].id === listaActiva.id) {
            nuevaActiva = listasCargadas[i];
          }
        }
      }

      if (!nuevaActiva) {
        if (listasCargadas.length > 0) nuevaActiva = listasCargadas[0];
      }

      setListaActiva(nuevaActiva);
    } catch (e) {
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
          quantity: row.quantity != null ? row.quantity : 1,
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

      await cargarListas();
      setListaActiva(data ? data : null);
    } catch (e) {
      const msg = e && e.message ? e.message : "Error al crear la lista";
      setError(msg);
    } finally {
      setCargando(false);
    }
  };

  const borrarLista = async ({ list_id }) => {
    if (!list_id) return;

    try {
      setCargando(true);
      setError("");

      // Primero se borran los items de la lista (por si no hay cascada)
      const respItems = await supabase
        .from("shopping_list_items")
        .delete()
        .eq("list_id", list_id);

      if (respItems.error) throw respItems.error;

      const respLista = await supabase
        .from("shopping_lists")
        .delete()
        .eq("id", list_id);

      if (respLista.error) throw respLista.error;

      await cargarListas();
    } catch (e) {
      const msg = e && e.message ? e.message : "Error al borrar la lista";
      setError(msg);
    } finally {
      setCargando(false);
    }
  };

  const anadirProductoALista = async ({ list_id, product_id, quantity }) => {
    if (!list_id || !product_id) return;

    // Si no viene quantity, se pone 1
    let cantidad = quantity != null ? Number(quantity) : 1;
    if (!cantidad || cantidad < 1) cantidad = 1;

    try {
      setCargando(true);
      setError("");

      // Se mira si ya existe el producto en esa lista
      const respExiste = await supabase
        .from("shopping_list_items")
        .select("quantity")
        .eq("list_id", list_id)
        .eq("product_id", product_id)
        .maybeSingle();

      if (respExiste.error) throw respExiste.error;

      if (respExiste.data) {
        const cantidadActual =
          respExiste.data.quantity != null ? respExiste.data.quantity : 1;
        const nuevaCantidad = cantidadActual + cantidad;

        const respUpdate = await supabase
          .from("shopping_list_items")
          .update({ quantity: nuevaCantidad })
          .eq("list_id", list_id)
          .eq("product_id", product_id);

        if (respUpdate.error) throw respUpdate.error;
      } else {
        const respInsert = await supabase
          .from("shopping_list_items")
          .insert({ list_id: list_id, product_id: product_id, quantity: cantidad });

        if (respInsert.error) throw respInsert.error;
      }

      await cargarItems(list_id);
    } catch (e) {
      const msg =
        e && e.message ? e.message : "Error al añadir el producto a la lista";
      setError(msg);
    } finally {
      setCargando(false);
    }
  };

  const cambiarCantidad = async ({ list_id, product_id, quantity }) => {
    if (!list_id || !product_id) return;

    let cantidad = Number(quantity);
    if (!cantidad || cantidad < 1) cantidad = 1;

    try {
      setCargando(true);
      setError("");

      const resp = await supabase
        .from("shopping_list_items")
        .update({ quantity: cantidad })
        .eq("list_id", list_id)
        .eq("product_id", product_id);

      if (resp.error) throw resp.error;

      await cargarItems(list_id);
    } catch (e) {
      const msg =
        e && e.message ? e.message : "Error al cambiar la cantidad";
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

      if (respuesta.error) throw respuesta.error;

      await cargarItems(list_id);
    } catch (e) {
      const msg = e && e.message ? e.message : "Error al quitar el producto";
      setError(msg);
    } finally {
      setCargando(false);
    }
  };

  // Recalcular totales cada vez que cambian los items
  useEffect(() => {
    let peso = 0;
    let precio = 0;

    for (let i = 0; i < items.length; i++) {
      const row = items[i];
      const q = row.quantity != null ? Number(row.quantity) : 1;

      if (row.product && row.product.weight != null) {
        peso += Number(row.product.weight) * q;
      }

      if (row.product && row.product.price != null) {
        precio += Number(row.product.price) * q;
      }
    }

    setPesoTotal(peso);
    setPrecioTotal(precio);
  }, [items]);

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
    pesoTotal,
    precioTotal,
    umbralCoche,
    formatearFecha,
    cargarListas,
    cargarCatalogo,
    cargarItems,
    crearLista,
    borrarLista,
    anadirProductoALista,
    cambiarCantidad,
    quitarProductoDeLista,
  };

  return (
    <CompraContext.Provider value={value}>{children}</CompraContext.Provider>
  );
};

export default ProveedorCompra;
