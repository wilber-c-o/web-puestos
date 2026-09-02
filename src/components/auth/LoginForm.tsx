import { useState } from "react";
import type { FormEventHandler } from "react";

import type { LoginCredentials } from "../../types/auth";

interface LoginFormProps {
  error?: string;
  isLoading?: boolean;
  onSubmit: (credentials: LoginCredentials) => void;
}

function LoginForm({ error, isLoading = false, onSubmit }: LoginFormProps) {
  const [carnet, setCarnet] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    const normalizedCarnet = carnet.trim();

    if (!normalizedCarnet || !password) {
      return;
    }

    onSubmit({
      carnet: normalizedCarnet,
      password,
    });
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>

      <div className="login-form__heading">
        <p className="eyebrow">Colegio Don Bosco</p>

        <h2>Iniciar sesión</h2>

        <p>
          Ingresa tus credenciales para continuar.
        </p>
      </div>

      <div className="form-field">
        <div className="form-field__label-row">
          <label htmlFor="carnet">Carnet de identidad</label>
          <span>Acceso institucional</span>
        </div>

        <div className="form-field__input-wrap">
          <input
            id="carnet"
            name="carnet"
            type="text"
            value={carnet}
            onChange={(event) => setCarnet(event.target.value)}
            placeholder="Ingresa tu carnet"
            autoComplete="username"
            required
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="password">
          Contraseña
        </label>

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
          {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
        </span>
        <span aria-hidden="true">→</span>
      </button>

      <p className="login-form__help">
        Prueba de acceso: carnet <strong>13938140</strong> · contraseña <strong>123</strong>
      </p>

    </form>
  );
}

export default LoginForm;
