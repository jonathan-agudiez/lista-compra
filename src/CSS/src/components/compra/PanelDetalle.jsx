import { useState } from "react";
import useCompra from "../../hooks/useCompra.js";
import "./panel.css";
import "./PanelDetalle.css";

/**
 * Panel de acciones/formularios.
 * (Lo dejo en un panel aparte para tener el código más ordenado.)
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
    if (!nombreLista.trim()) return;

    await crearLista({ name: nombreLista.trim() });
    setNombreLista("");
  };

  // ---- Añadir producto existente ----
  const [productoSeleccionado, setProductoSeleccionado] = useState("");

  const enviarAnadir = async (e) => {
    e.preventDefault();

    if (!listaActiva?.id) {
      setError("Primero crea o selecciona una lista");
      return;
    }

    if (!productoSeleccionado) return;

    await anadirProductoALista({
      list_id: listaActiva.id,
      product_id: productoSeleccionado,
    });

    setProductoSeleccionado("");
  };

  const opcionesCatalogo = (catalogo ?? []).map((p) => ({
    id: p.id,
    label: p.name,
  }));

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
            Lista activa: <strong>{listaActiva?.name ?? "(ninguna)"}</strong>
          </div>

          <button className="boton" type="submit" disabled={cargando}>
            Añadir
          </button>

          <div className="panelDetalleNota">
            El catálogo viene de <span className="kbd">products</span> en Supabase.
          </div>
        </form>

        {error && <div className="errorBox">{error}</div>}

        <div className="panelDetalleNota">
          Nota: si no te aparecen datos, revisa en Supabase las políticas (RLS) y que
          las relaciones estén bien.
        </div>
      </div>
    </section>
  );
};

export default PanelDetalle;
