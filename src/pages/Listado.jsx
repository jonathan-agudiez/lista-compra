import useSesion from "../hooks/useSesion.js";
import "./Listado.css";

function Listado() {
  const { usuario } = useSesion();

  return (
    <section className="listado">
      <header className="listadoHeader">
        <h1 className="listadoTitulo">Listado (privado)</h1>
        <span className="listadoBadge">
          {usuario?.email ? usuario.email : "Sin usuario"}
        </span>
      </header>

      <p className="listadoTexto">
        Aquí irá tu lista de la compra. Este espacio está pensado para el
        contenido privado del usuario (items, filtros, acciones, etc.).
      </p>

      <div className="listadoHint">
        <span className="kbd">Tip</span>
        <span>
          Añade productos desde <strong>Compra</strong> o gestiona el catálogo
          desde <strong>Productos</strong>.
        </span>
      </div>
    </section>
  );
}

export default Listado;
