// src/components/Dashboard.jsx
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">
          No hay usuario. (Deberías redirigir al login aquí)
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-2">
          Bienvenido, {user.displayName || user.email}
        </h1>

        <p className="text-sm text-slate-600 mb-4">
          UID: <span className="font-mono">{user.uid}</span>
        </p>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg transition"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
