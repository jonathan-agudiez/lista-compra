import { useState } from "react";
import useSesion from "../../hooks/useSesion.js";

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
    <form onSubmit={enviar} style={{ display: "grid", gap: 12, maxWidth: 460 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          type="button"
          className="boton"
          onClick={() => setModo("login")}
          disabled={cargando}
        >
          Login
        </button>

        <button
          type="button"
          className="boton"
          onClick={() => setModo("registro")}
          disabled={cargando}
        >
          Registro
        </button>
      </div>

      {modo === "registro" && (
        <label>
          Nombre completo
          <input
            className="input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Tu nombre (display name)"
          />
        </label>
      )}

      <label>
        Email
        <input
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@ejemplo.com"
          autoComplete="email"
        />
      </label>

      <label>
        Contraseña
        <input
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          type="password"
          autoComplete={modo === "registro" ? "new-password" : "current-password"}
        />
      </label>

      <button className="boton" type="submit" disabled={cargando}>
        {modo === "registro" ? "Crear cuenta" : "Entrar"}
      </button>

      {error && (
        <div style={{ border: "1px solid rgba(200,0,0,.35)", padding: 10, borderRadius: 10 }}>
          {error}
        </div>
      )}

      <div style={{ fontSize: 12, opacity: 0.75 }}>
        Nota: este formulario es intencionalmente simple para que lo adaptes al enunciado.
      </div>
    </form>
  );
};

export default FormularioAcceso;
