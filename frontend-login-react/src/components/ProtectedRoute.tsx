/**
 * Componente ProtectedRoute
 *
 * Protege rutas que requieren autenticación.
 * Si el usuario no está autenticado, redirige a /login
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { ReactNode } from 'react';

/**
 * Props del componente ProtectedRoute
 */
interface ProtectedRouteProps {
  children: ReactNode; // Contenido a mostrar si está autenticado
}

/**
 * Componente que protege rutas privadas
 *
 * Verifica si el usuario está autenticado antes de mostrar el contenido.
 * Si no está autenticado, redirige a la página de login.
 *
 * @example
 * ```tsx
 * <Route
 *   path="/dashboard"
 *   element={
 *     <ProtectedRoute>
 *       <DashboardPage />
 *     </ProtectedRoute>
 *   }
 * />
 * ```
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  // Mientras se está verificando la autenticación, mostramos un loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl">Verificando autenticación...</div>
        </div>
      </div>
    );
  }

  // Si no hay usuario autenticado, redirigir a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, mostrar el contenido protegido
  return <>{children}</>;
}
