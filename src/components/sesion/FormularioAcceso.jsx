import { useState } from "react";
import { useSesion } from "../../hooks/useSesion.js";
import "./formularioAcceso.css";

/*
  Formulario para login y registro.
  Se usa el mismo formulario y se cambia el modo con botones.
*/
const FormularioAcceso = () => {
  const { signIn, signUp, cargando } = useSesion();

  const [modo, setModo] = useState("login"); // login o registro
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const enviar = async (e) => {
    e.preventDefault();

    if (modo === "registro") {
      await signUp({ email: email, password: password, fullName: fullName });
    } else {
      await signIn({ email: email, password: password });
    }
  };

  let autocompletePassword = "current-password";
  if (modo === "registro") {
    autocompletePassword = "new-password";
  }

  // Textos del botón según el modo
  let textoBoton = "Entrar";
  if (modo === "registro") {
    textoBoton = "Crear cuenta";
  }

  return (
    <div className="formAccesoCard">
      <form onSubmit={enviar} className="formAcceso">
        <div className="formAccesoHeader">
          <h3 className="formAccesoTitle">Acceso</h3>

          <div className="formAccesoTabs">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setModo("login")}
              disabled={cargando}
              aria-pressed={modo === "login"}
            >
              Login
            </button>

            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setModo("registro")}
              disabled={cargando}
              aria-pressed={modo === "registro"}
            >
              Registro
            </button>
          </div>
        </div>

        {/* En registro se muestra un campo extra */}
        {modo === "registro" ? (
          <div className="formAccesoField">
            <label>Nombre completo</label>
            <input
              className="input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Tu nombre"
              autoComplete="name"
              disabled={cargando}
            />
          </div>
        ) : (
          ""
        )}

        <div className="formAccesoField">
          <label>Email</label>
          <input
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            autoComplete="email"
            disabled={cargando}
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
            autoComplete={autocompletePassword}
            disabled={cargando}
          />
        </div>

        <button className="btn btn--primary" type="submit" disabled={cargando}>
          {textoBoton}
        </button>
</form>
    </div>
  );
};

export default FormularioAcceso;
