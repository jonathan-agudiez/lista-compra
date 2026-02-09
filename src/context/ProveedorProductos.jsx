import { createContext, useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient.js";
import { useNotificacion } from "../hooks/useNotificacion.js";

const ProductosContext = createContext(null);

/*
  Contexto del catálogo (tabla products).
  Aquí se carga, se filtra/ordena y también se hace el CRUD (crear/editar/borrar).
*/
function ProveedorProductos({ children }) {
  const { notificar } = useNotificacion();
  const [catalogo, setCatalogo] = useState([]);
  const [mostrados, setMostrados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroValor, setFiltroValor] = useState("");
  const [ordenarPor, setOrdenarPor] = useState("name");

  const [productoEditando, setProductoEditando] = useState(null);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await supabase
        .from("products")
        .select("*")
        .order("name", { ascending: true });

      if (respuesta.error) throw respuesta.error;

      setCatalogo(respuesta.data);
      actualizarMostrados(respuesta.data, ordenarPor);
    } catch (e) {
      let msg = "Error al cargar productos";
      if (e) {
        if (e.message) msg = e.message;
      }
      setError(msg);
      notificar(msg, "error");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const cambiarFiltro = (tipo, valor) => {
    setFiltroTipo(tipo);
    setFiltroValor(valor);
  };

  const limpiarFiltro = () => {
    setFiltroTipo("");
    setFiltroValor("");
    actualizarMostrados(catalogo, ordenarPor);
  };

  const filtrarPorNombre = (texto) => {
    const t = texto.trim().toLowerCase();
    if (!t) {
      actualizarMostrados(catalogo, ordenarPor);
      return;
    }
    const filtrados = catalogo.filter((p) => p.name.toLowerCase().includes(t));
    actualizarMostrados(filtrados, ordenarPor);
  };

  const filtrarPorPrecioMax = (max) => {
    const n = Number(max);
    if (!n) {
      actualizarMostrados(catalogo, ordenarPor);
      return;
    }
    const filtrados = catalogo.filter((p) => Number(p.price) <= n);
    actualizarMostrados(filtrados, ordenarPor);
  };

  const filtrarPorPesoMax = (max) => {
    const n = Number(max);
    if (!n) {
      actualizarMostrados(catalogo, ordenarPor);
      return;
    }
    const filtrados = catalogo.filter((p) => Number(p.weight) <= n);
    actualizarMostrados(filtrados, ordenarPor);
  };

  function ordenarLista(lista, tipoOrden) {
    const copia = [...lista];

    if (tipoOrden === "name") {
      copia.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    }
    if (tipoOrden === "price") {
      copia.sort((a, b) => Number(a.price) - Number(b.price));
    }
    if (tipoOrden === "weight") {
      copia.sort((a, b) => Number(a.weight) - Number(b.weight));
    }

    return copia;
  }

  function actualizarMostrados(listaBase, tipoOrden) {
    const tipo = tipoOrden ? tipoOrden : ordenarPor;
    const listaOrdenada = ordenarLista(listaBase, tipo);
    setMostrados(listaOrdenada);
  }

  function cambiarOrden(tipoOrden) {
    setOrdenarPor(tipoOrden);
    actualizarMostrados(mostrados, tipoOrden);
  }

const seleccionarProducto = (producto) => {
    setProductoEditando(producto);
  };

  const limpiarEdicion = () => {
    setProductoEditando(null);
  };

  const crearProducto = async (nuevo) => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await supabase.from("products").insert([nuevo]).select();
      if (respuesta.error) throw respuesta.error;

      notificar("Producto creado.", "success");
      cargarProductos();
    } catch (e) {
      let msg = "Error al crear producto";
      if (e) {
        if (e.message) msg = e.message;
      }
      setError(msg);
      notificar(msg, "error");
    } finally {
      setCargando(false);
    }
  };

  const actualizarProducto = async (id, cambios) => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await supabase.from("products").update(cambios).eq("id", id);
      if (respuesta.error) throw respuesta.error;

      notificar("Producto actualizado.", "success");
      cargarProductos();
      limpiarEdicion();
    } catch (e) {
      let msg = "Error al actualizar producto";
      if (e) {
        if (e.message) msg = e.message;
      }
      setError(msg);
      notificar(msg, "error");
    } finally {
      setCargando(false);
    }
  };

  const borrarProducto = async (id) => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await supabase.from("products").delete().eq("id", id);
      if (respuesta.error) throw respuesta.error;

      notificar("Producto borrado.", "warning");
      cargarProductos();
    } catch (e) {
      let msg = "Error al borrar producto";
      if (e) {
        if (e.message) msg = e.message;
      }
      setError(msg);
      notificar(msg, "error");
    } finally {
      setCargando(false);
    }
  };

  const totalMostrados = mostrados.length;

  let precioMedio = 0;
  if (mostrados.length > 0) {
    const suma = mostrados.reduce((acc, p) => acc + Number(p.price), 0);
    precioMedio = suma / mostrados.length;
  }

  const value = {
    catalogo,
    mostrados,
    cargando,
    error,
    setError,

    filtroTipo,
    filtroValor,
    ordenarPor,
    cambiarFiltro,
    filtrarPorNombre,
    filtrarPorPrecioMax,
    filtrarPorPesoMax,
    limpiarFiltro,
    cambiarOrden,

    totalMostrados,
    precioMedio,

    productoEditando,
    seleccionarProducto,
    limpiarEdicion,

    crearProducto,
    borrarProducto,
    actualizarProducto,
  };

  return <ProductosContext.Provider value={value}>{children}</ProductosContext.Provider>;
}

export { ProductosContext, ProveedorProductos };
