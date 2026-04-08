import { listadoMock, ubicacionesMock } from "../mocks/busqueda.mock";

import type { FiltrosBusqueda, Propiedad, Ubicacion } from "../types";

const USAR_MOCKS = true;

export const obtenerUbicaciones = async (): Promise<Ubicacion[]> => {
    if (USAR_MOCKS) return ubicacionesMock;
    return [];
}

export const buscarPropiedades = async (filtros: FiltrosBusqueda): Promise<{ data: Propiedad[]; meta: { total: number; pagina: number; totalPaginas: number } }> => {

    let data = [...listadoMock];

    if (filtros.tipo) {
        data = data.filter(p => p.tipo === filtros.tipo);
    }

    if (filtros.operacion) {
        data = data.filter(p => p.operacion === filtros.operacion);
    }

    if (filtros.ubicacion) {
        data = data.filter(p =>
        p.ubicacion?.toLowerCase().includes(filtros.ubicacion!.toLowerCase())
        );
    }

    if (filtros.precio_min) {
        data = data.filter(p => p.precio >= filtros.precio_min!);
    }

    if (filtros.precio_max) {
        data = data.filter(p => p.precio <= filtros.precio_max!);
    }

    const pagina = filtros.pagina || 1;
    const limite = filtros.limite || 12;

    const total = data.length;
    const inicio = (pagina - 1) * limite;

    return {
        data: data.slice(inicio, inicio + limite),
        meta: {
            total,
            pagina,
            totalPaginas: Math.ceil(total / limite)
        }
    };
}
