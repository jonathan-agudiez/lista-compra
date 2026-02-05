import PanelListado from "../components/compra/PanelListado.jsx";
import PanelDetalle from "../components/compra/PanelDetalle.jsx";
import "./Compra.css";

const Compra = () => {
  return (
    <section className="compra">
      <div className="compraHeader">
        <h2>Aplicación</h2>
      </div>

      <div className="panelCompra">
        <PanelListado />
        <PanelDetalle />
      </div>
    </section>
  );
};

export default Compra;
