import { useNavigate } from "react-router-dom";


import Header from "../components/layout/Header";
import NavigationBar from "../components/layout/NavigationBar";
import { authRepository } from "../repositories/authRepository";
import "./HomePage.css";


const summaryCards = [
  {
    label: "Estudiantes registrados",
    value: "128",
    detail: "12 incorporados este mes",
    icon: "people",
    tone: "gold",
  },
  {
    label: "Clases activas",
    value: "8",
    detail: "En jornada actualmente",
    icon: "book",
    tone: "blue",
  },
  {
    label: "Asientos ocupados",
    value: "46",
    detail: "De 60 disponibles",
    icon: "seat",
    tone: "terracotta",
  },
  {
    label: "Asientos libres",
    value: "14",
    detail: "Disponibles para asignar",
    icon: "chair",
    tone: "green",
  },
];


function HomePage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();


  const handleLogout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
  };


  return (
    <div className="app-shell">
      {user ? (
        <>
          <Header user={user} onLogout={handleLogout} />
          <NavigationBar />
          <main className="home-content">
            <section className="home-hero" aria-labelledby="home-title">
              <div>
                <p className="eyebrow">Panel de control</p>
                <h1 id="home-title">Todo listo para organizar tu jornada.</h1>
                <p className="home-content__description">
                  Consulta el estado de los puestos y administra la información de
                  estudiantes desde un solo lugar.
                </p>
              </div>
              <div className="home-date" aria-label="Fecha de hoy">
                <span>Hoy</span>
                <strong>18</strong>
                <small>junio, 2025</small>
              </div>
            </section>

            <section aria-labelledby="summary-title">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Vista general</p>
                  <h2 id="summary-title">Resumen del día</h2>
                </div>
                <span className="status-pill"><i /> Sistema actualizado</span>
              </div>

              <div className="summary-grid">
                {summaryCards.map((card) => (
                  <article className={`summary-card summary-card--${card.tone}`} key={card.label}>
                    <div className="summary-card__icon" aria-hidden="true">
                      <span className={`icon icon--${card.icon}`} />
                    </div>
                    <p>{card.label}</p>
                    <strong>{card.value}</strong>
                    <small>{card.detail}</small>
                    {card.icon === "people" && (
                      <button
                        className="summary-card__action"
                        type="button"
                        onClick={() => navigate("/estudiantes")}
                      >
                        Ver estudiantes <span aria-hidden="true">→</span>
                      </button>
                    )}
                  </article>
                ))}
              </div>
            </section>

            <section className="home-lower-grid" aria-label="Información complementaria">
              <article className="activity-panel">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">Actividad reciente</p>
                    <h2>Últimos movimientos</h2>
                  </div>
                  <button type="button" className="text-button">Ver todo <span>→</span></button>
                </div>
                <ul className="activity-list">
                  <li><span className="activity-dot activity-dot--gold" /><div><strong>Nueva asignación de puesto</strong><p>Clase de Matemática · Puesto B-12</p></div><time>Hace 8 min</time></li>
                  <li><span className="activity-dot activity-dot--blue" /><div><strong>Estudiante registrado</strong><p>María Fernanda López fue agregada al sistema</p></div><time>Hace 24 min</time></li>
                  <li><span className="activity-dot activity-dot--green" /><div><strong>Asiento liberado</strong><p>Clase de Ciencias · Puesto A-04</p></div><time>Hace 1 h</time></li>
                </ul>
              </article>

              <aside className="profile-panel" aria-labelledby="profile-title">
                <p className="eyebrow">Tu perfil</p>
                <h2 id="profile-title">Sesión actual</h2>
                <div className="profile-panel__identity">
                  <span>{user.name.charAt(0)}</span>
                  <div><strong>{user.name}</strong><small>{user.role}</small></div>
                </div>
                <dl className="user-summary">
                  <div><dt>Carnet</dt><dd>{user.carnet}</dd></div>
                  <div><dt>Acceso</dt><dd>Administrador</dd></div>
                </dl>
              </aside>
            </section>
          </main>
        </>
      ) : (
        <main className="home-content">
          <p>No existe una sesión activa.</p>
        </main>
      )}
    </div>
  );
}


export default HomePage;
