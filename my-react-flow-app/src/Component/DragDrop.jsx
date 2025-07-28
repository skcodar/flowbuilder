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

  const saveFlow = useCallback(async () => {
    try {
      const flow = reactFlowInstance.toObject();

      // STEP 1: Extract data from DOM into updatedNodes
      const updatedNodes = flow.nodes.map((node) => {
        const nodeElement = document.querySelector(`[data-id='${node.id}']`);
        if (!nodeElement) return node;

        const updatedData = { ...node.data };
        const inputs = nodeElement.querySelectorAll('input, textarea');

        inputs.forEach((input) => {
          const key = input.name;
          if (!key) return;

          const cardname = input.getAttribute('data-cardname');
          const inputId = input.id;
          const fullId = `${cardname}-${inputId}`;

          if ((key === 'phoneTitle' || key === 'urlTitle') && cardname && inputId) {
            updatedData[fullId] = [input.value];
          } else if ((key === 'phoneNo' || key === 'url') && cardname && inputId) {
            if (!updatedData[fullId]) updatedData[fullId] = [];
            updatedData[fullId][1] = input.value;
          } else if (key.startsWith('quick-')) {
            updatedData[key] = input.value;
          } else if (key === 'copyCode') {
            updatedData.copyText = input.value;
          } else {
            updatedData[key] = input.value;
          }
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

      const flowWithUserData = {
        ...flow,
        nodes: updatedNodes,
      };

      localStorage.setItem('my-flow', JSON.stringify(flowWithUserData));

      // ✅ 1. Save full flow to main DB
      const fullFlowRes = await fetch('https://app.trylity.com/api/flow/23424342/flow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '12345',
        },
        body: JSON.stringify({
          vendor_id: 8793534524,
          flow_data: flowWithUserData,
        }),
      });

      if (!fullFlowRes.ok) {
        throw new Error(`Flow DB Error: ${fullFlowRes.statusText}`);
      }
      console.log(flowWithUserData);
      console.log('✅ Flow data saved');

      // ✅ 2. Save edges in batch to edges DB
      const edgesData = flow.edges.map((edge) => ({
        source: edge.source,
        target: edge.target,
        type: edge.type || 'default',
        label: edge.label || '',
      }));

      const edgeRes = await fetch('https://app.trylity.com/api/flow/23424342/edges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '12345',
        },
        body: JSON.stringify({
          vendor_id: 8793534524,
          edges_data: edgesData,
        }),
      });

      if (!edgeRes.ok) {
        throw new Error(`Edge DB Error: ${edgeRes.statusText}`);
      }
      console.log(edgesData);
      console.log('✅ Edges saved');

      // ✅ 3. Save each node+next to nodes DB
      for (const edge of flow.edges) {
        const sourceNode = updatedNodes.find((n) => n.id === edge.source);
        if (!sourceNode) continue;

        const payload = {
          vendor_id: 8793534524,
          card_id: parseInt(sourceNode.id), // current node ID
          card_data: sourceNode.data || {},
          next: parseInt(edge.target), // next node ID
        };

        const nodeRes = await fetch('https://app.trylity.com/api/flow/23424342/nodes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': '12345',
          },
          body: JSON.stringify(payload),
        });
        if (!nodeRes.ok) {
          console.warn(`❌ Failed node: ${sourceNode.id} ➜ ${edge.target}`);
        } else {
          console.log(`✅ Node ${sourceNode.id} ➜ ${edge.target} saved`);
        }
      console.log(payload);
      console.log(`✅Node saved`)
      }
      

      console.log('✅ All node & edge records saved');
    } catch (err) {
      console.error('❌ Error saving everything:', err);
    }
  }, [reactFlowInstance]);





  useEffect(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem('my-flow'));

      if (flow) {
        const restoredNodes = flow.nodes.map((node) => ({
          ...node,
          data: {
            ...node.data,
            onDelete: () => deleteNodeById(node.id),
          },
        }));

        setNodes(restoredNodes);
        setEdges(
          (flow.edges || []).map((edge) => ({
            ...edge,
            data: {
              onDelete: (id) => setEdges((es) => es.filter((e) => e.id !== id)),
            },
          }))
        );

        // ✅ Set viewport after short delay
        setTimeout(() => {
          if (flow.viewport) {
            setViewport(flow.viewport); // Set the saved viewport
          }

          flow.nodes.forEach((node) => {
            const nodeElement = document.querySelector(`[data-id='${node.id}']`);
            if (!nodeElement) return;

            const data = node.data || {};
            const inputs = nodeElement.querySelectorAll('input, textarea');

            inputs.forEach((input) => {
              const key = input.name;
              if (!key) return;

              const cardname = input.getAttribute('data-cardname');
              const inputId = input.id;
              const fullId = `${cardname}-${inputId}`;

              if ((key === 'phoneTitle' || key === 'urlTitle') && data[fullId]) {
                if (Array.isArray(data[fullId])) input.value = data[fullId][0] || '';
              } else if ((key === 'phoneNo' || key === 'url') && data[fullId]) {
                if (Array.isArray(data[fullId])) input.value = data[fullId][1] || '';
              } else if (key.startsWith('quick-') && data[key] !== undefined) {
                input.value = data[key];
              } else if (key === 'copyCode' && data.copyText !== undefined) {
                input.value = data.copyText;
              } else if (data[key] !== undefined) {
                input.value = data[key];
              }
            });

            const quickReplyBlocks = nodeElement.querySelectorAll('[data-type="quick-reply-item"]');
            quickReplyBlocks.forEach((block, i) => {
              const input = block.querySelector('input');
              const key = `quick-${i}`;
              if (data[key]) input.value = data[key];
            });

            const copyCode = nodeElement.querySelector('[data-type="copy-code"]');
            if (copyCode && data.copyText !== undefined) {
              const textarea = copyCode.querySelector('textarea') || copyCode.querySelector('input');
              if (textarea) textarea.value = data.copyText;
            }

            const richEditor = nodeElement.querySelector('[data-role="rich-editor"]');
            if (richEditor && data.plainText !== undefined) {
              richEditor.innerText = data.plainText;
            }
          });
        }, 0);
      }
    };

    restoreFlow();
  }, [setNodes, setEdges, setViewport]);

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
