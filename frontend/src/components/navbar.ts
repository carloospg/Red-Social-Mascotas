export function initNavbar(paginaActiva: string): void {
  const token = sessionStorage.getItem("token");
  const userString = sessionStorage.getItem("user");

  if (!token || !userString) {
    import("../pages/login").then(({ renderLogin }) => {
      const app = document.getElementById("app")!;
      renderLogin(app);
    });
    return;
  }

  const usuario = JSON.parse(userString);

  const linkAdmin =
    usuario.rol === "admin"
      ? `
    <li class="nav-item">
      <a class="nav-link ${paginaActiva === "usuarios" ? "active" : ""}" href="#" id="nav-usuarios">
        <i class="bi bi-people-fill me-1"></i> Usuarios
      </a>
    </li>
    `
      : "";

  const navbarHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div class="container-fluid px-4">
        <a class="navbar-brand fw-bold" href="#" id="nav-home">
          🐾 Red Social Mascotas
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link ${paginaActiva === "home" ? "active" : ""}" href="#" id="nav-mascotas">
                <i class="bi bi-grid me-1"></i> Todas las mascotas
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link ${paginaActiva === "mis-mascotas" ? "active" : ""}" href="./misMascotas.ts" id="nav-mis-mascotas">
                <i class="bi bi-heart me-1"></i> Mis mascotas
              </a>
            </li>
            ${linkAdmin}
          </ul>
          <div class="dropdown">
            <button class="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
              🐶 ${usuario.nombre}
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
              <li>
                <span class="dropdown-item py-2">
                  <i class="bi bi-person-badge me-2 text-dark"></i>${usuario.nombre}
                </span>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <button class="dropdown-item py-2 text-danger fw-bold" id="btn-logout-nav">
                  <i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  `;

  const contenedor = document.getElementById("navbar-container");
  if (contenedor) contenedor.innerHTML = navbarHTML;

  document.getElementById("btn-logout-nav")?.addEventListener("click", () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    import("../pages/login").then(({ renderLogin }) => {
      const app = document.getElementById("app")!;
      renderLogin(app);
    });
  });
}
