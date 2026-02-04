import { createContext, useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient.js";

export const ProductosContext = createContext(null);

/*
  Contexto para el catálogo de productos (products).
  Se carga de Supabase y se prepara una lista para mostrar con filtro y orden.
*/
const ProveedorProductos = ({ children }) => {
  const [catalogo, setCatalogo] = useState([]);
  const [mostrados, setMostrados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  // filtroTipo: "ninguno" | "nombre" | "precio" | "peso"
  const [filtroTipo, setFiltroTipo] = useState("ninguno");
  const [filtroValor, setFiltroValor] = useState("");

  // ordenarPor: "name" | "price" | "weight"
  const [ordenarPor, setOrdenarPor] = useState("name");

  const cargarCatalogo = async () => {
    try {
      setCargando(true);
      setError("");

      const resp = await supabase
        .from("products")
        .select("id, name, weight, price, image_url, description")
        .order("name", { ascending: true });

      if (resp.error) throw resp.error;

      setCatalogo(resp.data ? resp.data : []);
    } catch (e) {
      const msg = e && e.message ? e.message : "Error al cargar el catálogo";
      setError(msg);
    } finally {
      setCargando(false);
    }
  };

  // Aplica un filtro (solo uno cada vez)
  const cambiarFiltro = (tipo) => {
    setFiltroTipo(tipo);
    setFiltroValor("");
  };

  const filtrarPorNombre = (texto) => {
    setFiltroTipo("nombre");
    setFiltroValor(texto);
  };

  const filtrarPorPrecioMax = (max) => {
    setFiltroTipo("precio");
    setFiltroValor(max);
  };

  const filtrarPorPesoMax = (max) => {
    setFiltroTipo("peso");
    setFiltroValor(max);
  };

  const limpiarFiltro = () => {
    setFiltroTipo("ninguno");
    setFiltroValor("");
  };

  // Recalcular lista mostrada cuando cambien datos, filtro u ordenación
  useEffect(() => {
    const lista = catalogo ? catalogo : [];
    const filtrados = [];

    for (let i = 0; i < lista.length; i++) {
      const p = lista[i];
      let ok = true;

      if (filtroTipo === "nombre") {
        const nombre = p && p.name ? p.name.toLowerCase() : "";
        const buscado = String(filtroValor || "").toLowerCase();
        ok = nombre.indexOf(buscado) !== -1;
      }

      if (filtroTipo === "precio") {
        if (filtroValor === "" || filtroValor === null) {
          ok = true;
        } else {
          const max = Number(filtroValor);
          if (p && p.price != null) ok = p.price <= max;
          else ok = false;
        }
      }

      if (filtroTipo === "peso") {
        if (filtroValor === "" || filtroValor === null) {
          ok = true;
        } else {
          const max = Number(filtroValor);
          if (p && p.weight != null) ok = p.weight <= max;
          else ok = false;
        }
      }

      if (ok) filtrados.push(p);
    }

    const ordenados = filtrados.slice();

    ordenados.sort(function (a, b) {
      const aName = a && a.name ? a.name : "";
      const bName = b && b.name ? b.name : "";

      // Para dejar valores vacíos al final
      const aPrice = a && a.price != null ? a.price : 999999999;
      const bPrice = b && b.price != null ? b.price : 999999999;

      const aWeight = a && a.weight != null ? a.weight : 999999999;
      const bWeight = b && b.weight != null ? b.weight : 999999999;

      if (ordenarPor === "name") return aName.localeCompare(bName);
      if (ordenarPor === "price") return aPrice - bPrice;
      return aWeight - bWeight;
    });

    setMostrados(ordenados);
  }, [catalogo, filtroTipo, filtroValor, ordenarPor]);

  // Cargar al entrar
  useEffect(() => {
    cargarCatalogo();
  }, []);

  // Resumen
  const totalMostrados = mostrados.length;

  let sumaPrecios = 0;
  for (let i = 0; i < mostrados.length; i++) {
    const p = mostrados[i];
    if (p && p.price != null) sumaPrecios += p.price;
  }

  let precioMedio = 0;
  if (mostrados.length > 0) {
    precioMedio = sumaPrecios / mostrados.length;
  }

  const value = {
    catalogo,
    mostrados,
    cargando,
    error,

    // estado de filtro/orden
    filtroTipo,
    filtroValor,
    ordenarPor,

    // acciones
    cargarCatalogo,
    cambiarFiltro,
    filtrarPorNombre,
    filtrarPorPrecioMax,
    filtrarPorPesoMax,
    limpiarFiltro,
    setOrdenarPor,

    // resumen
    totalMostrados,
    precioMedio,
  };

  return (
    <ProductosContext.Provider value={value}>
      {children}
    </ProductosContext.Provider>
  );
};

export default ProveedorProductos;
