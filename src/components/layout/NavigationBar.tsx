const navigationItems = [
  { icon: "⌂", label: "Vista general" },
  { icon: "♙", label: "Estudiantes" },
  { icon: "▣", label: "Clases" },
  { icon: "♧", label: "Asientos" },
  { icon: "▤", label: "Asignaciones" },
  { icon: "⚙", label: "Configuración" },
];

function NavigationBar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-brand">

        <div className="sidebar-logo">
          DB
        </div>

        <div>
          <strong>COLEGIO DON BOSCO</strong>
          <span>Gestión de Asientos</span>
        </div>

      </div>

      <div className="sidebar-title">
        PANEL DE CONTROL
      </div>

      <nav className="sidebar-navigation">

        {navigationItems.map((item, index) => (
          <a
            href="#"
            className={`sidebar-link ${
              index === 0 ? "sidebar-link-active" : ""
            }`}
            key={item.label}
          >
            <span className="sidebar-icon">
              {item.icon}
            </span>

            <span>{item.label}</span>
          </a>
        ))}

      </nav>

      <div className="sidebar-footer">

        <div className="footer-line"></div>

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