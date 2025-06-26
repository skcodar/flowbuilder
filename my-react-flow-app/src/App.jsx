import { useState } from 'react'
import { ReactFlow, Controls, Background} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ height: '100vh' }}>
      <ReactFlow>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}

export default App
