import { Link, useLocation } from "react-router-dom";
import "./menu.css";
import Logo from "../assets/logo-MollaMarket.svg";

const Menu = () => {
  const location = useLocation();

  return (
    <nav className="menu">
      <div className="menuFila">
        <div className="menuBrand">
          <Link to="/">
            <img
              src={Logo}
              alt="Molla Market"
              className="menuLogo"
            />
          </Link>
        </div>

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
              location.pathname.startsWith("/compra")
                ? "navlink active"
                : "navlink"
            }
          >
            App
          </Link>

          <Link
            to="/productos"
            className={
              location.pathname.startsWith("/productos")
                ? "navlink active"
                : "navlink"
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
