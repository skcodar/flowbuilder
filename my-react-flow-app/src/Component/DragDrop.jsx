import React, { useState, useEffect, useCallback } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Background,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import ColorSelectorNode from './CustomInputNode';
import CustomInputNode from './CustomInputNode'; // 👈 New node

const initBgColor = '#c9f1dd';
const snapGrid = [20, 20];

// ✅ Register all custom nodes here
const nodeTypes = {
  selectorNode: ColorSelectorNode,
  customInput: CustomInputNode, // 👈 new type for node 1
};

const defaultViewport = { x: 0, y: 0, zoom: 1.5 };

const CustomNodeFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [bgColor, setBgColor] = useState(initBgColor);

  useEffect(() => {
    const onChange = (event) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id !== '2') return node;

          const color = event.target.value;
          setBgColor(color);

          return {
            ...node,
            data: {
              ...node.data,
              color,
            },
          };
        })
      );
    };

    setNodes([
      {
        id: '1',
        type: 'customInput', // 👈 changed from 'input' to your custom type
        data: {},
        position: { x: 0, y: 50 },
      },
    //   {
    //     id: '2',
    //     type: 'selectorNode',
    //     data: { onChange: onChange, color: initBgColor },
    //     position: { x: 300, y: 50 },
    //   },
    //   {
    //     id: '3',
    //     type: 'output',
    //     data: { label: 'Output A' },
    //     position: { x: 650, y: 25 },
    //     targetPosition: 'left',
    //   },
    //   {
    //     id: '4',
    //     type: 'output',
    //     data: { label: 'Output B' },
    //     position: { x: 650, y: 100 },
    //     targetPosition: 'left',
    //   },
    //   {
    //     id: '5',
    //     type: 'output',
    //     data: { label: 'Output C' },
    //     position: { x: 650, y: 50 },
    //     targetPosition: 'left',
    //   },
     ]);
  }, []);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    []
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        snapToGrid={true}
        snapGrid={snapGrid}
        defaultViewport={defaultViewport}
        fitView
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default CustomNodeFlow;
