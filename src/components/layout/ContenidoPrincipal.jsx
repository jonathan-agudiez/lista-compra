import "./ContenidoPrincipal.css";

const ContenidoPrincipal = ({ children }) => {
  return (
    <main className="contenidoPrincipal">
      <div className="contenidoInner container">{children}</div>
    </main>
  );
};

export default ContenidoPrincipal;
