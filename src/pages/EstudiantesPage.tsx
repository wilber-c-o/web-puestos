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

    setStudents([...students, name]);
    setNewStudent("");
  };

  const filteredStudents = students.filter((student) =>
    student.toLowerCase().includes(searchStudent.toLowerCase().trim())
  );

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
              <p className="eyebrow">ADMINISTRACIÓN</p>
              <h1>
                Gestionar
                <br />
                <span>Estudiantes</span>
              </h1>
            </div>
          </section>

          <section className="info-panel">
            <div className="panel-heading">
              <h2>Lista de estudiantes</h2>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              <input
                type="text"
                placeholder="Buscar estudiante..."
                value={searchStudent}
                onChange={(event) => setSearchStudent(event.target.value)}
                style={{
                  padding: "12px 15px",
                  flex: 1,
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "15px",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "25px",
              }}
            >
              <input
                type="text"
                placeholder="Nombre del estudiante"
                value={newStudent}
                onChange={(event) => setNewStudent(event.target.value)}
                style={{
                  padding: "12px",
                  flex: 1,
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />

              <button className="view-button" onClick={addStudent}>
                Agregar
              </button>
            </div>

            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => {
                const originalIndex = students.indexOf(student);

                return (
                  <div
                    className="classroom-item"
                    key={`${student}-${originalIndex}`}
                    style={{ marginBottom: "10px" }}
                  >
                    <div className="classroom-icon">{originalIndex + 1}</div>
                    <strong>{student}</strong>

                    <button
                      className="view-button"
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
              <p style={{ padding: "20px", textAlign: "center" }}>
                No se encontraron estudiantes.
              </p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default EstudiantesPage;
