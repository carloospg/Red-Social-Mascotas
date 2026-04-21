import axios from "axios";

const API_URL = "http://localhost:3001/api";

export function renderLogin(root: HTMLElement): void {
  root.innerHTML = `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-4">
          <div class="border border-dark rounded p-4">
            <h2 class="text-center mb-4">Iniciar Sesión</h2>
            <form id="login-form">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" id="email" class="form-control" placeholder="Tu email" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Contraseña</label>
                <input type="password" id="password" class="form-control" placeholder="Tu contraseña" required />
              </div>
              <div id="error-msg" class="text-danger mb-3 d-none"></div>
              <button type="submit" class="btn btn-primary w-100">Entrar</button>
              <p class="text-center mt-3">¿No tienes cuenta? <a href="#" id="go-register">Regístrate</a></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;

  const form = document.getElementById("login-form")!;
  const errorMsg = document.getElementById("error-msg")!;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const { access_token, user } = response.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      // Aquí navegaremos al home en siguientes HUs
      alert(`Bienvenido ${user.name}!`);
    } catch (error: any) {
      errorMsg.classList.remove("d-none");
      errorMsg.textContent =
        error.response?.data?.message || "Error al iniciar sesión";
    }
  });

  document.getElementById("go-register")!.addEventListener("click", (e) => {
    e.preventDefault();
    import("./register").then(({ renderRegister }) => renderRegister(root));
  });
}
