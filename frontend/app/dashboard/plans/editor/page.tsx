'use client';

import { useState } from 'react';
import { Save, Eye, Send, Plus } from 'lucide-react';

export default function PlanEditorPage() {
  const [planName, setPlanName] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editor de Planes</h1>
          <p className="text-gray-500 mt-1">Crea y edita planes de continuidad</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Save className="w-4 h-4" />
            Guardar
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p>Editor de planes - En construcción</p>
      </div>
    </div>
  );
}
