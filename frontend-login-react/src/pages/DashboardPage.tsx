/**
 * Página de Dashboard
 *
 * Esta es una página protegida que solo pueden ver usuarios autenticados.
 * Muestra información del usuario y permite hacer logout.
 */

import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

/**
 * Página principal del dashboard
 * Solo accesible para usuarios autenticados
 */
export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  /**
   * Maneja el click en el botón de logout
   * Cierra la sesión y redirige al login
   */
  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  // Este componente solo se renderiza si hay un usuario (protegido por ProtectedRoute)
  // pero agregamos esta verificación por seguridad de tipos
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex gap-3">
            {/* Mostrar botón de Admin solo si el usuario es ADMIN */}
            {user.role === 'ADMIN' && (
              <button
                onClick={() => navigate('/admin')}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                👑 Panel Admin
              </button>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Tarjeta de bienvenida */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            ¡Bienvenido, {user.name || user.email}! 👋
          </h2>
          <p className="text-gray-600">
            Has iniciado sesión correctamente en el sistema.
          </p>
        </div>

        {/* Información del usuario */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Información del Usuario</h3>
          <div className="space-y-3">
            {/* ID */}
            <div className="flex border-b pb-2">
              <span className="font-medium text-gray-700 w-32">ID:</span>
              <span className="text-gray-600 font-mono text-sm">{user.id}</span>
            </div>

            {/* Email */}
            <div className="flex border-b pb-2">
              <span className="font-medium text-gray-700 w-32">Email:</span>
              <span className="text-gray-600">{user.email}</span>
            </div>

            {/* Nombre */}
            <div className="flex border-b pb-2">
              <span className="font-medium text-gray-700 w-32">Nombre:</span>
              <span className="text-gray-600">{user.name || 'No especificado'}</span>
            </div>

            {/* Rol */}
            <div className="flex border-b pb-2">
              <span className="font-medium text-gray-700 w-32">Rol:</span>
              <span
                className={`px-2 py-1 rounded text-sm font-medium ${
                  user.role === 'ADMIN'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {user.role}
              </span>
            </div>

            {/* Fecha de creación */}
            <div className="flex">
              <span className="font-medium text-gray-700 w-32">Creado:</span>
              <span className="text-gray-600">
                {new Date(user.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Mensaje informativo */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>💡 Nota:</strong> Este es un dashboard básico de ejemplo.
            La autenticación está funcionando correctamente con el backend en{' '}
            <code className="bg-blue-100 px-1 rounded">http://localhost:3500</code>
          </p>
        </div>
      </main>
    </div>
  );
}
