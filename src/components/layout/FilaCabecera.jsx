import "./FilaCabecera.css";
import Menu from "../menu/Menu.jsx";
import ZonaSesion from "../sesion/ZonaSesion.jsx";

function FilaCabecera() {
  return (
    <div className="cabeceraFila">
      <Menu />
      <ZonaSesion />
    </div>
  );
}

export default FilaCabecera;
