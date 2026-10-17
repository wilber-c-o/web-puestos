import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/layout/Header";
import NavigationBar from "../components/layout/NavigationBar";
import { authRepository } from "../repositories/authRepository";

function EstudiantesPage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();

  const [students, setStudents] = useState([
    "Juan Pérez",
    "María Gómez",
    "Luis Fernández",
  ]);
  const [newStudent, setNewStudent] = useState("");
  const [searchStudent, setSearchStudent] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleLogout = () => {
    authRepository.logout();
    navigate("/login");
  };

  const addStudent = () => {
    const name = newStudent.trim();

    if (!name) {
      alert("Escribe el nombre del estudiante.");
      return;
    }

    if (students.some((student) => student.toLowerCase() === name.toLowerCase())) {
      alert("Ese estudiante ya está registrado.");
      return;
    }

    setStudents([...students, name]);
    setNewStudent("");
    setShowAddForm(false);
  };

  const filteredStudents = students.filter((student) =>
    student.toLowerCase().includes(searchStudent.toLowerCase().trim())
  );

  if (!user) return null;

  return (
    <div className="dashboard">
      <Header user={user} onLogout={handleLogout} />

      <div className="dashboard-body">
        <NavigationBar />

        <main className="dashboard-content">
          <div className="students-page">
            <div className="students-topbar">
              <div>
                <p className="eyebrow">ADMINISTRACIÓN</p>
                <h1>Estudiantes</h1>
              </div>

              <button
                type="button"
                className="students-add-button"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <span>＋</span> Agregar estudiante
              </button>
            </div>

            {showAddForm && (
              <section className="students-add-panel">
                <div>
                  <h2>Agregar estudiante</h2>
                  <p>Registra un nuevo estudiante en el sistema.</p>
                </div>

                <div className="students-add-form">
                  <input
                    type="text"
                    placeholder="Nombre completo del estudiante"
                    value={newStudent}
                    onChange={(event) => setNewStudent(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") addStudent();
                    }}
                    autoFocus
                  />
                  <button type="button" onClick={addStudent}>
                    Guardar estudiante
                  </button>
                </div>
              </section>
            )}

            <section className="students-search-panel">
              <div className="students-search-title">
                <h2>Buscar estudiantes</h2>
                <span>{filteredStudents.length} registrados</span>
              </div>

              <div className="students-search-box">
                <span>⌕</span>
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={searchStudent}
                  onChange={(event) => setSearchStudent(event.target.value)}
                />
              </div>
            </section>

            <section className="students-list-panel">
              <div className="students-list-header">
                <div>
                  <p className="eyebrow">REGISTRO</p>
                  <h2>Estudiantes registrados</h2>
                </div>
                <span className="students-count">{students.length}</span>
              </div>

              <div className="students-list">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => {
                    const originalIndex = students.indexOf(student);

                    return (
                      <div className="student-row" key={`${student}-${originalIndex}`}>
                        <div className="student-number">{originalIndex + 1}</div>
                        <div className="student-avatar">
                          {student.charAt(0).toUpperCase()}
                        </div>
                        <div className="student-info">
                          <strong>{student}</strong>
                          <span>Estudiante registrado</span>
                        </div>
                        <button
                          type="button"
                          className="student-delete-button"
                          onClick={() => {
                            setStudents(
                              students.filter((_, index) => index !== originalIndex)
                            );
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="students-empty">
                    <div>⌕</div>
                    <h3>No se encontraron estudiantes</h3>
                    <p>Prueba con otro nombre de búsqueda.</p>
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

export default EstudiantesPage;
