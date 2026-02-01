# Colección de Insomnia

Este archivo contiene una colección completa de peticiones para probar el backend.

## Cómo importar

1. Abre Insomnia
2. Click en el menú superior: **Application → Preferences → Data → Import Data**
3. Selecciona **From File**
4. Elige el archivo `insomnia-collection.json`
5. La colección "DWEC Backend - Prisma JWT" aparecerá en tu workspace

## Cómo usar

### 1. Variables de entorno

La colección incluye variables:

- `base_url`: http://localhost:3500
- `token`: Se guarda aquí después del login

### 2. Flujo de prueba

#### A. Sin autenticación

1. **Healthcheck** - Verifica que el servidor esté corriendo

#### B. Autenticación

2. **Login (USER)** - Inicia sesión con `user@dwec.com / user123`
   - Copia el `token` de la respuesta
   - Pégalo en la variable de entorno `token` (Ctrl+E)

3. **Get Me** - Verifica que el token funciona

#### C. CRUD de tareas

4. **Get All Tasks** - Lista tus tareas
5. **Create Task** - Crea una tarea nueva
6. **Get Task by ID** - Reemplaza `TASK_ID_AQUI` con un ID real
7. **Update Task** - Actualiza una tarea
8. **Delete Task** - Elimina una tarea

#### D. Admin (solo con cuenta ADMIN)

9. **Login (ADMIN)** - Inicia sesión con `admin@dwec.com / admin123`
   - Actualiza el `token` en variables de entorno
10. **Get All Users** - Lista todos los usuarios (requiere ADMIN)
11. **Get Stats** - Estadísticas del sistema (requiere ADMIN)

### 3. Guardar el token automáticamente (opcional)

Para no copiar el token manualmente:

1. En la petición **Login (USER)**, ve a la pestaña **Tests**
2. Añade este script:

```javascript
const response = insomnia.response.body;
if (response && response.ok && response.data.token) {
  insomnia.environment.set("token", response.data.token);
}
```

Ahora el token se guarda automáticamente al hacer login.

## Probar error 403 (FORBIDDEN)

1. Haz login con **Login (USER)** (no admin)
2. Intenta acceder a **Get All Users (ADMIN)**
3. Recibirás un error 403:

```json
{
  "ok": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "No tienes permisos para esta acción"
  }
}
```

## Credenciales del seed

**Usuario normal:**

- Email: `user@dwec.com`
- Password: `user123`
- Rol: USER

**Administrador:**

- Email: `admin@dwec.com`
- Password: `admin123`
- Rol: ADMIN

## Alternativas a Insomnia

Si prefieres otras herramientas:

- **Postman**: Puedes importar el JSON (compatible)
- **Thunder Client** (VS Code): Importa desde archivo
- **curl**: Ver ejemplos en la documentación

---

## 👨‍💻 Autor

**Isaías Fernández Lozano**

- 📧 Email: [ifernandez@ieshlanz.es](mailto:ifernandez@ieshlanz.es)
- 🐙 GitHub: [@isaiasfl](https://github.com/isaiasfl)
- 📚 Módulo: **DWEC** (Desarrollo Web en Entorno Cliente)
- 🎓 Centro: IES Hermenegildo Lanz
- 📅 Fecha: Febrero 2026
