
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

import useSesion from "../hooks/useSesion.js";
import useRoles from "../hooks/useRoles.js";

import "./RolesAdmin.css";

const RolesAdmin = () => {
  const { user, cargando } = useSesion();
  const { cargandoRol, esAdmin, roles, cargarRoles, cambiarRol } = useRoles();

  useEffect(() => {
    if (user && esAdmin) {
      cargarRoles();
    }
  }, [user, esAdmin]);

  if (cargando || cargandoRol) return null;

  if (!user) return <Navigate to="/acceso" replace />;
  if (!esAdmin) return <Navigate to="/compra" replace />;

  const onCambiar = async (userId, nuevoRol) => {
    await cambiarRol(userId, nuevoRol);
  };

  const nombreVisible = (r) => {
    if (r.display_name && r.display_name.trim() !== "") return r.display_name;
    if (r.email && r.email.trim() !== "") return r.email;
    return "Sin nombre";
  };

  return (
    <div className="pagina roles-admin">
      <h2>Administración de roles</h2>

      <table className="tabla-roles">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>UUID</th>
            <th className="col-rol">Rol</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((r) => (
            <tr key={r.user_id}>
              <td>{nombreVisible(r)}</td>

              <td style={{ fontFamily: "monospace" }}>
                {r.user_id}
              </td>

              <td className="col-rol">
                <select
                  value={r.role}
                  onChange={(e) => onCambiar(r.user_id, e.target.value)}
                >
                  <option value="usuario">usuario</option>
                  <option value="admin">admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RolesAdmin;
