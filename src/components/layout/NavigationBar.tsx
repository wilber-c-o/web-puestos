import { useNavigate, useLocation } from "react-router-dom";

const navigationItems = [
  { icon: "⌂", label: "Vista general", path: "/" },
  { icon: "♙", label: "Estudiantes", path: "/estudiantes" },
  { icon: "▣", label: "Cursos", path: "/cursos" },
  { icon: "♧", label: "Asientos", path: "/asientos" },
  { icon: "▤", label: "Asignaciones", path: "/asignaciones" },
  { icon: "⚙", label: "Configuración", path: "/configuracion" },
];

function NavigationBar() {
  const navigate = useNavigate();
  const location = useLocation();

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
        {navigationItems.map((item) => (
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
