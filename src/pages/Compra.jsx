import PanelListado from "../components/compra/PanelListado.jsx";
import ProductosListado from "../components/compra/ProductosListado.jsx";
import useSesion from "../hooks/useSesion.js";
import { Navigate } from "react-router-dom";
import "./Compra.css";

const Compra = () => {
  const { user, cargando } = useSesion();

  // Mientras carga la sesión, se muestra un texto simple.
  if (cargando) {
    return (
      <section className="compra">
        <div className="compraHeader">
          <h2>Aplicación</h2>
        </div>
        <p className="textMuted">Cargando...</p>
      </section>
    );
  }

  // Si no hay usuario, se manda a la página de acceso.
  if (!user) {
    return <Navigate to="/acceso" />;
  }

  return (
    <section className="compra">
      <div className="compraHeader">
        <h2>Aplicación</h2>
      </div>

      <div className="compraGrid">
        <PanelListado />
        <ProductosListado />
      </div>
    </section>
  );
};

export default Compra;
