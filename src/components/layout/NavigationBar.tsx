const navigationItems = [
  "Estudiantes",
  "Clases",
  "Asientos ocupados",
  "Asientos libres",
];


function NavigationBar() {
  return (
    <nav className="navigation-bar" aria-label="Navegación principal">
      <div className="navigation-bar__content">
        {navigationItems.map((item) => (
          <a
            className="navigation-bar__link"
            href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
            key={item}
          >
            {item}
          </a>
        ))}
      </div>
    </nav>
  );
}


export default NavigationBar;
