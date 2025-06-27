import { useState, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
 
const initialNodes = [
  {
    id: '1',
    data: { label: 'Hello' },
    position: { x: 0, y: 0 },
    type: 'input',
  },
  {
    id: '2',
    data: { label: 'India' },
    position: { x: 100, y: 100 },
  },

  //Third Node


  // {
  //   id: '3',
  //   data: { label: 'World' },
  //   position: { x: 200, y: 200 },     
  // },  
];
 
const initialEdges = [
  { id: '1-2', source: '1', target: '2', label: 'to the', type: 'step' },

  //Third Node Felow
  // { id: '2-3', source: '2', target: '3', label: 'to the', type: 'step' },    
];
 
function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
 
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );
 
  return (
    <div style={{ height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background />        
        <Controls />
      </ReactFlow>
    </div>
  );
}
 
export default App;