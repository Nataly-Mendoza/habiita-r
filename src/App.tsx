import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProveedorAutenticacion } from "./context/ContextoAutenticacion";
import { RutaProtegida } from "./components/RutaProtegida";

// Auth
import { PaginaLogin } from "./pages/Login";
import { PaginaRegistro } from "./pages/Registro";

// App general
import { HomePage } from "./pages/Inicio";
import { Catalogo } from "./pages/catalogo";
import { DashboardOverviewPage } from "./pages/dashboard";

function App() {
  return (
    <BrowserRouter>
      <ProveedorAutenticacion>
        <Routes>
          {/*  Públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/login" element={<PaginaLogin />} />
          <Route path="/registro" element={<PaginaRegistro />} />

          {/*  Protegidas */}
          <Route element={<RutaProtegida />}>
            <Route path="/panel" element={<DashboardOverviewPage />} />
          </Route>

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ProveedorAutenticacion>
    </BrowserRouter>
  );
}

export default App;