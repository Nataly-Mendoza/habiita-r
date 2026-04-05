export interface Mensaje {
  id: number;
  conversacion_id: number;
  usuario: {
    id: number;
    nombre: string;
  };
  contenido: string;
  leido: boolean;
  created_at: string;
}

export interface Conversacion {
  id: number;
  propiedad: {
    id: number;
    titulo: string;
    foto_principal_url: string;
  };
  usuario_interesado: {
    id: number;
    nombre: string;
  };
  usuario_propietario: {
    id: number;
    nombre: string;
  };
  ultimo_mensaje: {
    contenido: string;
    created_at: string;
  };
  mensajes_no_leidos: number;
}
