import React, { useRef, useCallback, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Background,
  Handle,
  Position,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import Sidebar from './Sidebar';

let id = 1;
const getId = () => `node_${id++}`;

// ✅ Custom Node Component with connection handles
const CustomNode = ({ data }) => {
  return (
    <div style={customNodeStyle}>
      {/* Input handle (top) */}
      <Handle type="target" position={Position.Top} style={handleStyle} />

      <strong style={labelStyle}>{data.label}</strong>

      {/* Output handle (bottom) */}
      <Handle type="source" position={Position.Bottom} style={handleStyle} />
    </div>
  );
};

const handleStyle = {
  width: 5,
  height: 5,
  background: '#555',
  borderRadius: '50%',
};

const customNodeStyle = {
  color: '#000000',
  fontSize: '9px',
  maxWidth: '200px',
  textAlign: 'center',
};

const labelStyle = {
  display: 'inline-block',
  fontWeight: 600,
  whiteSpace: 'pre-wrap',
};

const nodeTypes = {
  input: CustomNode,
  default: CustomNode,
  output: CustomNode,
};

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const [selectedNode, setSelectedNode] = useState(null);
  const [editorPos, setEditorPos] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow') || 'default';
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });

      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `New node` },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [screenToFlowPosition, setNodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setEditorPos({
      x: event.clientX,
      y: event.clientY,
    });
  }, []);

  const updateNode = (field, value) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? {
              ...node,
              type: field === 'type' ? value : node.type,
              data: {
                ...node.data,
                label: field === 'label' ? value : node.data.label,
              },
            }
          : node
      )
    );
    setSelectedNode((prev) =>
      prev
        ? {
            ...prev,
            type: field === 'type' ? value : prev.type,
            data: {
              ...prev.data,
              label: field === 'label' ? value : prev.data.label,
            },
          }
        : null
    );
  };

  const closeEditor = () => {
    setSelectedNode(null);
    setEditorPos(null);
  };

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
      <Sidebar />

      <div ref={reactFlowWrapper} style={{ height: '100%', width: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onConnect={onConnect}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>

      {selectedNode && editorPos && (
        <div
          style={{
            position: 'absolute',
            top: editorPos.y,
            left: editorPos.x,
            transform: 'translate(-50%, -100%)',
            background: '#fff',
            padding: 12,
            border: '1px solid #ccc',
            borderRadius: 8, 
            zIndex: 100,
            minWidth: 200,
          }}
        >
          <div style={fieldWrapper}>
            <label style={labelStyleEditor}>Type:</label>
            <select
              value={selectedNode.type}
              onChange={(e) => updateNode('type', e.target.value)}
              style={option}
            >
              <option value="default">Default</option>
              <option value="input">Input</option>
              <option value="output">Output</option>
            </select>
          </div>

          <div style={fieldWrapper}>
            <label style={labelStyleEditor}>Label:</label>
            <input
              value={selectedNode.data.label}
              onChange={(e) => updateNode('label', e.target.value)}
              style={inputStyle}
            />
          </div>

          <button onClick={closeEditor} style={buttonStyle}>
            Done
          </button>
        </div>
      )}
    </div>
  );
};

// 🔧 Styling for editor panel
const option={
  padding: '6px 8px',
  fontSize: '14px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  width:'100%',

};
const fieldWrapper = {
  marginBottom: '10px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
};

const labelStyleEditor = {
  fontWeight: 'bold',
  fontSize: '14px',
  marginBottom: '4px',
};

const inputStyle = {
  padding: '6px 8px',
  fontSize: '14px',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const buttonStyle = {
  padding: '6px 10px',
  fontSize: '14px',
  borderRadius: '4px',
  backgroundColor: '#2196f3',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
};

export default () => (
  <ReactFlowProvider>
    <DnDFlow />
  </ReactFlowProvider>
);
