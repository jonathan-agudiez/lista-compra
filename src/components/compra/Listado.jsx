import useCompra from "../../hooks/useCompra.js";

/**
 * Listado de productos que pertenecen a la lista seleccionada.
 * Los datos vienen de Supabase (tabla shopping_list_items + products).
 */
const Listado = () => {
  const { items, listaActiva, cargando, quitarProductoDeLista } = useCompra();
  const total = items.length;

  return (
    <div className="lista">
      <div style={{ fontSize: 12, opacity: 0.7 }}>Total: {total}</div>

      {!listaActiva ? (
        <div style={{ opacity: 0.75 }}>
          No hay lista seleccionada. Crea una desde el panel de la derecha.
        </div>
      ) : total === 0 ? (
        <div style={{ opacity: 0.75 }}>
          Todavía no hay productos en esta lista.
        </div>
      ) : (
        items.map((row) => (
          <article key={row.product_id} className="item">
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {row.product?.image_url ? (
                <img
                  src={row.product.image_url}
                  alt={row.product?.name ?? "producto"}
                  style={{ width: 150, height: 150, objectFit: "cover", borderRadius: 8 }}
                />
              ) : null}

              <div>
                <div style={{ fontWeight: 600 }}>
                  {row.product?.name ?? "(sin nombre)"}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    opacity: 0.7,
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
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
