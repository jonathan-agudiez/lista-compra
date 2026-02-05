import Menu from "../menu/Menu.jsx";
import ZonaSesion from "../sesion/ZonaSesion.jsx";
import "./CabeceraFila.css";

/*
  Componente para agrupar el menú y la zona de sesión
  dentro de la cabecera.
*/
const CabeceraFila = () => {
  return (
    <div className="cabeceraFila">
      <Menu />
      <ZonaSesion />
    </div>
  );
};

export default CabeceraFila;
