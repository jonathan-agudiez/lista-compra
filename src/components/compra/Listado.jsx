import { useCompra } from "../../hooks/useCompra.js";
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
    let q = 1;
    if (items[i].quantity != null) {
      q = Number(items[i].quantity);
    }
    totalUnidades += q;
  }

  let nombreLista = "";
  if (listaActiva) {
    if (listaActiva.name) {
      nombreLista = listaActiva.name;
    }
  }

  let fechaLista = "";
  if (listaActiva) {
    if (listaActiva.created_at) {
      fechaLista = formatearFecha(listaActiva.created_at);
    }
  }

  const avisoCoche = pesoTotal > umbralCoche;

  let metaNombre = null;
  if (nombreLista) {
    metaNombre = <span className="textSmall">Lista: {nombreLista}</span>;
  }

  let metaFecha = null;
  if (fechaLista) {
    metaFecha = <span className="textSmall">Creada: {fechaLista}</span>;
  }

  let contenidoLista = null;
  if (!listaActiva) {
    contenidoLista = (
      <div className="itemEmpty">
        No hay lista seleccionada. Crea una desde el panel de la derecha.
      </div>
    );
  } else if (totalLineas === 0) {
    contenidoLista = <div className="itemEmpty">Todavía no hay productos en esta lista.</div>;
  } else {
    contenidoLista = items.map((row) => {
      let tituloProducto = "(sin nombre)";
      let altImg = "producto";
      let imgUrl = "";
      let textoPeso = "—";
      let textoPrecio = "—";
      let cantidad = 1;

      if (row.quantity != null) {
        cantidad = row.quantity;
      }

      if (row.product) {
        if (row.product.name) {
          tituloProducto = row.product.name;
          altImg = row.product.name;
        }
        if (row.product.image_url) {
          imgUrl = row.product.image_url;
        }
        if (row.product.weight != null) {
          textoPeso = convertirPeso(row.product.weight) + " g";
        }
        if (row.product.price != null) {
          textoPrecio = convertirEuros(row.product.price);
        }
      }

      let imagen = null;
      if (imgUrl) {
        imagen = <img src={imgUrl} alt={altImg} className="itemImg" />;
      }

      return (
        <article key={row.product_id} className="item rowHover">
          <div className="itemLeft">
            {imagen}

            <div className="itemInfo">
              <div className="itemTitulo">{tituloProducto}</div>
            </div>
          </div>

          <div className="itemCol itemCol--peso">
            <div className="itemColLabel">Peso</div>
            <div className="itemColValue">{textoPeso}</div>
          </div>

          <div className="itemCol itemCol--precio">
            <div className="itemColLabel">Precio</div>
            <div className="itemColValue">{textoPrecio}</div>
          </div>

          <div className="itemCantidad">
            <input
              className="input itemCantidadInput"
              type="number"
              min="1"
              aria-label="Cantidad"
              value={cantidad}
              onChange={(e) => {
                cambiarCantidad({
                  list_id: row.list_id,
                  product_id: row.product_id,
                  quantity: e.target.value,
                });
              }}
              disabled={cargando}
            />
          </div>

          <div className="itemAction">
            <button
              className="btn btn--danger btn--icon"
              type="button"
              onClick={() => {
                quitarProductoDeLista({
                  list_id: row.list_id,
                  product_id: row.product_id,
                });
              }}
              disabled={cargando}
              title="Quitar de la lista"
            >
              ✕
            </button>
          </div>
        </article>
      );
    });
  }

  let bloqueTotales = null;
  if (listaActiva) {
    let aviso = null;
    if (avisoCoche) {
      aviso = (
        <div className="listaAviso">Aviso: el peso es alto, quizá sea mejor coger el coche.</div>
      );
    }

    bloqueTotales = (
      <div className="listaTotales">
        <div className="listaTotalesFila">
          <span>Peso total: {convertirPeso(pesoTotal)} g</span>
          <span>Total: {convertirEuros(precioTotal)}</span>
        </div>

        {aviso}
      </div>
    );
  }

  return (
    <div className="lista">
      <div className="listaMeta">
        <span>Productos: {totalLineas}</span>
        <span>Unidades: {totalUnidades}</span>
        {metaNombre}
        {metaFecha}
      </div>

      {contenidoLista}

      {bloqueTotales}
    </div>
  );
};

export default Listado;
