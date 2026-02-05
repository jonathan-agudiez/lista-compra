import PanelListado from "../components/compra/PanelListado.jsx";
import PanelDetalle from "../components/compra/PanelDetalle.jsx";
import ProductosListado from "../components/compra/ProductosListado.jsx";
import useSesion from "../hooks/useSesion.js";
import { Navigate } from "react-router-dom";
import "./Compra.css";

const Compra = () => {
  const { user, cargando } = useSesion();

  // Se espera a que cargue la sesión
  if (cargando) {
    return null;
  }

  // Si no hay usuario, se manda a la página de acceso
  if (!user) {
    return <Navigate to="/acceso" replace />;
  }

  return (
    <section className="compra">
      <div className="compraHeader">
        <h2>Aplicación</h2>
      </div>

      <div className="panelCompra">
        <PanelListado />
        <PanelDetalle />
      </div>

      <div className="productosSeccion">
        <ProductosListado />
      </div>
    </section>
  );
};

export default Compra;
