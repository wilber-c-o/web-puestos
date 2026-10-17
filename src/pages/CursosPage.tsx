import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import NavigationBar from "../components/layout/NavigationBar";
import { authRepository } from "../repositories/authRepository";

const cursos = [
  { curso: "1ro A", profesorGuia: "Alvaro Perez" },
  { curso: "1ro B", profesorGuia: "Mildred Cardozo" },
  { curso: "1ro C", profesorGuia: "Pablo Avila" },
  { curso: "2do A", profesorGuia: "Jose Jancko" },
  { curso: "2do B", profesorGuia: "Fabiola Bueno" },
  { curso: "2do C", profesorGuia: "Ibert Veizaga" },
  { curso: "3ro A", profesorGuia: "Ignacio Escobar" },
  { curso: "3ro B", profesorGuia: "Gisela Espindola" },
  { curso: "4to A", profesorGuia: "Erick Palacios" },
  { curso: "4to B", profesorGuia: "Norian Campos" },
  { curso: "5to A", profesorGuia: "Ariel Cervantes" },
  { curso: "5to B", profesorGuia: "Laura Flores" },
  { curso: "5to C", profesorGuia: "Jhissel Colque" },
  { curso: "6to A", profesorGuia: "Ronal Gutierrez" },
  { curso: "6to B", profesorGuia: "Roxana Nuñez" },
  { curso: "6to C", profesorGuia: "Jose Pastrana" },
];

function CursosPage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();
  const [searchCourse, setSearchCourse] = useState("");
  const visibleCursos = useMemo(() => {
    const search = searchCourse.trim().toLowerCase();
    return cursos.filter(({ curso, profesorGuia }) =>
      !search || curso.toLowerCase().includes(search) || profesorGuia.toLowerCase().includes(search)
    );
  }, [searchCourse]);

  const handleLogout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
  };
  if (!user) return null;

  const cursosPermitidos = user.role === "ADMIN" && user.curso && user.curso !== "TODOS"
    ? cursos.filter(({ curso }) => curso === user.curso)
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
                <p>{user.role === "ADMIN" && user.curso !== "TODOS" ? `Curso asignado: ${user.curso}` : "Cursos de secundaria · Turno mañana"}</p>
              </div>
              <div className="courses-total-card"><span className="courses-total-number">{cursosPermitidos.length}</span><span>cursos visibles</span></div>
            </div>
            {!(user.role === "ADMIN" && user.curso && user.curso !== "TODOS") && (
              <section className="courses-search-panel">
                <div className="courses-search-title"><div><h2>Buscar curso</h2><p>Busca por curso o nombre del profesor guía.</p></div><span>{cursos.length} cursos</span></div>
                <div className="courses-search-box"><span>⌕</span><input value={searchCourse} onChange={(event) => setSearchCourse(event.target.value)} placeholder="Ej.: 1ro A o Alvaro Perez" /></div>
              </section>
            )}
            <section className="courses-list-panel">
              <div className="courses-list-header"><div><p className="eyebrow">REGISTRO ACADÉMICO</p><h2>Cursos y profesores guía</h2></div><span className="courses-level-count">{cursosPermitidos.length} cursos</span></div>
              <div className="courses-grid">
                {cursosPermitidos.filter(({curso,profesorGuia}) => {const s=searchCourse.trim().toLowerCase();return (user.role==="ADMIN"&&user.curso&&user.curso!=="TODOS")||!s||curso.toLowerCase().includes(s)||profesorGuia.toLowerCase().includes(s)}).map(({curso,profesorGuia}) => (
                  <article className="course-card" key={curso}>
                    <div className="course-card-top"><div className="course-number">{curso.split(" ")[0]}</div><div><span className="course-label">CURSO</span><h3>{curso}</h3></div></div>
                    <div className="parallelos-title">Profesor guía</div>
                    <div className="paralelo-item"><div className="paralelo-info"><strong>{profesorGuia}</strong><small>{profesorGuia === "Por asignar" ? "Pendiente de registro" : "Profesor guía del curso"}</small></div>
                      <button type="button" className="paralelo-view-button" onClick={() => navigate(`/asientos?curso=${encodeURIComponent(curso)}`)}>Ver</button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
export default CursosPage;
