import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/Inicio'; 
import { Catalogo } from './pages/catalogo';
import { DashboardOverviewPage } from './pages/dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página de inicio */}
        <Route path="/" element={<HomePage />} />
        <Route path="/catalogo" element={<Catalogo />} />
        {/* Dashboard */}
        <Route path="/dashboard/*" element={<DashboardOverviewPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;