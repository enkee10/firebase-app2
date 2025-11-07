import React from 'react';
import { db, storage } from "../lib/firebase";
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export function ListProducto() {

    // 👉 Lista de productos traídos desde Firestore
    const [productos, setProductos] = useState([]);

    // 👉 Control de edición
    const [productoEditandoId, setProductoEditandoId] = useState(null);
    const [formEdicion, setFormEdicion] = useState({
        titulo: "",
        descripcion: "",
        categoria: "",
        precio: "",
        imagenURL: "",
    });

    // 👉 Archivo de imagen NUEVA (para edición)
    const [imagenNuevaArchivo, setImagenNuevaArchivo] = useState(null);

    // 👉 Estado para feedback
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState("");

    // 👉 Efecto para cargar los productos desde Firestore en tiempo real
    useEffect(() => {
        // Referencia a la colección "productos"
        const productosRef = collection(db, "productos");

        // Opcional: ordenar por fecha de creación (si existe el campo creadoEn)
        const q = query(productosRef, orderBy("creadoEn", "desc"));

        // onSnapshot escucha cambios en tiempo real
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setProductos(docs);
        });

        // Limpiamos la suscripción al desmontar el componente
        return () => unsubscribe();
    }, []);

    // 👉 Manejador de cambios en el formulario de edición
    const handleEdicionChange = (e) => {
        const { name, value } = e.target;

        setFormEdicion((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 👉 Manejador de cambio para la nueva imagen en edición
    const handleImagenNuevaChange = (e) => {
        const archivo = e.target.files[0];
        setImagenNuevaArchivo(archivo);
    };
    // 👉 Iniciar edición de un producto
    const empezarEdicion = (producto) => {
        setProductoEditandoId(producto.id);
        setFormEdicion({
            titulo: producto.titulo || "",
            descripcion: producto.descripcion || "",
            categoria: producto.categoria || "",
            precio: producto.precio || "",
            imagenURL: producto.imagenURL || "",
        });
        setImagenNuevaArchivo(null); // Reseteamos cualquier imagen nueva pendiente
        setMensaje("");
    };

    // 👉 Cancelar edición
    const cancelarEdicion = () => {
        setProductoEditandoId(null);
        setImagenNuevaArchivo(null);
        setMensaje("");
    };

    // 👉 Guardar cambios de edición
    const guardarCambios = async (e, productoId) => {
        e.preventDefault(); // Evita recargar la página al hacer submit

        setMensaje("");

        // Validación simple
        if (
            !formEdicion.titulo ||
            !formEdicion.descripcion ||
            !formEdicion.categoria ||
            formEdicion.precio === ""
        ) {
            setMensaje("⚠️ Completa todos los campos antes de guardar.");
            return;
        }

        setCargando(true);

        try {
            const docRef = doc(db, "productos", productoId);

            // Objeto con los datos a actualizar
            const datosActualizados = {
                titulo: formEdicion.titulo,
                descripcion: formEdicion.descripcion,
                categoria: formEdicion.categoria,
                precio: Number(formEdicion.precio),
            };

            // 🔹 Si el usuario eligió una nueva imagen, la subimos a Storage
            if (imagenNuevaArchivo) {
                const nombreArchivo = `${Date.now()}-${imagenNuevaArchivo.name}`;
                const imagenRef = ref(storage, `productos/${nombreArchivo}`);

                // Subimos archivo a Storage
                await uploadBytes(imagenRef, imagenNuevaArchivo);

                // Obtenemos la nueva URL de descarga
                const nuevaURL = await getDownloadURL(imagenRef);

                // La agregamos al objeto de actualización
                datosActualizados.imagenURL = nuevaURL;

                // (Opcional avanzado) Aquí se podría borrar la imagen anterior de Storage
                // usando la URL previa, pero lo dejamos para una versión más avanzada.
            }

            // Actualizamos el documento en Firestore
            await updateDoc(docRef, datosActualizados);

            setMensaje("✅ Producto actualizado correctamente.");
            setProductoEditandoId(null);
            setImagenNuevaArchivo(null);
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            setMensaje("❌ Ocurrió un error al actualizar el producto.");
        } finally {
            setCargando(false);
        }
    };

    // 👉 Eliminar un producto
    const eliminarProducto = async (productoId) => {
        const confirmar = window.confirm(
            "¿Seguro que deseas eliminar este producto?"
        );
        if (!confirmar) return;

        try {
            const docRef = doc(db, "productos", productoId);
            await deleteDoc(docRef);
            // onSnapshot actualizará la lista automáticamente
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            setMensaje("❌ Ocurrió un error al eliminar el producto.");
        }
    };


    return (
        <div>
            <h2>Lista de Productos</h2>
            {/* Aquí irá la lógica para listar los productos */}

            {mensaje && (
                <p className="mb-4 text-sm text-gray-700 bg-yellow-100 border border-yellow-300 px-3 py-2 rounded">
                    {mensaje}
                </p>
            )}

            {/* Si no hay productos */}
            {productos.length === 0 && (
                <p className="text-gray-600">No hay productos registrados todavía.</p>
            )}

            {/* Grid de tarjetas */}
            <div className="grid gap-4 md:grid-cols-2">
                {productos.map((producto) => {
                    const estaEditando = productoEditandoId === producto.id;

                    return (
                        <div
                            key={producto.id}
                            className="bg-white shadow-md rounded-xl p-4 flex flex-col gap-3"
                        >
                            {/* MODO EDICIÓN */}
                            {estaEditando ? (
                                <form
                                    onSubmit={(e) => guardarCambios(e, producto.id)}
                                    className="flex flex-col gap-3"
                                >
                                    <h3 className="text-lg font-semibold text-blue-700">
                                        Editar producto
                                    </h3>

                                    {/* Imagen actual */}
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">
                                            Imagen actual:
                                        </p>
                                        {formEdicion.imagenURL && (
                                            <img
                                                src={formEdicion.imagenURL}
                                                alt={formEdicion.titulo}
                                                className="w-full h-40 object-cover rounded-lg border"
                                            />
                                        )}
                                    </div>

                                    {/* Nueva imagen */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nueva imagen (opcional)
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImagenNuevaChange}
                                            className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Si eliges una nueva imagen y guardas, reemplazará a la
                                            anterior.
                                        </p>
                                    </div>

                                    {/* Título */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Título
                                        </label>
                                        <input
                                            type="text"
                                            name="titulo"
                                            value={formEdicion.titulo}
                                            onChange={handleEdicionChange}
                                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Descripción */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Descripción
                                        </label>
                                        <textarea
                                            name="descripcion"
                                            value={formEdicion.descripcion}
                                            onChange={handleEdicionChange}
                                            rows={3}
                                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                            value={formEdicion.categoria}
                                            onChange={handleEdicionChange}
                                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                            value={formEdicion.precio}
                                            onChange={handleEdicionChange}
                                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>

                                    {/* Botones de acción */}
                                    <div className="flex gap-2 justify-end mt-2">
                                        <button
                                            type="button"
                                            onClick={cancelarEdicion}
                                            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={cargando}
                                            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60"
                                        >
                                            {cargando ? "Guardando..." : "Guardar cambios"}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                // MODO VISTA NORMAL
                                <>
                                    {/* Imagen del producto */}
                                    {producto.imagenURL && (
                                        <img
                                            src={producto.imagenURL}
                                            alt={producto.titulo}
                                            className="w-full h-40 object-cover rounded-lg border"
                                        />
                                    )}

                                    {/* Texto */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {producto.titulo}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {producto.descripcion}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Categoría:{" "}
                                            <span className="font-medium">
                                                {producto.categoria}
                                            </span>
                                        </p>
                                        <p className="text-sm font-bold text-green-700 mt-1">
                                            S/ {producto.precio}
                                        </p>
                                    </div>

                                    {/* Botones */}
                                    <div className="flex gap-2 justify-end mt-2">
                                        <button
                                            onClick={() => empezarEdicion(producto)}
                                            className="px-3 py-1 rounded-lg bg-yellow-400 text-gray-800 text-sm font-semibold hover:bg-yellow-500"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => eliminarProducto(producto.id)}
                                            className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}