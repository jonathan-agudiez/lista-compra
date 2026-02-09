import { Link, NavLink } from "react-router-dom";
import "./menu.css";
import Logo from "../assets/logo-MollaMarket.svg";

const Menu = () => {
  const claseActiva = ({ isActive }) => {
    if (isActive) {
      return "navlink active";
    }
    return "navlink";
  };

  return (
    <nav className="menu">
      <div className="menuFila">
        <div className="menuBrand">
          <Link to="/">
            <img src={Logo} alt="Molla Market" className="menuLogo" />
          </Link>
        </div>

        <div className="menuLinks">
          <NavLink to="/" className={claseActiva}>
            Inicio
          </NavLink>

          <NavLink to="/compra" className={claseActiva} end={false}>
            App
          </NavLink>

          <NavLink to="/productos" className={claseActiva} end={false}>
            Productos
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Menu;
