"use client";
import React, { useState, useEffect } from "react";
import { X, Save, Send, Calendar, Upload, FileText, Trash2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import RichTextEditor from "../RichTextEditor";

interface EditContextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  context: {
    id: string;
    title: string;
    description?: string;
    content: string;
    elaborationDate: string;
    status: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
  } | null;
}

export default function EditContextModal({ isOpen, onClose, onSuccess, context }: EditContextModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    elaborationDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);

  useEffect(() => {
    if (context) {
      setFormData({
        title: context.title,
        description: context.description || "",
        content: context.content,
        elaborationDate: context.elaborationDate.split('T')[0],
      });
    }
  }, [context]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context) return;
    
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
      
      let fileUrl = context.fileUrl;
      let fileName = context.fileName;
      let fileSize = context.fileSize;

      // Si hay un nuevo archivo, subirlo primero
      if (uploadedFile) {
        setUploadProgress(true);
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
          }
        } catch (uploadError) {
          console.warn('Error al subir archivo:', uploadError);
        } finally {
          setUploadProgress(false);
        }
      }

      const response = await fetch(`${API_URL}/api/business-context/contexts/${context.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          fileUrl,
          fileName,
          fileSize
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar contexto');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!context) return;
    if (!confirm('¿Enviar contexto a aprobación? No podrá editarlo después.')) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';

      const response = await fetch(`${API_URL}/api/business-context/contexts/${context.id}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al enviar a aprobación');
      }

      alert('Contexto enviado a aprobación exitosamente');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !context) return null;

  const canEdit = context.status === 'DRAFT';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Editar Contexto
            </h2>
            <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
              context.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' : 
              context.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
              'bg-yellow-100 text-yellow-800'
            }`}>
              {context.status === 'DRAFT' ? 'Borrador' : context.status === 'APPROVED' ? 'Aprobado' : 'En Revisión'}
            </span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {!canEdit && (
          <div className="mx-6 mt-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm">
            Este contexto ya no puede editarse porque está en estado: {context.status}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título del Contexto *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              disabled={!canEdit}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Ej: Contexto Organizacional 2025"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción Breve
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              disabled={!canEdit}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Breve resumen del contexto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Fecha de Elaboración *
            </label>
            <input
              type="date"
              value={formData.elaborationDate}
              onChange={(e) => setFormData(prev => ({ ...prev, elaborationDate: e.target.value }))}
              required
              disabled={!canEdit}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contenido del Contexto *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              required
              disabled={!canEdit}
              rows={12}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-600 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Describa el contexto interno y externo de la organización..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Incluya: propósito, objetivos estratégicos, partes interesadas, requisitos legales, etc.
            </p>
          </div>

          {/* Documentos Adjuntos */}
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-indigo-900 dark:text-indigo-100 mb-3">📎 Documentos Adjuntos</h4>
            
            {/* Archivo existente */}
            {context?.fileName && (
              <div className="mb-3 flex items-center justify-between bg-white dark:bg-gray-700 p-3 rounded-lg border border-indigo-200 dark:border-indigo-700">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <a 
                    href={context.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {context.fileName}
                  </a>
                  {context.fileSize && (
                    <span className="text-xs text-gray-500">({(context.fileSize / 1024).toFixed(2)} KB)</span>
                  )}
                </div>
                {canEdit && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm('¿Eliminar este documento?')) {
                        try {
                          const token = localStorage.getItem('token');
                          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost'}/api/business-context/contexts/${context.id}/remove-file`, {
                            method: 'DELETE',
                            headers: { 'Authorization': `Bearer ${token}` },
                          });
                          if (response.ok) {
                            alert('✓ Documento eliminado');
                            onSuccess();
                            onClose();
                          }
                        } catch (error) {
                          alert('Error al eliminar documento');
                        }
                      }
                    }}
                    className="text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
            
            {/* Subir nuevo archivo */}
            {canEdit && (
              <div>
                <label className="block">
                  <div className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-indigo-300 dark:border-indigo-700 rounded-lg hover:border-indigo-500 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-sm text-indigo-600 dark:text-indigo-400">
                      {uploadedFile ? uploadedFile.name : (context?.fileName ? 'Reemplazar documento' : 'Adjuntar documento PDF')}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.type === 'application/pdf') {
                          setUploadedFile(file);
                          setError(null);
                        } else {
                          setError('Solo se permiten archivos PDF');
                          setUploadedFile(null);
                        }
                      }
                    }}
                    className="hidden"
                  />
                </label>
                {uploadedFile && (
                  <div className="mt-2 flex items-center justify-between text-sm text-green-600 dark:text-green-400">
                    <span>✓ Archivo seleccionado: {uploadedFile.name}</span>
                    <button
                      type="button"
                      onClick={() => setUploadedFile(null)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  📄 El documento se subirá al guardar los cambios
                </p>
              </div>
            )}
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          
          {canEdit && (
            <>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              
              <button
                type="button"
                onClick={handleApprove}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                Enviar a Aprobación
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
