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
import TutoresPage from "../pages/TutoresPage";
import HistorialPage from "../pages/HistorialPage";
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
        <Route path="/tutores" element={<ProtectedRoute><TutoresPage /></ProtectedRoute>} />
        <Route path="/historial" element={<ProtectedRoute><HistorialPage /></ProtectedRoute>} />
        {/* Compatibilidad con el enlace anterior */}
        <Route path="/clases" element={<Navigate to="/cursos" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
