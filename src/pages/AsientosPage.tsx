import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/layout/Header";
import NavigationBar from "../components/layout/NavigationBar";
import { authRepository } from "../repositories/authRepository";
import { storageService } from "../services/storageService";
import { studentRepository } from "../repositories/studentRepository";
import { schoolRepository } from "../repositories/schoolRepository";

type SeatAssignments = Record<string, Record<number, string>>;
const ASSIGNMENTS_KEY = "don_bosco_seat_assignments";

function AsientosPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = authRepository.getCurrentUser();
  const requestedCourse = searchParams.get("curso") || "";
  const cursoSeleccionado = user?.role === "ADMIN" ? (user.curso ?? "") : requestedCourse;
  const [assignments, setAssignments] = useState<SeatAssignments>(() => storageService.get<SeatAssignments>(ASSIGNMENTS_KEY) || {});
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [studentName, setStudentName] = useState("");
  const [notice, setNotice] = useState("");
  const seats = useMemo(() => Array.from({ length: 42 }, (_, index) => index + 1), []);
  const students = useMemo(() => cursoSeleccionado ? studentRepository.getByCourse(cursoSeleccionado) : [], [cursoSeleccionado]);
  const courseAssignments = assignments[cursoSeleccionado] || {};
  const canEdit = Boolean(cursoSeleccionado) && user?.role === "ADMIN" && Boolean(user.curso) && user.curso === cursoSeleccionado;

  const handleLogout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
  };
  const saveAssignment = () => {
    if (!canEdit || selectedSeat === null) return;
    const seat = selectedSeat;
    const name = studentName.trim();
    const updated: SeatAssignments = { ...assignments, [cursoSeleccionado]: { ...courseAssignments } };
    if (name && !students.includes(name)) {
      setNotice("Selecciona un estudiante registrado en la lista del curso.");
      return;
    }
    if (name && Object.entries(courseAssignments).some(([number, assigned]) => Number(number) !== seat && assigned === name)) {
      setNotice("Ese estudiante ya tiene otro asiento asignado.");
      return;
    }
    if (name) updated[cursoSeleccionado][seat] = name;
    else delete updated[cursoSeleccionado][seat];
    setAssignments(updated);
    storageService.set(ASSIGNMENTS_KEY, updated);
    setStudentName("");
    setSelectedSeat(null);
    setNotice(name ? `Se guardó a ${name} en el asiento ${seat}.` : `Se liberó el asiento ${seat}.`);
  };

  if (!user) return null;

  return (
    <div className="dashboard">
      <Header user={user} onLogout={handleLogout} />
      <div className="dashboard-body">
        <NavigationBar />
        <main className="dashboard-content">
          {user.role !== "ADMIN" && (
            <div style={{maxWidth:1250,margin:"0 auto 18px",display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
              <label htmlFor="course-seat-filter" style={{fontWeight:700,color:"#142d55"}}>Seleccionar curso:</label>
              <select id="course-seat-filter" value={cursoSeleccionado} onChange={(event)=>navigate(event.target.value ? `/asientos?curso=${encodeURIComponent(event.target.value)}` : "/asientos")} style={{minWidth:220,padding:11,border:"1px solid #cbd5e1",borderRadius:8}}>
                <option value="">Elige un curso</option>
                {schoolRepository.getCourses().map((course)=><option key={course.id} value={course.name}>{course.name}</option>)}
              </select>
            </div>
          )}
          <section className="dashboard-hero">
            <div className="hero-text">
              <p className="eyebrow">GESTIÓN DE ASIENTOS</p>
              <h1>Asientos <span>{cursoSeleccionado || "Selecciona un curso"}</span></h1>
              <p className="dashboard-description">{canEdit ? "Selecciona un asiento y asigna un estudiante registrado en la lista del curso." : "Modo consulta: revisa el puesto asignado a cada estudiante."}</p>
            </div>
          </section>
          {!cursoSeleccionado ? (
            <section className="info-panel"><h2>Selecciona un curso</h2><p>Elige un curso para consultar la distribución de los asientos.</p></section>
          ) : (
            <section className="info-panel">
              <div className="panel-heading">
                <div><p className="eyebrow">DISTRIBUCIÓN DEL AULA</p><h2>{cursoSeleccionado}</h2><p>{Object.values(courseAssignments).filter(Boolean).length} de {seats.length} asientos ocupados</p></div>
              </div>
              {notice && <p role="status" style={{padding:12,background:"#e8f7ee",color:"#17663a",borderRadius:8}}>{notice}</p>}
              {canEdit && students.length === 0 && <p style={{padding:14,background:"#fff8e6",borderRadius:8,color:"#765500"}}>Primero registra estudiantes en la sección Estudiantes de {cursoSeleccionado}. Luego podrás asignarlos a los asientos.</p>}
              {canEdit && selectedSeat !== null && (
                <form onSubmit={(event)=>{event.preventDefault();saveAssignment();}} style={{display:"flex",flexWrap:"wrap",gap:12,alignItems:"end",margin:"22px 0",padding:18,background:"#f5f8fb",borderRadius:12}}>
                  <div style={{flex:"1 1 240px"}}>
                    <label htmlFor="student-seat-name" style={{display:"block",marginBottom:8,fontWeight:700}}>Estudiante para el asiento {selectedSeat}</label>
                    <select id="student-seat-name" value={studentName} onChange={(event)=>setStudentName(event.target.value)} autoFocus style={{width:"100%",padding:12,border:"1px solid #cbd5e1",borderRadius:8,boxSizing:"border-box"}}>
                      <option value="">Selecciona un estudiante</option>
                      {students.filter((student)=>!Object.entries(courseAssignments).some(([number,assigned])=>Number(number)!==selectedSeat&&assigned===student)).map((student)=><option key={student} value={student}>{student}</option>)}
                    </select>
                  </div>
                  <button type="submit" className="view-button">Guardar puesto</button>
                  {courseAssignments[selectedSeat] && <button type="button" className="view-button" onClick={()=>{const updated={...assignments,[cursoSeleccionado]:{...courseAssignments}};delete updated[cursoSeleccionado][selectedSeat];setAssignments(updated);storageService.set(ASSIGNMENTS_KEY,updated);setSelectedSeat(null);setStudentName("");setNotice(`Se liberó el asiento ${selectedSeat}.`);}}>Liberar asiento</button>}
                  <button type="button" className="view-button" onClick={()=>{setSelectedSeat(null);setStudentName("");}}>Cancelar</button>
                </form>
              )}
              <div style={{marginTop:24,padding:18,background:"#edf2f7",border:"1px solid #d7e0e8",borderRadius:16,overflowX:"auto"}}>
                <div style={{minWidth:620,maxWidth:1000,margin:"0 auto"}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:18,marginBottom:14,position:"relative"}}>
                    <div style={{background:"#173b5e",color:"#fff",width:"min(420px,65%)",padding:"15px 12px",borderRadius:8,textAlign:"center",boxShadow:"0 4px 0 #0d2943"}}>
                      <div style={{fontSize:11,letterSpacing:2,opacity:.8}}>FRENTE DEL AULA</div>
                      <strong style={{fontSize:20,letterSpacing:1}}>PIZARRA</strong>
                    </div>
                    <div style={{position:"absolute",right:0,top:0,bottom:0,width:76,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#d9b98c",border:"2px solid #a77b4c",borderRadius:"7px 7px 0 0",color:"#573a20"}}>
                      <span style={{fontSize:23}}>🚪</span><strong style={{fontSize:11}}>PUERTA</strong>
                    </div>
                  </div>
                  <div style={{display:"flex",justifyContent:"center",margin:"0 auto 22px"}}>
                    <div style={{minWidth:180,padding:"9px 22px",background:"#c99b62",border:"2px solid #9b6d3c",borderRadius:7,textAlign:"center",color:"#382717",boxShadow:"0 5px 0 #9b6d3c"}}>
                      <span style={{fontSize:18}}>🪑</span><strong style={{display:"block",fontSize:13}}>MESA DEL PROFESOR</strong>
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(6,minmax(82px,1fr))",gap:12}}>
                    {seats.map((seat)=>{
                      const occupant=courseAssignments[seat];
                      const isSelected=selectedSeat===seat;
                      return <button key={seat} type="button" onClick={()=>{setNotice("");if(canEdit){setSelectedSeat(seat);setStudentName(occupant||"");}}} aria-label={"Asiento "+seat+(occupant?", "+occupant:", libre")} style={{minHeight:104,padding:"10px 6px",borderRadius:9,border:isSelected?"2px solid #d4aa00":occupant?"1px solid #79b99a":"1px solid #cbd5e1",background:isSelected?"#fff3c4":occupant?"#d9f2e3":"#fff",color:"#24364b",cursor:canEdit?"pointer":"default",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,boxShadow:"0 2px 5px #1e293b12"}}>
                        <span style={{fontSize:21}}>🪑</span><strong style={{fontSize:13}}>ASIENTO {seat}</strong><span style={{fontSize:11,textAlign:"center",overflowWrap:"anywhere",lineHeight:1.25}}>{occupant||"Libre"}</span>
                      </button>;
                    })}
                  </div>
                  <div style={{display:"flex",justifyContent:"center",gap:18,flexWrap:"wrap",marginTop:18,fontSize:12,color:"#526579"}}>
                    <span>🟩 Asiento ocupado</span><span>⬜ Asiento libre</span><span>🟨 Asiento seleccionado</span>
                  </div>
                </div>
              </div>
              {!canEdit && <p style={{marginTop:18,color:"#687b8e"}}>Vista de solo lectura. Solo el profesor guía asignado puede modificar este curso.</p>}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
export default AsientosPage;
