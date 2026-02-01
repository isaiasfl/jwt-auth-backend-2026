# 📝 CHECKPOINT - Creación Frontend Login React

**Fecha inicio:** 2026-02-01
**Estado:** ✅ COMPLETADO

---

## 🎯 Objetivo del Proyecto

Crear un frontend en React para probar el login con el backend ya creado.

---

## 📋 Requisitos Específicos

### Stack Tecnológico

- ✅ Vite
- ✅ TypeScript
- ⬜ Tailwind CSS 4 (`tailwindcss` + `@tailwindcss/vite`)
- ⬜ React Router DOM
- ⬜ Contextos Globales para Auth
- ⬜ React 19.2 (nuevos hooks: `use`, form actions, etc.)

### Configuración Tailwind CSS

1. Instalar: `tailwindcss` y `@tailwindcss/vite`
2. Modificar `vite.config.ts` añadiendo `tailwindcss()`
3. Eliminar `App.css`
4. Limpiar `index.css` dejando solo: `@import "tailwindcss"`

### Funcionalidades

1. **Contexto Global de Auth**
   - Hook personalizado para manejar autenticación
   - Estado global: user, token, loading
   - Funciones: login, logout, checkAuth

2. **Rutas Básicas** (sin florituras)
   - `/login` - Página de login
   - `/dashboard` - Página protegida (requiere autenticación)
   - Ruta por defecto redirige según estado de auth

3. **Formulario de Login**
   - Usar nuevos hooks de formularios de React 19.2
   - Conectar con backend: `POST http://localhost:3500/api/auth/login`
   - Campos: email, password
   - Manejo de errores

4. **Código Documentado**
   - Comentarios explicativos en todo el código
   - Explicar qué hace cada hook, componente, función

---

## ✅ Pasos Completados

1. ✅ Crear proyecto con Vite + React + TypeScript
2. ✅ Instalar dependencias base (npm install)
3. ✅ Instalar react-router-dom
4. ✅ Instalar tailwindcss y @tailwindcss/vite
5. ✅ Configurar Tailwind CSS en vite.config.ts
6. ✅ Limpiar index.css (solo @import "tailwindcss")
7. ✅ Eliminar App.css
8. ✅ Crear estructura de carpetas
9. ✅ Crear types/auth.types.ts
10. ✅ Crear utils/api.ts
11. ✅ Crear contexts/AuthContext.tsx
12. ✅ Crear hooks/useAuth.ts
13. ✅ Crear components/ProtectedRoute.tsx
14. ✅ Crear pages/LoginPage.tsx (con useActionState de React 19)
15. ✅ Crear pages/DashboardPage.tsx
16. ✅ Configurar App.tsx con rutas

---

## 📝 Pasos Pendientes

### Paso 1: Instalación de dependencias base

```bash
cd frontend-login-react
npm install
```

### Paso 2: Instalar dependencias adicionales

```bash
npm install react-router-dom
npm install -D tailwindcss @tailwindcss/vite
```

### Paso 3: Configurar Tailwind CSS

- [ ] Modificar `vite.config.ts` para añadir `tailwindcss()`
- [ ] Eliminar `src/App.css`
- [ ] Limpiar `src/index.css` y añadir solo `@import "tailwindcss"`

### Paso 4: Crear estructura de carpetas

```
src/
  contexts/
    AuthContext.tsx          # Contexto global de autenticación
  hooks/
    useAuth.ts              # Hook personalizado para auth
  pages/
    LoginPage.tsx           # Página de login
    DashboardPage.tsx       # Página protegida
  components/
    ProtectedRoute.tsx      # Componente para rutas protegidas
  utils/
    api.ts                  # Utilidades para llamadas API
  types/
    auth.types.ts           # Tipos TypeScript para auth
```

### Paso 5: Implementar ficheros

#### 5.1 Types (`src/types/auth.types.ts`)

- [ ] Definir tipos: User, LoginCredentials, AuthResponse, AuthContextType

#### 5.2 API Utils (`src/utils/api.ts`)

- [ ] Función `login(email, password)`
- [ ] Función `getMe()` para verificar token
- [ ] Constante `API_URL = http://localhost:3500/api`

#### 5.3 Auth Context (`src/contexts/AuthContext.tsx`)

