import { useAuth } from "../context/authContext";

export function ZonaUsuario({ onAbrirLogin }){
 //Variable para cargar la utenticacion
 const { user, logout } = useAuth();
 

      // 🔹 Usuario autenticado
  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end text-right leading-tight">
          <span className="text-sm text-white font-medium">
            {user.displayName || user.email}
          </span>
          <button
            onClick={logout}
            className="text-xs text-blue-300 hover:underline"
          >
            Cerrar sesión
          </button>
        </div>

        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt="avatar"
            referrerPolicy="no-referrer"
            className="w-9 h-9 rounded-full border border-slate-300 object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            {user.email?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
      </div>
    );
  }

  // 🔹 Invitado (no autenticado)
  return (
    <button
        onClick={ onAbrirLogin }
      className="text-sm px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
    >
      Iniciar sesión
    </button>
  );
}