import { createContext, useEffect, useState, ReactNode } from "react";
import * as servicioAutenticacion from "../services/autenticacion";

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  fotoPerfil?: string;
  rol: {
    id: number;
    nombre: string;
    descripcion: string;
  };
  notificaciones: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContextoAutenticacionType {
  usuario: Usuario | null;
  token: string | null;
  cargando: boolean;
  error: string | null;
  guardarSesion: (token: string, usuario: Usuario) => void;
  cerrarSesion: () => Promise<void>;
  limpiarError: () => void;
}

export const ContextoAutenticacion = createContext<ContextoAutenticacionType | undefined>(
  undefined
);

export function ProveedorAutenticacion({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restaurar sesión desde localStorage al montar
  useEffect(() => {
    const restaurarSesion = async () => {
      try {
        const tokenGuardado = localStorage.getItem("token");
        const usuarioGuardado = localStorage.getItem("usuario");

        if (tokenGuardado && usuarioGuardado) {
          setToken(tokenGuardado);
          setUsuario(JSON.parse(usuarioGuardado));
        }
      } catch (err) {
        console.error("Error al restaurar sesión:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
      } finally {
        setCargando(false);
      }
    };

    restaurarSesion();
  }, []);

  const guardarSesion = (tokenNuevo: string, usuarioNuevo: Usuario) => {
    setToken(tokenNuevo);
    setUsuario(usuarioNuevo);
    localStorage.setItem("token", tokenNuevo);
    localStorage.setItem("usuario", JSON.stringify(usuarioNuevo));
  };

  const cerrarSesion = async () => {
    try {
      if (token) {
        await servicioAutenticacion.cerrarSesion(token);
      }
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    } finally {
      setToken(null);
      setUsuario(null);
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
    }
  };

  const limpiarError = () => setError(null);

  return (
    <ContextoAutenticacion.Provider
      value={{
        usuario,
        token,
        cargando,
        error,
        guardarSesion,
        cerrarSesion,
        limpiarError,
      }}
    >
      {children}
    </ContextoAutenticacion.Provider>
  );
}
