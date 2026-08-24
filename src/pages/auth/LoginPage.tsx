import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";


import LoginForm from "../../components/auth/LoginForm";
import { authRepository } from "../../repositories/authRepository";


import type { LoginCredentials } from "../../types/auth";


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
      <section className="login-introduction" aria-label="Bienvenida">
        <div className="brand-mark" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="login-introduction__content">
          <p className="eyebrow">Plataforma institucional</p>
          <h1>Gestión clara.<br />Decisiones seguras.</h1>
          <p className="login-introduction__description">
            Acceda al sistema de puestos para consultar y administrar la información de forma ágil y confiable.
          </p>
        </div>

        <p className="login-introduction__footer">Sistema de gestión de puestos</p>
      </section>

      <section className="login-panel" aria-label="Acceso al sistema">
        <LoginForm error={error} onSubmit={handleLogin} />
      </section>
    </main>
  );
}


export default LoginPage;
