import { useState } from "react";
import useCompra from "../../hooks/useCompra.js";
import "./panel.css";
import "./PanelDetalle.css";

/*
  Este panel tiene dos formularios:
  1) Crear una lista
  2) Añadir un producto del catálogo a la lista activa
*/
const PanelDetalle = () => {
  const {
    cargando,
    error,
    setError,
    listaActiva,
    catalogo,
    crearLista,
    anadirProductoALista,
  } = useCompra();

  // ---- Crear lista ----
  const [nombreLista, setNombreLista] = useState("");

  const enviarCrearLista = async (e) => {
    e.preventDefault();

    // Si está vacío, no se envía
    if (nombreLista.trim() === "") return;

    await crearLista({ name: nombreLista.trim() });
    setNombreLista("");
  };

  // ---- Añadir producto existente ----
  const [productoSeleccionado, setProductoSeleccionado] = useState("");

  const enviarAnadir = async (e) => {
    e.preventDefault();

    // Si no hay lista seleccionada, se muestra un error
    if (!listaActiva || !listaActiva.id) {
      setError("Primero crea o selecciona una lista");
      return;
    }

    // Si no se ha elegido producto, no se envía
    if (productoSeleccionado === "") return;

    await anadirProductoALista({
      list_id: listaActiva.id,
      product_id: productoSeleccionado,
    });

    setProductoSeleccionado("");
  };

  // Si catalogo viene null/undefined, se usa un array vacío
  const catalogoSeguro = catalogo ? catalogo : [];

  const opcionesCatalogo = catalogoSeguro.map((p) => {
    return {
      id: p.id,
      label: p.name,
    };
  });

  // Texto para mostrar la lista activa sin usar ?? ni optional chaining
  const nombreListaActiva =
    listaActiva && listaActiva.name ? listaActiva.name : "(ninguna)";

  return (
    <section className="panel">
      <div className="panelTitulo">
        <h3>Detalles y formularios</h3>
      </div>

      <div className="panelDetalle">
        <form onSubmit={enviarCrearLista} className="bloqueForm">
          <div className="bloqueTitle">Crear lista</div>

          <label>
            Nombre
            <input
              className="input"
              value={nombreLista}
              onChange={(e) => setNombreLista(e.target.value)}
              placeholder="Ej: Semana"
              disabled={cargando}
            />
          </label>

          <button className="boton" type="submit" disabled={cargando}>
            Crear
          </button>
        </form>

        <hr className="hrSuave" />

        <form onSubmit={enviarAnadir} className="bloqueForm">
          <div className="bloqueTitle">Añadir producto a la lista</div>

          <label>
            Producto
            <select
              className="input"
              value={productoSeleccionado}
              onChange={(e) => setProductoSeleccionado(e.target.value)}
              disabled={cargando || opcionesCatalogo.length === 0}
            >
              <option value="">(Selecciona...)</option>
              {opcionesCatalogo.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <div className="panelDetalleNota">
            Lista activa: <strong>{nombreListaActiva}</strong>
          </div>

          <button className="boton" type="submit" disabled={cargando}>
            Añadir
          </button>
        </form>

        {error ? <div className="errorBox">{error}</div> : ""}
      </div>
    </section>
  );
};

export default PanelDetalle;
