import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import PetsPage from './pages/PetsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import PetHistoryPage from './pages/PetHistoryPage';
import PropietariosPage from './pages/PropietariosPage';
import EquipoPage from './pages/EquipoPage';
import LoginPage from './pages/LoginPage';

// Componente para proteger las rutas
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    // Redirigir al login si no hay token, guardando la ruta intentada
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Componente de Layout para las páginas protegidas
const AppLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página pública - Landing Page / Homepage */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rutas Protegidas - Sistema de Gestión */}
        <Route path="/dashboard" element={<ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>} />
        <Route path="/propietarios" element={<ProtectedRoute><AppLayout><PropietariosPage /></AppLayout></ProtectedRoute>} />
        <Route path="/mascotas" element={<ProtectedRoute><AppLayout><PetsPage /></AppLayout></ProtectedRoute>} />
        <Route path="/mascotas/:id" element={<ProtectedRoute><AppLayout><PetHistoryPage /></AppLayout></ProtectedRoute>} />
        <Route path="/citas" element={<ProtectedRoute><AppLayout><AppointmentsPage /></AppLayout></ProtectedRoute>} />
        <Route path="/equipo" element={<ProtectedRoute><AppLayout><EquipoPage /></AppLayout></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
