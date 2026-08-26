import { useNavigate } from "react-router-dom";


import initialUsers from "../data/users.json";
import Header from "../components/layout/Header";
import NavigationBar from "../components/layout/NavigationBar";
import { authRepository } from "../repositories/authRepository";
import type { UserRecord } from "../types/auth";
import "./StudentsPage.css";


const students = initialUsers as UserRecord[];


function StudentsPage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();


  const handleLogout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
  };


  if (!user) {
    return (
      <main className="students-page">
        <p>No existe una sesión activa.</p>
      </main>
    );
  }


  return (
    <div className="app-shell">
      <Header user={user} onLogout={handleLogout} />
      <NavigationBar />
      <main className="students-page">
        <button className="back-button" type="button" onClick={() => navigate("/")}>
          <span aria-hidden="true">←</span> Volver al panel
        </button>

        <section className="students-page__heading" aria-labelledby="students-title">
          <div>
            <p className="eyebrow">Gestión académica</p>
            <h1 id="students-title">Estudiantes registrados</h1>
            <p>Consulta los estudiantes que se encuentran registrados en el sistema.</p>
          </div>
          <span className="students-total">{students.length} registrados</span>
        </section>

        <section className="students-table-card" aria-label="Listado de estudiantes registrados">
          <div className="students-table-card__header">
            <h2>Listado de estudiantes</h2>
            <span>Información de ejemplo</span>
          </div>
          <div className="students-table-wrapper">
            <table>
              <thead>
                <tr>
                  <th scope="col">Estudiante</th>
                  <th scope="col">Carnet</th>
                  <th scope="col">Rol</th>
                  <th scope="col">Estado</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td><strong>{student.name}</strong></td>
                    <td>{student.carnet}</td>
                    <td>{student.role}</td>
                    <td><span className="student-status">Activo</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}


export default StudentsPage;
