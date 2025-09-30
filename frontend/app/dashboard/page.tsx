"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  fullName: string;
  position: string;
}

interface Tenant {
  name: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  trialEndsAt: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [trialDaysLeft, setTrialDaysLeft] = useState(30);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          router.push('/auth/login');
          return;
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener datos del usuario');
        }

        const data = await response.json();
        setUser(data.user);
        setTenant(data.tenant);

        // Calcular días restantes del trial
        if (data.tenant?.trialEndsAt) {
          const trialEnd = new Date(data.tenant.trialEndsAt);
          const today = new Date();
          const diffTime = trialEnd.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          setTrialDaysLeft(Math.max(0, diffDays));
        } else if (data.tenant?.subscriptionPlan === 'trial') {
          setTrialDaysLeft(30); // Por defecto 30 días si no hay fecha
        }

      } catch (err) {
        console.error('Error:', err);
        // Si hay error de autenticación, redirigir al login
        if (err instanceof Error && err.message.includes('401')) {
          localStorage.removeItem('token');
          router.push('/auth/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const firstName = user?.fullName?.split(' ')[0] || 'Usuario';
  const planName = tenant?.subscriptionPlan === 'trial' ? 'TRIAL' : 
                   tenant?.subscriptionPlan?.toUpperCase() || 'FREE';

  return (
    <div className="p-8">
      {/* Header con información del tenant y trial */}
      <div className="mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">{tenant?.name || 'Mi Empresa'}</h1>
            <p className="text-indigo-100">{tenant?.name || 'CIDE SAS'}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="text-lg font-semibold">Plan {planName} - {trialDaysLeft} días restantes</span>
            </div>
            <a href="/plans" className="text-sm underline hover:text-indigo-200">Ver Planes</a>
          </div>
        </div>
      </div>

      {/* Título y saludo personalizado */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Fenix SGCN
        </h2>
        <p className="text-gray-600 dark:text-gray-400">Sistema Activo</p>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Bienvenido, {firstName}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Vista consolidada del estado del Sistema de Gestión de Continuidad del Negocio
        </p>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-600 dark:text-gray-400">Procesos Críticos</h3>
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Identificados en BIA</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-600 dark:text-gray-400">Riesgos Altos/Críticos</h3>
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Áreas de tratamiento</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-600 dark:text-gray-400">Planes Desarrollados</h3>
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">0</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Pendientes de aprobación</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-gray-600 dark:text-gray-400">Última Prueba</h3>
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">Sin datos</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Próxima: dentro de 90 días</p>
        </div>
      </div>

      {/* Sección de gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Criticidad de Procesos por RTO
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Tiempo objetivo de recuperación por área
          </p>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500 text-sm">
              No hay datos disponibles. Complete el módulo BIA para ver esta información.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Matriz de Riesgos
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Probabilidad vs Impacto
          </p>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500 text-sm">
              No hay datos disponibles. Complete el módulo ARA para ver esta matriz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
