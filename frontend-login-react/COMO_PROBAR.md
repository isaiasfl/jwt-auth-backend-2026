# 🧪 Cómo Probar el Frontend

Guía paso a paso para probar que todo funciona correctamente.

## ✅ Pre-requisitos

1. **Backend corriendo** en http://localhost:3500

```bash
# Desde la carpeta raíz del proyecto
cd ..
docker compose ps

# Deberías ver:
# dwec-backend    Up
# dwec-postgres   Up
# dwec-pgadmin    Up
```

Si no está corriendo:

```bash
docker compose up -d
```

## 🚀 Paso 1: Iniciar el Frontend

```bash
# Asegúrate de estar en la carpeta del frontend
cd frontend-login-react

# Ejecutar en modo desarrollo
npm run dev
```

Deberías ver algo como:

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## 🧪 Paso 2: Abrir en el Navegador

Abre tu navegador en: **http://localhost:5173**

Deberías ver:

- Una pantalla de login con fondo gris
- Un formulario con campos de Email y Password
- Un panel con credenciales de prueba

## 🔐 Paso 3: Probar el Login

### Probar con Usuario Normal

1. Ingresa en el formulario:
   - Email: `user@dwec.com`
   - Password: `user123`

2. Click en "Iniciar Sesión"

3. **Resultado esperado:**
   - El botón cambia a "Iniciando sesión..."
   - Te redirige automáticamente a `/dashboard`
   - Ves un panel con tu información:
     - Nombre: "Usuario Normal"
     - Email: user@dwec.com
     - Rol: USER (etiqueta azul)

### Probar con Admin

1. Click en "Cerrar Sesión"

2. Ingresa:
   - Email: `admin@dwec.com`
   - Password: `admin123`

3. **Resultado esperado:**
   - Te redirige a `/dashboard`
   - Ves información del admin:
     - Nombre: "Administrador"
     - Email: admin@dwec.com
     - Rol: ADMIN (etiqueta morada)

## 🛡️ Paso 4: Probar Rutas Protegidas

### Intentar acceder al dashboard sin login

1. Click en "Cerrar Sesión"
2. En la barra de direcciones, intenta ir a: `http://localhost:5173/dashboard`

**Resultado esperado:**

- Te redirige automáticamente a `/login`
- Aparece el mensaje "No autenticado"

### Persistencia del Login

1. Haz login con `user@dwec.com` / `user123`
2. Estando en el dashboard, **recarga la página** (F5)

**Resultado esperado:**

- La sesión se mantiene
- Sigues viendo el dashboard
- NO te redirige al login

Esto funciona porque el token se guarda en `localStorage`.

## 🔄 Paso 5: Probar el Flujo Completo

1. **Inicia sesión** → Te lleva a `/dashboard`
2. **Recarga la página** → Sigues autenticado
3. **Cierra sesión** → Te lleva a `/login`
4. **Intenta ir a `/dashboard`** → Te redirige a `/login`
5. **Vuelve a iniciar sesión** → Todo funciona

## 🐛 Verificar que NO hay Errores

Abre las **DevTools del navegador** (F12):

### Console Tab

**NO deberías ver:**

- ❌ Errores de CORS
- ❌ Errores 401 (Unauthorized)
- ❌ Errores 404 (Not Found)
- ❌ Errores de TypeScript

**SÍ es normal ver:**

- ✅ Logs de Prisma (si el backend está en modo development)
- ✅ Mensajes informativos de Vite

### Network Tab

Al hacer login, deberías ver:

- ✅ POST a `http://localhost:3500/api/auth/login` → Status 200
- ✅ Response con `ok: true` y un `token`

Al cargar el dashboard (estando autenticado):

- ✅ GET a `http://localhost:3500/api/auth/me` → Status 200
- ✅ Response con `ok: true` y datos del usuario

## ✅ Checklist de Funcionalidades

Verifica que todo esto funcione:

- [ ] El formulario de login se muestra correctamente
- [ ] Se puede ingresar email y password
- [ ] Al enviar el form, muestra "Iniciando sesión..."
- [ ] Con credenciales correctas, te lleva al dashboard
- [ ] Con credenciales incorrectas, muestra error "Credenciales inválidas"
- [ ] El dashboard muestra la información del usuario
- [ ] El botón "Cerrar Sesión" funciona
- [ ] Después del logout, te redirige a `/login`
- [ ] No puedes acceder a `/dashboard` sin autenticación
- [ ] La sesión persiste al recargar la página
- [ ] Funciona tanto con USER como con ADMIN

## 🎨 Aspecto Visual Esperado

### Página de Login

- Fondo gris claro
- Formulario centrado con fondo blanco
- Campos con bordes grises
- Botón azul "Iniciar Sesión"
- Panel gris claro con credenciales de prueba

### Dashboard

- Header blanco con sombra
- Título "Dashboard" a la izquierda
- Botón rojo "Cerrar Sesión" a la derecha
- Tarjeta de bienvenida con fondo blanco
- Tarjeta de información con datos en tabla
- Rol con etiqueta de color (azul para USER, morada para ADMIN)

## 📊 Datos del Backend

El dashboard muestra:

- ID del usuario (UUID)
- Email
- Nombre
- Rol (USER o ADMIN)
- Fecha de creación (formateada en español)

## 🔧 Si algo no funciona

### Error: Cannot connect to backend

1. Verifica que el backend esté corriendo:

```bash
curl http://localhost:3500/health
```

2. Si no responde, levanta el backend:

```bash
cd ..
docker compose up -d
```

### Error: CORS policy

1. Verifica el `.env` del backend:

```bash
cd ..
cat .env | grep CORS_ORIGIN
# Debe mostrar: CORS_ORIGIN=http://localhost:5173
```

2. Reinicia el backend:

```bash
docker compose restart backend
```

### Error: Token inválido

1. Haz logout
2. Vuelve a hacer login
3. Si persiste, verifica que el backend esté usando el mismo JWT_SECRET

### El frontend no arranca

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Intentar de nuevo
npm run dev
```

## 🎓 Conceptos Demostrados

Al probar el frontend, verás en acción:

1. **React 19.2 useActionState** - En el formulario de login
2. **Context API** - Estado global de autenticación
3. **React Router** - Navegación entre páginas
4. **Protected Routes** - Rutas que requieren autenticación
5. **JWT Authentication** - Login con token
6. **localStorage** - Persistencia de sesión
7. **Tailwind CSS 4** - Estilos utilitarios
8. **TypeScript** - Tipado estricto

## ✨ Resultado Final Esperado

Un frontend completamente funcional que:

- ✅ Se conecta al backend sin problemas
- ✅ Autentica usuarios correctamente
- ✅ Protege rutas privadas
- ✅ Persiste la sesión
- ✅ Muestra datos del backend
- ✅ Maneja errores adecuadamente
- ✅ Usa las últimas tecnologías de React

**¡Todo listo para usar! 🚀**

---

## 👨‍💻 Autor

**Isaías Fernández Lozano**

- 📧 Email: [ifernandez@ieshlanz.es](mailto:ifernandez@ieshlanz.es)
- 🐙 GitHub: [@isaiasfl](https://github.com/isaiasfl)
- 📚 Módulo: **DWEC** (Desarrollo Web en Entorno Cliente)
- 🎓 Centro: IES Hermenegildo Lanz
- 📅 Fecha: Febrero 2026
