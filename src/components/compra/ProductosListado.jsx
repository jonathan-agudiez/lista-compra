import useProductos from "../../hooks/useProductos.js";
import useSesion from "../../hooks/useSesion.js";
import useCompra from "../../hooks/useCompra.js";
import useNotificacion from "../../hooks/useNotificacion.js";
import FiltroProductos from "./FiltroProductos.jsx";
import { convertirEuros } from "../functions/functions.js";
import { convertirPeso } from "../functions/functions.js";
import "./ProductosListado.css";

/*
  Listado del catálogo.
  Estilo coherente con la lista de admin (fila + acciones a la derecha)
*/
const ProductosListado = () => {
  const { user } = useSesion();
  const { listaActiva, anadirProductoALista } = useCompra();
  const { notificar } = useNotificacion();

  const { mostrados, cargando, error, totalMostrados, precioMedio } = useProductos();

  const IconAdd = () => (
    <svg
      className="icon"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );

  const quickAdd = async (productId) => {
    if (!listaActiva || !listaActiva.id) {
      notificar("Selecciona o crea una lista antes de añadir productos.", "warning");
      return;
    }

    await anadirProductoALista({
      list_id: listaActiva.id,
      product_id: productId,
      quantity: 1,
    });
  };

  return (
    <section className="panel">
      <div className="panelTitulo">
        <h3>Catálogo de productos</h3>
      </div>

      <div className="productosBox">
        {error ? <div className="productosError">{error}</div> : ""}

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
              <article key={p.id} className="productoFilaCatalogo">
                <div className="productoFilaInfo">
                  <div className="productoFilaNombre">{p.name}</div>

                  <div className="productoFilaMeta">
                    <span>{p.price != null ? convertirEuros(p.price) : "—"}</span>
                    <span>{p.weight != null ? convertirPeso(p.weight) + " g" : "—"}</span>
                  </div>

                  {p.description ? (
                    <div className="productoFilaDesc">{p.description}</div>
                  ) : (
                    ""
                  )}
                </div>

                <div className="productoFilaAcciones">
                  {user ? (
                    <button
                      className="btn btn--primary btn--icon"
                      type="button"
                      onClick={() => quickAdd(p.id)}
                      title="Añadir a la lista activa"
                    >
                      <IconAdd />
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductosListado;
