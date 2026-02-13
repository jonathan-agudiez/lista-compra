import { useState } from "react";
import useCompra from "../../hooks/useCompra.js";
import useNotificacion from "../../hooks/useNotificacion.js";
import "./panel.css";
import "./PanelDetalle.css";

/*
  Este panel tiene dos formularios:
  1) Crear una lista
  2) Añadir un producto del catálogo a la lista activa (con cantidad)
*/
const PanelDetalle = () => {
  const {
    cargando,
    listaActiva,
    catalogo,
    crearLista,
    anadirProductoALista,
  } = useCompra();
  const { notificar } = useNotificacion();

  // ---- Crear lista ----
  const [nombreLista, setNombreLista] = useState("");

  const enviarCrearLista = async (e) => {
    e.preventDefault();

    const nombre = nombreLista.trim();

    if (nombre !== "") {
      await crearLista({ name: nombre });
      setNombreLista("");
    }
  };

  // ---- Añadir producto existente ----
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState(1);

  const enviarAnadir = async (e) => {
    e.preventDefault();

    if (!listaActiva || !listaActiva.id) {
      notificar("Primero crea o selecciona una lista", "warning");
    } else if (productoSeleccionado === "") {
      // No se hace nada si no se selecciona producto
    } else {
      const cantidadNum = Number(cantidad);

      await anadirProductoALista({
        list_id: listaActiva.id,
        product_id: productoSeleccionado,
        quantity: cantidadNum,
      });

      setProductoSeleccionado("");
      setCantidad(1);
    }
  };

  const catalogoSeguro = catalogo ? catalogo : [];

  const opcionesCatalogo = catalogoSeguro.map((p) => {
    return {
      id: p.id,
      label: p.name,
    };
  });

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

          <button className="btn btn--secondary" type="submit" disabled={cargando}>
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

          <label>
            Cantidad
            <input
              className="input"
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              disabled={cargando}
            />
          </label>

          <div className="panelDetalleNota">
            Lista activa: <strong>{nombreListaActiva}</strong>
          </div>

          <button className="btn btn--secondary" type="submit" disabled={cargando}>
            Añadir
          </button>
        </form>
      </div>
    </section>
  );
};

export default PanelDetalle;
