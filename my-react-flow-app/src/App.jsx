import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import DragDrop from './Component/DragDrop';
function App() {


  return (
    <div>
      <ReactFlowProvider>
        <DragDrop />
      </ReactFlowProvider>
    </div>
  );
}

export default App;