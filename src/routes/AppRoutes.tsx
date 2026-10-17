import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import type { UserRole } from "../types/auth";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import AsientosPage from "../pages/AsientosPage";
import EstudiantesPage from "../pages/EstudiantesPage";
import CursosPage from "../pages/CursosPage";
import TutoresPage from "../pages/TutoresPage";
import HistorialPage from "../pages/HistorialPage";
import { authRepository } from "../repositories/authRepository";

function ProtectedRoute({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: UserRole[];
}) {
  const user = authRepository.getCurrentUser();

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/asientos" element={<ProtectedRoute><AsientosPage /></ProtectedRoute>} />
        <Route path="/cursos" element={<ProtectedRoute><CursosPage /></ProtectedRoute>} />
        <Route path="/estudiantes" element={<ProtectedRoute roles={["ADMIN"]}><EstudiantesPage /></ProtectedRoute>} />
        <Route path="/tutores" element={<ProtectedRoute roles={["ADMIN"]}><TutoresPage /></ProtectedRoute>} />
        <Route path="/historial" element={<ProtectedRoute roles={["ADMIN"]}><HistorialPage /></ProtectedRoute>} />
        {/* Compatibilidad con el enlace anterior */}
        <Route path="/clases" element={<Navigate to="/cursos" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
