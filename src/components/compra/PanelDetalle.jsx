import { useState } from "react";
import useCompra from "../../hooks/useCompra.js";

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
        <h3 style={{ margin: 0 }}>Detalles y formularios</h3>
      </div>

      <div style={{ display: "grid", gap: 18 }}>
        <form onSubmit={enviarCrearLista} style={{ display: "grid", gap: 8 }}>
          <div style={{ fontWeight: 600 }}>Crear lista</div>

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

        <hr style={{ border: 0, borderTop: "1px solid rgba(255,255,255,.08)" }} />

        <form onSubmit={enviarAnadir} style={{ display: "grid", gap: 8 }}>
          <div style={{ fontWeight: 600 }}>Añadir producto a la lista</div>

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

          <div style={{ fontSize: 12, opacity: 0.75 }}>
            Lista activa: <strong>{listaActiva?.name ?? "(ninguna)"}</strong>
          </div>

          <button className="boton" type="submit" disabled={cargando}>
            Añadir
          </button>

          <div style={{ fontSize: 12, opacity: 0.75 }}>
            El catálogo viene de <code>products</code> en Supabase.
          </div>
        </form>

        {error && (
          <div
            style={{
              border: "1px solid rgba(200,0,0,.35)",
              padding: 10,
              borderRadius: 10,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ fontSize: 12, opacity: 0.75 }}>
          Nota: si no te aparecen datos, revisa en Supabase las políticas (RLS) y
          que las relaciones estén bien.
        </div>
      </div>
    </section>
  );
};

export default PanelDetalle;
