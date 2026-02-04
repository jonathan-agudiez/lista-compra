import useCompra from "../../hooks/useCompra.js";
import "./Listado.css";
import { convertirEuros, convertirPeso } from "../functions/functions.js";

/*
  Este componente muestra los productos que hay dentro
  de la lista que está seleccionada.
*/
const Listado = () => {
  const { items, listaActiva, cargando, quitarProductoDeLista } = useCompra();
  const total = items.length;

  return (
    <div className="lista">
      <div className="listaMeta">
        <span>Total: {total}</span>

        {/* Si hay lista activa, se muestra el nombre */}
        {listaActiva && listaActiva.name ? (
          <span className="textSmall">Lista: {listaActiva.name}</span>
        ) : (
          ""
        )}
      </div>

      {/* Si no hay lista seleccionada */}
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
              {/* Si el producto tiene imagen, se muestra */}
              {row.product && row.product.image_url ? (
                <img
                  src={row.product.image_url}
                  alt={row.product && row.product.name ? row.product.name : "producto"}
                  className="itemImg"
                />
              ) : (
                ""
              )}

              <div>
                {/* Nombre del producto */}
                <div className="itemTitulo">
                  {row.product && row.product.name ? row.product.name : "(sin nombre)"}
                </div>

                <div className="itemDetalles">
                  {/* Peso si existe */}
                  {row.product && row.product.weight != null ? (
                    <span>Peso: {convertirPeso(row.product.weight)} g</span>
                  ) : (
                    ""
                  )}

                  {/* Precio si existe */}
                  {row.product && row.product.price != null ? (
                    <span>Precio: {convertirEuros(row.product.price)}</span>
                  ) : (
                    ""
                  )}
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
