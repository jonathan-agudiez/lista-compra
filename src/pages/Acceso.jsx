import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useSesion from "../hooks/useSesion.js";
import FormularioAcceso from "../components/sesion/FormularioAcceso.jsx";
import "./Acceso.css";

const Acceso = () => {
    const { user } = useSesion();
    const navigate = useNavigate();

    useEffect(() => {
      if (user) {
        navigate("/", { replace: true });
      }
    }, [user, navigate]);

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
