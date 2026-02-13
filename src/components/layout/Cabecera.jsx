import "./Cabecera.css";

const Cabecera = ({ children }) => {
  return (
    <header className="cabecera">
      <div className="cabeceraInner container">{children}</div>
    </header>
  );
};

export default Cabecera;
