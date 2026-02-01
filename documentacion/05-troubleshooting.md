# 🔧 Troubleshooting - Solución de problemas

## Errores comunes y soluciones

### 1. CORS: Blocked by CORS policy

**Error:**

```
Access to fetch at 'http://localhost:3500/api/...' from origin 'http://localhost:5173'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

**Soluciones:**

a) Verifica que `CORS_ORIGIN` en `.env` coincida con tu frontend:

```bash
CORS_ORIGIN=http://localhost:5173
```

b) Si tu frontend usa otro puerto (ej: 3000), actualiza `.env`:

```bash
CORS_ORIGIN=http://localhost:3000
```

c) Reinicia el servidor después de cambiar `.env`:

```bash
docker compose restart backend
# o
npm run dev  # si usas desarrollo local
```

d) Para permitir múltiples orígenes (no recomendado en producción):

```typescript
// src/app.ts
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  }),
);
```

---

### 2. Puerto ya en uso

**Error:**

```
Error: listen EADDRINUSE: address already in use :::3500
```

**Soluciones:**

a) Detén los contenedores existentes:

```bash
docker compose down
docker compose up -d
```

b) Cambia el puerto en `.env` y `docker-compose.yml`:

En `.env`:

```bash
PORT=3600  # Nuevo puerto
```

En `docker-compose.yml`:

```yaml
backend:
  ports:
    - "3600:3600" # Cambia ambos
```

c) Encuentra y mata el proceso usando el puerto (Linux/Mac):

```bash
# Encontrar PID
lsof -i :3500

# Matar proceso
kill -9 <PID>
```

---

### 3. Error de conexión a PostgreSQL

**Error:**

```
Error: P1001: Can't reach database server at `postgres:5432`
```

**Soluciones:**

a) Verifica que PostgreSQL esté corriendo:

```bash
docker compose ps
# postgres debe estar "Up"
```

b) Verifica la `DATABASE_URL` en `.env`:

```bash
# Dentro de Docker (usa nombre del servicio):
DATABASE_URL=postgresql://dwec_user:dwec_password@postgres:5432/dwec_db?schema=public

# Desarrollo local (usa localhost):
DATABASE_URL=postgresql://dwec_user:dwec_password@localhost:3501/dwec_db?schema=public
```

c) Espera unos segundos y reinicia:

```bash
docker compose restart backend
```

d) Ver logs de PostgreSQL:

```bash
docker compose logs postgres
```

---

### 4. Prisma: Migration failed

**Error:**

```
Error: P3009: migrate found failed migrations
```

**Soluciones:**

a) Resetear la base de datos (CUIDADO: borra todos los datos):

```bash
docker compose exec backend npx prisma migrate reset
```

b) Ver estado de migraciones:

```bash
docker compose exec backend npx prisma migrate status
```

c) Forzar migración (solo desarrollo):

```bash
docker compose exec backend npx prisma migrate dev --skip-seed
```

---

### 5. Token JWT inválido o expirado

**Error en cliente:**

```json
{
  "ok": false,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Token inválido"
  }
}
```

**Soluciones:**

a) El token expiró (por defecto 1h), haz login de nuevo:

```javascript
// React
localStorage.removeItem("token");
// Redirigir a login
```

b) Verifica que el token se envíe correctamente:

```javascript
// Debe incluir "Bearer " antes del token
headers: {
  'Authorization': `Bearer ${token}`,  // ✅ Correcto
  // No: 'Authorization': token,       // ❌ Incorrecto
}
```

c) Si cambiaste `JWT_SECRET` en `.env`, los tokens antiguos no funcionarán. Reinicia sesión.

---

### 6. Error 404: Tarea/recurso no encontrado

**Error:**

```json
{
  "ok": false,
  "error": {
    "code": "TASK_NOT_FOUND",
    "message": "Tarea no encontrada"
  }
}
```

**Causas:**

a) El ID es incorrecto o no existe
b) El recurso pertenece a otro usuario (ownership)
c) El ID no tiene formato UUID válido

**Soluciones:**

- Verifica el ID en la base de datos (pgAdmin o Prisma Studio)
- Asegúrate de que el usuario autenticado sea el dueño del recurso
- Verifica que el ID sea un UUID válido

---

### 7. Error 403: Forbidden (Permisos)

**Error:**

```json
{
  "ok": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "No tienes permisos para esta acción"
  }
}
```

**Causa:** Intentas acceder a una ruta que requiere rol ADMIN con un usuario USER.

**Soluciones:**

a) Verifica el rol del usuario:

```
GET http://localhost:3500/api/auth/me
Authorization: Bearer <token>
```

b) Para probar rutas admin, usa las credenciales del admin:

```
Email: admin@dwec.com
Password: admin123
```

c) Cambiar rol de un usuario (vía Prisma Studio o SQL):

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'user@dwec.com';
```

---

### 8. Error de validación Zod

**Error:**

```json
{
  "ok": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Error de validación",
    "details": [...]
  }
}
```

