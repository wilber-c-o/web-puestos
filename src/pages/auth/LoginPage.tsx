import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { LoginCredentials, UserRole } from "../../types/auth";
import { authRepository } from "../../repositories/authRepository";
import LoginForm from "../../components/auth/LoginForm";

import "./loginpage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>("USUARIO");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setError("");
  };

  const handleLogin = (credentials: LoginCredentials) => {
    setError("");
    setIsLoading(true);

    const user = authRepository.login(credentials);

    if (!user) {
      setError(
        selectedRole === "ADMIN"
          ? "El carnet o la contraseña del administrador son incorrectos."
          : "El carnet o la contraseña del usuario son incorrectos."
      );
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    navigate("/", { replace: true });
  };

  return (
    <main className="login-page">
      <div className="login-container">
        <section className="login-brand">
          <div className="yellow-circle yellow-circle-one" />
          <div className="yellow-circle yellow-circle-two" />

          <div className="brand-content">
            <p className="brand-small">COLEGIO</p>
            <h1>
              Don Bosco
              <span>Gestión de Asientos</span>
            </h1>
            <div className="brand-line" />
            <p className="brand-description">
              Secundaria · Turno mañana
              <br />
              Organización de puestos para el plantel docente.
            </p>
            <div className="brand-decoration">
              <span />
              <span />
              <span />
            </div>
          </div>
        </section>

        <section className="login-section">
          <div className="login-card">
            <div className="login-card-top">
              <div className="db-logo">DB</div>
              <div>
                <p>COLEGIO DON BOSCO</p>
                <span>Sucre - Bolivia · Turno mañana</span>
              </div>
            </div>

            <div className="access-heading">
              <p className="access-eyebrow">PLANTEL DOCENTE</p>
              <h2>Selecciona tu acceso</h2>
              <p>Elige el tipo de cuenta antes de iniciar sesión.</p>
            </div>

            <div className="role-options" role="group" aria-label="Tipo de acceso">
              <button
                type="button"
                className={`role-option ${selectedRole === "USUARIO" ? "role-option-active" : ""}`}
                aria-pressed={selectedRole === "USUARIO"}
                onClick={() => handleRoleChange("USUARIO")}
              >
                <span className="role-option-icon" aria-hidden="true">◉</span>
                <span className="role-option-copy">
                  <strong>Usuario</strong>
                  <small>Consultar asientos</small>
                </span>
                <span className="role-option-check" aria-hidden="true">
                  {selectedRole === "USUARIO" ? "✓" : ""}
                </span>
              </button>

              <button
                type="button"
                className={`role-option ${selectedRole === "ADMIN" ? "role-option-active role-option-admin" : ""}`}
                aria-pressed={selectedRole === "ADMIN"}
                onClick={() => handleRoleChange("ADMIN")}
              >
                <span className="role-option-icon" aria-hidden="true">◆</span>
                <span className="role-option-copy">
                  <strong>Administrador</strong>
                  <small>Profesor guía · Gestionar</small>
                </span>
                <span className="role-option-check" aria-hidden="true">
                  {selectedRole === "ADMIN" ? "✓" : ""}
                </span>
              </button>
            </div>

            <LoginForm
              key={selectedRole}
              role={selectedRole}
              onSubmit={handleLogin}
              isLoading={isLoading}
              error={error}
            />

            <p className="login-footer-note">
              Acceso exclusivo para el plantel docente de secundaria.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
