/**
 * Obtiene la URL correcta del API según el contexto de ejecución
 * 
 * - Cliente (navegador): Usa rutas relativas que Nginx proxea al backend
 * - Servidor (Next.js SSR): Usa comunicación directa por red Docker
 */
export function getApiUrl(): string {
  // Si estamos en el servidor (Next.js SSR)
  if (typeof window === 'undefined') {
    return process.env.SERVER_API_URL || 'http://fenix_backend_prod:3001';
  }
  
  // Si estamos en el cliente (navegador)
  return process.env.NEXT_PUBLIC_API_URL || '';
}

/**
 * Fetch helper que usa la URL correcta según el contexto
 */
export async function apiFetch(endpoint: string, options?: RequestInit) {
  const baseUrl = getApiUrl();
  const url = `${baseUrl}${endpoint}`;
  
  return fetch(url, options);
}
