import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, Routes, Route } from "react-router";
import { describe, it, expect, vi } from "vitest";
import { RutaProtegida } from "../components/RutaProtegida";
import {
  ContextoAutenticacion,
  ContextoAutenticacionType,
} from "../context/ContextoAutenticacion";

describe("RutaProtegida", () => {
  const usuarioMock = {
    id: 1,
    nombre: "Juan",
    apellido: "Pérez",
    correo: "user@habitta.mx",
    rol: { id: 2, nombre: "propietario", descripcion: "" },
    notificaciones: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const renderizar = (contexto: ContextoAutenticacionType) => {
    return render(
      <BrowserRouter>
        <ContextoAutenticacion.Provider value={contexto}>
          <Routes>
            <Route element={<RutaProtegida />}>
              <Route path="/panel" element={<div>Panel del usuario</div>} />
            </Route>
            <Route path="/login" element={<div>Página de login</div>} />
          </Routes>
        </ContextoAutenticacion.Provider>
      </BrowserRouter>
    );
  };

  it("debe mostrar pantalla de carga si cargando es true", () => {
    const contexto: ContextoAutenticacionType = {
      usuario: null,
      token: null,
      cargando: true,
      error: null,
      guardarSesion: vi.fn(),
      cerrarSesion: vi.fn(),
      limpiarError: vi.fn(),
    };

    renderizar(contexto);

    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  it("debe redirigir a /login si no hay usuario autenticado", async () => {
    const contexto: ContextoAutenticacionType = {
      usuario: null,
      token: null,
      cargando: false,
      error: null,
      guardarSesion: vi.fn(),
      cerrarSesion: vi.fn(),
      limpiarError: vi.fn(),
    };

    renderizar(contexto);

    await waitFor(() => {
      expect(screen.getByText(/página de login/i)).toBeInTheDocument();
    });
  });

  it("debe renderizar el contenido protegido si hay usuario autenticado", async () => {
    const contexto: ContextoAutenticacionType = {
      usuario: usuarioMock,
      token: "token-mock",
      cargando: false,
      error: null,
      guardarSesion: vi.fn(),
      cerrarSesion: vi.fn(),
      limpiarError: vi.fn(),
    };

    renderizar(contexto);

    await waitFor(() => {
      expect(screen.getByText(/panel del usuario/i)).toBeInTheDocument();
    });
  });

  it("debe mostrar spinner de carga con el color correcto", () => {
    const contexto: ContextoAutenticacionType = {
      usuario: null,
      token: null,
      cargando: true,
      error: null,
      guardarSesion: vi.fn(),
      cerrarSesion: vi.fn(),
      limpiarError: vi.fn(),
    };

    const { container } = renderizar(contexto);

    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });
});
