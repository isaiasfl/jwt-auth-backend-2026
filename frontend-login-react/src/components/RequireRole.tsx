/**
 * Componente RequireRole
 *
 * Protege rutas que requieren un rol específico (ADMIN o USER).
 * Si el usuario no tiene el rol requerido, muestra un mensaje de acceso denegado.
 */

import { useAuth } from '../hooks/useAuth';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

/**
 * Props del componente RequireRole
 */
interface RequireRoleProps {
  children: ReactNode; // Contenido a mostrar si tiene el rol correcto
  role: 'USER' | 'ADMIN'; // Rol requerido
}

/**
 * Componente que protege rutas por rol
 *
 * Verifica que el usuario tenga el rol especificado.
 * Si no lo tiene, muestra un mensaje de acceso denegado.
 *
 * IMPORTANTE: Este componente debe usarse DENTRO de un ProtectedRoute
 * ya que asume que el usuario está autenticado.
 *
 * @example
 * ```tsx
 * <Route
 *   path="/admin"
 *   element={
 *     <ProtectedRoute>
 *       <RequireRole role="ADMIN">
 *         <AdminPage />
 *       </RequireRole>
 *     </ProtectedRoute>
 *   }
 * />
 * ```
 */
export function RequireRole({ children, role }: RequireRoleProps) {
  const { user } = useAuth();

  // Este componente asume que user existe (porque está dentro de ProtectedRoute)
  // pero agregamos verificación por seguridad
  if (!user) {
    return null;
  }

  // Verificar si el usuario tiene el rol requerido
  if (user.role !== role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          {/* Icono de acceso denegado */}
          <div className="text-6xl mb-4">🚫</div>

          {/* Título */}
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Acceso Denegado
          </h1>

          {/* Mensaje explicativo */}
          <p className="text-gray-600 mb-6">
            No tienes permisos para acceder a esta página.
            <br />
            <span className="text-sm mt-2 block">
              Se requiere rol: <strong>{role}</strong>
              <br />
              Tu rol actual: <strong>{user.role}</strong>
            </span>
          </p>

          {/* Botón para volver */}
          <Link
            to="/dashboard"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Volver al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Si tiene el rol correcto, mostrar el contenido
  return <>{children}</>;
}
