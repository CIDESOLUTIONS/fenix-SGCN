"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Send, FileText, Clock } from "lucide-react";

interface Policy {
  id: string;
  title: string;
  content: string;
  version: string;
  status: string;
  approvedAt: string | null;
  approvedBy: string | null;
  publishedAt: string | null;
  createdAt: string;
}

export default function PolicyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchPolicy(params.id as string);
    }
  }, [params.id]);

  const fetchPolicy = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';

      const response = await fetch(`${API_URL}/api/governance/policies/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setPolicy(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!policy || !confirm('¿Aprobar esta política?')) return;

    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';

      const response = await fetch(`${API_URL}/api/governance/policies/${policy.id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ comments: 'Política aprobada' }),
      });

      if (response.ok) {
        alert('Política aprobada exitosamente');
        fetchPolicy(policy.id);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al aprobar política');
    }
  };

  const handlePublish = async () => {
    if (!policy || !confirm('¿Publicar esta política para toda la organización?')) return;

    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';

      const response = await fetch(`${API_URL}/api/governance/policies/${policy.id}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Política publicada exitosamente');
        fetchPolicy(policy.id);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al publicar política');
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="p-8">
        <p className="text-gray-600">Política no encontrada</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard/planeacion"
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Políticas
          </Link>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {policy.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span>Versión {policy.version}</span>
                <span>•</span>
                <span>Creado: {new Date(policy.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              policy.status === 'ACTIVE' 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                : policy.status === 'APPROVED'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : policy.status === 'REVIEW'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
            }`}>
              {policy.status === 'ACTIVE' ? 'Activo' : 
               policy.status === 'APPROVED' ? 'Aprobado' :
               policy.status === 'REVIEW' ? 'En Revisión' : 'Borrador'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Acciones
          </h2>
          <div className="flex gap-3">
            {policy.status === 'REVIEW' && (
              <button
                onClick={handleApprove}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                <CheckCircle className="w-4 h-4" />
                Aprobar Política
              </button>
            )}
            {policy.status === 'APPROVED' && (
              <button
                onClick={handlePublish}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Send className="w-4 h-4" />
                Publicar Política
              </button>
            )}
            {policy.status === 'ACTIVE' && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Política publicada y activa</span>
              </div>
            )}
          </div>
        </div>

        {/* Metadata */}
        {(policy.approvedAt || policy.publishedAt) && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Historial
            </h2>
            <div className="space-y-3">
              {policy.approvedAt && (
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Aprobado el {new Date(policy.approvedAt).toLocaleDateString()}
                    {policy.approvedBy && ` por ${policy.approvedBy}`}
                  </span>
                </div>
              )}
              {policy.publishedAt && (
                <div className="flex items-center gap-3 text-sm">
                  <Send className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Publicado el {new Date(policy.publishedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Contenido de la Política
            </h2>
          </div>
          <div className="prose dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
              {policy.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
