import useSesion from "../hooks/useSesion.js";
import { Navigate } from "react-router-dom";

import ProductoCrear from "../components/productos/ProductoCrear.jsx";
import ProductoEditor from "../components/productos/ProductoEditor.jsx";
import ProductoListaAdmin from "../components/productos/ProductoListaAdmin.jsx";

import "./ProductosAdmin.css";

/*
  Página para crear, editar y borrar productos (Práctica 6.09).
*/
const ProductosAdmin = () => {
  const { user, cargando } = useSesion();

  // Se espera a que cargue la sesión
  if (cargando) {
    return null;
  }

  // Si no hay usuario, se manda a la página de acceso
  if (!user) {
    return <Navigate to="/acceso" />;
  }

  return (
    
      <section className="productosAdmin">
        <div className="productosAdminHeader">
          <h2>Edición de productos</h2>
          <p className="textMuted">
            Aquí se crean, editan y borran productos de la base de datos.
          </p>
        </div>

        <div className="productosAdminGrid">
            <div className="panel">
              <div className="panelTitulo">
                <h3>Crear</h3>
              </div>
              <div className="panelBody">
                <ProductoCrear />
              </div>
            </div>

            <div className="panel">
              <div className="panelTitulo">
                <h3>Editar / Borrar</h3>
              </div>
              <div className="panelBody">
                <ProductoListaAdmin />
                <hr className="hrSuave" />
                <ProductoEditor />
              </div>
            </div>
          </div>
      </section>
    
  );
};

export default ProductosAdmin;