import useSesion from "../hooks/useSesion.js";

function Listado() {
  const { usuario } = useSesion();

  return (
    <section className="card">
      <h1>Listado (privado)</h1>
      <p>Aquí irá tu lista de la compra.</p>
      <p style={{ fontSize: 14, opacity: 0.8 }}>Usuario: {usuario?.email || "—"}</p>
    </section>
  );
}

export default Listado;
