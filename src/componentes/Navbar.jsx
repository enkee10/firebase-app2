import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white p-4">
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
    </nav>
  );
}
