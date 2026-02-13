import useCompra from "../../hooks/useCompra.js";
import "./Listado.css";
import { convertirEuros, convertirPeso } from "../functions/functions.js";

/*
  Se muestran los productos de la lista seleccionada.
  También se muestran los totales y un aviso si pesa mucho.
*/
const Listado = () => {
  const {
    items,
    listaActiva,
    cargando,
    quitarProductoDeLista,
    cambiarCantidad,
    pesoTotal,
    precioTotal,
    umbralCoche,
    formatearFecha,
  } = useCompra();

  const totalLineas = items.length;

  // Total de unidades (sumando cantidades)
  let totalUnidades = 0;
  for (let i = 0; i < items.length; i++) {
    const q = items[i].quantity != null ? Number(items[i].quantity) : 1;
    totalUnidades += q;
  }

  const nombreLista = listaActiva && listaActiva.name ? listaActiva.name : "";
  const fechaLista =
    listaActiva && listaActiva.created_at ? formatearFecha(listaActiva.created_at) : "";

  const avisoCoche = pesoTotal > umbralCoche;

  return (
    <div className="lista">
      <div className="listaMeta">
        <span>Productos: {totalLineas}</span>
        <span>Unidades: {totalUnidades}</span>

        {nombreLista ? <span className="textSmall">Lista: {nombreLista}</span> : ""}
        {fechaLista ? <span className="textSmall">Creada: {fechaLista}</span> : ""}
      </div>

      {!listaActiva ? (
        <div className="itemEmpty">
          No hay lista seleccionada. Crea una desde el panel de la derecha.
        </div>
      ) : totalLineas === 0 ? (
        <div className="itemEmpty">Todavía no hay productos en esta lista.</div>
      ) : (
        items.map((row) => (
          <article key={row.product_id} className="item rowHover">
            <div className="itemLeft">
              {row.product && row.product.image_url ? (
                <img
                  src={row.product.image_url}
                  alt={row.product && row.product.name ? row.product.name : "producto"}
                  className="itemImg"
                />
              ) : (
                ""
              )}

              <div className="itemInfo">
                <div className="itemTitulo">
                  {row.product && row.product.name ? row.product.name : "(sin nombre)"}
                </div>
</div>
            </div>

            <div className="itemCol itemCol--peso">
              <div className="itemColLabel">Peso</div>
              <div className="itemColValue">
                {row.product && row.product.weight != null
                  ? `${convertirPeso(row.product.weight)} g`
                  : "—"}
              </div>
            </div>

            <div className="itemCol itemCol--precio">
              <div className="itemColLabel">Precio</div>
              <div className="itemColValue">
                {row.product && row.product.price != null
                  ? convertirEuros(row.product.price)
                  : "—"}
              </div>
            </div>

            <div className="itemCantidad">
              <input
                className="input itemCantidadInput"
                type="number"
                min="1"
                aria-label="Cantidad"
                value={row.quantity != null ? row.quantity : 1}
                onChange={(e) =>
                  cambiarCantidad({
                    list_id: row.list_id,
                    product_id: row.product_id,
                    quantity: e.target.value,
                  })
                }
                disabled={cargando}
              />
            </div>

            <div className="itemAction">
              <button
                className="btn btn--danger btn--icon"
                type="button"
                onClick={() =>
                  quitarProductoDeLista({
                    list_id: row.list_id,
                    product_id: row.product_id,
                  })
                }
                disabled={cargando}
                title="Quitar de la lista"
              >
                ✕
              </button>
            </div>
          </article>
        ))
      )}

      {listaActiva ? (
        <div className="listaTotales">
          <div className="listaTotalesFila">
            <span>Peso total: {convertirPeso(pesoTotal)} g</span>
            <span>Total: {convertirEuros(precioTotal)}</span>
          </div>

          {avisoCoche ? (
            <div className="listaAviso">
              Aviso: el peso es alto, quizá sea mejor coger el coche.
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Listado;
