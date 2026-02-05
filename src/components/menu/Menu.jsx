import { Link, useLocation } from "react-router-dom";
import "./menu.css";

const Menu = () => {
  const location = useLocation();

  return (
    <nav className="menu">
      <div className="menuFila">
        <div className="menuTitulo">Lista de la compra</div>

        <div className="menuLinks">
          <Link
            to="/"
            className={location.pathname === "/" ? "navlink active" : "navlink"}
          >
            Inicio
          </Link>

          <Link
            to="/compra"
            className={
              location.pathname.startsWith("/compra") ? "navlink active" : "navlink"
            }
          >
            App
          </Link>

          <Link
            to="/productos"
            className={
              location.pathname.startsWith("/productos") ? "navlink active" : "navlink"
            }
          >
            Productos
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Menu;
