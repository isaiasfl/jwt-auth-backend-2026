/**
 * Tipos TypeScript para el sistema de autenticación
 * Define las interfaces y tipos utilizados en toda la aplicación
 */

/**
 * Interfaz que representa un usuario en el sistema
 */
export interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

/**
 * Credenciales necesarias para hacer login
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Respuesta del backend al hacer login
 */
export interface AuthResponse {
  ok: boolean;
  data: {
    user: User;
    token: string;
  };
}

/**
 * Respuesta del backend al obtener el usuario actual (/api/auth/me)
 */
export interface MeResponse {
  ok: boolean;
  data: User;
}

/**
 * Respuesta de error del backend
 */
export interface ErrorResponse {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Tipo del contexto de autenticación
 * Define qué funciones y estado están disponibles en el contexto
 */
export interface AuthContextType {
  // Estado
  user: User | null; // Usuario actual (null si no está autenticado)
  token: string | null; // Token JWT (null si no está autenticado)
  loading: boolean; // True mientras se verifica la autenticación
  error: string | null; // Mensaje de error si hubo algún problema

  // Funciones
  login: (email: string, password: string) => Promise<void>; // Hacer login
  logout: () => void; // Cerrar sesión
  clearError: () => void; // Limpiar mensaje de error
}
