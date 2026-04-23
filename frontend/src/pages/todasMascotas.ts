import { initNavbar } from "../components/navbar";
import axios from "axios";

const API_URL = "http://localhost:3001/api";

export function renderTodasMascotas(root: HTMLElement): void {
  root.innerHTML = `
    <div id="navbar-container"></div>
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="fw-bold">Todas las Mascotas</h4>
      </div>
      <div id="todas-mascotas-container" class="row g-3">
        <p class="text-muted">Cargando mascotas...</p>
      </div>
    </div>
  `;

  initNavbar("todas-mascotas");
  cargarTodasMascotas();
}

async function cargarTodasMascotas(): Promise<void> {
  const token = sessionStorage.getItem("token");
  const contenedor = document.getElementById("todas-mascotas-container")!;

  try {
    const response = await axios.get(`${API_URL}/mascotas`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const mascotas = response.data;

    if (mascotas.length === 0) {
      contenedor.innerHTML = `<p class="text-muted">No hay mascotas.</p>`;
      return;
    }

    contenedor.innerHTML = mascotas.map((m: any) => `
      <div class="col-md-3 col-sm-6">
        <div class="card border-0 shadow rounded-4 h-100" style="background: #e0e0e0;">
          <div class="p-3">
            <div class="rounded-3 overflow-hidden" style="height: 250px; background: #bdbdbd;">
              ${m.urlFoto
                ? `<img src="${m.urlFoto}" class="w-100 h-100" style="object-fit: cover;" />`
                : `<div class="w-100 h-100 d-flex align-items-center justify-content-center text-secondary fw-bold">SIN FOTO</div>`
              }
            </div>
          </div>
          <div class="card-body pt-0 text-center">
            <h6 class="fw-bold text-uppercase">${m.nombre}</h6>
            <p class="text-muted small mb-2">${m.especie} · ${m.edad} años</p>
            <p class="text-muted small mb-2">De: ${m.propietario.nombre}</p>
            <div class="d-flex justify-content-center gap-3">
              <span class="d-flex align-items-center gap-1">
                <i class="bi bi-heart-fill text-danger"></i>
                <span>${m.contadorLikes}</span>
              </span>
              <span class="d-flex align-items-center gap-1">
                <i class="bi bi-chat-fill text-dark"></i>
                <span>0</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    `).join("");

  } catch (error) {
    contenedor.innerHTML = `<p class="text-danger">Error al cargar las mascotas.</p>`;
  }
}