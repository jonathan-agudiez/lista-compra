import { Link } from "react-router-dom";
import useSesion from "../../hooks/useSesion.js";
import "./zonaSesion.css";

const ZonaSesion = () => {
  const { user, cargando, signOut } = useSesion();

  const nombre = user?.user_metadata?.full_name || user?.email || null;

  return (
    <div className="zonaSesion">
      {user ? (
        <>
          <div className="usuario">
            <div className="usuarioEtiqueta">Sesión:</div>
            <div className="usuarioNombre" title={nombre ?? ""}>
              {nombre}
            </div>
          </div>

          <button className="boton" onClick={signOut} disabled={cargando}>
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
            <button className="boton">Iniciar sesión</button>
          </Link>
        </>
      )}
    </div>
  );
};

export default ZonaSesion;
