import React, { useState, useEffect, useCallback } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Background,
  getBezierPath,
} from '@xyflow/react';
import { FaTimes } from 'react-icons/fa';

import '@xyflow/react/dist/style.css';
import FlowStart from './flow/card/FlowStart';
import Sidebar from './Sidebar';
import TextButton from './flow/card/TextButton';
import MediaButton from './flow/card/MediaButton';
import List from './flow/card/List';

const nodeTypes = {
  customInput: FlowStart,
  textButton: TextButton,
  mediaButton: MediaButton,
  list: List,
};

const snapGrid = [20, 20];
const defaultViewport = { x: 0, y: 0, zoom: 1 };

// ✅ Custom edge with delete icon
const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const handleDelete = (e) => {
    e.stopPropagation();
    if (data?.onDelete) data.onDelete(id);
  };

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={30}
        height={30}
        x={labelX - 15}
        y={labelY - 15}
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div
          onClick={handleDelete}
          style={{
            width: '100%',
            height: '100%',
            background: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: '1px solid lightgray',
            boxShadow: '0 0 2px rgba(0,0,0,0.2)',
          }}
        >
          <FaTimes color="red" size={12} />
        </div>
      </foreignObject>
    </>
  );
};

const edgeTypes = {
  custom: CustomEdge,
};

const CustomNodeFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // ✅ Delete node by ID
  const deleteNodeById = (nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
  };

  // ✅ Add default node on mount
  useEffect(() => {
    setNodes([
      {
        id: '1',
        type: 'customInput',
        position: { x: 40, y: 60 },
        data: { onDelete: () => deleteNodeById('1') },
        dragHandle: '.drag-handle__custom',
      },
    ]);
  }, []);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'custom',
            animated: true,
            data: {
              onDelete: (id) =>
              setEdges((es) => es.filter((e) => e.id !== id)),
            },
          },
          eds
        )
      ),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const reactFlowBounds = event.target.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const id = `${+new Date()}`;
      const newNode = {
        id,
        type,
        position,
        data: { onDelete: () => deleteNodeById(id) },
        dragHandle: '.drag-handle__custom',
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  return (
    <div className="w-screen h-screen flex relative">
      <Sidebar />

      <div className="flex-1" onDrop={onDrop} onDragOver={onDragOver}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          snapGrid={snapGrid}
          defaultViewport={defaultViewport}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default CustomNodeFlow;
