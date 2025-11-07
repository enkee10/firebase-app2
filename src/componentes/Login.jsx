import { useState } from "react";
import { useAuth } from "../context/authContext";

export default function Login({ onLoginExitoso }) {
    //Cargar Auth
    const { login, resetPassword, loginWithGoogle } = useAuth();
    //Estados para manejo de formulario
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //Estados para el manejo mensajes de errores
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    //hace el logueo con correo y contraseña
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMensaje("");

        try {
            await login(email, password);
            // Aquí puedes navegar al dashboard
            onLoginExitoso();

        } catch (err) {
            console.error(err);
            setError(traducirError(err.code));
        }
    };

    //Resetear Contraseña
    const handleReset = async () => {
        setError("");
        setMensaje("");
        if (!email) {
            setError("Primero escribe tu correo para enviarte el enlace.");
            return;
        }
        try {
            await resetPassword(email);
            setMensaje("Te enviamos un correo para restablecer tu contraseña.");
        } catch (err) {
            console.error(err);
            setError(traducirError(err.code));
        }
    };

    //Iniciar Sesion con Google
    const handleGoogle = async () => {
        setError("");
        setMensaje("");
        try {
            await loginWithGoogle();
            onLoginExitoso();
        } catch (err) {
            console.error(err);
            setError(traducirError(err.code));
        }
    };

    //Traducir Error
    function traducirError(code) {
        switch (code) {
            case "auth/invalid-credential":
            case "auth/wrong-password":
                return "Correo o contraseña incorrectos.";
            case "auth/user-not-found":
                return "No existe una cuenta con este correo.";
            case "auth/invalid-email":
                return "El correo no es válido.";
            default:
                return "Ocurrió un error. Intenta nuevamente.";
        }
    }

    return (
        <div className=" flex items-center justify-center bg-slate-100">
            <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-1">
                <h1 className="text-2xl font-bold mb-4 text-center">
                    Iniciar sesión
                </h1>

                {error && (
                    <p className="mb-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                        {error}
                    </p>
                )}

                {mensaje && (
                    <p className="mb-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded p-2">
                        {mensaje}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tucorreo@ejemplo.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Tu contraseña"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
                    >
                        Entrar
                    </button>
                </form>

                <div className="mt-3 flex justify-between items-center text-sm">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="text-blue-600 hover:underline"
                    >
                        ¿Olvidaste tu contraseña?
                    </button>

                    <button
                        type="button"
                        onClick={handleGoogle}
                        className="text-slate-700 border px-2 py-1 rounded-lg hover:bg-slate-50"
                    >
                        Google
                    </button>
                </div>
            </div>
        </div>
    )
}