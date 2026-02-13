import { Link, useLocation } from "react-router-dom";
import useSesion from "../../hooks/useSesion.js";
import useRoles from "../../hooks/useRoles.js";
import "./menu.css";
import Logo from "../assets/logo-MollaMarket.svg";

const Menu = () => {
  const location = useLocation();
  const { user } = useSesion();
  const { esAdmin, cargandoRol } = useRoles();

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
          {user && !cargandoRol && esAdmin ? (
            <>
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

              <Link
                to="/roles"
                className={
                  location.pathname.startsWith("/roles")
                    ? "navlink active"
                    : "navlink"
                }
              >
                Roles
              </Link>
            </>
          ) : null}
</div>
      </div>
    </nav>
  );
};

export default Menu;
