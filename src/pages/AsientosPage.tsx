import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/layout/Header";
import NavigationBar from "../components/layout/NavigationBar";
import { authRepository } from "../repositories/authRepository";
import { storageService } from "../services/storageService";

type SeatAssignments = Record<string, Record<number, string>>;
const ASSIGNMENTS_KEY = "don_bosco_seat_assignments";

function AsientosPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = authRepository.getCurrentUser();
  const requestedCourse = searchParams.get("curso") || "";
  const cursoSeleccionado = user?.role === "ADMIN" && user.curso && user.curso !== "TODOS" ? user.curso : requestedCourse || "Curso sin seleccionar";
  const [assignments, setAssignments] = useState<SeatAssignments>(() => storageService.get<SeatAssignments>(ASSIGNMENTS_KEY) || {});
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [studentName, setStudentName] = useState("");
  const [notice, setNotice] = useState("");
  const seats = useMemo(() => Array.from({ length: 30 }, (_, index) => index + 1), []);
  const courseAssignments = assignments[cursoSeleccionado] || {};
  const canEdit = user?.role === "ADMIN" && (!user.curso || user.curso === "TODOS" || user.curso === cursoSeleccionado);

  const handleLogout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
  };
  const saveAssignment = () => {
    if (!canEdit || selectedSeat === null) return;
    const seat = selectedSeat;
    const name = studentName.trim();
    const updated: SeatAssignments = { ...assignments, [cursoSeleccionado]: { ...courseAssignments } };
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
          <section className="dashboard-hero">
            <div className="hero-text"><p className="eyebrow">GESTIÓN DE ASIENTOS</p><h1>Asientos <span>{cursoSeleccionado}</span></h1>
              <p className="dashboard-description">{canEdit ? "Selecciona un asiento, escribe el nombre del estudiante y guarda la asignación." : "Modo consulta: revisa el puesto asignado a cada estudiante."}</p>
            </div>
          </section>
          <section className="info-panel">
            <div className="panel-heading"><div><p className="eyebrow">DISTRIBUCIÓN DEL AULA</p><h2>{cursoSeleccionado}</h2><p>{Object.values(courseAssignments).filter(Boolean).length} de {seats.length} asientos ocupados</p></div></div>
            {notice && <p role="status" style={{padding:"12px",background:"#e8f7ee",color:"#17663a",borderRadius:"8px"}}>{notice}</p>}
            {canEdit && selectedSeat !== null && (
              <form onSubmit={(event) => {event.preventDefault();saveAssignment();}} style={{display:"flex",flexWrap:"wrap",gap:"12px",alignItems:"end",margin:"22px 0",padding:"18px",background:"#f5f8fb",borderRadius:"12px"}}>
                <div style={{flex:"1 1 240px"}}><label htmlFor="student-seat-name" style={{display:"block",marginBottom:"8px",fontWeight:700}}>Estudiante para el asiento {selectedSeat}</label>
                  <input id="student-seat-name" value={studentName} onChange={(event)=>setStudentName(event.target.value)} placeholder="Nombre completo del estudiante" autoFocus style={{width:"100%",padding:"12px",border:"1px solid #cbd5e1",borderRadius:"8px",boxSizing:"border-box"}} />
                </div>
                <button type="submit" className="view-button">Guardar puesto</button>
                {courseAssignments[selectedSeat] && <button type="button" className="view-button" onClick={()=>{const seat=selectedSeat;const updated={...assignments,[cursoSeleccionado]:{...courseAssignments}};delete updated[cursoSeleccionado][seat];setAssignments(updated);storageService.set(ASSIGNMENTS_KEY,updated);setSelectedSeat(null);setStudentName("");setNotice(`Se liberó el asiento ${seat}.`);}}>Liberar asiento</button>}
                <button type="button" className="view-button" onClick={()=>{setSelectedSeat(null);setStudentName("");}}>Cancelar</button>
              </form>
            )}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(135px,1fr))",gap:"14px",marginTop:"24px"}}>
              {seats.map((seat)=>{
                const occupant=courseAssignments[seat];
                const isSelected=selectedSeat===seat;
                return <button key={seat} type="button" onClick={()=>{setNotice("");if(canEdit){setSelectedSeat(seat);setStudentName(occupant||"");}}} aria-label={`Asiento ${seat}${occupant?`, ${occupant}`: ", libre"}`} style={{minHeight:"112px",padding:"14px 10px",borderRadius:"10px",border:isSelected?"2px solid #d4aa00":occupant?"1px solid #79b99a":"1px solid #d7e0e8",background:isSelected?"#fff8dc":occupant?"#e9f7ef":"#ffffff",color:"#24364b",cursor:canEdit?"pointer":"default",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"7px"}}>
                  <span style={{fontSize:"23px"}}>🪑</span><strong>Asiento {seat}</strong><span style={{fontSize:"12px",textAlign:"center",overflowWrap:"anywhere"}}>{occupant||"Libre"}</span>
                </button>;
              })}
            </div>
            {!canEdit && <p style={{marginTop:"18px",color:"#687b8e"}}>Vista de solo lectura. Solo el profesor guía asignado puede modificar este curso.</p>}
          </section>
        </main>
      </div>
    </div>
  );
}
export default AsientosPage;
