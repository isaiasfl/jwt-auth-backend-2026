/**
 * Hook personalizado para usar el contexto de autenticación
 *
 * Este hook simplifica el acceso al AuthContext y proporciona
 * una mejor experiencia de desarrollo con TypeScript
 */

import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Hook para acceder al contexto de autenticación
 *
 * @returns El contexto de autenticación con user, token, login, logout, etc.
 * @throws Error si se usa fuera del AuthProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, login, logout } = useAuth();
 *
 *   if (!user) {
 *     return <div>No autenticado</div>;
 *   }
 *
 *   return <div>Hola {user.name}</div>;
 * }
 * ```
 */
export function useAuth() {
  // Obtenemos el contexto
  const context = useContext(AuthContext);

  // Si el contexto es undefined, significa que se está usando
  // fuera del AuthProvider, lo cual es un error de programación
  if (context === undefined) {
    throw new Error(
      'useAuth debe ser usado dentro de un AuthProvider. ' +
        'Asegúrate de envolver tu aplicación con <AuthProvider>'
    );
  }

  return context;
}
