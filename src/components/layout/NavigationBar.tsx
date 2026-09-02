const navigationItems = [
  { icon: "⌂", label: "Vista general" },
  { icon: "♙", label: "Estudiantes" },
  { icon: "▣", label: "Clases" },
  { icon: "♧", label: "Asientos" },
  { icon: "▤", label: "Asignaciones" },
  { icon: "▥", label: "Reportes" },
  { icon: "⚙", label: "Configuración" },
];

function NavigationBar() {
  return (
    <aside className="sidebar">

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

            {item.label}
          </a>
        ))}

      </nav>

      <div className="sidebar-footer">

        <div className="don-bosco-logo">
          DB
        </div>

        <strong>COLEGIO DON BOSCO</strong>

        <p>
          Formamos buenos cristianos
          <br />
          y honrados ciudadanos
        </p>

        <small>
          © 2026 Colegio Don Bosco
        </small>

      </div>

    </aside>
  );
}

export default NavigationBar;