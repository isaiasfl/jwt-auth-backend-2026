# 🚀 Pasos para Lanzar el Backend - Guía para Alumnos

Esta guía te llevará paso a paso para levantar el backend desde cero. Sigue todos los pasos en orden.

---

## ✅ Requisitos Previos

Antes de empezar, asegúrate de tener instalado:

- **Docker Desktop** (Windows/Mac) o **Docker Engine** (Linux)
- **Git** (para clonar el repositorio)

### Verificar que Docker está instalado

```bash
docker --version
docker compose version
```

Si ves las versiones, estás listo. Si no, instala Docker Desktop desde: https://www.docker.com/products/docker-desktop

---

## 📦 Paso 1: Obtener el Proyecto

### Opción A: Si el proyecto está en Git

```bash
# Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd backend-dwec-prisma-jwt
```

### Opción B: Si tienes el proyecto en un ZIP

```bash
# Descomprimir el ZIP
unzip backend-dwec-prisma-jwt.zip
cd backend-dwec-prisma-jwt
```

---

## 🔧 Paso 2: Verificar el archivo .env

El proyecto ya incluye un archivo `.env` listo para usar. Verifica que existe:

```bash
# Ver el contenido del archivo .env
cat .env
```

Deberías ver algo como:

```
NODE_ENV=development
PORT=3500
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=tu_super_secreto_jwt_cambiar_en_produccion_12345
JWT_EXPIRES_IN=1h
DATABASE_URL=postgresql://dwec_user:dwec_password@postgres:5432/dwec_db?schema=public
PGADMIN_DEFAULT_EMAIL=isaias@dwec.com
PGADMIN_DEFAULT_PASSWORD=dwec-2026
```

**¿Qué puedes cambiar?**

- `CORS_ORIGIN`: Si tu frontend React usa otro puerto (ej: 3000), cámbialo
- `JWT_SECRET`: En producción, usa un secreto más seguro
- Los demás valores están bien para desarrollo

---

## 🐳 Paso 3: Levantar los Servicios con Docker

Este comando levanta 3 contenedores: backend, PostgreSQL y pgAdmin.

```bash
docker compose up -d
```

**¿Qué significa?**

- `docker compose`: Herramienta para manejar múltiples contenedores
- `up`: Levantar los servicios
- `-d`: Modo detached (en segundo plano)

**Salida esperada:**

```
✔ Network prj_backend_crud_react_dwec-network  Created
✔ Container dwec-postgres  Started
✔ Container dwec-pgadmin   Started
✔ Container dwec-backend   Started
```

---

## 📊 Paso 4: Verificar que los Servicios Están Corriendo

```bash
docker compose ps
```

**Salida esperada:**

```
NAME            STATUS         PORTS
dwec-backend    Up X minutes   0.0.0.0:3500->3500/tcp
dwec-pgadmin    Up X minutes   0.0.0.0:3502->80/tcp
dwec-postgres   Up X minutes   0.0.0.0:3501->5432/tcp
```

✅ Todos deben mostrar `Up` (corriendo)
❌ Si alguno muestra `Restarting` o `Exited`, revisa los logs (ver sección de troubleshooting)

---

## 🗄️ Paso 5: Ejecutar las Migraciones de Prisma

Las migraciones crean las tablas en la base de datos.

```bash
docker compose exec backend npx prisma migrate dev --name init
```

**Salida esperada:**

```
Applying migration `<fecha>_init`
Your database is now in sync with your schema.
✔ Generated Prisma Client
```

**¿Qué hace este comando?**

- `docker compose exec backend`: Ejecuta un comando dentro del contenedor del backend
- `npx prisma migrate dev`: Aplica las migraciones de Prisma

---

## 🌱 Paso 6: Ejecutar el Seed (Datos Iniciales)

El seed crea usuarios y tareas de ejemplo.

```bash
docker compose exec backend npm run prisma:seed
```

**Salida esperada:**

```
🌱 Iniciando seed...
✅ Seed completado exitosamente

📝 Usuarios creados:
Admin: admin@dwec.com / admin123
User: user@dwec.com / user123
```

**Usuarios creados:**

- **Admin**: `admin@dwec.com` / `admin123` (tiene permisos de ADMIN)
- **User**: `user@dwec.com` / `user123` (usuario normal)
- **Tareas**: 3 tareas de ejemplo para el usuario normal

---

## ✅ Paso 7: Verificar que el Backend Funciona

### Probar el healthcheck

```bash
curl http://localhost:3500/health
```

**Respuesta esperada:**

