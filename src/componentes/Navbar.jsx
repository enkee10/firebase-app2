import { Link } from "react-router-dom";
import { ZonaUsuario } from "./ZonaUsuario";

export default function Navbar({ onAbrirLogin }) {
  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      {/* Menú de navegación */}
      <ul className="flex gap-6">
        <li>
          <Link className="hover:text-yellow-300" to="/">Inicio</Link>
        </li>
        <li>
          <Link className="hover:text-yellow-300" to="/usuarios">Usuarios</Link>
        </li>
        <li>
          <Link className="hover:text-yellow-300" to="/post">Post</Link>
        </li>
        <li>
          <Link className="hover:text-yellow-300" to="/productos">Productos</Link>
        </li>

      </ul>

      {/* Zona del usuario alineada a la derecha */}
      <div className="flex items-center">
        <ZonaUsuario onAbrirLogin={onAbrirLogin}/>
      </div>
    </nav>
  );
}
