import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { LoginCredentials } from "../../types/auth";
import { authRepository } from "../../repositories/authRepository";
import LoginForm from "../../components/auth/LoginForm";

import "./loginpage.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (credentials: LoginCredentials) => {
    setError("");
    setIsLoading(true);

    const user = authRepository.login(credentials);

    if (!user) {
      setError("El carnet o la contraseña son incorrectos.");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    navigate("/");
  };

  return (
    <main className="login-page">
      <div className="login-container">

        <section className="login-brand">
          <div className="yellow-circle yellow-circle-one"></div>
          <div className="yellow-circle yellow-circle-two"></div>

          <div className="brand-content">
            <p className="brand-small">COLEGIO</p>

            <h1>
              Don Bosco
              <span>Gestión de Asientos</span>
            </h1>

            <div className="brand-line"></div>

            <p className="brand-description">
              Organización, disciplina y formación
            </p>

            <div className="brand-decoration">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </section>

        <section className="login-section">

          <div className="login-card">

            <div className="login-card-top">
              <div className="db-logo">
                DB
              </div>

              <div>
                <p>COLEGIO DON BOSCO</p>
                <span>Sucre - Bolivia</span>
              </div>
            </div>

            <LoginForm
              onSubmit={handleLogin}
              isLoading={isLoading}
              error={error}
            />

          </div>

        </section>

      </div>
    </main>
  );
}