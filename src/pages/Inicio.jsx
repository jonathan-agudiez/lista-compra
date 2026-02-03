import { Link } from "react-router-dom";
import useSesion from "../hooks/useSesion.js";
import "./Inicio.css";

const Inicio = () => {
  const { user } = useSesion();

  return (
    <section className="inicio">
      <div className="inicioHero">
        <h2>Lista de la compra</h2>
        <p>Proyecto base con React + Supabase, interfaz moderna y responsive.</p>

        <div className="inicioCtas">
          {user ? (
            <Link className="navlink" to="/compra">
              Ir a la app
            </Link>
          ) : (
            <Link className="navlink" to="/acceso">
              Acceder / Registrarse
            </Link>
          )}
        </div>

        <hr className="hrSuave" />

        <p>
          Aquí puedes colocar la parte pública de la aplicación (landing, explicación,
          etc.).
        </p>
      </div>
    </section>
  );
};

export default Inicio;
