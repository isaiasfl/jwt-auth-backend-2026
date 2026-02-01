# 📚 Overview - Arquitectura del Proyecto

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-9.0-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3.23-3E67B1?style=for-the-badge&logo=zod&logoColor=white)

</div>

## Descripción

Backend educativo completo con Node.js + Express + TypeScript + Prisma + JWT diseñado para que alumnos de React practiquen autenticación y operaciones CRUD.

## Características principales

- ✅ Autenticación JWT (registro, login, me)
- ✅ CRUD completo de tareas con ownership (cada usuario solo ve sus tareas)
- ✅ Sistema de roles (USER/ADMIN)
- ✅ Paginación y búsqueda
- ✅ Validación estricta con Zod
- ✅ Error handling centralizado
- ✅ PostgreSQL + Prisma ORM
- ✅ Docker Compose (backend, postgres, pgAdmin)
- ✅ TypeScript estricto con ESM
- ✅ CORS configurado para React (localhost:5173)
- ✅ Plantilla repetible para crear nuevos recursos

## Stack tecnológico

| Tecnología | Versión | Propósito              |
| ---------- | ------- | ---------------------- |
| Node.js    | 20      | Runtime JavaScript     |
| TypeScript | 5.6     | Tipado estático        |
| Express    | 4.21    | Framework web          |
| Prisma     | 5.22    | ORM para PostgreSQL    |
| PostgreSQL | 16      | Base de datos          |
| JWT        | 9.0     | Autenticación          |
| Zod        | 3.23    | Validación de datos    |
| bcrypt     | 5.1     | Hashing de contraseñas |

## Arquitectura

```
backend-dwec-prisma-jwt/
│
├── src/
│   ├── app.ts                 # Configuración de Express
│   ├── server.ts              # Inicialización del servidor
│   │
│   ├── config/                # Configuraciones
│   │   ├── env.ts            # Variables de entorno validadas
│   │   └── prisma.ts         # Cliente de Prisma
│   │
│   ├── middlewares/           # Middlewares globales
│   │   ├── authMiddleware.ts # JWT + roles
│   │   ├── errorMiddleware.ts # Manejo de errores
│   │   └── validateRequest.ts # Validación con Zod
│   │
│   ├── utils/                 # Utilidades
│   │   ├── AppError.ts       # Clase de error personalizada
│   │   └── response.ts       # Respuestas consistentes
│   │
│   └── modules/               # Módulos funcionales
│       ├── auth/             # Autenticación
│       │   ├── auth.schemas.ts
│       │   ├── auth.service.ts
│       │   ├── auth.controller.ts
│       │   └── auth.routes.ts
│       │
│       ├── tasks/            # CRUD de tareas
│       │   ├── tasks.schemas.ts
│       │   ├── tasks.service.ts
│       │   ├── tasks.controller.ts
│       │   └── tasks.routes.ts
│       │
│       ├── admin/            # Rutas administrativas
│       │   └── admin.routes.ts
│       │
│       └── template-resource/ # Plantilla para nuevos recursos
│           ├── README.md
│           ├── template.schemas.ts
│           ├── template.service.ts
│           ├── template.controller.ts
│           └── template.routes.ts
│
├── prisma/
│   ├── schema.prisma         # Modelos de datos
│   └── seed.ts               # Datos iniciales
│
├── documentacion/            # Documentación del proyecto
├── insomnia/                 # Colección de peticiones
├── docker-compose.yml        # Servicios Docker
├── Dockerfile                # Imagen del backend
├── package.json              # Dependencias
├── tsconfig.json             # Configuración TypeScript
└── .env_example              # Variables de entorno de ejemplo

```

## Puertos

| Servicio   | Puerto Host | Puerto Interno |
| ---------- | ----------- | -------------- |
| Backend    | 3500        | 3500           |
| PostgreSQL | 3501        | 5432           |
| pgAdmin    | 3502        | 80             |

## Flujo de datos

```
Cliente React (localhost:5173)
    │
    ├─ POST /api/auth/register  ─┐
    ├─ POST /api/auth/login     ─┼─> Auth Module
    └─ GET  /api/auth/me        ─┘
                │
                ├─> JWT generado
                │
    ┌───────────┴───────────┐
    │   Authorization:      │
    │   Bearer <token>      │
    └───────────┬───────────┘
                │
    ├─ GET    /api/tasks         ─┐
    ├─ GET    /api/tasks/:id     │
    ├─ POST   /api/tasks         ├─> Tasks Module (protegido)
    ├─ PUT    /api/tasks/:id     │
    └─ DELETE /api/tasks/:id     ─┘
                │
    ├─ GET /api/admin/users      ─┐
    └─ GET /api/admin/stats      ─┴─> Admin Module (solo ADMIN)
```

## Patrón de diseño

El proyecto sigue una arquitectura modular en capas:

1. **Routes** → Define los endpoints HTTP
2. **Controller** → Maneja las peticiones/respuestas
3. **Service** → Contiene la lógica de negocio
4. **Prisma** → Capa de acceso a datos

```
Request → Router → Middleware → Controller → Service → Prisma → DB
                                     ↓
                                 Response
```

## Seguridad

- ✅ Helmet para headers de seguridad
- ✅ CORS configurado
- ✅ Rate limiting (100 req/15min)
- ✅ Validación estricta de inputs (Zod)
- ✅ Passwords hasheados con bcrypt (10 rounds)
- ✅ JWT con expiración configurable
- ✅ Ownership de recursos (usuarios solo acceden a sus datos)
- ✅ Sistema de roles para autorización

## Próximos pasos

1. Ver [01-setup.md](./01-setup.md) para instrucciones de instalación
2. Leer [02-auth.md](./02-auth.md) para entender la autenticación
3. Explorar [03-crud-tasks.md](./03-crud-tasks.md) para el CRUD de ejemplo
4. Usar [04-how-to-create-a-new-resource.md](./04-how-to-create-a-new-resource.md) para crear nuevos recursos
5. Consultar [05-troubleshooting.md](./05-troubleshooting.md) si hay problemas

---

## 👨‍💻 Autor

**Isaías Fernández Lozano**

- 📧 Email: [ifernandez@ieshlanz.es](mailto:ifernandez@ieshlanz.es)
- 🐙 GitHub: [@isaiasfl](https://github.com/isaiasfl)
- 📚 Módulo: **DWEC** (Desarrollo Web en Entorno Cliente)
- 🎓 Centro: IES Hermenegildo Lanz
- 📅 Fecha: Febrero 2026

---

## 📄 Licencia

MIT License - Proyecto Educativo
