import { useState } from "react";
import { db, storage } from "../lib/firebase";
// 👇 Importamos funciones de Firestore y Storage
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export function FormProducto() {

    // 👉 Estado del formulario (texto y número)
    const [formData, setFormData] = useState({
        titulo: "",
        descripcion: "",
        categoria: "",
        precio: "",
    });

    // 👉 Estado para guardar el archivo de imagen seleccionado
    const [imagenArchivo, setImagenArchivo] = useState(null);

    // 👉 Estados para feedback al usuario
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState("");

    // 👉 Manejador de cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Actualizamos solo el campo que cambió
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 👉 Manejador de cambio para el input de archivo
    const handleImagenChange = (e) => {
        const archivo = e.target.files[0];
        setImagenArchivo(archivo);
    };

    // 👉 Manejador de envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita recargar la página

        setMensaje("");
        // Validación básica
        if (
            !formData.titulo ||
            !formData.descripcion ||
            !formData.categoria ||
            !formData.precio ||
            !imagenArchivo
        ) {
            setMensaje("Por favor, completa todos los campos y selecciona una imagen.");
            return;
        }

        setCargando(true);

        try {
            // 1. Subir la imagen a Storage
            // Creamos una ruta única para la imagen, por ejemplo: "productos/fecha-nombrearchivo"
            const nombreArchivo = `${Date.now()}-${imagenArchivo.name}`;
            const imagenRef = ref(storage, `productos/${nombreArchivo}`);

            // Subimos el archivo binario a Storage
            await uploadBytes(imagenRef, imagenArchivo);

            // Obtenemos la URL pública de la imagen subida
            const imagenURL = await getDownloadURL(imagenRef);

            // 2. Guardar los datos en Firestore (colección "productos")
            const productosRef = collection(db, "productos");

            await addDoc(productosRef, {
                titulo: formData.titulo,
                descripcion: formData.descripcion,
                categoria: formData.categoria,
                // Convertimos el precio a número
                precio: Number(formData.precio),
                imagenURL: imagenURL,
                creadoEn: serverTimestamp(), // Fecha/hora del servidor
            });

            // 3. Limpiar formulario
            setFormData({
                titulo: "",
                descripcion: "",
                categoria: "",
                precio: "",
            });
            setImagenArchivo(null);
            // Limpiar input file manualmente
            e.target.reset?.();

            setMensaje("✅ Producto guardado correctamente.");
        } catch (error) {
            console.error("Error al guardar el producto:", error);
            setMensaje("❌ Ocurrió un error al guardar el producto.");
        } finally {
            setCargando(false);
        }
    };




    return (
        <div>
            <h1>Productos</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Título */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Título
                    </label>
                    <input
                        type="text"
                        name="titulo"
                        value={formData.titulo}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ej: Laptop básica"
                    />
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción
                    </label>
                    <textarea
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        rows={3}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Escribe una breve descripción del producto"
                    />
                </div>

                {/* Categoría */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Categoría
                    </label>
                    <input
                        type="text"
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ej: Computación, Belleza, Textil..."
                    />
                </div>

                {/* Precio */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Precio (S/)
                    </label>
                    <input
                        type="number"
                        name="precio"
                        value={formData.precio}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ej: 150.00"
                        min="0"
                        step="0.01"
                    />
                </div>

                {/* Imagen */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Imagen del producto
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImagenChange}
                        className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                    />
                </div>

                {/* Botón */}
                <button
                    type="submit"
                    disabled={cargando}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60"
                >
                    {cargando ? "Guardando..." : "Guardar producto"}
                </button>
            </form>
           
            {/* Mensaje de estado */}
            {mensaje && (
                <p className="mt-4 text-sm text-center text-gray-700">{mensaje}</p>
            )}

        </div>
    )
}