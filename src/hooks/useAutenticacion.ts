import { useContext } from "react";
import { ContextoAutenticacion, ContextoAutenticacionType } from "../context/ContextoAutenticacion";

export function useAutenticacion(): ContextoAutenticacionType {
  const contexto = useContext(ContextoAutenticacion);

  if (contexto === undefined) {
    throw new Error(
      "useAutenticacion debe ser usado dentro de ProveedorAutenticacion"
    );
  }

  return contexto;
}
