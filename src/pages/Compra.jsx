import PanelListado from "../components/compra/PanelListado.jsx";
import PanelDetalle from "../components/compra/PanelDetalle.jsx";
import ProductosListado from "../components/compra/ProductosListado.jsx";
import ProveedorProductos from "../context/ProveedorProductos.jsx";
import "./Compra.css";

const Compra = () => {
  return (
    <ProveedorProductos>
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
    </ProveedorProductos>
  );
};

export default Compra;
