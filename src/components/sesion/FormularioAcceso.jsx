import { useState } from "react";
import useSesion from "../../hooks/useSesion.js";
import "./formularioAcceso.css";

/**
 * Formulario base (controlado) para registro / login.
 * Está pensado para que lo modifiques a tu gusto: validaciones, mensajes, etc.
 */
const FormularioAcceso = () => {
  const { signIn, signUp, cargando, error } = useSesion();

  const [modo, setModo] = useState("login"); // "login" | "registro"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const enviar = async (e) => {
    e.preventDefault();

    if (modo === "registro") {
      await signUp({ email, password, fullName });
      return;
    }

    await signIn({ email, password });
  };

  return (
    <div className="formAccesoCard">
      <form onSubmit={enviar} className="formAcceso">
        <div className="formAccesoHeader">
          <h3 className="formAccesoTitle">Acceso</h3>

          <div className="formAccesoTabs">
            <button
              type="button"
              className="boton"
              onClick={() => setModo("login")}
              disabled={cargando}
              aria-pressed={modo === "login"}
            >
              Login
            </button>

            <button
              type="button"
              className="boton"
              onClick={() => setModo("registro")}
              disabled={cargando}
              aria-pressed={modo === "registro"}
            >
              Registro
            </button>
          </div>
        </div>

        {modo === "registro" && (
          <div className="formAccesoField">
            <label>Nombre completo</label>
            <input
              className="input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Tu nombre (display name)"
              autoComplete="name"
            />
          </div>
        )}

        <div className="formAccesoField">
          <label>Email</label>
          <input
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            autoComplete="email"
          />
        </div>

        <div className="formAccesoField">
          <label>Contraseña</label>
          <input
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            type="password"
            autoComplete={modo === "registro" ? "new-password" : "current-password"}
          />
        </div>

        <button className="boton" type="submit" disabled={cargando}>
          {modo === "registro" ? "Crear cuenta" : "Entrar"}
        </button>

        {error && <div className="formAccesoError">{error}</div>}

      </form>
    </div>
  );
};

export default FormularioAcceso;
