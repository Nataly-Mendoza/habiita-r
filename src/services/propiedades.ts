
import type { Property } from "../data/mockData";
import {
  propiedadMock,
  listadoMock,
  type ListadoPropiedades,
} from "../mocks/propiedades.mock";

// ─── Config ───────────────────────────────────────────────────────────────────

const USAR_MOCK = true; // ← cambiar a false cuando el API esté listo
const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface FiltrosPropiedades {
  type?: Property["type"];
  listingType?: "sale" | "rent" | "all";
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number | "any" | "4+";
  minArea?: number;
  hasGarden?: boolean;
  hasGarage?: boolean;
  hasPool?: boolean;
  sortBy?: "newest" | "price-asc" | "price-desc" | "area-desc";
  page?: number;
}

export interface DatosCierrePropiedad {
  reason: "sold" | "rented" | "other";
  note?: string;
}

// ─── Helpers internos ─────────────────────────────────────────────────────────

const delay = () => new Promise(r => setTimeout(r, 300));

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err?.message ?? "Error en la petición");
  }
  return res.json();
}

function filtrarMock(props: Property[], filtros: FiltrosPropiedades): Property[] {
  let r = [...props];
  if (filtros.listingType && filtros.listingType !== "all")
    r = r.filter(p => p.listingType === filtros.listingType);
  if (filtros.type)
    r = r.filter(p => p.type === filtros.type);
  if (filtros.city && filtros.city !== "all")
    r = r.filter(p => p.city.toLowerCase() === filtros.city!.toLowerCase());
  if (filtros.minPrice) r = r.filter(p => p.price >= filtros.minPrice!);
  if (filtros.maxPrice) r = r.filter(p => p.price <= filtros.maxPrice!);
  if (filtros.bedrooms && filtros.bedrooms !== "any")
    r = r.filter(p => filtros.bedrooms === "4+" ? p.bedrooms >= 4 : p.bedrooms === Number(filtros.bedrooms));
  if (filtros.minArea) r = r.filter(p => p.area >= filtros.minArea!);
  if (filtros.hasGarden) r = r.filter(p => p.hasGarden);
  if (filtros.hasGarage) r = r.filter(p => p.hasGarage);
  if (filtros.hasPool)   r = r.filter(p => p.hasPool);

  const sort = filtros.sortBy ?? "newest";
  if (sort === "price-asc")  r.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") r.sort((a, b) => b.price - a.price);
  if (sort === "area-desc")  r.sort((a, b) => b.area - a.area);
  if (sort === "newest")     r.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return r;
}

// ─── API pública ──────────────────────────────────────────────────────────────

/** Obtiene una propiedad por ID */
export async function obtenerPropiedad( id: number): Promise<Property> {
  if (USAR_MOCK) {
    await delay();
    return listadoMock.data.find(p => p.id === id) ?? propiedadMock;
  }
  const res = await apiFetch<{ data: Property }>(`/propiedades/${id}`);
  return res.data;
}

/** Listado paginado de propiedades activas con filtros */
export async function obtenerPropiedades(
  filtros: FiltrosPropiedades = {}
): Promise<ListadoPropiedades> {
  if (USAR_MOCK) {
    await delay();
    const activas = listadoMock.data.filter(p => p.status === "active");
    const filtradas = filtrarMock(activas, filtros);
    const perPage = 6;
    const page = filtros.page ?? 1;
    return {
      data: filtradas.slice((page - 1) * perPage, page * perPage),
      meta: {
        pagina_actual: page,
        total_paginas: Math.ceil(filtradas.length / perPage),
        total: filtradas.length,
        por_pagina: perPage,
      },
    };
  }
  const params = new URLSearchParams();
  Object.entries(filtros).forEach(([k, v]) => {
    if (v !== undefined && v !== null) params.set(k, String(v));
  });
  return apiFetch<ListadoPropiedades>(`/propiedades?${params}`);
}

/** Crea una nueva propiedad (FormData incluye fotos) */
export async function crearPropiedad(formData: FormData): Promise<Property> {
  if (USAR_MOCK) {
    await delay();
    return { ...propiedadMock, id: Date.now() };
  }
  const res = await apiFetch<{ data: Property }>("/propiedades", {
    method: "POST",
    body: formData,
  });
  return res.data;
}

/** Actualiza una propiedad existente */
export async function actualizarPropiedad(id: number, formData: FormData): Promise<Property> {
  if (USAR_MOCK) {
    await delay();
    return listadoMock.data.find(p => p.id === id) ?? propiedadMock;
  }
  formData.append("_method", "PUT"); // Laravel method spoofing
  const res = await apiFetch<{ data: Property }>(`/propiedades/${id}`, {
    method: "POST",
    body: formData,
  });
  return res.data;
}

/** Cierra una propiedad */
export async function cerrarPropiedad(
  id: number,
  datos: DatosCierrePropiedad
): Promise<Property> {
  if (USAR_MOCK) {
    await delay();
    const p = listadoMock.data.find(p => p.id === id) ?? propiedadMock;
    return { ...p, status: "closed", closedReason: datos.reason };
  }
  const res = await apiFetch<{ data: Property }>(`/propiedades/${id}/cerrar`, {
    method: "PATCH",
    body: JSON.stringify(datos),
  });
  return res.data;
}

/** Propiedades del usuario autenticado */
export async function obtenerMisPropiedades(
  estado?: "active" | "closed"
): Promise<ListadoPropiedades> {
  if (USAR_MOCK) {
    await delay();
    const mis = listadoMock.data.filter(p => p.ownerId === "u1");
    const data = estado ? mis.filter(p => p.status === estado) : mis;
    return {
      data,
      meta: { pagina_actual: 1, total_paginas: 1, total: data.length, por_pagina: 12 },
    };
  }
  const params = estado ? `?estado=${estado}` : "";
  return apiFetch<ListadoPropiedades>(`/mis-propiedades${params}`);
}

/** Sube fotos adicionales a una propiedad */
export async function subirFotos(id: number, archivos: File[]): Promise<Property> {
  if (USAR_MOCK) {
    await delay();
    return listadoMock.data.find(p => p.id === id) ?? propiedadMock;
  }
  const formData = new FormData();
  archivos.forEach(f => formData.append("fotos[]", f));
  const res = await apiFetch<{ data: Property }>(`/propiedades/${id}/fotos`, {
    method: "POST",
    body: formData,
  });
  return res.data;
}

/** Elimina una foto por índice */
export async function eliminarFoto(
  propiedadId: string,
  fotoId: number
): Promise<{ message: string }> {
  if (USAR_MOCK) {
    await delay();
    return { message: "Foto eliminada correctamente." };
  }
  return apiFetch<{ message: string }>(
    `/propiedades/${propiedadId}/fotos/${fotoId}`,
    { method: "DELETE" }
  );
}
