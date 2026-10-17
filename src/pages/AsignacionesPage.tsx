import { useNavigate } from "react-router-dom";

import Header from "../components/layout/Header";
import NavigationBar from "../components/layout/NavigationBar";
import { authRepository } from "../repositories/authRepository";

function AsignacionesPage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();

  const handleLogout = () => {
    authRepository.logout();
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  const assignments = [
    {
      name: "Juan Pérez",
      seat: "Aula 1 · Puesto 12",
    },
    {
      name: "María Gómez",
      seat: "Aula 3 · Puesto 05",
    },
    {
      name: "Luis Fernández",
      seat: "Aula 2 · Puesto 18",
    },
  ];

  return (
    <div className="dashboard">

      <Header user={user} onLogout={handleLogout} />

      <div className="dashboard-body">

        <NavigationBar />

        <main className="dashboard-content">

          <section className="dashboard-hero">

            <div className="hero-text">

              <p className="eyebrow">
                ORGANIZACIÓN
              </p>

              <h1>
                Últimas
                <br />
                <span>Asignaciones</span>
              </h1>

            </div>

          </section>

          <section className="info-panel">

            <div className="assignment-list">

              {assignments.map((assignment) => (

                <div
                  className="assignment-item"
                  key={assignment.name}
                >

                  <div className="assignment-dot yellow"></div>

                  <div>

                    <strong>
                      {assignment.name}
                    </strong>

                    <span>
                      {assignment.seat}
                    </span>

                  </div>

                  <button
                    className="view-button"
                    onClick={() =>
                      alert(
                        `${assignment.name}: ${assignment.seat}`
                      )
                    }
                  >
                    Ver
                  </button>

                </div>

              ))}

            </div>

          </section>

        </main>

      </div>

    </div>
  );
}

export default AsignacionesPage;