import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useSesion from "../hooks/useSesion.js";
import usePerfil from "../hooks/usePerfil.js";
import "./Perfil.css";

const Perfil = () => {
  const { user } = useSesion();
  const { perfil, cargarPerfil, guardarPerfil } = usePerfil();

  const [fullName, setFullName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    if (user) cargarPerfil();
  }, [user]);

  useEffect(() => {
    if (perfil) {
      setFullName(perfil.full_name || "");
      setAvatar(perfil.avatar_url || "");
      setDesc(perfil.description || "");
    }
  }, [perfil]);

  const onGuardar = async () => {
    await guardarPerfil({
      full_name: fullName,
      avatar_url: avatar,
      description: desc,
    });
  };

  if (!user) {
    return <Navigate to="/acceso" replace />
  };

  return (
    <div className="pagina perfil">
      <h2>Mi Perfil</h2>

      <div className="perfil-card">
        <img
          src={avatar || "/avatar-default.png"}
          alt="avatar"
          className="perfil-avatar"
        />

        <label>
          Nombre completo
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </label>

        <label>
          Avatar URL
          <input value={avatar} onChange={(e) => setAvatar(e.target.value)} />
        </label>

        <label>
          Descripción
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} />
        </label>

        <button onClick={onGuardar}>Guardar cambios</button>
      </div>
    </div>
  );
};

export default Perfil;
