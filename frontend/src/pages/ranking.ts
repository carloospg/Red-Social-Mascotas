import { initNavbar } from "../components/navbar";
import axios from "axios";

const API_URL = "http://localhost:3001/api";

export function renderRanking(root: HTMLElement): void {
  root.innerHTML = `
    <div id="navbar-container"></div>
    <div class="container" style="padding-top: 70px; padding-bottom: 40px;">
      <h4 class="fw-bold mb-4">🏆 Ranking de Mascotas</h4>

      <div class="d-flex align-items-center gap-2 mb-4">
        <div class="dropdown">
          <button class="btn btn-dark dropdown-toggle" type="button" id="dropdownEspecies" data-bs-toggle="dropdown">
            Selecciona la especie
          </button>
          <ul class="dropdown-menu overflow-auto" style="max-height: 200px;" id="lista-especies"></ul>
        </div>
        <button class="btn btn-outline-dark d-none" id="btn-limpiar-filtro">
          <i class="bi bi-x-lg"></i> Quitar filtro
        </button>
        <span id="filtro-activo" class="text-muted small"></span>
      </div>

      <div id="ranking-container" class="row g-3">
        <p class="text-muted">Cargando ranking...</p>
      </div>
    </div>
  `;

  initNavbar("ranking");
  cargarEspecies();
  cargarRanking();

  document
    .getElementById("btn-limpiar-filtro")!
    .addEventListener("click", () => {
      document.getElementById("btn-limpiar-filtro")!.classList.add("d-none");
      document.getElementById("filtro-activo")!.textContent = "";
      document.getElementById("dropdownEspecies")!.textContent =
        "Selecciona la especie";
      cargarRanking();
    });
}

async function cargarEspecies(): Promise<void> {
  const token = sessionStorage.getItem("token");
  const lista = document.getElementById("lista-especies")!;

  try {
    const response = await axios.get(`${API_URL}/mascotas/especies`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const especies = response.data;

    lista.innerHTML = especies
      .map(
        (e: string) => `
      <li>
        <button class="dropdown-item text-capitalize" data-especie="${e}">${e}</button>
      </li>
    `,
      )
      .join("");

    document.querySelectorAll("[data-especie]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const especie = (btn as HTMLElement).dataset.especie!;
        document.getElementById("dropdownEspecies")!.textContent =
          especie.charAt(0).toUpperCase() + especie.slice(1);
        document.getElementById("filtro-activo")!.textContent =
          `Mostrando: ${especie}`;
        document
          .getElementById("btn-limpiar-filtro")!
          .classList.remove("d-none");
        cargarRanking(especie);
      });
    });
  } catch (error) {
    lista.innerHTML = `<li><span class="dropdown-item text-danger">Error al cargar especies</span></li>`;
  }
}

async function cargarRanking(especie?: string): Promise<void> {
  const token = sessionStorage.getItem("token");
  const contenedor = document.getElementById("ranking-container")!;

  contenedor.innerHTML = `<p class="text-muted">Cargando ranking...</p>`;

  try {
    const url = especie
      ? `${API_URL}/mascotas/ranking?especie=${especie}`
      : `${API_URL}/mascotas/ranking`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const mascotas = response.data;

    if (mascotas.length === 0) {
      contenedor.innerHTML = `<p class="text-muted">No hay mascotas en el ranking.</p>`;
      return;
    }

    contenedor.innerHTML = mascotas
      .map(
        (m: any, index: number) => `
      <div class="col-md-3 col-sm-6">
        <div class="card border-0 shadow rounded-4 h-100" style="background: #e0e0e0;">
          <div class="p-3 position-relative">
            <div class="rounded-3 overflow-hidden" style="height: 250px; background: #bdbdbd;">
              ${
                m.urlFoto
                  ? `<img src="${m.urlFoto}" class="w-100 h-100" style="object-fit: cover;" />`
                  : `<div class="w-100 h-100 d-flex align-items-center justify-content-center text-secondary fw-bold">SIN FOTO</div>`
              }
            </div>
            <span class="position-absolute top-0 start-0 m-3 badge ${index === 0 ? "bg-warning text-dark" : index === 1 ? "bg-secondary" : index === 2 ? "bg-danger" : "bg-dark"}">
              #${index + 1}
            </span>
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
                <span>${m.comentarios?.length || 0}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    `,
      )
      .join("");
  } catch (error) {
    contenedor.innerHTML = `<p class="text-danger">Error al cargar el ranking.</p>`;
  }
}
