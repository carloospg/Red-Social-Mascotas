import axios from "axios";

const API_URL = "http://localhost:3001/api";

export function renderRegister(root: HTMLElement): void {
  root.innerHTML = `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-4">
          <div class="border border-dark rounded p-4">
            <h2 class="text-center mb-4">Registro</h2>
            <form id="register-form">
              <div class="mb-3">
                <label class="form-label">Nombre</label>
                <input type="text" id="nombre" class="form-control" placeholder="Tu nombre" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" id="email" class="form-control" placeholder="Tu email" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Contraseña</label>
                <input type="password" id="password" class="form-control" placeholder="Mínimo 6 caracteres" required />
              </div>
              <div id="error-msg" class="text-danger mb-3 d-none"></div>
              <button type="submit" class="btn btn-primary w-100">Registrarse</button>
              <p class="text-center mt-3">¿Ya tienes cuenta? <a href="#" id="go-login">Inicia sesión</a></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;

  const form = document.getElementById("register-form")!;
  const errorMsg = document.getElementById("error-msg")!;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = (document.getElementById("nombre") as HTMLInputElement)
      .value;
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;

    try {
      await axios.post(`${API_URL}/users/register`, {
        nombre,
        email,
        password,
      });

      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const { access_token, user } = response.data;

      sessionStorage.setItem("token", access_token);
      sessionStorage.setItem("user", JSON.stringify(user));

      import("./misMascotas").then(({ renderMisMascotas }) => {
        const app = document.getElementById("app")!;
        renderMisMascotas(app);
      });
    } catch (error: any) {
      errorMsg.classList.remove("d-none");
      errorMsg.textContent =
        error.response?.data?.message || "Error al registrarse";
    }
  });

  document.getElementById("go-login")!.addEventListener("click", (e) => {
    e.preventDefault();
    import("./login").then(({ renderLogin }) => renderLogin(root));
  });
}
