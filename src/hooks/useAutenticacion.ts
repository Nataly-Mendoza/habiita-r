import { useState } from "react";

// Hook simple de autenticación usando mocks
export const useAutenticacion = () => {
  // Estado mock del usuario autenticado
  const [usuario] = useState({
    id: 1,
    nombre: "Juan Pérez",
    email: "juan@example.com",
  });

  // Simular si está autenticado
  const autenticado = true;

  return {
    usuario,
    autenticado,
  };
};