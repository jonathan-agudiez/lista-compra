import PanelListado from "../components/compra/PanelListado.jsx";
import PanelDetalle from "../components/compra/PanelDetalle.jsx";

const Compra = () => {
  return (
    <section>
      <h2>Aplicación</h2>

      <div className="panelCompra">
        <PanelListado />
        <PanelDetalle />
      </div>
    </section>
  );
};

export default Compra;