```json
{
  "ok": true,
  "data": {
    "status": "ok",
    "timestamp": "2024-...",
    "environment": "development"
  }
}
```

**⚠️ Si el healthcheck falla la primera vez:**

A veces el backend arranca antes de que PostgreSQL esté completamente listo. Si recibes un error de conexión, simplemente reinicia el backend:

```bash
docker compose restart backend

# Espera 5 segundos y prueba de nuevo
sleep 5
curl http://localhost:3500/health
```

### Probar el login

```bash
curl -X POST http://localhost:3500/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@dwec.com","password":"user123"}'
```

**Respuesta esperada:**

```json
{
  "ok": true,
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

Si ves un `token`, ¡todo funciona correctamente! 🎉

---

## 🌐 Paso 8: Acceder a los Servicios

### Backend API

- **URL**: http://localhost:3500
- **Healthcheck**: http://localhost:3500/health
- **Documentación**: Ver carpeta `/documentacion`

### pgAdmin (Interfaz gráfica para PostgreSQL)

1. Abre en tu navegador: http://localhost:3502
2. Login:
   - Email: `isaias@dwec.com`
   - Password: `dwec-2026`
3. Añadir servidor PostgreSQL:
   - Click derecho en "Servers" → "Register" → "Server"
   - Pestaña "General":
     - Name: `DWEC Database` (o cualquier nombre)
   - Pestaña "Connection":
     - Host: `postgres` ⚠️ (nombre del servicio, NO localhost)
     - Port: `5432` ⚠️ (puerto interno, NO 3501)
     - Database: `dwec_db`
     - Username: `dwec_user`
     - Password: `dwec_password`
   - Guardar

---

## 🧪 Paso 9: Probar con Insomnia (Recomendado)

### Instalar Insomnia

Descarga desde: https://insomnia.rest/download

### Importar la colección

1. Abre Insomnia
2. Click en: **Application** → **Preferences** → **Data** → **Import Data**
3. Selecciona: **From File**
4. Elige el archivo: `insomnia/insomnia-collection.json`
5. La colección "DWEC Backend - Prisma JWT" aparecerá

### Usar la colección

1. Abre la carpeta "Auth"
2. Ejecuta "Login (USER)"
3. Copia el `token` de la respuesta
4. Abre "Manage Environments" (Ctrl+E)
5. Pega el token en la variable `token`
6. Ahora puedes probar todos los endpoints de "Tasks" y "Admin"

---

## 📝 Comandos Útiles

### Ver logs de los servicios

```bash
# Logs del backend
docker compose logs -f backend

# Logs de todos los servicios
docker compose logs -f

# Últimas 50 líneas del backend
docker compose logs --tail=50 backend
```

### Detener los servicios

```bash
# Detener (los datos se mantienen)
docker compose down

# Detener y eliminar volúmenes (borra TODO, incluida la BD)
docker compose down -v
```

### Reiniciar servicios

```bash
# Reiniciar todos
docker compose restart

# Reiniciar solo el backend
docker compose restart backend
```

### Entrar al contenedor del backend

```bash
docker compose exec backend sh
# Dentro del contenedor puedes ejecutar comandos npm, prisma, etc.
# Para salir: exit
```

---

## 🔄 ¿Cómo apagar y volver a encender?

### Al finalizar tu sesión de trabajo

```bash
# Opción 1: Dejar todo corriendo (consume recursos)
# No hagas nada, los contenedores seguirán activos

# Opción 2: Detener los servicios (recomendado)
docker compose down
```

### Al volver a trabajar (después de apagar)

```bash
# Levantar de nuevo (los datos se mantienen)
docker compose up -d
```

**✅ Los datos NO se pierden** cuando apagas el ordenador o haces `docker compose down`. Los datos están en un volumen persistente de Docker.

**❌ Los datos SÍ se pierden** si ejecutas `docker compose down -v` (elimina volúmenes)

---

## � Cómo actualizar el proyecto (Redespliegue)

Si el profesor ha subido cambios al repositorio o tú has modificado el código y quieres que se reflejen en los contenedores, sigue estos pasos:

### 1. Descargar los últimos cambios

```bash
git pull origin main
```

### 2. Actualizar las imágenes y reiniciar contenedores

El flag `--build` es fundamental para que Docker vuelva a leer el código fuente y genere nuevas imágenes.

```bash
docker compose up -d --build
```

### 3. Aplicar posibles cambios en la base de datos

Si se han añadido nuevas tablas o modelos:

```bash
docker compose exec backend npx prisma migrate dev
```

---

## �🔧 Troubleshooting (Solución de Problemas)

### Error: "port is already allocated"

**Causa:** El puerto 3500, 3501 o 3502 ya está en uso.

**Solución:**

```bash
# Ver qué está usando el puerto
lsof -i :3500  # En Linux/Mac
netstat -ano | findstr :3500  # En Windows

