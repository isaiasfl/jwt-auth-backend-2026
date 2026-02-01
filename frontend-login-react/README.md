# Frontend Login React - DWEC

<div align="center">

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7.13-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

</div>

Frontend de autenticación para conectar con el backend JWT.

## 🎯 Características

- ✅ React 19.2 con nuevos hooks (useActionState)
- ✅ TypeScript estricto
- ✅ Tailwind CSS 4
- ✅ React Router DOM
- ✅ Contexto global de autenticación
- ✅ Formularios con las nuevas APIs de React 19
- ✅ Código completamente documentado

## 🚀 Inicio Rápido

### 1. Asegúrate de que el backend esté corriendo

```bash
# En la carpeta raíz del proyecto
cd ..
docker compose ps

# El backend debe estar en http://localhost:3500
```

### 2. Instalar dependencias (si no lo has hecho)

```bash
npm install
```

### 3. Ejecutar en modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

## 🔑 Credenciales de Prueba

**Usuario normal:**

- Email: `user@dwec.com`
- Password: `user123`

**Administrador:**

- Email: `admin@dwec.com`
- Password: `admin123`

## 📁 Estructura del Proyecto

```
src/
├── types/
│   └── auth.types.ts          # Tipos TypeScript
├── utils/
│   └── api.ts                 # Funciones API
├── contexts/
│   └── AuthContext.tsx        # Contexto global
├── hooks/
│   └── useAuth.ts             # Hook personalizado
├── components/
│   └── ProtectedRoute.tsx     # Rutas protegidas
├── pages/
│   ├── LoginPage.tsx          # Login
│   └── DashboardPage.tsx      # Dashboard
├── App.tsx                    # Rutas
└── main.tsx                   # Entry point
```

## 🆕 React 19.2 - useActionState

Usado en `LoginPage.tsx`:

```tsx
const [state, formAction, isPending] = useActionState(loginAction, {
  error: null,
  success: false,
});
```

## 🔑 Credenciales

- Usuario: `user@dwec.com` / `user123`
- Admin: `admin@dwec.com` / `admin123`

---

## 👨‍💻 Autor

**Isaías Fernández Lozano**

- 📧 Email: [ifernandez@ieshlanz.es](mailto:ifernandez@ieshlanz.es)
- 🐙 GitHub: [@isaiasfl](https://github.com/isaiasfl)
- 📚 Módulo: **DWEC** (Desarrollo Web en Entorno Cliente)
- 🎓 Centro: IES Hermenegildo Lanz
- 📅 Fecha: Febrero 2026

> 🔗 **Proyecto complementario**: Este frontend está diseñado para trabajar con el [backend JWT](../) del mismo repositorio.

---

## 📄 Licencia

MIT License - Proyecto Educativo
