import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import "./index.css";

import { ProveedorSesion } from "./context/ProveedorSesion.jsx";
import { ProveedorNotificacion } from "./context/ProveedorNotificacion.jsx";
import { ProveedorProductos } from "./context/ProveedorProductos.jsx";
import { ProveedorCompra } from "./context/ProveedorCompra.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ProveedorNotificacion>
        <ProveedorSesion>
          <ProveedorProductos>
            <ProveedorCompra>
              <App />
            </ProveedorCompra>
          </ProveedorProductos>
        </ProveedorSesion>
      </ProveedorNotificacion>
    </BrowserRouter>
  </StrictMode>
);
