import { Link } from "react-router-dom";
import useSesion from "../hooks/useSesion.js";
import "./Inicio.css";

const Inicio = () => {
  const { user } = useSesion();

  return (
    <section className="inicio">

      <div className="inicioHero">
        <div className="inicioBadge">Molla Market • Del aula a tu mesa</div>

        <h2 className="inicioTitulo">
          Haz tu lista de la compra en segundos. <span className="textoSuave">Sin líos.</span>
        </h2>

        <p className="inicioSubtitulo">
          Una app simple, rápida y responsive para organizar tus compras, mantener el control
          y compartirlo con tu día a día.
        </p>

        <div className="inicioCtas">
          {user ? (
            <>
              <Link className="navlink" to="/compra">
                Ir a la app
              </Link>
              <Link className="navlink secundario" to="/productos">
                Ver productos
              </Link>
            </>
          ) : (
            <>
              <Link className="navlink" to="/acceso">
                Acceder / Registrarse
              </Link>
              <Link className="navlink secundario" to="/productos">
                Explorar catálogo
              </Link>
            </>
          )}
        </div>

      </div>

      {/* CÓMO FUNCIONA */}
      <div className="inicioComoFunciona">
        <h3 className="inicioSeccionTitulo">Cómo funciona</h3>

        <ol className="inicioPasos">
          <li>
            <span className="pasoNum">1</span>
            <div>
              <strong>Accede</strong>
              <p>Entra o regístrate en un momento.</p>
            </div>
          </li>

          <li>
            <span className="pasoNum">2</span>
            <div>
              <strong>Crea tu lista</strong>
              <p>Apunta lo que necesitas y ordénalo a tu ritmo.</p>
            </div>
          </li>

          <li>
            <span className="pasoNum">3</span>
            <div>
              <strong>Compra sin olvidos</strong>
              <p>Marca productos conforme los vas metiendo en el carro.</p>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
};

export default Inicio;
