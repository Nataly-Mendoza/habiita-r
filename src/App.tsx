import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { ProveedorAutenticacion } from "./context/ContextoAutenticacion";
import { RutaProtegida } from "./components/RutaProtegida";
import { PaginaLogin } from "./pages/Login";
import { PaginaRegistro } from "./pages/Registro";

function App() {
  return (
    <BrowserRouter>
      <ProveedorAutenticacion>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<PaginaLogin />} />
          <Route path="/registro" element={<PaginaRegistro />} />

          {/* Rutas protegidas */}
          <Route element={<RutaProtegida />}>
            <Route path="/panel" element={<div>Panel de usuario</div>} />
          </Route>

          {/* Redirección por defecto */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </ProveedorAutenticacion>
    </BrowserRouter>
  );
}

export default App;