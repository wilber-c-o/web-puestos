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
              <p className="eyebrow">
                ADMINISTRACIÓN
              </p>

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
                marginBottom: "25px",
              }}
            >

              <input
                type="text"
                placeholder="Nombre del estudiante"
                value={newStudent}
                onChange={(event) =>
                  setNewStudent(event.target.value)
                }
                style={{
                  padding: "12px",
                  flex: 1,
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />

              <button
                className="view-button"
                onClick={addStudent}
              >
                Agregar
              </button>

            </div>

            {students.map((student, index) => (

              <div
                className="classroom-item"
                key={index}
                style={{ marginBottom: "10px" }}
              >

                <div className="classroom-icon">
                  {index + 1}
                </div>

                <strong>{student}</strong>

                <button
                  className="view-button"
                  onClick={() => {
                    setStudents(
                      students.filter((_, i) => i !== index)
                    );
                  }}
                >
                  Eliminar
                </button>

              </div>

            ))}

          </section>

        </main>

      </div>

    </div>
  );
}

export default EstudiantesPage;