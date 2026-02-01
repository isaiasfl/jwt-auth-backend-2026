# 🔐 Autenticación JWT

<div align="center">

![JWT](https://img.shields.io/badge/JWT-9.0-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcrypt-5.1-CA0000?style=for-the-badge)
![Security](https://img.shields.io/badge/Security-Auth-red?style=for-the-badge&logo=security&logoColor=white)
![Express](https://img.shields.io/badge/Express-Middleware-000000?style=for-the-badge&logo=express&logoColor=white)

</div>

## ¿Qué es JWT?

JWT (JSON Web Token) es un estándar para transmitir información de forma segura entre dos partes. En este proyecto lo usamos para autenticación:

1. El usuario se registra/logea
2. El servidor genera un token JWT
3. El cliente guarda el token (localStorage/sessionStorage)
4. En cada petición protegida, el cliente envía el token
5. El servidor verifica el token y permite/deniega el acceso

## Endpoints de autenticación

### 1. Registro (POST /api/auth/register)

Crea un nuevo usuario en el sistema.

**Request:**

```json
{
  "email": "alumno@dwec.com",
  "password": "password123",
  "name": "Nombre Alumno" // opcional
}
```

**Response (201):**

```json
{
  "ok": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "alumno@dwec.com",
      "name": "Nombre Alumno",
      "role": "USER",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errores comunes:**

- 400: Email ya registrado
- 400: Validación fallida (email inválido, contraseña corta)

### 2. Login (POST /api/auth/login)

Autentica un usuario existente.

**Request:**

```json
{
  "email": "user@dwec.com",
  "password": "user123"
}
```

**Response (200):**

```json
{
  "ok": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@dwec.com",
      "name": "Usuario Normal",
      "role": "USER",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errores comunes:**

- 401: Credenciales inválidas

### 3. Obtener usuario actual (GET /api/auth/me)

Obtiene la información del usuario autenticado.

**Request:**

```
Headers:
  Authorization: Bearer <tu_token_jwt>
```

**Response (200):**

```json
{
  "ok": true,
  "data": {
    "id": "uuid",
    "email": "user@dwec.com",
    "name": "Usuario Normal",
    "role": "USER",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Errores comunes:**

- 401: Token no proporcionado
- 401: Token inválido
- 401: Token expirado

## Cómo usar JWT desde React

### 1. Registro de usuario

```jsx
async function register(email, password, name) {
  const response = await fetch("http://localhost:3500/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, name }),
  });

  const data = await response.json();

  if (data.ok) {
    // Guardar token en localStorage
    localStorage.setItem("token", data.data.token);
    // Guardar usuario si lo necesitas
    localStorage.setItem("user", JSON.stringify(data.data.user));
    return data.data;
  } else {
    throw new Error(data.error.message);
  }
}
```

### 2. Login

```jsx
async function login(email, password) {
  const response = await fetch("http://localhost:3500/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (data.ok) {
    localStorage.setItem("token", data.data.token);
    localStorage.setItem("user", JSON.stringify(data.data.user));
    return data.data;
  } else {
    throw new Error(data.error.message);
  }
}
```

### 3. Peticiones protegidas

```jsx
async function getMe() {
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:3500/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (data.ok) {
    return data.data;
  } else {
    // Token inválido o expirado, hacer logout
    if (
      data.error.code === "INVALID_TOKEN" ||
      data.error.code === "TOKEN_EXPIRED"
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirigir a login
    }
    throw new Error(data.error.message);
  }
}
```

### 4. Logout

```jsx
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  // Redirigir a login
}
```

## Contexto de autenticación en React (ejemplo)

```jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token guardado al cargar
    const token = localStorage.getItem("token");
    if (token) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchMe() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3500/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.ok) {
        setUser(data.data);
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const response = await fetch("http://localhost:3500/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (data.ok) {
      localStorage.setItem("token", data.data.token);
      setUser(data.data.user);
    } else {
      throw new Error(data.error.message);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

## Sistema de roles

El backend soporta dos roles:

- **USER**: Usuario normal (por defecto al registrarse)
- **ADMIN**: Administrador (acceso a rutas administrativas)

### Rutas solo para ADMIN

Las rutas en `/api/admin/*` requieren rol ADMIN:

```jsx
async function getAdminStats() {
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:3500/api/admin/stats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (data.ok) {
    return data.data;
  } else {
    // Si el usuario es USER recibirá un 403 FORBIDDEN
    if (data.error.code === "FORBIDDEN") {
      alert("No tienes permisos para esta acción");
    }
    throw new Error(data.error.message);
  }
}
```

## Seguridad

### Buenas prácticas

✅ **Usar HTTPS en producción**: JWT se envía en headers, usa HTTPS para evitar interceptación

✅ **No guardar datos sensibles en el token**: El token es decodificable, solo guarda ID, email, role

✅ **Expiración del token**: Por defecto 1h, configurable en `.env`

✅ **Manejar tokens expirados**: Hacer logout cuando el token expira

✅ **No enviar el token en URLs**: Siempre en headers `Authorization`

❌ **NO guardar tokens en cookies sin httpOnly**: Vulnerable a XSS

❌ **NO compartir el mismo token entre múltiples usuarios**

### Contenido del token JWT

El token contiene esta información (firmada pero no encriptada):

```json
{
  "id": "uuid-del-usuario",
  "email": "user@dwec.com",
  "role": "USER",
  "iat": 1234567890,
  "exp": 1234571490
}
```

Puedes decodificar un JWT en https://jwt.io (solo para debugging, no en producción)

## Siguiente paso

Ve a [03-crud-tasks.md](./03-crud-tasks.md) para aprender sobre el CRUD de tareas.

---

## 👨‍💻 Autor

**Isaías Fernández Lozano**

- 📧 Email: [ifernandez@ieshlanz.es](mailto:ifernandez@ieshlanz.es)
- 🐙 GitHub: [@isaiasfl](https://github.com/isaiasfl)
- 📚 Módulo: **DWEC** (Desarrollo Web en Entorno Cliente)
- 🎓 Centro: IES Hermenegildo Lanz
- 📅 Fecha: Febrero 2026
