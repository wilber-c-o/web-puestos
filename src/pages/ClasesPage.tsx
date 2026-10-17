import { useNavigate } from "react-router-dom";

import Header from "../components/layout/Header";
import NavigationBar from "../components/layout/NavigationBar";
import { authRepository } from "../repositories/authRepository";

function ClasesPage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();

  const handleLogout = () => {
    authRepository.logout();
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  const classrooms = [
    "1° de Secundaria A",
    "1° de Secundaria B",
    "2° de Secundaria A",
    "2° de Secundaria B",
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
                Mis
                <br />
                <span>Clases</span>
              </h1>

            </div>

          </section>

          <section className="info-panel">

            {classrooms.map((classroom, index) => (

              <button
                key={classroom}
                type="button"
                className="classroom-item"
                style={{
                  width: "100%",
                  marginBottom: "12px",
                  cursor: "pointer",
                  border: "none",
                  textAlign: "left",
                }}
                onClick={() =>
                  alert(`Abriste: ${classroom}`)
                }
              >

                <div className="classroom-icon">
                  {index + 1}
                </div>

                <div>
                  <strong>
                    Aula {index + 1}
                  </strong>

                  <span>
                    {classroom}
                  </span>
                </div>

              </button>

            ))}

          </section>

        </main>

      </div>

    </div>
  );
}

export default ClasesPage;