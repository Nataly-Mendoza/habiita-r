import { useState, useCallback, useEffect } from "react";
import {
  obtenerConversaciones,
  obtenerMensajes,
  enviarMensaje,
  obtenerNoLeidas,
} from "../services/chat";
import type { Conversacion, Mensaje } from "../mocks/chat.mock";

export interface ChatState {
  conversaciones: Conversacion[];
  mensajesActivos: Mensaje[];
  cargando: boolean;
  noLeidas: number;
  conversacionIdAbierta: number | null;
}

export interface UseChat {
  estado: ChatState;
  cargarConversaciones: () => Promise<void>;
  abrirConversacion: (id: number) => Promise<void>;
  enviar: (conv_id: number, contenido: string) => Promise<void>;
  marcarLeido: (conv_id: number) => Promise<void>;
}

/**
 * Hook personalizado para manejar el estado y lógica del chat
 */
export const useChat = (): UseChat => {
  const [estado, setEstado] = useState<ChatState>({
    conversaciones: [],
    mensajesActivos: [],
    cargando: false,
    noLeidas: 0,
    conversacionIdAbierta: null,
  });

  /**
   * Carga todas las conversaciones y no leídas
   */
  const cargarConversaciones = useCallback(async () => {
    setEstado((prev) => ({ ...prev, cargando: true }));
    try {
      const [conversaciones, noLeidas] = await Promise.all([
        obtenerConversaciones(),
        obtenerNoLeidas(),
      ]);

      setEstado((prev) => ({
        ...prev,
        conversaciones: conversaciones || [],
        noLeidas: noLeidas.total,
        cargando: false,
      }));
    } catch (error) {
      console.error("Error al cargar conversaciones:", error);
      setEstado((prev) => ({ ...prev, cargando: false }));
    }
  }, []);

  /**
   * Abre una conversación y carga sus mensajes
   */
  const abrirConversacion = useCallback(async (id: number) => {
    setEstado((prev) => ({
      ...prev,
      cargando: true,
      conversacionIdAbierta: id,
    }));

    try {
      const mensajes = await obtenerMensajes(id);
      setEstado((prev) => ({
        ...prev,
        mensajesActivos: mensajes || [],
        cargando: false,
      }));
    } catch (error) {
      console.error("Error al cargar mensajes:", error);
      setEstado((prev) => ({ ...prev, cargando: false }));
    }
  }, []);

  /**
   * Envía un mensaje a una conversación
   */
  const enviar = useCallback(async (conv_id: number, contenido: string) => {
    if (!contenido.trim()) return;

    try {
      // Agregar el mensaje al estado local inmediatamente (optimista)
      const nuevoMensajeLocal: Mensaje = {
        id: Math.max(...estado.mensajesActivos.map((m) => m.id), 0) + 1,
        conversacion_id: conv_id,
        usuario: {
          id: 1,
          nombre: "Juan Pérez",
        },
        contenido: contenido.trim(),
        leido: false,
        created_at: new Date().toISOString(),
      };

      setEstado((prev) => ({
        ...prev,
        mensajesActivos: [...prev.mensajesActivos, nuevoMensajeLocal],
      }));

      // Enviar el mensaje al servicio
      const mensajeEnviado = await enviarMensaje(conv_id, contenido);

      // Actualizar con la respuesta del servidor (ID real, timestamps, etc.)
      setEstado((prev) => ({
        ...prev,
        mensajesActivos: prev.mensajesActivos.map((m) =>
          m.id === nuevoMensajeLocal.id ? mensajeEnviado : m
        ),
      }));

      // Actualizar el último mensaje en las conversaciones
      setEstado((prev) => ({
        ...prev,
        conversaciones: prev.conversaciones.map((conv) =>
          conv.id === conv_id
            ? {
                ...conv,
                ultimo_mensaje: {
                  contenido: mensajeEnviado.contenido,
                  created_at: mensajeEnviado.created_at,
                },
              }
            : conv
        ),
      }));
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      // Remover el mensaje optimista en caso de error
      setEstado((prev) => ({
        ...prev,
        mensajesActivos: prev.mensajesActivos.slice(0, -1),
      }));
    }
  }, [estado.mensajesActivos]);

  /**
   * Marca una conversación como leída
   */
  const marcarLeido = useCallback(async (conv_id: number) => {
    // Poner mensajes_no_leidos en 0 para esa conversación
    setEstado((prev) => ({
      ...prev,
      conversaciones: prev.conversaciones.map((conv) =>
        conv.id === conv_id
          ? { ...conv, mensajes_no_leidos: 0 }
          : conv
      ),
      noLeidas: Math.max(
        0,
        prev.noLeidas -
          (prev.conversaciones.find((c) => c.id === conv_id)
            ?.mensajes_no_leidos || 0)
      ),
    }));

    // Marcar todos los mensajes de la conversación como leídos
    setEstado((prev) => ({
      ...prev,
      mensajesActivos: prev.mensajesActivos.map((msg) => ({
        ...msg,
        leido: true,
      })),
    }));

    // TODO: Llamar a API real cuando esté disponible para sincronizar
  }, []);

  /**
   * useEffect inicial: cargar conversaciones y no leídas
   */
  useEffect(() => {
    let activo = true;

    const load = async () => {
      if (!activo) return;
      await cargarConversaciones();
    };

    load();

    return () => {
      activo = false;
    };
  }, [cargarConversaciones]);

  return {
    estado,
    cargarConversaciones,
    abrirConversacion,
    enviar,
    marcarLeido,
  };
};
