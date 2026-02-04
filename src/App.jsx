import { BrowserRouter } from "react-router-dom";

import ContenedorGeneral from "./components/layout/ContenedorGeneral.jsx";
import Cabecera from "./components/layout/Cabecera.jsx";
import ContenidoPrincipal from "./components/layout/ContenidoPrincipal.jsx";
import Footer from "./components/footer/Footer.jsx";

import CabeceraFila from "./components/layout/CabeceraFila.jsx";

import ProveedorSesion from "./context/ProveedorSesion.jsx";
import Rutas from "./routes/Rutas.jsx";

function App() {
  return (
    <BrowserRouter>
      <ProveedorSesion>
        <ContenedorGeneral>
          <Cabecera>
            <CabeceraFila />
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
