"use client";
import React from "react";
import { FileText, Target, Users } from "lucide-react";

interface KPICardsProps {
  policiesCount: number;
  objectivesCount: number;
  raciStats: {
    responsible: number;
    accountable: number;
    consulted: number;
    informed: number;
  };
}

export default function GovernanceKPICards({ policiesCount, objectivesCount, raciStats }: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Políticas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border-l-4 border-indigo-600">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Políticas del SGCN</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{policiesCount}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Total registradas</p>
          </div>
          <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-lg">
            <FileText className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
      </div>

      {/* Objetivos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border-l-4 border-emerald-600">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Objetivos SMART</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{objectivesCount}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Total definidos</p>
          </div>
          <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg">
            <Target className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </div>

      {/* RACI */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border-l-4 border-purple-600">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Matriz RACI</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900 dark:text-white">{raciStats.responsible}</p>
                <p className="text-xs text-gray-500">Responsables</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900 dark:text-white">{raciStats.accountable}</p>
                <p className="text-xs text-gray-500">Aprobadores</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900 dark:text-white">{raciStats.consulted}</p>
                <p className="text-xs text-gray-500">Consultados</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900 dark:text-white">{raciStats.informed}</p>
                <p className="text-xs text-gray-500">Informados</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg ml-3">
            <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