- [ ] Crear contexto con estado: user, token, loading, error
- [ ] Implementar funciones: login, logout, checkAuth
- [ ] Usar localStorage para persistir token
- [ ] Usar React 19.2 hooks donde sea posible

#### 5.4 useAuth Hook (`src/hooks/useAuth.ts`)

- [ ] Hook personalizado que use el AuthContext
- [ ] Lanzar error si se usa fuera del provider

#### 5.5 Protected Route (`src/components/ProtectedRoute.tsx`)

- [ ] Componente que verifique autenticación
- [ ] Redirigir a /login si no está autenticado
- [ ] Mostrar loading mientras verifica

#### 5.6 Login Page (`src/pages/LoginPage.tsx`)

- [ ] Usar nuevos hooks de formularios de React 19.2 (useActionState, useFormStatus)
- [ ] Formulario con email y password
- [ ] Conectar con contexto de auth
- [ ] Mostrar errores
- [ ] Redirigir a dashboard después del login exitoso

#### 5.7 Dashboard Page (`src/pages/DashboardPage.tsx`)

- [ ] Mostrar información del usuario
- [ ] Botón de logout
- [ ] Mensaje de bienvenida

#### 5.8 App Router (`src/App.tsx`)

- [ ] Configurar React Router
- [ ] Rutas: /, /login, /dashboard
- [ ] Envolver con AuthProvider
- [ ] Ruta raíz redirige según estado de auth

#### 5.9 Main (`src/main.tsx`)

- [ ] Verificar que esté limpio y correcto

---

## 🔗 Conexión con Backend

### Endpoints a usar

- **Login**: `POST http://localhost:3500/api/auth/login`

  ```json
  Body: { "email": "user@dwec.com", "password": "user123" }
  Response: { "ok": true, "data": { "user": {...}, "token": "..." } }
  ```

- **Get Me**: `GET http://localhost:3500/api/auth/me`
  ```
  Headers: { "Authorization": "Bearer <token>" }
  Response: { "ok": true, "data": { "id": "...", "email": "...", ... } }
  ```

### Credenciales de prueba

- Usuario normal: `user@dwec.com` / `user123`
- Admin: `admin@dwec.com` / `admin123`

---

## 📚 Nuevas Funcionalidades React 19.2 a Usar

1. **`use` hook** - Para consumir promesas/contextos
2. **Form Actions** - useActionState para manejar formularios
3. **useFormStatus** - Para estado de envío de formularios
4. **useOptimistic** - Para actualizaciones optimistas (si aplica)

---

## 🎨 Estilo Visual (Tailwind CSS 4)

- Diseño simple y limpio
- Sin florituras ni componentes complejos
- Centrado en funcionalidad
- Paleta: colores por defecto de Tailwind
- Formularios básicos con bordes y padding

---

## 📝 Notas Importantes

1. **Todo el código debe estar documentado** con comentarios explicativos
2. **Usar TypeScript estricto** - tipar todo correctamente
3. **Manejo de errores** - mostrar mensajes claros al usuario
4. **Loading states** - mostrar feedback visual durante operaciones
5. **Responsive** - básico, que funcione en mobile y desktop

---

## 🔄 Cómo Retomar

Si este proceso se interrumpe:

1. Leer este archivo para ver el estado actual
2. Revisar qué pasos están completados (✅)
3. Continuar desde el siguiente paso pendiente (⬜)
4. Actualizar este archivo marcando pasos completados

---

## 📂 Archivos Creados Hasta Ahora

1. ✅ `CHECKPOINT_CREACION.md` (este archivo)
2. ✅ Estructura base de Vite generada

---

## 🚀 Comandos Rápidos

```bash
# Instalar dependencias
npm install

# Instalar adicionales
npm install react-router-dom
npm install -D tailwindcss @tailwindcss/vite

# Desarrollo
npm run dev

# Build
npm run build
```

---

## 👨‍💻 Autor

**Isaías Fernández Lozano**

- 📧 Email: [ifernandez@ieshlanz.es](mailto:ifernandez@ieshlanz.es)
- 🐙 GitHub: [@isaiasfl](https://github.com/isaiasfl)
- 📚 Módulo: **DWEC** (Desarrollo Web en Entorno Cliente)
- 🎓 Centro: IES Hermenegildo Lanz

---

**Estado:** ✅ COMPLETADO
**Fecha creación:** 1 de febrero de 2026
**Fecha finalización:** 1 de febrero de 2026
