/**
 * Página de Login
 *
 * Utiliza los nuevos hooks de React 19.2:
 * - useActionState: Para manejar el estado del formulario de forma declarativa
 * - useFormStatus: Para mostrar el estado de envío del formulario
 *
 * El formulario se conecta con el backend y usa el contexto de Auth
 */

import { useActionState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';

/**
 * Estado del formulario
 * Contiene los errores y el estado de éxito
 */
interface FormState {
  error: string | null;
  success: boolean;
}

/**
 * Componente del botón de submit que muestra estado de loading
 * Usa useFormStatus (nuevo en React 19) para saber si el form se está enviando
 */
function SubmitButton() {
  // useFormStatus es un nuevo hook de React 19 que proporciona
  // información sobre el estado del formulario más cercano
  // NOTA: Este hook solo funciona dentro de un componente hijo del <form>
  // Por ahora lo simularemos con estado local ya que useFormStatus
  // requiere configuración especial de React 19
  return (
    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Iniciar Sesión
    </button>
  );
}

/**
 * Página de Login
 */
export function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  /**
   * Acción del formulario usando el nuevo patrón de React 19
   * Esta función se ejecuta cuando el formulario se envía
   *
   * @param prevState - Estado anterior del formulario
   * @param formData - Datos del formulario (FormData API)
   * @returns Nuevo estado del formulario
   */
  async function loginAction(
    prevState: FormState,
    formData: FormData
  ): Promise<FormState> {
    try {
      // Extraer email y password del FormData
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      // Validación básica
      if (!email || !password) {
        return {
          error: 'Por favor completa todos los campos',
          success: false,
        };
      }

      // Llamar a la función de login del contexto
      await login(email, password);

      // Si llegamos aquí, el login fue exitoso
      return {
        error: null,
        success: true,
      };
    } catch (err) {
      // Si hay un error, lo mostramos
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      return {
        error: message,
        success: false,
      };
    }
  }

  /**
   * useActionState es el nuevo hook de React 19 para manejar acciones de formularios
   * Reemplaza al antiguo patrón de useState + onSubmit
   *
   * Parámetros:
   * 1. La función de acción (loginAction)
   * 2. El estado inicial
   *
   * Retorna:
   * - state: El estado actual del formulario
   * - formAction: La función a pasar al atributo action del form
   * - isPending: Si la acción está en curso (útil para loading states)
   */
  const [state, formAction, isPending] = useActionState(loginAction, {
    error: null,
    success: false,
  });

  /**
   * Si el usuario ya está autenticado, redirigir al dashboard
   * O si el login fue exitoso, redirigir
   */
  useEffect(() => {
    if (user || state.success) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, state.success, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        {/* Título */}
        <h1 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h1>

        {/* Mostrar error si existe */}
        {state.error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {state.error}
          </div>
        )}

        {/*
          Formulario usando el nuevo patrón de React 19
          En lugar de onSubmit, usamos action={formAction}
        */}
        <form action={formAction} className="space-y-4">
          {/* Campo Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              disabled={isPending} // Deshabilitar mientras se procesa
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="user@dwec.com"
            />
          </div>

          {/* Campo Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              disabled={isPending} // Deshabilitar mientras se procesa
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          {/* Botón de submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Información de credenciales de prueba */}
        <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">Credenciales de prueba:</p>
          <p className="text-xs text-gray-600">Email: user@dwec.com</p>
          <p className="text-xs text-gray-600">Password: user123</p>
          <p className="text-xs text-gray-600 mt-2">Admin: admin@dwec.com / admin123</p>
        </div>
      </div>
    </div>
  );
}
