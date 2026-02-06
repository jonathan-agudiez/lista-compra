import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSupabase from "../hooks/useSupabase.js";
import useNotificacion from "../hooks/useNotificacion.js";

export const contextoSesion = createContext(null);

const ProveedorSesion = ({ children }) => {
  const { crearCuentaSupa, iniciarSesionSupa, obtenerUsuarioSupa, cerrarSesionSupa, suscripcion } = useSupabase();
  const { notificar } = useNotificacion();
  const navegar = useNavigate();

  const sesionInicial = { email: "", password: "", name: "" };

  const [datosSesion, setDatosSesion] = useState(sesionInicial);
  const [usuario, setUsuario] = useState(null);
  const [sesionIniciada, setSesionIniciada] = useState(false);

  const crearCuenta = async () => {
    try {
      await crearCuentaSupa(datosSesion);
      notificar("Recibirás un correo para confirmar la cuenta.");
      setDatosSesion(sesionInicial);
    } catch (error) {
      notificar(error.message, "error");
    }
  };

  const iniciarSesion = async () => {
    try {
      await iniciarSesionSupa(datosSesion);
      notificar("Sesión iniciada correctamente.");
      setDatosSesion(sesionInicial);
    } catch (error) {
      notificar(error.message, "error");
    }
  };

  const cerrarSesion = async () => {
    try {
      await cerrarSesionSupa();
      setDatosSesion(sesionInicial);
      setUsuario(null);
      setSesionIniciada(false);
      navegar("/");
      notificar("Sesión cerrada correctamente.");
    } catch (error) {
      notificar(error.message, "error");
    }
  };

  const obtenerUsuario = async () => {
    try {
      const user = await obtenerUsuarioSupa();
      if (user) {
        setUsuario(user);
      } else {
        notificar("No se encuentra el usuario actual", "error");
      }
    } catch (error) {
      notificar(error.message, "error");
    }
  };

  const actualizarDato = (evento) => {
    const { name, value } = evento.target;
    setDatosSesion({ ...datosSesion, [name]: value });
  };

  useEffect(() => {
    const subscription = suscripcion((_event, session) => {
      if (session) {
        setSesionIniciada(true);
        navegar("/listado");
        obtenerUsuario();
      } else {
        setSesionIniciada(false);
        setUsuario(null);
      }
    });

    return () => subscription?.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const datosProveer = {
    crearCuenta,
    iniciarSesion,
    cerrarSesion,
    actualizarDato,
    datosSesion,
    sesionIniciada,
    usuario,
  };

  return <contextoSesion.Provider value={datosProveer}>{children}</contextoSesion.Provider>;
};

export default ProveedorSesion;
