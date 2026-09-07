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

  if (!user) return <main className="home-content"><p>No existe una sesión activa.</p></main>;

  const panelButtons = [
    { icon: "⌂", title: "Inicio", description: "Panel principal del sistema.", path: "/", className: "main-option-yellow" },
    { icon: "♙", title: "Estudiantes", description: "Registra y consulta estudiantes.", path: "/estudiantes", className: "main-option-blue" },
    { icon: "▣", title: "Cursos", description: "Administra cursos y aulas.", path: "/cursos", className: "main-option-green" },
    { icon: "♧", title: "Asientos", description: "Organiza los puestos de cada aula.", path: "/asientos", className: "main-option-purple" },
    { icon: "♙", title: "Tutores", description: "Gestiona los tutores del colegio.", path: "/tutores", className: "main-option-yellow" },
    { icon: "▤", title: "Historial", description: "Consulta cambios y actividades.", path: "/historial", className: "main-option-blue" },
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
                <div className="hero-kicker"><span className="kicker-dot" /> PANEL PRINCIPAL</div>
                <p className="eyebrow">COLEGIO DON BOSCO</p>
                <h1>Bienvenido a <span>Inicio</span></h1>
                <p className="dashboard-description">
                  Hola, <strong>{user.name}</strong>. Desde aquí puedes acceder rápidamente a todas las opciones del panel de control.
                </p>
              </div>
              <div className="hero-visual" aria-hidden="true">
                <div className="hero-ring ring-one" /><div className="hero-ring ring-two" />
                <div className="hero-emblem"><strong>DB</strong><span>DON BOSCO</span></div>
                <div className="hero-pill pill-top">ORDEN</div><div className="hero-pill pill-bottom">DISCIPLINA</div>
              </div>
            </section>

            <section className="quick-section">
              <div className="section-heading">
                <div><p className="eyebrow">Panel de control</p><h2>Accesos rápidos</h2></div>
                <span className="section-label">GESTIÓN ESCOLAR</span>
              </div>

              <div className="main-options">
                {panelButtons.map((button) => (
                  <button
                    key={button.title}
                    type="button"
                    className={`main-option ${button.className}`}
                    onClick={() => navigate(button.path)}
                  >
                    <div className="option-icon">{button.icon}</div>
                    <div><h3>{button.title}</h3><p>{button.description}</p></div>
                    <span className="option-arrow">→</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="don-bosco-message">
              <div className="message-star">★</div>
              <div><strong>Todo en un solo lugar</strong><p>Accede rápidamente a cada sección del sistema de gestión escolar.</p></div>
              <span>ESTUDIO · TRABAJO · DISCIPLINA</span>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default HomePage;
