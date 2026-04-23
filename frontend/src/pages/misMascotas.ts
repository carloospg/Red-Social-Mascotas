import { initNavbar } from "../components/navbar";
import axios from "axios";

const API_URL = "http://localhost:3001/api";

export function renderMisMascotas(root: HTMLElement): void {
  root.innerHTML = `
    <div id="navbar-container"></div>
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="fw-bold">Mis Mascotas</h4>
        <button class="btn btn-dark" data-bs-toggle="modal" data-bs-target="#modalAddMascota">
          <i class="bi bi-plus-circle me-1"></i> Añadir mascota
        </button>
      </div>
      <div id="mis-mascotas-container" class="row g-3">
        <p class="text-muted">Cargando tus mascotas...</p>
      </div>
    </div>

    <div class="modal fade" id="modalAddMascota" tabindex="-1">
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content border border-dark">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">Nueva Mascota</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="form-add-mascota">
              <div class="mb-3">
                <label class="form-label">Nombre</label>
                <input type="text" id="mascota-nombre" class="form-control" placeholder="Nombre de tu mascota" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Especie</label>
                <input type="text" id="mascota-especie" class="form-control" placeholder="Perro, Gato, Conejo..." required />
              </div>
              <div class="mb-3">
                <label class="form-label">Edad</label>
                <input type="number" id="mascota-edad" class="form-control" placeholder="Edad en años" min="0" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Descripción</label>
                <textarea id="mascota-descripcion" class="form-control" placeholder="Cuéntanos algo de tu mascota..." rows="2"></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Foto</label>
                <input type="file" id="mascota-foto" class="form-control" accept="image/*" />
              </div>
              <div id="error-mascota" class="text-danger mb-3 d-none"></div>
              <div class="d-flex gap-2">
                <button type="button" class="btn btn-secondary w-50" data-bs-dismiss="modal">Cerrar</button>
                <button type="submit" class="btn btn-dark w-50">Crear mascota</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;

  initNavbar("mis-mascotas");
  cargarMisMascotas();

  const token = sessionStorage.getItem("token");

  document
    .getElementById("form-add-mascota")!
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const nombre = (
        document.getElementById("mascota-nombre") as HTMLInputElement
      ).value;
      const especie = (
        document.getElementById("mascota-especie") as HTMLInputElement
      ).value;
      const edad = Number(
        (document.getElementById("mascota-edad") as HTMLInputElement).value,
      );
      const descripcion = (
        document.getElementById("mascota-descripcion") as HTMLTextAreaElement
      ).value;
      const fotoInput = document.getElementById(
        "mascota-foto",
      ) as HTMLInputElement;
      const errorMsg = document.getElementById("error-mascota")!;

      try {
        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("especie", especie);
        formData.append("edad", String(edad));
        formData.append("descripcion", descripcion);

        if (fotoInput.files && fotoInput.files[0]) {
          formData.append("foto", fotoInput.files[0]);
        }

        await axios.post(`${API_URL}/mascotas`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        window.location.reload();
      } catch (error: any) {
        errorMsg.classList.remove("d-none");
        errorMsg.textContent =
          error.response?.data?.message || "Error al crear la mascota";
      }
    });
}

async function cargarMisMascotas(): Promise<void> {
  const token = sessionStorage.getItem("token");
  const contenedor = document.getElementById("mis-mascotas-container")!;

  try {
    const response = await axios.get(`${API_URL}/mascotas/mis-mascotas`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const mascotas = response.data;

    if (mascotas.length === 0) {
      contenedor.innerHTML = `<p class="text-muted">No hay mascotas.</p>`;
      return;
    }

    contenedor.innerHTML = mascotas
      .map(
        (m: any) => `
      <div class="col-md-3 col-sm-6">
        <div class="card border-0 shadow rounded-4 h-100" style="background: #e0e0e0;">
          <div class="p-3">
            <div class="rounded-3 overflow-hidden" style="height: 250px; background: #bdbdbd;">
              ${
                m.urlFoto
                  ? `<img src="${m.urlFoto}" class="w-100 h-100" style="object-fit: cover;" />`
                  : `<div class="w-100 h-100 d-flex align-items-center justify-content-center text-secondary fw-bold">SIN FOTO</div>`
              }
            </div>
          </div>
          <div class="card-body pt-0 text-center">
            <h6 class="fw-bold text-uppercase">${m.nombre}</h6>
            <p class="text-muted small mb-2">${m.especie} · ${m.edad} años</p>
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
    `,
      )
      .join("");
  } catch (error) {
    contenedor.innerHTML = `<p class="text-danger">No hay mascotas</p>`;
  }
}
