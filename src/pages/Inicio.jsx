import { Link } from "react-router-dom";
import useSesion from "../hooks/useSesion.js";

const Inicio = () => {
  const { user } = useSesion();

  return (
    <section>
      <h2>Inicio</h2>
      <p>
        Proyecto base: <strong>Lista de la compra</strong> con React + Supabase.
      </p>

      <p>
        {user ? (
          <Link className="navlink" to="/compra">
            Ir a la app
          </Link>
        ) : (
          <Link className="navlink" to="/acceso">
            Acceder / Registrarse
          </Link>
        )}
      </p>

      <hr />

      <p>
        Aquí puedes colocar la parte pública de la aplicación (landing, explicación,
        etc.).
      </p>
    </section>
  );
};

export default Inicio;
