import ContenedorGeneral from "./components/layout/ContenedorGeneral.jsx";
import Cabecera from "./components/layout/Cabecera.jsx";
import ContenidoPrincipal from "./components/layout/ContenidoPrincipal.jsx";
import Footer from "./components/footer/Footer.jsx";

import CabeceraFila from "./components/layout/CabeceraFila.jsx";

import Notificacion from "./components/ui/Notificacion.jsx";

import { Rutas } from "./routes/Rutas.jsx";
function App() {
  return (
    <ContenedorGeneral>
      <Notificacion />

      <Cabecera>
        <CabeceraFila />
      </Cabecera>

      <ContenidoPrincipal>
        <Rutas />
      </ContenidoPrincipal>

      <Footer />
    </ContenedorGeneral>
  );
}

export default App;
