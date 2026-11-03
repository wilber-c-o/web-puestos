import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import NavigationBar from "../components/layout/NavigationBar";
import { authRepository } from "../repositories/authRepository";
import { createTeacherUsername, schoolRepository, type CourseRecord, type TeacherRecord } from "../repositories/schoolRepository";

function TutoresPage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();
  const [teachers, setTeachers] = useState<TeacherRecord[]>(() => schoolRepository.getTeachers());
  const [courses, setCourses] = useState<CourseRecord[]>(() => schoolRepository.getCourses());
  const [newTeacher, setNewTeacher] = useState("");
  const [newCourse, setNewCourse] = useState("");
  const [notice, setNotice] = useState("");
  const [createdAccount, setCreatedAccount] = useState<{name:string; username:string; role:"ADMIN"|"USUARIO"} | null>(null);

  const refresh = () => {
    setTeachers(schoolRepository.getTeachers());
    setCourses(schoolRepository.getCourses());
  };
  const logout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
  };
  const addTeacher = () => {
    const teacher = schoolRepository.addTeacher(newTeacher);
    if (!teacher) { setNotice("Escribe un nombre válido. No se permiten nombres repetidos."); return; }
    setNewTeacher("");
    setCreatedAccount({ name: teacher.name, username: schoolRepository.getTeacherUserAccounts().find((account) => account.id === "staff-" + teacher.id)?.carnet ?? createTeacherUsername(teacher.name, "USUARIO"), role: "USUARIO" });
    setNotice("Profesor agregado correctamente. Se generó su cuenta de consulta.");
    refresh();
  };
  const addCourse = () => {
    const course = schoolRepository.addCourse(newCourse);
    if (!course) { setNotice("Escribe un curso válido. Ese curso puede que ya exista."); return; }
    setNewCourse("");
    setNotice("Curso agregado correctamente.");
    refresh();
  };
  const assignGuide = (course: CourseRecord, teacherId: string) => {
    const selectedTeacher = teachers.find((item) => item.id === teacherId);
    const usernameCollision = selectedTeacher && courses.some((item) => {
      if (item.id === course.id || !item.guideId) return false;
      const otherTeacher = teachers.find((teacher) => teacher.id === item.guideId);
      return otherTeacher && createTeacherUsername(otherTeacher.name) === createTeacherUsername(selectedTeacher.name);
    });
    if (teacherId && courses.some((item) => item.id !== course.id && item.guideId === teacherId)) {
      setNotice("Ese profesor ya está designado como guía de otro curso.");
      refresh();
      return;
    }
    if (usernameCollision) {
      setNotice("Las iniciales de este profesor coinciden con las de otro profesor guía. Verifica el nombre antes de asignarlo.");
      refresh();
      return;
    }
    schoolRepository.assignGuide(course.id, teacherId || null);
    refresh();
    const teacher = teachers.find((item) => item.id === teacherId);
    if (teacher) {
      const username = createTeacherUsername(teacher.name);
      setCreatedAccount({ name: teacher.name, username, role: "ADMIN" });
      setNotice("Profesor guía designado. Su cuenta de administrador quedó generada.");
    } else {
      setCreatedAccount(null);
      setNotice("El profesor guía fue retirado del curso.");
    }
  };

  if (!user || user.role !== "SUPER_ADMIN") return null;

  const fieldStyle = { width: "100%", padding: "12px 14px", border: "1px solid #d8e2eb", borderRadius: 8, font: "inherit", color: "#173044", background: "#fff" };
  const buttonStyle = { padding: "11px 16px", border: 0, borderRadius: 8, background: "#173b61", color: "#fff", fontWeight: 700, cursor: "pointer" };
  const panelStyle = { background: "#fff", border: "1px solid #e1e9ef", borderRadius: 12, padding: 22, marginBottom: 22 };

  return (
    <div className="dashboard">
      <Header user={user} onLogout={logout} />
      <div className="dashboard-body">
        <NavigationBar />
        <main className="dashboard-content">
          <div style={{maxWidth:1200, margin:"0 auto"}}>
            <p className="eyebrow">DIRECCIÓN ACADÉMICA · ADMINISTRACIÓN</p>
            <h1 style={{margin:"0 0 8px", color:"#142d55", fontSize:36}}>Gestión de profesores y cursos</h1>
            <p style={{color:"#6d86a1", margin:"0 0 24px"}}>Agrega docentes, organiza los cursos y designa a cada profesor guía.</p>
            {notice && <p role="status" style={{padding:13, borderRadius:8, background:"#edf7f0", color:"#17663a"}}>{notice}</p>}
            {createdAccount && (
              <section style={{...panelStyle, borderColor:"#d6b54a", background:"#fffdf4"}}>
                <h2 style={{margin:"0 0 8px", color:"#173044"}}>{createdAccount.role === "ADMIN" ? "Cuenta de administrador generada" : "Cuenta de usuario generada"}</h2>
                <p style={{margin:"0 0 12px"}}>Profesor guía: <strong>{createdAccount.name}</strong></p>
                <p style={{margin:"5px 0"}}>Usuario: <strong>{createdAccount.username}</strong></p>
                <p style={{margin:"5px 0"}}>Contraseña inicial: <strong>{createdAccount.username}</strong></p>
                <small>{createdAccount.role === "ADMIN" ? "Comparte estas credenciales con el profesor guía. Debe seleccionar Administrador al iniciar sesión." : "Comparte estas credenciales con el docente. Debe seleccionar Usuario para consultar cursos y asientos."}</small>
              </section>
            )}
            <section style={panelStyle}>
              <h2 style={{margin:"0 0 15px", color:"#173044"}}>Agregar profesor</h2>
              <div style={{display:"flex", gap:10, flexWrap:"wrap"}}>
                <input style={{...fieldStyle, flex:"1 1 280px"}} value={newTeacher} onChange={(e)=>setNewTeacher(e.target.value)} placeholder="Nombre y apellido del profesor" />
                <button style={buttonStyle} type="button" onClick={addTeacher}>＋ Agregar profesor</button>
              </div>
              <p style={{color:"#71869a", fontSize:13, marginBottom:0}}>Los profesores registrados pueden ser designados como guía de un curso.</p>
            </section>
            <section style={panelStyle}>
              <h2 style={{margin:"0 0 15px", color:"#173044"}}>Agregar curso</h2>
              <div style={{display:"flex", gap:10, flexWrap:"wrap"}}>
                <input style={{...fieldStyle, flex:"1 1 280px"}} value={newCourse} onChange={(e)=>setNewCourse(e.target.value)} placeholder="Ej.: 1ro D" />
                <button style={buttonStyle} type="button" onClick={addCourse}>＋ Agregar curso</button>
              </div>
            </section>
            <section style={panelStyle}>
              <div style={{display:"flex", justifyContent:"space-between", gap:12, flexWrap:"wrap", alignItems:"center"}}>
                <h2 style={{margin:0, color:"#173044"}}>Cursos y profesores guía</h2>
                <strong>{courses.length} cursos</strong>
              </div>
              <div style={{display:"grid", gap:12, marginTop:18}}>
                {courses.map((course) => (
                  <div key={course.id} style={{display:"grid", gridTemplateColumns:"minmax(100px,.7fr) minmax(180px,1.5fr) auto", gap:12, alignItems:"center", padding:"13px 0", borderBottom:"1px solid #edf1f5"}}>
                    <strong style={{color:"#173b61"}}>{course.name}</strong>
                    <select style={fieldStyle} value={course.guideId ?? ""} onChange={(e)=>assignGuide(course,e.target.value)}>
                      <option value="">Por asignar</option>
                      {teachers.map((teacher)=><option key={teacher.id} value={teacher.id}>{teacher.name}</option>)}
                    </select>
                    <button type="button" onClick={()=>{if(window.confirm("¿Eliminar el curso "+course.name+"? También se eliminarán sus estudiantes y asientos guardados en este navegador.")){schoolRepository.deleteCourse(course.id);refresh();setNotice("Curso eliminado.");}}} style={{...buttonStyle, background:"#a33d3d"}}>Eliminar</button>
                  </div>
                ))}
              </div>
            </section>
            <section style={panelStyle}>
              <h2 style={{margin:"0 0 15px", color:"#173044"}}>Plantel docente ({teachers.length})</h2>
              <div style={{display:"grid", gap:9}}>
                {teachers.map((teacher) => {
                  const guideCourse = courses.find((course)=>course.guideId===teacher.id);
                  return <div key={teacher.id} style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, padding:"10px 0", borderBottom:"1px solid #edf1f5"}}>
                    <div><strong>{teacher.name}</strong><div style={{fontSize:12, color:"#71869a"}}>{guideCourse ? "Profesor guía de "+guideCourse.name : "Docente · sin curso asignado"}</div></div>
                    <button type="button" onClick={()=>{if(window.confirm("¿Eliminar a "+teacher.name+" del plantel?")){schoolRepository.deleteTeacher(teacher.id);refresh();setCreatedAccount(null);setNotice("Profesor eliminado. Su curso quedó sin profesor guía.");}}} style={{...buttonStyle, background:"#a33d3d"}}>Eliminar</button>
                  </div>;
                })}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default TutoresPage;
