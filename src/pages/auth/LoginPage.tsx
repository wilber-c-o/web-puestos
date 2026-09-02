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


      const credentials: LoginCredentials = {
        carnet: String(formData.get("carnet") || ""),
        password: String(formData.get("password") || ""),
      };

      await authRepository.login(credentials);

      navigate("/");
    } catch (err) {
      setError("El carnet o la contraseña son incorrectos.");

    }
  };

  return (
    <main className="login-page">
      <div className="login-container">

        {/* PANEL IZQUIERDO */}
        <section className="login-left">
          <div className="login-decoration decoration-one"></div>
          <div className="login-decoration decoration-two"></div>



            <h1>
              Gestión de
              <br />
              <span>Asientos</span>
            </h1>



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