# Cambiar el puerto en docker-compose.yml
# Ejemplo: cambiar 3500:3500 por 3600:3500
```

### Error: "Cannot connect to Docker daemon"

**Causa:** Docker Desktop no está corriendo.

**Solución:** Inicia Docker Desktop y espera a que esté listo.

### Error: "no configuration file provided"

**Causa:** No estás en la carpeta del proyecto.

**Solución:**

```bash
# Verifica que estés en la carpeta correcta
pwd  # Deberías ver: .../backend-dwec-prisma-jwt
ls   # Deberías ver: docker-compose.yml
```

### Backend no inicia (error de OpenSSL)

**Causa:** La imagen no se construyó correctamente.

**Solución:**

```bash
docker compose down
docker compose build backend
docker compose up -d
```

### pgAdmin se reinicia constantemente

**Causa:** Email inválido en las variables de entorno.

**Solución:**

```bash
# Verificar que .env tenga:
PGADMIN_DEFAULT_EMAIL=isaias@dwec.com  # Debe tener @
```

### Ver documentación completa de troubleshooting

Lee: `documentacion/05-troubleshooting.md`

---

## 🎯 Siguiente Paso: Conectar con React

Una vez que el backend esté funcionando, puedes conectar tu aplicación React:

### Ejemplo de login desde React

```javascript
async function login(email, password) {
  const response = await fetch("http://localhost:3500/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (data.ok) {
    localStorage.setItem("token", data.data.token);
    return data.data;
  } else {
    throw new Error(data.error.message);
  }
}
```

### Ejemplo de petición protegida

```javascript
async function getTasks() {
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:3500/api/tasks", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data.ok ? data.data : null;
}
```

**Documentación completa**: Ver `documentacion/02-auth.md` y `documentacion/03-crud-tasks.md`

---

## 📚 Recursos Adicionales

- **Documentación completa**: Carpeta `/documentacion`
  - `00-overview.md` - Arquitectura del proyecto
  - `01-setup.md` - Instalación detallada
  - `02-auth.md` - Autenticación JWT
  - `03-crud-tasks.md` - CRUD de tareas
  - `04-how-to-create-a-new-resource.md` - Crear nuevos recursos
  - `05-troubleshooting.md` - Solución de problemas

- **Colección Insomnia**: Carpeta `/insomnia`
- **README principal**: `README.md`

---

## ✅ Checklist Final

Marca cada paso a medida que lo completes:

- [ ] Docker Desktop instalado y corriendo
- [ ] Proyecto descargado/clonado
- [ ] Archivo `.env` verificado
- [ ] `docker compose up -d` ejecutado correctamente
- [ ] Todos los servicios muestran "Up" en `docker compose ps`
- [ ] Migraciones ejecutadas (`prisma migrate dev`)
- [ ] Seed ejecutado (`npm run prisma:seed`)
- [ ] Healthcheck responde: `curl http://localhost:3500/health`
- [ ] Login funciona correctamente
- [ ] pgAdmin accesible en <http://localhost:3502>
- [ ] Colección de Insomnia importada (opcional pero recomendado)

**¡Listo! El backend está funcionando y puedes empezar a desarrollar tu frontend React.** 🚀

---

## 💡 Consejos

1. **Usa Insomnia** para probar los endpoints antes de programarlos en React
2. **Lee la documentación** en `/documentacion` para entender cómo funciona todo
3. **Revisa los logs** si algo no funciona: `docker compose logs -f`
4. **No tengas miedo** de hacer `docker compose down -v` y volver a empezar si algo se rompe
5. **Pregunta al profesor** si tienes dudas, ese es el propósito del curso

---

## 👨‍💻 Autor

### Isaías Fernández Lozano

- 📧 Email: [ifernandez@ieshlanz.es](mailto:ifernandez@ieshlanz.es)
- 🐙 GitHub: [@isaiasfl](https://github.com/isaiasfl)
- 📚 Módulo: **DWEC** (Desarrollo Web en Entorno Cliente)
- 🎓 Centro: IES Hermenegildo Lanz
- 📅 Fecha: Febrero 2026

> 🎓 **Proyecto educativo** para enseñar desarrollo web full-stack con React + Node.js
