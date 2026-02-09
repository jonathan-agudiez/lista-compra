import { useState } from "react";
import { useCompra } from "../../hooks/useCompra.js";
import "./AccionesListado.css";

/*
  Acciones sobre el listado.
  - Nueva lista: muestra un input inline
  - Recargar: vuelve a cargar listas + catálogo
  - Borrar lista: confirmación inline (sin window.confirm)
*/
const AccionesListado = () => {
  const { cargando, cargarListas, cargarCatalogo, listaActiva, borrarLista, crearLista } =
    useCompra();

  const [modo, setModo] = useState("none"); // none | create | delete
  const [nombre, setNombre] = useState("");

  const IconOk = () => (
    <svg
      className="icon"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );

  const IconX = () => (
    <svg
      className="icon"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );

  const abrirCrear = () => {
    setModo((m) => {
      if (m === "create") {
        return "none";
      }
      return "create";
    });
  };

  const confirmarCrear = async () => {
    const limpio = nombre.trim();
    if (!limpio) return;

    await crearLista({ name: limpio });
    setNombre("");
    setModo("none");
  };

  const recargar = async () => {
    await cargarListas();
    await cargarCatalogo();
  };

  const pedirBorrado = () => {
    if (!listaActiva) return;
    setModo((m) => {
      if (m === "delete") {
        return "none";
      }
      return "delete";
    });
  };

  const confirmarBorrado = async () => {
    if (listaActiva && listaActiva.id) {
      await borrarLista({ list_id: listaActiva.id });
    }
    setModo("none");
  };

  const cancelarSegundoPanel = () => {
    setModo("none");
    setNombre("");
  };

  const abierto = modo !== "none";

  let claseCrear = "btn btn--primary";
  if (modo === "create") {
    claseCrear = "btn btn--secondary";
  }

  let claseBorrar = "btn btn--secondary";
  if (modo === "delete") {
    claseBorrar = "btn btn--danger";
  }

  let claseSegundo = "accionesListadoSegundo";
  if (abierto) {
    claseSegundo = claseSegundo + " isOpen";
  }

  let segundoContenido = null;
  if (modo === "create") {
    segundoContenido = (
      <>
        <input
          className="input accionesListadoInput"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del listado…"
          disabled={cargando}
          onKeyDown={(e) => {
            if (e.key === "Enter") confirmarCrear();
            if (e.key === "Escape") cancelarSegundoPanel();
          }}
        />

        <button
          className="btn btn--primary btn--icon"
          type="button"
          onClick={confirmarCrear}
          disabled={cargando || nombre.trim() === ""}
          title="Confirmar"
        >
          <IconOk />
        </button>
      </>
    );
  }

  if (modo === "delete") {
    segundoContenido = (
      <>
        <div className="accionesListadoMensaje">¿Borrar la lista activa?</div>

        <button
          className="btn btn--danger btn--icon"
          type="button"
          onClick={confirmarBorrado}
          disabled={cargando || !listaActiva}
          title="Confirmar borrado"
        >
          <IconOk />
        </button>

        <button
          className="btn btn--secondary btn--icon"
          type="button"
          onClick={cancelarSegundoPanel}
          disabled={cargando}
          title="Cancelar"
        >
          <IconX />
        </button>
      </>
    );
  }

  return (
    <div className="accionesListadoGrid">
      <div className="accionesListado">
        <button
          className={claseCrear}
          type="button"
          onClick={abrirCrear}
          disabled={cargando}
          title="Crear una nueva lista"
        >
          Nueva lista
        </button>

        <button
          className="btn btn--secondary"
          type="button"
          onClick={recargar}
          disabled={cargando}
          title="Recargar listas y catálogo"
        >
          Recargar
        </button>

        <button
          className={claseBorrar}
          type="button"
          onClick={pedirBorrado}
          disabled={cargando || !listaActiva}
          title="Borrar la lista activa"
        >
          Borrar lista
        </button>
      </div>

      <div className={claseSegundo}>{segundoContenido}</div>
    </div>
  );
};

export default AccionesListado;