**Soluciones:**

a) Lee el campo `details` para ver qué falló:

```json
"details": [
  {
    "path": ["body", "title"],
    "message": "El título es requerido"
  }
]
```

b) Asegúrate de enviar todos los campos requeridos con el tipo correcto:

```javascript
// ❌ Incorrecto
{
  title: 123;
} // title debe ser string

// ✅ Correcto
{
  title: "Mi tarea";
}
```

---

### 9. Docker: Cannot connect to the Docker daemon

**Error:**

```
Cannot connect to the Docker daemon at unix:///var/run/docker.sock
```

**Soluciones:**

a) Inicia Docker Desktop (Windows/Mac) o el servicio Docker (Linux):

```bash
# Linux
sudo systemctl start docker
```

b) Verifica que Docker esté corriendo:

```bash
docker ps
```

---

### 10. Módulo no encontrado (ESM)

**Error:**

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../something'
```

**Soluciones:**

a) En imports ESM, **SIEMPRE** incluye la extensión `.js`:

```typescript
// ❌ Incorrecto
import { foo } from "./utils/bar";

// ✅ Correcto
import { foo } from "./utils/bar.js";
```

b) Verifica que `tsconfig.json` tenga:

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}
```

c) Verifica que `package.json` tenga:

```json
{
  "type": "module"
}
```

---

### 11. Hot-reload no funciona en Docker

**Problema:** Cambias código pero el servidor no se reinicia.

**Soluciones:**

a) Verifica que los volúmenes estén montados en `docker-compose.yml`:

```yaml
volumes:
  - ./src:/app/src
  - ./prisma:/app/prisma
```

b) Usa `tsx watch` en el `Dockerfile`:

```dockerfile
CMD ["npm", "run", "dev"]
# Asegúrate que "dev" use tsx watch
```

c) Reinicia el contenedor:

```bash
docker compose restart backend
```

---

### 12. pgAdmin: No se puede conectar a PostgreSQL

**Problema:** pgAdmin no muestra la base de datos.

**Soluciones:**

a) Configuración del servidor en pgAdmin:

- Host: `postgres` (nombre del servicio Docker, NO localhost)
- Port: `5432` (puerto interno, NO 3501)
- Username: `dwec_user`
- Password: `dwec_password`
- Database: `dwec_db`

b) Verifica que postgres esté corriendo:

```bash
docker compose ps postgres
```

---

### 13. Prisma Client no actualizado

**Error:**

```
Property 'product' does not exist on type 'PrismaClient'
```

**Solución:**

Genera el cliente después de cambiar el schema:

```bash
docker compose exec backend npx prisma generate
# o
npm run prisma:generate
```

---

### 14. Error al ejecutar seed

**Error:**

```
Unique constraint failed on the fields: (`email`)
```

**Causa:** Los usuarios del seed ya existen.

**Soluciones:**

a) El seed borra datos antes de crear (revisa `prisma/seed.ts`)

b) Resetear la base de datos:

```bash
docker compose exec backend npx prisma migrate reset
```

c) Eliminar datos manualmente (pgAdmin o Prisma Studio)

---

## Logs útiles

```bash
# Ver logs del backend
docker compose logs -f backend

# Ver logs de postgres
docker compose logs -f postgres

# Ver todos los logs
docker compose logs -f

# Ver últimas 50 líneas
docker compose logs --tail=50 backend
```

---

## Reiniciar todo desde cero

Si nada funciona:

```bash
# 1. Detener y eliminar contenedores + volúmenes
docker compose down -v

# 2. Eliminar node_modules (opcional)
rm -rf node_modules

# 3. Reinstalar dependencias
npm install

# 4. Levantar servicios
docker compose up -d

# 5. Migraciones
docker compose exec backend npx prisma migrate dev
docker compose exec backend npx prisma generate

# 6. Seed
docker compose exec backend npm run prisma:seed

# 7. Ver logs
docker compose logs -f backend
```

---

## Recursos adicionales

- [Documentación Prisma](https://www.prisma.io/docs)
- [Documentación Express](https://expressjs.com/)
- [Documentación Zod](https://zod.dev/)
- [JWT.io](https://jwt.io/) - Decodificar tokens JWT

---

## ¿Aún tienes problemas?

Revisa:

1. Los logs con `docker compose logs -f`
2. Que las variables de entorno estén correctas (`.env`)
3. Que todos los servicios estén corriendo (`docker compose ps`)
4. Que los puertos no estén ocupados
5. Que Prisma Client esté generado

---

## 👨‍💻 Autor

**Isaías Fernández Lozano**

- 📧 Email: [ifernandez@ieshlanz.es](mailto:ifernandez@ieshlanz.es)
- 🐙 GitHub: [@isaiasfl](https://github.com/isaiasfl)
- 📚 Módulo: **DWEC** (Desarrollo Web en Entorno Cliente)
- 🎓 Centro: IES Hermenegildo Lanz
- 📅 Fecha: Febrero 2026
