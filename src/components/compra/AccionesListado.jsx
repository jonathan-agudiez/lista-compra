import useCompra from "../../hooks/useCompra.js";
import "./AccionesListado.css";

/*
  Acciones sobre el listado.
  Se deja recargar y borrar lista (si hay lista activa).
*/
const AccionesListado = () => {
  const { cargando, cargarListas, cargarCatalogo, listaActiva, borrarLista } =
    useCompra();

  const recargar = async () => {
    await cargarListas();
    await cargarCatalogo();
  };

  const borrar = async () => {
    if (!listaActiva || !listaActiva.id) return;

    const ok = window.confirm("¿Borrar la lista activa?");
    if (!ok) return;

    await borrarLista({ list_id: listaActiva.id });
  };

  return (
    <div className="accionesListado">
      <button className="boton" type="button" onClick={recargar} disabled={cargando}>
        Recargar
      </button>

      <button
        className="boton"
        type="button"
        onClick={borrar}
        disabled={cargando || !listaActiva}
      >
        Borrar lista
      </button>
    </div>
  );
};

export default AccionesListado;
