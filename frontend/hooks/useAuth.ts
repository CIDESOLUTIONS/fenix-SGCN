import { useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  fullName: string;
  position?: string;
  role: string;
  tenant: {
    name: string;
    logo?: string;
    subscriptionPlan: string;
    subscriptionStatus: string;
  };
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        // URL del backend
        const baseURL = typeof window !== 'undefined'
          ? 'http://localhost:3001'  // Cliente (navegador)
          : 'http://fenix_backend:3001'; // Servidor (SSR)

        const response = await fetch(`${baseURL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Token inválido, limpiar localStorage
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/auth/login';
  };

  return {
    user,
    loading,
    logout,
    isAuthenticated: !!user,
  };
}

// Función helper para obtener iniciales del nombre
export function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .map(name => name.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}
