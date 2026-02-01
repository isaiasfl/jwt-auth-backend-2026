# ✅ CRUD de Tareas

## Introducción

El módulo de tareas es un ejemplo completo de CRUD (Create, Read, Update, Delete) con:

- Autenticación requerida en todas las rutas
- Ownership: cada usuario solo ve y modifica sus propias tareas
- Paginación y búsqueda
- Validación estricta con Zod

## Endpoints

Todos los endpoints requieren autenticación (header `Authorization: Bearer <token>`)

### 1. Listar tareas (GET /api/tasks)

Obtiene las tareas del usuario autenticado con paginación y búsqueda opcional.

**Query params:**

- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Tareas por página (default: 10)
- `search` (opcional): Busca en el título de las tareas

**Ejemplos:**

```
GET /api/tasks
GET /api/tasks?page=2&limit=5
GET /api/tasks?search=react
GET /api/tasks?page=1&limit=10&search=aprender
```

**Response (200):**

```json
{
  "ok": true,
  "data": {
    "tasks": [
      {
        "id": "uuid",
        "title": "Aprender React",
        "completed": false,
        "userId": "uuid",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      },
      {
        "id": "uuid",
        "title": "Conectar frontend con backend",
        "completed": false,
        "userId": "uuid",
        "createdAt": "2024-01-15T10:31:00.000Z",
        "updatedAt": "2024-01-15T10:31:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3,
      "totalPages": 1
    }
  }
}
```

### 2. Obtener tarea por ID (GET /api/tasks/:id)

Obtiene una tarea específica (solo si pertenece al usuario autenticado).

**Request:**

```
GET /api/tasks/550e8400-e29b-41d4-a716-446655440000
```

**Response (200):**

```json
{
  "ok": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Aprender React",
    "completed": false,
    "userId": "uuid",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Errores:**

- 404: Tarea no encontrada (o no pertenece al usuario)
- 400: ID inválido (no es UUID)

### 3. Crear tarea (POST /api/tasks)

Crea una nueva tarea para el usuario autenticado.

**Request:**

```json
{
  "title": "Estudiar TypeScript",
  "completed": false // opcional, default: false
}
```

**Response (201):**

```json
{
  "ok": true,
  "data": {
    "id": "uuid",
    "title": "Estudiar TypeScript",
    "completed": false,
    "userId": "uuid",
    "createdAt": "2024-01-15T10:35:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

**Errores:**

- 400: Validación fallida (título vacío)

### 4. Actualizar tarea (PUT /api/tasks/:id)

Actualiza una tarea existente (solo si pertenece al usuario).

**Request:**

```json
{
  "title": "Estudiar TypeScript avanzado", // opcional
  "completed": true // opcional
}
```

**Response (200):**

```json
{
  "ok": true,
  "data": {
    "id": "uuid",
    "title": "Estudiar TypeScript avanzado",
    "completed": true,
    "userId": "uuid",
    "createdAt": "2024-01-15T10:35:00.000Z",
    "updatedAt": "2024-01-15T10:40:00.000Z"
  }
}
```

**Errores:**

- 404: Tarea no encontrada (o no pertenece al usuario)
- 400: Validación fallida

### 5. Eliminar tarea (DELETE /api/tasks/:id)

Elimina una tarea (solo si pertenece al usuario).

**Request:**

```
DELETE /api/tasks/550e8400-e29b-41d4-a716-446655440000
```

**Response (200):**

```json
{
  "ok": true,
  "data": {
    "message": "Tarea eliminada exitosamente"
  }
}
```

**Errores:**

- 404: Tarea no encontrada (o no pertenece al usuario)

## Uso desde React

### Utilidad para hacer fetch con token

```jsx
// src/utils/api.js
const API_URL = "http://localhost:3500/api";

export async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!data.ok) {
    throw new Error(data.error.message);
  }

  return data.data;
}
```

### Listar tareas

```jsx
import { fetchWithAuth } from "./utils/api";

async function getTasks(page = 1, limit = 10, search = "") {
  const query = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
  });

  return await fetchWithAuth(`/tasks?${query}`);
}

// Uso:
const result = await getTasks(1, 10, "react");
console.log(result.tasks); // Array de tareas
console.log(result.pagination); // Datos de paginación
```

### Obtener tarea por ID

```jsx
async function getTask(id) {
  return await fetchWithAuth(`/tasks/${id}`);
}

// Uso:
const task = await getTask("550e8400-e29b-41d4-a716-446655440000");
```

### Crear tarea

```jsx
async function createTask(title, completed = false) {
  return await fetchWithAuth("/tasks", {
    method: "POST",
    body: JSON.stringify({ title, completed }),
  });
}

// Uso:
const newTask = await createTask("Aprender Prisma", false);
```

### Actualizar tarea

```jsx
async function updateTask(id, updates) {
  return await fetchWithAuth(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

// Uso:
await updateTask("uuid", { completed: true });
await updateTask("uuid", { title: "Nuevo título" });
await updateTask("uuid", { title: "Título", completed: false });
```

### Eliminar tarea

```jsx
async function deleteTask(id) {
  return await fetchWithAuth(`/tasks/${id}`, {
    method: "DELETE",
  });
}

// Uso:
await deleteTask("uuid");
```

## Componente React de ejemplo

```jsx
import { useState, useEffect } from "react";
import { fetchWithAuth } from "./utils/api";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    loadTasks();
  }, [page, search]);

  async function loadTasks() {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
      });
      const data = await fetchWithAuth(`/tasks?${query}`);
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleComplete(task) {
    try {
      await fetchWithAuth(`/tasks/${task.id}`, {
        method: "PUT",
        body: JSON.stringify({ completed: !task.completed }),
      });
      loadTasks(); // Recargar lista
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  async function handleDelete(taskId) {
    if (!confirm("¿Eliminar tarea?")) return;
    try {
      await fetchWithAuth(`/tasks/${taskId}`, {
        method: "DELETE",
      });
      loadTasks(); // Recargar lista
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h1>Mis Tareas</h1>

      <input
        type="text"
        placeholder="Buscar tareas..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggleComplete(task)}
            />
            <span
              style={{
                textDecoration: task.completed ? "line-through" : "none",
              }}
            >
              {task.title}
            </span>
            <button onClick={() => handleDelete(task.id)}>Eliminar</button>
          </li>
        ))}
      </ul>

      {pagination && (
        <div>
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Anterior
          </button>
          <span>
            Página {pagination.page} de {pagination.totalPages}
          </span>
          <button
            disabled={page === pagination.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskList;
```

## Ownership y seguridad

**Importante:** El backend garantiza que:

✅ Cada usuario **solo puede ver** sus propias tareas
✅ Cada usuario **solo puede modificar** sus propias tareas
✅ Cada usuario **solo puede eliminar** sus propias tareas

Si intentas acceder a una tarea de otro usuario, recibirás un 404 (como si no existiera).

## Siguiente paso

Ve a [04-how-to-create-a-new-resource.md](./04-how-to-create-a-new-resource.md) para aprender a crear nuevos recursos tipo CRUD.

---

## 👨‍💻 Autor

**Isaías Fernández Lozano**

- 📧 Email: [ifernandez@ieshlanz.es](mailto:ifernandez@ieshlanz.es)
- 🐙 GitHub: [@isaiasfl](https://github.com/isaiasfl)
- 📚 Módulo: **DWEC** (Desarrollo Web en Entorno Cliente)
- 🎓 Centro: IES Hermenegildo Lanz
- 📅 Fecha: Febrero 2026
