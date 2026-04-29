import { initNavbar } from "../components/navbar";
import axios from "axios";

const API_URL = "http://localhost:3001/api";

export function renderTodasMascotas(root: HTMLElement): void {
  const userString = sessionStorage.getItem("user");
  const usuario = userString ? JSON.parse(userString) : null;
  const esAdmin = usuario?.rol === "admin";

  root.innerHTML = `
    <div id="navbar-container"></div>
    <div class="d-flex" style="min-height: 100vh;">
      <div class="container flex-grow-1" id="main-content" style="padding-top: 70px; padding-bottom: 40px; transition: margin-right 0.3s ease;">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h4 class="fw-bold">Todas las Mascotas</h4>
        </div>
        <div id="todas-mascotas-container" class="row g-3">
          <p class="text-muted">Cargando mascotas...</p>
        </div>
      </div>

      <!-- Panel lateral comentarios -->
      <div id="panel-comentarios" style="
        position: fixed;
        top: 56px;
        right: 0;
        height: calc(100vh - 56px);
        width: 0;
        overflow: hidden;
        transition: width 0.3s ease;
        background: #f8f9fa;
        border-left: 1px solid #dee2e6;
        display: flex;
        flex-direction: column;
        z-index: 1000;
      ">
        <div class="p-3 d-flex justify-content-between align-items-center border-bottom">
          <h6 class="fw-bold mb-0">Comentarios</h6>
          <button class="btn btn-sm btn-outline-dark" id="btn-cerrar-panel">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div id="lista-comentarios" class="p-3 flex-grow-1 overflow-auto"></div>
        <div class="p-3 border-top">
          <input type="hidden" id="mascota-comentario-id" />
          <div class="input-group">
            <input type="text" id="input-comentario" class="form-control" placeholder="Escribe un comentario..." />
            <button class="btn btn-dark" id="btn-enviar-comentario">
              <i class="bi bi-send"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

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

  const token = sessionStorage.getItem("token");

  document.getElementById("btn-cerrar-panel")!.addEventListener("click", () => {
    document.getElementById("panel-comentarios")!.style.width = "0";
    document.getElementById("main-content")!.style.marginRight = "auto";
  });

  document
    .getElementById("btn-enviar-comentario")!
    .addEventListener("click", async () => {
      const id = (
        document.getElementById("mascota-comentario-id") as HTMLInputElement
      ).value;
      const input = document.getElementById(
        "input-comentario",
      ) as HTMLInputElement;
      const texto = input.value.trim();
      if (!texto) return;

      try {
        await axios.post(
          `${API_URL}/mascotas/${id}/comentarios`,
          { texto },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        input.value = "";
        cargarComentarios(id);

        // Actualizar contador de comentarios en la tarjeta
        const response = await axios.get(
          `${API_URL}/mascotas/${id}/comentarios`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const spanComentario = document.querySelector(
          `[data-comentario-id="${id}"] span`,
        );
        if (spanComentario)
          spanComentario.textContent = String(response.data.length);
      } catch (error: any) {
        alert("Error al enviar el comentario");
      }
    });

  if (esAdmin) {
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
          if (fotoInput.files && fotoInput.files[0])
            formData.append("foto", fotoInput.files[0]);

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

async function cargarComentarios(id: string): Promise<void> {
  const token = sessionStorage.getItem("token");
  const lista = document.getElementById("lista-comentarios")!;

  try {
    const response = await axios.get(`${API_URL}/mascotas/${id}/comentarios`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const comentarios = response.data;

    if (comentarios.length === 0) {
      lista.innerHTML = `<p class="text-muted small">No hay comentarios aún.</p>`;
      return;
    }

    lista.innerHTML = comentarios
      .map(
        (c: any) => `
      <div class="mb-3 border-bottom pb-2">
        <p class="mb-0 fw-bold small">${c.usuario?.nombre || "Usuario"}</p>
        <p class="mb-0 small">${c.texto}</p>
        <p class="text-muted mb-0" style="font-size: 0.75rem;">${new Date(c.fecha).toLocaleDateString()}</p>
      </div>
    `,
      )
      .join("");
  } catch (error) {
    lista.innerHTML = `<p class="text-danger small">Error al cargar comentarios.</p>`;
  }
}

async function cargarTodasMascotas(esAdmin: boolean): Promise<void> {
  const token = sessionStorage.getItem("token");
  const contenedor = document.getElementById("todas-mascotas-container")!;
  const userString = sessionStorage.getItem("user");
  const userId = userString ? JSON.parse(userString).id : null;

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
      .map((m: any) => {
        const yaLike = m.likesDados?.some(
          (id: any) => id.toString() === userId?.toString(),
        );
        return `
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
              ${
                esAdmin
                  ? `
              <button
                class="btn btn-dark btn-sm position-absolute top-0 end-0 m-3 btn-editar-mascota"
                data-bs-toggle="modal"
                data-bs-target="#modalEditMascota"
                data-id="${m._id}"
                data-nombre="${m.nombre}"
                data-especie="${m.especie}"
                data-edad="${m.edad}"
                data-descripcion="${m.descripcion || ""}"
              >
                <i class="bi bi-pencil"></i>
              </button>
              `
                  : ""
              }
            </div>
            <div class="card-body pt-0 text-center">
              <h6 class="fw-bold text-uppercase">${m.nombre}</h6>
              <p class="text-muted small mb-2">${m.especie} · ${m.edad} años</p>
              <p class="text-muted small mb-2">De: ${m.propietario.nombre}</p>
              <div class="d-flex justify-content-center gap-3">
                <span class="d-flex align-items-center gap-1" style="cursor: pointer;" data-like-id="${m._id}">
                  <i class="bi ${yaLike ? "bi-heart-fill text-danger" : "bi-heart"}" data-like-icon="${m._id}"></i>
                  <span id="likes-count-${m._id}">${m.contadorLikes}</span>
                </span>
                <span class="d-flex align-items-center gap-1" style="cursor: pointer;" data-comentario-id="${m._id}">
                  <i class="bi bi-chat"></i>
                  <span id="comentarios-count-${m._id}">${m.comentarios?.length || 0}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      `;
      })
      .join("");

    // Likes
    document.querySelectorAll("[data-like-id]").forEach((el) => {
      el.addEventListener("click", async (e) => {
        e.stopPropagation();
        const id = (el as HTMLElement).dataset.likeId!;

        try {
          const response = await axios.post(
            `${API_URL}/mascotas/${id}/like`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          const mascota = response.data;
          const icono = document.querySelector(`i[data-like-icon="${id}"]`)!;
          const contador = document.getElementById(`likes-count-${id}`)!;
          const yaLike = mascota.likesDados?.some(
            (uid: any) => uid.toString() === userId?.toString(),
          );

          icono.className = `bi ${yaLike ? "bi-heart-fill text-danger" : "bi-heart"}`;
          contador.textContent = mascota.contadorLikes;
        } catch (error: any) {
          alert("Error al dar like");
        }
      });
    });

    // Abrir panel de comentarios
    document.querySelectorAll("[data-comentario-id]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = (el as HTMLElement).dataset.comentarioId!;
        (
          document.getElementById("mascota-comentario-id") as HTMLInputElement
        ).value = id;
        document.getElementById("panel-comentarios")!.style.width = "350px";
        document.getElementById("main-content")!.style.marginRight = "350px";
        cargarComentarios(id);
      });
    });

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
