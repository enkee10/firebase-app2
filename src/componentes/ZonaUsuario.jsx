// src/components/ZonaUsuario.jsx
import { useAuth } from "../context/authContext";

export function ZonaUsuario({ onAbrirLogin }) {
  // Variable para cargar la autenticación
  const { user, logout } = useAuth();

  // 🔹 Usuario autenticado
  if (user) {
    // 🔹 Tomamos primero el username de Firestore, luego displayName y luego email
    const displayName =
      user.username ||        // viene de Firestore
      user.displayName ||     // viene de Google Auth, si existe
      user.email ||           // fallback
      "Usuario";

    // 🔹 Avatar: primero el de Firestore, luego el de Auth
    const avatarUrl =
      user.avatar ||          // de Firestore
      user.photoURL || "";    // de Auth (Google)

    const inicial =
      displayName?.charAt(0).toUpperCase() ||
      user.email?.charAt(0).toUpperCase() ||
      "U";

    return (
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end text-right leading-tight">
          <span className="text-sm text-white font-medium">
            {displayName}
          </span>
          <button
            onClick={logout}
            className="text-xs text-blue-300 hover:underline"
          >
            Cerrar sesión
          </button>
        </div>

        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="avatar"
            referrerPolicy="no-referrer"
            className="w-9 h-9 rounded-full border border-slate-300 object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            {inicial}
          </div>
        )}
      </div>
    );
  }

  // 🔹 Invitado (no autenticado)
  return (
    <button
      onClick={onAbrirLogin}
      className="text-sm px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
    >
      Iniciar sesión
    </button>
  );
}
