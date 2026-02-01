# 🚀 Setup - Instalación y Configuración

## Requisitos previos

- Node.js >= 20
- Docker y Docker Compose
- Git

## Paso 1: Clonar y configurar variables de entorno

```bash
# Copiar .env_example a .env
cp .env_example .env

# Editar .env si necesitas cambiar puertos u otras configuraciones
# Por defecto ya está listo para usar
```

### Variables de entorno explicadas

```bash
# Entorno de desarrollo
NODE_ENV=development

# Puerto del backend
PORT=3500

# Origen permitido para CORS (frontend React)
CORS_ORIGIN=http://localhost:5173

# Secreto para firmar JWT (cámbialo en producción)
JWT_SECRET=tu_super_secreto_jwt_cambiar_en_produccion_12345

# Tiempo de expiración del token
JWT_EXPIRES_IN=1h

# URL de conexión a PostgreSQL
# Usa 'postgres' como host porque es el nombre del servicio en Docker
DATABASE_URL=postgresql://dwec_user:dwec_password@postgres:5432/dwec_db?schema=public

# Credenciales de pgAdmin
PGADMIN_DEFAULT_EMAIL=isaias@dwec.com
PGADMIN_DEFAULT_PASSWORD=dwec-2026
```

## Paso 2: Levantar los servicios con Docker Compose

```bash
# Levantar todos los servicios (backend, postgres, pgadmin)
docker compose up -d

# Ver logs del backend
docker compose logs -f backend

# Ver logs de todos los servicios
docker compose logs -f
```

**Servicios disponibles:**

- Backend: http://localhost:3500
- pgAdmin: http://localhost:3502
- PostgreSQL: http://localhost:3501

## Paso 3: Ejecutar migraciones de Prisma

```bash
# Entrar al contenedor del backend
docker compose exec backend sh

# Dentro del contenedor:
npx prisma migrate dev --name init
npx prisma generate

# Salir del contenedor
exit
```

Alternativamente, si prefieres desarrollo local (sin Docker para el backend):

```bash
# Instalar dependencias
npm install

# Ejecutar migraciones
npm run prisma:migrate

# Generar Prisma Client
npm run prisma:generate
```

## Paso 4: Ejecutar el seed (datos iniciales)

```bash
# Opción 1: Dentro del contenedor
docker compose exec backend npm run prisma:seed

# Opción 2: Desarrollo local
npm run prisma:seed
```

**Datos creados por el seed:**

**Usuarios:**

- Admin: `admin@dwec.com` / `admin123` (rol: ADMIN)
- User: `user@dwec.com` / `user123` (rol: USER)

**Tareas:**

- 3 tareas de ejemplo asignadas al usuario normal

## Paso 5: Verificar que todo funciona

```bash
# Healthcheck
curl http://localhost:3500/health

# Deberías ver:
# {
#   "ok": true,
#   "data": {
#     "status": "ok",
#     "timestamp": "2024-xx-xxTxx:xx:xx.xxxZ",
#     "environment": "development"
#   }
# }
```

## Comandos útiles de Docker

```bash
# Ver servicios corriendo
docker compose ps

# Detener servicios
docker compose down

# Detener y eliminar volúmenes (CUIDADO: elimina la BD)
docker compose down -v

# Reconstruir imágenes
docker compose build

# Ver logs en tiempo real
docker compose logs -f backend

# Reiniciar un servicio específico
docker compose restart backend
```

## Desarrollo local (sin Docker para backend)

Si prefieres desarrollar sin Docker para el backend:

1. Asegúrate de tener PostgreSQL corriendo localmente
2. Cambia `DATABASE_URL` en `.env`:
   ```
   DATABASE_URL=postgresql://dwec_user:dwec_password@localhost:3501/dwec_db?schema=public
   ```
3. Ejecuta:
   ```bash
   npm install
   npm run prisma:migrate
   npm run prisma:generate
   npm run prisma:seed
   npm run dev
   ```

## Acceder a pgAdmin

1. Abre http://localhost:3502
2. Login:
   - Email: `isaias@dwec.com`
   - Password: `dwec-2026`
3. Añadir servidor PostgreSQL:
   - Host: `postgres` (nombre del servicio Docker)
   - Port: `5432`
   - User: `dwec_user`
   - Password: `dwec_password`
   - Database: `dwec_db`

## Prisma Studio (opcional)

Para ver y editar la base de datos con una interfaz gráfica:

```bash
# Dentro del contenedor
docker compose exec backend npx prisma studio

# Local
npm run prisma:studio
```

Abre http://localhost:5555

## Scripts disponibles

```bash
# Desarrollo con hot-reload
npm run dev

# Compilar TypeScript
npm run build

# Ejecutar versión compilada
npm start

# Generar Prisma Client
npm run prisma:generate

# Crear/aplicar migraciones
npm run prisma:migrate

# Ejecutar seed
npm run prisma:seed

# Abrir Prisma Studio
npm run prisma:studio

# Docker shortcuts
npm run docker:up      # docker compose up -d
npm run docker:down    # docker compose down
npm run docker:logs    # docker compose logs -f backend
```

## Siguiente paso

Ve a [02-auth.md](./02-auth.md) para aprender sobre autenticación JWT.

---

## 👨‍💻 Autor

**Isaías Fernández Lozano**

- 📧 Email: [ifernandez@ieshlanz.es](mailto:ifernandez@ieshlanz.es)
- 🐙 GitHub: [@isaiasfl](https://github.com/isaiasfl)
- 📚 Módulo: **DWEC** (Desarrollo Web en Entorno Cliente)
- 🎓 Centro: IES Hermenegildo Lanz
- 📅 Fecha: Febrero 2026
