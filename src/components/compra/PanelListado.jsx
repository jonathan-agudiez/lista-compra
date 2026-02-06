import AccionesListado from "./AccionesListado.jsx";
import Listado from "./Listado.jsx";
import useCompra from "../../hooks/useCompra.js";
import "./panel.css";
import "./PanelListado.css";

const PanelListado = () => {
  const { listas, listaActiva, setListaActiva, cargando } = useCompra();

  const idListaActiva = listaActiva ? listaActiva.id : "";

  return (
    <section className="panel">
      <div className="panelListadoHeader">
        <div className="panelListadoHeaderRow">
          <h3>Listado</h3>
          <AccionesListado />
        </div>
      </div>

      <div className="panelListadoSelector">
        <label>
          <span>Lista activa</span>

          <select
            className="input"
            value={idListaActiva}
            onChange={(e) => {
              const id = e.target.value;

              // Se busca la lista seleccionada con un bucle normal
              let encontrada = null;

              for (let i = 0; i < listas.length; i++) {
                if (listas[i].id === id) {
                  encontrada = listas[i];
                }
              }

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
