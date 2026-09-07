import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import AsientosPage from "../pages/AsientosPage";
import EstudiantesPage from "../pages/EstudiantesPage";
import CursosPage from "../pages/CursosPage";
import AsignacionesPage from "../pages/AsignacionesPage";
import ConfiguracionPage from "../pages/ConfiguracionPage";
import { authRepository } from "../repositories/authRepository";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = authRepository.isAuthenticated();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/asientos" element={<ProtectedRoute><AsientosPage /></ProtectedRoute>} />
        <Route path="/estudiantes" element={<ProtectedRoute><EstudiantesPage /></ProtectedRoute>} />
        <Route path="/cursos" element={<ProtectedRoute><CursosPage /></ProtectedRoute>} />
        {/* Compatibilidad con el enlace anterior */}
        <Route path="/clases" element={<Navigate to="/cursos" replace />} />
        <Route path="/asignaciones" element={<ProtectedRoute><AsignacionesPage /></ProtectedRoute>} />
        <Route path="/configuracion" element={<ProtectedRoute><ConfiguracionPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
