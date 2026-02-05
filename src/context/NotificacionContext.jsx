import { createContext, useState } from "react";

export const NotificacionContext = createContext(null);

function ProveedorNotificacion({ children }) {
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

  const notificar = (texto, tipo = "exito") => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje({ texto: "", tipo: "" }), 3500);
  };

  const value = { mensaje, notificar };

  return <NotificacionContext.Provider value={value}>{children}</NotificacionContext.Provider>;
}

export default ProveedorNotificacion;
