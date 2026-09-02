import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import LoginForm from "../../components/auth/LoginForm";
import { authRepository } from "../../repositories/authRepository";

import type { LoginCredentials } from "../../types/auth";

import "./loginpage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (authRepository.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = (credentials: LoginCredentials) => {
    setError("");
    setIsLoading(true);

    const user = authRepository.login(credentials);

    if (!user) {
      setError("El carnet o la contraseña son incorrectos.");
      setIsLoading(false);
      return;
    }

    navigate("/", { replace: true });
  };

  return (
    <main className="login-page">
      <section className="login-container">

        {/* LADO IZQUIERDO */}
        <div className="login-left">
          <div className="login-brand" aria-label="Colegio Don Bosco">
            <span className="login-brand__mark" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>Colegio Don Bosco</span>
          </div>
          <div className="login-left-content">
            <p className="login-left__eyebrow">Sistema académico</p>
            <h1>
              Gestión de
              <br />
              Asientos
            </h1>

            <p className="login-left__description">
              Una forma clara y sencilla de organizar cada espacio de tu jornada.
            </p>
            <div className="login-left__highlight">
              <span aria-hidden="true">✓</span>
              <p>Organización eficiente para toda la comunidad educativa.</p>
            </div>
          </div>
          <p className="login-left__footer">Plataforma de gestión escolar</p>
        </div>

        {/* LADO DERECHO */}
        <div className="login-right">
          <LoginForm
            error={error}
            isLoading={isLoading}
            onSubmit={handleLogin}
          />
        </div>

      </section>
    </main>
  );
}

export default LoginPage;
