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
import ClasesPage from "../pages/ClasesPage";
import AsignacionesPage from "../pages/AsignacionesPage";
import ConfiguracionPage from "../pages/ConfiguracionPage";

import { authRepository } from "../repositories/authRepository";

function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = authRepository.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Página principal */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        {/* Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Asientos */}
        <Route
          path="/asientos"
          element={
            <ProtectedRoute>
              <AsientosPage />
            </ProtectedRoute>
          }
        />

        {/* Estudiantes */}
        <Route
          path="/estudiantes"
          element={
            <ProtectedRoute>
              <EstudiantesPage />
            </ProtectedRoute>
          }
        />

        {/* Clases */}
        <Route
          path="/clases"
          element={
            <ProtectedRoute>
              <ClasesPage />
            </ProtectedRoute>
          }
        />

        {/* Asignaciones */}
        <Route
          path="/asignaciones"
          element={
            <ProtectedRoute>
              <AsignacionesPage />
            </ProtectedRoute>
          }
        />

        {/* Configuración */}
        <Route
          path="/configuracion"
          element={
            <ProtectedRoute>
              <ConfiguracionPage />
            </ProtectedRoute>
          }
        />

        {/* Cualquier ruta desconocida vuelve al inicio */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;