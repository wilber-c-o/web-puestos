import { useNavigate, useLocation } from "react-router-dom";
import { authRepository } from "../../repositories/authRepository";

const navigationItems: { icon: string; label: string; path: string; adminOnly?: boolean }[] = [
  { icon: "⌂", label: "Inicio", path: "/" },
  { icon: "♙", label: "Estudiantes", path: "/estudiantes", adminOnly: true },
  { icon: "▣", label: "Cursos", path: "/cursos" },
  { icon: "♧", label: "Asientos", path: "/asientos" },
  { icon: "♙", label: "Tutores", path: "/tutores", adminOnly: true },
  { icon: "▤", label: "Historial", path: "/historial", adminOnly: true },
];

function NavigationBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authRepository.getCurrentUser();
  const visibleItems = navigationItems.filter((item) => {
    if (user?.role === "ADMIN") {
      return ["Inicio", "Cursos", "Asientos"].includes(item.label);
    }
    return !item.adminOnly;
  });

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">DB</div>
        <div>
          <strong>COLEGIO DON BOSCO</strong>
          <span>Gestión de Asientos</span>
        </div>
      </div>

      <div className="sidebar-title">PANEL DE CONTROL</div>

      <nav className="sidebar-navigation">
        {visibleItems.map((item) => (
          <button
            type="button"
            className={`sidebar-link ${location.pathname === item.path ? "sidebar-link-active" : ""}`}
            key={item.label}
            onClick={() => navigate(item.path)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="footer-line" />
        <p>
          DISCIPLINA
          <br />
          FORMACIÓN
          <br />
          BUENOS CIUDADANOS
        </p>
      </div>
    </aside>
  );
}

export default NavigationBar;
