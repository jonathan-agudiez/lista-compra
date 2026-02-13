import useProductos from "../../hooks/useProductos.js";
import { convertirEuros } from "../functions/functions.js";
import { convertirPeso } from "../functions/functions.js";
import "./ProductoListaAdmin.css";

/*
  Lista de productos con botones para editar y borrar.
*/
const ProductoListaAdmin = () => {
  const { catalogo, seleccionarProducto, borrarProducto, cargando } =
    useProductos();

  const productos = catalogo ? catalogo : [];

  const pedirBorrado = async (p) => {
    if (p) {
      const ok = window.confirm("¿Seguro que quieres borrar este producto?");
      if (ok) {
        await borrarProducto(p.id);
      }
    }
  };

  return (
    <div className="productoListaAdmin">
      <div className="bloqueTitle">Productos</div>

      {productos.length === 0 ? (
        <div className="productoListaEmpty">No hay productos.</div>
      ) : (
        productos.map((p) => (
          <div key={p.id} className="productoFilaAdmin">
            <div className="productoFilaInfo">
              <div className="productoFilaNombre">{p.name}</div>
              <div className="productoFilaMeta">
                <span>{p.price != null ? convertirEuros(p.price) : "—"}</span>
                <span>{p.weight != null ? convertirPeso(p.weight) + " g" : "—"}</span>
              </div>
            </div>

            <div className="productoFilaAcciones">
              <button
                className="btn btn--secondary btn--sm"
                type="button"
                onClick={() => seleccionarProducto(p)}
                disabled={cargando}
              >
                Editar
              </button>

              <button
                className="btn btn--danger btn--icon"
                type="button"
                onClick={() => pedirBorrado(p)}
                disabled={cargando}
                title="Borrar"
              >
                ✕
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductoListaAdmin;
