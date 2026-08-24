import { useNavigate } from "react-router-dom";


import Header from "../components/layout/Header";

import NavigationBar from "../components/layout/NavigationBar";

import { authRepository } from "../repositories/authRepository";


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

          <main className="home-content">
            <p className="eyebrow">Resumen</p>
            <h1>Página principal</h1>
            <p className="home-content__description">
              Seleccione una opción para comenzar a gestionar la información disponible.
            </p>
            <dl className="user-summary">
              <div>
                <dt>Carnet</dt>
                <dd>{user.carnet}</dd>
              </div>
              <div>
                <dt>Rol asignado</dt>
                <dd>{user.role}</dd>
              </div>
            </dl>
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
