# 🔐 Sistema de Autenticación JWT - Explicación Completa

<div align="center">

![JWT](https://img.shields.io/badge/JWT-9.0-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Security](https://img.shields.io/badge/Security-Auth-red?style=for-the-badge&logo=security&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcrypt-5.1-CA0000?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)

</div>

Este documento explica en detalle cómo funciona el sistema de autenticación JWT implementado en este proyecto.

---

## 📚 Índice

1. [¿Qué es JWT?](#qué-es-jwt)
2. [¿Cómo funciona JWT?](#cómo-funciona-jwt)
3. [Arquitectura de la implementación](#arquitectura-de-la-implementación)
4. [Almacenamiento: ¿Dónde se guarda el token?](#almacenamiento-dónde-se-guarda-el-token)
5. [Flujo completo de autenticación](#flujo-completo-de-autenticación)
6. [Protección de rutas](#protección-de-rutas)
7. [Control de acceso basado en roles (RBAC)](#control-de-acceso-basado-en-roles-rbac)
8. [Seguridad](#seguridad)
9. [Ventajas y desventajas](#ventajas-y-desventajas)

---

## ¿Qué es JWT?

**JWT (JSON Web Token)** es un estándar abierto ([RFC 7519](https://tools.ietf.org/html/rfc7519)) que define una forma compacta y autónoma de transmitir información de forma segura entre dos partes como un objeto JSON.

### Estructura de un JWT

Un JWT se compone de **3 partes** separadas por puntos (`.`):

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsImVtYWlsIjoidXNlckBkd2VjLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNjk5OTk5OTk5LCJleHAiOjE3MDAwMDM1OTl9.abc123xyz456
```

**1. Header (Cabecera):**

```json
{
  "alg": "HS256", // Algoritmo de encriptación
  "typ": "JWT" // Tipo de token
}
```

**2. Payload (Carga útil):**

```json
{
  "id": "123",
  "email": "user@dwec.com",
  "role": "USER",
  "iat": 1699999999, // Issued at (fecha de emisión)
  "exp": 1700003599 // Expiration (fecha de expiración)
}
```

**3. Signature (Firma):**

```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

La **firma** garantiza que el token no ha sido modificado.

---

## ¿Cómo funciona JWT?

### Concepto Clave: Stateless Authentication

A diferencia de las sesiones tradicionales (que se guardan en el servidor), JWT permite **autenticación sin estado**:

- **Servidor NO guarda sesiones** en memoria/base de datos
- **El token contiene toda la información** necesaria
- **El servidor solo verifica la firma** del token

### Flujo Básico

```
1. Usuario → Backend: Login (email + password)
2. Backend verifica credenciales
3. Backend genera JWT firmado
4. Backend → Usuario: Devuelve JWT
5. Usuario guarda el JWT
6. Usuario → Backend: Petición + JWT en header
7. Backend verifica JWT (firma + expiración)
8. Backend responde con datos solicitados
```

---

## Arquitectura de la Implementación

### Backend (Node.js + Express)

**Ubicación:** `/api/auth` endpoints

**Generación del Token:**

```typescript
// En el backend (auth.service.ts)
import jwt from "jsonwebtoken";

function generateToken(
  id: string,
  email: string,
  role: "USER" | "ADMIN",
): string {
  return jwt.sign(
    { id, email, role }, // Payload
    env.JWT_SECRET, // Clave secreta
    { expiresIn: env.JWT_EXPIRES_IN }, // Expiración (1h)
  );
}
```

**Verificación del Token:**

```typescript
// En el backend (authMiddleware.ts)
const token = authHeader.split(" ")[1]; // Extraer token del header
const decoded = jwt.verify(token, env.JWT_SECRET); // Verificar firma
req.user = decoded; // Adjuntar usuario a la petición
```

### Frontend (React)

**Ubicación:** `src/contexts/AuthContext.tsx`

**Obtención del Token:**

```typescript
// Hacer login
const response = await api.login(email, password);

// Respuesta del backend
{
  ok: true,
  data: {
    user: { id, email, name, role },
    token: "eyJhbGci..." // <-- JWT aquí
  }
}
```

**Uso del Token:**

```typescript
// En cada petición protegida
fetch("http://localhost:3500/api/tasks", {
  headers: {
    Authorization: `Bearer ${token}`, // <-- Enviar token
  },
});
```

---

## Almacenamiento: ¿Dónde se guarda el token?

### 🎯 Opción Implementada: **localStorage**

```typescript
// Al hacer login (AuthContext.tsx)
localStorage.setItem("auth_token", response.data.token);

// Al hacer logout
localStorage.removeItem("auth_token");

// Al verificar autenticación al cargar la app
const savedToken = localStorage.getItem("auth_token");
```

### ¿Por qué localStorage?

| Característica                      | localStorage | sessionStorage | memoria (estado) | httpOnly cookie      |
| ----------------------------------- | ------------ | -------------- | ---------------- | -------------------- |
| **Persiste al cerrar pestaña**      | ✅ Sí        | ❌ No          | ❌ No            | ✅ Sí                |
| **Persiste al reiniciar navegador** | ✅ Sí        | ❌ No          | ❌ No            | ✅ Sí (si no expira) |
| **Accesible desde JavaScript**      | ✅ Sí        | ✅ Sí          | ✅ Sí            | ❌ No                |
| **Vulnerable a XSS**                | ⚠️ Sí        | ⚠️ Sí          | ⚠️ Sí            | ✅ No                |
| **Vulnerable a CSRF**               | ✅ No        | ✅ No          | ✅ No            | ⚠️ Sí                |
| **Fácil de implementar**            | ✅ Muy       | ✅ Muy         | ✅ Muy           | ⚠️ Medio             |

### Alternativas consideradas

#### 1. **Memoria (solo estado de React)**

```typescript
// Solo guardar en estado
const [token, setToken] = useState<string | null>(null);
```

**Pros:** Más seguro contra XSS
**Contras:** Se pierde al recargar la página (mala UX)

#### 2. **sessionStorage**

```typescript
sessionStorage.setItem("auth_token", token);
```

**Pros:** Se limpia al cerrar pestaña (más seguro)
**Contras:** Mala UX, usuario debe volver a loguearse al cerrar pestaña

#### 3. **httpOnly Cookie**

```typescript
// En el backend
res.cookie("token", token, {
  httpOnly: true, // JavaScript no puede acceder
  secure: true, // Solo HTTPS
  sameSite: "strict", // Protección CSRF
});
```

**Pros:** Más seguro contra XSS
**Contras:** Vulnerable a CSRF, requiere configuración adicional (CORS, sameSite)

### ✅ Decisión: localStorage

Para este **proyecto educativo**, elegimos `localStorage` porque:

1. **Simplicidad:** Fácil de entender e implementar
2. **UX:** Persistencia de sesión (mejor experiencia)
3. **Transparencia:** Visible en DevTools (bueno para aprendizaje)
4. **Sin configuración compleja:** No requiere cookies, CORS especial, etc.

⚠️ **En producción:** Considera `httpOnly cookies` para mayor seguridad.

---

## Flujo Completo de Autenticación

### 1️⃣ Registro / Login

```
[Usuario en LoginPage.tsx]
    |
    | Envía: { email, password }
    v
[POST /api/auth/login]
    |
    | Backend verifica credenciales
    v
[Backend genera JWT]
    |
    | Responde: { user, token }
    v
[AuthContext recibe token]
    |
    | Guarda en localStorage
    | Actualiza estado global
    v
[Usuario autenticado]
    |
    | Redirige a /dashboard
    v
[Dashboard renderizado]
```

**Código:**

```typescript
// LoginPage.tsx - useActionState
async function loginAction(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  await login(email, password); // <-- Llama al contexto
}

// AuthContext.tsx
async function login(email, password) {
  const response = await api.login(email, password);

  localStorage.setItem("auth_token", response.data.token); // <-- Guardar
  setToken(response.data.token);
  setUser(response.data.user);
}
```

### 2️⃣ Verificación al Cargar la App

```
[App se carga]
    |
    | useEffect en AuthContext
    v
[Busca token en localStorage]
    |
    +-- NO hay token --> [Usuario NO autenticado]
    |
    +-- SÍ hay token
        |
        | GET /api/auth/me (con token)
        v
    [Backend verifica token]
        |
        +-- Token válido --> [Usuario autenticado]
        |
        +-- Token inválido/expirado
            |
            | Elimina token de localStorage
            v
        [Usuario NO autenticado]
```

**Código:**

```typescript
// AuthContext.tsx - checkAuth
useEffect(() => {
  checkAuth();
}, []);

async function checkAuth() {
  const savedToken = localStorage.getItem("auth_token");

  if (!savedToken) {
    setLoading(false);
    return;
  }

  try {
    const response = await api.getMe(savedToken); // <-- Verificar
    setToken(savedToken);
    setUser(response.data);
  } catch (err) {
    localStorage.removeItem("auth_token"); // <-- Limpiar si inválido
  } finally {
    setLoading(false);
  }
}
```

### 3️⃣ Peticiones Protegidas

```
[Usuario en Dashboard]
    |
    | Obtener token de localStorage
    v
[Hacer petición a /api/tasks]
    |
    | Header: Authorization: Bearer <token>
    v
[Backend recibe petición]
    |
    | Middleware authMiddleware
    v
[Verificar token JWT]
    |
    +-- Token válido
    |   |
    |   | req.user = { id, email, role }
    |   v
    | [Continuar a controlador]
    |   |
    |   v
    | [Responder con datos]
    |
    +-- Token inválido/expirado
        |
        v
    [Error 401 Unauthorized]
```

**Código:**

```typescript
// Frontend - api.ts
export async function getMe(token: string) {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`, // <-- Enviar token
    },
  });

  return response.json();
}

// Backend - authMiddleware.ts
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(token, env.JWT_SECRET); // <-- Verificar
  req.user = decoded; // <-- Adjuntar a request
  next();
};
```

---

## Protección de Rutas

### Nivel 1: Autenticación (¿Está logueado?)

**Componente:** `ProtectedRoute.tsx`

```typescript
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;

  if (!user) {
    return <Navigate to="/login" replace />; // <-- Redirigir si no autenticado
  }

  return <>{children}</>;
}
```

**Uso en App.tsx:**

```tsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      {" "}
      {/* <-- Verificar autenticación */}
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

### Nivel 2: Autorización (¿Tiene el rol correcto?)

**Componente:** `RequireRole.tsx`

```typescript
export function RequireRole({ children, role }) {
  const { user } = useAuth();

  if (user.role !== role) {
    return <div>Acceso Denegado</div>; // <-- Mostrar error si no tiene el rol
  }

  return <>{children}</>;
}
```

**Uso en App.tsx:**

```tsx
<Route
  path="/admin"
  element={
    <ProtectedRoute>
      {" "}
      {/* <-- Nivel 1: ¿Autenticado? */}
      <RequireRole role="ADMIN">
        {" "}
        {/* <-- Nivel 2: ¿Es ADMIN? */}
        <AdminPage />
      </RequireRole>
    </ProtectedRoute>
  }
/>
```

---

## Control de Acceso Basado en Roles (RBAC)

### Roles Definidos

```typescript
type Role = "USER" | "ADMIN";
```

- **USER:** Usuario normal (por defecto al registrarse)
- **ADMIN:** Administrador con permisos especiales

### Matriz de Permisos

| Ruta         | USER | ADMIN |
| ------------ | ---- | ----- |
| `/login`     | ✅   | ✅    |
| `/dashboard` | ✅   | ✅    |
| `/admin`     | ❌   | ✅    |

### Implementación en el Backend

```typescript
// authMiddleware.ts
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("No tienes permisos", 403, "FORBIDDEN"));
    }
    next();
  };
};

// admin.routes.ts
router.use(requireAuth); // <-- Verificar autenticación
router.use(requireRole("ADMIN")); // <-- Verificar rol ADMIN
```

### Implementación en el Frontend

**Componente visual:**

```tsx
// DashboardPage.tsx
{
  user.role === "ADMIN" && (
    <button onClick={() => navigate("/admin")}>👑 Panel Admin</button>
  );
}
```

**Protección de ruta:**

```tsx
// App.tsx
<RequireRole role="ADMIN">
  <AdminPage />
</RequireRole>
```

---

## Seguridad

### ✅ Medidas Implementadas

1. **Firma del Token**
   - El JWT está firmado con `JWT_SECRET`
   - No puede ser modificado sin invalidar la firma

2. **Expiración del Token**
   - Tokens expiran después de 1 hora (configurable)
   - Reduce ventana de vulnerabilidad si el token es robado

3. **Verificación en cada petición**
   - El backend verifica la firma en cada petición
   - No confía en datos del cliente

4. **Hash de contraseñas**
   - Contraseñas hasheadas con bcrypt (10 rounds)
   - Nunca se guardan en texto plano

5. **HTTPS en producción**
   - Tokens solo deben enviarse por HTTPS
   - Evita intercepción en tránsito

### ⚠️ Vulnerabilidades y Mitigaciones

#### 1. XSS (Cross-Site Scripting)

**Riesgo:** Si hay XSS, un atacante puede robar el token de localStorage.

**Mitigación:**

- Validar y sanitizar inputs
- Usar Content Security Policy (CSP)
- En producción: Considerar httpOnly cookies

#### 2. Token Theft (Robo del Token)

**Riesgo:** Si el token es robado, el atacante puede usarlo hasta que expire.

**Mitigación:**

- Expiración corta (1 hora)
- Refresh tokens (no implementado en este proyecto básico)
- Revocar tokens en eventos sospechosos

#### 3. CSRF (Cross-Site Request Forgery)

**Riesgo:** Con cookies, un sitio malicioso puede hacer peticiones en nombre del usuario.

**Mitigación:**

- localStorage NO es vulnerable a CSRF (no se envía automáticamente)
- Si usas cookies: implementar tokens CSRF

---

## Ventajas y Desventajas

### ✅ Ventajas de JWT

1. **Stateless (Sin estado)**
   - El servidor no guarda sesiones
   - Escalabilidad horizontal más fácil

2. **Self-contained (Autónomo)**
   - El token contiene toda la información
   - No necesita consultas adicionales a BD

3. **Portabilidad**
   - Funciona en web, mobile, APIs
   - Independiente del servidor

4. **Descentralizado**
   - Varios servidores pueden verificar el token
   - Útil en microservicios

### ❌ Desventajas de JWT

1. **No se puede invalidar fácilmente**
   - Una vez emitido, es válido hasta que expire
   - Solución: Lista negra o refresh tokens

2. **Tamaño**
   - Más grande que un simple session ID
   - Se envía en cada petición

3. **Seguridad**
   - Si el secret se filtra, todos los tokens son vulnerables
   - Si se guarda en localStorage, vulnerable a XSS

---

## Resumen de la Implementación

### Frontend

- **Almacenamiento:** localStorage (`auth_token`)
- **Contexto Global:** AuthContext con useAuth hook
- **Protección:** ProtectedRoute + RequireRole components
- **Nuevos hooks:** useActionState (React 19) para formularios

### Backend

- **Generación:** jsonwebtoken con HS256
- **Verificación:** Middleware requireAuth
- **Autorización:** Middleware requireRole
- **Expiración:** 1 hora (configurable)

### Flujo

1. Login → Backend genera JWT
2. Frontend guarda JWT en localStorage
3. Frontend envía JWT en header `Authorization: Bearer <token>`
4. Backend verifica JWT en cada petición
5. Logout → Frontend elimina JWT de localStorage

---

## 👨‍💻 Autor

**Isaías Fernández Lozano**

- 📧 Email: [ifernandez@ieshlanz.es](mailto:ifernandez@ieshlanz.es)
- 🐙 GitHub: [@isaiasfl](https://github.com/isaiasfl)
- 📚 Módulo: **DWEC** (Desarrollo Web en Entorno Cliente)
- 🎓 Centro: IES Hermenegildo Lanz
- 📅 Fecha: Febrero 2026

---

**Este sistema es ideal para proyectos educativos y aplicaciones pequeñas/medianas. Para producción enterprise, considera añadir refresh tokens, rotación de secrets, y httpOnly cookies.**
