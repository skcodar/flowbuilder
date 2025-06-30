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

let id = 1;
const getId = () => `node_${id++}`;

const defaultNodeData = {
  heading: 'Flow Start',
  keywords: '',
  title: 'TryLity Whtsup-Automation',
  description: 'Description',
  image: 'https://www.wati.io/wp-content/uploads/2024/11/WhatsApp-Automation-%E2%80%93-1.png',
};

const Sidebar = () => {
  const [formData, setFormData] = useState(defaultNodeData);
  const [showFields, setShowFields] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleDragStart = (event) => {
    event.dataTransfer.setData('application/reactflow', 'templatecard');
    event.dataTransfer.effectAllowed = 'move';
    sessionStorage.setItem('newNodeData', JSON.stringify(formData));
  };

  return (
    <div style={{ width: '300px', padding: '16px', borderRight: '1px solid #ccc' }}>
      <h3>Create Card Node</h3>
      {showFields && (
        <>
          <input placeholder="Heading" value={formData.heading} onChange={handleChange('heading')} />
          <input placeholder="Keywords" value={formData.keywords} onChange={handleChange('keywords')} />
          <input placeholder="Title" value={formData.title} onChange={handleChange('title')} />
          <textarea placeholder="Description" value={formData.description} onChange={handleChange('description')} />
          <input placeholder="Image URL" value={formData.image} onChange={handleChange('image')} />
        </>
      )}
      <div
        style={{
          marginTop: '10px',
          backgroundColor: '#10b981',
          color: 'white',
          padding: '10px',
          textAlign: 'center',
          cursor: 'grab',
          borderRadius: '6px',
        }}
        onDragStart={handleDragStart}
        draggable
      >
        {showFields ? 'Hide Fields' : 'Drag to Canvas'}
      </div>
    </div>
  );
};

const TemplateCardNode = ({ data = {} }) => {
  const { heading = 'Flow Start', keywords = '', title = '', description = '', image = ''} = data;

  return (
    <div style={{ ...templateCardStyle, position: 'relative' }}>
      {/* Removed left connector */}
      <div style={templateContentStyle}>
        <div style={templateHeaderStyle}>
          <span style={templateHeadingIcon}>🔗</span>
          <span style={templateHeadingText }>{heading}</span>
          <span style={templateToggleIcon}>⬤</span>
        </div>
        <div style={templateInputBox}>Type, press enter to add keyword</div>
        <input type="text" placeholder="Enter keywords" value={keywords} style={templateInputField} disabled />
        <div style={templateInputBox}>Add up to 1 Meta Ads to begin flow</div>

        <div style={templateCardAd}>
          <div style={breakableText}><strong>{title}</strong></div>
          
          <img
            src={image || ''}
            alt="ad preview"
            style={templateAdImage}
          />
          <div style={breakableText}>{description}</div>
          <div style={templateWhatsAppBox}>
            <button style={whatsappButton}>Whatsapp</button>
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} style={handleStyle} />
    </div>
  );
};

// Styles
const handleStyle = {
  width: 5,
  height: 5,
  border:'1px solid #10b981',
  background: '#10b981',
  borderRadius: '50%',
};

const breakableText = {
  padding:'5px',
  whiteSpace: 'normal',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
};

const templateCardStyle = {
  width: 200,
  background: '#fff',
  border: '2px solid #10b981',
  borderRadius: 12,
  padding: '10px',
  fontFamily: 'sans-serif',
};

const templateContentStyle = {
  padding: 8,
};

const templateHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontWeight: 'bold',
  backgroundColor: '#e6f7f1',
  borderRadius: 6,
  padding: '4px 8px',
  marginBottom: 10,
};

const templateHeadingIcon = {
  fontSize: '16px',
};

const templateHeadingText = {
  
  flex: 1,
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: '14px',
  whiteSpace: 'normal',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
};

const templateToggleIcon = {
  fontSize: '12px',
};

const templateInputBox = {
  fontSize: '10px',
  margin: '6px 0 4px',
};

const templateInputField = {
  width: '85%',
  padding: '6px 8px',
  fontSize: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  marginBottom: 10,
  whiteSpace: 'normal',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
};

const templateCardAd = {
  padding:'2px',
  border: '1px solid #ccc',
  borderRadius: 6,
  fontSize: '12px',
  backgroundColor: '#fff',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
};

const templateAdImage = {
  width: '100%',
  height: '300',
  borderRadius: '2px',
  marginBottom: 3,
};

const templateWhatsAppBox = {};

const whatsappTextBox = {
  width: '100%',
  overflowWrap: 'break-word',
  wordBreak: 'break-word',
  whiteSpace: 'normal',
};

const whatsappButton = {
  width: '100%',
  backgroundColor: '#25D366',
  color: 'white',
  border: 'none',
  borderRadius: 6,
  padding: '3px 7px',
  fontSize: '10px',
  whiteSpace: 'nowrap',
};

// Node type map
const nodeTypes = {
  templatecard: TemplateCardNode,
};

const FlowComponent = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const [selectedNode, setSelectedNode] = useState(null);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow') || 'templatecard';
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const data = JSON.parse(sessionStorage.getItem('newNodeData')) || defaultNodeData;

      const newNode = {
        id: getId(),
        type,
        position,
        data,
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
  }, []);

  const handleEditChange = (field, value) => {
    if (!selectedNode) return;
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id ? { ...node, data: { ...node.data, [field]: value } } : node
      )
    );
  };

  const handleSaveEdit = () => {
    setSelectedNode(null);
  };

  const getNodeData = (id) => nodes.find((node) => node.id === id)?.data || defaultNodeData;

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex' }}>
      <Sidebar />
      <div ref={reactFlowWrapper} style={{ height: '100%', flex: 1 }}>
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

      {selectedNode && (
        <div style={{ width: '300px', background: '#fff', borderLeft: '1px solid #ccc', padding: 16, overflowY: 'auto' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Edit Node</h3>
          {['heading', 'keywords', 'title', 'description', 'image'].map((field) => (
            <div key={field} style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '14px' }}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              {field === 'description' ? (
                <textarea
                  value={getNodeData(selectedNode.id)[field] || ''}
                  onChange={(e) => handleEditChange(field, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '14px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    resize: 'vertical',
                    minHeight: '60px',
                  }}
                />
              ) : (
                <input
                  value={getNodeData(selectedNode.id)[field] || ''}
                  onChange={(e) => handleEditChange(field, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '14px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                />
              )}
            </div>
          ))}
          <button
            onClick={handleSaveEdit}
            style={{
              marginTop: '12px',
              padding: '10px 16px',
              backgroundColor: '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <FlowComponent />
  </ReactFlowProvider>
);


