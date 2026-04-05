import { usarMock } from "../mocks/index";

/**
 * Interfaz para el resultado de la generación de visualización
 */
export interface VisualizacionResultado {
  url_resultado: string;
}

/**
 * Genera una visualización mejorada de una foto usando IA
 * @param foto_id ID único de la foto
 * @param propiedad_id ID de la propiedad asociada
 * @returns Promise con la URL del resultado
 */
export const generarVisualizacion = async (
  foto_id: number,
  propiedad_id: number
): Promise<VisualizacionResultado> => {
  if (usarMock) {
    // Esperar 2 segundos como especificado en los requisitos
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Retornar URL dinámica con seed basado en foto_id y propiedad_id
    const url_resultado = `https://picsum.photos/seed/${foto_id}-${propiedad_id}/800/600`;

    return {
      url_resultado,
    };
  }

  //implementar la API cuando este disponible
  throw new Error("API no disponible");
};
