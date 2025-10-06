'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Edit2, X } from 'lucide-react';

interface RiskControl {
  id?: string;
  description: string;
  controlType: string;
  applicationCriteria: string;
  isDocumented: string;
  effectiveness: string;
  automation: string;
  score?: number;
  reductionQuadrants?: number;
}

interface RiskControlsManagerProps {
  riskId: string;
  controls: RiskControl[];
  onControlsChange: (controls: RiskControl[]) => void;
}

export default function RiskControlsManager({ riskId, controls, onControlsChange }: RiskControlsManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingControl, setEditingControl] = useState<RiskControl | null>(null);
  const [formData, setFormData] = useState<Partial<RiskControl>>({
    description: '',
    controlType: 'PREVENTIVE',
    applicationCriteria: 'ALWAYS',
    isDocumented: 'YES',
    effectiveness: 'EFFECTIVE',
    automation: 'AUTOMATIC',
  });

  // Cargar controles existentes
  useEffect(() => {
    if (riskId && controls.length === 0) {
      loadControls();
    }
  }, [riskId]);

  const loadControls = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/risk-controls/by-risk/${riskId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        onControlsChange(data);
      }
    } catch (error) {
      console.error('Error loading controls:', error);
    }
  };

  const calculateScore = (control: Partial<RiskControl>) => {
    let score = 0;

    if (control.controlType === 'PREVENTIVE') score += 10;
    else if (control.controlType === 'DETECTIVE') score += 8;
    else if (control.controlType === 'CORRECTIVE') score += 3;

    if (control.applicationCriteria === 'ALWAYS') score += 10;
    else if (control.applicationCriteria === 'RANDOM') score += 5;

    if (control.isDocumented === 'YES') score += 15;
    else if (control.isDocumented === 'PARTIAL') score += 7;

    if (control.effectiveness === 'EFFECTIVE') score += 50;
    else if (control.effectiveness === 'NEEDS_IMPROVEMENT') score += 25;

    if (control.automation === 'AUTOMATIC') score += 15;
    else if (control.automation === 'MANUAL') score += 10;

    let quadrants = 0;
    if (score >= 81) quadrants = 2;
    else if (score >= 61) quadrants = 1;

    return { score, quadrants };
  };

  const handleEdit = (control: RiskControl) => {
    setEditingControl(control);
    setFormData(control);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingControl(null);
    setFormData({
      description: '',
      controlType: 'PREVENTIVE',
      applicationCriteria: 'ALWAYS',
      isDocumented: 'YES',
      effectiveness: 'EFFECTIVE',
      automation: 'AUTOMATIC',
    });
    setShowForm(false);
  };

  const handleSaveControl = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (editingControl) {
        // Actualizar control existente
        const response = await fetch(`/api/risk-controls/${editingControl.id}`, {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const updated = await response.json();
          onControlsChange(controls.map(c => c.id === updated.id ? updated : c));
          handleCancelEdit();
        }
      } else {
        // Crear nuevo control
        const response = await fetch('/api/risk-controls', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            riskAssessmentId: riskId,
            ...formData,
          }),
        });

        if (response.ok) {
          const newControl = await response.json();
          onControlsChange([...controls, newControl]);
          handleCancelEdit();
        } else {
          const error = await response.json();
          alert(`Error: ${error.message || 'Error al guardar control'}`);
        }
      }
    } catch (error) {
      console.error('Error saving control:', error);
      alert('Error al guardar control');
    }
  };

  const handleRemoveControl = async (controlId: string) => {
    if (!confirm('¿Eliminar este control?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/risk-controls/${controlId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        onControlsChange(controls.filter(c => c.id !== controlId));
      } else {
        alert('Error al eliminar control');
      }
    } catch (error) {
      console.error('Error removing control:', error);
      alert('Error al eliminar control');
    }
  };

  const currentScore = calculateScore(formData);

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'PREVENTIVE': 'Preventivo',
      'DETECTIVE': 'Detectivo',
      'CORRECTIVE': 'Correctivo',
    };
    return labels[type] || type;
  };

  const getEffectivenessLabel = (effectiveness: string) => {
    const labels: { [key: string]: string } = {
      'EFFECTIVE': 'Efectivo',
      'NEEDS_IMPROVEMENT': 'Requiere Mejoras',
      'NOT_EFFECTIVE': 'No Efectivo',
    };
    return labels[effectiveness] || effectiveness;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Controles de Riesgo ({controls.length})</h3>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Agregar Control
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold">
              {editingControl ? 'Editar Control' : 'Nuevo Control'}
            </h4>
            <button onClick={handleCancelEdit} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Control</label>
              <select
                value={formData.controlType}
                onChange={(e) => setFormData({ ...formData, controlType: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="PREVENTIVE">Preventivo (10 pts)</option>
                <option value="DETECTIVE">Detectivo (8 pts)</option>
                <option value="CORRECTIVE">Correctivo (3 pts)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Criterio de Aplicación</label>
              <select
                value={formData.applicationCriteria}
                onChange={(e) => setFormData({ ...formData, applicationCriteria: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="ALWAYS">Siempre (10 pts)</option>
                <option value="RANDOM">Aleatoria (5 pts)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Documentación</label>
              <select
                value={formData.isDocumented}
                onChange={(e) => setFormData({ ...formData, isDocumented: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="YES">Sí (15 pts)</option>
                <option value="PARTIAL">Parcial (7 pts)</option>
                <option value="NO">No (0 pts)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Efectividad</label>
              <select
                value={formData.effectiveness}
                onChange={(e) => setFormData({ ...formData, effectiveness: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="EFFECTIVE">Efectivo (50 pts)</option>
                <option value="NEEDS_IMPROVEMENT">Requiere Mejoras (25 pts)</option>
                <option value="NOT_EFFECTIVE">No Efectivo (0 pts)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Automatización</label>
              <select
                value={formData.automation}
                onChange={(e) => setFormData({ ...formData, automation: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="AUTOMATIC">Automático (15 pts)</option>
                <option value="MANUAL">Manual (10 pts)</option>
              </select>
            </div>
          </div>

          <div className="bg-indigo-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Score Calculado:</span>
              <span className="text-lg font-bold text-indigo-600">{currentScore.score} pts</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm font-medium text-gray-700">Cuadrantes a Reducir:</span>
              <span className="text-lg font-bold text-indigo-600">{currentScore.quadrants}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveControl}
              disabled={!formData.description}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {editingControl ? 'Actualizar' : 'Guardar'} Control
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {controls.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No hay controles registrados. Agrega el primer control para reducir el riesgo.
          </p>
        ) : (
          controls.map((control) => (
            <div key={control.id} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{control.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {getTypeLabel(control.controlType)}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      {getEffectivenessLabel(control.effectiveness)}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                      Score: {control.score} pts
                    </span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                      Reduce: {control.reductionQuadrants} cuadrantes
                    </span>
                  </div>
                </div>
                <div className="ml-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(control)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Editar"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => control.id && handleRemoveControl(control.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Eliminar"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
