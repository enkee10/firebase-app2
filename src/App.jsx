import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./componentes/Navbar";
import Post from "./paginas/post";
import { Usuario } from "./paginas/Usuario";
import { Productos } from "./paginas/productos";
import { Inicio } from "./paginas/incio";
import Modal from "./componentes/Modal";
import Login from "./componentes/Login";
import Registro from "./componentes/Registro";
import { useState, useEffect } from "react";
import RutaProtegida from "./componentes/RutaProtegida";

function App() {

  //Variables para Manejar el Modal Login y Registro
  const [loginModalAbierto, setLoginModalAbierto] = useState(false);
  const [registroModalAbierto, setRegistroModalAbierto] = useState(false);

  //Funciones para Manejar los MOdales

  const location = useLocation();
  const navigate = useNavigate();

  // Escuchar cuando venimos de una ruta protegida
  useEffect(() => {
    if (location.state?.abrirLogin) {
      // Abrimos el modal en modo login
      setRegistroModalAbierto(false);
      setLoginModalAbierto(true);

      // (Opcional) Limpiar el flag abrirLogin para que no se reabra solo al recargar
      // pero conservamos `from` para que Login pueda usarlo
      navigate(location.pathname, {
        replace: true,
        state: { from: location.state.from }
      });
    }
  }, [location.state, location.pathname, navigate]);

  // --- Abrir / cerrar Login ---
  const abrirLogin = () => {
    setRegistroModalAbierto(false);
    setLoginModalAbierto(true);
  };

  const cerrarLogin = () => {
    setLoginModalAbierto(false);
  };

  // --- Abrir / cerrar Registro ---
  const abrirRegistro = () => {
    setLoginModalAbierto(false);
    setRegistroModalAbierto(true);
  };

  const cerrarRegistro = () => {
    setRegistroModalAbierto(false);
  };

  // --- Callbacks de éxito ---
  const manejarLoginExitoso = () => {
    setLoginModalAbierto(false);
  };

  const manejarRegistroExitoso = () => {
    // Después de registrarse → cerramos registro y abrimos login
    setRegistroModalAbierto(false);
    //setLoginModalAbierto(true);
  };

  return (
    <>

      <Navbar onAbrirLogin={abrirLogin} />

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/usuarios" element={<Usuario />} />
        <Route path="/post" element={<RutaProtegida><Post /></RutaProtegida>} />
        <Route path="/productos" element={<Productos />} />
      </Routes>

      {/* 🔹 Modal de REGISTRO */}
      {registroModalAbierto && (
        <Modal onClose={cerrarRegistro}>
          <Registro
            onRegistroExitoso={manejarRegistroExitoso}
            onLoginExitoso={cerrarRegistro}
            irALogin={() => {
              cerrarRegistro();
              abrirLogin();
            }}
          />
        </Modal>
      )}

      {/* 🔹 Modal de LOGIN */}
      {loginModalAbierto && (
        <Modal onClose={cerrarLogin}>
          <Login
            onLoginExitoso={manejarLoginExitoso}
            irARegistro={() => {
              cerrarLogin();
              abrirRegistro();
            }}
          />
        </Modal>
      )}


    </>
  );
}

export default App;
