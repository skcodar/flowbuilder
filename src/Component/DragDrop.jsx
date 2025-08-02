import React, { useState, useEffect, useCallback } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Background,
  getBezierPath,
  useReactFlow,
} from '@xyflow/react';
import {generateRandom12DigitKey} from './flow/component/useCommanFunction'
import { FaTimes } from 'react-icons/fa';
import '@xyflow/react/dist/style.css';
import FlowStart from './flow/card/FlowStart';
import Sidebar from './Sidebar';
import TextButton from './flow/card/TextButton';
import MediaButton from './flow/card/MediaButton';
import List from './flow/card/List';

const nodeTypes = {
  init: FlowStart,
  textButton: TextButton,
  mediaButton: MediaButton,
  list: List,
};

const snapGrid = [20, 20];
const defaultViewport = { x: 0, y: 0, zoom: 0.9 };

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
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const { setViewport } = useReactFlow();

  const deleteNodeById = (nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
  };

  useEffect(() => {
    setNodes([
      {
        id: '1',
        type: 'init',
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
       const newID=generateRandom12DigitKey();
      const newNode = {
        id: newID,
        type,
        position,
        data: { onDelete: () => deleteNodeById(newID) },
        dragHandle: '.drag-handle__custom',
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

const saveFlow = useCallback(async () => {
  const flow = reactFlowInstance.toObject();

  const updatedNodes = flow.nodes.map((node) => {
    const nodeElement = document.querySelector(`[data-id='${node.id}']`);
    if (!nodeElement) return node;

    const updatedData = { ...node.data };
    const inputs = nodeElement.querySelectorAll('input, textarea');

    inputs.forEach((input) => {
      const key = input.name;
      if (!key) return;
      updatedData[key] = input.value;
    });

    const richEditor = nodeElement.querySelector('[data-role="rich-editor"]');
    if (richEditor) {
      updatedData.plainText = richEditor.innerText;
    }

    return {
      ...node,
      data: updatedData,
    };
  });

  const updatedEdges = flow.edges.map((edge) => {
    const edgeElement = document.querySelector(`[data-edgeid='${edge.id}']`);
    if (!edgeElement) return edge;

    const updatedEdge = { ...edge };

    const labelInput = edgeElement.querySelector('input, textarea, [contenteditable="true"]');
    if (labelInput) {
      const text =
        labelInput.tagName === 'INPUT' || labelInput.tagName === 'TEXTAREA'
          ? labelInput.value
          : labelInput.innerText;

      updatedEdge.label = text;
    }

    return updatedEdge;
  });

  const flowWithUserData = {
    ...flow,
    nodes: updatedNodes,
    edges: updatedEdges,
  };

  localStorage.setItem('my-flow', JSON.stringify(flowWithUserData));

   // ✅ Export JSON file
  // const blob = new Blob([JSON.stringify(flowWithUserData, null, 2)], { type: 'application/json' });
  // const url = URL.createObjectURL(blob);
  // const link = document.createElement('a');
  // link.href = url;
  // link.download = 'my-flow.json';
  // document.body.appendChild(link);
  // link.click();
  // document.body.removeChild(link);
  // URL.revokeObjectURL(url);
}, [reactFlowInstance]);

//  Restore Flow-data
const onRestore = useCallback(() => {
  const restoreFlow = async () => {
    const flow = JSON.parse(localStorage.getItem('my-flow'));

    if (flow) {
      const { x = 0, y = 0, zoom = 1 } = flow.viewport || {};
      const restoredNodes = (flow.nodes || []).map((node) => ({
        ...node,
        data: {
          ...node.data,
          onDelete: () => deleteNodeById(node.id), 
        },
      }));
      const restoredEdges = (flow.edges || []).map((edge) => ({
        ...edge,
        data: {
          ...edge.data,
          onDelete: (id) => setEdges((es) => es.filter((e) => e.id !== id)),
        },
      }));

      setNodes(restoredNodes);
      setEdges(restoredEdges);
      setViewport({ x, y, zoom });
    }
  };

  restoreFlow();
}, [setNodes, setEdges, setViewport]);

  useEffect(() => {
    onRestore()
  }, []);
  
  return (
    <div className="w-screen h-screen flex relative">
      <Sidebar />

      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={saveFlow}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          Save Flow
        </button>
      </div>

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
          onInit={setReactFlowInstance}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default CustomNodeFlow;
