import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import NavigationBar from "../components/layout/NavigationBar";
import { authRepository } from "../repositories/authRepository";
import { schoolRepository } from "../repositories/schoolRepository";

function CursosPage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();
  const [searchCourse, setSearchCourse] = useState("");
  const cursos = schoolRepository.getCourses().map((course) => ({
    curso: course.name,
    profesorGuia: schoolRepository.getGuideName(course),
  }));
  const search = searchCourse.trim().toLowerCase();
  const visibleCursos = cursos.filter(({ curso, profesorGuia }) =>
    !search || curso.toLowerCase().includes(search) || profesorGuia.toLowerCase().includes(search)
  );

  const handleLogout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
  };
  if (!user) return null;

  const cursosPermitidos = user.role === "ADMIN"
    ? visibleCursos.filter(({ curso }) => curso === user.curso)
    : visibleCursos;

  return (
    <div className="dashboard">
      <Header user={user} onLogout={handleLogout} />
      <div className="dashboard-body">
        <NavigationBar />
        <main className="dashboard-content">
          <div className="courses-page">
            <div className="courses-topbar">
              <div><p className="eyebrow">ORGANIZACIÓN ACADÉMICA</p><h1>Cursos</h1>
                <p>{user.role === "ADMIN" ? `Curso asignado: ${user.curso ?? "Sin asignar"}` : "Cursos de secundaria · Turno mañana"}</p>
              </div>
              <div className="courses-total-card"><span className="courses-total-number">{cursosPermitidos.length}</span><span>cursos visibles</span></div>
            </div>
            {user.role !== "ADMIN" && (
              <section className="courses-search-panel">
                <div className="courses-search-title"><div><h2>Buscar curso</h2><p>Busca por curso o nombre del profesor guía.</p></div><span>{cursos.length} cursos</span></div>
                <div className="courses-search-box"><span>⌕</span><input value={searchCourse} onChange={(event) => setSearchCourse(event.target.value)} placeholder="Ej.: 1ro A o nombre del profesor" /></div>
              </section>
            )}
            <section className="courses-list-panel">
              <div className="courses-list-header"><div><p className="eyebrow">REGISTRO ACADÉMICO</p><h2>Cursos y profesores guía</h2></div><span className="courses-level-count">{cursosPermitidos.length} cursos</span></div>
              <div className="courses-grid">
                {cursosPermitidos.map(({curso,profesorGuia}) => (
                  <article className="course-card" key={curso}>
                    <div className="course-card-top"><div className="course-number">{curso.split(" ")[0]}</div><div><span className="course-label">CURSO</span><h3>{curso}</h3></div></div>
                    <div className="parallelos-title">Profesor guía</div>
                    <div className="paralelo-item"><div className="paralelo-info"><strong>{profesorGuia}</strong><small>{profesorGuia === "Por asignar" ? "Pendiente de designación" : "Profesor guía del curso"}</small></div>
                      <button type="button" className="paralelo-view-button" onClick={() => navigate(`/asientos?curso=${encodeURIComponent(curso)}`)}>Ver</button>
                    </div>
                  </article>
                ))}
                {!cursosPermitidos.length && <p>No hay cursos que coincidan con la búsqueda.</p>}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
export default CursosPage;
