import { usarMock } from "../mocks/index";
import {
  conversacionesMock,
  mensajesMock,
} from "../mocks/chat.mock";
import type { Conversacion, Mensaje } from "../mocks/chat.mock";

/**
 * Genera un delay simulado entre min y max milisegundos
 */
const delay = (min: number = 200, max: number = 300): Promise<void> => {
  const time = Math.random() * (max - min) + min;
  return new Promise((resolve) => setTimeout(resolve, time));
};

/**
 * Obtiene todas las conversaciones del usuario
 */
export const obtenerConversaciones = async (): Promise<
  Conversacion[]
> => {
  if (usarMock) {
    await delay();
    return JSON.parse(JSON.stringify(conversacionesMock));
  }

  // TODO: Implementar con API real cuando esté disponible
  throw new Error("API no disponible");
};

/**
 * Inicia una nueva conversación con el propietario de una propiedad
 */
export const iniciarConversacion = async (
  propiedad_id: number
): Promise<Conversacion> => {
  if (usarMock) {
    await delay();

    // Generar una nueva conversación simulada
    const nuevaConversacion: Conversacion = {
      id: Math.max(...conversacionesMock.map((c) => c.id)) + 1,
      propiedad: {
        id: propiedad_id,
        titulo: `Propiedad ${propiedad_id}`,
        foto_principal_url: `https://picsum.photos/seed/property-${propiedad_id}/400/300`,
      },
      usuario_interesado: {
        id: 1,
        nombre: "Juan Pérez",
      },
      usuario_propietario: {
        id: Math.floor(Math.random() * 10) + 2,
        nombre: `Propietario ${Math.floor(Math.random() * 10) + 1}`,
      },
      ultimo_mensaje: {
        contenido: "Nueva conversación iniciada",
        created_at: new Date().toISOString(),
      },
      mensajes_no_leidos: 0,
    };

    conversacionesMock.push(nuevaConversacion);
    return JSON.parse(JSON.stringify(nuevaConversacion));
  }

  // TODO: Implementar con API real cuando esté disponible
  throw new Error("API no disponible");
};

/**
 * Obtiene todos los mensajes de una conversación
 */
export const obtenerMensajes = async (
  conv_id: number
): Promise<Mensaje[]> => {
  if (usarMock) {
    await delay();
    // Retornar mensajes de la conversación especificada
    const mensajes = mensajesMock.filter(
      (m) => m.conversacion_id === conv_id
    );
    return JSON.parse(JSON.stringify(mensajes));
  }

  // TODO: Implementar con API real cuando esté disponible
  throw new Error("API no disponible");
};

/**
 * Envía un mensaje en una conversación
 */
export const enviarMensaje = async (
  conv_id: number,
  contenido: string
): Promise<Mensaje> => {
  if (usarMock) {
    await delay();

    // Crear un nuevo mensaje
    const nuevoMensaje: Mensaje = {
      id: Math.max(...mensajesMock.map((m) => m.id)) + 1,
      conversacion_id: conv_id,
      usuario: {
        id: 1,
        nombre: "Emiliano Duran",
      },
      contenido,
      leido: false,
      created_at: new Date().toISOString(),
    };

    // Agregarlo a los mocks
    mensajesMock.push(nuevoMensaje);

    // Actualizar la conversación
    const conversacion = conversacionesMock.find(
      (c) => c.id === conv_id
    );
    if (conversacion) {
      conversacion.ultimo_mensaje = {
        contenido,
        created_at: new Date().toISOString(),
      };
    }

    return JSON.parse(JSON.stringify(nuevoMensaje));
  }

  // TODO: Implementar con API real cuando esté disponible
  throw new Error("API no disponible");
};

/**
 * Obtiene el total de mensajes no leídos
 */
export const obtenerNoLeidas = async (): Promise<{ total: number }> => {
  if (usarMock) {
    await delay();
    const total = conversacionesMock.reduce(
      (sum, conv) => sum + conv.mensajes_no_leidos,
      0
    );
    return { total };
  }

  throw new Error("API no disponible");
};
