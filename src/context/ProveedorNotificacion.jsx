import { createContext, useState } from "react";

const contextoNotificacion = createContext(null);

/*
  Contexto para avisos rápidos (success / error / warning).
*/
function ProveedorNotificacion({ children }) {
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

  const notificar = (texto, tipo) => {
    let tipoFinal = "success";
    if (tipo) {
      tipoFinal = tipo;
    }

    setMensaje({ texto: texto, tipo: tipoFinal });

    setTimeout(() => {
      setMensaje({ texto: "", tipo: "" });
    }, 3500);
  };

  const datosProveer = { mensaje: mensaje, notificar: notificar };

  return (
    <contextoNotificacion.Provider value={datosProveer}>
      {children}
    </contextoNotificacion.Provider>
  );
}

export { contextoNotificacion, ProveedorNotificacion };
