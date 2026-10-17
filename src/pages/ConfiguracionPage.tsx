import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/layout/Header";
import NavigationBar from "../components/layout/NavigationBar";
import { authRepository } from "../repositories/authRepository";

function ConfiguracionPage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();

  const [message, setMessage] = useState("");

  const handleLogout = () => {
    authRepository.logout();
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard">

      <Header user={user} onLogout={handleLogout} />

      <div className="dashboard-body">

        <NavigationBar />

        <main className="dashboard-content">

          <section className="dashboard-hero">

            <div className="hero-text">

              <p className="eyebrow">
                SISTEMA
              </p>

              <h1>
                <span>Configuración</span>
              </h1>

            </div>

          </section>

          <section className="info-panel">

            <h2>
              Configuración del sistema
            </h2>

            <p
              style={{
                marginTop: "15px",
                marginBottom: "20px",
              }}
            >
              Usuario actual: <strong>{user.name}</strong>
            </p>

            <button
              className="view-button"
              onClick={() =>
                setMessage(
                  "Los cambios fueron guardados correctamente."
                )
              }
            >
              Guardar cambios
            </button>

            {message && (
              <p
                style={{
                  marginTop: "20px",
                  fontWeight: "bold",
                }}
              >
                {message}
              </p>
            )}

          </section>

        </main>

      </div>

    </div>
  );
}

export default ConfiguracionPage;