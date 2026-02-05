import { Link } from "react-router-dom";
import "./Error.css";

const Error = () => {
  return (
    <section className="errorPage">
      <h2>Error</h2>
      <p>Ruta no encontrada.</p>
      <Link className="navlink" to="/">
        Volver al inicio
      </Link>
    </section>
  );
};

export default Error;
