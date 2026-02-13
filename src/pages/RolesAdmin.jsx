import { useEffect } from "react";
import { Navigate } from "react-router-dom";

import useSesion from "../hooks/useSesion.js";
import useRoles from "../hooks/useRoles.js";

import "./RolesAdmin.css";

/*
  Pantalla de administración de roles.
  - Solo accesible por admin (experiencia de usuario).
  - Además, RLS protege el acceso real en Supabase.
*/
const RolesAdmin = () => {
  const { user, cargando } = useSesion();
  const { cargandoRol, esAdmin, roles, cargarRoles, cambiarRol } = useRoles();

  useEffect(() => {
    if (user && esAdmin) {
      cargarRoles();
    }
  }, [user, esAdmin]);

  if (cargando || cargandoRol) {
    return null;
  }

  if (!user) {
    return <Navigate to="/acceso" replace />;
  }

  if (!esAdmin) {
    return <Navigate to="/compra" replace />;
  }

  const onCambiarRol = async (userId, nuevoRol) => {
    await cambiarRol(userId, nuevoRol);
  };

  return (
    <div className="rolesAdmin">
      <h2>Administración de roles</h2>
      <p>Solo usuarios con rol admin pueden cambiar roles.</p>

      <div className="rolesAdminTabla">
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r.user_id}>
                <td className="rolesAdminId">{r.user_id}</td>
                <td>
                  <select
                    value={r.role}
                    onChange={(e) => onCambiarRol(r.user_id, e.target.value)}
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
    </div>
  );
};

export default RolesAdmin;
