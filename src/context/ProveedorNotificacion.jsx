import { createContext, useState } from "react";

export const NotificacionContext = createContext(null);

/*
  Contexto para avisos rápidos (success / error / warning).
*/
function ProveedorNotificacion({ children }) {
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

  const notificar = (texto, tipo) => {
    const tipoFinal = tipo ? tipo : "success";
    setMensaje({ texto: texto, tipo: tipoFinal });

    setTimeout(() => {
      setMensaje({ texto: "", tipo: "" });
    }, 3500);
  };

  const value = { mensaje: mensaje, notificar: notificar };

  return (
    <NotificacionContext.Provider value={value}>
      {children}
    </NotificacionContext.Provider>
  );
}

export default ProveedorNotificacion;
