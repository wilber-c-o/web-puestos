import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/layout/Header";
import NavigationBar from "../components/layout/NavigationBar";
import { authRepository } from "../repositories/authRepository";

function AsientosPage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();

  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  const handleLogout = () => {
    authRepository.logout();
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  const seats = Array.from({ length: 30 }, (_, index) => index + 1);

  return (
    <div className="dashboard">

      <Header user={user} onLogout={handleLogout} />

      <div className="dashboard-body">

        <NavigationBar />

        <main className="dashboard-content">

          <section className="dashboard-hero">

            <div className="hero-text">
              <p className="eyebrow">
                GESTIÓN DE ASIENTOS
              </p>

              <h1>
                Organizar
                <br />
                <span>Asientos</span>
              </h1>

              <p className="dashboard-description">
                Selecciona un puesto para organizar
                los asientos de los estudiantes.
              </p>
            </div>

          </section>

          <section className="info-panel">

            <div className="panel-heading">

              <div>
                <p className="eyebrow">
                  AULA
                </p>

                <h2>
                  Aula 1
                </h2>
              </div>

              {selectedSeat && (
                <button
                  className="view-button"
                  onClick={() =>
                    alert(`Seleccionaste el puesto ${selectedSeat}`)
                  }
                >
                  Confirmar puesto
                </button>
              )}

            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(80px, 1fr))",
                gap: "15px",
                marginTop: "30px",
              }}
            >

              {seats.map((seat) => (
                <button
                  key={seat}
                  type="button"
                  onClick={() => setSelectedSeat(seat)}
                  style={{
                    padding: "20px",
                    borderRadius: "10px",
                    border:
                      selectedSeat === seat
                        ? "3px solid #e0ad00"
                        : "1px solid #ddd",
                    cursor: "pointer",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  🪑
                  <br />
                  {seat}
                </button>
              ))}

            </div>

          </section>

        </main>

      </div>

    </div>
  );
}

export default AsientosPage;