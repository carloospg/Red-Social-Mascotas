import { initNavbar } from "../components/navbar";
import axios from "axios";

const API_URL = "http://localhost:3001/api";

export function renderTodasMascotas(root: HTMLElement): void {
  const userString = sessionStorage.getItem("user");
  const usuario = userString ? JSON.parse(userString) : null;
  const esAdmin = usuario?.rol === "admin";

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

    <!-- Modal Editar (solo admin) -->
    ${
      esAdmin
        ? `
    <div class="modal fade" id="modalEditMascota" tabindex="-1">
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content border border-dark">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">Editar Mascota</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="form-edit-mascota">
              <input type="hidden" id="edit-mascota-id" />
              <div class="mb-3">
                <label class="form-label">Nombre</label>
                <input type="text" id="edit-mascota-nombre" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Especie</label>
                <input type="text" id="edit-mascota-especie" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Edad</label>
                <input type="number" id="edit-mascota-edad" class="form-control" min="0" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Descripción</label>
                <textarea id="edit-mascota-descripcion" class="form-control" rows="2"></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Foto</label>
                <input type="file" id="edit-mascota-foto" class="form-control" accept="image/*" />
              </div>
              <div id="error-edit-mascota" class="text-danger mb-3 d-none"></div>
              <div class="d-flex gap-2">
                <button type="button" class="btn btn-danger btn-sm" id="btn-delete-mascota">
                  <i class="bi bi-trash"></i>
                </button>
                <button type="button" class="btn btn-secondary flex-grow-1" data-bs-dismiss="modal">Cerrar</button>
                <button type="submit" class="btn btn-dark flex-grow-1">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    `
        : ""
    }
  `;

  initNavbar("todas-mascotas");
  cargarTodasMascotas(esAdmin);

  if (esAdmin) {
    const token = sessionStorage.getItem("token");

    document
      .getElementById("form-edit-mascota")!
      .addEventListener("submit", async (e) => {
        e.preventDefault();

        const id = (
          document.getElementById("edit-mascota-id") as HTMLInputElement
        ).value;
        const nombre = (
          document.getElementById("edit-mascota-nombre") as HTMLInputElement
        ).value;
        const especie = (
          document.getElementById("edit-mascota-especie") as HTMLInputElement
        ).value;
        const edad = Number(
          (document.getElementById("edit-mascota-edad") as HTMLInputElement)
            .value,
        );
        const descripcion = (
          document.getElementById(
            "edit-mascota-descripcion",
          ) as HTMLTextAreaElement
        ).value;
        const fotoInput = document.getElementById(
          "edit-mascota-foto",
        ) as HTMLInputElement;
        const errorMsg = document.getElementById("error-edit-mascota")!;

        try {
          const formData = new FormData();
          formData.append("nombre", nombre);
          formData.append("especie", especie);
          formData.append("edad", String(edad));
          formData.append("descripcion", descripcion);

          if (fotoInput.files && fotoInput.files[0]) {
            formData.append("foto", fotoInput.files[0]);
          }

          await axios.patch(`${API_URL}/mascotas/${id}`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });

          window.location.reload();
        } catch (error: any) {
          errorMsg.classList.remove("d-none");
          errorMsg.textContent =
            error.response?.data?.message || "Error al editar la mascota";
        }
      });

    document
      .getElementById("btn-delete-mascota")!
      .addEventListener("click", async () => {
        const id = (
          document.getElementById("edit-mascota-id") as HTMLInputElement
        ).value;

        if (!confirm("¿Estás seguro de que quieres eliminar esta mascota?"))
          return;

        try {
          await axios.delete(`${API_URL}/mascotas/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          window.location.reload();
        } catch (error: any) {
          alert("Error al eliminar la mascota");
        }
      });
  }
}

async function cargarTodasMascotas(esAdmin: boolean): Promise<void> {
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

    contenedor.innerHTML = mascotas
      .map(
        (m: any) => `
      <div class="col-md-3 col-sm-6">
        <div
          class="card border-0 shadow rounded-4 h-100 ${esAdmin ? "btn-editar-mascota" : ""}"
          style="background: #e0e0e0; ${esAdmin ? "cursor: pointer;" : ""}"
          ${
            esAdmin
              ? `
            data-bs-toggle="modal"
            data-bs-target="#modalEditMascota"
            data-id="${m._id}"
            data-nombre="${m.nombre}"
            data-especie="${m.especie}"
            data-edad="${m.edad}"
            data-descripcion="${m.descripcion || ""}"
          `
              : ""
          }
        >
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
    `,
      )
      .join("");

    if (esAdmin) {
      document.querySelectorAll(".btn-editar-mascota").forEach((btn) => {
        btn.addEventListener("click", () => {
          const el = btn as HTMLElement;
          (
            document.getElementById("edit-mascota-id") as HTMLInputElement
          ).value = el.dataset.id!;
          (
            document.getElementById("edit-mascota-nombre") as HTMLInputElement
          ).value = el.dataset.nombre!;
          (
            document.getElementById("edit-mascota-especie") as HTMLInputElement
          ).value = el.dataset.especie!;
          (
            document.getElementById("edit-mascota-edad") as HTMLInputElement
          ).value = el.dataset.edad!;
          (
            document.getElementById(
              "edit-mascota-descripcion",
            ) as HTMLTextAreaElement
          ).value = el.dataset.descripcion!;
        });
      });
    }
  } catch (error) {
    contenedor.innerHTML = `<p class="text-danger">Error al cargar las mascotas.</p>`;
  }
}
