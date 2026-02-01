/**
 * Contexto Global de Autenticación
 *
 * Proporciona el estado de autenticación y funciones para login/logout
 * a toda la aplicación. Usa localStorage para persistir el token.
 */

import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { User, AuthContextType } from '../types/auth.types';
import * as api from '../utils/api';

/**
 * Creamos el contexto con un valor por defecto undefined
 * Esto nos permite detectar si alguien intenta usar el contexto
 * fuera del Provider
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Props del AuthProvider
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Clave para guardar el token en localStorage
 */
const TOKEN_KEY = 'auth_token';

/**
 * Provider del contexto de autenticación
 * Envuelve la aplicación y proporciona el estado y funciones de auth
 */
export function AuthProvider({ children }: AuthProviderProps) {
  // Estado del usuario actual (null si no está autenticado)
  const [user, setUser] = useState<User | null>(null);

  // Token JWT (null si no está autenticado)
  const [token, setToken] = useState<string | null>(null);

  // Loading: true mientras verificamos si hay un token guardado
  const [loading, setLoading] = useState(true);

  // Mensaje de error si algo sale mal
  const [error, setError] = useState<string | null>(null);

  /**
   * Efecto que se ejecuta al montar el componente
   * Verifica si hay un token guardado en localStorage
   * y si es válido, obtiene los datos del usuario
   */
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Verifica si hay un token guardado y si es válido
   * Se ejecuta al cargar la página
   */
  async function checkAuth() {
    try {
      // Intentar obtener el token de localStorage
      const savedToken = localStorage.getItem(TOKEN_KEY);

      if (!savedToken) {
        // No hay token guardado, el usuario no está autenticado
        setLoading(false);
        return;
      }

      // Hay un token guardado, verificamos si es válido
      // haciendo una petición al backend
      const response = await api.getMe(savedToken);

      // Si llegamos aquí, el token es válido
      setToken(savedToken);
      setUser(response.data);
    } catch (err) {
      // El token es inválido o expiró, lo eliminamos
      console.error('Error verificando autenticación:', err);
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    } finally {
      // Terminamos de verificar
      setLoading(false);
    }
  }

  /**
   * Función para hacer login
   *
   * @param email - Email del usuario
   * @param password - Contraseña del usuario
   * @throws Error si las credenciales son incorrectas
   */
  async function login(email: string, password: string): Promise<void> {
    try {
      setError(null); // Limpiar errores previos
      setLoading(true);

      // Hacer la petición de login al backend
      const response = await api.login(email, password);

      // Guardar el token en localStorage para persistencia
      localStorage.setItem(TOKEN_KEY, response.data.token);

      // Actualizar el estado con el usuario y token
      setToken(response.data.token);
      setUser(response.data.user);
    } catch (err) {
      // Si hay un error, lo guardamos en el estado
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(message);
      throw err; // Re-lanzamos el error para que el componente pueda manejarlo
    } finally {
      setLoading(false);
    }
  }

  /**
   * Función para cerrar sesión
   * Elimina el token de localStorage y limpia el estado
   */
  function logout() {
    // Eliminar token de localStorage
    localStorage.removeItem(TOKEN_KEY);

    // Limpiar estado
    setToken(null);
    setUser(null);
    setError(null);
  }

  /**
   * Función para limpiar el mensaje de error
   */
  function clearError() {
    setError(null);
  }

  /**
   * Valor del contexto que se proporciona a los componentes hijos
   */
  const value: AuthContextType = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
