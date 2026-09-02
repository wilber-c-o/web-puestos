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

          {/* BIENVENIDA */}
          <section className="dashboard-hero">

            <div className="hero-text">

              <p className="eyebrow">
                COLEGIO DON BOSCO
              </p>

              <h1>
                Gestión de
                <br />
                <span>Asientos</span>
              </h1>

              <p className="dashboard-description">
                Organiza los puestos de tu aula de forma sencilla.
                Administra estudiantes, aulas y asignaciones desde
                un solo lugar.
              </p>

            </div>

            <div className="hero-message">

              <span>ESTUDIO</span>
              <span>TRABAJO</span>
              <span>DISCIPLINA</span>

              <div className="hero-line"></div>

            </div>

          </section>


          {/* OPCIONES PRINCIPALES */}
          <section className="main-options">

            <article
              className="main-option main-option-yellow"
              onClick={() => navigate("/asientos")}
            >

              <div className="option-icon">
                🪑
              </div>

              <div>
                <h2>Gestionar asientos</h2>

                <p>
                  Visualiza el mapa de asientos y organiza
                  los puestos de tus aulas.
                </p>
              </div>

              <span className="option-arrow">
                →
              </span>

            </article>


            <article
              className="main-option main-option-blue"
              onClick={() => navigate("/estudiantes")}
            >

              <div className="option-icon">
                👥
              </div>

              <div>
                <h2>Administrar estudiantes</h2>

                <p>
                  Registra, edita y consulta la información
                  de los estudiantes.
                </p>
              </div>

              <span className="option-arrow">
                →
              </span>

            </article>

          </section>


          {/* CONTENIDO INFERIOR */}
          <section className="dashboard-lower">


            {/* AULAS */}
            <article className="info-panel">

              <div className="panel-heading">

                <div>
                  <p className="eyebrow">
                    Organización
                  </p>

                  <h2>
                    Mis aulas
                  </h2>
                </div>

                <button
                  className="view-button"
                  onClick={() => navigate("/clases")}
                >
                  Ver todas →
                </button>

              </div>


              <div className="classroom-list">

                <div className="classroom-item">
                  <div className="classroom-icon">
                    01
                  </div>

                  <div>
                    <strong>
                      Aula 1
                    </strong>

                    <span>
                      1° de Secundaria A
                    </span>
                  </div>

                  <span className="item-arrow">
                    →
                  </span>
                </div>


                <div className="classroom-item">
                  <div className="classroom-icon">
                    02
                  </div>

                  <div>
                    <strong>
                      Aula 2
                    </strong>

                    <span>
                      1° de Secundaria B
                    </span>
                  </div>

                  <span className="item-arrow">
                    →
                  </span>
                </div>


                <div className="classroom-item">
                  <div className="classroom-icon">
                    03
                  </div>

                  <div>
                    <strong>
                      Aula 3
                    </strong>

                    <span>
                      2° de Secundaria A
                    </span>
                  </div>

                  <span className="item-arrow">
                    →
                  </span>
                </div>


                <div className="classroom-item">
                  <div className="classroom-icon">
                    04
                  </div>

                  <div>
                    <strong>
                      Aula 4
                    </strong>

                    <span>
                      2° de Secundaria B
                    </span>
                  </div>

                  <span className="item-arrow">
                    →
                  </span>
                </div>

              </div>

            </article>


            {/* ÚLTIMAS ASIGNACIONES */}
            <article className="info-panel">

              <div className="panel-heading">

                <div>
                  <p className="eyebrow">
                    Asientos
                  </p>

                  <h2>
                    Últimas asignaciones
                  </h2>
                </div>

                <button
                  className="view-button"
                  onClick={() => navigate("/asignaciones")}
                >
                  Ver todas →
                </button>

              </div>


              <div className="assignment-list">

                <div className="assignment-item">

                  <div className="assignment-dot yellow"></div>

                  <div>
                    <strong>
                      Juan Pérez
                    </strong>

                    <span>
                      Aula 1 · Puesto 12
                    </span>
                  </div>

                  <time>
                    10:24
                  </time>

                </div>


                <div className="assignment-item">

                  <div className="assignment-dot blue"></div>

                  <div>
                    <strong>
                      María Gómez
                    </strong>

                    <span>
                      Aula 3 · Puesto 05
                    </span>
                  </div>

                  <time>
                    09:47
                  </time>

                </div>


                <div className="assignment-item">

                  <div className="assignment-dot yellow"></div>

                  <div>
                    <strong>
                      Luis Fernández
                    </strong>

                    <span>
                      Aula 2 · Puesto 18
                    </span>
                  </div>

                  <time>
                    08:31
                  </time>

                </div>


                <div className="assignment-item">

                  <div className="assignment-dot blue"></div>

                  <div>
                    <strong>
                      Ana Torres
                    </strong>

                    <span>
                      Aula 1 · Puesto 07
                    </span>
                  </div>

                  <time>
                    08:12
                  </time>

                </div>

              </div>

            </article>

          </section>


          {/* MENSAJE FINAL */}
          <section className="don-bosco-message">

            <div className="message-star">
              ★
            </div>

            <p>
              Un entorno organizado también forma
              mejores personas.
            </p>

            <span>
              COLEGIO DON BOSCO
            </span>

          </section>

        </main>

      </div>

    </div>
  );
}

export default HomePage;