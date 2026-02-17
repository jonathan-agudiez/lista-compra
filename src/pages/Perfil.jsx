import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useSesion from "../hooks/useSesion.js";
import usePerfil from "../hooks/usePerfil.js";
import "./Perfil.css";

const AVATARES = [
  "https://gilkqqavnomidrspecwa.supabase.co/storage/v1/object/public/Eccomerce/avatar/01_avatar.png",
  "https://gilkqqavnomidrspecwa.supabase.co/storage/v1/object/public/Eccomerce/avatar/02_avatar.png",
  "https://gilkqqavnomidrspecwa.supabase.co/storage/v1/object/public/Eccomerce/avatar/03_avatar.png",
  "https://gilkqqavnomidrspecwa.supabase.co/storage/v1/object/public/Eccomerce/avatar/04_avatar.png",
  "https://gilkqqavnomidrspecwa.supabase.co/storage/v1/object/public/Eccomerce/avatar/05_avatar.png",
  "https://gilkqqavnomidrspecwa.supabase.co/storage/v1/object/public/Eccomerce/avatar/06_avatar.png",
  "https://gilkqqavnomidrspecwa.supabase.co/storage/v1/object/public/Eccomerce/avatar/07_avatar.png",
  "https://gilkqqavnomidrspecwa.supabase.co/storage/v1/object/public/Eccomerce/avatar/08_avatar.png",
];

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
    return <Navigate to="/acceso" replace />;
  }

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
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </label>

        <div className="perfil-avatarSelector">
          <div className="perfil-label">Avatar</div>
          <div className="perfil-help">
            Selecciona uno de los avatares (Fraggle Rock) disponibles.
          </div>

          <div className="avatar-grid">
            {AVATARES.map((url) => {
              const activo = avatar === url;

              return (
                <button
                  key={url}
                  type="button"
                  className={activo ? "avatar-item active" : "avatar-item"}
                  onClick={() => setAvatar(url)}
                >
                  <img src={url} alt="avatar" />
                </button>
              );
            })}
          </div>
        </div>

        <label>
          Descripción
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </label>

        <button onClick={onGuardar}>Guardar cambios</button>
      </div>
    </div>
  );
};

export default Perfil;
