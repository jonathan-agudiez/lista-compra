import { useState } from "react";
import useProductos from "../../hooks/useProductos.js";
import "./FiltroProductos.css";

/*
  Controles de filtro y ordenación del catálogo.
  Se separa para tener el código más ordenado.
*/
const FiltroProductos = () => {
  const {
    cargando,
    filtroTipo,
    ordenarPor,
    cambiarFiltro,
    filtrarPorNombre,
    filtrarPorPrecioMax,
    filtrarPorPesoMax,
    limpiarFiltro,
    setOrdenarPor,
  } = useProductos();

  // Inputs locales (para no cambiar el contexto con cada tecla)
  const [textoNombre, setTextoNombre] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [pesoMax, setPesoMax] = useState("");

  const onCambiarFiltro = (tipo) => {
    cambiarFiltro(tipo);

    // Al cambiar de filtro, se limpian los campos
    setTextoNombre("");
    setPrecioMax("");
    setPesoMax("");

    if (tipo === "ninguno") {
      limpiarFiltro();
    }
  };

  const aplicarFiltro = () => {
    if (filtroTipo === "nombre") {
      filtrarPorNombre(textoNombre);
      return;
    }

    if (filtroTipo === "precio") {
      filtrarPorPrecioMax(precioMax);
      return;
    }

    if (filtroTipo === "peso") {
      filtrarPorPesoMax(pesoMax);
      return;
    }

    limpiarFiltro();
  };

  return (
    <div className="productosControles">
      <div className="productosFila">
        <label className="productosLabel">
          <span>Filtrar por</span>
          <select
            className="input"
            value={filtroTipo}
            onChange={(e) => onCambiarFiltro(e.target.value)}
            disabled={cargando}
          >
            <option value="ninguno">Sin filtro</option>
            <option value="nombre">Nombre</option>
            <option value="precio">Precio máximo</option>
            <option value="peso">Peso máximo</option>
          </select>
        </label>

        <label className="productosLabel">
          <span>Ordenar por</span>
          <select
            className="input"
            value={ordenarPor}
            onChange={(e) => setOrdenarPor(e.target.value)}
            disabled={cargando}
          >
            <option value="name">Nombre</option>
            <option value="price">Precio</option>
            <option value="weight">Peso</option>
          </select>
        </label>
      </div>

      {filtroTipo === "nombre" ? (
        <label className="productosLabel">
          <span>Nombre contiene</span>
          <input
            className="input"
            value={textoNombre}
            onChange={(e) => setTextoNombre(e.target.value)}
            placeholder="Ej: leche"
            disabled={cargando}
          />
        </label>
      ) : (
        ""
      )}

      {filtroTipo === "precio" ? (
        <label className="productosLabel">
          <span>Precio máximo</span>
          <input
            className="input"
            type="number"
            value={precioMax}
            onChange={(e) => setPrecioMax(e.target.value)}
            placeholder="Ej: 3.5"
            disabled={cargando}
          />
        </label>
      ) : (
        ""
      )}

      {filtroTipo === "peso" ? (
        <label className="productosLabel">
          <span>Peso máximo</span>
          <input
            className="input"
            type="number"
            value={pesoMax}
            onChange={(e) => setPesoMax(e.target.value)}
            placeholder="Ej: 500"
            disabled={cargando}
          />
        </label>
      ) : (
        ""
      )}

      <div className="productosAcciones">
        <button
          className="boton"
          type="button"
          onClick={aplicarFiltro}
          disabled={cargando}
        >
          Aplicar
        </button>

        <button
          className="boton"
          type="button"
          onClick={() => onCambiarFiltro("ninguno")}
          disabled={cargando}
        >
          Limpiar
        </button>
      </div>
    </div>
  );
};

export default FiltroProductos;
