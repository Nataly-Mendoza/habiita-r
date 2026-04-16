import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { PaginaLogin } from "../pages/Login";
import { ProveedorAutenticacion } from "../context/ContextoAutenticacion";
import * as servicioAutenticacion from "../services/autenticacion";

vi.mock("../services/autenticacion");

describe("PaginaLogin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderizar = (componente: React.ReactNode) => {
    return render(
      <BrowserRouter>
        <ProveedorAutenticacion>{componente}</ProveedorAutenticacion>
      </BrowserRouter>
    );
  };

  it("debe renderizar los campos de correo y contraseña", () => {
    renderizar(<PaginaLogin />);

    expect(screen.getByPlaceholderText(/usuario@habitta.mx/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/)).toBeInTheDocument();
  });

  it("debe mostrar errores de validación al enviar vacío", async () => {
    renderizar(<PaginaLogin />);

    const botonEnviar = screen.getByRole("button", { name: /iniciar sesión/i });
    fireEvent.click(botonEnviar);

    await waitFor(() => {
      expect(screen.getByText(/el correo es requerido/i)).toBeInTheDocument();
    });
  });

  it("debe mostrar un error si el correo es inválido", async () => {
    renderizar(<PaginaLogin />);

    const inputCorreo = screen.getByPlaceholderText(/usuario@habitta.mx/i);
    fireEvent.change(inputCorreo, { target: { value: "correo-invalido" } });
    fireEvent.blur(inputCorreo);

    await waitFor(() => {
      expect(
        screen.getByText(/ingresa una dirección de correo válida/i)
      ).toBeInTheDocument();
    });
  });

  it("debe mostrar un error si la contraseña es muy corta", async () => {
    renderizar(<PaginaLogin />);

    const inputContrasena = screen.getByPlaceholderText(/••••••••/);
    fireEvent.change(inputContrasena, { target: { value: "corta" } });
    fireEvent.blur(inputContrasena);

    await waitFor(() => {
      expect(
        screen.getByText(/la contraseña debe tener al menos 8 caracteres/i)
      ).toBeInTheDocument();
    });
  });

  it("debe permitir mostrar/ocultar la contraseña", async () => {
    renderizar(<PaginaLogin />);

    const inputContrasena = screen.getByPlaceholderText(/••••••••/) as HTMLInputElement;
    expect(inputContrasena.type).toBe("password");

    const botonMostrar = screen.getByRole("button", { name: "" });
    fireEvent.click(botonMostrar);

    await waitFor(() => {
      expect(inputContrasena.type).toBe("text");
    });
  });

  it("debe llamar al servicio de autenticación con datos válidos", async () => {
    vi.mocked(servicioAutenticacion.iniciarSesion).mockResolvedValueOnce({
      token: "token-mock",
      usuario: {
        id: 1,
        nombre: "Juan",
        apellido: "Pérez",
        correo: "user@habitta.mx",
        rol: { id: 2, nombre: "propietario", descripcion: "" },
        notificaciones: true,
      },
    });

    renderizar(<PaginaLogin />);

    const inputCorreo = screen.getByPlaceholderText(/usuario@habitta.mx/i);
    const inputContrasena = screen.getByPlaceholderText(/••••••••/);
    const botonEnviar = screen.getByRole("button", { name: /iniciar sesión/i });

    fireEvent.change(inputCorreo, { target: { value: "user@habitta.mx" } });
    fireEvent.change(inputContrasena, { target: { value: "ValidPass123" } });
    fireEvent.click(botonEnviar);

    await waitFor(() => {
      expect(servicioAutenticacion.iniciarSesion).toHaveBeenCalledWith({
        correo: "user@habitta.mx",
        contrasena: "ValidPass123",
      });
    });
  });

  it("debe mostrar un error del API si las credenciales son incorrectas", async () => {
    vi.mocked(servicioAutenticacion.iniciarSesion).mockRejectedValueOnce({
      mensaje: "Credenciales inválidas",
      errores: { correo: ["El correo o contraseña es incorrecto"] },
    });

    renderizar(<PaginaLogin />);

    const inputCorreo = screen.getByPlaceholderText(/usuario@habitta.mx/i);
    const inputContrasena = screen.getByPlaceholderText(/••••••••/);
    const botonEnviar = screen.getByRole("button", { name: /iniciar sesión/i });

    fireEvent.change(inputCorreo, { target: { value: "user@habitta.mx" } });
    fireEvent.change(inputContrasena, { target: { value: "PassIncorrecta123" } });
    fireEvent.click(botonEnviar);

    await waitFor(() => {
      expect(
        screen.getByText(/el correo o contraseña es incorrecto/i)
      ).toBeInTheDocument();
    });
  });
});
