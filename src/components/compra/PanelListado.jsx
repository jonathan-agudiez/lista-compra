import AccionesListado from "./AccionesListado.jsx";
import Listado from "./Listado.jsx";
import useCompra from "../../hooks/useCompra.js";
import "./panel.css";
import "./PanelListado.css";

const PanelListado = () => {
  const { listas, listaActiva, setListaActiva, cargando } = useCompra();

  return (
    <section className="panel">
      <div className="panelTitulo">
        <h3>Listado</h3>
        <AccionesListado />
      </div>

      <div className="panelListadoSelector">
        <label>
          <span>Lista activa</span>
          <select
            className="input"
            value={listaActiva?.id ?? ""}
            onChange={(e) => {
              const id = e.target.value;
              const encontrada = listas.find((l) => l.id === id) ?? null;
              setListaActiva(encontrada);
            }}
            disabled={cargando || listas.length === 0}
          >
            {listas.length === 0 ? (
              <option value="">(No tienes listas)</option>
            ) : (
              listas.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))
            )}
          </select>
        </label>
      </div>

      <Listado />
    </section>
  );
};

export default PanelListado;
