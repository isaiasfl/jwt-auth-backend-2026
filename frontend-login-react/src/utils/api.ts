/**
 * Utilidades para comunicarse con el backend
 * Contiene funciones para hacer peticiones HTTP a los endpoints de autenticación
 */

import type { AuthResponse, MeResponse, ErrorResponse } from '../types/auth.types';

/**
 * URL base del backend
 * Asegúrate de que el backend esté corriendo en este puerto
 */
const API_URL = 'http://localhost:3500/api';

/**
 * Realiza el login enviando email y password al backend
 *
 * @param email - Email del usuario
 * @param password - Contraseña del usuario
 * @returns Promesa con la respuesta del backend (usuario y token)
 * @throws Error si las credenciales son inválidas o hay un problema de red
 */
export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  // Si la respuesta no es exitosa, lanzamos un error con el mensaje del backend
  if (!data.ok) {
    const errorData = data as ErrorResponse;
    throw new Error(errorData.error.message || 'Error al iniciar sesión');
  }

  return data as AuthResponse;
}

/**
 * Obtiene la información del usuario actual usando el token JWT
 *
 * @param token - Token JWT obtenido en el login
 * @returns Promesa con los datos del usuario
 * @throws Error si el token es inválido o expiró
 */
export async function getMe(token: string): Promise<MeResponse> {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`, // Enviar token en el header
    },
  });

  const data = await response.json();

  // Si la respuesta no es exitosa, lanzamos un error
  if (!data.ok) {
    const errorData = data as ErrorResponse;
    throw new Error(errorData.error.message || 'Error al obtener usuario');
  }

  return data as MeResponse;
}
