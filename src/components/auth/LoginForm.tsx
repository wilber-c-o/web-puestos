import { useState } from "react";
import type { FormEventHandler } from "react";

import type { LoginCredentials, UserRole } from "../../types/auth";

interface LoginFormProps {
  role: UserRole;
  error?: string;
  isLoading?: boolean;
  onSubmit: (credentials: LoginCredentials) => void;
}

function LoginForm({ role, error, isLoading = false, onSubmit }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const isAdmin = role === "ADMIN";

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (isLoading) return;

    const normalizedUsername = username.trim();
    if (!normalizedUsername || !password) return;

    onSubmit({
      carnet: normalizedUsername,
      password,
      role,
    });
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="login-form__heading">
        <p className="eyebrow">{isAdmin ? "ACCESO DE PROFESOR GUÍA" : "ACCESO DOCENTE"}</p>
        <h2>Iniciar sesión</h2>
        <p>
          {isAdmin
            ? "Ingresa para organizar los puestos de tu curso."
            : "Ingresa para consultar los puestos de los estudiantes."}
        </p>
      </div>

      <div className="form-field">
        <div className="form-field__label-row">
          <label htmlFor="username">Usuario</label>
          <span>Acceso institucional</span>
        </div>
        <div className="form-field__input-wrap">
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Ingresa tu usuario"
            autoComplete="username"
            required
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="password">Contraseña</label>
        <div className="form-field__input-wrap">
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Ingresa tu contraseña"
            autoComplete="current-password"
            required
          />
        </div>
      </div>

      {error && (
        <p className="form-error" role="alert" aria-live="polite">
          {error}
        </p>
      )}

      <button
        className="login-form__submit"
        type="submit"
        disabled={isLoading}
        aria-busy={isLoading}
      >
        <span className="login-form__submit-text">
          {isLoading ? "Iniciando sesión..." : isAdmin ? "Entrar como administrador" : "Entrar como usuario"}
        </span>
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}

export default LoginForm;
