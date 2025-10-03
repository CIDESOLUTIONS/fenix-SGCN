"use client";
import React, { useState } from "react";
import { X, Save, Upload } from "lucide-react";
import RichTextEditor from "../RichTextEditor";

interface CreateContextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateContextModal({ isOpen, onClose, onSuccess }: CreateContextModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    elaborationDate: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setUploadedFile(file);
        setError(null);
      } else {
        setError('Solo se permiten archivos PDF');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
      
      let fileUrl = null;
      let fileName = null;
      let fileSize = null;

      // Si hay archivo, intentar subirlo (pero no bloquear si falla)
      if (uploadedFile) {
        try {
          const formDataFile = new FormData();
          formDataFile.append('file', uploadedFile);
          formDataFile.append('category', 'context');

          const uploadRes = await fetch(`${API_URL}/api/documents/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formDataFile,
          });

          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            fileUrl = uploadData.fileUrl;
            fileName = uploadedFile.name;
            fileSize = uploadedFile.size;
          } else {
            console.warn('Error al subir archivo, continuando sin él');
            // No fallar, continuar sin archivo
          }
        } catch (uploadError) {
          console.warn('Error en upload, continuando sin archivo:', uploadError);
          // No fallar, continuar sin archivo
        }
      }

      const response = await fetch(`${API_URL}/api/business-context/contexts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          fileUrl,
          fileName,
          fileSize,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear el contexto');
      }

      onSuccess();
      onClose();
      setFormData({
        title: "",
        description: "",
        content: "",
        elaborationDate: new Date().toISOString().split('T')[0],
      });
      setUploadedFile(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Nuevo Contexto de Negocio
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Título del Contexto *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Ej: Contexto Organizacional 2025"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha de Elaboración
              </label>
              <input
                type="date"
                value={formData.elaborationDate}
                onChange={(e) => setFormData({ ...formData, elaborationDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Descripción breve del contexto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contenido del Contexto *
            </label>
            <textarea
              required
              rows={12}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Redacte aquí el contexto de su organización..."
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Incluya: misión, visión, valores, estructura organizacional, mercado objetivo, productos/servicios, factores externos, etc.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Archivo de Contexto (Opcional)
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
            {uploadedFile && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                ✓ {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(2)} KB)
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              PDF con documentación adicional del contexto organizacional
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              💡 Guía para el Contexto Organizacional
            </h4>
            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
              <li>• <strong>Interno:</strong> Misión, visión, valores, estructura, cultura, capacidades</li>
              <li>• <strong>Externo:</strong> Mercado, competencia, regulaciones, tendencias, stakeholders</li>
              <li>• <strong>Riesgos:</strong> Amenazas y oportunidades del entorno</li>
              <li>• <strong>Objetivos:</strong> Estrategias y metas organizacionales</li>
            </ul>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Crear Contexto
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
