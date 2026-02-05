import useCompra from "../../hooks/useCompra.js";
import "./Listado.css";

/**
 * Listado de productos que pertenecen a la lista seleccionada.
 * Los datos vienen de Supabase (tabla shopping_list_items + products).
 */
const Listado = () => {
  const { items, listaActiva, cargando, quitarProductoDeLista } = useCompra();
  const total = items.length;

  return (
    <div className="lista">
      <div className="listaMeta">
        <span>Total: {total}</span>
        {listaActiva?.name ? <span className="textSmall">Lista: {listaActiva.name}</span> : null}
      </div>

      {!listaActiva ? (
        <div className="itemEmpty">
          No hay lista seleccionada. Crea una desde el panel de la derecha.
        </div>
      ) : total === 0 ? (
        <div className="itemEmpty">
          Todavía no hay productos en esta lista.
        </div>
      ) : (
        items.map((row) => (
          <article key={row.product_id} className="item">
            <div className="itemLeft">
              {row.product?.image_url ? (
                <img
                  src={row.product.image_url}
                  alt={row.product?.name ?? "producto"}
                  className="itemImg"
                />
              ) : null}

              <div>
                <div className="itemTitulo">{row.product?.name ?? "(sin nombre)"}</div>

                <div className="itemDetalles">
                  {row.product?.weight != null && <span>Peso: {row.product.weight}</span>}
                  {row.product?.price != null && <span>Precio: {row.product.price} €</span>}
                </div>
              </div>
            </div>

            <button
              className="boton"
              type="button"
              onClick={() =>
                quitarProductoDeLista({
                  list_id: listaActiva.id,
                  product_id: row.product_id,
                })
              }
              disabled={cargando}
            >
              Quitar
            </button>
          </article>
        ))
      )}
    </div>
  );
};

export default Listado;
