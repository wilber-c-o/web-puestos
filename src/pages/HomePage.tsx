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
    icon: "👨‍🎓",
    tone: "gold",
  },
  {
    label: "Clases activas",
    value: "8",
    detail: "En jornada actualmente",
    icon: "📖",
    tone: "blue",
  },
  {
    label: "Asientos ocupados",
    value: "46",
    detail: "De 60 disponibles",
    icon: "🪑",
    tone: "orange",
  },
  {
    label: "Asientos libres",
    value: "14",
    detail: "Disponibles para asignar",
    icon: "✓",
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

  if (!user) {
    return (
      <main className="home-content">
        <p>No existe una sesión activa.</p>
      </main>
    );
  }

  return (
    <div className="dashboard">
      <Header user={user} onLogout={handleLogout} />

      <div className="dashboard-body">
        <NavigationBar />

        <main className="dashboard-content">

          <section className="dashboard-hero">
            <div>
              <p className="eyebrow">Panel de control</p>

              <h1>
                Todo listo para organizar tu jornada.
              </h1>

              <p className="dashboard-description">
                Consulta el estado de los puestos y administra la
                información de los estudiantes desde un solo lugar.
              </p>
            </div>

            <div className="dashboard-date">
              <span>HOY</span>
              <strong>18</strong>
              <small>junio, 2025</small>
            </div>
          </section>

          <section>

            <div className="section-heading">
              <div>
                <p className="eyebrow">Vista general</p>
                <h2>Resumen del día</h2>
              </div>

              <span className="status-pill">
                <i />
                Sistema actualizado
              </span>
            </div>

            <div className="summary-grid">
              {summaryCards.map((card) => (
                <article
                  className={`summary-card summary-card--${card.tone}`}
                  key={card.label}
                >
                  <div className="summary-card-icon">
                    {card.icon}
                  </div>

                  <p>{card.label}</p>

                  <strong>{card.value}</strong>

                  <small>{card.detail}</small>
                </article>
              ))}
            </div>

          </section>

          <section className="dashboard-lower">

            <article className="activity-panel">

              <div className="panel-heading">
                <div>
                  <p className="eyebrow">Actividad reciente</p>
                  <h2>Últimos movimientos</h2>
                </div>

                <button className="view-button">
                  Ver todo →
                </button>
              </div>

              <div className="activity-item">
                <div className="activity-icon gold">
                  ✦
                </div>

                <div className="activity-info">
                  <strong>Nueva asignación de puesto</strong>
                  <p>Clase de Matemática · Puesto B-12</p>
                </div>

                <time>Hace 8 min</time>
              </div>

              <div className="activity-item">
                <div className="activity-icon blue">
                  👤
                </div>

                <div className="activity-info">
                  <strong>Estudiante registrado</strong>
                  <p>María Fernanda López fue agregada al sistema</p>
                </div>

                <time>Hace 24 min</time>
              </div>

              <div className="activity-item">
                <div className="activity-icon green">
                  🪑
                </div>

                <div className="activity-info">
                  <strong>Asiento liberado</strong>
                  <p>Clase de Ciencias · Puesto A-04</p>
                </div>

                <time>Hace 1 h</time>
              </div>

            </article>

            <aside className="profile-panel">

              <p className="eyebrow">Tu perfil</p>

              <h2>Sesión actual</h2>

              <div className="profile-user">

                <div className="profile-avatar">
                  {user.name.charAt(0)}
                </div>

                <div>
                  <strong>{user.name}</strong>
                  <span>{user.role}</span>
                </div>

              </div>

              <div className="profile-details">

                <div>
                  <span>CARNET</span>
                  <strong>{user.carnet}</strong>
                </div>

                <div>
                  <span>ACCESO</span>
                  <strong>Administrador</strong>
                </div>

              </div>

            </aside>

          </section>

        </main>
      </div>
    </div>
  );
}

export default HomePage;