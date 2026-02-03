import { Link } from "react-router-dom";

const Error = () => {
  return (
    <section>
      <h2>Error</h2>
      <p>Ruta no encontrada.</p>
      <Link className="navlink" to="/">
        Volver al inicio
      </Link>
    </section>
  );
};

export default Error;
