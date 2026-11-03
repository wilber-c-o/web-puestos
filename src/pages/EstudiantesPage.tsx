import { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import NavigationBar from "../components/layout/NavigationBar";
import { authRepository } from "../repositories/authRepository";
import { studentRepository } from "../repositories/studentRepository";

function EstudiantesPage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();
  const course = user?.curso ?? "";
  const [students, setStudents] = useState<string[]>(() => course ? studentRepository.getByCourse(course) : []);
  const [newStudent, setNewStudent] = useState("");
  const [searchStudent, setSearchStudent] = useState("");
  const [editingStudent, setEditingStudent] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [notice, setNotice] = useState("");

  const persist = (next: string[]) => {
    setStudents(next);
    studentRepository.saveForCourse(course, next);
  };
  const handleLogout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
  };
  const addStudent = () => {
    const name = newStudent.trim().replace(/\s+/g, " ");
    if (!name) return;
    if (students.some((student) => student.toLocaleLowerCase() === name.toLocaleLowerCase())) {
      setNotice("Ese estudiante ya está registrado en este curso.");
      return;
    }
    persist([...students, name]);
    setNewStudent("");
    setShowAddForm(false);
    setNotice("Estudiante registrado correctamente.");
  };
  const saveEdit = (oldName: string) => {
    const name = editName.trim().replace(/\s+/g, " ");
    if (!name) return;
    if (students.some((student) => student !== oldName && student.toLocaleLowerCase() === name.toLocaleLowerCase())) {
      setNotice("Ya existe un estudiante con ese nombre.");
      return;
    }
    studentRepository.renameInCourse(course, oldName, name);
    persist(students.map((student) => student === oldName ? name : student));
    setEditingStudent(null);
    setEditName("");
    setNotice("Nombre actualizado correctamente.");
  };
  const filteredStudents = useMemo(
    () => students.filter((student) => student.toLocaleLowerCase().includes(searchStudent.toLocaleLowerCase().trim())),
    [students, searchStudent]
  );

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "ADMIN" || !course || course === "TODOS") return <Navigate to="/cursos" replace />;

  return (
    <div className="dashboard">
      <Header user={user} onLogout={handleLogout} />
      <div className="dashboard-body">
        <NavigationBar />
        <main className="dashboard-content">
          <div className="students-page">
            <div className="students-topbar">
              <div><p className="eyebrow">ADMINISTRACIÓN · {course}</p><h1>Estudiantes</h1><p>Lista de estudiantes de tu curso asignado.</p></div>
              <button type="button" className="students-add-button" onClick={() => setShowAddForm(!showAddForm)}><span>＋</span> Agregar estudiante</button>
            </div>
            {notice && <p role="status" style={{padding:"12px 16px",background:"#edf7f0",color:"#17663a",borderRadius:"8px"}}>{notice}</p>}
            {showAddForm && (
              <section className="students-add-panel">
                <div><h2>Agregar estudiante</h2><p>El nombre se guardará en la lista de {course}.</p></div>
                <div className="students-add-form">
                  <input type="text" placeholder="Nombre completo del estudiante" value={newStudent} onChange={(event) => setNewStudent(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addStudent(); }} autoFocus />
                  <button type="button" onClick={addStudent}>Guardar estudiante</button>
                </div>
              </section>
            )}
            <section className="students-search-panel">
              <div className="students-search-title"><h2>Buscar estudiantes</h2><span>{filteredStudents.length} encontrados</span></div>
              <div className="students-search-box"><span>⌕</span><input type="text" placeholder="Buscar por nombre..." value={searchStudent} onChange={(event) => setSearchStudent(event.target.value)} /></div>
            </section>
            <section className="students-list-panel">
              <div className="students-list-header"><div><p className="eyebrow">REGISTRO · {course}</p><h2>Estudiantes registrados</h2></div><span className="students-count">{students.length}</span></div>
              <div className="students-list">
                {filteredStudents.length ? filteredStudents.map((student) => (
                  <div className="student-row" key={student}>
                    <div className="student-number">{students.indexOf(student) + 1}</div>
                    <div className="student-avatar">{student.charAt(0).toUpperCase()}</div>
                    {editingStudent === student ? (
                      <div className="student-info" style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
                        <input aria-label="Editar nombre del estudiante" value={editName} onChange={(event) => setEditName(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") saveEdit(student); }} />
                        <button type="button" onClick={() => saveEdit(student)}>Guardar</button>
                        <button type="button" onClick={() => setEditingStudent(null)}>Cancelar</button>
                      </div>
                    ) : (
                      <>
                        <div className="student-info"><strong>{student}</strong><span>Estudiante de {course}</span></div>
                        <button type="button" className="student-delete-button" onClick={() => { setEditingStudent(student); setEditName(student); }}>Editar</button>
                        <button type="button" className="student-delete-button" onClick={() => { if (window.confirm(`¿Eliminar a ${student} de la lista?`)) { studentRepository.removeFromCourse(course, student); persist(students.filter((item) => item !== student)); setNotice("Estudiante eliminado."); } }}>Eliminar</button>
                      </>
                    )}
                  </div>
                )) : <div className="students-empty"><div>⌕</div><h3>{students.length ? "No se encontraron estudiantes" : "Todavía no hay estudiantes"}</h3><p>{students.length ? "Prueba con otro nombre de búsqueda." : "Agrega estudiantes para luego asignarlos a los asientos."}</p></div>}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
export default EstudiantesPage;
