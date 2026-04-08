// src/hooks/useBusqueda.ts
import { useState, useEffect } from 'react';
import { buscarPropiedades, obtenerUbicaciones } from '../services/busqueda';
import type { Propiedad, Ubicacion, FiltrosBusqueda } from '../types';

export function useBusqueda() { 
    
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [cargando, setCargando] = useState(false);
  const [filtros, setFiltros] = useState<FiltrosBusqueda>({ pagina: 1 });
  const [meta, setMeta] = useState({ total: 0, pagina: 1, totalPaginas: 0 });

  const buscar = async (nuevosFiltros: FiltrosBusqueda) => {
    setCargando(true);
    try {
      const data = await buscarPropiedades(nuevosFiltros);
      setPropiedades(data.data); 
      setMeta(data.meta);
      setFiltros(nuevosFiltros);
    } catch (error) {
      console.error('Error al buscar propiedades:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerUbicaciones().then(setUbicaciones);
  }, []);

  return { propiedades, meta, ubicaciones, cargando, filtros, buscar };

} 