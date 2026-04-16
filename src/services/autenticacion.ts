import axios, { AxiosError } from "axios";
import { usuarioMock, tokenMock } from "../mocks/autenticacion.mock";

const USAR_MOCK = import.meta.env.VITE_USAR_MOCK === "true";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export interface DatosRegistro {
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  contrasena: string;
  tipoUsuario?: "comprador" | "propietario";
}

export interface DatosLogin {
  correo: string;
  contrasena: string;
}

export interface RespuestaAutenticacion {
  token: string;
  usuario: any;
}

export interface ErrorAutenticacion {
  mensaje: string;
  errores?: Record<string, string[]>;
}

/**
 * Registra un nuevo usuario
 */
export async function registrar(datos: DatosRegistro): Promise<RespuestaAutenticacion> {
  if (USAR_MOCK) {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      token: tokenMock,
      usuario: {
        ...usuarioMock,
        nombre: datos.nombre,
        apellido: datos.apellido,
        correo: datos.correo,
        telefono: datos.telefono || "",
      },
    };
  }

  try {
    const respuesta = await axios.post<RespuestaAutenticacion>(
      `${API_URL}/auth/registro`,
      {
        nombre: datos.nombre,
        apellido: datos.apellido,
        correo: datos.correo,
        telefono: datos.telefono || null,
        password: datos.contrasena,
        tipo_usuario: datos.tipoUsuario || "comprador",
      }
    );
    return respuesta.data;
  } catch (error) {
    const err = error as AxiosError<ErrorAutenticacion>;
    throw {
      mensaje: err.response?.data?.mensaje || "Error al registrar",
      errores: err.response?.data?.errores || {},
    } as ErrorAutenticacion;
  }
}

/**
 * Inicia sesión con correo y contraseña
 */
export async function iniciarSesion(datos: DatosLogin): Promise<RespuestaAutenticacion> {
  if (USAR_MOCK) {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    // Validación simulada
    if (datos.correo === "user@habitta.mx" && datos.contrasena === "User123!") {
      return {
        token: tokenMock,
        usuario: usuarioMock,
      };
    }
    throw {
      mensaje: "Credenciales inválidas",
      errores: { correo: ["El correo o contraseña es incorrecto"] },
    } as ErrorAutenticacion;
  }

  try {
    const respuesta = await axios.post<RespuestaAutenticacion>(
      `${API_URL}/auth/login`,
      {
        email: datos.correo,
        password: datos.contrasena,
      }
    );
    return respuesta.data;
  } catch (error) {
    const err = error as AxiosError<ErrorAutenticacion>;
    throw {
      mensaje: err.response?.data?.mensaje || "Credenciales inválidas",
      errores: err.response?.data?.errores || { correo: ["El correo o contraseña es incorrecto"] },
    } as ErrorAutenticacion;
  }
}

/**
 * Cierra la sesión actual
 */
export async function cerrarSesion(token: string): Promise<void> {
  if (USAR_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return;
  }

  try {
    await axios.post(
      `${API_URL}/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
}

/**
 * Obtiene los datos del usuario autenticado
 */
export async function obtenerUsuario(token: string): Promise<any> {
  if (USAR_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return usuarioMock;
  }

  try {
    const respuesta = await axios.get(`${API_URL}/auth/usuario`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return respuesta.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Actualiza el perfil del usuario
 */
export async function actualizarPerfil(
  token: string,
  datos: Partial<DatosRegistro>
): Promise<any> {
  if (USAR_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return { ...usuarioMock, ...datos };
  }

  try {
    const respuesta = await axios.put(
      `${API_URL}/auth/perfil`,
      datos,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return respuesta.data;
  } catch (error) {
    throw error;
  }
}

/**
 * Cambia la contraseña del usuario
 */
export async function cambiarContrasena(
  token: string,
  contraseñaActual: string,
  nuevaContrasena: string
): Promise<void> {
  if (USAR_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return;
  }

  try {
    await axios.put(
      `${API_URL}/auth/contrasena`,
      {
        password_actual: contraseñaActual,
        nueva_password: nuevaContrasena,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    throw error;
  }
}
