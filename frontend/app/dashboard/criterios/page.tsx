"use client";
import DashboardLayout from "../../../components/DashboardLayout";

export default function CriteriosPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Criterios de Estrategia</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Gestión de criterios y parámetros para estrategias de continuidad</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">Herramienta en desarrollo...</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
