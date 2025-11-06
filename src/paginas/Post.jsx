import { useState, useEffect } from 'react'
import { db } from '../lib/firebase'
import { collection, onSnapshot, query, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { useAuth } from '../context/authContext'

function Post() {

  const {user} = useAuth()
  //Variable para guardar los post
  const [post, setPost] = useState([])
  const [texto, setTexto] = useState("")

  //Variables para manejar la actualizacion
   // 👇 estado para edición en línea
  const [editId, setEditId] = useState(null);     // id del mensaje que se edita
  const [editText, setEditText] = useState("");   // texto del input mientras edito


  useEffect(() => {
    // Creamos una consulta
    const consulta = query(collection(db, "post"));

    // Escuchamos los cambios en tiempo real
    const unsubscribe = onSnapshot(consulta, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      //Actualizar post
      setPost(docs)
    })

    //Limpar unsubscribe
    return () => unsubscribe()
  }, [])

  //Agregar Post
  const agregarPost = async () => {
    if (!texto.trim()) return alert("no hay mensaje que enviar") // evitar vacíos
    await addDoc(collection(db, "post"), {
      mensaje: texto,
      createdAt: new Date(), // fecha actual
    })

    setTexto("") // limpiar input
  }

  //Elimar Post
  const borrarPost = async(id)=>{
    const documento = doc(db,"post", id)
    await deleteDoc(documento) 
  }

  // ✏️ Entrar al modo edición
  const comenzarEdicion = (m) => {
    setEditId(m.id);
    setEditText(m.mensaje ?? "");
  };

  // 💾 Guardar cambios y salir del modo edición
  const guardarEdicion = async () => {
    const id = editId;
    if (!id) return;
    const ref = doc(db, "post", id);
    await updateDoc(ref, {
      mensaje: editText,
      updatedAt: new Date(),
    });
    setEditId(null);
    setEditText("");
  };

  // (Opcional) atajos de teclado durante edición: Enter = guardar, Esc = cancelar
  const onEditKeyDown = (e) => {
    if (e.key === "Enter") guardarEdicion();
    if (e.key === "Escape") {
      setEditId(null);
      setEditText("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h2 className="text-2xl font-bold text-blue-600 mb-4">Post</h2>

      <div className="flex gap-2 mb-6">
        <input
          className='flex-1 border border-gray-300 p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-400'
          type="text"
          placeholder="Escribe tu mensaje"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && agregarPost()}
        />
        <button
          className='bg-blue-600 hover:bg-blue-700 text-black px-4 py-2 rounded shadow'
          onClick={agregarPost}
        >
          Guardar
        </button>
      </div>
      {user ? (
      <ul className="space-y-3">
            {post.map((m) => {
              //funcion que comprueba que editId fue cargado
              const enEdicion = (editId === m.id);
              return (
                <li
                  key={m.id}
                  className="p-3 bg-gray-200 rounded-md shadow-sm border border-gray-300 flex items-start justify-between gap-3"
                >
                  {/* Columna izquierda: contenido o editor */}
                  <div className="flex-1">
                    {enEdicion ? (
                      <>
                        <input
                          autoFocus
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={onEditKeyDown}
                          className="w-full p-2 border border-gray-300 rounded-md outline-blue-600 mb-1"
                          placeholder="Editar mensaje..."
                        />
                        <div className="text-xs text-gray-600">
                          (Enter = guardar, Esc = cancelar)
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-gray-900 font-medium break-words">
                          {m.mensaje}
                        </div>
                        <div className="text-xs text-gray-600">
                          {new Date(m.createdAt).toLocaleString()}
                          {m.updatedAt ? " · editado" : ""}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Columna derecha: acciones */}
                  <div className="flex items-center gap-1">
                    {enEdicion ? (
                      // 💾 Guardar (solo aparece mientras edito)
                      <button
                        onClick={guardarEdicion}
                        className="text-green-700 hover:text-green-900 p-2"
                        title="Guardar cambios"
                      >
                        💾
                      </button>
                    ) : (
                      // ✏️ Editar (solo aparece cuando NO estoy editando)
                      <button
                        onClick={() => comenzarEdicion(m)}
                        className="text-blue-700 hover:text-blue-900 p-2"
                        title="Editar mensaje"
                      >
                        ✏️
                      </button>
                    )}

                    {/* 🗑️ Borrar (siempre visible) */}
                    <button
                      onClick={() => borrarPost(m.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Eliminar mensaje"
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>):
          (
            <div>deber loguearte</div>
          )
      }
    </div>
  )
}

export default Post
