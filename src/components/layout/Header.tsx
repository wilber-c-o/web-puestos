import type { User } from "../../types/auth";


interface HeaderProps {
  user: User;
  onLogout: () => void;
}


function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header__brand" aria-label="Sistema de gestión de puestos">
        <span className="app-header__mark" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span>Sistema de puestos</span>
      </div>

      <div className="app-header__user">
        <div>
          <p>Bienvenido/a</p>
          <strong>{user.name}</strong>
        </div>
        <button className="app-header__logout" type="button" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}


export default Header;
