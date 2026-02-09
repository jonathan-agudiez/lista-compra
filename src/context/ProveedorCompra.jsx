import { createContext, useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient.js";
import { useSesion } from "../hooks/useSesion.js";
import { useNotificacion } from "../hooks/useNotificacion.js";

const CompraContext = createContext(null);

/*
  Contexto de compra:
  - listas del usuario
  - catálogo (products)
  - items de la lista activa (con quantity)
*/
const ProveedorCompra = ({ children }) => {
  const { user } = useSesion();
  const { notificar } = useNotificacion();

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
    if (!iso) {
      return "";
    }

    const fecha = new Date(iso);
    if (Number.isNaN(fecha.getTime())) {
      return "";
    }

    const d = String(fecha.getDate()).padStart(2, "0");
    const m = String(fecha.getMonth() + 1).padStart(2, "0");
    const y = String(fecha.getFullYear());

    return d + "/" + m + "/" + y;
  };

  const cargarListas = async () => {
    if (user) {
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

        let listasCargadas = [];
        if (data) {
          listasCargadas = data;
        }
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
          if (listasCargadas.length > 0) {
            nuevaActiva = listasCargadas[0];
          }
        }

        setListaActiva(nuevaActiva);
      } catch (e) {
        let msg = "Error al cargar las listas";
        if (e) {
          if (e.message) {
            msg = e.message;
          }
        }
        setError(msg);
        notificar(msg, "error");
      } finally {
        setCargando(false);
      }
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

      let catalogoCargado = [];
      if (data) {
        catalogoCargado = data;
      }
      setCatalogo(catalogoCargado);
    } catch (e) {
      let msg = "Error al cargar el catálogo";
      if (e) {
        if (e.message) {
          msg = e.message;
        }
      }
      setError(msg);
      notificar(msg, "error");
    } finally {
      setCargando(false);
    }
  };

  const cargarItems = async (listId) => {
    if (!listId) {
      setItems([]);
    } else {
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

        let filas = [];
        if (data) {
          filas = data;
        }

        const normalizados = filas.map((row) => {
          let cantidad = 1;
          if (row.quantity != null) {
            cantidad = row.quantity;
          }

          let producto = null;
          if (row.products) {
            producto = row.products;
          }

          return {
            list_id: row.list_id,
            product_id: row.product_id,
            quantity: cantidad,
            product: producto,
          };
        });

        setItems(normalizados);
      } catch (e) {
        let msg = "Error al cargar los productos de la lista";
        if (e) {
          if (e.message) {
            msg = e.message;
          }
        }
        setError(msg);
        notificar(msg, "error");
      } finally {
        setCargando(false);
      }
    }
  };

  const crearLista = async ({ name }) => {
    if (user) {
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
        if (data) {
          setListaActiva(data);
        } else {
          setListaActiva(null);
        }
        notificar("Lista creada", "success");
      } catch (e) {
        let msg = "Error al crear la lista";
        if (e) {
          if (e.message) {
            msg = e.message;
          }
        }
        setError(msg);

        notificar(msg, "error");
      } finally {
        setCargando(false);
      }
    }
  };

  const borrarLista = async ({ list_id }) => {
    if (list_id) {
      try {
        setCargando(true);
        setError("");

        const respuesta = await supabase
          .from("shopping_lists")
          .delete()
          .eq("id", list_id);

        const errorSupabase = respuesta.error;
        if (errorSupabase) throw errorSupabase;

        await cargarListas();
        notificar("Lista eliminada", "success");
      } catch (e) {
        let msg = "Error al borrar la lista";
        if (e) {
          if (e.message) {
            msg = e.message;
          }
        }
        setError(msg);

        notificar(msg, "error");
      } finally {
        setCargando(false);
      }
    }
  };

  const anadirProductoALista = async ({ list_id, product_id, quantity }) => {
    if (list_id && product_id) {
      let cantidad = Number(quantity);
      if (!cantidad || cantidad < 1) cantidad = 1;

      try {
        setCargando(true);
        setError("");

        // Si ya existe, se actualiza sumando cantidad
        const existe = await supabase
          .from("shopping_list_items")
          .select("list_id, product_id, quantity")
          .eq("list_id", list_id)
          .eq("product_id", product_id)
          .maybeSingle();

        if (existe.error) throw existe.error;

        if (existe.data) {
          let anterior = 1;
          if (existe.data.quantity != null) {
            anterior = Number(existe.data.quantity);
          }
          const nuevaCantidad = anterior + cantidad;

          const upd = await supabase
            .from("shopping_list_items")
            .update({ quantity: nuevaCantidad })
            .eq("list_id", list_id)
            .eq("product_id", product_id);

          if (upd.error) throw upd.error;
        } else {
          const ins = await supabase
            .from("shopping_list_items")
            .insert({ list_id: list_id, product_id: product_id, quantity: cantidad });

          if (ins.error) throw ins.error;
        }

        await cargarItems(list_id);

        // No se notifica en éxito para evitar renders innecesarios.
      } catch (e) {
        let msg = "Error al añadir el producto a la lista";
        if (e) {
          if (e.message) {
            msg = e.message;
          }
        }
        setError(msg);

        notificar(msg, "error");
      } finally {
        setCargando(false);
      }
    }
  };

  const cambiarCantidad = async ({ list_id, product_id, quantity }) => {
    if (list_id && product_id) {
      let cantidad = Number(quantity);
      if (!cantidad || cantidad < 1) cantidad = 1;

      try {
        setCargando(true);
        setError("");

        const respuesta = await supabase
          .from("shopping_list_items")
          .update({ quantity: cantidad })
          .eq("list_id", list_id)
          .eq("product_id", product_id);

        const errorSupabase = respuesta.error;
        if (errorSupabase) throw errorSupabase;

        await cargarItems(list_id);
      } catch (e) {
        let msg = "Error al cambiar la cantidad";
        if (e) {
          if (e.message) {
            msg = e.message;
          }
        }
        setError(msg);

        notificar(msg, "error");
      } finally {
        setCargando(false);
      }
    }
  };

  const quitarProductoDeLista = async ({ list_id, product_id }) => {
    if (list_id && product_id) {
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
        notificar("Producto quitado", "success");
      } catch (e) {
        let msg = "Error al quitar el producto";
        if (e) {
          if (e.message) {
            msg = e.message;
          }
        }
        setError(msg);

        notificar(msg, "error");
      } finally {
        setCargando(false);
      }
    }
  };

  // Recalcular totales cuando cambian los items
  useEffect(() => {
    let peso = 0;
    let precio = 0;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      let q = 1;
      if (item.quantity != null) {
        q = Number(item.quantity);
      }

      if (item.product && item.product.weight != null) {
        peso += Number(item.product.weight) * q;
      }

      if (item.product && item.product.price != null) {
        precio += Number(item.product.price) * q;
      }
    }

    setPesoTotal(peso);
    setPrecioTotal(precio);
  }, [items]);

  // Cuando cambia el usuario, se recarga todo
  useEffect(() => {
    if (!user) {
      setListas([]);
      setListaActiva(null);
      setItems([]);
      setCatalogo([]);
    } else {
      cargarListas();
      cargarCatalogo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Cuando cambia la lista activa, se recargan items
  useEffect(() => {
    let id = null;
    if (listaActiva) {
      if (listaActiva.id) {
        id = listaActiva.id;
      }
    }
    cargarItems(id);
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
    borrarLista,
    anadirProductoALista,
    cambiarCantidad,
    quitarProductoDeLista,
    pesoTotal,
    precioTotal,
    umbralCoche,
    formatearFecha,
  };

  return <CompraContext.Provider value={value}>{children}</CompraContext.Provider>;
};

export { CompraContext, ProveedorCompra };
