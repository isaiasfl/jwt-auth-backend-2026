/**
 * Componente principal de la aplicación
 *
 * Configura las rutas y envuelve la app con el AuthProvider
 * para proporcionar el contexto de autenticación a toda la aplicación
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminPage } from './pages/AdminPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RequireRole } from './components/RequireRole';

/**
 * Componente que maneja la ruta raíz "/"
 * Redirige al dashboard si está autenticado, o al login si no lo está
 */
function RootRedirect() {
  const { user, loading } = useAuth();

  // Mientras se verifica la autenticación, mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  // Redirigir según el estado de autenticación
  return <Navigate to={user ? '/dashboard' : '/login'} replace />;
}

/**
 * Configuración de rutas de la aplicación
 */
function AppRoutes() {
  return (
    <Routes>
      {/* Ruta raíz: redirige según autenticación */}
      <Route path="/" element={<RootRedirect />} />

      {/* Ruta de login: accesible sin autenticación */}
      <Route path="/login" element={<LoginPage />} />

      {/*
        Ruta del dashboard: PROTEGIDA
        Solo accesible si el usuario está autenticado
        ProtectedRoute se encarga de verificar y redirigir si es necesario
      */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/*
        Ruta de administración: PROTEGIDA Y SOLO PARA ADMIN
        Requiere dos niveles de protección:
        1. ProtectedRoute: Usuario debe estar autenticado
        2. RequireRole: Usuario debe tener rol ADMIN

        Si un usuario USER intenta acceder, verá "Acceso Denegado"
      */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RequireRole role="ADMIN">
              <AdminPage />
            </RequireRole>
          </ProtectedRoute>
        }
      />

      {/* Ruta 404: cualquier otra ruta redirige a la raíz */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/**
 * Componente principal de la aplicación
 *
 * Estructura:
 * 1. BrowserRouter: Proporciona routing a la aplicación
 * 2. AuthProvider: Proporciona el contexto de autenticación
 * 3. AppRoutes: Define las rutas de la aplicación
 */
export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
