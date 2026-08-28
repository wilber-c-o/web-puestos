import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import LoginForm from "../../components/auth/LoginForm";
import { authRepository } from "../../repositories/authRepository";

import type { LoginCredentials } from "../../types/auth";

import "./loginpage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  if (authRepository.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = (credentials: LoginCredentials) => {
    setError("");

    const user = authRepository.login(credentials);

    if (!user) {
      setError("El carnet o la contraseña son incorrectos.");
      return;
    }

    navigate("/", { replace: true });
  };

  return (
    <main className="login-page">
      <section className="login-container">

        {/* LADO IZQUIERDO */}
        <div className="login-left">
          <div className="login-left-content">
            <h1>
              Gestión de
              <br />
              Asientos
            </h1>

            <p>Colegio Don Bosco</p>
          </div>
        </div>

        {/* LADO DERECHO */}
        <div className="login-right">
          <LoginForm
            error={error}
            onSubmit={handleLogin}
          />
        </div>

      </section>
    </main>
  );
}

export default LoginPage;