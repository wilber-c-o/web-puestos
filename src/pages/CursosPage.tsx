import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/layout/Header";
import NavigationBar from "../components/layout/NavigationBar";
import { authRepository } from "../repositories/authRepository";

function CursosPage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();
  const [searchCourse, setSearchCourse] = useState("");

  const cursos = [
    { nivel: "1ro", paralelos: ["A", "B", "C"] },
    { nivel: "2do", paralelos: ["A", "B", "C"] },
    { nivel: "3ro", paralelos: ["A", "B", "C"] },
    { nivel: "4to", paralelos: ["A", "B", "C"] },
    { nivel: "5to", paralelos: ["A", "B", "C"] },
    { nivel: "6to", paralelos: ["A", "B", "C"] },
  ];

  const totalCursos = cursos.length;
  const filteredCursos = useMemo(() => {
    const search = searchCourse.trim().toLowerCase();
    if (!search) return cursos;

    return cursos
      .map((curso) => ({
        ...curso,
        paralelos: curso.paralelos.filter((paralelo) =>
          `${curso.nivel} ${paralelo}`.toLowerCase().includes(search)
        ),
      }))
      .filter((curso) => curso.nivel.toLowerCase().includes(search) || curso.paralelos.length > 0);
  }, [searchCourse]);

  const handleLogout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
  };

  const handleViewSeats = (nivel: string, paralelo: string) => {
    navigate(`/asientos?curso=${encodeURIComponent(`${nivel} ${paralelo}`)}`);
  };

  if (!user) return null;

  return (
    <div className="dashboard">
      <Header user={user} onLogout={handleLogout} />
      <div className="dashboard-body">
        <NavigationBar />

        <main className="dashboard-content">
          <div className="courses-page">
            <div className="courses-topbar">
              <div>
                <p className="eyebrow">ORGANIZACIÓN ACADÉMICA</p>
                <h1>Cursos</h1>
              </div>

              <div className="courses-total-card">
                <span className="courses-total-number">{totalCursos}</span>
                <span>cursos</span>
              </div>
            </div>

            <section className="courses-search-panel">
              <div className="courses-search-title">
                <div>
                  <h2>Buscar curso</h2>
                  <p>Encuentra rápidamente un curso o paralelo.</p>
                </div>
                <span>{totalCursos} registrados</span>
              </div>

              <div className="courses-search-box">
                <span>⌕</span>
                <input
                  type="text"
                  placeholder="Buscar por curso o paralelo..."
                  value={searchCourse}
                  onChange={(event) => setSearchCourse(event.target.value)}
                />
              </div>
            </section>

            <section className="courses-list-panel">
              <div className="courses-list-header">
                <div>
                  <p className="eyebrow">REGISTRO ACADÉMICO</p>
                  <h2>Cursos registrados</h2>
                </div>
                <span className="courses-level-count">{filteredCursos.length} niveles</span>
              </div>

              <div className="courses-grid">
                {filteredCursos.length > 0 ? (
                  filteredCursos.map((curso, index) => (
                    <article className="course-card" key={curso.nivel}>
                      <div className="course-card-top">
                        <div className="course-number">{String(index + 1).padStart(2, "0")}</div>
                        <div>
                          <span className="course-label">NIVEL</span>
                          <h3>{curso.nivel} de Secundaria</h3>
                        </div>
                      </div>

                      <div className="parallelos-title">Paralelos</div>
                      <div className="parallelos-list">
                        {curso.paralelos.map((paralelo) => (
                          <div className="paralelo-item" key={`${curso.nivel}-${paralelo}`}>
                            <div className="paralelo-info">
                              <span>{paralelo}</span>
                              <small>{curso.nivel} {paralelo}</small>
                            </div>
                            <button
                              type="button"
                              className="paralelo-view-button"
                              onClick={() => handleViewSeats(curso.nivel, paralelo)}
                            >
                              Ver
                            </button>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="courses-empty">
                    <div>⌕</div>
                    <h3>No se encontraron cursos</h3>
                    <p>Prueba con otro nombre o paralelo.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CursosPage;
