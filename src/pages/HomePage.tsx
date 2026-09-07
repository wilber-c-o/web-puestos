import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import NavigationBar from "../components/layout/NavigationBar";
import { authRepository } from "../repositories/authRepository";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();
  const user = authRepository.getCurrentUser();

  const handleLogout = () => {
    authRepository.logout();
    navigate("/login", { replace: true });
  };

  if (!user) {
    return <main className="home-content"><p>No existe una sesión activa.</p></main>;
  }

  const stats = [
    { icon: "♙", value: "24", label: "Estudiantes", detail: "Registrados", path: "/estudiantes", className: "stat-yellow" },
    { icon: "▣", value: "4", label: "Cursos", detail: "Disponibles", path: "/cursos", className: "stat-blue" },
    { icon: "♧", value: "40", label: "Puestos", detail: "Organizados", path: "/asientos", className: "stat-green" },
  ];

  const cursos = [
    ["01", "Curso 1", "1° de Secundaria A"],
    ["02", "Curso 2", "1° de Secundaria B"],
    ["03", "Curso 3", "2° de Secundaria A"],
    ["04", "Curso 4", "2° de Secundaria B"],
  ];

  const assignments = [
    ["yellow", "Juan Pérez", "Curso 1 · Puesto 12", "10:24"],
    ["blue", "María Gómez", "Curso 3 · Puesto 05", "09:47"],
    ["yellow", "Luis Fernández", "Curso 2 · Puesto 18", "08:31"],
    ["blue", "Ana Torres", "Curso 1 · Puesto 07", "08:12"],
  ];

  return (
    <div className="dashboard">
      <Header user={user} onLogout={handleLogout} />

      <div className="dashboard-body">
        <NavigationBar />

        <main className="dashboard-content">
          <div className="content-container">
            <section className="dashboard-hero">
              <div className="hero-glow" />
              <div className="hero-text">
                <div className="hero-kicker">
                  <span className="kicker-dot" />
                  PANEL PRINCIPAL
                </div>
                <p className="eyebrow">COLEGIO DON BOSCO</p>
                <h1>Gestión de <span>Asientos</span></h1>
                <p className="dashboard-description">
                  Bienvenido, <strong>{user.name}</strong>. Administra estudiantes,
                  cursos y puestos de aula de forma rápida y organizada.
                </p>
                <div className="hero-actions">
                  <button className="hero-primary" onClick={() => navigate("/asientos")}>
                    <span>Gestionar puestos</span><b>→</b>
                  </button>
                  <button className="hero-secondary" onClick={() => navigate("/cursos")}>
                    Ver cursos
                  </button>
                </div>
              </div>

              <div className="hero-visual" aria-hidden="true">
                <div className="hero-ring ring-one" />
                <div className="hero-ring ring-two" />
                <div className="hero-emblem">
                  <strong>DB</strong>
                  <span>DON BOSCO</span>
                </div>
                <div className="hero-pill pill-top">ORDEN</div>
                <div className="hero-pill pill-bottom">DISCIPLINA</div>
              </div>
            </section>

            <section className="stats-grid" aria-label="Resumen">
              {stats.map((stat) => (
                <button
                  key={stat.label}
                  className={`stat-card ${stat.className}`}
                  onClick={() => navigate(stat.path)}
                >
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-info">
                    <span>{stat.label}</span>
                    <strong>{stat.value}</strong>
                    <small>{stat.detail}</small>
                  </div>
                  <span className="stat-arrow">↗</span>
                </button>
              ))}
            </section>

            <section className="quick-section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Accesos rápidos</p>
                  <h2>Todo lo que necesitas, en un solo lugar</h2>
                </div>
                <span className="section-label">GESTIÓN ESCOLAR</span>
              </div>

              <div className="main-options">
                <button className="main-option main-option-yellow" onClick={() => navigate("/asientos")}>
                  <div className="option-icon">🪑</div>
                  <div><h3>Gestionar asientos</h3><p>Organiza los puestos de cada aula.</p></div>
                  <span className="option-arrow">→</span>
                </button>
                <button className="main-option main-option-blue" onClick={() => navigate("/estudiantes")}>
                  <div className="option-icon">👥</div>
                  <div><h3>Administrar estudiantes</h3><p>Registra y consulta estudiantes.</p></div>
                  <span className="option-arrow">→</span>
                </button>
                <button className="main-option main-option-green" onClick={() => navigate("/cursos")}>
                  <div className="option-icon">📚</div>
                  <div><h3>Ver cursos</h3><p>Consulta cursos y aulas disponibles.</p></div>
                  <span className="option-arrow">→</span>
                </button>
                <button className="main-option main-option-purple" onClick={() => navigate("/asignaciones")}>
                  <div className="option-icon">✓</div>
                  <div><h3>Asignaciones</h3><p>Revisa la actividad de los puestos.</p></div>
                  <span className="option-arrow">→</span>
                </button>
              </div>
            </section>

            <section className="dashboard-lower">
              <article className="info-panel">
                <div className="panel-heading">
                  <div><p className="eyebrow">Organización</p><h2>Mis cursos</h2></div>
                  <button className="view-button" onClick={() => navigate("/cursos")}>Ver todos →</button>
                </div>
                <div className="classroom-list">
                  {cursos.map(([number, title, subtitle]) => (
                    <button key={number} className="classroom-item" onClick={() => navigate("/cursos")}>
                      <div className="classroom-icon">{number}</div>
                      <div><strong>{title}</strong><span>{subtitle}</span></div>
                      <span className="item-arrow">→</span>
                    </button>
                  ))}
                </div>
              </article>

              <article className="info-panel">
                <div className="panel-heading">
                  <div><p className="eyebrow">Actividad reciente</p><h2>Últimas asignaciones</h2></div>
                  <button className="view-button" onClick={() => navigate("/asignaciones")}>Ver todas →</button>
                </div>
                <div className="assignment-list">
                  {assignments.map(([color, name, place, time]) => (
                    <button key={name} className="assignment-item" onClick={() => navigate("/asignaciones")}>
                      <div className={`assignment-dot ${color}`} />
                      <div><strong>{name}</strong><span>{place}</span></div>
                      <time>{time}</time>
                    </button>
                  ))}
                </div>
              </article>
            </section>

            <section className="don-bosco-message">
              <div className="message-star">★</div>
              <div><strong>Organización para aprender mejor</strong><p>Un aula organizada también forma mejores personas.</p></div>
              <span>ESTUDIO · TRABAJO · DISCIPLINA</span>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default HomePage;
