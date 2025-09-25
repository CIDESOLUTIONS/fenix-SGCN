'use client';

import React, { useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

interface DependencyMapProps {
  data: any;
  onNodeClick?: (nodeId: string) => void;
}

const nodeTypes = {
  process: ({ data }: any) => (
    <div className={`px-4 py-2 shadow-md rounded-md border-2 ${
      data.criticality === 'CRITICAL' ? 'border-red-500 bg-red-50' :
      data.criticality === 'HIGH' ? 'border-orange-500 bg-orange-50' :
      'border-blue-500 bg-blue-50'
    }`}>
      <div className="font-bold text-sm">{data.label}</div>
      <div className="text-xs text-gray-600">{data.nodeType}</div>
      {data.rto && (
        <div className="text-xs text-gray-500 mt-1">
          RTO: {data.rto}h | RPO: {data.rpo}h
        </div>
      )}
    </div>
  ),
  asset: ({ data }: any) => (
    <div className="px-4 py-2 shadow-md rounded-md border-2 border-purple-500 bg-purple-50">
      <div className="font-bold text-sm">{data.label}</div>
      <div className="text-xs text-gray-600">{data.type}</div>
    </div>
  ),
};

export function DependencyMap({ data, onNodeClick }: DependencyMapProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  React.useEffect(() => {
    if (!data) return;

    const processedNodes: Node[] = [];
    const processedEdges: Edge[] = [];
    const nodeMap = new Map();

    // Procesar el nodo principal
    if (data.node && data.node.length > 0) {
      const mainNode = data.node[0];
      
      const mainNodeObj: Node = {
        id: mainNode.id,
        type: mainNode.nodeType === 'BusinessProcess' ? 'process' : 'asset',
        position: { x: 400, y: 50 },
        data: {
          label: mainNode.name,
          nodeType: mainNode.nodeType,
          criticality: mainNode.criticality,
          rto: mainNode.rto,
          rpo: mainNode.rpo,
        },
      };

      processedNodes.push(mainNodeObj);
      nodeMap.set(mainNode.id, mainNodeObj);

      // Procesar dependencias (downstream)
      if (mainNode.dependsOn && mainNode.dependsOn.length > 0) {
        mainNode.dependsOn.forEach((dep: any, index: number) => {
          const depNode: Node = {
            id: dep.id,
            type: dep.nodeType === 'BusinessProcess' ? 'process' : 'asset',
            position: { x: 200 + (index * 250), y: 200 },
            data: {
              label: dep.name,
              nodeType: dep.nodeType,
              criticality: dep.criticality,
            },
          };

          processedNodes.push(depNode);
          nodeMap.set(dep.id, depNode);

          processedEdges.push({
            id: `${mainNode.id}-${dep.id}`,
            source: mainNode.id,
            target: dep.id,
            label: 'depends on',
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { stroke: '#6366f1', strokeWidth: 2 },
          });
        });
      }

      // Procesar impacto (upstream)
      if (mainNode.requiredBy && mainNode.requiredBy.length > 0) {
        mainNode.requiredBy.forEach((req: any, index: number) => {
          if (!nodeMap.has(req.id)) {
            const reqNode: Node = {
              id: req.id,
              type: req.nodeType === 'BusinessProcess' ? 'process' : 'asset',
              position: { x: 200 + (index * 250), y: -100 },
              data: {
                label: req.name,
                nodeType: req.nodeType,
                criticality: req.criticality,
              },
            };

            processedNodes.push(reqNode);
            nodeMap.set(req.id, reqNode);
          }

          processedEdges.push({
            id: `${req.id}-${mainNode.id}`,
            source: req.id,
            target: mainNode.id,
            label: 'requires',
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { stroke: '#f59e0b', strokeWidth: 2 },
          });
        });
      }
    }

    setNodes(processedNodes);
    setEdges(processedEdges);
  }, [data, setNodes, setEdges]);

  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (onNodeClick) {
        onNodeClick(node.id);
      }
    },
    [onNodeClick]
  );

  if (!data || !data.node || data.node.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500">No hay datos de dependencias disponibles</p>
      </div>
    );
  }

  return (
    <div className="h-96 border rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
