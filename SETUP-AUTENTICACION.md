# Habitta - React Authentication Setup

## Estructura de Carpetas

```
src/
├── components/
│   ├── RutaProtegida.tsx
│   └── RutaProtegida.test.tsx
├── context/
│   └── ContextoAutenticacion.tsx
├── hooks/
│   └── useAutenticacion.ts
├── mocks/
│   └── autenticacion.mock.ts
├── pages/
│   ├── Login.tsx
│   ├── Login.test.tsx
│   ├── Registro.tsx
│   └── Registro.test.tsx
├── services/
│   └── autenticacion.ts
├── test/
│   └── setup.ts
├── types/
│   └── schemas.ts
├── App.tsx (actualizado)
└── main.tsx
```

## Instalación de Dependencias

```bash
npm install react-router react-hook-form @hookform/resolvers zod lucide-react axios
npm install -D vitest @testing-library/react @testing-library/dom jsdom
```

## Configuración de Vite

Asegúrate de que `vite.config.ts` tenga:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

## Variables de Entorno (.env.local)

```
VITE_API_URL=http://localhost:8000/api
VITE_USAR_MOCK=true  # Cambiar a false para usar API real
```

## Cómo Usar

### 1. Envolver la App con ProveedorAutenticacion

Ya está hecho en `App.tsx`:

```typescript
<BrowserRouter>
  <ProveedorAutenticacion>
    <Routes>
      {/* Tus rutas */}
    </Routes>
  </ProveedorAutenticacion>
</BrowserRouter>
```

### 2. Usar el Hook useAutenticacion

```typescript
import { useAutenticacion } from './hooks/useAutenticacion';

function MiComponente() {
  const { usuario, token, cargando, guardarSesion, cerrarSesion } = useAutenticacion();
  
  if (cargando) return <div>Cargando...</div>;
  
  return (
    <div>
      {usuario ? <p>Hola, {usuario.nombre}</p> : <p>No autenticado</p>}
    </div>
  );
}
```

### 3. Proteger Rutas

Las rutas dentro de `<RutaProtegida />` solo son accesibles si hay usuario autenticado:

```typescript
<Route element={<RutaProtegida />}>
  <Route path="/panel" element={<PaginaDashboard />} />
  <Route path="/perfil" element={<PaginaPerfil />} />
</Route>
```

## Cuentas de Prueba (con VITE_USAR_MOCK=true)

- Email: `user@habitta.mx`
- Contraseña: `User123!`

## Funciones del Servicio de Autenticación

```typescript
// Registro
registrar({ nombre, apellido, correo, telefono, contrasena, tipoUsuario })

// Login
iniciarSesion({ correo, contrasena })

// Logout
cerrarSesion(token)

// Obtener usuario actual
obtenerUsuario(token)

// Actualizar perfil
actualizarPerfil(token, datos)

// Cambiar contraseña
cambiarContrasena(token, contraseñaActual, nuevaContrasena)
```

## Flujo de Auto Completition

Las páginas de Login y Registro están completamente esciladas con visual idéntico a las de React que proporcionaste:

### Login (PaginaLogin)
- Panel izquierdo con imagen, testimonial y estadísticas
- Panel derecho con formulario
- Validación Zod en tiempo real
- Integración con servicio de autenticación
- Manejo de errores del API

### Registro (PaginaRegistro)
- Panel izquierdo con beneficios y estadísticas
- Panel derecho con formulario completo
- Selector de tipo de usuario (Comprador/Propietario)
- Validación de fortaleza de contraseña
- Requisitos de contraseña visuales
- Confirmación de contraseña
- Checkbox de términos

## Colores y Estilo

Todos los componentes usan:
- **Color primario**: #1B2B5E (azul oscuro)
- **Color secundario**: #4A5FA8 (azul)
- **Color acentu**: #C9A96E (dorado)
- **Background**: #F8F4EE (beige claro)

Todos los estilos se aplicaron inline o con Tailwind para fácil personalización.

## Testing

Ejecutar tests:

```bash
npm run test
```

Los tests incluyen:
- Validación de campos
- Manejo de errores
- Integración con servicios
- Protección de rutas

## Notas Importantes

1. **localStorage**: La sesión se persiste automáticamente en localStorage
2. **Contexto**: Todos los componentes pueden acceder al estado de autenticación sin prop drilling
3. **Mock**: Puedes desarrollar sin API cambiando VITE_USAR_MOCK=true
4. **Interceptores**: El servicio axios soporta agregar headers de autenticación automáticamente
5. **Validación**: Todas las validaciones son con Zod, tipadas en TypeScript

## Próximos Pasos

1. Implementar API real en Laravel (issues #2-#5)
2. Agregar reset de contraseña
3. Agregar verificación de email
4. Agregar Google/Apple OAuth
5. Agregar 2FA
6. Crear dashboards y vistas protegidas
