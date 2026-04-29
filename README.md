# 🐾 Red Social de Mascotas

## Instalación

### 1. Clonar el repositorio

```bash
https://github.com/tu-usuario/Red-Social-Mascotas.git
```

### 2. Configurar el Back-end

```bash
cd backend
npm install
cp .env.example .env
```

Edita el archivo `.env` y configura las variables:

```env
PORT=3001
NODE_ENV=development
JWT_SECRET=tu-secreto-jwt
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/red-social-mascotas?retryWrites=true&w=majority
CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_KEY=tu-api-key
CLOUDINARY_SECRET=tu-api-secret
```

### 3. Arrancar el Back-end

```bash
cd backend
npm run start:dev
```

### 4. Configurar el Front-end

```bash
cd frontend
npm install
```

### 5. Arrancar el Front-end

```bash
cd frontend
npm run dev
```

El cliente estará disponible en `http://localhost:5173`

---

## Credenciales de acceso

| Rol           | Email                | Contraseña  |
| ------------- | -------------------- | ----------- |
| Administrador | admin@admin.com      | admin1234   |
| Usuario       | usuario@mascotas.com | usuario1234 |

---

## Funcionalidades por rol

### Administrador

- Todas las funcionalidades del usuario normal
- Editar cualquier mascota de la plataforma
- Eliminar cualquier mascota de la plataforma

### Usuario normal

- Registrarse y autenticarse
- Registrar sus propias mascotas con nombre, especie, edad, descripción y foto
- Editar y eliminar sus propias mascotas
- Ver todas las mascotas de la plataforma
- Dar like y quitar like a cualquier mascota
- Comentar en cualquier mascota
- Consultar el ranking global de mascotas

---

## API REST

El servidor expone los siguientes endpoints bajo el prefijo `/api`:

```
POST   /api/auth/register                        # Registro de usuario (público)
POST   /api/auth/login                           # Login (público)

POST   /api/mascotas                             # Crear mascota (autenticado)
GET    /api/mascotas                             # Listar todas las mascotas (autenticado)
GET    /api/mascotas/mis-mascotas                # Listar mis mascotas (autenticado)
GET    /api/mascotas/ranking                     # Ranking global por likes (autenticado)
GET    /api/mascotas/ranking?especie=perro       # Ranking filtrado por especie (autenticado)
GET    /api/mascotas/especies                    # Listar especies disponibles (autenticado)
GET    /api/mascotas/:id                         # Ver detalle de mascota (autenticado)
PATCH  /api/mascotas/:id                         # Editar mascota (propietario o admin)
DELETE /api/mascotas/:id                         # Eliminar mascota (propietario o admin)
POST   /api/mascotas/:id/like                    # Dar/quitar like (autenticado)
POST   /api/mascotas/:id/comentarios             # Añadir comentario (autenticado)
GET    /api/mascotas/:id/comentarios             # Ver comentarios (autenticado)
```

---
