import { useState } from "react";
import type { FormEventHandler } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import type { LoginCredentials } from "../../types/auth";
import { authRepository } from "../../repositories/authRepository";
import LoginForm from "../../components/auth/LoginForm";

import "./loginpage.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);

      const credentials: LoginCredentials = {
        carnet: String(formData.get("carnet") || ""),
        password: String(formData.get("password") || ""),
      };

      await authRepository.login(credentials);

      navigate("/");
    } catch (err) {
      setError("El carnet o la contraseña son incorrectos.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-container">

        {/* PANEL IZQUIERDO */}
        <section className="login-left">
          <div className="login-decoration decoration-one"></div>
          <div className="login-decoration decoration-two"></div>

          <div className="login-left-content">

            <div className="school-badge">
              <span className="school-badge-icon">✦</span>
              <span>SISTEMA ESCOLAR</span>
            </div>

            <h1>
              Gestión de
              <br />
              <span>Asientos</span>
            </h1>

            <div className="school-name">
              Colegio Don Bosco
            </div>

            <p className="login-description">
              Organiza y administra los lugares de asiento de los
              estudiantes de manera sencilla y eficiente.
            </p>

            <div className="login-features">

              <div className="feature">
                <span className="feature-icon">✓</span>
                <span>Organización de cursos</span>
              </div>

              <div className="feature">
                <span className="feature-icon">✓</span>
                <span>Asignación de estudiantes</span>
              </div>

              <div className="feature">
                <span className="feature-icon">✓</span>
                <span>Gestión rápida de puestos</span>
              </div>

            </div>
          </div>
        </section>

        {/* PANEL DERECHO */}
        <section className="login-right">

          <div className="login-right-decoration"></div>

          <div className="login-right-content">

            <div className="login-header">
              <span className="login-school-label">
                COLEGIO DON BOSCO
              </span>

              <h2>Iniciar sesión</h2>

              <p>
                Ingresa tus credenciales para continuar.
              </p>
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