import { BrowserRouter } from "react-router-dom";

import ContenedorGeneral from "./components/layout/ContenedorGeneral.jsx";
import Cabecera from "./components/layout/Cabecera.jsx";
import ContenidoPrincipal from "./components/layout/ContenidoPrincipal.jsx";
import Footer from "./components/footer/Footer.jsx";

import Menu from "./components/menu/Menu.jsx";
import ZonaSesion from "./components/sesion/ZonaSesion.jsx";

import ProveedorSesion from "./context/ProveedorSesion.jsx";
import Rutas from "./routes/Rutas.jsx";

function App() {
  return (
    <BrowserRouter>
      <ProveedorSesion>
        <ContenedorGeneral>
          <Cabecera>
            <div className="cabeceraFila">
              <Menu />
              <ZonaSesion />
            </div>
          </Cabecera>

          <ContenidoPrincipal>
            <Rutas />
          </ContenidoPrincipal>

          <Footer />
        </ContenedorGeneral>
      </ProveedorSesion>
    </BrowserRouter>
  );
}

export default App;
