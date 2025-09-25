'use client';

import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';

interface BiaDependencyMapperProps {
  processId: string;
  processName: string;
  initialDependencies?: any[];
  onSaveDependencies?: (dependencies: any[]) => void;
  readOnly?: boolean;
}

const nodeTypes = {
  process: ({ data }: any) => (
    <div className="px-4 py-3 shadow-lg rounded-lg border-2 border-blue-500 bg-blue-50">
      <div className="font-bold text-sm text-blue-900">{data.label}</div>
      <div className="text-xs text-blue-600 mt-1">Proceso Principal</div>
      {data.rto && (
        <div className="text-xs text-gray-600 mt-1">
          RTO: {data.rto}h | RPO: {data.rpo}h
        </div>
      )}
    </div>
  ),
  application: ({ data }: any) => (
    <div className="px-4 py-2 shadow-md rounded-md border-2 border-purple-500 bg-purple-50">
      <div className="font-semibold text-sm text-purple-900">{data.label}</div>
      <div className="text-xs text-purple-600">Aplicación</div>
    </div>
  ),
  asset: ({ data }: any) => (
    <div className="px-4 py-2 shadow-md rounded-md border-2 border-green-500 bg-green-50">
      <div className="font-semibold text-sm text-green-900">{data.label}</div>
      <div className="text-xs text-green-600">{data.assetType || 'Activo'}</div>
    </div>
  ),
  supplier: ({ data }: any) => (
    <div className="px-4 py-2 shadow-md rounded-md border-2 border-orange-500 bg-orange-50">
      <div className="font-semibold text-sm text-orange-900">{data.label}</div>
      <div className="text-xs text-orange-600">Proveedor</div>
    </div>
  ),
};

export function BiaDependencyMapper({
  processId,
  processName,
  initialDependencies = [],
  onSaveDependencies,
  readOnly = false,
}: BiaDependencyMapperProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedType, setSelectedType] = useState<string>('application');
  const [newNodeName, setNewNodeName] = useState<string>('');

  React.useEffect(() => {
    // Inicializar nodo principal
    const mainNode: Node = {
      id: processId,
      type: 'process',
      position: { x: 400, y: 200 },
      data: {
        label: processName,
      },
    };

    const initialNodes: Node[] = [mainNode];
    const initialEdges: Edge[] = [];

    // Cargar dependencias iniciales
    initialDependencies.forEach((dep, index) => {
      const depNode: Node = {
        id: dep.id || `dep_${index}`,
        type: dep.type?.toLowerCase() || 'asset',
        position: {
          x: 100 + (index % 3) * 250,
          y: 400 + Math.floor(index / 3) * 100,
        },
        data: {
          label: dep.name,
          assetType: dep.assetType,
        },
      };

      initialNodes.push(depNode);

      initialEdges.push({
        id: `${processId}-${dep.id || `dep_${index}`}`,
        source: processId,
        target: dep.id || `dep_${index}`,
        label: 'depende de',
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#6366f1', strokeWidth: 2 },
      });
    });

    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [processId, processName, initialDependencies, setNodes, setEdges]);

  const handleAddDependency = useCallback(() => {
    if (!newNodeName.trim()) return;

    const newNodeId = `${selectedType}_${Date.now()}`;
    const newNode: Node = {
      id: newNodeId,
      type: selectedType,
      position: {
        x: 100 + Math.random() * 600,
        y: 400 + Math.random() * 200,
      },
      data: {
        label: newNodeName,
      },
    };

    const newEdge: Edge = {
      id: `${processId}-${newNodeId}`,
      source: processId,
      target: newNodeId,
      label: 'depende de',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#6366f1', strokeWidth: 2 },
    };

    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
    setNewNodeName('');
  }, [newNodeName, selectedType, processId, setNodes, setEdges]);

  const handleSave = useCallback(() => {
    const dependencies = nodes
      .filter((node) => node.id !== processId)
      .map((node) => ({
        id: node.id,
        name: node.data.label,
        type: node.type?.toUpperCase(),
        assetType: node.data.assetType,
      }));

    if (onSaveDependencies) {
      onSaveDependencies(dependencies);
    }
  }, [nodes, processId, onSaveDependencies]);

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    },
    [setNodes, setEdges]
  );

  return (
    <div className="h-[600px] border rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <Background />

        {!readOnly && (
          <Panel position="top-right" className="bg-white p-4 rounded-lg shadow-lg space-y-3">
            <div className="font-semibold text-sm mb-2">Agregar Dependencia</div>

            <div>
              <label className="text-xs text-gray-600">Tipo:</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full mt-1 px-2 py-1 border rounded text-sm"
              >
                <option value="application">Aplicación</option>
                <option value="asset">Activo</option>
                <option value="supplier">Proveedor</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-600">Nombre:</label>
              <input
                type="text"
                value={newNodeName}
                onChange={(e) => setNewNodeName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddDependency()}
                placeholder="Ej: ERP SAP"
                className="w-full mt-1 px-2 py-1 border rounded text-sm"
              />
            </div>

            <button
              onClick={handleAddDependency}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
            >
              + Agregar
            </button>

            <hr className="my-2" />

            <button
              onClick={handleSave}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded text-sm font-semibold"
            >
              💾 Guardar Dependencias
            </button>
          </Panel>
        )}

        <Panel position="bottom-left" className="bg-white p-3 rounded-lg shadow-md">
          <div className="text-xs font-semibold mb-2">Leyenda:</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Proceso</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span>Aplicación</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Activo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span>Proveedor</span>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
