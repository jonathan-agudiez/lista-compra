import { useState } from "react";
import useProductos from "../../hooks/useProductos.js";
import "./FiltroProductos.css";

/*
  Controles de filtro y ordenación del catálogo.
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

  const [textoNombre, setTextoNombre] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [pesoMax, setPesoMax] = useState("");

  const IconAplicar = () => (
    <svg
      className="icon"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
      />
    </svg>
  );

  const IconLimpiar = () => (
    <svg
      className="icon"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9.75 14.25 12m0 0 2.25 2.25M14.25 12l2.25-2.25M14.25 12 12 14.25m-2.58 4.92-6.374-6.375a1.125 1.125 0 0 1 0-1.59L9.42 4.83c.21-.211.497-.33.795-.33H19.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25h-9.284c-.298 0-.585-.119-.795-.33Z"
      />
    </svg>
  );

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
    } else if (filtroTipo === "precio") {
      filtrarPorPrecioMax(precioMax);
    } else if (filtroTipo === "peso") {
      filtrarPorPesoMax(pesoMax);
    } else {
      limpiarFiltro();
    }
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

        <div className="productosAcciones">
          <button
            className="btn btn--secondary btn--icon"
            type="button"
            onClick={aplicarFiltro}
            disabled={cargando}
            title="Aplicar filtros"
            aria-label="Aplicar filtros"
          >
            <IconAplicar />
          </button>

          <button
            className="btn btn--primary btn--icon"
            type="button"
            onClick={() => onCambiarFiltro("ninguno")}
            disabled={cargando}
            title="Limpiar filtros"
            aria-label="Limpiar filtros"
          >
            <IconLimpiar />
          </button>
        </div>
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
    </div>
  );

};

export default FiltroProductos;
