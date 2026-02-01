/**
 * Página de Administración
 *
 * Esta es una página protegida que SOLO pueden ver usuarios con rol ADMIN.
 * Los usuarios con rol USER verán un mensaje de "Acceso Denegado".
 *
 * Demuestra el control de acceso basado en roles (RBAC - Role Based Access Control)
 */

import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

/**
 * Interfaz para las estadísticas del sistema (del endpoint /api/admin/stats)
 */
interface SystemStats {
  totalUsers: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}

/**
 * Interfaz para un usuario (del endpoint /api/admin/users)
 */
interface UserInfo {
  id: string;
  email: string;
  name: string | null;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  _count: {
    tasks: number;
  };
}

/**
 * Página de administración - Solo para ADMIN
 */
export function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Estado para las estadísticas
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtener el token del localStorage
   */
  function getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Cargar las estadísticas del sistema
   */
  async function loadStats() {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch('http://localhost:3500/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.ok) {
        setStats(data.data);
      } else {
        setError('Error al cargar estadísticas');
      }
    } catch (err) {
      console.error('Error cargando stats:', err);
      setError('Error de conexión con el servidor');
    }
  }

  /**
   * Cargar la lista de usuarios
   */
  async function loadUsers() {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch('http://localhost:3500/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.ok) {
        setUsers(data.data);
      } else {
        setError('Error al cargar usuarios');
      }
    } catch (err) {
      console.error('Error cargando users:', err);
      setError('Error de conexión con el servidor');
    }
  }

  /**
   * Cargar datos al montar el componente
   */
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      await Promise.all([loadStats(), loadUsers()]);
      setLoading(false);
    }

    loadData();
  }, []);

  /**
   * Manejar logout
   */
  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  // Usuario no existe (nunca debería pasar por ProtectedRoute)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-purple-600 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Panel de Administración</h1>
            <p className="text-purple-200 text-sm mt-1">
              Acceso exclusivo para administradores
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800 transition-colors"
            >
              Dashboard
            </button>
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
        {/* Mensaje de bienvenida */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <p className="text-purple-800">
            <strong>👑 Bienvenido, {user.name || user.email}</strong>
            <br />
            <span className="text-sm">
              Tienes acceso completo al panel de administración. Esta página solo es accesible
              para usuarios con rol ADMIN.
            </span>
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">Cargando datos...</div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Estadísticas del Sistema */}
        {!loading && stats && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Estadísticas del Sistema</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Total Usuarios */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm text-gray-600 mb-1">Total Usuarios</div>
                <div className="text-3xl font-bold text-purple-600">{stats.totalUsers}</div>
              </div>

              {/* Total Tareas */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm text-gray-600 mb-1">Total Tareas</div>
                <div className="text-3xl font-bold text-blue-600">{stats.totalTasks}</div>
              </div>

              {/* Tareas Completadas */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm text-gray-600 mb-1">Completadas</div>
                <div className="text-3xl font-bold text-green-600">{stats.completedTasks}</div>
              </div>

              {/* Tareas Pendientes */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm text-gray-600 mb-1">Pendientes</div>
                <div className="text-3xl font-bold text-orange-600">{stats.pendingTasks}</div>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Usuarios */}
        {!loading && users.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Usuarios del Sistema</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tareas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Fecha Registro
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {u.name || 'Sin nombre'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{u.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded ${
                            u.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{u._count.tasks}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {new Date(u.createdAt).toLocaleDateString('es-ES')}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
