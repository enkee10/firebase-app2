import { Routes, Route } from "react-router-dom";
import Navbar from "./componentes/navbar";
import Post from "./paginas/post";
import { Usuario } from "./paginas/Usuario";
import { Productos } from "./paginas/productos";
import { Inicio } from "./paginas/incio";

function App() {
  return (
    <>
        <Navbar />

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/usuarios" element={<Usuario />} />
        <Route path="/post" element={<Post />} />
        <Route path="/productos" element={<Productos />} />
      </Routes>
    </>
      
  );
}

export default App;
