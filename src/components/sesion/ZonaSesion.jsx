import { Link } from "react-router-dom";
import useSesion from "../../hooks/useSesion.js";
import "./zonaSesion.css";

const ZonaSesion = () => {
  const { user, cargando, signOut } = useSesion();

  // Se obtiene un nombre para mostrar en pantalla
  let nombre = null;

  if (user && user.user_metadata && user.user_metadata.full_name) {
    nombre = user.user_metadata.full_name;
  } else if (user && user.email) {
    nombre = user.email;
  }

  return (
    <div className="zonaSesion">
      {user ? (
        <>
          <div className="usuario">
            <div className="usuarioEtiqueta">Sesión:</div>

            <div className="usuarioNombre" title={nombre ? nombre : ""}>
              {nombre}
            </div>
          </div>

          <button className="btn btn--secondary btn--sm" onClick={signOut} disabled={cargando}>
            Cerrar sesión
          </button>
        </>
      ) : (
        <>
          <div className="usuario">
            <div className="usuarioEtiqueta">Sesión:</div>
            <div className="usuarioNombre">No iniciada</div>
          </div>

          <Link className="botonLink" to="/acceso">
            <button className="btn btn--secondary">Iniciar sesión</button>
          </Link>
        </>
      )}
    </div>
  );
};

export default ZonaSesion;
