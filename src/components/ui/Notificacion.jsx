import { useNotificacion } from "../../hooks/useNotificacion.js";
import "./Notificacion.css";

/*
  Muestra un aviso pequeño arriba a la derecha.
*/
const Notificacion = () => {
  const { mensaje } = useNotificacion();

  const texto = mensaje && mensaje.texto ? mensaje.texto : "";
  const tipo = mensaje && mensaje.tipo ? mensaje.tipo : "";

  // No se devuelve null para evitar retornos vacíos.
  if (!texto) {
    return null;
  }

  let clase = "noti notiInfo";
  if (tipo === "success") clase = "noti notiSuccess";
  if (tipo === "error") clase = "noti notiError";
  if (tipo === "warning") clase = "noti notiWarning";

  return (
    <div className="notiWrap" aria-live="polite">
      <div className={clase}>{texto}</div>
    </div>
  );
};

export default Notificacion;
