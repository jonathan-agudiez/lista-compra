import useCompra from "../../hooks/useCompra.js";

/**
 * Acciones sobre el listado.
 * En esta práctica dejo dos botones simples: recargar y crear lista.
 */
const AccionesListado = () => {
  const { cargando, cargarListas, cargarCatalogo } = useCompra();

  const recargar = async () => {
    await cargarListas();
    await cargarCatalogo();
  };

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <button className="boton" type="button" onClick={recargar} disabled={cargando}>
        Recargar
      </button>
    </div>
  );
};

export default AccionesListado;
