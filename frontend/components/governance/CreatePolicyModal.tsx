"use client";
import React, { useState } from "react";
import { X, Save } from "lucide-react";

interface CreatePolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreatePolicyModal({ isOpen, onClose, onSuccess }: CreatePolicyModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    version: "1.0",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          formDataFile.append('category', 'policy');

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
          }
        } catch (uploadError) {
          console.warn('Error en upload, continuando sin archivo:', uploadError);
        }
      }

      const response = await fetch(`${API_URL}/api/governance/policies`, {
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
        throw new Error('Error al crear la política');
      }

      onSuccess();
      onClose();
      setFormData({ title: "", content: "", version: "1.0" });
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Nueva Política del SGCN
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

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título de la Política *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Ej: Política de Continuidad de Negocio"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Versión
            </label>
            <input
              type="text"
              value={formData.version}
              onChange={(e) => setFormData({ ...formData, version: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contenido de la Política *
            </label>
            <textarea
              required
              rows={12}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Redacte aquí el contenido de la política conforme a ISO 22301 Cláusula 5.2..."
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Incluya: Alcance, compromisos de la alta dirección, objetivos de continuidad, y compromiso con la mejora continua
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Archivo de Política (Opcional)
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
              PDF con el documento de política completo
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
              💡 Plantilla Sugerida ISO 22301
            </h4>
            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Objetivo y alcance del SGCN</li>
              <li>• Compromiso de la alta dirección</li>
              <li>• Marco de objetivos de continuidad</li>
              <li>• Compromiso con el cumplimiento de requisitos</li>
              <li>• Compromiso con la mejora continua</li>
            </ul>
          </div>

          {/* Botón de submit dentro del form */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
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
                  Crear Política
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
