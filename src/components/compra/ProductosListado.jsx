import useProductos from "../../hooks/useProductos.js";
import useSesion from "../../hooks/useSesion.js";
import FiltroProductos from "./FiltroProductos.jsx";
import { convertirEuros } from "../functions/functions.js";
import { convertirPeso } from "../functions/functions.js";
import "./ProductosListado.css";

/*
  Listado del catálogo (Práctica 6.08).
  La parte de filtros se deja en un componente aparte.
*/
const ProductosListado = () => {
  const { user } = useSesion();

  const { mostrados, cargando, error, totalMostrados, precioMedio } = useProductos();

  return (
    <section className="panel">
      <div className="panelTitulo">
        <h3>Catálogo de productos</h3>
      </div>

      <div className="productosBox">
        {error ? <div className="productosError">{error}</div> : ""}

        {/* Controles solo si hay usuario */}
        {user ? (
          <FiltroProductos />
        ) : (
          <div className="productosEmpty">
            Para usar filtros y ordenación hay que iniciar sesión.
          </div>
        )}

        <div className="productosResumen">
          <span>Mostrados: {totalMostrados}</span>
          <span>
            Precio medio: {totalMostrados > 0 ? convertirEuros(precioMedio) : "—"}
          </span>
        </div>

        <div className="productosLista">
          {cargando ? (
            <div className="productosEmpty">Cargando productos...</div>
          ) : mostrados.length === 0 ? (
            <div className="productosEmpty">No hay productos para mostrar.</div>
          ) : (
            mostrados.map((p) => (
              <article key={p.id} className="productoCard">
                <div className="productoTop">
                  <div className="productoNombre">{p.name}</div>

                  <div className="productoMeta">
                    <span>Peso: {p.weight != null ? convertirPeso(p.weight) + " g" : "—"}</span>
                    <span>Precio: {p.price != null ? convertirEuros(p.price)  : "—"}</span>
                  </div>
                </div>

                {p.description ? <div className="productoDesc">{p.description}</div> : ""}
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductosListado;
