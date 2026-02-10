import { createContext, useEffect, useState } from "react";
import useSesion from "../hooks/useSesion.js";
import useNotificacion from "../hooks/useNotificacion.js";
import useSupabaseCompra from "../hooks/useSupabaseCompra.js";

export const CompraContext = createContext(null);

/*
  Contexto de compra:
  - listas del usuario
  - catálogo (products)
  - items de la lista activa (con quantity)
*/
const ProveedorCompra = ({ children }) => {
  const { user } = useSesion();
  const { notificar } = useNotificacion();
  const supaCompra = useSupabaseCompra();

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const [listas, setListas] = useState([]);
  const [listaActiva, setListaActiva] = useState(null);

  const [catalogo, setCatalogo] = useState([]);
  const [items, setItems] = useState([]);

  const [pesoTotal, setPesoTotal] = useState(0);
  const [precioTotal, setPrecioTotal] = useState(0);

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
    if (!user) {
      return;
    }

    try {
      setCargando(true);
      setError("");

      const listasCargadas = await supaCompra.obtenerListas(user.id);
      setListas(listasCargadas);

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
      if (e && e.message) {
        msg = e.message;
      }

      setError(msg);
      notificar(msg, "error");
    } finally {
      setCargando(false);
    }
  };

  const cargarCatalogo = async () => {
    try {
      setCargando(true);
      setError("");

      const data = await supaCompra.obtenerCatalogo();
      setCatalogo(data ? data : []);
    } catch (e) {
      let msg = "Error al cargar el catálogo";
      if (e && e.message) {
        msg = e.message;
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
      return;
    }

    try {
      setCargando(true);
      setError("");

      const data = await supaCompra.obtenerItems(listId);

      const normalizados = (data ? data : []).map((row) => {
        return {
          list_id: row.list_id,
          product_id: row.product_id,
          quantity: row.quantity != null ? row.quantity : 1,
          product: row.products ? row.products : null,
        };
      });

      setItems(normalizados);
    } catch (e) {
      let msg = "Error al cargar los productos de la lista";
      if (e && e.message) {
        msg = e.message;
      }

      setError(msg);
      notificar(msg, "error");
    } finally {
      setCargando(false);
    }
  };

  const crearLista = async ({ name }) => {
    if (!user) {
      return;
    }

    try {
      setCargando(true);
      setError("");

      const data = await supaCompra.crearLista(name, user.id);

      await cargarListas();
      setListaActiva(data ? data : null);
      notificar("Lista creada", "success");
    } catch (e) {
      let msg = "Error al crear la lista";
      if (e && e.message) {
        msg = e.message;
      }

      setError(msg);
      notificar(msg, "error");
    } finally {
      setCargando(false);
    }
  };

  const borrarLista = async ({ list_id }) => {
    if (!list_id) {
      return;
    }

    try {
      setCargando(true);
      setError("");

      await supaCompra.borrarLista(list_id);
      await cargarListas();

      notificar("Lista eliminada", "success");
    } catch (e) {
      let msg = "Error al borrar la lista";
      if (e && e.message) {
        msg = e.message;
      }

      setError(msg);
      notificar(msg, "error");
    } finally {
      setCargando(false);
    }
  };

  const anadirProductoALista = async ({ list_id, product_id, quantity }) => {
    if (!list_id || !product_id) {
      return;
    }

    let cantidad = Number(quantity);
    if (!cantidad || cantidad < 1) {
      cantidad = 1;
    }

    try {
      setCargando(true);
      setError("");

      const itemActual = await supaCompra.obtenerItemPorProducto(list_id, product_id);

      if (itemActual) {
        const anterior = itemActual.quantity != null ? Number(itemActual.quantity) : 1;
        const nuevaCantidad = anterior + cantidad;

        await supaCompra.actualizarCantidadItem(list_id, product_id, nuevaCantidad);
      } else {
        await supaCompra.insertarItem(list_id, product_id, cantidad);
      }

      await cargarItems(list_id);
      // No se notifica en éxito para evitar renders innecesarios.
    } catch (e) {
      let msg = "Error al añadir el producto a la lista";
      if (e && e.message) {
        msg = e.message;
      }

      setError(msg);
      notificar(msg, "error");
    } finally {
      setCargando(false);
    }
  };

  const cambiarCantidad = async ({ list_id, product_id, quantity }) => {
    if (!list_id || !product_id) {
      return;
    }

    let cantidad = Number(quantity);
    if (!cantidad || cantidad < 1) {
      cantidad = 1;
    }

    try {
      setCargando(true);
      setError("");

      await supaCompra.actualizarCantidadItem(list_id, product_id, cantidad);
      await cargarItems(list_id);
    } catch (e) {
      let msg = "Error al cambiar la cantidad";
      if (e && e.message) {
        msg = e.message;
      }

      setError(msg);
      notificar(msg, "error");
    } finally {
      setCargando(false);
    }
  };

  const quitarProductoDeLista = async ({ list_id, product_id }) => {
    if (!list_id || !product_id) {
      return;
    }

    try {
      setCargando(true);
      setError("");

      await supaCompra.borrarItem(list_id, product_id);
      await cargarItems(list_id);

      notificar("Producto quitado", "success");
    } catch (e) {
      let msg = "Error al quitar el producto";
      if (e && e.message) {
        msg = e.message;
      }

      setError(msg);
      notificar(msg, "error");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    let peso = 0;
    let precio = 0;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const q = item.quantity != null ? Number(item.quantity) : 1;

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

  useEffect(() => {
    if (!user) {
      setListas([]);
      setListaActiva(null);
      setItems([]);
      setCatalogo([]);
      return;
    }

    cargarListas();
    cargarCatalogo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user && user.id]);

  useEffect(() => {
    const id = listaActiva && listaActiva.id ? listaActiva.id : null;
    cargarItems(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listaActiva && listaActiva.id]);

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

export default ProveedorCompra;
