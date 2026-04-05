import { useState, useEffect, useRef } from "react";
import { useChat } from "../../hooks/useChat";
import { useAutenticacion } from "../../hooks/useAutenticacion";
import { ListaChats } from "./ListaChats";
import { BurbujaMensaje } from "./BurbujaMensaje";
import { IndicadorEscribiendo } from "./IndicadorEscribiendo";

export const ConversacionChat = () => {
  const { estado, abrirConversacion, enviar, marcarLeido } = useChat();
  const { usuario } = useAutenticacion();

  const [conversacionActiva, setConversacionActiva] = useState<number | null>(null);
  const [mensajeInput, setMensajeInput] = useState("");
  const [escribiendo, setEscribiendo] = useState(false);

  const mensajesRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);

  // Scroll automático al final cuando cambian los mensajes
  useEffect(() => {
    if (mensajesRef.current) {
      mensajesRef.current.scrollTop = mensajesRef.current.scrollHeight;
    }
  }, [estado.mensajesActivos]);

  // Polling cada 5 segundos para conversación activa
  useEffect(() => {
    if (conversacionActiva) {
      intervalRef.current = setInterval(async () => {
        await abrirConversacion(conversacionActiva);
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [conversacionActiva, abrirConversacion]);

  const seleccionarConversacion = async (id: number) => {
    setConversacionActiva(id);
    await abrirConversacion(id);
    await marcarLeido(id);
  };

  const enviarMensaje = async () => {
    if (!mensajeInput.trim() || !conversacionActiva) return;

    const contenido = mensajeInput.trim();
    setMensajeInput("");

    // Mostrar indicador de escribiendo brevemente
    setEscribiendo(true);
    setTimeout(() => setEscribiendo(false), 1000);

    await enviar(conversacionActiva, contenido);
  };

  const manejarKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  };

  const conversacionActual = estado.conversaciones.find(
    (c) => c.id === conversacionActiva
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Panel de lista de chats - Desktop */}
      <div className="hidden w-80 md:block">
        <ListaChats
          conversaciones={estado.conversaciones}
          onSeleccionar={seleccionarConversacion}
        />
      </div>

      {/* Panel de conversación */}
      <div className="flex flex-1 flex-col">
        {conversacionActual ? (
          <>
            {/* Header de conversación */}
            <div className="flex items-center gap-3 border-b bg-white p-4">
              {/* Botón volver en mobile */}
              <button
                onClick={() => setConversacionActiva(null)}
                className="md:hidden text-gray-600 hover:text-gray-900"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <img
                src={conversacionActual.propiedad.foto_principal_url}
                alt={conversacionActual.propiedad.titulo}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  {conversacionActual.usuario_propietario.nombre}
                </h3>
                <p className="text-sm text-gray-600">
                  {conversacionActual.propiedad.titulo}
                </p>
              </div>
            </div>

            {/* Área de mensajes */}
            <div
              ref={mensajesRef}
              className="flex-1 overflow-y-auto p-4 space-y-2"
            >
              {estado.mensajesActivos.map((mensaje) => (
                <BurbujaMensaje
                  key={mensaje.id}
                  mensaje={mensaje}
                  esMio={mensaje.usuario.id === usuario.id}
                />
              ))}

              {escribiendo && (
                <div className="flex justify-start">
                  <IndicadorEscribiendo />
                </div>
              )}
            </div>

            {/* Input de mensaje */}
            <div className="border-t bg-white p-4">
              <div className="flex gap-2">
                <textarea
                  value={mensajeInput}
                  onChange={(e) => setMensajeInput(e.target.value)}
                  onKeyPress={manejarKeyPress}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows={1}
                />
                <button
                  onClick={enviarMensaje}
                  disabled={!mensajeInput.trim() || estado.cargando}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Estado vacío */
          <div className="flex flex-1 items-center justify-center bg-white">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Selecciona una conversación
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Elige una conversación para comenzar a chatear
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};