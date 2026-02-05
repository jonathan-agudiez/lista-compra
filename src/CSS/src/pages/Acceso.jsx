import FormularioAcceso from "../components/sesion/FormularioAcceso.jsx";
import "./Acceso.css";

const Acceso = () => {
  return (
    <section className="acceso">
      <h2>Acceso</h2>
      <p className="accesoIntro">
        Pantalla para <strong>registro</strong> e <strong>inicio de sesión</strong>.
      </p>

      <FormularioAcceso />
    </section>
  );
};

export default Acceso;
