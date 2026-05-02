import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Usuario } from "../services/autenticacion";
import { cerrarSesion as apiCerrarSesion } from "../services/autenticacion";

export type { Usuario };

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

  useEffect(() => {
    try {
      const tokenGuardado = localStorage.getItem("token");
      const usuarioGuardado = localStorage.getItem("usuario");
      if (tokenGuardado && usuarioGuardado) {
        setToken(tokenGuardado);
        setUsuario(JSON.parse(usuarioGuardado));
      }
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
    } finally {
      setCargando(false);
    }

    const handleUnauthorized = () => {
      setToken(null);
      setUsuario(null);
    };
    window.addEventListener("unauthorized", handleUnauthorized);
    return () => window.removeEventListener("unauthorized", handleUnauthorized);
  }, []);

  const guardarSesion = (tokenNuevo: string, usuarioNuevo: Usuario) => {
    setToken(tokenNuevo);
    setUsuario(usuarioNuevo);
    localStorage.setItem("token", tokenNuevo);
    localStorage.setItem("usuario", JSON.stringify(usuarioNuevo));
  };

  const cerrarSesion = async () => {
    try {
      await apiCerrarSesion();
    } catch {
      // intentional: clean up regardless
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
      value={{ usuario, token, cargando, error, guardarSesion, cerrarSesion, limpiarError }}
    >
      {children}
    </ContextoAutenticacion.Provider>
  );
}
