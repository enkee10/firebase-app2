// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/"
        replace
        state={{
          from: location.pathname,  // desde dónde venía
          abrirLogin: true         // señal para abrir el modal
        }}
      />
    );
  }

  return children;
}
