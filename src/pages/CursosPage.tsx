import { useNavigate } from "react-router-dom";

import Header from "../components/layout/Header";
import NavigationBar from "../components/layout/NavigationBar";
import { authRepository } from "../repositories/authRepository";

function CursosPage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();

  const handleLogout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
  };

  if (!user) return null;

  const cursos = [
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
              <p className="eyebrow">ORGANIZACIÓN ACADÉMICA</p>
              <h1>
                Mis
                <br />
                <span>Cursos</span>
              </h1>
              <p className="dashboard-description">
                Consulta y organiza los cursos disponibles para gestionar sus
                estudiantes y puestos de manera sencilla.
              </p>
            </div>
            <div className="hero-message">
              <span>ORDEN</span>
              <span>FORMACIÓN</span>
              <span>DISCIPLINA</span>
              <div className="hero-line" />
            </div>
          </section>

          <section className="info-panel cursos-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Cursos disponibles</p>
                <h2>Selecciona un curso</h2>
              </div>
              <span className="panel-count">{cursos.length} cursos</span>
            </div>

            <div className="classroom-list">
              {cursos.map((curso, index) => (
                <button
                  key={curso}
                  type="button"
                  className="classroom-item curso-item"
                  onClick={() => alert(`Seleccionaste: ${curso}`)}
                >
                  <div className="classroom-icon">{String(index + 1).padStart(2, "0")}</div>
                  <div>
                    <strong>Curso {index + 1}</strong>
                    <span>{curso}</span>
                  </div>
                  <span className="item-arrow">→</span>
                </button>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default CursosPage;
